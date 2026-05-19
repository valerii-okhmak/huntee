import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useTranslation } from 'react-i18next';
import './AddTestsButton.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';

const AddTestsButton = ({disabled}) => {
  const { t } = useTranslation();
  const navigate = useNavigate(); 

  const handleClick = () => {
    navigate('/testcreation/start'); 
  };

  return (
    <button className="add-tests-button-block" onClick={handleClick} disabled={disabled}> 
      <FontAwesomeIcon icon={faFileCirclePlus} className="addtestbtn" />
      <span className="add-tests-button-text">{t('addTestsButton.text')}</span>
    </button>
  );
};

export default AddTestsButton;