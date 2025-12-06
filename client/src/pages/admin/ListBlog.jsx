import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import BlogTable from "../../components/addmin/BlogTable";
import api from "../../utils/api";
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


const ListBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);
  const [selectedBlogs, setSelectedBlogs] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedBlogs(blogs.map((blog) => blog._id));
    } else {
      setSelectedBlogs([]);
    }
  };

  const handleSelect = (e, id) => {
    if (e.target.checked) {
      setSelectedBlogs((prev) => [...prev, id]);
    } else {
      setSelectedBlogs((prev) => prev.filter((blogId) => blogId !== id));
    }
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm("Are you sure you want to delete the selected blogs?")) return;
    try {
      const { data } = await api.post("/addblog/delete-many", { ids: selectedBlogs });
      if (data.success) {
        toast.success("Selected blogs deleted");
        setBlogs((prev) => prev.filter((blog) => !selectedBlogs.includes(blog._id)));
        setSelectedBlogs([]);
      } else {
        toast.error("Failed to delete selected blogs");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: blogsData } = await api.get("/addblog/all?showAll=true");

        if (blogsData.success) {
          setBlogs(blogsData.blogs);

          setUploadedCount(blogsData.blogs.filter((p) => p.isPublished).length);
          setDraftCount(blogsData.blogs.filter((p) => !p.isPublished).length);
        } else {
          toast.error("Failed to fetch blogs");
          setBlogs([]);
        }
      } catch (error) {
        toast.error("Server error while fetching data");
        setBlogs([]);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

    const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      const { data } = await api.post("/addblog/delete", { id });
      if (data.success) {
        toast.success("Blog deleted");
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
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
      const { data } = await api.post("/addblog/toggle-publish", { id });
      if (data.success) {
        const msg = data.isPublished
          ? "Blog published successfully"
          : "Blog unpublished successfully";
        toast.success(msg);

        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog._id === id ? { ...blog, isPublished: data.isPublished } : blog
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
      <h2 className="admin-section-title">All Blogs</h2>

      {/* Summary */}
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
      
        <div className="data-list">
          <i className="recent-Data-icon fa-solid fa-table-list"></i>
          <p className="Recent-added">Recent Added</p>
          {selectedBlogs.length > 0 && (
            <button onClick={handleDeleteSelected} className="delete-selected-btn">
              Delete Selected ({selectedBlogs.length})
            </button>
          )}
        </div>

      {/* Table */}
      {loading ? (
        <Loader />
      ) : (
        <div className="data-table-booking-place">
          <table className="table">
            <thead className="table-thead">
              <tr className="data-table-tr data-table-tr-thead-booking">
                <th className="table-th-n">
                  <input type="checkbox" onChange={handleSelectAll} checked={selectedBlogs.length === blogs.length && blogs.length > 0} />
                </th>
                <th className="table-th-n">#</th>
                <th className="table-th-title">TITLE</th>
                <th className="table-th-status">DATE</th>
                <th className="table-th-status">STATUS</th>
                <th className="table-th-action">ACTION</th>
              </tr>
            </thead>
            <tbody className="table-tbody">
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "1rem" }}>
                    No Blogs Found
                  </td>
                </tr>
              ) : (
                blogs.map((blog, index) => (
                  <BlogTable
                    key={blog._id}
                    blog={blog}
                    index={index + 1}
                    deleteHandler={deleteHandler}
                    togglePublish={togglePublish}
                    handleSelect={handleSelect}
                    isSelected={selectedBlogs.includes(blog._id)}
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

export default ListBlog;