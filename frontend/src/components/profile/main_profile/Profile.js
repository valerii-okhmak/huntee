import React, { useState , useEffect} from 'react';
import axios from 'axios';
import './Profile.css';
import AdditionalInfoModal from '../modal_windows/AdditionalInfoModal';
import CoursesModal from '../modal_windows/CoursesModal';
import EducationModal from '../modal_windows/EducationModal';
import ExperienceModal from '../modal_windows/ExpirienceModal';
import editIcon from '../../../img/pen.png';
import linkIcon from '../../../img/link.png';
import { getAccessToken, logout} from '../../../utils/auth';
import { useNavigate } from 'react-router-dom';
import PasswordModal from '../modal_windows/PasswordModal';


const Profile = () => {

  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getAccessToken();
        const response = await axios.get(`http://localhost:8080/api/profile/me`, {
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
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLocalProvider, setIsLocalProvider] = useState(false);

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
      case 'password':
        setIsPasswordModalOpen(true);
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
      case 'password':
        setIsPasswordModalOpen(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const checkLocalProvider = async () => {
      try {
        const token = getAccessToken();
        const response = await axios.get('http://localhost:8080/api/profile/me', {
          params: { token: `${token}` },
        });
        setIsLocalProvider(response.data.providerID.includes(1));
      } catch (error) {
        console.error('Помилка при перевірці провайдера:', error);
      }
    };

    checkLocalProvider();
  }
, []);


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
                  <img src={profileData.profileImage} alt="Аватар" className="profile-avatar" />
                )}
              </div>
              <h2 className="profile-name">
                {profileData ? `${profileData.firstName} ${profileData.lastName}` : 'Завантаження...'}
              </h2>
              <div className='buttons-profile'>
              <button 
                  id="link-information" 
                  className="profile-edit-btn">Поділитись посиланням
                  <img src={linkIcon} alt="link" className="link-icon" /></button>
              <div className='bottom-buttons'>
              <button 
                  onClick={() => navigate('/mytests')}
                  id="my-tests" 
                  className="profile-edit-btn">Мої тести
              </button>
              <button
                  onClick={logout}
                  id="exit" 
                  className="profile-edit-btn">Вийти
              </button>
              </div>
              </div>

            </div>
          </div>

         
          <div id='aditional-information' className="profile-container">
            <div className="profile-info-section">
              <h3 className="subsection-title">Додаткова інформація</h3>
              <div className="profile-info-block">
                <p className='aditional-text'>
                  {profileData?.about
                    ? profileData.about
                    : 'Допоможіть рекрутерам краще пізнати вас: опишіть, що робить саме вас чудовим кандидатом на посаду й поділіться іншими посиланнями.'}
                </p>
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
                  className="profile-edit-btn right-btn"
                  onClick={()=>handleOpenModal("education")}>Додати інфомацію про університет</button>
                </div>
                <div className="profile-info-item">
                  <p>Додайте тут інформацію про додаткові курси</p>
                  <button 
                  className="profile-edit-btn right-btn"
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
                  className="profile-edit-btn right-btn"
                  onClick={()=>handleOpenModal("experience")}>Додати інфомацію про проекти</button>
                </div>
              </div>
            </div>
          </div>
          {          isLocalProvider && (
          <div id='password' className="profile-container">
            <div className="profile-info-section">
              <h4 className="subsection-title">Пароль</h4>
              <div className="profile-info-block">
                <div className="profile-info-item">
                  <p>Ми рекомендуємо вам періодично оновлювати пароль, щоб запобігти несанкціонованому доступу до вашого облікового запису.</p>
                  <button 
                  className="profile-edit-btn right-btn"
                  onClick={()=>handleOpenModal("password")}>Змінити пароль</button>
                </div>
              </div>
            </div>
          </div>
          )}
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
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => handleCloseModal('password')}
      />
    </div>
  );
};

export default Profile;