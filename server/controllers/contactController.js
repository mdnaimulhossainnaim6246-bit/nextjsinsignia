import { sendContactEmail } from '../utils/sendContactEmail.js';

export const handleContactForm = async (req, res) => {
  try {
    const contactData = req.body;
    const profileImage = req.file;

    await sendContactEmail({ ...contactData, profileImage });

    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error handling contact form:', error);
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
};
