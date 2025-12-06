import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import CountrySelector from '../components/CountrySelector';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ImageCropper from '../components/ImageCropper';
import Mobailenav from '../components/Mobailenav';
import LandingFooter from '../components/LandingFooter';
import styles from './Booking.module.css';
// import favicon from '../../public/assets/favicon.png';

const Booking = () => {
  const { placename } = useParams();
  const navigate = useNavigate();
  const { axios } = useAppContext();
  const [packageDetails, setPackageDetails] = useState(null);
  const [packageThumbnailBase64, setPackageThumbnailBase64] = useState('');
  const [loading, setLoading] = useState(true);

  const [numberOfPersons, setNumberOfPersons] = useState('');
  const [pricePerPerson, setPricePerPerson] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [gender, setGender] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');
  const [tourDate, setTourDate] = useState(null);
  const [otherTravelers, setOtherTravelers] = useState('');
  const [showOtherTravelers, setShowOtherTravelers] = useState(false);
  const defaultProfileImage = '/assets/profail-damo-pic.png';
  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [pickupAddress, setPickupAddress] = useState('');
  const [clientProblem, setClientProblem] = useState('');
  const [option1, setOption1] = useState(false);
  const [option2, setOption2] = useState(false);

  const handleCountryChange = (selectedCountry) => {
    if (selectedCountry) {
      setCountry(selectedCountry.name);
      setErrors({ ...errors, country: '' });
    } else {
      setCountry('');
    }
  };

  const handleInputChange = (setter, fieldName) => (e) => {
    setter(e.target.value);
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: '' });
    }
  };

  const handleNumberOfPersonsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNumberOfPersons(value);
    if (errors.numberOfPersons) {
      setErrors({ ...errors, numberOfPersons: '' });
    }
  };

  useEffect(() => {
    if (numberOfPersons > 1) {
      setShowOtherTravelers(true);
    } else {
      setShowOtherTravelers(false);
    }
  }, [numberOfPersons]);

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

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const res = await axios.get(`/addpackages/by-placename/${decodeURIComponent(placename)}`);
        if (res.data?.packages) {
          setPackageDetails(res.data.packages);
          setPricePerPerson(res.data.packages.latestPrice || 0);
        } else {
          toast.error('Package not found');
          navigate('/');
        }
      } catch {
        toast.error('Failed to load package details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchPackageDetails();
  }, [placename, axios, navigate]);

  useEffect(() => {
    if (packageDetails?.image) {
      fetch(packageDetails.image)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch package image');
          return res.blob();
        })
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPackageThumbnailBase64(reader.result);
          };
          reader.readAsDataURL(blob);
        })
        .catch(err => {
          console.error("Package image to Base64 conversion failed:", err);
        });
    }
  }, [packageDetails]);

  useEffect(() => {
    if (!packageDetails) return;
    const basePrice = packageDetails.latestPrice || 0;
    let newPricePerPerson = basePrice;
    if (numberOfPersons === 3) newPricePerPerson = basePrice * 1.25;
    else if (numberOfPersons === 2) newPricePerPerson = basePrice * 1.45;
    else if (numberOfPersons === 1) newPricePerPerson = basePrice * 1.80;
    setPricePerPerson(newPricePerPerson);
    setTotalCost(newPricePerPerson * numberOfPersons);
  }, [numberOfPersons, packageDetails]);

  const validateForm = () => {
    const newErrors = {};
    // if (!numberOfPersons) newErrors.numberOfPersons = 'Please select the number of persons.';
     if (!numberOfPersons) newErrors.numberOfPersons = 'Please select the number of persons.';
    if (!gender) newErrors.gender = 'Please select a gender.';
    if (!fullName) newErrors.fullName = 'Full name is required.';
    if (!age) newErrors.age = 'Age is required.';
    if (!country) newErrors.country = 'Please select your country.';
    //  if (!numberOfPersons) newErrors.numberOfPersons = 'Please select the number of persons.';
    if (!phone) newErrors.phone = 'Please enter a phone number.';
    if (!email) newErrors.email = 'Email is required.';
    if (!tourDate) newErrors.tourDate = 'Please select a tour date.';
    // if (!phone) newErrors.phone = 'Please enter a phone number.';
    // if (!email) newErrors.email = 'Email is required.';
    if (!option1 || !option2) newErrors.options = 'You must agree to both options.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill in all required fields and agree to the options.');
      return;
    }
    if (!packageDetails?._id) return toast.error('Package details missing.');
    
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('packageId', packageDetails._id);
    formData.append('numberOfPersons', numberOfPersons);
    formData.append('pricePerPerson', pricePerPerson);
    formData.append('totalCost', totalCost);
    formData.append('gender', gender || '');
    formData.append('fullName', fullName);
    formData.append('age', age);
    formData.append('country', country);
    formData.append('tourDate', tourDate.toISOString());
    formData.append('otherTravelers', otherTravelers || '');
    formData.append('phone', phone || '');
    formData.append('email', email);
    formData.append('notes', notes || '');
    formData.append('packageThumbnailBase64', packageThumbnailBase64);
    formData.append('pickupAddress', pickupAddress || '');
    formData.append('clientProblem', clientProblem || '');
    formData.append('option1', option1);
    formData.append('option2', option2);
    if (croppedImage) {
      const blob = await fetch(croppedImage).then(r => r.blob());
      formData.append('profileImage', blob, 'profile.jpg');
    }

    try {
      await axios.post('/api/package-orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Booking submitted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Booking Error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to submit booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (!packageDetails) return <div>Package not found.</div>;

  return (
    <>
      <Mobailenav />
      <div className={styles.bookingContainerDiv}>
        <div className={styles.bookingHeader}>
          <h1 className={styles.bookingH1Title}>Booking for {packageDetails.place}</h1>
          <h3 className={styles.bookingH3Subtitle}>Fill out the form below to confirm your trip!</h3>
        </div>
        <div className={styles.bookingContainer}>
          <div className={styles.infoGrid}>
            <div className={styles.infoSection}>

              <div style={{display:"flex"}} >
                <img style={{width:'38px',height:"100%"}}  src='/assets/favicon.png' alt="LOGO-FAVICON" />
                <h2>Introduction</h2>
                </div>
                <p>Please fill out the form below to confirm your trip date. We will contact you shortly and, based on your preferences, comfort, and budget, prepare a complete plan for the package you have chosen. We are fully committed to ensuring that you do not face any inconvenience or uncomfortable situation at any stage.</p>
            </div>

            <div className={styles.infoSection}>
              <div style={{display:"flex"}} >
                <img style={{width:'38px',height:"100%"}}  src='/assets/favicon.png' alt="LOGO-FAVICON" />
                <h2>How to Pay Us</h2>
                </div>

                <p>You can make payments using any standard method that is convenient for you in Bangladesh, such as local bank transfers, cards, or other popular digital payment options. No advance payment is required. At the second step of communication, after a face-to-face meeting, you can choose to pay a part of the agreed amount, or schedule the full payment at your convenience.

                   You are welcome to try our free package plan or explore a specific area with us before making any payment. Once you feel comfortable and secure, you can proceed with your preferred payment method. We ensure that all payments are processed safely and smoothly, allowing you to focus on planning your trip without any stress.
                   
                   If our service does not meet your expectations during the free short tour, you can cancel your booking without any additional charges.
                   
                   (Generally, we collect the trip cost in installments. However, if for personal reasons you wish to pay the full amount at the end of the trip, we may require some additional information to ensure security.)</p>
            </div>
            <div className={styles.infoSection}>
              <div style={{display:"flex"}} >
                <img style={{width:'38px',height:"100%"}}  src='/assets/favicon.png' alt="LOGO-FAVICON" />
                <h2>Your Needs & Preferences</h2>
                </div>
                <p>Please fill out the entire form with accurate information. In the "Additional Information" section of the form, you can inform us about any issues related to your health, meals, transportation, mobility, etc. We will make our utmost effort to ensure all kinds of conveniences for you.</p>
            </div>
          </div>
             
           
            <div  style={{
                border: '1px solid #7de538',
                background: 'linear-gradient(to bottom, #fff, #d0f8bd)',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                margin: '1.2rem auto 4rem auto',
                maxWidth:"500px",
                width:'100%',
              }}
              > 
              <img style={{width:'30px'}} src="/assets/info-icon.png" alt="info-icon" />
              <p style={{color: '#038b21',}}>
                <a
                   href="/contact"
                   target="_blank"
                    rel="noopener noreferrer"
                   style={{
                    color: '#038b21',
                    fontSize:"14px",
                    fontWidth:"400",
                    // textDecoration: 'none',
                    
                    textAlign:'center',
                    }}
                    > 
                    
                      <span style={{textDecoration:'underline',}}>Contact us for</span>  <span style={{
                          fontWeight:"600",
                          textDecoration:'none',
                          // paddingLeft:"5px"
                           }}
                          > 
                          more details
                          </span>
                </a>
              </p>
           </div>

        


          <form onSubmit={handleSubmit} className={styles.bookingForm}>
            <div className={styles.packageSummary}>
                <img src={packageDetails.image} alt={`Thumbnail for ${packageDetails.place}`} className={styles.packageSummaryImg} />
                <div className={styles.packageSummaryDetails}>
                    <h2 className={styles.packageSummaryTitle}>{packageDetails.place}</h2>
                    <p className={styles.packageSummaryDuration}>
                        {/* <strong>Duration:</strong> {packageDetails.duration?.value} {packageDetails.duration?.unit} */}
                        <strong style={{paddingRight:'5px'}}>Duration:</strong> 
                            {packageDetails.duration?.value}{" "}
                            {packageDetails.duration?.value > 1 
                              ? `${packageDetails.duration?.unit}s` 
                              : packageDetails.duration?.unit}

                    </p>
                    <div className={styles.bookingCardLocations}>
                        {/* <strong style={{color:'#4a90bd'}}>Locations:</strong> */}
                        <div className={styles.bookingCardLocationLink}> <strong style={{color:'#4a90bd',marginRight:'10px',fontSize:'18px',fontWeight:"600"}}>Locations:</strong>
                          {packageDetails.placesLocation?.map((loc, index) => (
                            <span key={index}>{loc.name}</span>
                          ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className={styles.priceDetails}>
              <p>Price per person: ${pricePerPerson.toFixed(2)}</p>
              <p>Total Cost: ${totalCost.toFixed(2)}</p>
            </div> */}

            <div className={styles.formSection}>
              <h3 className={styles.formSectionTitle}>Your Details</h3>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.profileImageGroup}`}>
                  <label> Upload Your Photo <span style={{fontSize:'13px',fontWeight:"600",cursor:'pointer'}}>(optional)</span> </label>
                  <input type="file" accept="image/*" onChange={onFileChange} style={{ display: 'none',cursor:"pointer" }} id="profileImage" />
                  <div style={{position:'relative'}}>
                  <div className={styles.profileImagePreviewContainer}>
                    <label htmlFor="profileImage">
                      <img style={{cursor:"pointer"}} src={croppedImage || profileImage} alt="Profile" className={styles.profileImagePreview} />
                    </label>
                  </div>
                  {croppedImage && <button type="button" onClick={() => setShowCropper(true)} className={styles.editButton}><i className="fa-solid fa-pen-to-square"></i></button>}
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
                <div className={`${styles.formGroup} ${errors.numberOfPersons ? styles.inputError : ''}`}>
                  <label htmlFor="numberOfPersons">Number of Persons</label>
                  <select style={{cursor:'pointer'}} id="numberOfPersons" value={numberOfPersons} onChange={handleNumberOfPersonsChange} required>
                    <option value="" disabled>Select number of persons</option>
                    {[1, 2, 3, 4, 5,6,7,8,9,10,11,12].map(n => <option key={n} value={n}>{n} Person{n > 1 ? 's' : ''}</option>)}
                  </select>
                  {errors.numberOfPersons && <p className={styles.errorMessage}>{errors.numberOfPersons}</p>}
                </div>

                {/* <div className={`${styles.formGroup} ${styles.profileImageGroup}`}>
                  <label>Profile Image <span style={{fontSize:'13px',fontWeight:"600",}}>(optional)</span> </label>
                  <input type="file" accept="image/*" onChange={onFileChange} style={{ display: 'none' }} id="profileImage" />
                  <div className={styles.profileImagePreviewContainer}>
                    <label htmlFor="profileImage">
                      <img src={croppedImage || profileImage} alt="Profile" className={styles.profileImagePreview} />
                    </label>
                    {croppedImage && <button type="button" onClick={() => setShowCropper(true)} className={styles.editButton}>Edit</button>}
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
                </div> */}

                <div className={`${styles.formGroup} ${errors.gender ? styles.inputError : ''}`}>
                  <fieldset>
                    <legend>Gender</legend>
                    <div className={styles.genderOptions}>
                        <input style={{marginRight:'5px',cursor:'pointer'}} type="radio" id="male" name="gender" value="male" onChange={handleInputChange(setGender, 'gender')} required />
                        <label style={{cursor:'pointer'}} htmlFor="male">Male</label>
                        <input style={{marginRight:'5px',marginLeft:"24px",cursor:'pointer'}} type="radio" id="female" name="gender" value="female" onChange={handleInputChange(setGender, 'gender')} required />
                        <label style={{cursor:'pointer'}} htmlFor="female">Female</label>
                    </div>
                  </fieldset>
                  {errors.gender && <p className={styles.errorMessage}>{errors.gender}</p>}
                </div>

                <div className={`${styles.formGroup} ${errors.fullName ? styles.inputError : ''}`}>
                  <label htmlFor="fullName">Full Name</label>
                  <input type="text" id="fullName" value={fullName} onChange={handleInputChange(setFullName, 'fullName')} required placeholder="Enter your full name" />
                  {errors.fullName && <p className={styles.errorMessage}>{errors.fullName}</p>}
                </div>

                <div className={`${styles.formGroup} ${errors.age ? styles.inputError : ''}`}>
                  <label htmlFor="age">Age</label>
                  <input type="number" id="age" value={age} onChange={handleInputChange(setAge, 'age')} required placeholder="Enter your age" />
                  {errors.age && <p className={styles.errorMessage}>{errors.age}</p>}
                </div>

                <div className={`${styles.formGroup} ${errors.country ? styles.inputError : ''}`}>
                  <label>Country of Residence</label>
                  <div>
                  <CountrySelector
                    value={country}
                    onChange={handleCountryChange}
                  />
                  </div>
                  {errors.country && <p className={styles.errorMessage}>{errors.country}</p>}
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.formSectionTitle}>Contact & Tour Information</h3>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${errors.phone ? styles.inputError : ''}`}>
                  <label htmlFor="phone">WhatsApp Number</label>
                  <PhoneInput
                    country={'us'}
                    value={phone}
                    onChange={(phone) => { setPhone(phone); setErrors({ ...errors, phone: '' }); }}
                    inputProps={{ required: true }}
                  />
                  {errors.phone && <p className={styles.errorMessage}>{errors.phone}</p>}
                </div>

                <div className={`${styles.formGroup} ${errors.email ? styles.inputError : ''}`}>
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" value={email} onChange={handleInputChange(setEmail, 'email')} required placeholder="Enter your email address" />
                  {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
                </div>

                <div className={`${styles.formGroup} ${errors.tourDate ? styles.inputError : ''}`}>
                  <label htmlFor="tourDate">Tour Date</label>
                  <DatePicker selected={tourDate} onChange={(date) => { setTourDate(date); setErrors({ ...errors, tourDate: '' }); }} required placeholderText="DD/MM/YYYY" />
                  {errors.tourDate && <p className={styles.errorMessage}>{errors.tourDate}</p>}
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="pickupAddress">Pick-up Address (optional) </label>
                  <input type="text" id="pickupAddress" value={pickupAddress} onChange={e => setPickupAddress(e.target.value)} placeholder="e.g., House No, Street, City" />
                </div>

                {showOtherTravelers && (
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="otherTravelers">Other Travelers (Names, Ages)</label>
                    <textarea id="otherTravelers" value={otherTravelers} onChange={e => setOtherTravelers(e.target.value)} rows={3} placeholder="Enter names and ages of other travelers, e.g., John Doe (25), Jane Smith (30)"/>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.formSectionTitle}>Additional Information</h3>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="clientProblem">Any Problem or Special Request? (optional)</label>
                  <textarea id="clientProblem" value={clientProblem} onChange={e => setClientProblem(e.target.value)} rows={3} placeholder="Describe any problems or special requests you might have (e.g., medical conditions, specific needs)"/>
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="notes">Notes (optional)</label>
                  <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Any special needs or notes for your trip? (e.g., dietary restrictions, accessibility needs)"/>
                </div>

                {/* <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="clientProblem">Any Problem or Special Request? (optional)</label>
                  <textarea id="clientProblem" value={clientProblem} onChange={e => setClientProblem(e.target.value)} rows={3} placeholder="Describe any problems or special requests you might have (e.g., medical conditions, specific needs)"/>
                </div> */}
              </div>
            </div>

            <div className={styles.formSection}>
                <div className={`${styles.formGroup} ${styles.optionsGroup} ${errors.options ? styles.inputError : ''}`}>
                  <legend style={{ fontSize:'1.1rem',fontWeight:'600',marginBottom:'1.5rem',borderBottom:"2px solid #374151",display:'inline',width:'120px' }} >Confirmation</legend>
                  {/* <label >
                    <input type="checkbox" checked={option1} onChange={e => setOption1(e.target.checked)} required />
                   I am committed that through my behavior and actions, I will not cause any harm or disrespect to Bangladesh’s environment, culture, or local communities.
                  </label>
                  <label  >
                    
                    <input type="checkbox" checked={option2} onChange={e => setOption2(e.target.checked)} required />
                    I confirm that the information I have provided is accurate.
                  </label> */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                     <label style={{ display: 'flex', alignItems: 'flex-start', cursor:'pointer' }}>
                       <input 
                         type="checkbox" 
                         checked={option1} 
                         onChange={e => setOption1(e.target.checked)} 
                         required 
                         style={{ marginTop: '0.3rem', marginRight:"9px" }}
                       />
                       <span>
                         I am committed that through my behavior and actions, I will not cause any harm or disrespect to Bangladesh’s environment, culture, or local                     communities.
                       </span>
                     </label>
                   
                     <label style={{ display: 'flex', alignItems: 'flex-start', cursor:'pointer' }}>
                       <input 
                         type="checkbox" 
                         checked={option2} 
                         onChange={e => setOption2(e.target.checked)} 
                         required 
                         style={{ marginTop: '0.3rem',marginRight:"9px" }}
                       />
                       <span>
                         I confirm that the information I have provided is accurate.
                       </span>
                     </label>
                   </div>

                  {errors.options && <p className={styles.errorMessage}>{errors.options}</p>}
                </div>
            </div>
            
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Booking'}
            </button>
          </form>
        </div>
      </div>
      <LandingFooter />
    </>
  );
};

export default Booking;