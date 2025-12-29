import React, { useState, useRef, useEffect } from 'react'
import './TestCreationStartContainer.css'
import SelectField from '../testCreation_SelectField/TestCreation_SelectField'
import { useNavigate, useLocation } from 'react-router-dom';

// Опції виносимо, щоб мати до них доступ для пошуку
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
    const navigate = useNavigate();
    const location = useLocation();

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
    const [errors, setErrors] = useState({});
    
    const [selectedTestType, setSelectedTestType] = useState({ value: 'public', label: 'Публічний' });
    const [selectedTestQuestionsSorting, setSelectedTestQuestionsSorting] = useState({ value: 'fixed', label: 'Фіксований порядок' });
    const [selectedTestAnswersSorting, setSelectedTestAnswersSorting] = useState({ value: 'fixed', label: 'Фіксований порядок' });
    const [selectedShowResults, setSelectedShowResults] = useState({ value: 'yes', label: 'Так' });


    const [isEditing, setIsEditing] = useState(false);
    const [testId, setTestId] = useState(null);
    const [existingQuestions, setExistingQuestions] = useState([]);

    const refs = {
      testName: useRef(null),
      field: useRef(null),
      level: useRef(null),
      city: useRef(null),
    };

    useEffect(() => {
        if (location.state && location.state.testData) {
            const { testData, questions, isEditing, testId } = location.state;
            
            setIsEditing(isEditing);
            setTestId(testId);
            setExistingQuestions(questions || []);

            setTestName(testData.title || testData.testName || '');
            setDescription(testData.vacancyDescription || '');
            setResponsibilities(testData.responsibilities || ''); 
            setStartingDate(testData.startTime ? new Date(testData.startTime) : new Date());
            setFinishingDate(testData.endTime ? new Date(testData.endTime) : new Date());
            setSelectedTime(testData.durationMinutes || 0);


            const findOption = (options, val) => options.find(o => o.value.toLowerCase() === (val || '').toLowerCase());

            setSelectedField(findOption(fieldOptions, testData.field || testData.sphere));
            setSelectedLevel(findOption(levelOptions, testData.level));
            setSelectedCity(findOption(cityOptions, testData.city || testData.location));

            setSelectedTestType(testData.isPrivate ? { value: 'private', label: 'Приватний' } : { value: 'public', label: 'Публічний' });
            setSelectedShowResults(testData.isShowResult ? { value: 'yes', label: 'Так' } : { value: 'no', label: 'Ні' });
            setSelectedTestQuestionsSorting(testData.isFixedQuestionOrder ? { value: 'fixed', label: 'Фіксований порядок' } : { value: 'random', label: 'Випадковий порядок' });
            setSelectedTestAnswersSorting(testData.isFixedAnswerOrder ? { value: 'fixed', label: 'Фіксований порядок' } : { value: 'random', label: 'Випадковий порядок' });
        }
    }, [location.state]);


    const validate = () => {
        const newErrors = {};
        if (!testName.trim()) newErrors.testName = 'Введіть назву тесту';
        if (!selectedField) newErrors.field = 'Оберіть сферу';
        if (!selectedLevel) newErrors.level = 'Оберіть рівень';
        if (!selectedCity) newErrors.city = 'Оберіть місто';
        setErrors(newErrors);

        const firstErrorKey = Object.keys(newErrors)[0];
        if (firstErrorKey && refs[firstErrorKey]?.current) {
            refs[firstErrorKey].current.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
            isPrivate: selectedTestType?.value === 'private',
            isShowResult: selectedShowResults?.value === 'yes',
            isFixedQuestionOrder: selectedTestQuestionsSorting?.value === 'fixed',
            isFixedAnswerOrder: selectedTestAnswersSorting?.value === 'fixed',
            classes,
            isEditing: isEditing,
            testId: testId,
            existingQuestions: existingQuestions
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
               <SelectField type="select" selectedOption={selectedLevel} setSelectedOption={setSelectedLevel} fieldName="Оберіть рівень" fieldOptions={levelOptions} error={!!errors.level} />
            </div>
            <div ref={refs.city}>
               <SelectField type="select" selectedOption={selectedCity} setSelectedOption={setSelectedCity} fieldName="Оберіть місто" fieldOptions={cityOptions} error={!!errors.city} />
            </div>
            <SelectField type="textarea" selectedOption={description} setSelectedOption={setDescription} fieldName="Напишіть опис вакансії" fieldOptions={{}} />
            <SelectField type="list" selectedOption={responsibilities} setSelectedOption={setResponsibilities} fieldName="Напишіть обов’язки" fieldOptions={{}} />
            <SelectField type="date" selectedOption={startingDate} setSelectedOption={setStartingDate} fieldName="Дата початку тестування" fieldOptions={{}} />
            <SelectField type="date" selectedOption={finishingDate} setSelectedOption={setFinishingDate} fieldName="Дата кінця тестування" fieldOptions={{}} />
            <SelectField type="time" selectedOption={selectedTime} setSelectedOption={setSelectedTime} fieldName="Таймер" fieldOptions={{}} />
            <SelectField type="testtype" selectedOption={selectedTestType} setSelectedOption={setSelectedTestType} fieldName="Тип тесту" fieldOptions={{}} />
            <SelectField type="testquestionssorting" selectedOption={selectedTestQuestionsSorting} setSelectedOption={setSelectedTestQuestionsSorting} fieldName="Порядок запитань" fieldOptions={{}} />
            <SelectField type="testanswerssorting" selectedOption={selectedTestAnswersSorting} setSelectedOption={setSelectedTestAnswersSorting} fieldName="Порядок відповідей" fieldOptions={{}} />
            <SelectField type="showresults" selectedOption={selectedShowResults} setSelectedOption={setSelectedShowResults} fieldName="Показувати результати після завершення тесту" fieldOptions={{}} />

            <button className={`testCreationStartContainer__next-button`} onClick={handleNext} >
                {isEditing ? 'Далі (Редагування)' : 'Наступна сторінка'}
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 38 24" style={{ marginLeft: "8px", verticalAlign: "middle" }}>
                <line x1="4" y1="12" x2="34" y2="12" />
                <polyline points="26 6 34 12 26 18" />
                </svg>
            </button>
        </div>
    )
}

export default TestCreationStartContainer;