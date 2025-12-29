import React, { useState } from 'react';
import './TestCard.css';
import location_icon from '../../../img/test/location.png';
import { Link, useNavigate } from 'react-router-dom';
import { getAccessToken } from '../../../utils/auth';
import ConfirmDeleteTestModal from '../../modal_windows/ConfirmDeleteTestModal';

const TestCard = ({ id, title, type, location, date, time, link, candidatesCount, onDeleteSuccess }) => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [errorState, setErrorState] = useState({ isOpen: false, message: '' });

  const openDeleteModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsDeleteModalOpen(false);
  };

  const closeErrorModal = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    setErrorState({ isOpen: false, message: '' });
  };

  const handleDelete = async (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    try {
      const token = getAccessToken();
      const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/tests/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Не вдалося видалити тест. Можливо, у вас недостатньо прав.');
      }

      setIsDeleteModalOpen(false);
      if (onDeleteSuccess) onDeleteSuccess(id);
    } catch (err) {
      console.error(err);
      setIsDeleteModalOpen(false);
      setErrorState({
        isOpen: true,
        message: err.message
      });
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // navigate(`/edit-test/${id}`); 
  };

  return (
    <>
      <Link to={link} className='testcard-link'>
        <div className='testcard-container'>
          <div className='testcard-top_row'>
            <p className='testcard-type'>{type}</p>
              <p className='testcard-status-active'>Зареєстровано: {candidatesCount}</p>
          </div>

          <div className='testcard-title'>{title}</div>
          <div className="testcard-buttons">
            <button
              className="testcard-button testcard-button-cancel"
              onClick={handleEdit}
            >
              Редагувати
            </button>

            <button
              className="testcard-button testcard-button-submit testcard-button-submit-danger"
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

      <ConfirmDeleteTestModal 
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        testTitle={title}
      />

      <ErrorModal 
        isOpen={errorState.isOpen}
        onClose={closeErrorModal}
        title="ПОМИЛКА ВИДАЛЕННЯ"
        errorMessage={errorState.message}
      />
    </>
  );
};

export default TestCard;
