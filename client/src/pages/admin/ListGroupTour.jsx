import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import api from "../../utils/api";

const GroupTourTable = ({ tour, index, deleteHandler, togglePublish, handleSelect, isSelected }) => {
  return (
    <tr className="data-table-tr">
      <td className="table-th-n">
        <input type="checkbox" onChange={(e) => handleSelect(e, tour._id)} checked={isSelected} />
      </td>
      <td className="table-th-n">{index}</td>
      <td className="table-th-title">{tour.title}</td>
      <td className="table-th-status">{new Date(tour.date).toLocaleDateString()}</td>
      <td className="table-th-status">
        {/* <span className={`status-label ${tour.isPublished ? "published" : "draft"}`}>
          {tour.isPublished ? "Published" : "Draft"}
        </span> */}
        <span
              style={{
                color: tour.isPublished ? "#16a34a" : "#dc2626",
                fontWeight: 600,
                fontSize: "14px"
              }}
            >
              {tour.isPublished ? "Published" : "Draft"}
            </span>

      </td>
      <td className="table-th-action">
        <div style={{cursor:'pointer'}} className="action-btn-div">
          <Link style={{cursor:'pointer',color:'#44aaffcc'}} to={`/admin/addgrouptour?id=${tour._id}`} className="action-btn-edit">
            <i className="fa-solid fa-pen-to-square"></i>
          </Link>
          <button style={{cursor:'pointer',color:'#ff5533',marginLeft:"5px",marginRight:"5px"}} className="action-btn-delete" onClick={() => deleteHandler(tour._id)}>
            <i className="fa-solid fa-trash"></i>
          </button>
          {/* <button style={{cursor:'pointer'}} className={`action-btn-publish ${tour.isPublished ? "published" : ""}`} onClick={() => togglePublish(tour._id)}>
            <i className={`fa-solid ${tour.isPublished ? "fa-eye-slash" : "fa-eye"}`}></i>
          </button> */}
          <button
  style={{ cursor: "pointer" }}
  className={`action-btn-publish ${tour.isPublished ? "published" : ""}`}
  onClick={() => togglePublish(tour._id)}
>
  <i
    className={`fa-solid ${tour.isPublished ? "fa-eye-slash" : "fa-eye"}`}
    style={{
      color: tour.isPublished ? "#f59e0b" : "#3b82f6", 
      transition: "color 0.2s ease"
    }}
  ></i>
</button>

        </div>
      </td>
    </tr>
  );
};

const ListGroupTour = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);
  const [selectedTours, setSelectedTours] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTours(tours.map((tour) => tour._id));
    } else {
      setSelectedTours([]);
    }
  };

  const handleSelect = (e, id) => {
    if (e.target.checked) {
      setSelectedTours((prev) => [...prev, id]);
    } else {
      setSelectedTours((prev) => prev.filter((tourId) => tourId !== id));
    }
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm("Are you sure you want to delete the selected tours?")) return;
    try {
      const { data } = await api.post("/addgrouptour/delete-many", { ids: selectedTours });
      if (data.success) {
        toast.success("Selected tours deleted");
        setTours((prev) => prev.filter((tour) => !selectedTours.includes(tour._id)));
        setSelectedTours([]);
      } else {
        toast.error("Failed to delete selected tours");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: toursData } = await api.get("/addgrouptour/all?showAll=true");

        if (toursData.success) {
          setTours(toursData.tours);
          setUploadedCount(toursData.tours.filter((p) => p.isPublished).length);
          setDraftCount(toursData.tours.filter((p) => !p.isPublished).length);
        } else {
          toast.error("Failed to fetch tours");
          setTours([]);
        }
      } catch (error) {
        toast.error("Server error while fetching data");
        setTours([]);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

    const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      const { data } = await api.post("/addgrouptour/delete", { id });
      if (data.success) {
        toast.success("Tour deleted");
        setTours((prevTours) => prevTours.filter((tour) => tour._id !== id));
        setUploadedCount((prev) => prev - 1);
      } else {
        toast.error("Delete failed");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const togglePublish = async (id) => {
    try {
      const { data } = await api.post("/addgrouptour/toggle-publish", { id });
      if (data.success) {
        const msg = data.isPublished
          ? "Tour published successfully"
          : "Tour unpublished successfully";
        toast.success(msg);

        setTours((prevTours) =>
          prevTours.map((tour) =>
            tour._id === id ? { ...tour, isPublished: data.isPublished } : tour
          )
        );

        setUploadedCount((prev) => (data.isPublished ? prev + 1 : prev - 1));
        setDraftCount((prev) => (data.isPublished ? prev - 1 : prev + 1));
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="admin-list-posts">
      <h2 className="admin-section-title">All Group Tours</h2>

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

      <div className="data-list">
        <i className="recent-Data-icon fa-solid fa-table-list"></i>
        <p className="Recent-added">Recent Added</p>
        {selectedTours.length > 0 && (
          <button onClick={handleDeleteSelected} className="delete-selected-btn">
            Delete Selected ({selectedTours.length})
          </button>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="data-table-booking-place">
          <table className="table">
            <thead className="table-thead">
              <tr className="data-table-tr data-table-tr-thead-booking">
                <th className="table-th-n">
                  <input type="checkbox" onChange={handleSelectAll} checked={selectedTours.length === tours.length && tours.length > 0} />
                </th>
                <th className="table-th-n">#</th>
                <th className="table-th-title">TITLE</th>
                <th className="table-th-status">DATE</th>
                <th className="table-th-status">STATUS</th>
                <th className="table-th-action">ACTION</th>
              </tr>
            </thead>
            <tbody className="table-tbody">
              {tours.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "1rem" }}>
                    No Group Tours Found
                  </td>
                </tr>
              ) : (
                tours.map((tour, index) => (
                  <GroupTourTable
                    key={tour._id}
                    tour={tour}
                    index={index + 1}
                    deleteHandler={deleteHandler}
                    togglePublish={togglePublish}
                    handleSelect={handleSelect}
                    isSelected={selectedTours.includes(tour._id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListGroupTour;
