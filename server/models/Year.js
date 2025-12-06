
import mongoose from 'mongoose';

const yearSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    unique: true,
  },
});

const Year = mongoose.model('Year', yearSchema);

export default Year;
