
import React, { useEffect, useState } from 'react';
import OurTravelersTable from '../../components/addmin/OurTravelersTable';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ListOurTravelers = () => {
  const [ourTravelersList, setOurTravelersList] = useState([]);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);

  const { axios } = useAppContext();

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get('/addourtravelers/all');
      if (data.success) {
        setOurTravelersList(data.ourTraveler);

        const uploaded = data.ourTraveler.filter((item) => item.isPublished).length;
        const drafts = data.ourTraveler.filter((item) => !item.isPublished).length;

        setUploadedCount(uploaded);
        setDraftCount(drafts);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div>
      {/* Summary Stats */}
      <div className="add-tour-main-container">
        <div className='total-data-effect'>
          <div className="tottal-data">
            <i className="Data-icon fa-solid fa-clipboard-list"></i>
            <div className="data-contain">
              <p className="Data-count">{uploadedCount}</p>
              <p className="data-title">Uploaded</p>
            </div>
          </div>
        </div>

        <div className='total-data-effect'>
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
                <th scope="col" className="table-th-title">NAME</th>
                <th scope="col" className="table-th-status">STATUS</th>
                <th scope="col" className="table-th-action">ACTION</th>
              </tr>
            </thead>

            <tbody className="table-tboady">
              {ourTravelersList.map((ourTraveler, index) => (
                <OurTravelersTable
                  key={ourTraveler._id}
                  ourTraveler={ourTraveler}
                  fetchOurTravelers={fetchDashboard}
                  index={index + 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListOurTravelers;