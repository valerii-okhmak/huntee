import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './FindYourself.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const FindYourself = () => {
  const { t } = useTranslation();

  return (
    <div className="find-yourself">
      <div className="find-yourself__background">
        <div className="find-yourself__content">
          <p className="find-yourself__title">{t('findYourself.title')}</p>
          <p className="find-yourself__subtitle">{t('findYourself.subtitle')}</p>

          <div className='find-yourself__description'>
            <FontAwesomeIcon 
              icon={faMagnifyingGlass} 
              className="find-yourself__img"
            />

            <p className="find-yourself__text">
              {t('findYourself.description')}
            </p>
          </div>

          <div className='direction_list'>
            <img src="/directions-icons/devops1.png" alt="devops" className="direction__img" />
            <img src="/directions-icons/html1.png" alt="html" className="direction__img" />
            <img src="/directions-icons/sql1.png" alt="sql" className="direction__img" />
            <img src="/directions-icons/python1.png" alt="python" className="direction__img" />
            <img src="/directions-icons/java1.png" alt="java" className="direction__img" />
          </div>
        </div>

        <div className='find-yourself__button'>
          <Link to="/">
            <button className="start-test-button">{t('findYourself.button')}</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FindYourself;