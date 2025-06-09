import React from 'react';
import { Link } from 'react-router-dom';
import './ProfileItem.css';
import minus from '../../../img/minus.png';

const ProfileItem = ({ id, title, description, url }) => {
  return (
    <div className="profile-item">
      <img
        src={minus}
        alt="minus"
        className="minus-icon"
      />
      <h4>{title}</h4>
      <p>{description}</p>

      {url && (
        <Link to={url} target='_blank' className="profile-item-button">
          Переглянути
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="34"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 38 24"
            style={{ marginLeft: "24px", verticalAlign: "middle" }}
          >
            <line x1="4" y1="12" x2="34" y2="12" />
            <polyline points="26 6 34 12 26 18" />
          </svg>
        </Link>
      )}
    </div>
  );
};

export default ProfileItem;
