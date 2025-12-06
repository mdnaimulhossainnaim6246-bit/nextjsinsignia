import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    isPublished: { type: Boolean, default: false },
    subTitle: { type: String },
    date: { type: Date },
    dynamicContent: [{
      id: String,
      type: { type: String, required: true },
      image: { type: String },
      alt: { type: String },
      subtitle: { type: String },
      description: { type: String },
      // theme: {
      //    type: String },
      theme: {
          type: String,
          enum: ['theme1', 'theme2', 'theme3', 'theme4', 'theme5', 'theme6', 'theme7', 'theme8', 'theme9', 'theme10', 'theme11', 'theme12', 'theme13', 'theme14', 'theme15', 'theme16','theme17', 'theme18', 'theme19', 'theme20', 'theme21', 'theme22', 'theme23', 'theme24', 'theme25', 'theme26', 'theme27', 'theme28', 'theme29', 'theme30', 'theme31', 'theme32','theme33', 'theme34', 'theme35'],
        },
      idName: { type: String },
      content: { type: String }
    }],
    imageGallery: [{
      url: { type: String, required: true },
      fileName: { type: String, required: true },
      alt: { type: String },
    }],
    travelersPhoto: { type: String },
    travelersName: { type: String },
    seotitle: { type: String },
    seodescription: { type: String },
    seokeywords: { type: String },
  },
  { timestamps: true }
);

// Avoid OverwriteModelError by checking if model exists
const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

export default Blog;