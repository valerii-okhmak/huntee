import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import axios from 'axios';
import { getAccessToken } from '../../../utils/auth';

const EducationModal = ({ isOpen, onClose, fetchEducation, educationData }) => {
  const [institution, setInstitution] = useState('');
  const [specialities, setSpecialities] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInstitution( '');
      setSpecialities( '');
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

      const body = {
        institution,
        specialities,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/profile/education`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      console.log('Освіту оновлено:', response.data);

      if (fetchEducation) {
        fetchEducation(); 
      }
      onClose(); 
    } catch (error) {
      console.error('Помилка оновлення освіти:', error.response?.data || error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
        <button className="modal-button modal-button-cancel" onClick={onClose}>
          Скасувати
        </button>
        <button className="modal-button modal-button-submit" onClick={updateEducation}>
          Зберегти
        </button>
      </div>
    </Modal>
  );
};

export default EducationModal;
