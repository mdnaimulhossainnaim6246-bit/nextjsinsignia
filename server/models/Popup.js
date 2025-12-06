import mongoose from 'mongoose';

const popupSchema = new mongoose.Schema({
    popupType: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    viewLink: { type: String },
    timer: {
        days: { type: Number, default: 0 },
        hours: { type: Number, default: 0 },
    },
    createdAt: { type: Date, default: Date.now }
});

const Popup = mongoose.model('Popup', popupSchema);

export default Popup;
