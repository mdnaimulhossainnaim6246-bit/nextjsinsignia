import Theme from "../models/Theme.js";
import imageKit from "../configs/imageKit.js";

// Use a singleton approach - there is only one theme document
const THEME_ID = 'main_theme';

export const getTheme = async (req, res) => {
  try {
    const theme = await Theme.findOne({ singleton: THEME_ID });
    if (!theme) {
      // If no theme exists, return a default structure
      return res.status(200).json({
        success: true,
        message: "No theme found, returning default structure.",
        theme: {
          mainTheme: { title: '', subtitle: '', image: '', link: { type: 'path', value: '', displayText: '' }},
          subThemes: [],
        },
      });
    }
    res.status(200).json({ success: true, theme });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while fetching theme.", error: error.message });
  }
};

export const createOrUpdateTheme = async (req, res) => {
  try {
    const { mainTheme, subThemes } = req.body;
    let parsedMainTheme = JSON.parse(mainTheme);
    let parsedSubThemes = JSON.parse(subThemes);

    const mainThemeFile = req.files?.mainThemeImage?.[0];
    
    // Handle main theme image upload
    if (mainThemeFile) {
      const mainThemeUpload = await imageKit.upload({
        file: mainThemeFile.buffer,
        fileName: `theme_main_${Date.now()}`,
        folder: "themes"
      });
      parsedMainTheme.image = mainThemeUpload.url;
    }

    // Handle sub-theme image uploads
    const subThemeFiles = req.files?.subThemeImages;
    if (subThemeFiles && subThemeFiles.length > 0) {
      let fileCounter = 0;
      for (let i = 0; i < parsedSubThemes.length; i++) {
        // Only upload if the source is 'upload' and a file was provided for it.
        // The frontend should ensure that for 'upload' types, a file is present.
        if (parsedSubThemes[i].mediaSourceType === 'upload' && fileCounter < subThemeFiles.length) {
          // A simple way to check if this subtheme corresponds to the next file
          // This relies on the order of sub-themes and files being the same.
          // A more robust solution might involve unique IDs if order is not guaranteed.
          if (!parsedSubThemes[i].mediaValue) { // If mediaValue is cleared, it means a new file was uploaded.
            const file = subThemeFiles[fileCounter];
            const subThemeUpload = await imageKit.upload({
              file: file.buffer,
              fileName: `theme_sub_${i}_${Date.now()}`,
              folder: "themes"
            });
            parsedSubThemes[i].mediaValue = subThemeUpload.url;
            fileCounter++;
          }
        }
      }
    }

    // Rename 'image' back to 'mediaValue' for subThemes to match the schema
    const finalSubThemes = parsedSubThemes.map(st => {
      if (st.image) {
        st.mediaValue = st.image;
        delete st.image;
      }
      return st;
    });

    const themeData = {
      singleton: THEME_ID,
      mainTheme: parsedMainTheme,
      subThemes: finalSubThemes,
    };

    const updatedTheme = await Theme.findOneAndUpdate(
      { singleton: THEME_ID },
      themeData,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({ success: true, message: "Theme updated successfully", theme: updatedTheme });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while updating theme.", error: { message: error.message, stack: error.stack, name: error.name } });
  }
};
