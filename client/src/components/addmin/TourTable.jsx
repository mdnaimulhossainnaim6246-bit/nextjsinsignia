




import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const TourTable = ({ tour, fetchTour, index }) => {
  const { axios } = useAppContext();
  const navigate = useNavigate();

  const shortTitle = tour.title.length > 10 ? tour.title.slice(0, 10) + "..." : tour.title;

  const deleteTour = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
      const { data } = await axios.post('/addtour/delete', { id: tour._id });
      if (data.success) {
        toast.success(data.message);
        await fetchTour();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const togglePublish = async () => {
    try {
      const { data } = await axios.post('/addtour/toggle-publish', { id: tour._id });
      if (data.success) {
        const msg = tour.isPublished
          ? "Post unpublished successfully"
          : "Post published successfully";
        toast.success(msg);
        await fetchTour();
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
        <p className={tour.isPublished ? "text-green-600" : "text-red-700"}>
          {tour.isPublished ? "Published" : "Unpublished"}
        </p>
      </td>

      <td className="table-th-action">
        <button className="table-data-publish-button" onClick={togglePublish}>
          {tour.isPublished ? "Unpublish" : "Publish"}
        </button>

        {/* Edit Button */}
        {/* <button
          onClick={() => navigate(`/admin/Addtour?id=${tour._id}`)}
          title="Edit Tour"
          style={{
            marginLeft: "10px",
            border: "none",
            cursor: "pointer",
            background: "none",
            color: "#444",
          }}
        >
          <i className="fa-solid fa-pen-to-square"></i>
        </button> */}

        {/* Delete Button */}
        <button
          onClick={deleteTour}
          className="data-cancel fa-solid fa-xmark"
          title="Delete Tour"
          style={{ marginLeft: "10px", border: "none", cursor: "pointer", background: "none" }}
        />
      </td>
    </tr>
  );
};

export default TourTable;
