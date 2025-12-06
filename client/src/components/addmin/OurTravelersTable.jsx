import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const OurTravelersTable = ({ ourTraveler, fetchOurTravelers, index }) => {
  const { axios } = useAppContext();
  const navigate = useNavigate();

  const shortTitle = ourTraveler.title.length > 10 ? ourTraveler.title.slice(0, 10) + "..." : ourTraveler.title;

  const deleteOurTraveler = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this member?');
    if (!confirmDelete) return;

    try {
      const { data } = await axios.post('/addourtravelers/delete', { id: ourTraveler._id });
      if (data.success) {
        toast.success(data.message);
        await fetchOurTravelers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const togglePublish = async () => {
    try {
      const { data } = await axios.post('/addourtravelers/toggle-publish', { id: ourTraveler._id });
      if (data.success) {
        const msg = ourTraveler.isPublished
          ? "Member unpublished successfully"
          : "Member published successfully";
        toast.success(msg);
        await fetchOurTravelers();
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
      <td className="table-th-title">{shortTitle}</td>
      <td className="table-th-status">
        <p className={ourTraveler.isPublished ? "text-green-600" : "text-red-700"}>
          {ourTraveler.isPublished ? "Published" : "Unpublished"}
        </p>
      </td>

      <td className="table-th-action">
        <button className="table-data-publish-button" onClick={togglePublish}>
          {ourTraveler.isPublished ? "Unpublish" : "Publish"}
        </button>

        {/* Edit Button */}
        <button
          onClick={() => navigate(`/admin/addourtravelers?id=${ourTraveler._id}`)}
          title="Edit Member"
          style={{
            marginLeft: "10px",
            border: "none",
            cursor: "pointer",
            background: "none",
            color: "#444",
          }}
        >
          <i className="fa-solid fa-pen-to-square"></i>
        </button>

        {/* Delete Button */}
        <button
          onClick={deleteOurTraveler}
          className="data-cancel fa-solid fa-xmark"
          title="Delete Member"
          style={{ marginLeft: "10px", border: "none", cursor: "pointer", background: "none" }}
        />
      </td>
    </tr>
  );
};

export default OurTravelersTable;