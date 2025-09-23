import React, { useState } from 'react';
import './Contacts.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';


const Contacts = () => {
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

    const mailtoLink = `mailto:a.petrykovych@gmail.com?subject=Повідомлення від ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AEmail: ${encodeURIComponent(email)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="contacts__form-wrapper">
      <p className="contacts__subtitle">
        Маєте запитання або потребуєте додаткової інформації? Ми завжди раді допомогти!  Не соромтеся звертатися до нас з коментарями або запитаннями.<br /><br />
        📩 <strong>Електронна пошта:</strong> huntee@gmail.com<br />
        📞 <strong>Телефон:</strong> +38 (098) 222 64 19<br />
        🕒 <strong>Графік роботи:</strong> Пн–Пт, з 18:00 до 18:01<br /><br />
        Також ви можете скористатися контактною формою нижче – ми відповімо Вам якомога швидше.
      </p>

      <form className="contacts__form" onSubmit={handleSubmit}>
        <h2 className="contacts__form-title">Надішліть нам повідомлення</h2>

        <label htmlFor="name">Ваше ім’я</label>
        <input type="text" id="name" name="name" placeholder="Введіть ім’я" value={formData.name} onChange={handleChange} required />

        <label htmlFor="email">Ваша електронна пошта</label>
        <input type="email" id="email" name="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} required />

        <label htmlFor="message">Ваше повідомлення</label>
        <textarea id="message" name="message" placeholder="Ваше повідомлення" value={formData.message} onChange={handleChange} required />

        <button type="submit" className="contacts__button">
          Відправити
        </button>
      </form>

      <div className="contacts__socials">
        <h3>Соціальні мережі</h3>
        <p>Будьте на зв’язку з нами у соцмережах, щоб дізнаватись першими про новини та оновлення:</p>
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
