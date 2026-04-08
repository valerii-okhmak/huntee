import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './TestCreationStartContainer.css';
import SelectField from '../testCreation_SelectField/TestCreation_SelectField';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAccessToken } from '../../utils/auth';
import { useLocalStorage } from '../../utils/useLocalStorage'; 

const TestCreationStartContainer = ({ mode, testId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Використовуємо кастомний хук для кожного поля. 
  // Кожне поле матиме свій ключ у localStorage, що дуже зручно.
  const [testName, setTestName] = useLocalStorage('tc_name', '');
  const [selectedField, setSelectedField] = useLocalStorage('tc_field', null);
  const [selectedLevel, setSelectedLevel] = useLocalStorage('tc_level', null);
  const [selectedCity, setSelectedCity] = useLocalStorage('tc_city', null);
  const [description, setDescription] = useLocalStorage('tc_desc', '');
  const [responsibilities, setResponsibilities] = useLocalStorage('tc_resp', '');
  const [startingDate, setStartingDate] = useLocalStorage('tc_start_date', new Date());
  const [finishingDate, setFinishingDate] = useLocalStorage('tc_end_date', new Date());
  const [selectedTime, setSelectedTime] = useLocalStorage('tc_time', 0);

  const [selectedTestType, setSelectedTestType] = useLocalStorage('tc_type', { value: 'public', label: t('testCreationStart.options.public') });
  const [selectedTestQuestionsSorting, setSelectedTestQuestionsSorting] = useLocalStorage('tc_q_sort', { value: 'fixed', label: t('testCreationStart.options.fixed') });
  const [selectedTestAnswersSorting, setSelectedTestAnswersSorting] = useLocalStorage('tc_a_sort', { value: 'fixed', label: t('testCreationStart.options.fixed') });
  const [selectedShowResults, setSelectedShowResults] = useLocalStorage('tc_results', { value: 'yes', label: t('testCreationStart.options.yes') });

  const [errors, setErrors] = React.useState({});

  const fieldOptions = [
    { value: 'mixed', label: t('testCreationStart.options.mixed') },
    { value: 'frontend', label: 'FRONTEND' },
    { value: 'backend', label: 'BACKEND' },
    { value: 'devops', label: 'DEVOPS' },
    { value: 'sysadmin', label: 'SYSTEM ADMINISTRATION' },
    { value: 'dataanalyst', label: 'DATA ANALYST' },
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

  // Пріоритет даних з API (якщо режим редагування)
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
      // ... заповнення інших полів аналогічно
    });
  }, [mode, testId]);

  const validate = () => {
    const newErrors = {};
    if (!testName?.trim()) newErrors.testName = t('testCreationStart.errors.testName');
    if (!selectedField) newErrors.field = t('testCreationStart.errors.field');
    
    const isValidDate = (d) => d && !isNaN(new Date(d).getTime());

    if (!isValidDate(startingDate)) newErrors.startingDate = t('testCreationStart.errors.date');
    if (!isValidDate(finishingDate)) {
      newErrors.finishingDate = t('testCreationStart.errors.date');
    } else if (new Date(finishingDate) <= new Date(startingDate)) {
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
      startTime: new Date(startingDate).toISOString(),
      endTime: new Date(finishingDate).toISOString(),
      durationMinutes: Number(selectedTime) || 0,
      isPrivate: selectedTestType.value === 'private',
      isShowResult: selectedShowResults.value === 'yes',
      isFixedQuestionOrder: selectedTestQuestionsSorting.value === 'fixed',
      isFixedAnswerOrder: selectedTestAnswersSorting.value === 'fixed'
    };


    navigate('/testcreation/main', { state: { mode, testId, testMeta: payload } });
  };

  return (
    <div className="testCreationStartContainer">
      {/* Ваша розмістка залишається без змін */}
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

      <SelectField type="textarea" selectedOption={description} setSelectedOption={setDescription} fieldName={t('testCreationStart.labels.description')} />
      <SelectField type="list" selectedOption={responsibilities} setSelectedOption={setResponsibilities} fieldName={t('testCreationStart.labels.responsibilities')} />

      <div ref={refs.startingDate}>
        <SelectField type="date" selectedOption={new Date(startingDate)} setSelectedOption={setStartingDate} fieldName={t('testCreationStart.labels.startDate')} error={!!errors.startingDate} />
        {errors.startingDate && <p style={{color: 'red', fontSize: '12px'}}>{errors.startingDate}</p>}
      </div>

      <div ref={refs.finishingDate}>
        <SelectField type="date" selectedOption={new Date(finishingDate)} setSelectedOption={setFinishingDate} fieldName={t('testCreationStart.labels.endDate')} error={!!errors.finishingDate} />
        {errors.finishingDate && <p style={{color: 'red', fontSize: '12px'}}>{errors.finishingDate}</p>}
      </div>

      <SelectField type="time" selectedOption={selectedTime} setSelectedOption={setSelectedTime} fieldName={t('testCreationStart.labels.timer')} />
      <SelectField type="testtype" selectedOption={selectedTestType} setSelectedOption={setSelectedTestType} fieldName={t('testCreationStart.labels.testType')} />
      <SelectField type="testquestionssorting" selectedOption={selectedTestQuestionsSorting} setSelectedOption={setSelectedTestQuestionsSorting} fieldName={t('testCreationStart.labels.questionOrder')} />
      <SelectField type="testanswerssorting" selectedOption={selectedTestAnswersSorting} setSelectedOption={setSelectedTestAnswersSorting} fieldName={t('testCreationStart.labels.answerOrder')} />
      <SelectField type="showresults" selectedOption={selectedShowResults} setSelectedOption={setSelectedShowResults} fieldName={t('testCreationStart.labels.showResults')} />

      <button className="testCreationStartContainer__next-button" onClick={handleNext}>
        {mode === 'edit' ? t('testCreationStart.buttons.save') : t('testCreationStart.buttons.next')}
      </button>
    </div>
  );
};

export default TestCreationStartContainer;