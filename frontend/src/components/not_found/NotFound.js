import React from "react";
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found__container">
            <h1 className="not-found__title">Сторінку не знайдено :(</h1>
            <p className="not-found__message">Вибачте, але сторінка, яку ви шукаєте, не існує.</p>
        </div>
    );
}

export default NotFound;