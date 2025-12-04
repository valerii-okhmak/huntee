import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './AddTestsButton.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';

const AddTestsButton = () => {
  const navigate = useNavigate(); 

  const handleClick = () => {
    navigate('/testcreation/start'); 
  };

  return (
    <button className="add-tests-button-block" onClick={handleClick}> 
      <FontAwesomeIcon icon={faFileCirclePlus} className="addtestbtn" />
      <span className="add-tests-button-text">Додати тест</span>
    </button>
  );
};

export default AddTestsButton;
