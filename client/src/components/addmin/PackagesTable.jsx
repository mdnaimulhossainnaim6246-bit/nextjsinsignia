
 
// src/components/admin/DiscoverTable.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const PackagesTable = ({ packages, fetchPackages, index }) => {
  const { axios } = useAppContext();
  const navigate = useNavigate();

  if (!packages || !packages.place) return null;

  const shortPlace = packages.place.length > 10 ? packages.place.slice(0, 10) + "..." : packages.place;

  const deletePackages = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
      const { data } = await axios.post('/addpackages/delete', { id: packages._id });
      if (data.success) {
        toast.success(data.message);
        await fetchPackages();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const togglePublish = async () => {
    try {
      const { data } = await axios.post('/addpackages/toggle-publish', { id: packages._id });
      if (data.success) {
        const msg = packages.isPublished
          ? "Post unpublished successfully"
          : "Post published successfully";
        toast.success(msg);
        await fetchPackages();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <tr className="data-table-tr">
      <th className="table-th-n">{index}</th>
      <td className="table-th-title">{shortPlace}</td>
      <td className="table-th-status">{new Date(packages.updatedAt).toLocaleDateString()}</td>
      <td className="table-th-status">
        <p className={packages.isPublished ? "text-green-600" : "text-red-700"}>
          {packages.isPublished ? "Published" : "Unpublished"}
        </p>
      </td>
      <td className="table-th-action">
        <button className="table-data-publish-button" onClick={togglePublish}>
          {packages.isPublished ? "Unpublish" : "Publish"}
        </button>

        {/* Edit Button */}
        <button
          onClick={() => navigate(`/admin/Addpackages?id=${packages._id}`)}
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
          onClick={deletePackages}
          className="data-cancel fa-solid fa-xmark"
          title="Delete package"
          style={{ marginLeft: "10px", border: "none", cursor: "pointer", background: "none" }}
        />
      </td>
    </tr>
  );
};

export default PackagesTable;
