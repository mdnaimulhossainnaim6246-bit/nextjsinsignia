import mongoose from "mongoose";

const bookingPlaceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  placeFee: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  // প্রয়োজনমত অন্য ফিল্ড যোগ করতে পারো
});

const tourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subTitle: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  isPublished: { type: Boolean, required: true },
  bookingPlaces: [bookingPlaceSchema],  // বুকিং প্লেস এর জন্য অ্যারে
}, { timestamps: true });

const Tour = mongoose.models.Tour || mongoose.model("Tour", tourSchema);

export default Tour;
