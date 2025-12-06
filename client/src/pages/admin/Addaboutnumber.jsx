// import React, { useEffect, useState } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import toast from 'react-hot-toast';

// const Addaboutnumber = () => {
//   const { axios } = useAppContext();
//   const [numbers, setNumbers] = useState({
//     happyTravelers: 0,
//     tourPackages: 0,
//     satisfactionRate: 0,
//     yearsExperience: 0,
//     destinationCovered: 0,
//     totalTeamMember: 0,
//     freeTour: 0,
//     positiveReviews: 0,
//     successRate: 0,
//   });
//   const [isUploading, setIsUploading] = useState(false);

//   useEffect(() => {
//     const fetchNumbers = async () => {
//       try {
//         const { data } = await axios.get('/api/about-number');
//         if (data.success) {
//           const { _id, createdAt, updatedAt, __v, ...rest } = data.numbers;
//           setNumbers(rest);
//         }
//       } catch (error) {
//         toast.error(error.message);
//       }
//     };
//     fetchNumbers();
//   }, [axios]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNumbers((prev) => ({ ...prev, [name]: value }));
//   };

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     setIsUploading(true);
//     try {
//       const response = await axios.put('/api/about-number', numbers);
//       if (response.data.success) {
//         toast.success(response.data.message);
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <form onSubmit={onSubmitHandler} style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
//         {Object.keys(numbers).map((key) => (
//           <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
//             <label style={{ marginBottom: '5px', textTransform: 'capitalize' }}>
//               {key.replace(/([A-Z])/g, ' $1')}
//             </label>
//             <input
//               type="number"
//               name={key}
//               value={numbers[key]}
//               onChange={handleChange}
//               style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
//             />
//           </div>
//         ))}
//       </div>
//       <button
//         disabled={isUploading}
//         type="submit"
//         style={{
//           marginTop: '20px',
//           padding: '10px 20px',
//           borderRadius: '5px',
//           border: 'none',
//           backgroundColor: '#007bff',
//           color: 'white',
//           cursor: 'pointer',
//         }}
//       >
//         {isUploading ? 'Updating...' : 'Update Numbers'}
//       </button>
//     </form>
//   );
// };

// export default Addaboutnumber;




import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Addaboutnumber = () => {
  const { axios } = useAppContext();
  const [numbers, setNumbers] = useState({
    happyTravelers: 0,
    tourPackages: 0,
    satisfactionRate: 0,
    yearsExperience: 0,
    destinationCovered: 0,
    totalTeamMember: 0,
    freeTour: 0,
    positiveReviews: 0,
    successRate: 0,
  });

  const [placeholders, setPlaceholders] = useState(numbers);
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // ✅ custom confirmation modal toggle

  useEffect(() => {
    const fetchNumbers = async () => {
      try {
        const { data } = await axios.get('/api/about-number');
        if (data.success) {
          const { _id, createdAt, updatedAt, __v, ...rest } = data.numbers;
          setNumbers(rest);
          setPlaceholders(rest);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchNumbers();
  }, [axios]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNumbers((prev) => ({ ...prev, [name]: value }));
  };

  const confirmUpdate = async () => {
    setIsUploading(true);
    try {
      const response = await axios.put('/api/about-number', numbers);
      if (response.data.success) {
        toast.success(response.data.message);
        setPlaceholders(numbers);
        setNumbers({
          happyTravelers: '',
          tourPackages: '',
          satisfactionRate: '',
          yearsExperience: '',
          destinationCovered: '',
          totalTeamMember: '',
          freeTour: '',
          positiveReviews: '',
          successRate: '',
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
      setShowConfirm(false);
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setShowConfirm(true); // ✅ open confirmation modal
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Update About Numbers</h2>

      <form onSubmit={onSubmitHandler} style={styles.form}>
        <div style={styles.grid}>
          {Object.keys(numbers).map((key) => (
            <div key={key} style={styles.field}>
              <label style={styles.label}>
                {key.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type="number"
                name={key}
                value={numbers[key]}
                onChange={handleChange}
                placeholder={placeholders[key]}
                style={styles.input}
              />
            </div>
          ))}
        </div>

        <button disabled={isUploading} type="submit" style={styles.submitBtn}>
          {isUploading ? 'Updating...' : 'Update Numbers'}
        </button>
      </form>

      {/* ✅ Custom Confirmation Modal */}
      {showConfirm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Confirm Update</h3>
            <p style={styles.modalText}>
              Are you sure you want to update these numbers?
            </p>
            <div style={styles.modalButtons}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{ ...styles.modalBtn, background: '#e5e5e5', color: '#333' }}
              >
                Cancel
              </button>

              <button
                onClick={confirmUpdate}
                style={{ ...styles.modalBtn, background: '#007bff', color: '#fff' }}
              >
                Yes, Update
              </button>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addaboutnumber;

// 🎨 Inline CSS Styles
const styles = {
  container: {
    padding: '30px',
    maxWidth: '750px',
    margin: 'auto',
    marginTop: '3rem',
    fontFamily: 'Inter, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '25px',
    fontSize: '1.8rem',
    fontWeight: '600',
    color: '#333',
  },
  form: {
    // background: '#fff',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '6px',
    fontWeight: '500',
    color: '#555',
    textTransform: 'capitalize',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    transition: 'border 0.3s ease, box-shadow 0.3s ease',
    fontSize: '0.95rem',
    outline: 'none',
  },
  submitBtn: {
    marginTop: '25px',
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    background: '#007bff',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background 0.3s ease, transform 0.2s ease',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.45)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    animation: 'fadeIn 0.3s ease',
  },
  modal: {
    background: '#fff',
    padding: '25px 30px',
    borderRadius: '10px',
    textAlign: 'center',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
    animation: 'slideIn 0.3s ease',
  },
  modalTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px',
  },
  modalText: {
    color: '#555',
    marginBottom: '20px',
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
  },
  modalBtn: {
    padding: '10px 18px',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, background 0.3s ease',
  },
};
