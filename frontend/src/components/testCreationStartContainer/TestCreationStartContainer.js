import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './TestCreationStartContainer.css';
import SelectField from '../testCreation_SelectField/TestCreation_SelectField';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAccessToken } from '../../utils/auth';

const TestCreationStartContainer = ({ mode, testId }) => {
  const { t } = useTranslation();
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

  const [selectedTestType, setSelectedTestType] = useState({ value: 'public', label: t('testCreationStart.options.public') });
  const [selectedTestQuestionsSorting, setSelectedTestQuestionsSorting] = useState({ value: 'fixed', label: t('testCreationStart.options.fixed') });
  const [selectedTestAnswersSorting, setSelectedTestAnswersSorting] = useState({ value: 'fixed', label: t('testCreationStart.options.fixed') });
  const [selectedShowResults, setSelectedShowResults] = useState({ value: 'yes', label: t('testCreationStart.options.yes') });

  const [errors, setErrors] = useState({});

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
    { value: 'ternopil', label: t('testCreationStart.cities.ternopil') },
    { value: 'ivano-frankivsk', label: t('testCreationStart.cities.frankivsk') },
    { value: 'lviv', label: t('testCreationStart.cities.lviv') },
    { value: 'online', label: t('testCreationStart.cities.online') },
  ];

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
      const tData = res.data;

      setTestName(tData.testName);
      setSelectedField(fieldOptions.find(o => o.value === tData.sphere));
      setSelectedLevel(levelOptions.find(o => o.value === tData.level));
      setSelectedCity(cityOptions.find(o => o.value === tData.city));
      setDescription(tData.vacancyDescription || '');
      setResponsibilities(tData.responsibilities || '');
      setStartingDate(tData.startTime ? new Date(tData.startTime) : null);
      setFinishingDate(tData.endTime ? new Date(tData.endTime) : null);
      setSelectedTime(tData.durationMinutes || 0);

      setSelectedTestType(tData.isPrivate
        ? { value: 'private', label: t('testCreationStart.options.private') }
        : { value: 'public', label: t('testCreationStart.options.public') }
      );

      setSelectedShowResults(tData.isShowResult
        ? { value: 'yes', label: t('testCreationStart.options.yes') }
        : { value: 'no', label: t('testCreationStart.options.no') }
      );

      setSelectedTestQuestionsSorting(tData.isFixedQuestionOrder
        ? { value: 'fixed', label: t('testCreationStart.options.fixed') }
        : { value: 'random', label: t('testCreationStart.options.random') }
      );

      setSelectedTestAnswersSorting(tData.isFixedAnswerOrder
        ? { value: 'fixed', label: t('testCreationStart.options.fixed') }
        : { value: 'random', label: t('testCreationStart.options.random') }
      );
    });
  }, [mode, testId, t]);

  const validate = () => {
    const newErrors = {};
    if (!testName.trim()) newErrors.testName = t('testCreationStart.errors.testName');
    if (!selectedField) newErrors.field = t('testCreationStart.errors.field');
    if (!selectedLevel) newErrors.level = t('testCreationStart.errors.level');
    if (!selectedCity) newErrors.city = t('testCreationStart.errors.city');

    const isValidDate = (d) => {
      if (!d) return false;
      if (typeof d === 'string') return false; 
      if (typeof d.isValid === 'function') return d.isValid();
      return d instanceof Date && !isNaN(d.getTime());
    };

    if (!isValidDate(startingDate)) {
        newErrors.startingDate = t('testCreationStart.errors.date');
    }
    if (!isValidDate(finishingDate)) {
        newErrors.finishingDate = t('testCreationStart.errors.date');
    } 
    else if (isValidDate(startingDate) && new Date(finishingDate) <= new Date(startingDate)) {
        newErrors.finishingDate = t('testCreationStart.errors.endDate');
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
        <SelectField type="input" selectedOption={testName} setSelectedOption={setTestName} fieldName={t('testCreationStart.labels.testName')} error={!!errors.testName} />
      </div>

      <div ref={refs.field}>
        <SelectField type="select" selectedOption={selectedField} setSelectedOption={setSelectedField} fieldName={t('testCreationStart.labels.field')} fieldOptions={fieldOptions} error={!!errors.field} />
      </div>

      <div ref={refs.level}>
        <SelectField type="select" selectedOption={selectedLevel} setSelectedOption={setSelectedLevel} fieldName={t('testCreationStart.labels.level')} fieldOptions={levelOptions} error={!!errors.level} />
      </div>

      <div ref={refs.city}>
        <SelectField type="select" selectedOption={selectedCity} setSelectedOption={setSelectedCity} fieldName={t('testCreationStart.labels.city')} fieldOptions={cityOptions} error={!!errors.city} />
      </div>

      <SelectField
          type="textarea"
          selectedOption={description}
          setSelectedOption={setDescription}
          fieldName={t('testCreationStart.labels.description')}
          fieldOptions={{}}
      />

      <SelectField
          type="list"
          selectedOption={responsibilities}
          setSelectedOption={setResponsibilities}
          fieldName={t('testCreationStart.labels.responsibilities')}
          fieldOptions={{}}
      />
      <div ref={refs.startingDate}>
        <SelectField
            type="date"
            selectedOption={startingDate}
            setSelectedOption={setStartingDate}
            fieldName={t('testCreationStart.labels.startDate')}
            error={!!errors.startingDate}
        />
        {errors.startingDate && <p style={{color: 'red', fontSize: '12px'}}>{errors.startingDate}</p>}
      </div>

      <div ref={refs.finishingDate}>
        <SelectField
            type="date"
            selectedOption={finishingDate}
            setSelectedOption={setFinishingDate}
            fieldName={t('testCreationStart.labels.endDate')}
            error={!!errors.finishingDate} 
        />
        {errors.finishingDate && <p style={{color: 'red', fontSize: '12px'}}>{errors.finishingDate}</p>}
      </div>
      <SelectField
          type="time"
          selectedOption={selectedTime}
          setSelectedOption={setSelectedTime}
          fieldName={t('testCreationStart.labels.timer')}
          fieldOptions={{}}
      />
      <SelectField
          type="testtype"
          selectedOption={selectedTestType}
          setSelectedOption={setSelectedTestType}
          fieldName={t('testCreationStart.labels.testType')}
          fieldOptions={{}}
      />
      <SelectField
          type="testquestionssorting"
          selectedOption={selectedTestQuestionsSorting}
          setSelectedOption={setSelectedTestQuestionsSorting}
          fieldName={t('testCreationStart.labels.questionOrder')}
          fieldOptions={{}}
      />
      <SelectField
          type="testanswerssorting"
          selectedOption={selectedTestAnswersSorting}
          setSelectedOption={setSelectedTestAnswersSorting}
          fieldName={t('testCreationStart.labels.answerOrder')}
          fieldOptions={{}}
      />
      <SelectField
          type="showresults"
          selectedOption={selectedShowResults}
          setSelectedOption={setSelectedShowResults}
          fieldName={t('testCreationStart.labels.showResults')}
          fieldOptions={{}}
      />

      <button className="testCreationStartContainer__next-button" onClick={handleNext}>
        {mode === 'edit' ? t('testCreationStart.buttons.save') : t('testCreationStart.buttons.next')}
      </button>
    </div>
  );
};

export default TestCreationStartContainer;