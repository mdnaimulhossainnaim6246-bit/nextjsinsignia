import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import '../../individualCSS/admin/AdminTheme.css';
import Loader from '../../components/Loader';

const AdminTheme = () => {
  const { axios } = useAppContext();
  const [loading, setLoading] = useState(true);

  // State for the main theme block
  const [mainTheme, setMainTheme] = useState({
    title: '',
    subtitle: '',
    image: '',
    imagePreview: '',
    imageFile: null,
    link: { type: 'path', value: '', displayText: '' },
  });

  // State for the sub-themes
  const [subThemes, setSubThemes] = useState([]);

  // Fetch initial theme data on component mount
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const res = await axios.get('/api/theme');
        if (res.data.success && res.data.theme) {
          const { mainTheme: fetchedMain, subThemes: fetchedSub } = res.data.theme;
          if (fetchedMain) {
            setMainTheme({ ...fetchedMain, imagePreview: fetchedMain.image || '' });
          }
          if (fetchedSub) {
            // Set imagePreview for each sub-theme for display purposes
            setSubThemes(fetchedSub.map(st => ({ ...st, imagePreview: st.mediaValue, imageFile: null })));
          }
        }
      } catch (error) {
        toast.error('Failed to fetch theme data.');
      } finally {
        setLoading(false);
      }
    };
    fetchTheme();
  }, [axios]);

  // Handlers for the Main Theme section
  const handleMainThemeChange = (e) => {
    const { name, value } = e.target;
    setMainTheme(prev => ({ ...prev, [name]: value }));
  };

  const handleMainLinkChange = (e) => {
    const { name, value } = e.target;
    setMainTheme(prev => ({ ...prev, link: { ...prev.link, [name]: value } }));
  };

  const handleMainLinkTypeChange = (type) => {
    setMainTheme(prev => ({ ...prev, link: { ...prev.link, type, value: '' } }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainTheme(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  // Handlers for the Sub-Themes section
  const handleSubThemeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSubThemes = [...subThemes];
    updatedSubThemes[index][name] = value;
    setSubThemes(updatedSubThemes);
  };

  const handleSubThemeLinkChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSubThemes = [...subThemes];
    updatedSubThemes[index].link[name] = value;
    setSubThemes(updatedSubThemes);
  };

  const handleSubThemeLinkTypeChange = (index, type) => {
    const updatedSubThemes = [...subThemes];
    updatedSubThemes[index].link.type = type;
    updatedSubThemes[index].link.value = '';
    setSubThemes(updatedSubThemes);
  };

  const handleSubThemeSourceTypeChange = (index, type) => {
    const updatedSubThemes = [...subThemes];
    updatedSubThemes[index].mediaSourceType = type;
    updatedSubThemes[index].mediaValue = '';
    updatedSubThemes[index].imagePreview = '';
    updatedSubThemes[index].imageFile = null;
    setSubThemes(updatedSubThemes);
  };

  const handleSubThemeMediaChange = (index, e) => {
    const { name, value, files } = e.target;
    const updatedSubThemes = [...subThemes];
    const currentSubTheme = updatedSubThemes[index];

    if (currentSubTheme.mediaSourceType === 'upload' && files && files[0]) {
      const file = files[0];
      currentSubTheme.imageFile = file;
      currentSubTheme.imagePreview = URL.createObjectURL(file);
      currentSubTheme.mediaValue = ''; // Clear existing mediaValue since a new file is uploaded
    } else if (currentSubTheme.mediaSourceType === 'url') {
      currentSubTheme.mediaValue = value;
      currentSubTheme.imagePreview = value; // Preview the image from the URL
      currentSubTheme.imageFile = null;
    }
    setSubThemes(updatedSubThemes);
  };

  const addSubTheme = () => {
    setSubThemes([...subThemes, {
      title: '',
      subtitle: '',
      mediaSourceType: 'upload',
      mediaValue: '',
      imagePreview: '',
      imageFile: null,
      link: { type: 'path', value: '', displayText: '' },
    }]);
  };

  const removeSubTheme = (index) => {
    if (window.confirm('Are you sure you want to remove this sub-theme?')) {
      setSubThemes(subThemes.filter((_, i) => i !== index));
      toast.success('Sub-theme removed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Saving theme...');

    const formData = new FormData();

    // 1. Main Theme Data
    const mainThemeForUpload = { ...mainTheme };
    delete mainThemeForUpload.imagePreview; // Remove frontend-only state
    delete mainThemeForUpload.imageFile;    // Remove frontend-only state
    formData.append('mainTheme', JSON.stringify(mainThemeForUpload));
    if (mainTheme.imageFile) {
      formData.append('mainThemeImage', mainTheme.imageFile);
    }

    // 2. Sub-Themes Data
    const subThemesForUpload = subThemes.map(st => {
        const { imagePreview, imageFile, ...rest } = st; // Strip frontend-only state
        return rest;
    });

    formData.append('subThemes', JSON.stringify(subThemesForUpload));
    subThemes.forEach((st) => {
      if (st.mediaSourceType === 'upload' && st.imageFile) {
        formData.append('subThemeImages', st.imageFile);
      }
    });

    try {
      await axios.post('/api/theme', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Theme saved successfully!', { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submit failed', { id: toastId });
    }
  };

  if (loading) return <Loader />;

  // Main Render
  return (
    <div className="admin-theme-page">
      <h2 className="admin-theme-header">Theme Management</h2>
      <form className="admin-theme-form" onSubmit={handleSubmit}>
        
        {/* Main Theme Block */}
        <div className="theme-block">
          <h3>Main Theme</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Title</label>
              <input type="text" name="title" value={mainTheme.title} onChange={handleMainThemeChange} />
            </div>
            <div className="form-group">
              <label>Subtitle</label>
              <input type="text" name="subtitle" value={mainTheme.subtitle} onChange={handleMainThemeChange} />
            </div>
            {/* Main Theme Image Input with Preview */}
            <div className="form-group">
                <label>Image</label>
                <label className="thumbnail-label" htmlFor="main-image-input">
                    {!mainTheme.imagePreview ? (
                        <i className="thumbnail-icon fa-solid fa-cloud-arrow-up"></i>
                    ) : (
                        <img src={mainTheme.imagePreview} alt="Main theme preview" className="image-preview" />
                    )}
                </label>
                <input id="main-image-input" onChange={handleMainImageChange} type="file" accept="image/*" hidden />
            </div>
            <div className="form-group">
              <label>Link Type</label>
              <div className="checkbox-group">
                <label><input type="checkbox" checked={mainTheme.link.type === 'path'} onChange={() => handleMainLinkTypeChange('path')} /> Path</label>
                <label><input type="checkbox" checked={mainTheme.link.type === 'url'} onChange={() => handleMainLinkTypeChange('url')} /> URL</label>
              </div>
              <input type="text" name="value" placeholder={`Enter ${mainTheme.link.type}`} value={mainTheme.link.value} onChange={handleMainLinkChange} />
            </div>
            <div className="form-group">
                <label>Link Display Text</label>
                <input type="text" name="displayText" placeholder="e.g., Learn More" value={mainTheme.link.displayText} onChange={handleMainLinkChange} />
            </div>
          </div>
        </div>

        {/* Sub Themes Block */}
        <div className="theme-block">
          <div className="sub-theme-header">
            <h3>Sub Themes</h3>
            <button type="button" className="add-sub-theme-btn" onClick={addSubTheme}>+ Add Sub Theme</button>
          </div>
          {subThemes.map((sub, index) => (
            <div key={index} className="theme-block" style={{marginTop: '1rem', borderLeftColor: '#27ae60'}}>
              <h4>Sub Theme #{index + 1}</h4>
              <div className="form-grid">
                <div className="form-group"><label>Title</label><input type="text" name="title" value={sub.title} onChange={(e) => handleSubThemeChange(index, e)} /></div>
                <div className="form-group"><label>Subtitle</label><input type="text" name="subtitle" value={sub.subtitle} onChange={(e) => handleSubThemeChange(index, e)} /></div>
                
                {/* Sub Theme Image Source Input */}
                <div className="form-group">
                  <label>Image Source</label>
                  <div className="checkbox-group">
                    <label><input type="checkbox" checked={sub.mediaSourceType === 'upload'} onChange={() => handleSubThemeSourceTypeChange(index, 'upload')} /> Image Upload</label>
                    <label><input  type="checkbox" checked={sub.mediaSourceType === 'url'} onChange={() => handleSubThemeSourceTypeChange(index, 'url')} /> Image URL</label>
                  </div>
                  {sub.mediaSourceType === 'upload' ? (
                    <label className="thumbnail-label" htmlFor={`sub-image-input-${index}`}>
                        {!sub.imagePreview ? (
                            <i className="thumbnail-icon fa-solid fa-cloud-arrow-up"></i>
                        ) : (
                            <img src={sub.imagePreview} alt={`Sub-theme ${index+1} preview`} className="image-preview" />
                        )}
                    </label>
                  ) : (
                    <input style={{color:'#333'}} type="url" name="mediaValue" placeholder="Enter image URL" value={sub.mediaValue} onChange={(e) => handleSubThemeMediaChange(index, e)} />
                  )}
                   <input id={`sub-image-input-${index}`} onChange={(e) => handleSubThemeMediaChange(index, e)} type="file" accept="image/*" hidden />
                </div>

                <div className="form-group">
                  <label>Link Type</label>
                  <div className="checkbox-group">
                    <label><input type="checkbox" checked={sub.link.type === 'path'} onChange={() => handleSubThemeLinkTypeChange(index, 'path')} /> Path</label>
                    <label><input type="checkbox" checked={sub.link.type === 'url'} onChange={() => handleSubThemeLinkTypeChange(index, 'url')} /> URL</label>
                  </div>
                  <input type="text" name="value" placeholder={`Enter ${sub.link.type}`} value={sub.link.value} onChange={(e) => handleSubThemeLinkChange(index, e)} />
                </div>
                <div className="form-group">
                    <label>Link Display Text</label>
                    <input type="text" name="displayText" placeholder="e.g., View Details" value={sub.link.displayText} onChange={(e) => handleSubThemeLinkChange(index, e)} />
                </div>
              </div>
              <button type="button" className="remove-sub-theme-btn" onClick={() => removeSubTheme(index)}>Remove</button>
            </div>
          ))}
        </div>

        <button type="submit" className="submit-btn">Save Theme</button>
      </form>
    </div>
  );
};

export default AdminTheme;
