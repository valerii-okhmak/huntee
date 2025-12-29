import React from 'react';
import './TestCard.css';
import location_icon from '../../../img/test/location.png';
import { Link, useNavigate } from 'react-router-dom';

const TestCard = ({ id, title, type, location, date, time, link, candidatesCount, onDeleteSuccess }) => {
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.preventDefault(); // Зупиняємо перехід за посиланням <Link>
    e.stopPropagation(); // Зупиняємо розповсюдження події до батьківських елементів

    if (window.confirm('Ви впевнені, що хочете видалити цей тест?')) {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/tests/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!res.ok) throw new Error('Помилка при видаленні тесту');
        
        // Викликаємо колбек, щоб оновити список тестів на сторінці
        if (onDeleteSuccess) onDeleteSuccess(id);
        alert('Тест успішно видалено');
      } catch (err) {
        console.error(err);
        alert('Не вдалося видалити тест');
      }
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // navigate(`/edit-test/${id}`); 
  };

  return (
    <Link to={link} className='testcard-link'>
      <div className='testcard-container'>
        <div className='testcard-top_row'>
          <p className='testcard-type'>{type}</p>
            <p className='testcard-status-active'>Зареєстровано: {candidatesCount}</p>
        </div>

        <div className='testcard-title'>{title}</div>
        <div className="modalmini-buttons">
          <button
            className="modalmini-button modalmini-button-cancel"
            onClick={handleEdit}
          >
            Редагувати
          </button>

          <button
            className="modalmini-button modalmini-button-submit modalmini-button-submit-danger"
            onClick={handleDelete}
          >
            Видалити
          </button>
        </div>

        <div className='testcard-bottom_row'>
          <div className='testcard-location'>
            <img alt='map' className='location_icon' src={location_icon} />
            <p>{location}</p>
          </div>
          <div className='testcard-date'>
            <p>{date}</p>
            <p className='testcard-time'>{time}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TestCard;
