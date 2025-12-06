import Popup from '../models/Popup.js';

export const createPopup = async (req, res) => {
    try {
        const { popupType, title, content, image, viewLink, timer } = req.body;

        const filter = { popupType };
        const update = { title, content, image, viewLink, timer, createdAt: new Date() };
        const options = { new: true, upsert: true };

        const newPopup = await Popup.findOneAndUpdate(filter, update, options);

        res.status(201).json(newPopup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPopups = async (req, res) => {
    try {
        const popups = await Popup.find();
        res.status(200).json(popups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePopup = async (req, res) => {
    try {
        await Popup.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Popup deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
