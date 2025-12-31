import React, { useState, useRef, useEffect } from 'react';
import './TestCreationStartContainer.css'; // Використовуємо ті самі стилі
import SelectField from '../testCreation_SelectField/TestCreation_SelectField';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { getAccessToken } from '../../utils/auth'; // Припускаю, що утиліта там само



// Константи винесено назовні, щоб використовувати їх для пошуку при завантаженні
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

const TestCreationEditContainer = () => {
    const { testId } = useParams(); // Отримуємо ID тесту
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Стейт такий самий, як при створенні
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
    };

    // Завантаження існуючих даних
    useEffect(() => {
        const fetchTestData = async () => {
            try {
                const token = getAccessToken();
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/tests/${testId}`, { headers });
                const data = response.data;

                // Заповнюємо поля даними з бекенду
                setTestName(data.testName || '');
                setDescription(data.vacancyDescription || '');
                setResponsibilities(data.responsibilities || ''); // Припускаємо, що це рядок, якщо масив - треба join('\n')
                
                // Маппінг дат
                if (data.startTime) setStartingDate(new Date(data.startTime));
                if (data.endTime) setFinishingDate(new Date(data.endTime));
                
                setSelectedTime(data.durationMinutes || 0);

                // Маппінг випадаючих списків (шукаємо об'єкт по value)
                setSelectedField(fieldOptions.find(opt => opt.value === data.sphere) || null);
                setSelectedLevel(levelOptions.find(opt => opt.value === data.level?.toLowerCase()) || null);
                setSelectedCity(cityOptions.find(opt => opt.value === data.city) || null);

                // Маппінг налаштувань (Boolean -> Select Option)
                setSelectedTestType(data.isPrivate 
                    ? { value: 'private', label: 'Приватний' } 
                    : { value: 'public', label: 'Публічний' });
                
                setSelectedShowResults(data.isShowResult 
                    ? { value: 'yes', label: 'Так' } 
                    : { value: 'no', label: 'Ні' });

                setSelectedTestQuestionsSorting(data.isFixedQuestionOrder 
                    ? { value: 'fixed', label: 'Фіксований порядок' } 
                    : { value: 'random', label: 'Випадковий порядок' });

                setSelectedTestAnswersSorting(data.isFixedAnswerOrder 
                    ? { value: 'fixed', label: 'Фіксований порядок' } 
                    : { value: 'random', label: 'Випадковий порядок' });

                setLoading(false);
            } catch (error) {
                console.error("Помилка завантаження тесту:", error);
                alert("Не вдалося завантажити дані тесту");
                navigate('/viewingtests'); // Повернення назад при помилці
            }
        };

        if (testId) {
            fetchTestData();
        }
    }, [testId, navigate]);

    const validate = () => {
        const newErrors = {};
        if (!testName.trim()) newErrors.testName = 'Введіть назву тесту';
        if (!selectedField) newErrors.field = 'Оберіть сферу';
        if (!selectedLevel) newErrors.level = 'Оберіть рівень';
        if (!selectedCity) newErrors.city = 'Оберіть місто';

        setErrors(newErrors);

        const firstErrorKey = Object.keys(newErrors)[0];
        if (firstErrorKey && refs[firstErrorKey]?.current) {
            refs[firstErrorKey].current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async () => {
        if (!validate()) return;

        const payload = {
            testName: testName.trim(),
            field: selectedField.value, // Переконайтесь що бекенд чекає field або sphere
            sphere: selectedField.value, // Дублюємо про всяк випадок, залежить від DTO
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
        };

        try {
            // Опціонально: Ми можемо зберегти зміни мета-даних прямо тут
            const token = getAccessToken();
            const headers = { 
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}) 
            };
            
            await axios.put(`${process.env.REACT_APP_BACKEND}/api/tests/${testId}`, payload, { headers });

            // Переходимо до редагування питань
            navigate(`/testcreation/main/${testId}`);
            
        } catch (error) {
            console.error("Помилка при збереженні:", error);
            alert("Не вдалося зберегти зміни. Спробуйте ще раз.");
        }
    };

    if (loading) {
        return <div className="page"><div className="container" style={{paddingTop: '100px', textAlign: 'center'}}>Завантаження даних...</div></div>;
    }

    return (
        <div className='testCreationStartContainer'>
            <h2 style={{ marginBottom: '20px' }}>Редагування тесту</h2>
            
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

            <button className={`testCreationStartContainer__next-button`} onClick={handleNext} >
                Зберегти та перейти до питань
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

export default TestCreationEditContainer;