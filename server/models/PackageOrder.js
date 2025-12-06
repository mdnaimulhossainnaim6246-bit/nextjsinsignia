
import mongoose from "mongoose";

// const packageOrderSchema = new mongoose.Schema({
//   package: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Package",
//     required: true,
//   },
//   place: { type: String, required: true },
//   numberOfPersons: { type: Number, required: true },
//   pricePerPerson: { type: Number, required: true },
//   totalCost: { type: Number, required: true },
//   gender: { type: String, required: true },
//   fullName: { type: String, required: true },
//   age: { type: Number,required: true },
//   country: { type: String ,required: true},
//   tourDate: { type: Date,required: true },
//   otherTravelers: { type: String },
//   profileImage: { type: String },
//   packageThumbnailBase64: { type: String }, 
//   phone: { type: String, required: true },
//   email: { type: String, required: true },
//   notes: { type: String },
//   status: {
//     type: String,
//     enum: ["pending", "confirmed", "cancelled", "ongoing", "completed"],
//     default: "pending",
//   },
//   createdAt: { type: Date, default: Date.now },
//   pickupAddress: { type: String },
//   clientProblem: { type: String },
//   option1: { type: Boolean, default: false,required: true },
//   option2: { type: Boolean, default: false,required: true},
// });

const packageOrderSchema = new mongoose.Schema({
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
    required: true,
  },
  place: { type: String, required: true, trim: true },
  numberOfPersons: { type: Number, required: true },
  pricePerPerson: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  gender: { type: String, required: true },
  fullName: { type: String, required: true, trim: true },
  age: { type: Number, required: true },
  country: { type: String, required: true },
  tourDate: { type: Date, required: true },
  otherTravelers: { type: String },
  profileImage: { type: String },
  packageThumbnailBase64: { type: String },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  notes: { type: String },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "ongoing", "completed"],
    default: "pending",
  },
  pickupAddress: { type: String },
  clientProblem: { type: String },
  option1: { type: Boolean, required: true, default: false },
  option2: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, default: Date.now },
});


const PackageOrder = mongoose.model("PackageOrder", packageOrderSchema);
export default PackageOrder;
