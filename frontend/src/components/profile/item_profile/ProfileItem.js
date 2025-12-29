import React from 'react';
import { Link } from 'react-router-dom';
import './ProfileItem.css';
import minus from '../../../img/minus.png';
import axios from 'axios';
import { getAccessToken } from '../../../utils/auth';

const ProfileItem = ({ id, title, description, url, fetch,type , isMyProfile}) => {
  const handleDelete = async () => {

    try {
      const token = getAccessToken();
      const response = await axios.delete(
        `/api/profile/${type}/${id}`,
        {headers: {'Authorization': `Bearer ${token}`}}
      );

      console.log('Освіту видалено:', response.data);

      if (fetch) {
        fetch(); 
      }
    } catch (error) {
      console.error('Помилка видалення:', error.response?.data || error.message);
    }
  };

  return (
    <div className="profile-item">
      {isMyProfile && (
      <img
        src={minus}
        alt="minus"
        className="minus-icon"
        onClick={handleDelete}
        style={{ cursor: 'pointer' }}
      />
      )}
      <h4>{title}</h4>
      <p>{description}</p>

      {url && (
        <Link to={url} target="_blank" className="profile-item-button">
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
