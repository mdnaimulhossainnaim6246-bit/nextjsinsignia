import multer from "multer";

// Using memoryStorage to handle files as buffers
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: {
    fieldSize: 10 * 1024 * 1024, // Increase field size limit to 10MB
  }
});

export default upload;