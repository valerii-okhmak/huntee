import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import axios from 'axios';
import { getAccessToken } from '../../utils/auth';

const EducationModal = ({ isOpen, onClose, fetchEducation, educationData }) => {
  const [institution, setInstitution] = useState('');
  const [specialities, setSpecialities] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInstitution('');
      setSpecialities('');
    }
  }, [isOpen, educationData]);

  const handleInstitutionChange = (e) => {
    setInstitution(e.target.value);
  };

  const handleSpecialitiesChange = (e) => {
    setSpecialities(e.target.value);
  };

  const updateEducation = async () => {
    try {
      const token = getAccessToken();

      const body = { institution, specialities };

      const response = await axios.post(
        `/api/profile/education`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      console.log('Освіту оновлено:', response.data);

      if (fetchEducation) fetchEducation();
      onClose();
    } catch (error) {
      console.error('Помилка оновлення освіти:', error.response?.data || error.message);
    }
  };

  // Логіка активації кнопки
  const isSaveDisabled = !institution.trim() || !specialities.trim();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>

      <button className="modal-close" onClick={onClose} aria-label="Закрити">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M14.2548 4.75488C14.5282 4.48152 14.9717 4.48152 15.2451 4.75488C15.5184 5.02825 15.5184 5.47175 15.2451 5.74512L10.9902 10L15.2451 14.2549C15.5184 14.5283 15.5184 14.9717 15.2451 15.2451C14.9717 15.5184 14.5282 15.5184 14.2548 15.2451L10 10.9902L5.74512 15.2451C5.47175 15.5184 5.02825 15.5184 4.75488 15.2451C4.48146 14.9717 4.48146 14.5283 4.75488 14.2549L9.00977 10L4.75488 5.74512C4.48146 5.47175 4.48146 5.02825 4.75488 4.75488C5.02825 4.48152 5.47175 4.48152 5.74512 4.75488L10 9.00977L14.2548 4.75488Z"/>
        </svg>
      </button>

      <h3 className="modal-title">Освіта</h3>

      <div className="modal-section">
        <label className="modal-label">Навчальний заклад</label>
        <textarea
          className="modal-textarea"
          placeholder="Додайте свій університет"
          value={institution}
          onChange={handleInstitutionChange}
        />
      </div>

      <div className="modal-section">
        <label className="modal-label">Спеціальність</label>
        <textarea
          className="modal-textarea"
          placeholder="Додайте свою спеціальність"
          value={specialities}
          onChange={handleSpecialitiesChange}
        />
      </div>

      <div className="modal-buttons">
        <button
          className={`modal-button modal-button-submit ${isSaveDisabled ? "disabled" : "active"}`}
          disabled={isSaveDisabled}
          onClick={() => !isSaveDisabled && updateEducation()}
        >
          Зберегти
        </button>
      </div>
    </Modal>
  );
};

export default EducationModal;
