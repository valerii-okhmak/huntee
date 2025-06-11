import React, { useState , useEffect, useParams} from 'react';
import axios from 'axios';
import '../main_profile/Profile.css';
import { useNavigate } from 'react-router-dom';
import Diagram from '../../diagram/Diagram';
import ProfileItem from '../item_profile/ProfileItem';



const DEFAULT_AVATAR = '../../../images/avatar.png'; 


const UserProfile = ({ user_id }) => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [educationData, setEducationData] = useState(null);
    const [sertificatesData, setSertificatesData] = useState(null);
    const [experienceData, setExperienceData] = useState(null);
    const [mediaLinksData, setMediaLinksData] = useState(null);



    const fetchExperience = async () => {
        try {
        
        const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/profile/experiences/user_id`, {
            params: { userId: `${user_id}` },
        });
        setExperienceData(response.data);
        } catch (error) {
        console.error('Помилка при завантаженні досвіду:', error);
        }
    };
  

    const fetchProfile = async () => {
        try {

          const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/profile/${user_id}`);
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
            const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/profile/education/user_id`, {
            params: { userId: `${user_id}` },
            });
            setEducationData(response.data);
        } catch (error) {
            console.error('Помилка при завантаженні профілю:', error);
        }
    };

    const fetchSertificates = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/profile/courses/user_id`, {
            params: { userId: `${user_id}` },
            });
            setSertificatesData(response.data);
        } catch (error) {
            console.error('Помилка при завантаженні профілю:', error);
        }
    };

    const fetchMediaLinks = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/profile/links/user_id`, {
            params: { userId: `${user_id}` },
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



    const getAgeFromBirthDate = (birthDateStr) => {
        const birthDate = new Date(birthDateStr);
        const today = new Date();

        if (isNaN(birthDate.getTime())) {
        return 0; 
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
              <h3 className="section-title section-title-nowrap">
                Особиста інформація
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
              <button
                  id="exit" 
                  className="profile-edit-btn">Зв'язатися
              </button>
              </div> 

            </div>
          </div>
        </div>

        
        <div className="profile-column-right">

          <div id='aditional-information' className="profile-container">
            <div className="profile-info-section aditional-profile-info-section">
              <h3 className="subsection-title">Додаткова інформація</h3>
              <div className="profile-info-block">
                <p className='aditional-text'>
                  {profileData?.about
                    ? profileData.about
                    : 'Допоможіть рекрутерам краще пізнати вас: опишіть, що робить саме вас чудовим кандидатом на посаду й поділіться іншими посиланнями.'}
                </p>
              </div>
            </div>
            <div className='media-links'>
                {mediaLinksData && mediaLinksData.length > 0 && (
                mediaLinksData.map((item, index) => (
                console.log(item),
                <a key={index} className='media-link-item' href={item.url} target="_blank" rel="noopener noreferrer">
                  <img src={`/social-icons/${item.type.toLowerCase()}.png`} alt="LinkedIn" className="media-link-icon" />
                  {item.type}
                </a>
                ))
              )}
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
                    isMyProfile={false}
                  />
                ))
              ) : (
                <p className='empty-placeholder'>Немає інформації про освіту.</p>
              )}
            </div>
          </div>
          <div id='sertificates' className="profile-container">
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
                    isMyProfile={false}
                  />
                ))
              ) : (
                <p className='empty-placeholder'>Немає інформації про сертифікати.</p>
              )}
            </div>
          </div>
          <div id='experience' className="profile-container">
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
                    isMyProfile={false}
                  />
                ))
              ) : (
                <p className='empty-placeholder'>Немає інформації про проєкти.</p>
              )}
            </div>
          </div>

        </div>

    </div>
  </div>
  );
};

export default UserProfile;