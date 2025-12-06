import mongoose from "mongoose";

const groupTourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  isPublished: { type: Boolean, default: false },
  endDate: { type: Date },
  month: { type: String },
  year: { type: Number },
});

export default mongoose.model("GroupTour", groupTourSchema);
