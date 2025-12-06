import React from 'react';
import { Link } from 'react-router-dom';

const GuideTable = ({ guide, index, deleteHandler, togglePublish, handleSelect, isSelected }) => {
  if (!guide) return null;

  return (
    <tr className="data-table-tr">
      <td className="table-th-n">
        <input type="checkbox" onChange={(e) => handleSelect(e, guide._id)} checked={isSelected} />
      </td>
      <td className="table-th-n">{index}</td>
      <td className="table-th-title">{guide.title}</td>
      <td className="table-th-status">
        <p style={{ color: guide.isPublished ? 'green' : 'red' }}>
          {guide.isPublished ? "Published" : "Unpublished"}
        </p>
      </td>
      <td className="table-th-action">
        <button className="table-data-publish-button" onClick={() => togglePublish(guide._id)}>
          {guide.isPublished ? "Unpublish" : "Publish"}
        </button>

        <Link to={`/admin/addtravelguide?id=${guide._id}`} title="Edit Guide" style={{ marginLeft: '10px', border: 'none', cursor: 'pointer', background: 'none', color: '#444' }}>
          <i style={{color:'#4825e6',fontSize:'16px'}} className="fa-solid fa-pen-to-square"></i>
        </Link>

        <button onClick={() => deleteHandler(guide._id)} className="data-cancel fa-solid fa-xmark" title="Delete Guide" style={{ marginLeft: '10px', border: 'none', cursor: 'pointer', background: 'none' }} />
      </td>
    </tr>
  );
};

export default GuideTable;
