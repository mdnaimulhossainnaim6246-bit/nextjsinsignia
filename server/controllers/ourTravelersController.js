import fs from 'fs';
import path from 'path';
import imagekit from '../configs/imageKit.js';
import OurTravelers from '../models/ourTravelers.js';

export const addOurTravelers = async (req, res) => {
  try {
    if (!req.body.ourTraveler) {
      return res.status(400).json({ success: false, message: "OurTraveler data missing" });
    }

    let ourTravelerData;
    try {
      ourTravelerData = JSON.parse(req.body.ourTraveler);
    } catch {
      return res.status(400).json({ success: false, message: "Invalid JSON format in ourTraveler field" });
    }

    const { title, subTitle, description, isPublished, socialMedia, seoData } = ourTravelerData;
    const files = req.files;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let imageUrl = '';
    let profileImageUrl = '';
    const images = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const fileBuffer = file.buffer;
        let uploadResponse;
        try {
          uploadResponse = await imagekit.upload({
            file: fileBuffer,
            fileName: file.originalname,
            folder: "/ourtravelers",
          });

          const optimizedUrl = imagekit.url({
            path: uploadResponse.filePath,
            transformation: [
              { quality: "auto" },
              { format: "webp" },
              { width: "1280" },
            ],
          });

          if (file.fieldname === 'image') {
            imageUrl = optimizedUrl;
          } else if (file.fieldname === 'profileImage') {
            profileImageUrl = optimizedUrl;
          } else {
            images.push(optimizedUrl);
          }
        } catch (uploadErr) {
          console.error("ImageKit Upload Error:", uploadErr);
          return res.status(500).json({
            success: false,
            message: "Image upload failed",
            error: uploadErr.message,
          });
        }
      }
    }

    await OurTravelers.create({
      title,
      subTitle,
      description,
      image: imageUrl,
      isPublished,
      profileChoose: profileImageUrl,
      socialMedia,
      images,
      seotitle: seoData?.seotitle,
      seodescription: seoData?.seodescription,
      seokeywords: seoData?.seokeywords,
    });

    return res.status(201).json({ success: true, message: "Added successfully" });
  } catch (error) {
    console.error("Error in addOurTravelers:", error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: error.message });
    }
    console.error("Unhandled error after headers sent:", error.message);
  }
};

export const updateOurTravelers = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "OurTraveler ID missing" });
    }

    if (!req.body.ourTraveler) {
      return res.status(400).json({ success: false, message: "OurTraveler data missing" });
    }

    let ourTravelerData;
    try {
      ourTravelerData = JSON.parse(req.body.ourTraveler);
    } catch {
      return res.status(400).json({ success: false, message: "Invalid JSON format in ourTraveler field" });
    }

    const { title, subTitle, description, isPublished, socialMedia, seoData } = ourTravelerData;
    const files = req.files;

    const ourTraveler = await OurTravelers.findById(id);
    if (!ourTraveler) {
      return res.status(404).json({ success: false, message: "OurTraveler not found" });
    }

    let imageUrl = ourTraveler.image;
    let profileImageUrl = ourTraveler.profileChoose;
    const images = ourTraveler.images || [];

    if (files && files.length > 0) {
      for (const file of files) {
        const fileBuffer = file.buffer;
        let uploadResponse;
        try {
          uploadResponse = await imagekit.upload({
            file: fileBuffer,
            fileName: file.originalname,
            folder: "/ourtravelers",
          });

          const optimizedUrl = imagekit.url({
            path: uploadResponse.filePath,
            transformation: [
              { quality: "auto" },
              { format: "webp" },
              { width: "1280" },
            ],
          });

          if (file.fieldname === 'image') {
            if (imageUrl) {
              const oldImageFileId = imageUrl.split('/').pop().split('.')[0];
              try {
                await imagekit.deleteFile(oldImageFileId);
              } catch (deleteErr) {
                console.error("Old image deletion failed:", deleteErr.message);
              }
            }
            imageUrl = optimizedUrl;
          } else if (file.fieldname === 'profileImage') {
            if (profileImageUrl) {
              const oldImageFileId = profileImageUrl.split('/').pop().split('.')[0];
              try {
                await imagekit.deleteFile(oldImageFileId);
              } catch (deleteErr) {
                console.error("Old image deletion failed:", deleteErr.message);
              }
            }
            profileImageUrl = optimizedUrl;
          } else {
            images.push(optimizedUrl);
          }
        } catch (uploadErr) {
          console.error("ImageKit Upload Error:", uploadErr);
          return res.status(500).json({
            success: false,
            message: "Image upload failed",
            error: uploadErr.message,
          });
        }
      }
    }

    ourTraveler.title = title;
    ourTraveler.subTitle = subTitle;
    ourTraveler.description = description;
    ourTraveler.isPublished = isPublished;
    ourTraveler.profileChoose = profileImageUrl;
    ourTraveler.socialMedia = socialMedia;
    ourTraveler.image = imageUrl;
    ourTraveler.images = images;
    ourTraveler.seotitle = seoData?.seotitle;
    ourTraveler.seodescription = seoData?.seodescription;
    ourTraveler.seokeywords = seoData?.seokeywords;

    await ourTraveler.save();

    return res.json({ success: true, message: "OurTraveler updated successfully" });
  } catch (error) {
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: error.message });
    }
    console.error("Unhandled error after headers sent:", error.message);
  }
};

export const getAllOurTravelers = async (req, res) => {
  try {
    const ourTravelers = await OurTravelers.find().sort({ createdAt: -1 });
    return res.json({ success: true, ourTraveler: ourTravelers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOurTravelersById = async (req, res) => {
  try {
    const { ourTravelerId } = req.params;
    if (!ourTravelerId) {
      return res.status(400).json({ success: false, message: "OurTraveler ID missing" });
    }

    const ourTraveler = await OurTravelers.findById(ourTravelerId);
    if (!ourTraveler) {
      return res.status(404).json({ success: false, message: "OurTraveler not found" });
    }
    return res.json({ success: true, ourTraveler });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteOurTravelersById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: "OurTraveler ID missing" });
    }
    const deleted = await OurTravelers.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "OurTraveler not found" });
    }
    return res.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const togglePublishOurTravelers = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: "OurTraveler ID missing" });
    }

    const ourTraveler = await OurTravelers.findById(id);
    if (!ourTraveler) {
      return res.status(404).json({ success: false, message: "OurTraveler not found" });
    }
    ourTraveler.isPublished = !ourTraveler.isPublished;
    await ourTraveler.save();
    return res.json({ success: true, message: "Post status updated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

