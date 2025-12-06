import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import GuideTable from "../../components/addmin/GuideTable"; // This will be created next
import api from "../../utils/api";

const ListTravelguide = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);
  const [selectedGuides, setSelectedGuides] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedGuides(guides.map((guide) => guide._id));
    } else {
      setSelectedGuides([]);
    }
  };

  const handleSelect = (e, id) => {
    if (e.target.checked) {
      setSelectedGuides((prev) => [...prev, id]);
    } else {
      setSelectedGuides((prev) => prev.filter((guideId) => guideId !== id));
    }
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm("Are you sure you want to delete the selected guides?")) return;
    try {
      const { data } = await api.post("/addguide/delete-many", { ids: selectedGuides });
      if (data.success) {
        toast.success("Selected guides deleted");
        setGuides((prev) => prev.filter((guide) => !selectedGuides.includes(guide._id)));
        setSelectedGuides([]);
      } else {
        toast.error("Failed to delete selected guides");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: guidesData } = await api.get("/addguide/all?showAll=true");

        if (guidesData.success) {
          setGuides(guidesData.guides);
          setUploadedCount(guidesData.guides.filter((p) => p.isPublished).length);
          setDraftCount(guidesData.guides.filter((p) => !p.isPublished).length);
        } else {
          toast.error("Failed to fetch guides");
          setGuides([]);
        }
      } catch (error) {
        toast.error("Server error while fetching data");
        setGuides([]);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

    const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      const { data } = await api.post("/addguide/delete", { id });
      if (data.success) {
        toast.success("Guide deleted");
        setGuides((prevGuides) => prevGuides.filter((guide) => guide._id !== id));
        // You might want to adjust counts here as well if needed
      } else {
        toast.error("Delete failed");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const togglePublish = async (id) => {
    try {
      const { data } = await api.post("/addguide/toggle-publish", { id });
      if (data.success) {
        const msg = data.isPublished
          ? "Guide published successfully"
          : "Guide unpublished successfully";
        toast.success(msg);

        setGuides((prevGuides) =>
          prevGuides.map((guide) =>
            guide._id === id ? { ...guide, isPublished: data.isPublished } : guide
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
      <h2 className="admin-section-title">All Travel Guides</h2>

      <div className="add-tour-main-container">
        <div className="total-data-effect">
          <div className="tottal-data">
            <i className="Data-icon fa-solid fa-clipboard-list"></i>
            <div className="data-contain">
              <p className="Data-count">{uploadedCount}</p>
              <p className="data-title">Published</p>
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
          <p className="Recent-added">Recently Added Guides</p>
          {selectedGuides.length > 0 && (
            <button onClick={handleDeleteSelected} className="delete-selected-btn">
              Delete Selected ({selectedGuides.length})
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
                  <input type="checkbox" onChange={handleSelectAll} checked={selectedGuides.length === guides.length && guides.length > 0} />
                </th>
                <th className="table-th-n">#</th>
                <th className="table-th-title">TITLE</th>
                <th className="table-th-status">STATUS</th>
                <th className="table-th-action">ACTION</th>
              </tr>
            </thead>
            <tbody className="table-tbody">
              {guides.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "1rem" }}>
                    No Guides Found
                  </td>
                </tr>
              ) : (
                guides.map((guide, index) => (
                  <GuideTable
                    key={guide._id}
                    guide={guide}
                    index={index + 1}
                    deleteHandler={deleteHandler}
                    togglePublish={togglePublish}
                    handleSelect={handleSelect}
                    isSelected={selectedGuides.includes(guide._id)}
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

export default ListTravelguide;
