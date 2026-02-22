import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import './Contacts.css';

const Contacts = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    const subject = t('contacts.mailtoSubject', { name });
    const mailtoLink = `mailto:a.petrykovych@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}%0A%0AEmail: ${encodeURIComponent(email)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="contacts__form-wrapper">
      <p className="contacts__subtitle">
        {t('contacts.intro')}
        <br /><br />
        📩 <strong>{t('contacts.emailLabel')}:</strong> huntee@gmail.com<br />
        📞 <strong>{t('contacts.phoneLabel')}:</strong> +38 (098) 222 64 19<br />
        🕒 <strong>{t('contacts.scheduleLabel')}:</strong> {t('contacts.scheduleValue')}<br /><br />
        {t('contacts.outro')}
      </p>

      <form className="contacts__form" onSubmit={handleSubmit}>
        <h2 className="contacts__form-title">{t('contacts.formTitle')}</h2>

        <label htmlFor="name">{t('contacts.labels.name')}</label>
        <input 
            type="text" 
            id="name" 
            name="name" 
            placeholder={t('contacts.placeholders.name')} 
            value={formData.name} 
            onChange={handleChange} 
            required 
        />

        <label htmlFor="email">{t('contacts.labels.email')}</label>
        <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder={t('contacts.placeholders.email')} 
            value={formData.email} 
            onChange={handleChange} 
            required 
        />

        <label htmlFor="message">{t('contacts.labels.message')}</label>
        <textarea 
            id="message" 
            name="message" 
            placeholder={t('contacts.placeholders.message')} 
            value={formData.message} 
            onChange={handleChange} 
            required 
        />

        <button type="submit" className="contacts__button">
          {t('contacts.submit')}
        </button>
      </form>

      <div className="contacts__socials">
        <h3>{t('contacts.socialsTitle')}</h3>
        <p>{t('contacts.socialsText')}</p>
        <div className="contacts__icons">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className='contact__icon_facebook'>
                <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className='contact__icon_instagram'>
                <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className='contact__icon_linkedin'>
                 <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
        </div>
      </div>
    </div>
  );
};

export default Contacts;