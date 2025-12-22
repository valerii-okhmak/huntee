import React, { useState, forwardRef, useImperativeHandle } from "react";
import './TestCreationMainCreator.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faListCheck, 
  faKeyboard, 
  faLaptopCode,
  faImage
} from '@fortawesome/free-solid-svg-icons';
import TestCreationMainAnswers from "../TestCreationMainAnswers/TestCreationMainAnswers";

const MIN_BASE_OPTIONS = 2;

const TestCreationMainCreator = forwardRef(({ onQuestionsChange }, ref) => {
  const [selectedType, setSelectedType] = useState("regular");
  const [questionText, setQuestionText] = useState("");
  const [comment, setComment] = useState("");
  // Стан для балів (зберігаємо як рядок для зручності введення крапки)
  const [points, setPoints] = useState("1"); 
  const [errors, setErrors] = useState({});

  const [options, setOptions] = useState(["", ""]);
  const [regularCorrect, setRegularCorrect] = useState(null);
  const [multipleCorrect, setMultipleCorrect] = useState([false, false]);

  const [openExpectedEnabled, setOpenExpectedEnabled] = useState(true);
  const [openExpectedText, setOpenExpectedText] = useState("");

  const [codeLanguage, setCodeLanguage] = useState("java");
  const [codeMethodName, setCodeMethodName] = useState("");
  const [codeTemplate, setCodeTemplate] = useState("");
  const [codeTestCasesJSON, setCodeTestCasesJSON] = useState('[{"args": [1, 2], "expected": 3}]');

  // Очищення помилок
  const clearError = (field) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // --- Логіка для поля балів ---
  const handlePointsChange = (e) => {
    const val = e.target.value;
    // Дозволяємо порожній рядок (для видалення), цифри та одну крапку
    if (val === "" || /^[0-9]*\.?[0-9]*$/.test(val)) {
      setPoints(val);
      clearError('points');
    }
  };

  const blockInvalidChar = (e) => {
    // Блокуємо e, E (експонента), + та -
    if (['e', 'E', '+', '-'].includes(e.key)) {
      e.preventDefault();
    }
  };
  // -----------------------------

  const addOption = () => {
    setOptions(prev => [...prev, ""]);
    setMultipleCorrect(prev => [...prev, false]);
    clearError('optionsCount');
    clearError('emptyOptions');
  };

  const removeOption = (idx) => {
    if (idx < MIN_BASE_OPTIONS) return;
    setOptions(prev => prev.filter((_, i) => i !== idx));
    setMultipleCorrect(prev => prev.filter((_, i) => i !== idx));
    if (regularCorrect === idx) setRegularCorrect(null);
    else if (regularCorrect > idx) setRegularCorrect(prev => prev - 1);
  };

  const updateOption = (idx, value) => {
    setOptions(prev => prev.map((opt, i) => (i === idx ? value : opt)));
    clearError('emptyOptions');
  };

  const pickRegularCorrect = (idx) => {
    setRegularCorrect(idx);
    clearError('correctSelection');
  };

  const toggleMultipleCorrect = (idx) => {
    setMultipleCorrect(prev => prev.map((val, i) => (i === idx ? !val : val)));
    clearError('correctSelection');
  };

  useImperativeHandle(ref, () => ({
    getCurrentQuestionAndReset() {
      const newErrors = {};

      if (!questionText.trim()) {
        newErrors.questionText = true;
      }

      // Валідація балів
      const floatPoints = parseFloat(points);
      if (!points || isNaN(floatPoints) || floatPoints <= 0) {
        newErrors.points = true;
      }

      let backendType;
      if (selectedType === "regular") backendType = "SINGLE_CHOICE";
      else if (selectedType === "multiple") backendType = "MULTIPLE_CHOICE";
      else if (selectedType === "open") backendType = "TEXT";
      else if (selectedType === "practical") backendType = "CODE";
      else backendType = "TEXT"; 

      let payload = { 
          questionText: questionText.trim(),
          comment: comment.trim(),
          questionType: backendType,
          points: floatPoints // Відправляємо як число
      };

      if (selectedType === "regular" || selectedType === "multiple") {
        if (options.length < MIN_BASE_OPTIONS) {
          newErrors.optionsCount = `Має бути щонайменше ${MIN_BASE_OPTIONS} варіанти`;
        }
        if (options.some(o => !o.trim())) {
          newErrors.emptyOptions = true;
        }

        if (selectedType === "regular") {
          if (regularCorrect === null) {
            newErrors.correctSelection = "Позначте правильну відповідь";
          }
          payload.choiceOptions = options.map((text, index) => ({
              optionText: text.trim(),
              isCorrect: index === regularCorrect,
              orderIndex: index
          }));
        } else {
          if (!multipleCorrect.some(v => v)) {
            newErrors.correctSelection = "Позначте щонайменше одну правильну відповідь";
          }
          payload.choiceOptions = options.map((text, index) => ({
              optionText: text.trim(),
              isCorrect: multipleCorrect[index],
              orderIndex: index
          }));
        }
      }

      if (selectedType === "open") {
        if (openExpectedEnabled && !openExpectedText.trim()) {
          newErrors.openExpectedText = true;
        }
        payload.textAnswer = {
            correctText: openExpectedText.trim(),
            isCaseSensitive: false
        };
      }

      if (selectedType === "practical") {
         if (!codeMethodName.trim()) newErrors.codeMethodName = true;
         if (!codeTemplate.trim()) newErrors.codeTemplate = true;
         try {
             JSON.parse(codeTestCasesJSON);
         } catch (e) {
             newErrors.codeTestCasesJSON = "Невірний формат JSON";
         }
         payload.codeAnswer = {
             language: codeLanguage,
             methodName: codeMethodName.trim(),
             templateCode: codeTemplate,
             testCases: codeTestCasesJSON
         };
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return null;
      }

      // Скидання станів
      setQuestionText("");
      setComment("");
      setPoints("1"); 
      setOptions(["", ""]);
      setRegularCorrect(null);
      setMultipleCorrect([false, false]);
      setOpenExpectedText("");
      setErrors({});
      
      setCodeLanguage("java");
      setCodeMethodName("");
      setCodeTemplate("");
      setCodeTestCasesJSON('[{"args": [1, 2], "expected": 3}]');

      onQuestionsChange?.(prev => (typeof prev === 'number' ? prev + 1 : prev));
      return payload;
    }
  }));

  return (
    <div className='testCreationMainCreator'>
      <div className='container testCreationMainCreator__container'>
        <h2 className='testCreationMainCreator__title'>Оберіть тип запитання:</h2>

        <div className='testCreationMainCreator__typeSelector'>
          <button
            className={`testCreationMainCreator__selectedType ${selectedType === "regular" ? "active" : ""}`}
            onClick={() => { setSelectedType("regular"); setErrors({}); }}
          >
            <FontAwesomeIcon icon={faCheckCircle} className="testCreationMainCreator_icon" />
            З однією відповіддю
          </button>

          <button
            className={`testCreationMainCreator__selectedType ${selectedType === "multiple" ? "active" : ""}`}
            onClick={() => { setSelectedType("multiple"); setErrors({}); }}
          >
            <FontAwesomeIcon icon={faListCheck} className="testCreationMainCreator_icon" />
            Множинний вибір
          </button>

          <button
            className={`testCreationMainCreator__selectedType ${selectedType === "open" ? "active" : ""}`}
            onClick={() => { setSelectedType("open"); setErrors({}); }}
          >
            <FontAwesomeIcon icon={faKeyboard} className="testCreationMainCreator_icon" />
            Відкрита відповідь
          </button>

          <button
            className={`testCreationMainCreator__selectedType ${selectedType === "practical" ? "active" : ""}`}
            onClick={() => { setSelectedType("practical"); setErrors({}); }}
          >
            <FontAwesomeIcon icon={faLaptopCode} className="testCreationMainCreator_icon" />
            Практичний тест
          </button>
        </div>

        <div className="testCreationMainCreator__questionField">
          <div className="testCreationMainCreator__questionField-header">
            <h2 className="testCreationMainCreator__questionField-title">Запитання</h2>
          </div>
          <div className={`testCreationMainCreator__questionField-wrapper`}>
            <input
              type="text"
              placeholder={errors.questionText ? "Введіть текст запитання!" : "Введіть запитання"}
              value={questionText}
              onChange={(e) => {
                setQuestionText(e.target.value);
                clearError('questionText');
              }}
              className={`testCreationMainCreator__questionField-input ${errors.questionText ? 'input-error-placeholder' : ''}`}
            />
            <button className="testCreationMainCreator__questionField-btn" title="Додати зображення">
              <FontAwesomeIcon icon={faImage} />
            </button>
          </div>

          <div className="testCreationMainCreator__questionField-header">
            <h2 className="testCreationMainCreator__questionField-title">Кількість балів за правильну відповідь:</h2>
          </div>
          <div className={`testCreationMainCreator__questionField-wrapper`}>
            <input
              type="number"
              step="0.1"
              min="0.1"
              placeholder={errors.points ? "Введіть вагу!" : "Введіть вагу запитання"}
              value={points}
              onKeyDown={blockInvalidChar}
              onChange={handlePointsChange}
              className={`testCreationMainCreator__questionField-input ${errors.points ? 'input-error-placeholder' : ''}`}
            />
          </div>
        </div>

        <TestCreationMainAnswers
          selectedType={selectedType}
          comment={comment}
          setComment={setComment}
          errors={errors}
          options={options}
          updateOption={updateOption}
          addOption={addOption}
          removeOption={removeOption}
          minBase={MIN_BASE_OPTIONS}
          regularCorrect={regularCorrect}
          pickRegularCorrect={pickRegularCorrect}
          multipleCorrect={multipleCorrect}
          toggleMultipleCorrect={toggleMultipleCorrect}
          openExpectedEnabled={openExpectedEnabled}
          setOpenExpectedEnabled={setOpenExpectedEnabled}
          openExpectedText={openExpectedText}
          setOpenExpectedText={(val) => { setOpenExpectedText(val); clearError('openExpectedText'); }}
          codeLanguage={codeLanguage}
          setCodeLanguage={setCodeLanguage}
          codeMethodName={codeMethodName}
          setCodeMethodName={(val) => { setCodeMethodName(val); clearError('codeMethodName'); }}
          codeTemplate={codeTemplate}
          setCodeTemplate={(val) => { setCodeTemplate(val); clearError('codeTemplate'); }}
          codeTestCasesJSON={codeTestCasesJSON}
          setCodeTestCasesJSON={(val) => { setCodeTestCasesJSON(val); clearError('codeTestCasesJSON'); }}
        />

        {(errors.optionsCount || errors.correctSelection || errors.codeTestCasesJSON || errors.points) && (
          <div className="test-creator__error-message">
            {errors.optionsCount || errors.correctSelection || (errors.points && "Введіть коректну кількість балів (напр. 1 або 1.5)")}
          </div>
        )}
      </div>
    </div>
  )
});

export default TestCreationMainCreator;