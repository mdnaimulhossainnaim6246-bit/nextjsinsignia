
// import mongoose from "mongoose";

// const packagesSchema = new mongoose.Schema({
//   place: { type: String, required: true },
//   subTitle: { type: String, required: true },
//   description: { type: String, required: true },
//   image: { type: String, required: true },
//   isPublished: { type: Boolean, required: true },

//   placesLocation: {
//     type: [{
//       name: String,
//       url: String,
//       showUrl: Boolean,
//     }],
//     default: [],
//   },
//   latestPrice: { type: Number, default: 0 },
//   oldPrice: { type: Number, default: 0 },
//   duration: {
//     value: { type: Number, default: 0 },
//     unit: { type: String, default: 'day' },
//   },
//   packageCategories: {
//     type: [String],
//     default: [],
//   },

//    //  Rating field
//    rating: {
//     type: Number,
//     min: 1,
//     max: 5,
//     required: true
//   },

  

//   // ✅ ✅ Add this for Table of Content
//   content: {
//     type: String,
//     required: false, // Not required in case someone skips it
//   },

//  summaryTable: {
//   headerTitle: { type: String, trim: true },
//   image1: { type: String },
//   cqeditorTable: { type: String },  // CKEditor টেবিলের HTML স্ট্রিং রাখবে এখানে
//   image2: { type: String },
//   locationTitle: { type: String, trim: true },
// },


// galleryImages: {
//   type: [String], // array of image URLs
//   default: [],
// },

 

//   dynamicBlocks: {
//   type: [
//     {
//       type: {
//         type: String,
//         enum: ['image-text', 'image-text-theme', 'text-theme'],
//         required: true,
//       },
//       image: {
//         type: String,
//       },
//       content: {
//         type: String,
//         required: true,
//       },
//       theme: {
//         type: String,
//         enum: ['theme1', 'theme2', 'theme3', 'theme4', 'theme5'],
//       },
//       subtitle: {
//         type: String,
//         required: false,
//       },
//       idName: {
//         type: String,
//         required: false,
//       }
//     }
//   ],
//   default: [],

// }





// }, { timestamps: true });

// const Packages = mongoose.model('packages', packagesSchema);
// export default Packages;


import mongoose from "mongoose";

const packagesSchema = new mongoose.Schema({
  place: { type: String, required: true },
  subTitle: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  isPublished: { type: Boolean, required: true },

  placesLocation: {
    type: [
      {
        name: String,
        url: String,
        showUrl: Boolean,
      }
    ],
    default: [],
  },

  latestPrice: { type: Number, default: 0 },
  oldPrice: { type: Number, default: 0 },

  duration: {
    value: { type: Number, default: 0 },
    unit: { type: String, default: 'day' },
  },

  packageCategories: {
    type: [String],
    default: [],
  },

  // Rating field
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },

  // Table of Content
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
        image: { type: String },
        alt: { type: String },
        content: { type: String, required: true },
        theme: {
          type: String,
          enum: ['theme1', 'theme2', 'theme3', 'theme4', 'theme5', 'theme6', 'theme7', 'theme8', 'theme9', 'theme10', 'theme11', 'theme12', 'theme13', 'theme14', 'theme15', 'theme16','theme17', 'theme18', 'theme19', 'theme20', 'theme21', 'theme22', 'theme23', 'theme24', 'theme25', 'theme26', 'theme27', 'theme28', 'theme29', 'theme30', 'theme31', 'theme32','theme33', 'theme34', 'theme35'],
        },
        subtitle: { type: String },
        idName: { type: String }, 
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

  locations: [{
    name: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    description: { type: String },
    image: { type: String },
    icon: {
      id: { type: Number },
      name: { type: String },
      url: { type: String },
    },
    rating: { type: Number },
    link: { type: String },
  }],

}, { timestamps: true });

// ✅ Register as 'Package' to match controller import
const Package = mongoose.model('Package', packagesSchema);

export default Package;
