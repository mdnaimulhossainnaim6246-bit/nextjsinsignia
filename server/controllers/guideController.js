import mongoose from 'mongoose';
import Guide from '../models/Guide.js';
import imagekit from '../configs/imageKit.js';

// Helper to upload a single file buffer to ImageKit
async function uploadImage(file) {
  try {
    const uploadResponse = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: "/guides",
    });
    return imagekit.url({
      path: uploadResponse.filePath,
      transformation: [{ quality: "auto" }, { format: "webp" }],
    });
  } catch (error) {
    console.error("ImageKit Upload Error:", error);
    throw new Error(`Image upload failed for ${file.originalname}: ${error.message}`);
  }
}

// Main handler for creating a new guide
const createGuide = async (req, res) => {
  try {
    if (!req.body.guide) {
      return res.status(400).json({ success: false, message: 'Guide data missing' });
    }

    let guideData;
    try {
      guideData = JSON.parse(req.body.guide);
    } catch (e) {
      return res.status(400).json({ success: false, message: "Invalid JSON format in 'guide' data" });
    }

    const files = req.files.reduce((acc, file) => {
      acc[file.fieldname] = (acc[file.fieldname] || []).concat(file);
      return acc;
    }, {});

    if (!files.image || !files.image[0]) {
      return res.status(400).json({ success: false, message: 'Main thumbnail image is required' });
    }
    guideData.image = await uploadImage(files.image[0]);

    if (files.imageGallery && files.imageGallery.length > 0) {
      const galleryUrls = await Promise.all(files.imageGallery.map(uploadImage));
      const newImageAlts = guideData.newImageAlts || [];
      guideData.imageGallery = galleryUrls.map((url, i) => ({
        url,
        fileName: files.imageGallery[i].originalname,
        alt: newImageAlts[i] || '',
      }));
      delete guideData.newImageAlts;
    }
    
    // imageUrls is already in guideData and needs no special processing

    if (guideData.dynamicContent && guideData.dynamicContent.length > 0) {
      for (let i = 0; i < guideData.dynamicContent.length; i++) {
        const block = guideData.dynamicContent[i];
        if (typeof block.image === 'string' && block.image.startsWith('dynamic_image_')) {
          const fileKey = block.image;
          if (files[fileKey] && files[fileKey][0]) {
            block.image = await uploadImage(files[fileKey][0]);
          }
        }
      }
    }

    const { seoData, ...restOfGuideData } = guideData;

    await Guide.create({
      ...restOfGuideData,
      seotitle: seoData?.seotitle,
      seodescription: seoData?.seodescription,
      seokeywords: seoData?.seokeywords,
    });

    return res.status(201).json({ success: true, message: 'Guide added successfully' });

  } catch (error) {
    console.error("Add Guide Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Main handler for updating a guide
const updateGuide = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    if (!req.body.guide) {
      return res.status(400).json({ success: false, message: 'Guide data missing' });
    }

    const guideData = JSON.parse(req.body.guide);
    const { seoData, ...restOfGuideData } = guideData;
    const updatePayload = { ...restOfGuideData };

    if (seoData) {
      updatePayload.seotitle = seoData.seotitle;
      updatePayload.seodescription = seoData.seodescription;
      updatePayload.seokeywords = seoData.seokeywords;
    }
    
    const files = req.files.reduce((acc, file) => {
      acc[file.fieldname] = (acc[file.fieldname] || []).concat(file);
      return acc;
    }, {});

    if (files.image && files.image[0]) {
      updatePayload.image = await uploadImage(files.image[0]);
    }

    // imageUrls is already in guideData

    let updatedGallery = guideData.imageGallery || [];
    if (files.imageGallery && files.imageGallery.length > 0) {
      const newGalleryUrls = await Promise.all(files.imageGallery.map(uploadImage));
      const newImageAlts = guideData.newImageAlts || [];
      const newFilesWithData = newGalleryUrls.map((url, i) => ({
        url,
        fileName: files.imageGallery[i].originalname,
        alt: newImageAlts[i] || '',
      }));
      updatedGallery = updatedGallery.concat(newFilesWithData);
    }
    updatePayload.imageGallery = updatedGallery;
    if (updatePayload.newImageAlts) {
        delete updatePayload.newImageAlts;
    }

    if (updatePayload.dynamicContent && updatePayload.dynamicContent.length > 0) {
      const oldGuide = await Guide.findById(id);
      updatePayload.dynamicContent = await Promise.all(
        updatePayload.dynamicContent.map(async (block) => {
          if (typeof block.image === 'string' && block.image.startsWith('dynamic_image_')) {
            const fileKey = block.image;
            if (files[fileKey] && files[fileKey][0]) {
              block.image = await uploadImage(files[fileKey][0]);
            } else {
              const oldBlock = oldGuide.dynamicContent.find(b => b._id?.toString() === block._id?.toString());
              block.image = oldBlock ? oldBlock.image : "";
            }
          }
          return block;
        })
      );
    }
    
    const updatedGuide = await Guide.findByIdAndUpdate(id, { $set: updatePayload }, { new: true });

    if (!updatedGuide) {
        return res.status(404).json({ success: false, message: "Guide not found during update" });
    }

    return res.status(200).json({ success: true, message: 'Guide updated successfully' });

  } catch (error) {
    console.error("Update Guide Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getGuideById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const guide = await Guide.findById(id);
    if (!guide) {
      return res.status(404).json({ success: false, message: 'Guide not found' });
    }
    return res.json({ success: true, guide: guide });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getGuideBySlug = async (req, res) => {
    try {
      const { slug } = req.params;
      // Fetch all published guides
      const guides = await Guide.find({ isPublished: true });
      
      // Find the guide that matches the slug
      const guide = guides.find(g => {
        const generatedSlug = (g.title || '')
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9\-]/g, '');
        return generatedSlug === slug;
      });
  
      if (!guide) {
        return res.status(404).json({ success: false, message: 'Guide not found' });
      }
  
      return res.json({ success: true, guide: guide });
    } catch (error) {
      console.error("Get Guide By Slug Error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

const deleteGuideById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const deletedGuide = await Guide.findByIdAndDelete(id);
    if (!deletedGuide) {
      return res.status(404).json({ success: false, message: 'Guide not found' });
    }
    return res.json({ success: true, message: 'Guide deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const togglePublishGuide = async (req, res) => {
  try {
    const { id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const guide = await Guide.findById(id);
    if (!guide) {
      return res.status(404).json({ success: false, message: 'Guide not found' });
    }
    guide.isPublished = !guide.isPublished;
    await guide.save();
    return res.status(200).json({
      success: true,
      message: `Guide ${guide.isPublished ? 'published' : 'unpublished'} successfully.`,
      isPublished: guide.isPublished,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllGuides = async (req, res) => {
  try {
    const { showAll } = req.query;
    const filter = {};
    if (!showAll || showAll !== 'true') {
      filter.isPublished = true;
    }
    const guides = await Guide.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, guides });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteManyGuides = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or empty IDs array' });
    }
    const result = await Guide.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'No guides found to delete' });
    }
    return res.json({ success: true, message: 'Selected guides deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createGuide,
  updateGuide,
  getAllGuides,
  getGuideById,
  getGuideBySlug,
  deleteGuideById,
  togglePublishGuide,
  deleteManyGuides,
};
