
import mongoose from "mongoose";

const discoverSchema = new mongoose.Schema({
  place: { type: String, required: true },
  subTitle: { type: String, required: true },

  destinationTagline: { type: String },
  destinationTheme: { type: String },
  mapEmbedUrl: { type: String },
  whatToExperience: [
    {
      title: { type: String },
      checked: { type: Boolean, default: false },
    },
  ],

  description: { type: String, required: true },
  image: { type: String, required: true },
  isPublished: { type: Boolean, required: true },

   //  Rating field
   rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },

  //  Category or Custom City
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: false,
  },
  customCity: {
    type: String,
    required: false,
  },

  //  Table of Content
  content: {
    type: String,
    required: false, 
  },

 summaryTable: {
  headerTitle: { type: String, trim: true },
  image1: { type: String },
  alt1: { type: String },
  cqeditorTable: { type: String },  
  image2: { type: String },
  alt2: { type: String },
  locationTitle: { type: String, trim: true },
},


galleryImages: [{
  url: { type: String },
  alt: { type: String },
}],

 

  dynamicBlocks: {
  type: [
    {
      type: {
        type: String,
        enum: ['image-text', 'image-text-theme', 'text-theme'],
        required: true,
      },
      image: {
        type: String,
      },
      alt: {
        type: String,
      },
      content: {
        type: String,
        required: true,
      },
      theme: {
        type: String,
        enum: ['theme1', 'theme2', 'theme3', 'theme4', 'theme5', 'theme6', 'theme7', 'theme8', 'theme9', 'theme10', 'theme11', 'theme12', 'theme13', 'theme14', 'theme15', 'theme16','theme17', 'theme18', 'theme19', 'theme20', 'theme21', 'theme22', 'theme23', 'theme24', 'theme25', 'theme26', 'theme27', 'theme28', 'theme29', 'theme30', 'theme31', 'theme32','theme33', 'theme34', 'theme35'],
      },
      subtitle: {
        type: String,
        required: false,
      },
      idName: {
        type: String,
        required: false,
      }
    }
  ],
  default: [],

},

faqTitle: { type: String },
  faqs: [
    {
      question: { type: String },
      answer: { type: String },
    },
  ],

  seotitle: { type: String },
  seodescription: { type: String },
  seokeywords: { type: String },



}, { timestamps: true });

const Discover = mongoose.model('discover', discoverSchema);
export default Discover;
