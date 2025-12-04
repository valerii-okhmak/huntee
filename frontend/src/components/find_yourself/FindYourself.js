import React from 'react';
import './FindYourself.css';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const FindYourself = () => {
  return (
    <div className="find-yourself">
      <div className="find-yourself__background">
        <div className="find-yourself__content">
          <p className="find-yourself__title">Find Yourself</p>
          <p className="find-yourself__subtitle">Не знаєш, з чого почати свій шлях в IT?</p>

          <div className='find-yourself__description'>
            <FontAwesomeIcon 
              icon={faMagnifyingGlass} 
              className="find-yourself__img"
            />

            <p className="find-yourself__text">
              Це коротке, але продумане опитування, яке визначить, чи більше тобі підходить 
              аналітика, розробка, дизайн, кібербезпека, тестування, DevOps чи, можливо, 
              щось зовсім неочікуване!
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
          <Link to="/login">
            <button className="start-test-button">Пройти тест</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FindYourself;
