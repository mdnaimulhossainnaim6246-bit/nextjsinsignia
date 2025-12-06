
// server/controller/packagesController.js
import mongoose from 'mongoose';
import imagekit from '../configs/imageKit.js';
import Packages from '../models/packages.js';

// Helper: Upload image buffer to ImageKit and return filePath
async function uploadImage(file) {
  try {
    const uploadResponse = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: "/packages",
    });
    return imagekit.url({
      path: uploadResponse.filePath,
      transformation: [{ quality: "auto" }, { format: "webp" }],
    });
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
}

// Add Package
export const addPackages = async (req, res) => {
  try {
    if (!req.body.packages) {
      return res.status(400).json({ success: false, message: "Package data missing" });
    }

    const packagesData = JSON.parse(req.body.packages);
    const { 
      place, 
      subTitle, 
      description, 
      isPublished, 
      dynamicBlocks, 
      rating, 
      content, 
      summaryTable,
      placesLocation,
      latestPrice,
      oldPrice,
      duration,     
      packageCategories,
      faqTitle,
      faqs,
      seoData,
      locations
    } = packagesData;

    if (!place || !description) {
      return res.status(400).json({ success: false, message: "Place and description are required fields" });
    }

    let mainImageUrl = "";
    if (req.files?.image?.length > 0) {
      mainImageUrl = await uploadImage(req.files.image[0]);
    }

    let image1Url = "";
    if (req.files?.summary_image1?.length > 0) {
      image1Url = await uploadImage(req.files.summary_image1[0]);
    }

    let image2Url = "";
    if (req.files?.summary_image2?.length > 0) {
      image2Url = await uploadImage(req.files.summary_image2[0]);
    }

    // Handle gallery images with alt text
    let galleryImages = [];
    if (req.files?.galleryImages) {
      const galleryUrls = await Promise.all(
        req.files.galleryImages.map(file => uploadImage(file))
      );
      const newImageAlts = packagesData.newImageAlts || [];
      galleryImages = galleryUrls.map((url, i) => ({
        url,
        alt: newImageAlts[i] || '', // Use the alt text, or empty string
      }));
    }

    const updatedSummaryTable = {
      ...(summaryTable || {}),
      image1: image1Url || (summaryTable ? summaryTable.image1 : ""),
      image2: image2Url || (summaryTable ? summaryTable.image2 : ""),
    };

    const processedBlocks = await Promise.all(
      (dynamicBlocks || []).map(async (block) => {
        if (block.image && typeof block.image === 'string' && block.image.startsWith("dynamic_image_")) {
          const fileKey = block.image;
          if (req.files[fileKey] && req.files[fileKey][0]) {
            block.image = await uploadImage(req.files[fileKey][0]);
          } else {
            block.image = ''; // Or handle as an error
          }
        }
        return block;
      })
    );

    

    await Packages.create({
      place,
      subTitle,
      description,
      image: mainImageUrl,
      isPublished,
      dynamicBlocks: processedBlocks,
      rating,
      content,
      summaryTable: updatedSummaryTable,
      galleryImages: galleryImages,
      placesLocation,
      latestPrice,
      oldPrice,
      duration,
      packageCategories,
      faqTitle,
      faqs,
      seotitle: seoData?.seotitle,
      seodescription: seoData?.seodescription,
      seokeywords: seoData?.seokeywords,
      locations,
    });

    return res.status(201).json({ success: true, message: "Added successfully" });
  } catch (error) {
    console.error("Error in addPackage:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update Packages using findByIdAndUpdate for reliability
export const updatePackages = async (req, res) => {
  try {
    console.log("--- updatePackages --- ");
    console.log("req.body.packages:", req.body.packages);
    console.log("req.files:", req.files);

    const { id } = req.params;
    if (!req.body.packages) {
      return res.status(400).json({ success: false, message: "Packages data missing" });
    }

    const packagesData = JSON.parse(req.body.packages);
    console.log("packagesData:", packagesData);
    
    const oldPackages = await Packages.findById(id);
    if (!oldPackages) {
        return res.status(404).json({ success: false, message: "Package not found" });
    }

    const updatePayload = { ...packagesData };

    updatePayload.seotitle = packagesData.seoData?.seotitle;
    updatePayload.seodescription = packagesData.seoData?.seodescription;
    updatePayload.seokeywords = packagesData.seoData?.seokeywords;


    // Handle main image update
    if (req.files?.image?.length > 0) {
      updatePayload.image = await uploadImage(req.files.image[0]);
    }

    // Handle gallery images update
    let updatedGallery = packagesData.galleryImages || []; // This contains existing images with {url, alt}
    if (req.files?.galleryImages && req.files.galleryImages.length > 0) {
      const newGalleryUrls = await Promise.all(
        req.files.galleryImages.map(file => uploadImage(file))
      );
      const newImageAlts = packagesData.newImageAlts || [];
      const newFilesWithData = newGalleryUrls.map((url, i) => ({
        url,
        alt: newImageAlts[i] || '',
      }));
      updatedGallery = updatedGallery.concat(newFilesWithData);
    }
    updatePayload.galleryImages = updatedGallery;
    if (updatePayload.newImageAlts) {
        delete updatePayload.newImageAlts; // Clean up temporary field
    }

    // Handle summary table images update
    const newSummaryTable = { ...(oldPackages.summaryTable || {}), ...packagesData.summaryTable };
    if (req.files?.summary_image1?.length > 0) {
      newSummaryTable.image1 = await uploadImage(req.files.summary_image1[0]);
    }
    if (req.files?.summary_image2?.length > 0) {
      newSummaryTable.image2 = await uploadImage(req.files.summary_image2[0]);
    }
    updatePayload.summaryTable = newSummaryTable;

    
    // Handle dynamic block images update
    if (packagesData.dynamicBlocks) {
        updatePayload.dynamicBlocks = await Promise.all(
            packagesData.dynamicBlocks.map(async (block) => {
                if (block.image && typeof block.image === 'string' && block.image.startsWith("dynamic_image_")) {
                    const fileKey = block.image;
                    if (req.files[fileKey] && req.files[fileKey][0]) {
                        block.image = await uploadImage(req.files[fileKey][0]);
                    } else {
                        const oldBlock = oldPackages.dynamicBlocks.find(b => b.id === block.id);
                        block.image = oldBlock ? oldBlock.image : "";
                    }
                }
                return block;
            })
        );
    }

    

    const updatedPackages = await Packages.findByIdAndUpdate(id, { $set: updatePayload }, { new: true });

    if (!updatedPackages) {
        return res.status(404).json({ success: false, message: "Packages not found during update" });
    }

    return res.json({ success: true, message: "Packages updated successfully" });

  } catch (error) {
    console.error("Error in updatePackages:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Packages
export const getAllPackages = async (req, res) => {
  try {
        const packages = await Packages.find().sort({ updatedAt: -1 });
    return res.json({ success: true, packages: packages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get One Packages by ID
export const getPackagesById = async (req, res) => {
  try {
    const { packagesId } = req.params;
    if (!packagesId) return res.status(400).json({ success: false, message: "Packages ID missing" });

    const packages = await Packages.findById(packagesId);
    if (!packages) return res.status(404).json({ success: false, message: "Packages not found" });

    return res.json({ success: true, packages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Packages by Place Name
export const getPackagesByPlaceName = async (req, res) => {
  try {
    const decodedName = decodeURIComponent(req.params.placename);
    const packages = await Packages.findOne({ place: decodedName });

    if (!packages) {
      return res.status(404).json({ success: false, message: "Place not found" });
    }

    return res.json({ success: true, packages });
  } catch (error) {
    console.error("Error in getDiscoverByPlaceName:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete Packages
export const deletePackagesById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, message: "Packages ID missing" });

    const deleted = await Packages.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Package not found" });

    return res.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle Publish
export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, message: "Package ID missing" });

    const packages = await Packages.findById(id);
    if (!packages) return res.status(404).json({ success: false, message: "Package not found" });

    packages.isPublished = !packages.isPublished;
    await packages.save();

    return res.json({ success: true, message: "Post status updated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
