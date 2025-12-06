
import Year from '../models/Year.js';

export const addYear = async (req, res) => {
  try {
    const { year } = req.body;
    if (!year) {
      return res.status(400).json({ success: false, message: 'Year is required' });
    }
    const newYear = new Year({ year });
    await newYear.save();
    res.status(201).json({ success: true, message: 'Year added successfully', year: newYear });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllYears = async (req, res) => {
  try {
    const years = await Year.find().sort({ year: -1 });
    res.json({ success: true, years });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteYearById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedYear = await Year.findByIdAndDelete(id);
    if (!deletedYear) {
      return res.status(404).json({ success: false, message: 'Year not found' });
    }
    res.json({ success: true, message: 'Year deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
