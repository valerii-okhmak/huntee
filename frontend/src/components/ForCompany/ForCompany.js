import React from 'react';
import './ForCompany.css';
import { Link } from 'react-router-dom';

const ForCompany = () => {
    return (
        <div className="for-company">
            <p className="for-company__title">Ваша компанія в пошуку співробітників?</p>
            <p className="for-company__subtitle"> Ми підготували для вас окрему сторінку, де зібрана вся необхідна інформація: як працює платформа, які переваги ви отримаєте, як знайти кандидатів, та як почати співпрацю з Huntee. </p>
            <div className="for-company__description">
                <p className="for-company__text">Дізнайтесь, як ефективно залучати таланти вже сьогодні!</p>
                <Link to="/companymain" className="for-company__button">
                    Сторінка для компаній
                </Link>

            </div>
        </div>
    );
};

export default ForCompany;