import AboutNumber from '../models/aboutnumber.js';

export const getAboutNumber = async (req, res) => {
  try {
    let numbers = await AboutNumber.findOne();
    if (!numbers) {
      numbers = await AboutNumber.create({});
    }
    res.json({ success: true, numbers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAboutNumber = async (req, res) => {
  try {
    const numbers = await AboutNumber.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json({ success: true, message: 'Numbers updated successfully', numbers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};