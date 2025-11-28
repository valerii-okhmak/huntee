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
import minus from '../../../img/minus.png';
import { FiLink } from 'react-icons/fi'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';

import DEFAULT_AVATAR from '../../../img/avatar.png'; 


const Profile = () => {

  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [educationData, setEducationData] = useState(null);
  const [sertificatesData, setSertificatesData] = useState(null);
  const [experienceData, setExperienceData] = useState(null);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(null);
  const [mediaLinksData, setMediaLinksData] = useState(null);
  const [activeTab, setActiveTab] = useState("cabinet");


  const fetchExperience = async () => {
    try {
      const token = getAccessToken();
      const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/profile/experiences`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}` 
        },
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
            headers: {
          'Authorization': `Bearer ${token}` 
          },
          });
          const data = response.data;

          if (!data.profileImage) {
            data.profileImage = DEFAULT_AVATAR;
          } else  {
            data.profileImage = `${process.env.REACT_APP_BACKEND}/api/profile/avatar/${data.profileImage}`;

            console.log(data.profileImage);
          }

          setProfileData(data);
        } catch (error) {
          console.error('Помилка завантаження профілю:', error.response?.data || error.message);
        }
      };


        const fetchEducation = async () => {
      try {
        const token = getAccessToken();
        const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/profile/education`, {
          headers: {
          'Authorization': `Bearer ${token}` 
         }, 
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
          headers: {
          'Authorization': `Bearer ${token}` 
         },
        });
        setSertificatesData(response.data);
      } catch (error) {
        console.error('Помилка при завантаженні профілю:', error);
      }
    };

    const fetchMediaLinks = async () => {
      try {
        const token = getAccessToken();
        const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/profile/links`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        setMediaLinksData(response.data);
      } catch (error) {
        console.error('Помилка при завантаженні профілю:', error);
      }
    };

  useEffect(() => {
    fetchProfile();
    fetchEducation();
    fetchSertificates();
    fetchExperience();
    fetchMediaLinks();
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
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setIsLocalProvider(response.data.providerID.includes(1));
      } catch (error) {
        console.error('Помилка при перевірці провайдера:', error);
      }
    };

    checkLocalProvider();
  }, []);


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

  const handleLinkDelete= async (idToDelete) => {
    const token = getAccessToken();
    if (!token) {
      return;
    }

    try {
      const response = await axios.delete(`${process.env.REACT_APP_BACKEND}/api/profile/links/${idToDelete}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      setMediaLinksData(currentLinks => currentLinks.filter(link => link.id !== idToDelete));
      fetchMediaLinks();
    } catch (err) {
      console.error('Не вдалося видалити посилання:', err);
    }
  };

    const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const profileId = profileData?.user_id || ''; 
    const profileUrl = `${window.location.origin}/profile/${profileId}`;

    navigator.clipboard.writeText(profileUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1300); 
      })
      .catch((err) => {
        console.error('Не вдалося скопіювати посилання:', err);
      });
  };

return (
    <div className="profile-main">
      <div className="profile-columns">
        
        {/* === Вкладки профілю === */}
        <div className='choose-profile-type-container'>
          <div className="choose-profile-type">
            <span
              className={activeTab === "cabinet" ? "active-profile-tab" : ""}
              onClick={() => setActiveTab("cabinet")}
            >
              Мій кабінет
            </span>

            <span
              className={activeTab === "admin" ? "active-profile-tab" : ""}
              onClick={() => setActiveTab("admin")}
            >
              Адміністративна панель
            </span>
          </div>

          <div className='profile-horizontal-line'></div>
        </div>

        {/* === Вміст Мій кабінет === */}
        {activeTab === "cabinet" && (
          <>
            <div className='profile-left-right-column'>
              <div className="profile-column-left">
                <div id='personal-information' className="profile-container personal-profile-container">
                  <div className="profile-header-section">
                    <h3 className="section-title">
                      Особиста інформація
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="edit-icon"
                      onClick={() => handleOpenModal("editProfile")}
                      style={{ cursor: 'pointer'}}
                    />
                    </h3>

                    <div className="profile-avatar">
                      <img
                        src={profileData ? profileData.profileImage : DEFAULT_AVATAR}
                        alt="Avatar"
                        className="profile-avatar"
                      />
                    </div>

                    <h2 className="profile-name">
                      {profileData ? `${profileData.firstName} ${profileData.lastName}` : 'Завантаження...'}
                    </h2>

                    <h2 className="profile-age">
                      {profileData && profileData.birthDate
                        ? `${getAgeFromBirthDate(profileData.birthDate)} років`
                        : ''}
                    </h2>

                    <div className='buttons-profile'>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <button
                          id="link-information"
                          className="profile-edit-btn"
                          onClick={handleCopy}
                        >
                          Поділитись посиланням <FontAwesomeIcon icon={faLink} className="link-icon" />
                        </button>

                        {copied && <div className="copy-popup">Скопійовано!</div>}
                      </div>

                      <button 
                        onClick={() => navigate('/mytests')}
                        id="my-tests" 
                        className="profile-edit-btn"
                      >
                        Мої тести
                      </button>

                      <button
                        onClick={logout}
                        id="exit" 
                        className="profile-edit-btn"
                      >
                        Вийти
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="profile-column-right">
                <div id='aditional-information' className="profile-container">
                  <div className="profile-info-section aditional-profile-info-section">
                    <div className='icon_and_title_container'>
                    <h3 className="subsection-title">Додаткова інформація</h3>
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="edit-icon"
                      onClick={() => handleOpenModal("additionalInfo")}
                      style={{ cursor: 'pointer'}}
                    />
                    </div>
                    <div className="profile-info-block">
                      <p className='aditional-text'>
                        {profileData?.about
                          ? profileData.about
                          : 'Допоможіть рекрутерам краще пізнати вас...'}
                      </p>
                    </div>
                  </div>

                  <div className='media-links'>
                    {mediaLinksData?.length > 0 &&
                      mediaLinksData.map((item) => (
                        <div key={item.id} className='media-link-wrapper'>
                          <a className='media-link-item' href={item.url} target="_blank">
                            <img src={`/social-icons/${item.type.toLowerCase()}.png`} alt={item.type} className="media-link-icon" />
                            {item.type}
                          </a>
                          <div className='delete-icon' onClick={() => handleLinkDelete(item.id)}>
                            <img src={minus} alt="Delete" className="delete-icon-img" />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div id='achievements' className="profile-container">
                  <div className="profile-info-section achievement-profile-info-section">
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
                <FontAwesomeIcon 
                  icon={faPlus} 
                  className="plus-icon" 
                  onClick={() => handleOpenModal("education")} 
                  style={{ cursor: 'pointer' }}
                />
                <div className="profile-info-bottom-section">
                  <h3 className="subsection-title">Освіта</h3>

                  {educationData?.length > 0 ? (
                    educationData.map((item, index) => (
                      <ProfileItem 
                        key={index}
                        id={item.id || index}
                        title={item.institution}
                        description={item.specialities}
                        fetch={fetchEducation}
                        type="education"
                        isMyProfile={true}
                      />
                    ))
                  ) : (
                    <p className='empty-placeholder'>Додайте інформацію про університет.</p>
                  )}
                </div>
              </div>
              <div id='sertificates' className="profile-container">
                <FontAwesomeIcon 
                  icon={faPlus} 
                  className="plus-icon" 
                  onClick={() => handleOpenModal("courses")} 
                  style={{ cursor: 'pointer' }}
                />
                <div className="profile-info-bottom-section">
                  <h3 className="subsection-title">Сертифікати</h3>

                  {sertificatesData?.length > 0 ? (
                    sertificatesData.map((item, index) => (
                      <ProfileItem 
                        key={index}
                        id={item.id || index}
                        title={item.course_name}
                        url={item.certificateUrl}
                        description={item.description}
                        fetch={fetchSertificates}
                        type="courses"
                        isMyProfile={true}
                      />
                    ))
                  ) : (
                    <p className='empty-placeholder'>Додайте інформацію про сертифікати.</p>
                  )}
                </div>
              </div>
              <div id='experience' className="profile-container">
                <FontAwesomeIcon 
                  icon={faPlus} 
                  className="plus-icon" 
                  onClick={() => handleOpenModal("experience")} 
                  style={{ cursor: 'pointer' }}
                />
                <div className="profile-info-bottom-section">
                  <h3 className="subsection-title">Проєкти</h3>

                  {experienceData?.length > 0 ? (
                    experienceData.map((item, index) => (
                      <ProfileItem 
                        key={index}
                        id={item.id || index}
                        title={item.projectName}
                        url={item.projectUrl}
                        description={item.description}
                        fetch={fetchExperience}
                        type="experiences"
                        isMyProfile={true}
                      />
                    ))
                  ) : (
                    <p className='empty-placeholder'>Додайте інформацію про проєкти.</p>
                  )}
                </div>
              </div>
              {isLocalProvider && (
                <div id='password' className="profile-container">
                  <div className="profile-info-section">
                    <h4 className="subsection-title">Пароль</h4>
                    <div className="profile-info-block">
                      <p>Ми рекомендуємо вам періодично оновлювати пароль.</p>
                      <button className="profile-edit-btn right-btn" onClick={()=>handleOpenModal("password")}>
                        Змінити пароль
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* === Вміст Адміністративна панель === */}
        {activeTab === "admin" && (
          <>
            <div className='profile-left-right-column'>
              <div className="profile-column-left">
                <div id='personal-information' className="profile-container personal-profile-container">
                  <div className="profile-header-section">
                    <h3 className="section-title">
                      Особиста інформація
                     <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="edit-icon"
                      onClick={() => handleOpenModal("editProfile")}
                      style={{ cursor: 'pointer'}}
                    />
                    </h3>

                    <div className="profile-avatar">
                      <img
                        src={profileData ? profileData.profileImage : DEFAULT_AVATAR}
                        alt="Avatar"
                        className="profile-avatar"
                      />
                    </div>

                    <h2 className="profile-name">
                      {profileData ? `${profileData.firstName} ${profileData.lastName}` : 'Завантаження...'}
                    </h2>

                    <h2 className="profile-age">
                      {profileData && profileData.birthDate
                        ? `${getAgeFromBirthDate(profileData.birthDate)} років`
                        : ''}
                    </h2>

                    <div className='buttons-profile'>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <button
                          id="link-information"
                          className="profile-edit-btn"
                          onClick={handleCopy}
                        >
                          Поділитись посиланням <FontAwesomeIcon icon={faLink} className="link-icon" />
                        </button>

                        {copied && <div className="copy-popup">Скопійовано!</div>}
                      </div>

                      <button 
                        onClick={() => navigate('/viewingtests')}
                        id="my-tests" 
                        className="profile-edit-btn"
                      >
                        Мої тести
                      </button>

                      <button
                        onClick={logout}
                        id="exit" 
                        className="profile-edit-btn"
                      >
                        Вийти
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="profile-column-right">
                <div id='aditional-information' className="profile-container">
                  <div className="profile-info-section aditional-profile-info-section">
                    <div className='icon_and_title_container'>
                    <h3 className="subsection-title">Додаткова інформація</h3>
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="edit-icon"
                      onClick={() => handleOpenModal("additionalInfo")}
                      style={{ cursor: 'pointer'}}
                    />
                    </div>
                    <div className="profile-info-block">
                      <p className='aditional-text'>
                        {profileData?.about
                          ? profileData.about
                          : 'Допоможіть рекрутерам краще пізнати вас...'}
                      </p>
                    </div>
                  </div>

                  <div className='media-links'>
                    {mediaLinksData?.length > 0 &&
                      mediaLinksData.map((item) => (
                        <div key={item.id} className='media-link-wrapper'>
                          <a className='media-link-item' href={item.url} target="_blank">
                            <img src={`/social-icons/${item.type.toLowerCase()}.png`} alt={item.type} className="media-link-icon" />
                            {item.type}
                          </a>
                          <div className='delete-icon' onClick={() => handleLinkDelete(item.id)}>
                            <img src={minus} alt="Delete" className="delete-icon-img" />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <div id='analytics' className="profile-container">
                <div className="profile-info-section analytics-profile-info-section">
                  <h4 className="subsection-title">Аналітика</h4>
                  <button className="analytics-btn">Переглянути детальну аналітику</button>
                </div>
                <div className='diagram-container'>
                    <Diagram />
                </div>
                </div>
                <div className="admin-panel-tests-info-container">
                  <div className='admin-panel-tests-info'>
                    <p className="admin-panel-tests-label">Кількість створених тестів:</p>
                    <span className="admin-panel-tests-value">20</span>
                  </div>
                  <div className='admin-panel-tests-info'>
                    <p className="admin-panel-tests-label">Активні тести:</p>
                    <span className="admin-panel-tests-value">4</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

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
    fetchMediaLinks={fetchMediaLinks}
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
  );
};

export default Profile;