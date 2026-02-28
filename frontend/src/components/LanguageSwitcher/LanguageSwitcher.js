import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css'; 

const Flags = {
  en: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" width="24" height="18">
      <path fill="#012169" d="M0 0h640v480H0z"/>
      <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"/>
      <path fill="#C8102E" d="m424 281 216 159v40L369 281h55zM227 194 0 25v31l176 138h51zm354 0L640 151v31l-103 12h44zM51 281l-51 40v31l121-71H51z"/>
      <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z"/>
      <path fill="#C8102E" d="M281 0v480h80V0h-80zM0 201v80h640v-80H0z"/>
    </svg>
  ),
  uk: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" width="24" height="18">
      <path fill="#ffd700" d="M0 0h640v480H0z"/>
      <path fill="#0057b8" d="M0 0h640v240H0z"/>
    </svg>
  ),
  de: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" width="24" height="18">
      <path fill="#ffce00" d="M0 0h640v480H0z"/>
      <path d="M0 0h640v160H0z"/>
      <path fill="#d00" d="M0 160h640v160H0z"/>
    </svg>
  )
};

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'uk', label: 'Українська' },
    { code: 'de', label: 'Deutsch' }
  ];

  return (
    <div className="language-switcher">
      {languages.map((lang, index) => (
        <React.Fragment key={lang.code}>
          <button 
            className={`lang-btn ${i18n.language === lang.code ? 'active' : ''}`}
            onClick={() => changeLanguage(lang.code)}
            title={lang.label} // Підказка при наведенні
          >
            {Flags[lang.code]}
          </button>
          {index < languages.length - 1 && <span className="divider">|</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default LanguageSwitcher;