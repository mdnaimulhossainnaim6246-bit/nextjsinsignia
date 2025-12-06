import React from 'react';
import { Link } from 'react-router-dom';

const BlogTable = ({ blog, index, deleteHandler, togglePublish, handleSelect, isSelected }) => {
  if (!blog) return null;

  return (
    <tr className="data-table-tr">
      <td className="table-th-n">
        <input type="checkbox" onChange={(e) => handleSelect(e, blog._id)} checked={isSelected} />
      </td>
      <td className="table-th-n">{index}</td>
      <td className="table-th-title">{blog.title}</td>
      <td className="table-th-status">{new Date(blog.createdAt).toLocaleDateString()}</td>
      <td className="table-th-status">
        <p style={{ color: blog.isPublished ? 'green' : 'red' }}>
          {blog.isPublished ? "Published" : "Unpublished"}
        </p>
      </td>
      <td className="table-th-action">
        <button className="table-data-publish-button" onClick={() => togglePublish(blog._id)}>
          {blog.isPublished ? "Unpublish" : "Publish"}
        </button>

        <Link to={`/admin/addblog?id=${blog._id}`} title="Edit Blog" style={{ marginLeft: '10px', border: 'none', cursor: 'pointer', background: 'none', color: '#444' }}>
          <i style={{color:'#4825e6',fontSize:'16px'}} className="fa-solid fa-pen-to-square"></i>
        </Link>

        <button onClick={() => deleteHandler(blog._id)} className="data-cancel fa-solid fa-xmark" title="Delete Blog" style={{ marginLeft: '10px', border: 'none', cursor: 'pointer', background: 'none' }} />
      </td>
    </tr>
  );
};

export default BlogTable;