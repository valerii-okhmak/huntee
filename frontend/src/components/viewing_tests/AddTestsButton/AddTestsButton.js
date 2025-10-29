import React from 'react';
import './AddTestsButton.css';
import addtestbtn from '../../../img/test/addtestbtn.png';

const AddTestsButton = () => {
  return (
    <button className="add-tests-button-block">
      <img src={addtestbtn} alt="add" className="addtestbtn" />
      <span className="add-tests-button-text">Додати тест</span>
    </button>
  );
};

export default AddTestsButton;
