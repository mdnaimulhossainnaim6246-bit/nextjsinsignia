


// src/pages/admin/Listpackages.jsx


import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import PackagesTable from '../../components/addmin/PackagesTable';

const Listpackages = () => {
  const [PackagesList, setPackagesList] = useState([]);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);

  const { axios } = useAppContext();

  const fetchDashboard = async () => {
  try {
    const { data } = await axios.get('/addpackages/all');
    // const { data } = await axios.get(`${BACKEND_URL}/addpackages/all`);
    console.log('API Response data:', data);  

    if (data.success && Array.isArray(data.packages)) {
      setPackagesList(data.packages);

      const uploaded = data.packages.filter(item => item.isPublished).length;
      const drafts = data.packages.filter(item => !item.isPublished).length;

      setUploadedCount(uploaded);
      setDraftCount(drafts);
    } else {
      toast.error(data.message || 'Failed to fetch Package data');
      setPackagesList([]);      // স্টেট রিসেট করো যাতে UI তে সমস্যা না হয়
      setUploadedCount(0);
      setDraftCount(0);
    }
  } catch (error) {
    toast.error(error.message || 'Error fetching Package data');
    setPackagesList([]);
    setUploadedCount(0);
    setDraftCount(0);
  }
};


  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div>
      {/* Summary Stats */}
      <div className="add-tour-main-container">
        <div className="total-data-effect">
          <div className="tottal-data">
            <i className="Data-icon fa-solid fa-clipboard-list"></i>
            <div className="data-contain">
              <p className="Data-count">{uploadedCount}</p>
              <p className="data-title">Uploaded</p>
            </div>
          </div>
        </div>

        <div className="total-data-effect">
          <div className="tottal-data-draft">
            <i className="Data-icon fa-solid fa-file-pen"></i>
            <div className="data-contain">
              <p className="Data-count">{draftCount}</p>
              <p className="data-title">Drafts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Added Table */}
      <div>
        <div className="data-list">
          <i className="recent-Data-icon fa-solid fa-table-list"></i>
          <p className="Recent-added">Recent Added</p>
        </div>

        <div className="data-table">
          <table className="table">
            <thead className="table-thead">
              <tr className="data-table-tr data-table-tr-thead">
                <th scope="col" className="table-th-n">#</th>
                <th scope="col" className="table-th-title">Place</th>
                <th scope="col" className="table-th-status">Date</th>
                <th scope="col" className="table-th-status">STATUS</th>
                <th scope="col" className="table-th-action">ACTION</th>
              </tr>
            </thead>

           <tbody className="table-tbody">
  {Array.isArray(PackagesList) && PackagesList.length > 0 ? (
    PackagesList.map((packages, index) => (
      <PackagesTable
        key={packages._id}
        packages={packages}
        fetchPackages={fetchDashboard}
        index={index + 1}
      />
    ))
  ) : (
    <tr>
      <td colSpan="5" style={{ textAlign: 'center' }}>
        No packages found.
      </td>
    </tr>
  )}
</tbody>


          </table>
        </div>
      </div>
    </div>
  );
};

export default Listpackages;
