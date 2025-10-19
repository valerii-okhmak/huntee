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
    const [description, setDescription] = useState(null);
    const [responsibilities, setResponsibilities] = useState(null);
    const [startingDate, setStartingDate] = useState(new Date());
    const [finishingDate, setFinishingDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(0);
    const [classes, setClasses] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);

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
            type={'textarea'}
            selectedOption={description}
            setSelectedOption={setDescription}
            fieldName="Напишіть опис вакансії"
            fieldOptions={{}}
        />
        <SelectField
            type={'textarea'}
            selectedOption={responsibilities}
            setSelectedOption={setResponsibilities}
            fieldName="Напишіть обов’язки"
            fieldOptions={{}}
        />
        <SelectField
            type={'date'}
            selectedOption={startingDate}
            setSelectedOption={setStartingDate}
            fieldName="Дата початку тестування"
            fieldOptions={{}}
        />
        <SelectField
            type={'date'}
            selectedOption={finishingDate}
            setSelectedOption={setFinishingDate}
            fieldName="Дата кінця тестування"
            fieldOptions={{}}
        />
        <SelectField
            type={'time'}
            selectedOption={selectedTime}
            setSelectedOption={setSelectedTime}
            fieldName="Таймер"
            fieldOptions={{}}
        />
        <SelectField
            type={'class'}
            selectedOption={classes}
            setSelectedOption={setClasses}
            fieldName="Класифікації питань"
            fieldOptions={fieldOptions}
        />
        <SelectField
            type={'add'}
            selectedOption={selectedQuestions}
            setSelectedOption={setSelectedQuestions}
            fieldName="Додати запитання з банки запитань"
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