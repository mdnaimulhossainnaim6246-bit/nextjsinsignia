
 
// src/components/admin/DiscoverTable.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const DiscoverTable = ({ discover, fetchDiscover, index, handleSelect, isSelected }) => {
  const { axios } = useAppContext();
  const navigate = useNavigate();

  if (!discover || !discover.place) return null;

  const shortPlace = discover.place.length > 10 ? discover.place.slice(0, 10) + "..." : discover.place;

  const deleteDiscover = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
      const { data } = await axios.post('/adddiscover/delete', { id: discover._id });
      if (data.success) {
        toast.success(data.message);
        await fetchDiscover();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const togglePublish = async () => {
    try {
      const { data } = await axios.post('/adddiscover/toggle-publish', { id: discover._id });
      if (data.success) {
        const msg = discover.isPublished
          ? "Post unpublished successfully"
          : "Post published successfully";
        toast.success(msg);
        await fetchDiscover();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <tr className="data-table-tr">
      <td className="table-th-n">
        <input type="checkbox" onChange={(e) => handleSelect(e, discover._id)} checked={isSelected} />
      </td>
      <td className="table-th-n">{index}</td>
      <td className="table-th-title">{shortPlace}</td>
      <td className="table-th-status">{new Date(discover.updatedAt).toLocaleDateString()}</td>
      <td className="table-th-status">
        <p className={discover.isPublished ? "text-green-600" : "text-red-700"}>
          {discover.isPublished ? "Published" : "Unpublished"}
        </p>
      </td>
      <td className="table-th-action">
        <button className="table-data-publish-button" onClick={togglePublish}>
          {discover.isPublished ? "Unpublish" : "Publish"}
        </button>

        {/* Edit Button */}
        <button
          onClick={() => navigate(`/admin/Adddiscover?id=${discover._id}`)}
          title="Edit Discover"
          style={{
            marginLeft: "10px",
            border: "none",
            cursor: "pointer",
            background: "none",
            color: "#444",
          }}
        >
          <i style={{color:'#4825e6',fontSize:'16px'}} className="fa-solid fa-pen-to-square"></i>
        </button>

        {/* Delete Button */}
        <button
          onClick={deleteDiscover}
          title="Delete Discover"
          style={{ marginLeft: "10px", border: "none", cursor: "pointer", background: "none" }}
        >
          <i className="data-cancel fa-solid fa-xmark"></i>
        </button>
      </td>
    </tr>
  );
};

export default DiscoverTable;
