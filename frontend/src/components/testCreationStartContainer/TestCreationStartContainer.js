import React, { useState, useRef, useEffect } from 'react';
import './TestCreationStartContainer.css';
import SelectField from '../testCreation_SelectField/TestCreation_SelectField';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAccessToken } from '../../utils/auth';

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

const TestCreationStartContainer = ({ mode, testId }) => {
  const navigate = useNavigate();

  const [testName, setTestName] = useState('');
  const [selectedField, setSelectedField] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
const [startingDate, setStartingDate] = useState(new Date());
  const [finishingDate, setFinishingDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(0);

  const [selectedTestType, setSelectedTestType] = useState({ value: 'public', label: 'Публічний' });
  const [selectedTestQuestionsSorting, setSelectedTestQuestionsSorting] = useState({ value: 'fixed', label: 'Фіксований порядок' });
  const [selectedTestAnswersSorting, setSelectedTestAnswersSorting] = useState({ value: 'fixed', label: 'Фіксований порядок' });
  const [selectedShowResults, setSelectedShowResults] = useState({ value: 'yes', label: 'Так' });

  const [errors, setErrors] = useState({});

  const refs = {
    testName: useRef(null),
    field: useRef(null),
    level: useRef(null),
    city: useRef(null),
    startingDate: useRef(null),
    finishingDate: useRef(null),
  };

  useEffect(() => {
    if (mode !== 'edit' || !testId) return;

    const token = getAccessToken();

    axios.get(`/api/tests/${testId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }).then(res => {
      const t = res.data;

      setTestName(t.testName);
      setSelectedField(fieldOptions.find(o => o.value === t.sphere));
      setSelectedLevel(levelOptions.find(o => o.value === t.level));
      setSelectedCity(cityOptions.find(o => o.value === t.city));
      setDescription(t.vacancyDescription || '');
      setResponsibilities(t.responsibilities || '');
      setStartingDate(t.startTime ? new Date(t.startTime) : null);
      setFinishingDate(t.endTime ? new Date(t.endTime) : null);
      setSelectedTime(t.durationMinutes || 0);

      setSelectedTestType(t.isPrivate
        ? { value: 'private', label: 'Приватний' }
        : { value: 'public', label: 'Публічний' }
      );

      setSelectedShowResults(t.isShowResult
        ? { value: 'yes', label: 'Так' }
        : { value: 'no', label: 'Ні' }
      );

      setSelectedTestQuestionsSorting(t.isFixedQuestionOrder
        ? { value: 'fixed', label: 'Фіксований порядок' }
        : { value: 'random', label: 'Випадковий порядок' }
      );

      setSelectedTestAnswersSorting(t.isFixedAnswerOrder
        ? { value: 'fixed', label: 'Фіксований порядок' }
        : { value: 'random', label: 'Випадковий порядок' }
      );
    });
  }, [mode, testId]);

  const validate = () => {
    const newErrors = {};
    if (!testName.trim()) newErrors.testName = 'Введіть назву тесту';
    if (!selectedField) newErrors.field = 'Оберіть сферу';
    if (!selectedLevel) newErrors.level = 'Оберіть рівень';
    if (!selectedCity) newErrors.city = 'Оберіть місто';

const isValidDate = (d) => {
      if (!d) return false;

      if (typeof d === 'string') return false; 

      if (typeof d.isValid === 'function') return d.isValid();

      return d instanceof Date && !isNaN(d.getTime());
    };
    if (!isValidDate(startingDate)) {
        newErrors.startingDate = 'Введіть коректну дату (ДД.ММ.РРРР)';
    }
    if (!isValidDate(finishingDate)) {
        newErrors.finishingDate = 'Введіть коректну дату (ДД.ММ.РРРР)';
    } 
    else if (isValidDate(startingDate) && new Date(finishingDate) <= new Date(startingDate)) {
        newErrors.finishingDate = 'Дата завершення має бути пізніше початку';
    }

    setErrors(newErrors);

    const firstError = Object.keys(newErrors)[0];
    if (firstError && refs[firstError]?.current) {
      refs[firstError].current.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
      responsibilities,
      startTime: startingDate ? startingDate.toISOString() : null,
      endTime: finishingDate ? finishingDate.toISOString() : null,
      durationMinutes: Number(selectedTime) || 0,
      isPrivate: selectedTestType.value === 'private',
      isShowResult: selectedShowResults.value === 'yes',
      isFixedQuestionOrder: selectedTestQuestionsSorting.value === 'fixed',
      isFixedAnswerOrder: selectedTestAnswersSorting.value === 'fixed'
    };

    navigate('/testcreation/main', {
      state: {
        mode,
        testId,
        testMeta: payload
      }
    });
  };

  return (
    <div className="testCreationStartContainer">
      <div ref={refs.testName}>
        <SelectField type="input" selectedOption={testName} setSelectedOption={setTestName} fieldName="Введіть назву тесту" error={!!errors.testName} />
      </div>

      <div ref={refs.field}>
        <SelectField type="select" selectedOption={selectedField} setSelectedOption={setSelectedField} fieldName="Оберіть сферу" fieldOptions={fieldOptions} error={!!errors.field} />
      </div>

      <div ref={refs.level}>
        <SelectField type="select" selectedOption={selectedLevel} setSelectedOption={setSelectedLevel} fieldName="Оберіть рівень" fieldOptions={levelOptions} error={!!errors.level} />
      </div>

      <div ref={refs.city}>
        <SelectField type="select" selectedOption={selectedCity} setSelectedOption={setSelectedCity} fieldName="Оберіть місто" fieldOptions={cityOptions} error={!!errors.city} />
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
      <div ref={refs.startingDate}>
        <SelectField
            type="date"
            selectedOption={startingDate}
            setSelectedOption={setStartingDate}
            fieldName="Дата початку тестування"
            error={!!errors.startingDate}
        />
        {errors.startingDate && <p style={{color: 'red', fontSize: '12px'}}>{errors.startingDate}</p>}
      </div>

      <div ref={refs.finishingDate}>
        <SelectField
            type="date"
            selectedOption={finishingDate}
            setSelectedOption={setFinishingDate}
            fieldName="Дата кінця тестування"
            error={!!errors.finishingDate} 
        />
        {errors.finishingDate && <p style={{color: 'red', fontSize: '12px'}}>{errors.finishingDate}</p>}
      </div>
      <SelectField
          type="time"
          selectedOption={selectedTime}
          setSelectedOption={setSelectedTime}
          fieldName="Таймер"
          fieldOptions={{}}
      />
      <SelectField
          type="testtype"
          selectedOption={selectedTestType}
          setSelectedOption={setSelectedTestType}
          fieldName="Тип тесту"
          fieldOptions={{}}
      />
      <SelectField
          type="testquestionssorting"
          selectedOption={selectedTestQuestionsSorting}
          setSelectedOption={setSelectedTestQuestionsSorting}
          fieldName="Порядок запитань"
          fieldOptions={{}}
      />
      <SelectField
          type="testanswerssorting"
          selectedOption={selectedTestAnswersSorting}
          setSelectedOption={setSelectedTestAnswersSorting}
          fieldName="Порядок відповідей"
          fieldOptions={{}}
      />
      <SelectField
          type="showresults"
          selectedOption={selectedShowResults}
          setSelectedOption={setSelectedShowResults}
          fieldName="Показувати результати після завершення тесту"
          fieldOptions={{}}
      />

      <button className="testCreationStartContainer__next-button" onClick={handleNext}>
        {mode === 'edit' ? 'Редагувати тест' : 'Наступна сторінка'}
      </button>
    </div>
  );
};

export default TestCreationStartContainer;
