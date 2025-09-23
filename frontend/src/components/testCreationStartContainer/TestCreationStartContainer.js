import React, { useState } from 'react'
import './TestCreationStartContainer.css'
import SelectField from '../testCreation_SelectField/TestCreation_SelectField'
import { Link } from 'react-router-dom';

  
const fieldOptions = [
    { value: 'frontend', label: 'FRONTEND' },
    { value: 'backend', label: 'BACKEND' },
    { value: 'devops', label: 'DEVOPS' },
    { value: 'sysadmin', label: 'SYSTEM ADMINISTRATION' },
];
const levelOptions = [
  { value: 'junior', label: 'JUNIOR' },
  { value: 'middle', label: 'MIDDLE' },
  { value: 'senior', label: 'SENIOR' },
  { value: 'trainee', label: 'TRAINEE' },
];
const cityOptions = [
  { value: 'ternopil', label: 'Тернопіль' },
  { value: 'ivano-frankivsk', label: 'Івано-Франківськ' },
  { value: 'lviv', label: 'Львів' },
  { value: 'online', label: 'Онлайн' },
];

const TestCreationStartContainer = () => {
    const [selectedField, setSelectedField] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(0);

  return (
    <div className='testCreationStartContainer container'>
        <SelectField
            type={'select'}
            selectedOption={selectedField}
            setSelectedOption={setSelectedField}
            fieldName="Оберіть сферу"
            fieldOptions={fieldOptions}
        />
        <SelectField
            type={'select'}
            selectedOption={selectedLevel}
            setSelectedOption={setSelectedLevel}
            fieldName="Оберіть рівень"
            fieldOptions={levelOptions}
        />
        <SelectField
            type={'select'}
            selectedOption={selectedCity}
            setSelectedOption={setSelectedCity}
            fieldName="Оберіть місто"
            fieldOptions={cityOptions}
        />
        <SelectField
            type={'date'}
            selectedOption={selectedDate}
            setSelectedOption={setSelectedDate}
            fieldName="Оберіть дату"
            fieldOptions={{}}
        />
        <SelectField
            type={'time'}
            selectedOption={selectedTime}
            setSelectedOption={setSelectedTime}
            fieldName="Таймер"
            fieldOptions={{}}
        />
        <Link to="/starttest" className={`testCreationStartContainer__next-button`}>
            Наступна сторінка
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="34"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 38 24"
              style={{ marginLeft: "8px", verticalAlign: "middle" }}
            >
            <line x1="4" y1="12" x2="34" y2="12" />
            <polyline points="26 6 34 12 26 18" />
            </svg>
        </Link>
        
    </div>
  )
}

export default TestCreationStartContainer