import React, { useState , useEffect} from 'react';
import axios from 'axios';
import './Profile.css';
import AdditionalInfoModal from '../modal_windows/AdditionalInfoModal';
import CoursesModal from '../modal_windows/CoursesModal';
import EducationModal from '../modal_windows/EducationModal';
import ExperienceModal from '../modal_windows/ExpirienceModal';
import editIcon from '../../../img/pen.png';
import linkIcon from '../../../img/link.png';
import editInfo from '../../../img/editInfo.png';
import plus from '../../../img/plus.png';
import { getAccessToken, logout} from '../../../utils/auth';
import { useNavigate } from 'react-router-dom';
import PasswordModal from '../modal_windows/PasswordModal';
import Diagram from '../../diagram/Diagram';
import ProfileItem from '../item_profile/ProfileItem';
import EditProfileModal from '../modal_windows/EditProfileModal';


const Profile = () => {

  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [educationData, setEducationData] = useState(null);
  const [sertificatesData, setSertificatesData] = useState(null);
  const [experienceData, setExperienceData] = useState(null);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(null);

  const fetchExperience = async () => {
    try {
      const token = getAccessToken();
      const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/profile/experiences`, {
        params: { token: `${token}` },
      });
      setExperienceData(response.data);
    } catch (error) {
      console.error('Помилка при завантаженні досвіду:', error);
    }
  };
  

    const fetchProfile = async () => {
      try {
        const token = getAccessToken();
        const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/profile/me`, {
          params: { token: `${token}` },
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Помилка при завантаженні профілю:', error);
      }
    };

        const fetchEducation = async () => {
      try {
        const token = getAccessToken();
        const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/profile/education`, {
          params: { token: `${token}` },
        });
        setEducationData(response.data);
      } catch (error) {
        console.error('Помилка при завантаженні профілю:', error);
      }
    };

    const fetchSertificates = async () => {
      try {
        const token = getAccessToken();
        const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/profile/courses`, {
          params: { token: `${token}` },
        });
        setSertificatesData(response.data);
      } catch (error) {
        console.error('Помилка при завантаженні профілю:', error);
      }
    };

  useEffect(() => {
    fetchProfile();
    fetchEducation();
    fetchSertificates();
    fetchExperience();
  }, []);

  const [isAdditionalInfoModalOpen, setIsAdditionalInfoModalOpen] = useState(false);
  const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLocalProvider, setIsLocalProvider] = useState(false);

  const handleOpenModal = (modalType) => {
    switch (modalType) {
      case 'editProfile':
        setIsEditProfileModalOpen(true);
        break;
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
      case 'editProfile':
        setIsEditProfileModalOpen(false);
        break;
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
        const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/profile/me`, {
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

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  const getAgeFromBirthDate = (birthDateStr) => {
    const birthDate = new Date(birthDateStr);
    const today = new Date();

    if (isNaN(birthDate.getTime())) {
      return 0; // якщо дата некоректна
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 0 ? age : 0;
  };

  return (
    <div className="profile-main">
      <div className="profile-columns">
        <div className='profile-left-right-column'>
        <div className="profile-column-left">
          
          <div id='personal-information' className="profile-container personal-profile-container">
            <div className="profile-header-section">
              <h3 className="section-title">
                Особиста інформація
                <img src={editIcon} alt="Edit" className="edit-icon" onClick={()=>handleOpenModal("editProfile")}/>
              </h3>
              <div className="profile-avatar">
                {profileData?.profileImage && (
                  <img src={profileData.profileImage} alt="Аватар" className="profile-avatar" />
                )}
              </div>
              <h2 className="profile-name">
                {profileData ? `${profileData.firstName} ${profileData.lastName}` : 'Завантаження...'}
              </h2>
              <h2 className="profile-age">
                {profileData && profileData.birthDate
                  ? `${getAgeFromBirthDate(profileData.birthDate)} років`
                  : 'Завантаження...'}
              </h2>
              <div className='buttons-profile'>
              <button 
                  id="link-information" 
                  className="profile-edit-btn">Поділитись посиланням
                  <img src={linkIcon} alt="link" className="link-icon" /></button>
              <button 
                  onClick={() => navigate('/mytests')}
                  id="my-tests" 
                  className="profile-edit-btn">Мої тести
              </button>
              <button
                  onClick={handleLogout}
                  id="exit" 
                  className="profile-edit-btn">Вийти
              </button>
              </div>

            </div>
          </div>
        </div>

        
        <div className="profile-column-right">

          <div id='aditional-information' className="profile-container">
            <img src={editInfo} alt="edit" className="editInfo-icon" onClick={()=>handleOpenModal("additionalInfo")}/>
            <div className="profile-info-section">
              <h3 className="subsection-title">Додаткова інформація</h3>
              <div className="profile-info-block">
                <p className='aditional-text'>
                  {profileData?.about
                    ? profileData.about
                    : 'Допоможіть рекрутерам краще пізнати вас: опишіть, що робить саме вас чудовим кандидатом на посаду й поділіться іншими посиланнями.'}
                </p>
              </div>
            </div>
          </div>
          
          <div id='achievements' className="profile-container">
            <div className="profile-info-section">
              <h4 className="subsection-title">Досягнення</h4>
                <div className='achievements-block'>
                  <div className='achievement-info'>
                    <p className="achivement-label">Кількість пройдених тестів:</p>
                    <span className="achivement-value">8</span>
                  </div>  
                
                  <div className='achievement-info'>
                    <p className="achivement-label">Успішні:</p>
                    <span className="achivement-value">7</span>
                  </div>  
                </div>
              </div>

            <div className='diagram-container'>
              <Diagram />
            </div>
          </div>
        </div>

        </div>
        <div className="profile-column-bottom">
        <div id='education' className="profile-container">
            <img 
              src={plus} 
              alt="plus" 
              className="plus-icon" 
              onClick={() => handleOpenModal("education")} 
            />
            <div className="profile-info-bottom-section">
              <h3 className="subsection-title">Освіта</h3>
              {educationData && educationData.length > 0 ? (
                educationData.map((item, index) => (
                  <ProfileItem 
                    key={index} 
                    id={item.id || index} 
                    title={item.institution} 
                    description={item.specialities} 
                    fetch={fetchEducation}
                    type={"education"}
                  />
                ))
              ) : (
                <p className='empty-placeholder'>Додайте інформацію про університет, в якому навчаєтеся.</p>
              )}
            </div>
          </div>
          <div id='sertificates' className="profile-container">
            <img src={plus} alt="plus" className="plus-icon" onClick={()=>handleOpenModal("courses")}/>
            <div className="profile-info-bottom-section">
              <h3 className="subsection-title">Сертифікати</h3>
              {sertificatesData && sertificatesData.length > 0 ? (
                sertificatesData.map((item, index) => (
                  <ProfileItem 
                    key={index} 
                    id={item.id || index} 
                    title={item.course_name} 
                    url={item.certificateUrl}
                    description={item.description} 
                    fetch={fetchSertificates}
                    type={"courses"}
                  />
                ))
              ) : (
                <p className='empty-placeholder'>Додайте інформацію про сертифікати, які ви отримали.</p>
              )}
            </div>
          </div>
          <div id='experience' className="profile-container">
            <img src={plus} alt="plus" className="plus-icon" onClick={()=>handleOpenModal("experience")}/>
            <div className="profile-info-bottom-section">
              <h3 className="subsection-title">Проєкти</h3>
             {experienceData && experienceData.length > 0 ? (
                experienceData.map((item, index) => (
                  <ProfileItem 
                    key={index} 
                    id={item.id || index} 
                    title={item.projectName} 
                    url={item.projectUrl}
                    description={item.description} 
                    fetch={fetchExperience}
                    type={"experiences"}
                  />
                ))
              ) : (
                <p className='empty-placeholder'>Додайте інформацію про проєкти, в яких ви брали участь.</p>
              )}
            </div>
          </div>

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

        </div>
      

    <EditProfileModal
    isOpen={isEditProfileModalOpen}
    onClose={() => handleCloseModal('editProfile')}
    profileData={profileData}
    fetchProfile={fetchProfile}
    />
    <AdditionalInfoModal
    isOpen={isAdditionalInfoModalOpen}
    onClose={() => handleCloseModal('additionalInfo')}
    profileData={profileData}
    fetchProfile={fetchProfile}
    />
  <CoursesModal
        isOpen={isCoursesModalOpen}
        onClose={() => handleCloseModal('courses')}
        fetchSertificates={fetchSertificates}
        sertificatesData={sertificatesData}
      />
      <ExperienceModal
        isOpen={isExperienceModalOpen}
        onClose={() => handleCloseModal('experience')}
        fetchExperience={fetchExperience}
        experienceData={experienceData}
      />
      <EducationModal
        isOpen={isEducationModalOpen}
        onClose={() => handleCloseModal('education')}
        fetchEducation={fetchEducation}
        educationData={educationData}
      />
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => handleCloseModal('password')}
      />
    </div>
  </div>
  );
};

export default Profile;