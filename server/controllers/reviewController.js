import mongoose from 'mongoose';
import Review from '../models/Review.js';
import imagekit from '../configs/imageKit.js';

// Helper to upload a single file buffer to ImageKit
async function uploadImage(file, folder = "/reviews") {
  try {
    const uploadResponse = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: folder,
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

// Create a new review
const createReview = async (req, res) => {
  try {
    if (!req.body.review) {
      return res.status(400).json({ success: false, message: 'Review data missing' });
    }

    let reviewData;
    try {
      reviewData = JSON.parse(req.body.review);
    } catch (e) {
      return res.status(400).json({ success: false, message: "Invalid JSON format in 'review' data" });
    }
    
    const files = req.files.reduce((acc, file) => {
      acc[file.fieldname] = (acc[file.fieldname] || []).concat(file);
      return acc;
    }, {});

    if (!files.travelersPicture || !files.travelersPicture[0]) {
      return res.status(400).json({ success: false, message: 'Traveler picture is required' });
    }

    reviewData.travelersPicture = await uploadImage(files.travelersPicture[0]);

    if (files.imageGallery && files.imageGallery.length > 0) {
      const galleryUrls = await Promise.all(files.imageGallery.map(file => uploadImage(file, "/reviews/gallery")));
      const newImageAlts = reviewData.newImageAlts || [];
      reviewData.imageGallery = galleryUrls.map((url, i) => ({
        url,
        fileName: files.imageGallery[i].originalname,
        alt: newImageAlts[i] || '',
      }));
      delete reviewData.newImageAlts;
    }

    const { seoData, ...restOfReviewData } = reviewData;

    await Review.create({
      ...restOfReviewData,
      seotitle: seoData?.seotitle,
      seodescription: seoData?.seodescription,
      seokeywords: seoData?.seokeywords,
    });

    return res.status(201).json({ success: true, message: 'Review added successfully' });

  } catch (error) {
    console.error("Add Review Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update an existing review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    if (!req.body.review) {
      return res.status(400).json({ success: false, message: 'Review data missing' });
    }

    const reviewData = JSON.parse(req.body.review);
    const { seoData, ...restOfReviewData } = reviewData;
    const updatePayload = { ...restOfReviewData };

    if (seoData) {
      updatePayload.seotitle = seoData.seotitle;
      updatePayload.seodescription = seoData.seodescription;
      updatePayload.seokeywords = seoData.seokeywords;
    }
    
    const files = req.files.reduce((acc, file) => {
      acc[file.fieldname] = (acc[file.fieldname] || []).concat(file);
      return acc;
    }, {});

    if (files.travelersPicture && files.travelersPicture[0]) {
      updatePayload.travelersPicture = await uploadImage(files.travelersPicture[0]);
    }

    let updatedGallery = reviewData.imageGallery || [];
    if (files.imageGallery && files.imageGallery.length > 0) {
      const newGalleryUrls = await Promise.all(files.imageGallery.map(file => uploadImage(file, "/reviews/gallery")));
      const newImageAlts = reviewData.newImageAlts || [];
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

    const updatedReview = await Review.findByIdAndUpdate(id, { $set: updatePayload }, { new: true });

    if (!updatedReview) {
        return res.status(404).json({ success: false, message: "Review not found during update" });
    }

    return res.status(200).json({ success: true, message: 'Review updated successfully' });

  } catch (error) {
    console.error("Update Review Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single review by ID
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    return res.json({ success: true, review: review });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single review by slug
const getReviewBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    // Fetch all published reviews
    const reviews = await Review.find({ isPublished: true });
    
    // Find the review that matches the slug
    const review = reviews.find(r => {
      const generatedSlug = (r.travelersName || '')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');
      return generatedSlug === slug;
    });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    return res.json({ success: true, review: review });
  } catch (error) {
    console.error("Get Review By Slug Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a single review by ID
const deleteReview = async (req, res) => {
  try {
    const { id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    return res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle the publish status of a review
const togglePublishReview = async (req, res) => {
  try {
    const { id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    review.isPublished = !review.isPublished;
    await review.save();
    return res.status(200).json({
      success: true,
      message: `Review ${review.isPublished ? 'published' : 'unpublished'} successfully.`,
      isPublished: review.isPublished,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all reviews
const getAllReviews = async (req, res) => {
  try {
    const { showAll } = req.query;
    const filter = {};
    if (!showAll || showAll !== 'true') {
      filter.isPublished = true;
    }
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete multiple reviews by their IDs
const deleteManyReviews = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or empty IDs array' });
    }
    const result = await Review.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'No reviews found to delete' });
    }
    return res.json({ success: true, message: 'Selected reviews deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createReview,
  updateReview,
  getAllReviews,
  getReviewById,
  getReviewBySlug,
  deleteReview,
  togglePublishReview,
  deleteManyReviews,
};
