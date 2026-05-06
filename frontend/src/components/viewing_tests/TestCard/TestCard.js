import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './TestCard.css';
import location_icon from '../../../img/test/location.png';
import { Link, useNavigate } from 'react-router-dom';
import { getAccessToken } from '../../../utils/auth';
import ConfirmDeleteTestModal from '../../modal_windows/ConfirmDeleteTestModal';
import ErrorModal from '../../modal_windows/ErrorModal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan, faCopy } from '@fortawesome/free-regular-svg-icons';

// 1. Додаємо status у пропси 👇
const TestCard = ({ id, title, type, location, date, time, link, candidatesCount, status, onDeleteSuccess}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [errorState, setErrorState] = useState({ isOpen: false, message: '' });

  const isEditDisabled = status === 'Active';

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
    // ... ваш код видалення без змін ...
    e.preventDefault(); 
    e.stopPropagation(); 

    try {
      const token = getAccessToken();
      const res = await fetch(`/api/tests/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || t('testCard.deleteError'));
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

    // Додаткова перевірка на випадок, якщо HTML атрибут disabled буде знято вручну
    if (isEditDisabled) return;

    navigate('/testcreation/start', {
      state: {
        mode: 'edit',
        testId: id
      }
    });
  };

  return (
    <>
      <Link to={link} className='testcard-link'>
        <div className='testcard-container'>
          <div className='testcard-top_row'>
            <p className='testcard-type'>{type}</p>
              <p className='testcard-status-active'>{t('testCard.registered')}: {candidatesCount}</p>
          </div>

          <div className='testcard-title'>{title}</div>
          
          <div className="testcard-buttons">
            <button
              className={`testcard-action-btn btn-edit ${isEditDisabled ? 'btn-disabled' : ''}`}
              onClick={isEditDisabled ? (e) => { e.preventDefault(); e.stopPropagation(); } : handleEdit}
              disabled={isEditDisabled}
              title={isEditDisabled ? "Неможливо редагувати активний тест" : ""}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
              <span>{t('testCard.edit')}</span>
            </button>

            <button
              className="testcard-action-btn btn-delete"
              onClick={openDeleteModal}
            >
              <FontAwesomeIcon icon={faTrashCan} />
              <span>{t('testCard.delete')}</span>
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
        onConfirm={handleDelete}
        testTitle={title}
      />

      <ErrorModal
        isOpen={errorState.isOpen}
        onClose={closeErrorModal}
        title={t('testCard.errorTitle')}
        errorMessage={errorState.message}
      />
    </>
  );
};

export default TestCard;