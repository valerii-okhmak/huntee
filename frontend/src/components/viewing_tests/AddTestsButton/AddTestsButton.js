import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './AddTestsButton.css';
import addtestbtn from '../../../img/test/addtestbtn.png';

const AddTestsButton = () => {
  const navigate = useNavigate(); 

  const handleClick = () => {
    navigate('/testcreation/start'); 
  };

  return (
    <button className="add-tests-button-block" onClick={handleClick}> 
      <img src={addtestbtn} alt="add" className="addtestbtn" />
      <span className="add-tests-button-text">Додати тест</span>
    </button>
  );
};

export default AddTestsButton;