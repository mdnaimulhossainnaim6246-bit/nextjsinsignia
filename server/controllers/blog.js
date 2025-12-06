import mongoose from 'mongoose';
import Blog from '../models/blog.js';
import imagekit from '../configs/imageKit.js';

// Helper to upload a single file buffer to ImageKit
async function uploadImage(file) {
  try {
    const uploadResponse = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: "/blogs",
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

// Main handler for creating a new blog post
const addBlog = async (req, res) => {
  try {
    if (!req.body.blog) {
      return res.status(400).json({ success: false, message: 'Blog data missing' });
    }

    let blogData;
    try {
      blogData = JSON.parse(req.body.blog);
      console.log("Received blog data for creation:", blogData);
    } catch (e) {
      return res.status(400).json({ success: false, message: "Invalid JSON format in 'blog' data" });
    }

    const files = req.files.reduce((acc, file) => {
      acc[file.fieldname] = (acc[file.fieldname] || []).concat(file);
      return acc;
    }, {});

    if (!files.image || !files.image[0]) {
      return res.status(400).json({ success: false, message: 'Main thumbnail image is required' });
    }
    blogData.image = await uploadImage(files.image[0]);

    if (files.travelersPhoto && files.travelersPhoto[0]) {
      blogData.travelersPhoto = await uploadImage(files.travelersPhoto[0]);
    }
    // travelersName is already in blogData from JSON.parse(req.body.blog)

    if (files.imageGallery && files.imageGallery.length > 0) {
      const galleryUrls = await Promise.all(files.imageGallery.map(uploadImage));
      const newImageAlts = blogData.newImageAlts || [];
      blogData.imageGallery = galleryUrls.map((url, i) => ({
        url,
        fileName: files.imageGallery[i].originalname,
        alt: newImageAlts[i] || '', // Use the alt text, or empty string
      }));
      delete blogData.newImageAlts; // Clean up the temporary field
    }

    if (blogData.dynamicContent && blogData.dynamicContent.length > 0) {
      for (let i = 0; i < blogData.dynamicContent.length; i++) {
        const block = blogData.dynamicContent[i];
        if (typeof block.image === 'string' && block.image.startsWith('dynamic_image_')) {
          const fileKey = block.image;
          if (files[fileKey] && files[fileKey][0]) {
            block.image = await uploadImage(files[fileKey][0]);
          }
        }
      }
    }

    const { seoData, ...restOfBlogData } = blogData;

    await Blog.create({
      ...restOfBlogData,
      seotitle: seoData?.seotitle,
      seodescription: seoData?.seodescription,
      seokeywords: seoData?.seokeywords,
    });

    return res.status(201).json({ success: true, message: 'Blog added successfully' });

  } catch (error) {
    console.error("Add Blog Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Main handler for updating a blog post
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const oldBlog = await Blog.findById(id);
    if (!oldBlog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    if (!req.body.blog) {
      return res.status(400).json({ success: false, message: 'Blog data missing' });
    }

    const blogData = JSON.parse(req.body.blog);
    console.log("Received blog data for update:", blogData);
    
    const { seoData, ...restOfBlogData } = blogData;
    const updatePayload = { ...restOfBlogData };

    if (seoData) {
      updatePayload.seotitle = seoData.seotitle;
      updatePayload.seodescription = seoData.seodescription;
      updatePayload.seokeywords = seoData.seokeywords;
    }
    
    const files = req.files.reduce((acc, file) => {
      acc[file.fieldname] = (acc[file.fieldname] || []).concat(file);
      return acc;
    }, {});

    // --- Image Processing ---
    if (files.image && files.image[0]) {
      updatePayload.image = await uploadImage(files.image[0]);
    }
    if (files.travelersPhoto && files.travelersPhoto[0]) {
      updatePayload.travelersPhoto = await uploadImage(files.travelersPhoto[0]);
    } else if (blogData.travelersPhoto === null) { // If frontend explicitly sends null, remove it
      updatePayload.travelersPhoto = null;
    } else if (oldBlog.travelersPhoto && !blogData.travelersPhoto) { // Keep old if not provided in new data
      updatePayload.travelersPhoto = oldBlog.travelersPhoto;
    }

    // travelersName is already in blogData from JSON.parse(req.body.blog)
    updatePayload.travelersName = blogData.travelersName;

    let updatedGallery = blogData.imageGallery || []; // This now contains existing images with their alt text
    if (files.imageGallery && files.imageGallery.length > 0) {
      const newGalleryUrls = await Promise.all(files.imageGallery.map(uploadImage));
      const newImageAlts = blogData.newImageAlts || [];
      const newFilesWithData = newGalleryUrls.map((url, i) => ({
        url,
        fileName: files.imageGallery[i].originalname,
        alt: newImageAlts[i] || '', // Use the alt text
      }));
      updatedGallery = updatedGallery.concat(newFilesWithData);
    }
    updatePayload.imageGallery = updatedGallery;
    if (updatePayload.newImageAlts) {
        delete updatePayload.newImageAlts; // Clean up
    }

    if (updatePayload.dynamicContent && updatePayload.dynamicContent.length > 0) {
      updatePayload.dynamicContent = await Promise.all(
        updatePayload.dynamicContent.map(async (block) => {
          if (typeof block.image === 'string' && block.image.startsWith('dynamic_image_')) {
            const fileKey = block.image;
            if (files[fileKey] && files[fileKey][0]) {
              block.image = await uploadImage(files[fileKey][0]);
            } else {
              const oldBlock = oldBlog.dynamicContent.find(b => b._id?.toString() === block._id?.toString());
              block.image = oldBlock ? oldBlock.image : "";
            }
          }
          return block;
        })
      );
    }
    
    const updatedBlog = await Blog.findByIdAndUpdate(id, { $set: updatePayload }, { new: true });

    if (!updatedBlog) {
        return res.status(404).json({ success: false, message: "Blog not found during update" });
    }

    return res.status(200).json({ success: true, message: 'Blog updated successfully' });

  } catch (error) {
    console.error("Update Blog Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    return res.json({ success: true, blog: blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    return res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const togglePublishBlog = async (req, res) => {
  try {
    const { id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    blog.isPublished = !blog.isPublished;
    await blog.save();
    return res.status(200).json({
      success: true,
      message: `Blog ${blog.isPublished ? 'published' : 'unpublished'} successfully.`,
      isPublished: blog.isPublished,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const { showAll } = req.query;
    const filter = {};
    if (!showAll || showAll !== 'true') {
      filter.isPublished = true;
    }
    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, blogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteManyBlogs = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or empty IDs array' });
    }
    const result = await Blog.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'No blogs found to delete' });
    }
    return res.json({ success: true, message: 'Selected blogs deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  addBlog,
  updateBlog,
  getAllBlogs,
  getBlogById,
  deleteBlogById,
  togglePublishBlog,
  deleteManyBlogs,
};
