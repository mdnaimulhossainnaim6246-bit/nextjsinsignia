import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['path', 'url'],
    default: 'path',
  },
  value: {
    type: String,
    trim: true,
  },
  displayText: {
    type: String,
    trim: true,
  },
});

const mainThemeSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    trim: true,
  },
  subtitle: {
    type: String,
    trim: true,
  },
  link: linkSchema,
});

const subThemeSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  subtitle: {
    type: String,
    trim: true,
  },
  mediaSourceType: {
    type: String,
    enum: ['upload', 'url'],
    default: 'upload',
  },
  mediaValue: {
    type: String,
    required: true,
  },
  link: linkSchema,
});

const themeSchema = new mongoose.Schema({
  // Use a fixed ID for singleton pattern
  singleton: {
    type: String,
    default: 'main_theme',
    unique: true,
  },
  mainTheme: mainThemeSchema,
  subThemes: [subThemeSchema],
}, {
  timestamps: true
});

const Theme = mongoose.model("Theme", themeSchema);

export default Theme;
