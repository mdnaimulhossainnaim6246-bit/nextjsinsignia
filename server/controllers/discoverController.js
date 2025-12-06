
// // server/controller/discoverController.js
// import mongoose from 'mongoose';
// import imagekit from '../configs/imageKit.js';
// import Discover from '../models/discover.js';

// // Helper: Upload image buffer to ImageKit and return filePath
// async function uploadImage(file) {
//   try {
//     const uploadResponse = await imagekit.upload({
//       file: file.buffer,
//       fileName: file.originalname,
//       folder: "/discover",
//     });
//     return imagekit.url({
//       path: uploadResponse.filePath,
//       transformation: [{ quality: "auto" }, { format: "webp" }],
//     });
//   } catch (error) {
//     throw new Error(`Image upload failed: ${error.message}`);
//   }
// }

// // Add Discover
// export const addDiscover = async (req, res) => {
//   try {
//     if (!req.body.discover) {
//       return res.status(400).json({ success: false, message: "Discover data missing" });
//     }

//     const discoverData = JSON.parse(req.body.discover);
//     const { place, subTitle, description, isPublished, category, dynamicBlocks, rating, content, summaryTable } = discoverData;

//     if (!place || !description) {
//       return res.status(400).json({ success: false, message: "Place and description are required fields" });
//     }

//     let mainImageUrl = "";
//     if (req.files?.image?.length > 0) {
//       mainImageUrl = await uploadImage(req.files.image[0]);
//     }

//     let image1Url = "";
//     if (req.files?.summary_image1?.length > 0) {
//       image1Url = await uploadImage(req.files.summary_image1[0]);
//     }

//     let image2Url = "";
//     if (req.files?.summary_image2?.length > 0) {
//       image2Url = await uploadImage(req.files.summary_image2[0]);
//     }




// let galleryImageUrls = [];

// if (req.files?.galleryImages) {
//   galleryImageUrls = await Promise.all(
//     req.files.galleryImages.map(file => uploadImage(file))
//   );
// }





//     const updatedSummaryTable = {
//       ...(summaryTable || {}),
//       image1: image1Url || (summaryTable ? summaryTable.image1 : ""),
//       image2: image2Url || (summaryTable ? summaryTable.image2 : ""),
//     };

//     const processedBlocks = await Promise.all(
//       (dynamicBlocks || []).map(async (block) => {
//         if (block.image && typeof block.image === 'string' && block.image.startsWith("dynamic_image_")) {
//           const fileKey = block.image;
//           if (req.files[fileKey] && req.files[fileKey][0]) {
//             block.image = await uploadImage(req.files[fileKey][0]);
//           } else {
//             block.image = ''; // Or handle as an error
//           }
//         }
//         return block;
//       })
//     );

//     let categoryField = null;
//     let customCityField = null;
//     if (category) {
//       if (mongoose.Types.ObjectId.isValid(category)) {
//         categoryField = new mongoose.Types.ObjectId(category);
//       } else {
//         customCityField = category;
//       }
//     }

//     await Discover.create({
//       place,
//       subTitle,
//       description,
//       image: mainImageUrl,
//       isPublished,
//       category: categoryField,
//       customCity: customCityField,
//       dynamicBlocks: processedBlocks,
//       rating,
//       content,
//       summaryTable: updatedSummaryTable,
//       galleryImages: galleryImageUrls,
//     });

//     return res.status(201).json({ success: true, message: "Added successfully" });
//   } catch (error) {
//     console.error("Error in addDiscover:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Update Discover using findByIdAndUpdate for reliability
// export const updateDiscover = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!req.body.discover) {
//       return res.status(400).json({ success: false, message: "Discover data missing" });
//     }

//     const discoverData = JSON.parse(req.body.discover);
    
//     const oldDiscover = await Discover.findById(id);
//     if (!oldDiscover) {
//         return res.status(404).json({ success: false, message: "Discover not found" });
//     }

//     const updatePayload = { ...discoverData };

//     // Handle main image update
//     if (req.files?.image?.length > 0) {
//       updatePayload.image = await uploadImage(req.files.image[0]);
//     }


//     let galleryImageUrls = discoverData.galleryImages || [];

//     if (req.files?.galleryImages) {
//       const uploadedGalleryUrls = await Promise.all(
//         req.files.galleryImages.map(file => uploadImage(file))
//       );
//       galleryImageUrls = galleryImageUrls.concat(uploadedGalleryUrls);
//     }

//     // Handle summary table images update
//     const newSummaryTable = { ...(oldDiscover.summaryTable || {}), ...discoverData.summaryTable };
//     if (req.files?.summary_image1?.length > 0) {
//       newSummaryTable.image1 = await uploadImage(req.files.summary_image1[0]);
//     }
//     if (req.files?.summary_image2?.length > 0) {
//       newSummaryTable.image2 = await uploadImage(req.files.summary_image2[0]);
//     }
//     updatePayload.summaryTable = newSummaryTable;


//     updatePayload.galleryImages = galleryImageUrls;

    
//     // Handle dynamic block images update
//     if (discoverData.dynamicBlocks) {
//         updatePayload.dynamicBlocks = await Promise.all(
//             discoverData.dynamicBlocks.map(async (block) => {
//                 if (block.image && typeof block.image === 'string' && block.image.startsWith("dynamic_image_")) {
//                     const fileKey = block.image;
//                     if (req.files[fileKey] && req.files[fileKey][0]) {
//                         block.image = await uploadImage(req.files[fileKey][0]);
//                     } else {
//                         const oldBlock = oldDiscover.dynamicBlocks.find(b => b.id === block.id);
//                         block.image = oldBlock ? oldBlock.image : "";
//                     }
//                 }
//                 return block;
//             })
//         );
//     }

//     // Handle category
//     if (discoverData.category) {
//       if (mongoose.Types.ObjectId.isValid(discoverData.category)) {
//         updatePayload.category = new mongoose.Types.ObjectId(discoverData.category);
//         updatePayload.customCity = null;
//       } else {
//         updatePayload.customCity = discoverData.category;
//         updatePayload.category = null;
//       }
//     }

//     const updatedDiscover = await Discover.findByIdAndUpdate(id, { $set: updatePayload }, { new: true });

//     if (!updatedDiscover) {
//         return res.status(404).json({ success: false, message: "Discover not found during update" });
//     }

//     return res.json({ success: true, message: "Discover updated successfully" });

//   } catch (error) {
//     console.error("Error in updateDiscover:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get All Discover
// export const getAllDiscover = async (req, res) => {
//   try {
//         const discovers = await Discover.find().populate('category').sort({ updatedAt: -1 });
//     return res.json({ success: true, discover: discovers });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get One Discover by ID
// export const getDiscoverById = async (req, res) => {
//   try {
//     const { discoverId } = req.params;
//     if (!discoverId) return res.status(400).json({ success: false, message: "Discover ID missing" });

//     const discover = await Discover.findById(discoverId).populate('category', 'title');
//     if (!discover) return res.status(404).json({ success: false, message: "Discover not found" });

//     return res.json({ success: true, discover });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get Discover by Place Name
// export const getDiscoverByPlaceName = async (req, res) => {
//   try {
//     const decodedName = decodeURIComponent(req.params.placename);
//     const discover = await Discover.findOne({ place: decodedName });

//     if (!discover) {
//       return res.status(404).json({ success: false, message: "Place not found" });
//     }

//     return res.json({ success: true, discover });
//   } catch (error) {
//     console.error("Error in getDiscoverByPlaceName:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // Delete Discover
// export const deleteDiscoverById = async (req, res) => {
//   try {
//     const { id } = req.body;
//     if (!id) return res.status(400).json({ success: false, message: "Discover ID missing" });

//     const deleted = await Discover.findByIdAndDelete(id);
//     if (!deleted) return res.status(404).json({ success: false, message: "Discover not found" });

//     return res.json({ success: true, message: "Post deleted successfully" });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Toggle Publish
// export const togglePublish = async (req, res) => {
//   try {
//     const { id } = req.body;
//     if (!id) return res.status(400).json({ success: false, message: "Discover ID missing" });

//     const discover = await Discover.findById(id);
//     if (!discover) return res.status(404).json({ success: false, message: "Discover not found" });

//     discover.isPublished = !discover.isPublished;
//     await discover.save();

//     return res.json({ success: true, message: "Post status updated" });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };





// server/controller/discoverController.js
import mongoose from 'mongoose';
import imagekit from '../configs/imageKit.js';
import Discover from '../models/discover.js';
import Tour from '../models/tour.js'; // Import the Tour model

// Helper: Upload image buffer to ImageKit and return filePath
async function uploadImage(file) {
  try {
    const uploadResponse = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: "/discover",
    });
    return imagekit.url({
      path: uploadResponse.filePath,
      transformation: [{ quality: "auto" }, { format: "webp" }],
    });
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
}

// This helper function will find an existing tour or create a new one
async function findOrCreateTour(categoryName) {
  if (!categoryName) {
    return null;
  }

  // Check if it's a valid ObjectId first
  if (mongoose.Types.ObjectId.isValid(categoryName)) {
    // If it's a valid ID, assume it exists and return it.
    // You might want to add a check to ensure it really exists in the Tour collection
    return categoryName;
  }

  // If it's a string, try to find a tour with that title
  let tour = await Tour.findOne({ title: categoryName });

  if (tour) {
    // If found, return its ID
    return tour._id;
  } else {
    // If not found, create a new tour with placeholder data
    const newTour = new Tour({
      title: categoryName,
      subTitle: "Newly added category", // Placeholder
      description: "This is a default description for a newly added category.", // Placeholder
      image: "/default-category-image.png", // Placeholder image path
      isPublished: false, // It's better to keep it unpublished by default
    });
    const savedTour = await newTour.save();
    return savedTour._id;
  }
}


// Add Discover
export const addDiscover = async (req, res) => {
  try {
    if (!req.body.discover) {
      return res.status(400).json({ success: false, message: "Discover data missing" });
    }

    const discoverData = JSON.parse(req.body.discover);
    const { place, subTitle, description, isPublished, category, dynamicBlocks, rating, content, summaryTable, faqTitle,
      faqs, seoData, destinationTagline, destinationTheme, mapEmbedUrl, whatToExperience } = discoverData;

    if (!place || !description) {
      return res.status(400).json({ success: false, message: "Place and description are required fields" });
    }

    // Find or create the category and get its ID
    const categoryId = await findOrCreateTour(category);


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
      const newImageAlts = discoverData.newImageAlts || [];
      galleryImages = galleryUrls.map((url, i) => ({
        url,
        alt: newImageAlts[i] || '',
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
            block.image = ''; 
          }
        }
        return block;
      })
    );

    await Discover.create({
      place,
      subTitle,
      description,
      image: mainImageUrl,
      isPublished,
      category: categoryId, 
      customCity: null, 
      dynamicBlocks: processedBlocks,
      rating,
      content,
      summaryTable: updatedSummaryTable,
      galleryImages: galleryImages,
      faqTitle,
      faqs,
      seotitle: seoData?.seotitle,
      seodescription: seoData?.seodescription,
      seokeywords: seoData?.seokeywords,
      destinationTagline,
      destinationTheme,
      mapEmbedUrl,
      whatToExperience,
    });

    return res.status(201).json({ success: true, message: "Added successfully" });
  } catch (error) {
    console.error("Error in addDiscover:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update Discover using findByIdAndUpdate for reliability
export const updateDiscover = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.body.discover) {
      return res.status(400).json({ success: false, message: "Discover data missing" });
    }

    const discoverData = JSON.parse(req.body.discover);
    
    const oldDiscover = await Discover.findById(id);
    if (!oldDiscover) {
        return res.status(404).json({ success: false, message: "Discover not found" });
    }

    const { seoData, destinationTagline, destinationTheme, mapEmbedUrl, whatToExperience, ...restOfDiscoverData } = discoverData;
    const updatePayload = { ...restOfDiscoverData, destinationTagline, destinationTheme, mapEmbedUrl, whatToExperience };

    if (seoData) {
      updatePayload.seotitle = seoData.seotitle;
      updatePayload.seodescription = seoData.seodescription;
      updatePayload.seokeywords = seoData.seokeywords;
    }

    // Ensure faqTitle and faqs are included in the update
    updatePayload.faqTitle = discoverData.faqTitle;
    updatePayload.faqs = discoverData.faqs;

    // Handle category update
    if (discoverData.category) {
        updatePayload.category = await findOrCreateTour(discoverData.category);
        updatePayload.customCity = null; // We no longer use customCity
    }


    // Handle main image update
    if (req.files?.image?.length > 0) {
      updatePayload.image = await uploadImage(req.files.image[0]);
    }

    // Handle gallery images update
    let updatedGallery = discoverData.galleryImages || []; // This contains existing images with {url, alt}
    if (req.files?.galleryImages && req.files.galleryImages.length > 0) {
      const newGalleryUrls = await Promise.all(
        req.files.galleryImages.map(file => uploadImage(file))
      );
      const newImageAlts = discoverData.newImageAlts || [];
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
    const newSummaryTable = { ...(oldDiscover.summaryTable || {}), ...discoverData.summaryTable };
    if (req.files?.summary_image1?.length > 0) {
      newSummaryTable.image1 = await uploadImage(req.files.summary_image1[0]);
    }
    if (req.files?.summary_image2?.length > 0) {
      newSummaryTable.image2 = await uploadImage(req.files.summary_image2[0]);
    }
    updatePayload.summaryTable = newSummaryTable;

    
    // Handle dynamic block images update
    if (discoverData.dynamicBlocks) {
        updatePayload.dynamicBlocks = await Promise.all(
            discoverData.dynamicBlocks.map(async (block) => {
                if (block.image && typeof block.image === 'string' && block.image.startsWith("dynamic_image_")) {
                    const fileKey = block.image;
                    if (req.files[fileKey] && req.files[fileKey][0]) {
                        block.image = await uploadImage(req.files[fileKey][0]);
                    } else {
                        const oldBlock = oldDiscover.dynamicBlocks.find(b => b.id === block.id);
                        block.image = oldBlock ? oldBlock.image : "";
                    }
                }
                return block;
            })
        );
    }

    const updatedDiscover = await Discover.findByIdAndUpdate(id, { $set: updatePayload }, { new: true });

    if (!updatedDiscover) {
        return res.status(404).json({ success: false, message: "Discover not found during update" });
    }

    return res.json({ success: true, message: "Discover updated successfully" });

  } catch (error) {
    console.error("Error in updateDiscover:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Discover
export const getAllDiscover = async (req, res) => {
  try {
        const discovers = await Discover.find().populate('category').sort({ updatedAt: -1 });
    return res.json({ success: true, discover: discovers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get One Discover by ID
export const getDiscoverById = async (req, res) => {
  try {
    const { discoverId } = req.params;
    if (!discoverId) return res.status(400).json({ success: false, message: "Discover ID missing" });

    const discover = await Discover.findById(discoverId).populate('category', 'title');
    if (!discover) return res.status(404).json({ success: false, message: "Discover not found" });

    return res.json({ success: true, discover });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Discover by Place Name
export const getDiscoverByPlaceName = async (req, res) => {
  try {
    const decodedName = decodeURIComponent(req.params.placename);
    const discover = await Discover.findOne({ place: decodedName });

    if (!discover) {
      return res.status(404).json({ success: false, message: "Place not found" });
    }

    return res.json({ success: true, discover });
  } catch (error) {
    console.error("Error in getDiscoverByPlaceName:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete Discover
export const deleteDiscoverById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, message: "Discover ID missing" });

    const deleted = await Discover.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Discover not found" });

    return res.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle Publish
export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, message: "Discover ID missing" });

    const discover = await Discover.findById(id);
    if (!discover) return res.status(404).json({ success: false, message: "Discover not found" });

    discover.isPublished = !discover.isPublished;
    await discover.save();

    return res.json({ success: true, message: "Post status updated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteManyDiscovers = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or empty IDs array' });
    }
    const result = await Discover.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'No discovers found to delete' });
    }
    return res.json({ success: true, message: 'Selected discovers deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get lightweight discover articles for performance
export const getDiscoverArticles = async (req, res) => {
  try {
    const articles = await Discover.find(
      { isPublished: true },
      'place subTitle rating'
    ).sort({ updatedAt: -1 });
    return res.json({ success: true, articles: articles });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};