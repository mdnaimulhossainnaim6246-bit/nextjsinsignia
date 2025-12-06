


// src/pages/admin/Listdiscover.jsx


import React, { useEffect, useState } from 'react';
import DiscoverTable from '../../components/addmin/DiscoverTable';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Listdiscover = () => {
  const [discoverList, setDiscoverList] = useState([]);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);
  const [selectedDiscovers, setSelectedDiscovers] = useState([]);

  const { axios } = useAppContext();

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedDiscovers(discoverList.map((discover) => discover._id));
    } else {
      setSelectedDiscovers([]);
    }
  };

  const handleSelect = (e, id) => {
    if (e.target.checked) {
      setSelectedDiscovers((prev) => [...prev, id]);
    } else {
      setSelectedDiscovers((prev) => prev.filter((discoverId) => discoverId !== id));
    }
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm("Are you sure you want to delete the selected discovers?")) return;
    try {
      const { data } = await axios.post("/adddiscover/delete-many", { ids: selectedDiscovers });
      if (data.success) {
        toast.success("Selected discovers deleted");
        setDiscoverList((prev) => prev.filter((discover) => !selectedDiscovers.includes(discover._id)));
        setSelectedDiscovers([]);
      } else {
        toast.error("Failed to delete selected discovers");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get('/adddiscover/all');
      // const { data } = await axios.get(`${BACKEND_URL}/adddiscover/all`);
      if (data.success) {
        setDiscoverList(data.discover);

        const uploaded = data.discover.filter(item => item.isPublished).length;
        const drafts = data.discover.filter(item => !item.isPublished).length;

        setUploadedCount(uploaded);
        setDraftCount(drafts);
      } else {
        toast.error(data.message || 'Failed to fetch discover data');
      }
    } catch (error) {
      toast.error(error.message || 'Error fetching discover data');
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
          {selectedDiscovers.length > 0 && (
            <button onClick={handleDeleteSelected} className="delete-selected-btn">
              Delete Selected ({selectedDiscovers.length})
            </button>
          )}
        </div>

        <div className="data-table">
          <table className="table">
            <thead className="table-thead">
              <tr className="data-table-tr data-table-tr-thead">
                <th scope="col" className="table-th-n">
                  <input type="checkbox" onChange={handleSelectAll} checked={selectedDiscovers.length === discoverList.length && discoverList.length > 0} />
                </th>
                <th scope="col" className="table-th-n">#</th>
                <th scope="col" className="table-th-title">Place</th>
                <th scope="col" className="table-th-status">Date</th>
                <th scope="col" className="table-th-status">STATUS</th>
                <th scope="col" className="table-th-action">ACTION</th>
              </tr>
            </thead>

            <tbody className="table-tboady">
              {discoverList.map((discover, index) => (
                <DiscoverTable
                  key={discover._id}
                  discover={discover}
                  fetchDiscover={fetchDashboard}
                  index={index + 1}
                  handleSelect={handleSelect}
                  isSelected={selectedDiscovers.includes(discover._id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Listdiscover;
