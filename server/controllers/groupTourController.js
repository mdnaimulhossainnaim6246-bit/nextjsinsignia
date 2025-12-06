// import mongoose from "mongoose";
// import GroupTour from "../models/GroupTour.js";
// import imagekit from "../configs/imageKit.js";

// // Helper to upload a single file buffer to ImageKit
// async function uploadImage(file) {
//   try {
//     const uploadResponse = await imagekit.upload({
//       file: file.buffer,
//       fileName: file.originalname,
//       folder: "/group-tours",
//     });
//     return imagekit.url({
//       path: uploadResponse.filePath,
//       transformation: [{ quality: "auto" }, { format: "webp" }],
//     });
//   } catch (error) {
//     console.error("ImageKit Upload Error:", error);
//     throw new Error(`Image upload failed for ${file.originalname}: ${error.message}`);
//   }
// }

// const addGroupTour = async (req, res) => {
//   try {
//     let tourData;
//     try {
//       tourData = JSON.parse(req.body.tour);
//     } catch (e) {
//       return res.status(400).json({ success: false, message: "Invalid JSON format in 'tour' data" });
//     }

//     if (req.file) {
//       tourData.image = await uploadImage(req.file);
//     }

//     await GroupTour.create(tourData);

//     return res.status(201).json({ success: true, message: 'Group tour added successfully' });

//   } catch (error) {
//     console.error("Add Group Tour Error:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// const updateGroupTour = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: 'Invalid ID format' });
//     }

//     const tourData = JSON.parse(req.body.tour);
//     const updatePayload = { ...tourData };

//     if (req.file) {
//       updatePayload.image = await uploadImage(req.file);
//     }
    
//     const updatedTour = await GroupTour.findByIdAndUpdate(id, { $set: updatePayload }, { new: true });

//     if (!updatedTour) {
//         return res.status(404).json({ success: false, message: "Group tour not found during update" });
//     }

//     return res.status(200).json({ success: true, message: 'Group tour updated successfully' });

//   } catch (error) {
//     console.error("Update Group Tour Error:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getGroupTourById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: 'Invalid ID format' });
//     }
//     const tour = await GroupTour.findById(id);
//     if (!tour) {
//       return res.status(404).json({ success: false, message: 'Group tour not found' });
//     }
//     return res.json({ success: true, tour: tour });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// const deleteGroupTourById = async (req, res) => {
//   try {
//     const { id } = req.body;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: 'Invalid ID format' });
//     }
//     const deletedTour = await GroupTour.findByIdAndDelete(id);
//     if (!deletedTour) {
//       return res.status(404).json({ success: false, message: 'Group tour not found' });
//     }
//     return res.json({ success: true, message: 'Group tour deleted successfully' });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// const togglePublishGroupTour = async (req, res) => {
//   try {
//     const { id } = req.body;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: 'Invalid ID format' });
//     }
//     const tour = await GroupTour.findById(id);
//     if (!tour) {
//       return res.status(404).json({ success: false, message: 'Group tour not found' });
//     }
//     tour.isPublished = !tour.isPublished;
//     await tour.save();
//     return res.status(200).json({
//       success: true,
//       message: `Group tour ${tour.isPublished ? 'published' : 'unpublished'} successfully.`,
//       isPublished: tour.isPublished,
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getAllGroupTours = async (req, res) => {
//   try {
//     const { showAll } = req.query;
//     const filter = {};
//     if (!showAll || showAll !== 'true') {
//       filter.isPublished = true;
//     }
//     const tours = await GroupTour.find(filter).sort({ createdAt: -1 });
//     return res.json({ success: true, tours });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// const deleteManyGroupTours = async (req, res) => {
//   try {
//     const { ids } = req.body;
//     if (!ids || !Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({ success: false, message: 'Invalid or empty IDs array' });
//     }
//     const result = await GroupTour.deleteMany({ _id: { $in: ids } });
//     if (result.deletedCount === 0) {
//       return res.status(404).json({ success: false, message: 'No group tours found to delete' });
//     }
//     return res.json({ success: true, message: 'Selected group tours deleted successfully' });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// export {
//   addGroupTour,
//   updateGroupTour,
//   getAllGroupTours,
//   getGroupTourById,
//   deleteGroupTourById,
//   togglePublishGroupTour,
//   deleteManyGroupTours,
// };


import mongoose from "mongoose";
import GroupTour from "../models/GroupTour.js";
import imagekit from "../configs/imageKit.js";

// 🧩 Helper: Upload single file to ImageKit
async function uploadImage(file) {
  try {
    const uploadResponse = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: "/group-tours",
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

// ➕ Add New Group Tour
const addGroupTour = async (req, res) => {
  try {
    let tourData;
    try {
      tourData = JSON.parse(req.body.tour);
    } catch (e) {
      return res.status(400).json({ success: false, message: "Invalid JSON format in 'tour' data" });
    }

    // 🧠 Multiple image/file support (if any)
    if (req.files && req.files.length > 0) {
      const uploadedImages = await Promise.all(req.files.map(uploadImage));
      tourData.images = uploadedImages;
    } else if (req.file) {
      tourData.image = await uploadImage(req.file);
    }

    // 🗂 Default fallbacks
    if (!tourData.category) tourData.category = "Uncategorized";
    if (!tourData.schedule) tourData.schedule = "Upcoming";

    await GroupTour.create(tourData);
    return res.status(201).json({ success: true, message: "Group tour added successfully" });
  } catch (error) {
    console.error("Add Group Tour Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✏ Update Existing Group Tour
const updateGroupTour = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid ID format" });

    const tourData = JSON.parse(req.body.tour);
    const updatePayload = { ...tourData };

    if (req.files && req.files.length > 0) {
      const uploadedImages = await Promise.all(req.files.map(uploadImage));
      updatePayload.images = uploadedImages;
    } else if (req.file) {
      updatePayload.image = await uploadImage(req.file);
    }

    const updatedTour = await GroupTour.findByIdAndUpdate(id, { $set: updatePayload }, { new: true });
    if (!updatedTour)
      return res.status(404).json({ success: false, message: "Group tour not found during update" });

    return res.status(200).json({ success: true, message: "Group tour updated successfully" });
  } catch (error) {
    console.error("Update Group Tour Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 🧾 Get Single Tour
const getGroupTourById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid ID format" });

    const tour = await GroupTour.findById(id);
    if (!tour)
      return res.status(404).json({ success: false, message: "Group tour not found" });

    return res.json({ success: true, tour });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ❌ Delete One
const deleteGroupTourById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid ID format" });

    const deletedTour = await GroupTour.findByIdAndDelete(id);
    if (!deletedTour)
      return res.status(404).json({ success: false, message: "Group tour not found" });

    return res.json({ success: true, message: "Group tour deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 📢 Toggle Publish/Unpublish
const togglePublishGroupTour = async (req, res) => {
  try {
    const { id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid ID format" });

    const tour = await GroupTour.findById(id);
    if (!tour)
      return res.status(404).json({ success: false, message: "Group tour not found" });

    tour.isPublished = !tour.isPublished;
    await tour.save();

    return res.status(200).json({
  success: true,
  message: `Group tour ${tour.isPublished ? "published" : "unpublished"} successfully.`,
  isPublished: tour.isPublished,
});

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 📋 Get All (Filter + Sort)
const getAllGroupTours = async (req, res) => {
  try {
    const { showAll, category } = req.query;
    const filter = {};

    if (!showAll || showAll !== "true") filter.isPublished = true;
    if (category && category !== "all") filter.category = category;

    const tours = await GroupTour.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, tours });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 🗑 Delete Many
const deleteManyGroupTours = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0)
      return res.status(400).json({ success: false, message: "Invalid or empty IDs array" });

    const result = await GroupTour.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0)
      return res.status(404).json({ success: false, message: "No group tours found to delete" });

    return res.json({ success: true, message: "Selected group tours deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  addGroupTour,
  updateGroupTour,
  getAllGroupTours,
  getGroupTourById,
  deleteGroupTourById,
  togglePublishGroupTour,
  deleteManyGroupTours,
};