import React from 'react';
import { Link } from 'react-router-dom';

const ReviewTable = ({ review, index, deleteHandler, togglePublish, handleSelect, isSelected }) => {
  if (!review) return null;

  return (
    <tr className="data-table-tr">
      <td className="table-th-n">
        <input type="checkbox" onChange={(e) => handleSelect(e, review._id)} checked={isSelected} />
      </td>
      <td className="table-th-n">{index}</td>
      <td className="table-th-title">{review.reviewTitle}</td>
      <td className="table-th-status">{new Date(review.createdAt).toLocaleDateString()}</td>
      <td className="table-th-status">
        <p style={{ color: review.isPublished ? 'green' : 'red' }}>
          {review.isPublished ? "Published" : "Unpublished"}
        </p>
      </td>
      <td className="table-th-action">
        <button className="table-data-publish-button" onClick={() => togglePublish(review._id)}>
          {review.isPublished ? "Unpublish" : "Publish"}
        </button>

        <Link to={`/admin/addreview?id=${review._id}`} title="Edit Review" style={{ marginLeft: '10px', border: 'none', cursor: 'pointer', background: 'none', color: '#444' }}>
          <i style={{color:'#4825e6',fontSize:'16px'}} className="fa-solid fa-pen-to-square"></i>
        </Link>

        <button onClick={() => deleteHandler(review._id)} className="data-cancel fa-solid fa-xmark" title="Delete Review" style={{ marginLeft: '10px', border: 'none', cursor: 'pointer', background: 'none' }} />
      </td>
    </tr>
  );
};

export default ReviewTable;
