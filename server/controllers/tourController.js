import fs from 'fs';
import path from 'path';
import imagekit from '../configs/imageKit.js';
import Tour from '../models/tour.js';

export const addTour = async (req, res) => {
  try {
    if (!req.body.tour) {
      return res.status(400).json({ success: false, message: "Tour data missing" });
    }

    let tourData;
    try {
      tourData = JSON.parse(req.body.tour);
    } catch {
      return res.status(400).json({ success: false, message: "Invalid JSON format in tour field" });
    }

    const { title, subTitle, description, isPublished } = tourData;
    const imageFile = req.file;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let optimizedImageUrl = '';
    if (imageFile) {
      const fileBuffer = imageFile.buffer; // memoryStorage use হলে buffer হবে

      let uploadResponse;
      try {
        uploadResponse = await imagekit.upload({
          file: fileBuffer,
          fileName: imageFile.originalname,
          folder: "/tour",
        });
      } catch (uploadErr) {
        console.error("ImageKit Upload Error:", uploadErr);
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
          error: uploadErr.message,
        });
      }

      optimizedImageUrl = imagekit.url({
        path: uploadResponse.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });
    }

    await Tour.create({
      title,
      subTitle,
      description,
      image: optimizedImageUrl,
      isPublished,
    });

    return res.status(201).json({ success: true, message: "Added successfully" });
  } catch (error) {
    console.error("Error in addTour:", error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: error.message });
    }
    console.error("Unhandled error after headers sent:", error.message);
  }
};

export const updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "Tour ID missing" });
    }

    if (!req.body.tour) {
      return res.status(400).json({ success: false, message: "Tour data missing" });
    }

    let tourData;
    try {
      tourData = JSON.parse(req.body.tour);
    } catch {
      return res.status(400).json({ success: false, message: "Invalid JSON format in tour field" });
    }

    const { title, subTitle, description, isPublished } = tourData;

    const tour = await Tour.findById(id);
    if (!tour) {
      return res.status(404).json({ success: false, message: "Tour not found" });
    }

    let optimizedImageUrl = tour.image;

    if (req.file) {
      // Delete old image from ImageKit
      if (tour.image) {
        const oldImageFileId = tour.image.split('/').pop().split('.')[0];
        try {
          await imagekit.deleteFile(oldImageFileId);
        } catch (deleteErr) {
          console.error("Old image deletion failed:", deleteErr.message);
        }
      }

      const fileBuffer = req.file.buffer; // memoryStorage use করলে buffer

      let uploadResponse;
      try {
        uploadResponse = await imagekit.upload({
          file: fileBuffer,
          fileName: req.file.originalname,
          folder: "/tour",
        });
      } catch (uploadErr) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
          error: uploadErr.message,
        });
      }

      optimizedImageUrl = imagekit.url({
        path: uploadResponse.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });
    }

    tour.title = title;
    tour.subTitle = subTitle;
    tour.description = description;
    tour.isPublished = isPublished;
    tour.image = optimizedImageUrl;

    await tour.save();

    return res.json({ success: true, message: "Tour updated successfully" });
  } catch (error) {
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: error.message });
    }
    console.error("Unhandled error after headers sent:", error.message);
  }
};

export const getAllTour = async (req, res) => {
  try {
    const tours = await Tour.aggregate([
      {
        $lookup: {
          from: 'bookingplaces',
          localField: '_id',
          foreignField: 'tour',
          as: 'bookings'
        }
      },
      {
        $lookup: {
          from: 'discovers',
          localField: '_id',
          foreignField: 'category',
          as: 'discoverPosts'
        }
      },
      {
        $project: {
          title: 1,
          subTitle: 1,
          description: 1,
          image: 1,
          isPublished: 1,
          createdAt: 1,
          isDeletable: {
            $eq: [{ $add: [{ $size: "$bookings" }, { $size: "$discoverPosts" }] }, 0]
          }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);
    return res.json({ success: true, tour: tours });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTourById = async (req, res) => {
  try {
    const { tourId } = req.params;
    if (!tourId) {
      return res.status(400).json({ success: false, message: "Tour ID missing" });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ success: false, message: "Tour not found" });
    }
    return res.json({ success: true, tour });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTourById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: "Tour ID missing" });
    }
    const deleted = await Tour.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Tour not found" });
    }
    return res.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: "Tour ID missing" });
    }

    const tour = await Tour.findById(id);
    if (!tour) {
      return res.status(404).json({ success: false, message: "Tour not found" });
    }
    tour.isPublished = !tour.isPublished;
    await tour.save();
    return res.json({ success: true, message: "Post status updated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTourByPlaceName = async (req, res) => {
  try {
    const { placename } = req.params;
    if (!placename) {
      return res.status(400).json({ success: false, message: "Place name missing" });
    }

    const searchTitle = placename.replace(/-/g, ' ');

    const tourArr = await Tour.aggregate([
      { $match: { title: { $regex: new RegExp(`^${searchTitle}`, 'i') } } },
      {
        $lookup: {
          from: 'bookingplaces',
          localField: '_id',
          foreignField: 'tour',
          as: 'bookings'
        }
      },
      {
        $project: {
          title: 1,
          subTitle: 1,
          description: 1,
          image: 1,
          isPublished: 1,
          createdAt: 1,
          bookingPlacesCount: { $size: "$bookings" }
        }
      }
    ]);

    if (!tourArr || tourArr.length === 0) {
      return res.status(404).json({ success: false, message: "Tour not found" });
    }

    return res.json({ success: true, tour: tourArr[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
