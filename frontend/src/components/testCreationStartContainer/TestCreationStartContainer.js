import React, { useState, useRef } from 'react'
import './TestCreationStartContainer.css'
import SelectField from '../testCreation_SelectField/TestCreation_SelectField'
import { useNavigate } from 'react-router-dom';


const fieldOptions = [
    { value: 'frontend', label: 'FRONTEND' },
    { value: 'backend', label: 'BACKEND' },
    { value: 'devops', label: 'DEVOPS' },
    { value: 'sysadmin', label: 'SYSTEM ADMINISTRATION' },
    { value: 'dataanalyst', label: 'DATA ANALYST' }
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
    const [testName, setTestName] = useState('');
    const [selectedField, setSelectedField] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [description, setDescription] = useState('');
    const [responsibilities, setResponsibilities] = useState('');
    const [startingDate, setStartingDate] = useState(new Date());
    const [finishingDate, setFinishingDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(0);
    const [classes, setClasses] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [errors, setErrors] = useState({});

    const refs = {
      testName: useRef(null),
      field: useRef(null),
      level: useRef(null),
      city: useRef(null),
    };

    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};

        if (!testName.trim()) newErrors.testName = 'Введіть назву тесту';
        if (!selectedField) newErrors.field = 'Оберіть сферу';
        if (!selectedLevel) newErrors.level = 'Оберіть рівень';
        if (!selectedCity) newErrors.city = 'Оберіть місто';

        setErrors(newErrors);

        // скрол до першого поля з помилкою
        const firstErrorKey = Object.keys(newErrors)[0];
        if (firstErrorKey && refs[firstErrorKey]?.current) {
            refs[firstErrorKey].current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (!validate()) return;

        const payload = {
            testName: testName.trim(),
            field: selectedField.value,
            level: selectedLevel.value,
            city: selectedCity.value,
            vacancyDescription: description,
            responsibilities: responsibilities || '',
            startTime: startingDate ? new Date(startingDate).toISOString() : null,
            endTime: finishingDate ? new Date(finishingDate).toISOString() : null,
            durationMinutes: Number(selectedTime) || 0,
            classes
        };

        navigate('/testcreation/main', { state: { testMeta: payload } });
    };

    return (
        <div className='testCreationStartContainer'>
            <div ref={refs.testName}>
                <SelectField
                    type="input"
                    selectedOption={testName}
                    setSelectedOption={setTestName}
                    fieldName="Введіть назву тесту"
                    fieldOptions={{}}
                    error={!!errors.testName}
                />
            </div>

            <div ref={refs.field}>
                <SelectField
                    type="select"
                    selectedOption={selectedField}
                    setSelectedOption={setSelectedField}
                    fieldName="Оберіть сферу"
                    fieldOptions={fieldOptions}
                    error={!!errors.field}
                />
            </div>

            <div ref={refs.level}>
                <SelectField
                    type="select"
                    selectedOption={selectedLevel}
                    setSelectedOption={setSelectedLevel}
                    fieldName="Оберіть рівень"
                    fieldOptions={levelOptions}
                    error={!!errors.level}
                />
            </div>

            <div ref={refs.city}>
                <SelectField
                    type="select"
                    selectedOption={selectedCity}
                    setSelectedOption={setSelectedCity}
                    fieldName="Оберіть місто"
                    fieldOptions={cityOptions}
                    error={!!errors.city}
                />
            </div>

            <SelectField
                    type="textarea"
                    selectedOption={description}
                    setSelectedOption={setDescription}
                    fieldName="Напишіть опис вакансії"
                    fieldOptions={{}}
            />

            <SelectField
                type="list"
                selectedOption={responsibilities}
                setSelectedOption={setResponsibilities}
                fieldName="Напишіть обов’язки"
                fieldOptions={{}}
            />
            <SelectField
                type="date"
                selectedOption={startingDate}
                setSelectedOption={setStartingDate}
                fieldName="Дата початку тестування"
                fieldOptions={{}}
            />
            <SelectField
                type="date"
                selectedOption={finishingDate}
                setSelectedOption={setFinishingDate}
                fieldName="Дата кінця тестування"
                fieldOptions={{}}
            />
            <SelectField
                type="time"
                selectedOption={selectedTime}
                setSelectedOption={setSelectedTime}
                fieldName="Таймер"
                fieldOptions={{}}
            />

            <button className={`testCreationStartContainer__next-button`} onClick={handleNext} >
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
            </button>
        </div>
    )
}

export default TestCreationStartContainer;
