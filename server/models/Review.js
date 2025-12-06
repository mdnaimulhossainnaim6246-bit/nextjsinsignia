import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    travelersPicture: { type: String, required: true },
    travelersName: { type: String, required: true, trim: true },
    travelersTitle: { type: String, trim: true },
    reviewTitle: { type: String, required: true, trim: true },
    reviewDate: { type: Date },
    description: { type: String, required: true },
    path: { type: String },
    websiteUrl: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    isPublished: { type: Boolean, default: false },
    imageGallery: [{
      url: { type: String, required: true },
      fileName: { type: String, required: true },
      alt: { type: String },
    }],
    imageUrls: [{
      url: { type: String },
      alt: { type: String },
    }],
    seotitle: { type: String },
    seodescription: { type: String },
    seokeywords: { type: String },
  },
  { timestamps: true }
);

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review;
