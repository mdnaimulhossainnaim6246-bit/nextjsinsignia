import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import ReviewTable from "../../components/addmin/ReviewTable";
import { useAppContext } from '../../context/AppContext';

const ListReview = () => {
  const { axios } = useAppContext();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishedCount, setPublishedCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);
  const [selectedReviews, setSelectedReviews] = useState([]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/addreview/all?showAll=true");
      if (data.success) {
        setReviews(data.reviews);
        setPublishedCount(data.reviews.filter((r) => r.isPublished).length);
        setDraftCount(data.reviews.filter((r) => !r.isPublished).length);
      } else {
        toast.error("Failed to fetch reviews");
      }
    } catch (error) {
      toast.error("Server error while fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedReviews(reviews.map((review) => review._id));
    } else {
      setSelectedReviews([]);
    }
  };

  const handleSelect = (e, id) => {
    if (e.target.checked) {
      setSelectedReviews((prev) => [...prev, id]);
    } else {
      setSelectedReviews((prev) => prev.filter((reviewId) => reviewId !== id));
    }
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm("Are you sure you want to delete the selected reviews?")) return;
    try {
      const { data } = await axios.post("/addreview/delete-many", { ids: selectedReviews });
      if (data.success) {
        toast.success("Selected reviews deleted");
        fetchReviews(); // Refetch to update the list
        setSelectedReviews([]);
      } else {
        toast.error("Failed to delete selected reviews");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const { data } = await axios.post("/addreview/delete", { id });
      if (data.success) {
        toast.success("Review deleted");
        fetchReviews(); // Refetch
      } else {
        toast.error("Delete failed");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const togglePublish = async (id) => {
    try {
      const { data } = await axios.post("/addreview/toggle-publish", { id });
      if (data.success) {
        toast.success(data.message);
        setReviews((prev) =>
          prev.map((review) =>
            review._id === id ? { ...review, isPublished: data.isPublished } : review
          )
        );
        setPublishedCount((prev) => (data.isPublished ? prev + 1 : prev - 1));
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
      <h2 className="admin-section-title">All Reviews</h2>
      
      <div className="add-tour-main-container">
        <div className="total-data-effect">
          <div className="tottal-data">
            <i className="Data-icon fa-solid fa-clipboard-list"></i>
            <div className="data-contain">
              <p className="Data-count">{publishedCount}</p>
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
        <p className="Recent-added">All Reviews</p>
        <Link to="/admin/addreview" className="add-new-button">Add New Review</Link>
        {selectedReviews.length > 0 && (
          <button onClick={handleDeleteSelected} className="delete-selected-btn">
            Delete Selected ({selectedReviews.length})
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
                  <input type="checkbox" onChange={handleSelectAll} checked={selectedReviews.length === reviews.length && reviews.length > 0} />
                </th>
                <th className="table-th-n">#</th>
                <th className="table-th-title">TITLE</th>
                <th className="table-th-status">DATE</th>
                <th className="table-th-status">STATUS</th>
                <th className="table-th-action">ACTION</th>
              </tr>
            </thead>
            <tbody className="table-tbody">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
                    No Reviews Found
                  </td>
                </tr>
              ) : (
                reviews.map((review, index) => (
                  <ReviewTable
                    key={review._id}
                    review={review}
                    index={index + 1}
                    deleteHandler={deleteHandler}
                    togglePublish={togglePublish}
                    handleSelect={handleSelect}
                    isSelected={selectedReviews.includes(review._id)}
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

export default ListReview;
