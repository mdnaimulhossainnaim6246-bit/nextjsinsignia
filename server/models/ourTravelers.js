import mongoose from "mongoose";

const ourTravelersSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subTitle: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  isPublished: { type: Boolean, required: true },
  profileChoose: { type: String },
  socialMedia: {
    instagram: { type: String },
    facebook: { type: String },
    linkedin: { type: String },
    youtube: { type: String },
    x: { type: String },
  },
  images: [{ type: String }],
  seotitle: { type: String },
  seodescription: { type: String },
  seokeywords: { type: String },
}, { timestamps: true });

const OurTravelers = mongoose.models.OurTravelers || mongoose.model("ourtravelers", ourTravelersSchema);

export default OurTravelers;
