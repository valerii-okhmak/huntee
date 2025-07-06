import React from 'react';
import './FindYourself.css';
import loop from "../../img/loop.png"; 
import { Link } from 'react-router-dom';

const FindYourself = () => {
  return (
    <div className="find-yourself">
      <div className="find-yourself__background">
        <div className="find-yourself__content">
          <p className="find-yourself__title">Find Yourself</p>
          <p className="find-yourself__subtitle">Не знаєш, з чого почати свій шлях в IT?</p>
          <div className='find-yourself__description'>
          <img src={loop} alt="loop" className="find-yourself__img" />
          <p className="find-yourself__text">Це коротке, але продумане опитування, яке визначить, чи більше тобі підходить аналітика, розробка, дизайн, кібербезпека, тестування, DevOps чи, можливо, щось зовсім неочікуване!</p>
          </div>
          <div className='direction_list'>
            <img src="/directions-icons/devops.png" alt="devops" className="direction__img" />
            <img src="/directions-icons/html.png" alt="html" className="direction__img" />
            <img src="/directions-icons/sql.png" alt="sql" className="direction__img" />
            <img src="/directions-icons/python.png" alt="python" className="direction__img" />
            <img src="/directions-icons/java.png" alt="java" className="direction__img" />
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
