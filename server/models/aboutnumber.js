import mongoose from "mongoose";

const aboutNumberSchema = new mongoose.Schema({
  happyTravelers: { type: Number, default: 0 },
  tourPackages: { type: Number, default: 0 },
  satisfactionRate: { type: Number, default: 0 },
  yearsExperience: { type: Number, default: 0 },
  destinationCovered: { type: Number, default: 0 },
  totalTeamMember: { type: Number, default: 0 },
  freeTour: { type: Number, default: 0 },
  positiveReviews: { type: Number, default: 0 },
  successRate: { type: Number, default: 0 },
}, { timestamps: true });

const AboutNumber = mongoose.models.AboutNumber || mongoose.model("AboutNumber", aboutNumberSchema);

export default AboutNumber;