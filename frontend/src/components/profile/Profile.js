import React, { useState , useEffect} from 'react';
import axios from 'axios';
import './Profile.css';
import AdditionalInfoModal from './AdditionalInfoModal';
import CoursesModal from './CoursesModal';
import EducationModal from './EducationModal';
import ExperienceModal from './ExpirienceModal';
import editIcon from '../../img/pen.png';
import linkIcon from '../../img/link.png';
import { getAccessToken } from '../../utils/auth';


const Profile = () => {

  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getAccessToken();
        const response = await axios.get(`https://java-application-latest-mlfc.onrender.com/api/profile/me`, {
          params: { token: `${token}` },
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Помилка при завантаженні профілю:', error);
      }
    };

    fetchProfile();
  }, []);

  const [isAdditionalInfoModalOpen, setIsAdditionalInfoModalOpen] = useState(false);
  const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);

  const handleOpenModal = (modalType) => {
    switch (modalType) {
      case 'additionalInfo':
        setIsAdditionalInfoModalOpen(true);
        break;
      case 'courses':
        setIsCoursesModalOpen(true);
        break;
      case 'experience':
        setIsExperienceModalOpen(true);
        break;
      case 'education':
        setIsEducationModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleCloseModal = (modalType) => {
    switch (modalType) {
      case 'additionalInfo':
        setIsAdditionalInfoModalOpen(false);
        break;
      case 'courses':
        setIsCoursesModalOpen(false);
        break;
      case 'experience':
        setIsExperienceModalOpen(false);
        break;
      case 'education':
        setIsEducationModalOpen(false);
        break;
      default:
        break;
    }
  };


  return (
    <div className="profile-main">
      <div className="profile-columns">
        
        <div className="profile-column-left">
          
          <div id='personal-information' className="profile-container">
            <div className="profile-header-section">
              <h3 className="section-title">
                Особиста інформація
                <img src={editIcon} alt="Edit" className="edit-icon" />
              </h3>
              <div className="profile-avatar">
                {profileData?.profileImage && (
                  <img src={profileData.profileImage} alt="Аватар" className="avatar-img" />
                )}
              </div>
              <h2 className="profile-name">
                {profileData ? `${profileData.firstName} ${profileData.lastName}` : 'Завантаження...'}
              </h2>
              <button 
                  id="link-information" 
                  className="profile-edit-btn">Поділитись посиланням
                  <img src={linkIcon} alt="link" className="link-icon" /></button>

            </div>
          </div>

         
          <div id='aditional-information' className="profile-container">
            <div className="profile-info-section">
              <h3 className="section-title">Додаткова інформація</h3>
              <div className="profile-info-block">
                
                  <p className='aditional-text'>Допоможіть рекрутерам краще пізнати вас: опишіть, що робить саме вас чудовим кандидатом на посаду й поділіться іншими посиланнями.</p>
                  <button 
                  id="add-information" 
                  className="profile-edit-btn"
                  onClick={()=>handleOpenModal("additionalInfo")}>Додати додаткову інфомацію</button>
                
              </div>
            </div>
          </div>
        </div>

        
        <div className="profile-column-right">
          
          <div id='education' className="profile-container">
            <div className="profile-info-section">
              <h4 className="subsection-title">Освіта</h4>
              <div className="profile-info-block">
                <div className="profile-info-item">
                  <p>Додайте тут інформацію про місце навчання</p>
                  <button 
                  className="profile-edit-btn"
                  onClick={()=>handleOpenModal("education")}>Додати інфомацію про університет</button>
                </div>
                <div className="profile-info-item">
                  <p>Додайте тут інформацію про додаткові курси</p>
                  <button 
                  className="profile-edit-btn"
                  onClick={()=>handleOpenModal("courses")}>Додати інфомацію про курси</button>
                </div>
              </div>
            </div>
          </div>

          
          <div id='experience' className="profile-container">
            <div className="profile-info-section">
              <h4 className="subsection-title">Досвід</h4>
              <div className="profile-info-block">
                <div className="profile-info-item">
                  <p>Додайте тут інформацію про досвід роботи</p>
                  <button 
                  className="profile-edit-btn"
                  onClick={()=>handleOpenModal("experience")}>Додати інфомацію про проекти</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    <AdditionalInfoModal
    isOpen={isAdditionalInfoModalOpen}
    onClose={() => handleCloseModal('additionalInfo')}
    />
  <CoursesModal
        isOpen={isCoursesModalOpen}
        onClose={() => handleCloseModal('courses')}
      />
      <ExperienceModal
        isOpen={isExperienceModalOpen}
        onClose={() => handleCloseModal('experience')}
      />
      <EducationModal
        isOpen={isEducationModalOpen}
        onClose={() => handleCloseModal('education')}
      />
    </div>
  );
};

export default Profile;