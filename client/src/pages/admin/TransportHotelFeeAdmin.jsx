// src/pages/admin/TransportHotelFeeAdmin.jsx


import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const TransportHotelFeeAdmin = () => {
  const { axios } = useAppContext();
  const [fees, setFees] = useState({
    transportPremium: '',
    transportStandard: '',
    hotelPremium: '',
    hotelStandard: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const { data } = await axios.get('/admin/fees');
        if (data.success) {
          setFees(data.fees);
        }
      } catch {
        toast.error('Failed to load fee data');
      }
    };
    fetchFees();
  }, [axios]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFees({ ...fees, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { data } = await axios.post('/admin/fees', fees);
      if (data.success) toast.success('Fees updated successfully!');
      else toast.error(data.message || 'Failed to update');
    } catch (err) {
      toast.error('Error updating fees');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fee-admin-container">
      <h2 className="fee-admin-title">Transport & Hotel Fee Settings</h2>

      <div className="fee-group">
        <h3 className="fee-subheading">Transport Fee (per km)</h3>
        <div className="fee-input-row">
          <label className="fee-label">
            Premium ($/km)
            <input
              type="number"
              name="transportPremium"
              value={fees.transportPremium}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="e.g. 0.75"
              className="fee-input"
            />
          </label>
          <label className="fee-label">
            Standard ($/km)
            <input
              type="number"
              name="transportStandard"
              value={fees.transportStandard}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="e.g. 0.45"
              className="fee-input"
            />
          </label>
        </div>
      </div>

      <div className="fee-group">
        <h3 className="fee-subheading">Hotel Fee (per night)</h3>
        <div className="fee-input-row">
          <label className="fee-label">
            Premium ($/night)
            <input
              type="number"
              name="hotelPremium"
              value={fees.hotelPremium}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="e.g. 120"
              className="fee-input"
            />
          </label>
          <label className="fee-label">
            Standard ($/night)
            <input
              type="number"
              name="hotelStandard"
              value={fees.hotelStandard}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="e.g. 70"
              className="fee-input"
            />
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="fee-admin-submit-btn"
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default TransportHotelFeeAdmin;
