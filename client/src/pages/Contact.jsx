import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import CountrySelector from '../components/CountrySelector'; 
import './Contact.css';
import ImageCropper from '../components/ImageCropper';
import Mobailenav from '../components/Mobailenav';
import LandingFooter from '../components/LandingFooter';
import Loader from '../components/Loader';
// import defaultProfileImage from '../../public/assets/uploade-profail (1).png';


const Contact = () => {
  const navigate = useNavigate();
  const { axios } = useAppContext();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(false); 
  }, []);

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState(null);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  // const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [profileImage, setProfileImage] = useState('/assets/profail-damo-pic.png');

  const [croppedImage, setCroppedImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  

  const handleCountryChange = (selectedCountry) => {
    setCountry(selectedCountry);
    if (errors.country) {
      setErrors({ ...errors, country: '' });
    }
  };

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setProfileImage(reader.result);
        setShowCropper(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onSave = () => {
    setCroppedImage(profileImage);
    setShowCropper(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!fullName) newErrors.fullName = 'Please enter your Full Name.';
    if (!age) newErrors.age = 'Please enter your Age.';
    if (!gender) newErrors.gender = 'Please select your gender.';
    if (!country) newErrors.country = 'Please select your country.';
    if (!phone) newErrors.phone = 'Please enter your Whatsapp number.';
    if (!email) newErrors.email = 'Please enter your Email.';
    if (!message) newErrors.message = 'Message is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('age', age);
    formData.append('gender', gender);
    formData.append('country', JSON.stringify(country));
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('message', message);
    
    if (croppedImage) {
      const blob = await fetch(croppedImage).then(r => r.blob());
      formData.append('profileImage', blob, 'profile.jpg');
    }

    try {
      await axios.post('/api/contact', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Message sent successfully!');
      navigate('/');
    } catch (error) {
      console.error('Contact Form Error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to send message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
    <Mobailenav/>
        <div style={{background:'linear-gradient(135deg, rgb(44, 82, 130) 0%, rgb(74, 144, 189) 100%)',padding:"16px 0px"}}>
        <h1 className='contact-h1-title'>Contact Us</h1>
        <h3 className='contact-h3-subtitle'>We'd love to hear from you! Please fill out the form below.</h3>
        </div>
    <div className='contact-container-div'>
 
      
      <div className="contact-container">
        <div>

          <div style={{marginBottom:"1rem"}}>
           <div style={{display:"flex"}}><img style={{width:'38px',height:"100%"}} src="/assets/favicon.png" alt="LOGO-FAVICON" /><h2 style={{fontSize:'22px',fontWeight:'500',color:'#4a90bd',padding:'0',margin:"0 0 15px 5px",
            borderBottom:'3px solid #4a90bd'
           }}> How to reach us</h2>
           </div> 
           <p style={{color:"#2c5282",textAlign:'left',fontSize:"16px",fontFamily:'Lisu Bosa',fontStyle:'italic'}}>(For your convenience and to ensure our well-organized service, please send us an email with all the necessary details. Our team will respond to your email as quickly as possible.
              Alternatively, if you wish, you can also contact our CEO directly via WhatsApp.
              If you need to meet us at the office, please make sure to schedule an appointment in advance so that we can allocate the appropriate time and provide you with proper service.)
            </p>
            </div>

            <div style={{marginBottom:"0.5rem"}}>
            <h3 style={{color:"#111",textAlign:"left",fontWeight:'600'}}>Address:</h3>
            <ul style={{textDecoration:'none',color:'#333',textAlign:'left',fontSize:'15px',fontFamily:'Ubuntu'}}>
              <li> H 6/8, Road:18</li>
              <li>Block B,Section 10</li>
              <li>Mirpur,Dhaka 1216</li>
              <li>Bangladesh.</li>
            </ul>
            </div>

            <div style={{marginBottom:"0.5rem"}} >
            <h3 style={{color:"#111",textAlign:"left",fontWeight:'600'}}>Phone:</h3>
            <ul style={{textDecoration:'none',color:'#333',textAlign:'left',fontSize:'15px',fontFamily:'Ubuntu'}}>
              <li> +880 161 357 3693</li>
              <p style={{fontFamily:'lisu bosa',fontStyle:'italic',fontSize:'14px',color:'#444'}}>📞 24/7 service availability <br />
                 ⚠️ Temporary unavailability only for personal emergencies <br />
                 💬 Quickest way to reach out: WhatsApp or email
              </p>
            </ul>
            </div>

            <div style={{marginBottom:"0.5rem"}}>
            <h3 style={{color:"#111",textAlign:"left",fontWeight:'600'}}>WhatsApp:</h3>
            <ul style={{textDecoration:'none',color:'#333',textAlign:'left',fontSize:'15px',fontFamily:'Ubuntu'}}>
              <li className='contact__whatsapp-link'>
                <a
                 href="https://wa.me/8801613573693"
                 target="_blank"
                 rel="noopener noreferrer"
                 style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
               >
                 <i className="fa-brands fa-whatsapp"></i>
                 <span className='contact__whatsapp-link-span' style={{ paddingLeft: '4px' }}>+880 1613-573693</span>
               </a>
               </li>
               <br />
              <li className='contact__whatsapp-link'>
                <a
                 href="https://wa.me/8801977784132"
                 target="_blank"
                 rel="noopener noreferrer"
                 style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
               >
                 <i className="fa-brands fa-whatsapp"></i>
                 <span className='contact__whatsapp-link-span' style={{ paddingLeft: '4px' }}>+880 1977-784132</span> 
                 <p style={{color:"#222",fontFamily:"lisu bosa",fontSize:"12px",fontStyle:'italic',textDecoration:"none",paddingLeft:'5px'}}>(CEO)</p>
               </a>
               </li>
               <br />
              <li className='contact__whatsapp-link'>
                <a
                 href="https://wa.me/8801750836862"
                 target="_blank"
                 rel="noopener noreferrer"
                 style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
               >
                 <i className="fa-brands fa-whatsapp"></i>
                 <span className='contact__whatsapp-link-span' style={{ paddingLeft: '4px' }}>+880 1750-836862</span> 
                 <p style={{color:"#222",fontFamily:"lisu bosa",fontSize:"12px",fontStyle:'italic',textDecoration:"none",paddingLeft:'5px'}}>(CEO)</p>
               </a>
               </li>

              {/* <p style={{fontFamily:'lisu bosa',fontStyle:'italic',fontSize:'14px',color:'#444'}}> ()
              </p> */}
            </ul>
            </div>

            <div>
            <h3 style={{color:"#111",textAlign:"left",fontWeight:'600'}}>Email:</h3>
            <ul style={{textDecoration:'none',color:'#333',textAlign:'left',fontSize:'15px',fontFamily:'Ubuntu'}}>
              <li className="contact__email-link">
                <a
                   href="https://mail.google.com/mail/?view=cm&to=insigniatoursandtravel@gmail.com"
        target="_blank"
        rel="noopener noreferrer"
                   style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', cursor: 'pointer' }}

                 >
                   <i className="fa-regular fa-envelope"></i>
                   <span className="contact__email-link-span" style={{ paddingLeft: '4px' }}>insigniatoursandtravel@gmail.com</span>
                 </a>
              </li>

              {/* <p style={{fontFamily:'lisu bosa',fontStyle:'italic',fontSize:'14px',color:'#444'}}> (Click here to send an email)
              </p> */}
            </ul>
            </div>

        </div>


        <div style={{marginBottom:"2rem",marginTop:"1rem"}}>
           <div style={{display:"flex"}}><img style={{width:'38px',height:"100%"}} src="/assets/favicon.png" alt="LOGO-FAVICON" /><h2 style={{fontSize:'22px',fontWeight:'500',color:'#4a90bd',padding:'0',margin:"0 0 15px 5px",
            borderBottom:'3px solid #4a90bd'
           }}> Send us a massage</h2>
           </div> 
           <p style={{color:"#2c5282",textAlign:'left',fontSize:"16px",fontFamily:'Lisu Bosa',fontStyle:'italic'}}>(Please fill out the form below with your details and message. We will get back to you as soon as possible.)
            </p>
            </div>

        <form onSubmit={handleSubmit} className="contact-form" noValidate>
          {/* <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required className={`${errors.fullName ? 'error' : ''}`} />
            {errors.fullName && <p className="error-message">{errors.fullName}</p>}
          </div> */}
          <>
          <style>
          </style>
          
          <div className="form-group profile-image-container">
            <label htmlFor="profileImage">Upload Your Photo <span style={{fontStyle:'italic',fontSize:'16px',fontFamily:'lisu bosa'}}>(Optional)</span></label>
            <input type="file" accept="image/*" onChange={onFileChange} style={{ display: 'none' }} id="profileImage" />
            <div className="profile-image-preview-container">
              <label htmlFor="profileImage">
                <img src={croppedImage || profileImage} alt="Profile" className="profile-image-preview" />
              </label>
              {croppedImage && <button type="button" onClick={() => setShowCropper(true)} className="edit-button"><i className="fa-solid fa-pen-to-square"></i></button>}
            </div>
            {showCropper && (
              <ImageCropper
                initialImage={profileImage}
                onCropComplete={(croppedImageResult) => {
                  setCroppedImage(croppedImageResult);
                  setShowCropper(false);
                }}
                onCancel={() => setShowCropper(false)}
                onSave={onSave}
              />
            )}
          </div>

          <div className="form-group">
            <fieldset className={`form-group ${errors.gender ? 'error' : ''}`}>
              <legend>Gender</legend>
              <div>
              <input type="radio" id="male" name="gender" value="male" onChange={(e) => setGender(e.target.value)} required />
              <label htmlFor="male">Male</label>
              <input type="radio" id="female" name="gender" value="female" onChange={(e) => setGender(e.target.value)} required />
              <label htmlFor="female">Female</label>
              </div>
            </fieldset>
            {errors.gender && <p className="error-message">{errors.gender}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your Full Name"
              required
              className={`${errors.fullName ? 'error' : ''}`}
            />
            {errors.fullName && <p className="error-message">{errors.fullName}</p>}
          </div>
        </>


          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input type="number" id="age placeholder-text" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Your Age" required className={`${errors.age ? 'error' : ''}`} />
            {errors.age && <p className="error-message">{errors.age}</p>}
          </div>


          <div className="form-group">
            <label htmlFor="country">Country</label>
            {/* <div className={`${errors.country ? 'error' : ''}`}>
              <CountrySelector value={country ? country.name : ''} onChange={handleCountryChange} />
            </div> */}
            <div className={`country-wrapper ${errors.country ? 'error-border' : ''}`}>
                <CountrySelector value={country ? country.name : ''} onChange={handleCountryChange} />
           </div>


            {errors.country && <p className="error-message">{errors.country}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">WhatsApp Number</label>
            {/* <div className={`${errors.phone ? 'error' : ''}`}>
              <PhoneInput
                country={'us'} 
                value={phone}
                onChange={setPhone}
                inputProps={{
                  required: true,
                }}
              />
            </div> */}
            <div className={`phone-wrapper ${errors.phone ? 'error-border' : ''}`}>
              <PhoneInput
                country={'us'}
                value={phone}
                onChange={setPhone}
                inputProps={{ required: true }}
              />
            </div>

            {errors.phone && <p className="error-message">{errors.phone}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Email" required className={`${errors.email ? 'error' : ''}`} />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message" required className={`${errors.message ? 'error' : ''}`}></textarea>
            {errors.message && <p className="error-message">{errors.message}</p>}
          </div>

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
    <LandingFooter/>
    </>
  );
};

export default Contact;
