import React from 'react';
import Profile from '../components/profile/main_profile/Profile';
import UserProfile from '../components/profile/UserProfile/UserProfile';
import '../index.css';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { user_id } = useParams();
  return (
    <div className="profile-page">
      {!user_id ? (
          <Profile />
      ) : (
        <UserProfile user_id={user_id} />
      )}
    </div>
  );
};

export default ProfilePage;