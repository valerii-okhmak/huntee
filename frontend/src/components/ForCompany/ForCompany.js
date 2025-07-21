import React from 'react';
import './ForCompany.css';
import { Link } from 'react-router-dom';
import backgVideo from '../../video/forcomp.mp4';

const ForCompany = () => {
    return (
        <div className="for-company">
            <video className="background-video" autoPlay loop muted>
                 <source src={backgVideo} type="video/mp4" />
                 Your browser does not support the video tag.
            </video>

            <p className="for-company__title">Ваша компанія в пошуку співробітників?</p>
            <p className="for-company__subtitle"> Ми підготували для вас окрему сторінку, де зібрана вся необхідна інформація: як працює платформа, які переваги ви отримаєте, як знайти кандидатів, як створюються тести, їх формат та як почати співпрацю з Huntee. </p>
            <div className="for-company__description">
                <p className="for-company__text"> Дізнайтесь, як ефективно<br />залучати таланти вже сьогодні!</p>
                <Link to="/companymain" className="for-company__button">
                    Сторінка для компаній
                </Link>

            </div>
        </div>
    );
};

export default ForCompany;