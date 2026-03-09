import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useTranslation } from 'react-i18next';
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
import Select from 'react-select';

const MIN_BASE_OPTIONS = 2;

const TestCreationMainCreator = forwardRef(({ onQuestionsChange, globalSphere }, ref) => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState("regular");
  const [questionText, setQuestionText] = useState("");
  const [comment, setComment] = useState("");
  const [points, setPoints] = useState("1"); 
  const [errors, setErrors] = useState({});
  const [questionSphere, setQuestionSphere] = useState(null);

  const [options, setOptions] = useState(["", ""]);
  const [regularCorrect, setRegularCorrect] = useState(null);
  const [multipleCorrect, setMultipleCorrect] = useState([false, false]);

  const [openExpectedEnabled, setOpenExpectedEnabled] = useState(true);
  const [openExpectedText, setOpenExpectedText] = useState("");

  const [codeLanguage, setCodeLanguage] = useState("java");
  const [codeMethodName, setCodeMethodName] = useState("");
  const [codeTemplate, setCodeTemplate] = useState("");
  const [codeTestCasesJSON, setCodeTestCasesJSON] = useState('[{"args": [1, 2], "expected": 3}]');

  const fieldOptions = [
    { value: 'mixed', label: t('testCreationStart.options.mixed') },
    { value: 'frontend', label: 'FRONTEND' },
    { value: 'backend', label: 'BACKEND' },
    { value: 'devops', label: 'DEVOPS' },
    { value: 'sysadmin', label: 'SYSTEM ADMINISTRATION' },
    { value: 'dataanalyst', label: 'DATA ANALYST' }
  ];

  const clearError = (field) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePointsChange = (e) => {
    const val = e.target.value;
    if (val === "" || /^[0-9]*\.?[0-9]*$/.test(val)) {
      setPoints(val);
      clearError('points');
    }
  };

  const blockInvalidChar = (e) => {
    if (['e', 'E', '+', '-'].includes(e.key)) {
      e.preventDefault();
    }
  };

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
    loadQuestion(q) {
      setQuestionText(q.questionText || "");
      setComment(q.comment || "");
      setPoints(String(q.points || 1));
      setErrors({});

      let type = "regular";
      if (q.questionType === "SINGLE_CHOICE") type = "regular";
      else if (q.questionType === "MULTIPLE_CHOICE") type = "multiple";
      else if (q.questionType === "TEXT") type = "open";
      else if (q.questionType === "CODE") type = "practical";
      
      setSelectedType(type);

      // Логіка для варіантів відповідей
      if (type === "regular" || type === "multiple") {
        const newOptions = (q.choiceOptions || []).map(o => o.optionText || "");
        setOptions(newOptions.length > 0 ? newOptions : ["", ""]);

        if (type === "regular") {
          const correctIdx = (q.choiceOptions || []).findIndex(o => o.isCorrect);
          setRegularCorrect(correctIdx !== -1 ? correctIdx : null);
          setMultipleCorrect(new Array(newOptions.length || 2).fill(false));
        } else {
          const multCorrect = (q.choiceOptions || []).map(o => !!o.isCorrect);
          setMultipleCorrect(multCorrect.length > 0 ? multCorrect : [false, false]);
          setRegularCorrect(null);
        }
      } else {
        setOptions(["", ""]);
        setRegularCorrect(null);
        setMultipleCorrect([false, false]);
      }

      if (type === "open") {
        setOpenExpectedText(q.textAnswer?.correctText || "");
        setOpenExpectedEnabled(!!q.textAnswer?.correctText);
      } else {
        setOpenExpectedText("");
      }

      // Логіка для коду
      if (type === "practical") {
        setCodeLanguage(q.codeAnswer?.language || "java");
        setCodeMethodName(q.codeAnswer?.methodName || "");
        setCodeTemplate(q.codeAnswer?.templateCode || "");
        
        let tCases = '[{"args": [1, 2], "expected": 3}]';
        if (q.codeAnswer?.testCases) {
            tCases = typeof q.codeAnswer.testCases === 'string' 
              ? q.codeAnswer.testCases 
              : JSON.stringify(q.codeAnswer.testCases);
        }
        setCodeTestCasesJSON(tCases);
      } else {
        setCodeLanguage("java");
        setCodeMethodName("");
        setCodeTemplate("");
        setCodeTestCasesJSON('[{"args": [1, 2], "expected": 3}]');
      }
      setQuestionSphere(fieldOptions.find(o => o.value === q.sphere) || null);
    },

    getCurrentQuestionAndReset() {
      const newErrors = {};

      if (!questionText.trim()) {
        newErrors.questionText = true;
      }

      const floatPoints = parseFloat(points);
      if (!points || isNaN(floatPoints) || floatPoints < 0) {
        newErrors.points = true;
      }

      let backendType;
      if (selectedType === "regular") backendType = "SINGLE_CHOICE";
      else if (selectedType === "multiple") backendType = "MULTIPLE_CHOICE";
      else if (selectedType === "open") backendType = "TEXT";
      else if (selectedType === "practical") backendType = "CODE";
      else backendType = "TEXT"; 

      let payload = { 
          // Якщо редагуємо, ID залишається (він передається ззовні, тут ми формуємо лише тіло)
          questionText: questionText.trim(),
          comment: comment.trim(),
          questionType: backendType,
          points: floatPoints,  
          sphere: globalSphere === 'mixed' ? questionSphere?.value : globalSphere
      };

      if (selectedType === "regular" || selectedType === "multiple") {
        if (options.length < MIN_BASE_OPTIONS) {
          newErrors.optionsCount = t('testCreationCreator.errors.minOptions', { count: MIN_BASE_OPTIONS });
        }
        if (options.some(o => !o.trim())) {
          newErrors.emptyOptions = true;
        }

        if (selectedType === "regular") {
          if (regularCorrect === null) {
            newErrors.correctSelection = t('testCreationCreator.errors.selectCorrect');
          }
          payload.choiceOptions = options.map((text, index) => ({
              optionText: text.trim(),
              isCorrect: index === regularCorrect,
              orderIndex: index
          }));
        } else {
          if (!multipleCorrect.some(v => v)) {
            newErrors.correctSelection = t('testCreationCreator.errors.selectOneCorrect');
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
             newErrors.codeTestCasesJSON = t('testCreationCreator.errors.invalidJson');
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

      // Скидання форми (reset)
      setQuestionSphere(null);
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
      <div className='testCreationMainCreator__container'>
        <h2 className='testCreationMainCreator__title'>{t('testCreationCreator.chooseType')}</h2>

        <div className='testCreationMainCreator__typeSelector'>
          <button
            className={`testCreationMainCreator__selectedType ${selectedType === "regular" ? "active" : ""}`}
            onClick={() => { setSelectedType("regular"); setErrors({}); }}
          >
            <FontAwesomeIcon icon={faCheckCircle} className="testCreationMainCreator_icon" />
            {t('testCreationCreator.types.single')}
          </button>

          <button
            className={`testCreationMainCreator__selectedType ${selectedType === "multiple" ? "active" : ""}`}
            onClick={() => { setSelectedType("multiple"); setErrors({}); }}
          >
            <FontAwesomeIcon icon={faListCheck} className="testCreationMainCreator_icon" />
            {t('testCreationCreator.types.multiple')}
          </button>

          <button
            className={`testCreationMainCreator__selectedType ${selectedType === "open" ? "active" : ""}`}
            onClick={() => { setSelectedType("open"); setErrors({}); }}
          >
            <FontAwesomeIcon icon={faKeyboard} className="testCreationMainCreator_icon" />
            {t('testCreationCreator.types.open')}
          </button>

          <button
            className={`testCreationMainCreator__selectedType ${selectedType === "practical" ? "active" : ""}`}
            onClick={() => { setSelectedType("practical"); setErrors({}); }}
          >
            <FontAwesomeIcon icon={faLaptopCode} className="testCreationMainCreator_icon" />
            {t('testCreationCreator.types.practical')}
          </button>
        </div>

        <div className="testCreationMainCreator__questionField">
          <div className="testCreationMainCreator__questionField-header">
            <h2 className="testCreationMainCreator__questionField-title">{t('testCreationCreator.questionLabel')}</h2>
          </div>
          
          <div className={`testCreationMainCreator__questionField-wrapper ${errors.questionText ? 'input-error-placeholder' : ''}`}>
            <input
              type="text"
              placeholder={errors.questionText ? t('testCreationCreator.errors.questionRequired') : t('testCreationCreator.placeholders.question')}
              value={questionText}
              onChange={(e) => {
                setQuestionText(e.target.value);
                clearError('questionText');
              }}
              className="testCreationMainCreator__questionField-input"
            />
            <button className="testCreationMainCreator__questionField-btn" title={t('testCreationCreator.addImage')}>
              <FontAwesomeIcon icon={faImage} />
            </button>
          </div>

          {globalSphere === 'mixed' && (
            <>
              <div className="testCreationMainCreator__questionField-header">
                <h2 className="testCreationMainCreator__questionField-title">
                  {t('testCreationCreator.categoryLabel')}
                </h2>
              </div>
              <div className={'testCreationMainCreator__questionField-wrapper' }>
                <Select
                  options={fieldOptions}
                  value={questionSphere}
                  onChange={(val) => {
                    setQuestionSphere(val);
                    if (errors.questionSphere) setErrors(prev => ({...prev, questionSphere: false}));
                  }} 
                  isSearchable
                  placeholder={t('testCreationSelectField.search')}
                  className={`testCreationMainCreator__questionField-input testCreationMainCreator__questionField-input-field ${!!errors.questionSphere ? 'has-error' : ''}`}
                  classNamePrefix="select-field-tc__custom-select"
                />
              </div>
            </>
          )}

          <div className="testCreationMainCreator__questionField-header">
            <h2 className="testCreationMainCreator__questionField-title">{t('testCreationCreator.pointsLabel')}</h2>
          </div>
          
          <div className={`testCreationMainCreator__questionField-wrapper ${errors.points ? 'input-error-placeholder' : ''}`}>
            <input
              type="number"
              step="0.1"
              min="0"
              placeholder={errors.points ? t('testCreationCreator.errors.pointsRequired') : t('testCreationCreator.placeholders.points')}
              value={points}
              onKeyDown={blockInvalidChar}
              onChange={handlePointsChange}
              className="testCreationMainCreator__questionField-input"
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
            {errors.optionsCount || errors.correctSelection || (errors.points && t('testCreationCreator.errors.invalidPoints'))}
          </div>
        )}
      </div>
    </div>
  )
});

export default TestCreationMainCreator;