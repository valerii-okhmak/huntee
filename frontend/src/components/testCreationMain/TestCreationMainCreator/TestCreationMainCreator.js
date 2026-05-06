import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react"; // useRef видалено
import { useTranslation } from 'react-i18next';
import './TestCreationMainCreator.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faListCheck, 
  faKeyboard, 
  faLaptopCode,
  faImage,
  faFileImport
} from '@fortawesome/free-solid-svg-icons';
import TestCreationMainAnswers from "../TestCreationMainAnswers/TestCreationMainAnswers";
import Select from 'react-select';
import { useLocalStorage } from '../../../utils/useLocalStorage';
import axios from 'axios';
import { getAccessToken } from '../../../utils/auth';

import ImportQuestionsModal from '../../modal_windows/ImportQuestionsModal';

const STORAGE_DRAFT_KEY = 'tc_current_creator_q';
const MIN_BASE_OPTIONS = 2;

const TestCreationMainCreator = forwardRef(({ onQuestionsChange, globalSphere, onImportSuccess }, ref) => {
  const { t } = useTranslation();

  const [draftQ, setDraftQ] = useLocalStorage(STORAGE_DRAFT_KEY, {

    questionText: "",
    points: "1",
    selectedType: "regular",
    comment: "",
    options: ["", ""],
    regularCorrect: null,
    multipleCorrect: [false, false],
    openExpectedEnabled: true,
    openExpectedText: "",
    codeLanguage: "java",
    codeMethodName: "",
    codeTemplate: "",
    codeTestCasesJSON: '[{"args": [1, 2], "expected": 3}]'
  });

  const [questionText, setQuestionText] = useState(draftQ?.questionText || "");
  const [points, setPoints] = useState(draftQ?.points || "1");
  const [selectedType, setSelectedType] = useState(draftQ?.selectedType || "regular");
  const [comment, setComment] = useState(draftQ?.comment || "");
  const [options, setOptions] = useState(draftQ?.options || ["", ""]);
  const [regularCorrect, setRegularCorrect] = useState(draftQ?.regularCorrect ?? null);
  const [multipleCorrect, setMultipleCorrect] = useState(draftQ?.multipleCorrect || [false, false]);
  const [openExpectedEnabled, setOpenExpectedEnabled] = useState(draftQ?.openExpectedEnabled ?? true);
  const [openExpectedText, setOpenExpectedText] = useState(draftQ?.openExpectedText || "");
  const [codeLanguage, setCodeLanguage] = useState(draftQ?.codeLanguage || "java");
  const [codeMethodName, setCodeMethodName] = useState(draftQ?.codeMethodName || "");
  const [codeTemplate, setCodeTemplate] = useState(draftQ?.codeTemplate || "");
  const [codeTestCasesJSON, setCodeTestCasesJSON] = useState(draftQ?.codeTestCasesJSON || '[{"args": [1, 2], "expected": 3}]');

  const [errors, setErrors] = useState({});
  const [questionSphere, setQuestionSphere] = useState(null);

  // ДОДАНО: Стан для керування модальним вікном імпорту
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  useEffect(() => {
    setDraftQ({
      questionText, points, selectedType, comment,
      options, regularCorrect, multipleCorrect,
      openExpectedEnabled, openExpectedText,
      codeLanguage, codeMethodName, codeTemplate, codeTestCasesJSON
    });
  }, [
    questionText, points, selectedType, comment, 
    options, regularCorrect, multipleCorrect, 
    openExpectedEnabled, openExpectedText, 
    codeLanguage, codeMethodName, codeTemplate, codeTestCasesJSON, setDraftQ
  ]);

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
    if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
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
    clearError('duplicateOptions');
  };

  // ЗМІНЕНО: Тепер приймає файл та бали безпосередньо з модалки
  const handleImportSubmit = async (file, importedPoints) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const token = getAccessToken();
      
      const response = await axios.post('/api/tests/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      // Парсимо обрані користувачем бали (якщо поле порожнє, даємо 1 бал)
      const parsedPoints = parseFloat(importedPoints) || 1;

      const importedQuestions = response.data.map(q => ({
          ...q,
          id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          points: parsedPoints // ДОДАНО: Присвоюємо обрану вагу кожному питанню
      }));

      if (onImportSuccess) {
          onImportSuccess(importedQuestions);
      }

    } catch (error) {
      console.error("Помилка імпорту:", error);
    }
  };

  useImperativeHandle(ref, () => ({
    loadQuestion(q) {
      if (!q) return;

      let type = "regular";
      if (q.questionType === "SINGLE_CHOICE") type = "regular";
      else if (q.questionType === "MULTIPLE_CHOICE") type = "multiple";
      else if (q.questionType === "TEXT") type = "open";
      else if (q.questionType === "CODE") type = "practical";

      const newOptions = (q.choiceOptions || []).map(o => o.optionText || "");
      const finalOptions = newOptions.length > 0 ? newOptions : ["", ""];
      
      let regCorr = null;
      let multCorr = new Array(finalOptions.length).fill(false);

      if (type === "regular") {
        regCorr = (q.choiceOptions || []).findIndex(o => o.isCorrect);
        if (regCorr === -1) regCorr = null;
      } else if (type === "multiple") {
        multCorr = (q.choiceOptions || []).map(o => !!o.isCorrect);
      }

      const tCases = typeof q.codeAnswer?.testCases === 'string' 
        ? q.codeAnswer.testCases 
        : JSON.stringify(q.codeAnswer?.testCases || []);

      setQuestionText(q.questionText || "");
      setComment(q.comment || "");
      setPoints(String(q.points || 1));
      setSelectedType(type);
      setOptions(finalOptions);
      setRegularCorrect(regCorr);
      setMultipleCorrect(multCorr);
      setOpenExpectedText(q.textAnswer?.correctText || "");
      setOpenExpectedEnabled(!!q.textAnswer?.correctText);
      setCodeLanguage(q.codeAnswer?.language || "java");
      setCodeMethodName(q.codeAnswer?.methodName || "");
      setCodeTemplate(q.codeAnswer?.templateCode || "");
      setCodeTestCasesJSON(tCases);
      setQuestionSphere(fieldOptions.find(o => o.value === q.sphere) || null);

      setDraftQ({
        questionText: q.questionText || "",
        points: String(q.points || 1),
        selectedType: type,
        comment: q.comment || "",
        options: finalOptions,
        regularCorrect: regCorr,
        multipleCorrect: multCorr,
        openExpectedEnabled: !!q.textAnswer?.correctText,
        openExpectedText: q.textAnswer?.correctText || "",
        codeLanguage: q.codeAnswer?.language || "java",
        codeMethodName: q.codeAnswer?.methodName || "",
        codeTemplate: q.codeAnswer?.templateCode || "",
        codeTestCasesJSON: tCases
      });

      setErrors({});
    },

    resetForm() {
      const defaultState = {
        questionText: "",
        points: "1",
        selectedType: "regular",
        comment: "",
        options: ["", ""],
        regularCorrect: null,
        multipleCorrect: [false, false],
        openExpectedEnabled: true,
        openExpectedText: "",
        codeLanguage: "java",
        codeMethodName: "",
        codeTemplate: "",
        codeTestCasesJSON: '[{"args": [1, 2], "expected": 3}]'
      };

      setDraftQ(defaultState);

      setQuestionText("");
      setPoints("1");
      setSelectedType("regular");
      setComment("");
      setOptions(["", ""]);
      setRegularCorrect(null);
      setMultipleCorrect([false, false]);
      setOpenExpectedEnabled(true);
      setOpenExpectedText("");
      setQuestionSphere(null);
      setCodeLanguage("java");
      setCodeMethodName("");
      setCodeTemplate("");
      setCodeTestCasesJSON('[{"args": [1, 2], "expected": 3}]');
      setErrors({});
    },

    getCurrentQuestionAndReset() {
      const newErrors = {};
      const currentQuestionText = (questionText || "").trim();
      const currentComment = (comment || "").trim();
      const currentOpenExpectedText = (openExpectedText || "").trim();

      if (!currentQuestionText) newErrors.questionText = true;

      const floatPoints = parseFloat(points);
      if (!points || isNaN(floatPoints) || floatPoints < 0) newErrors.points = true;

      let backendType = selectedType === "regular" ? "SINGLE_CHOICE" : 
                        selectedType === "multiple" ? "MULTIPLE_CHOICE" : 
                        selectedType === "practical" ? "CODE" : "TEXT"; 

      let payload = { 
          questionText: currentQuestionText,
          comment: currentComment,
          questionType: backendType,
          points: floatPoints,  
          sphere: globalSphere === 'mixed' ? questionSphere?.value : globalSphere
      };

      if (selectedType === "regular" || selectedType === "multiple") {
        if (options.length < MIN_BASE_OPTIONS) {
          newErrors.optionsCount = t('testCreationCreator.errors.minOptions', { count: MIN_BASE_OPTIONS });
        }
        if (options.some(o => !(o || "").trim())) {
          newErrors.emptyOptions = true;
        }

        const trimmedOptions = options.map(o => (o || "").trim());
        const hasDuplicates = trimmedOptions.some((opt, index) => 
          opt !== "" && trimmedOptions.indexOf(opt) !== index
        );
        if (hasDuplicates) {
          newErrors.duplicateOptions = t('testCreationCreator.errors.duplicateOptions', 'Варіанти відповіді не можуть повторюватись');
        }

        if (selectedType === "regular") {
          if (regularCorrect === null) newErrors.correctSelection = t('testCreationCreator.errors.selectCorrect');
          payload.choiceOptions = options.map((text, index) => ({
              optionText: text.trim(),
              isCorrect: index === regularCorrect,
              orderIndex: index
          }));
        } else {
          if (!multipleCorrect.some(v => v)) newErrors.correctSelection = t('testCreationCreator.errors.selectOneCorrect');
          payload.choiceOptions = options.map((text, index) => ({
              optionText: text.trim(),
              isCorrect: multipleCorrect[index],
              orderIndex: index
          }));
        }
      }

      if (selectedType === "open") {
        if (openExpectedEnabled && !currentOpenExpectedText) newErrors.openExpectedText = true;
        payload.textAnswer = { correctText: currentOpenExpectedText, isCaseSensitive: false };
      }

      if (selectedType === "practical") {
         const currentCodeMethodName = (codeMethodName || "").trim();
         const currentCodeTemplate = (codeTemplate || "").trim();
         const currentCodeTestCases = (codeTestCasesJSON || "").trim();

         if (!currentCodeMethodName) newErrors.codeMethodName = true;
         if (!currentCodeTemplate) newErrors.codeTemplate = true;
         try {
             JSON.parse(currentCodeTestCases);
         } catch (e) {
             newErrors.codeTestCasesJSON = t('testCreationCreator.errors.invalidJson');
         }
         
         payload.codeAnswer = { 
           language: codeLanguage || "java", 
           methodName: currentCodeMethodName, 
           templateCode: currentCodeTemplate, 
           testCases: currentCodeTestCases 
         };
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return null;
      }

      this.resetForm();

      onQuestionsChange?.(prev => (typeof prev === 'number' ? prev + 1 : prev));
      return payload;
    }
  }));

  return (
    <div className='testCreationMainCreator'>
      {/* ДОДАНО: Модальне вікно для імпорту */}
      <ImportQuestionsModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onImport={handleImportSubmit} 
      />

      <div className='testCreationMainCreator__container'>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className='testCreationMainCreator__title' style={{ margin: 0 }}>
            {t('testCreationCreator.chooseType')}
          </h2>

          {/* ЗМІНЕНО: Тепер кнопка відкриває модалку, а прихований input видалено */}
          <button 
            className="import-btn" 
            onClick={() => setIsImportModalOpen(true)}
          >
            <div className="svg-wrapper-1">
              <div className="svg-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="icon"
                >
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
              </div>
            </div>
            <span>{t('testCreationCreator.importBtnLabel')}</span>
          </button>
        </div>

        {/* ... решта твого JSX без змін ... */}
        <div className='testCreationMainCreator__typeSelector'>
          {['regular', 'multiple', 'open', 'practical'].map(type => (
            <button
              key={type}
              className={`testCreationMainCreator__selectedType ${selectedType === type ? "active" : ""}`}
              onClick={() => { setSelectedType(type); setErrors({}); }}
            >
              <FontAwesomeIcon 
                icon={type === 'regular' ? faCheckCircle : type === 'multiple' ? faListCheck : type === 'open' ? faKeyboard : faLaptopCode} 
                className="testCreationMainCreator_icon" 
              />
              {t(`testCreationCreator.types.${type === 'regular' ? 'single' : type}`)}
            </button>
          ))}
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
              onChange={(e) => { setQuestionText(e.target.value); clearError('questionText'); }}
              className="testCreationMainCreator__questionField-input"
            />
            <button className="testCreationMainCreator__questionField-btn"><FontAwesomeIcon icon={faImage} /></button>
          </div>

          {globalSphere === 'mixed' && (
            <>
              <div className="testCreationMainCreator__questionField-header">
                <h2 className="testCreationMainCreator__questionField-title">{t('testCreationCreator.categoryLabel')}</h2>
              </div>
              <div className='testCreationMainCreator__questionField-wrapper'>
                <Select
                  options={fieldOptions}
                  value={questionSphere}
                  onChange={(val) => { setQuestionSphere(val); clearError('questionSphere'); }}
                  isSearchable
                  placeholder={t('testCreationSelectField.search')}
                  className="testCreationMainCreator__questionField-input-field"
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
              type="number" step="0.1" min="0"
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
          pickRegularCorrect={(idx) => { setRegularCorrect(idx); clearError('correctSelection'); }}
          multipleCorrect={multipleCorrect}
          toggleMultipleCorrect={(idx) => {
            const newCorrect = [...multipleCorrect];
            newCorrect[idx] = !newCorrect[idx];
            setMultipleCorrect(newCorrect);
            clearError('correctSelection');
          }}
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

        {(errors.optionsCount || errors.duplicateOptions || errors.correctSelection || errors.codeTestCasesJSON || errors.points) && (
          <div className="test-creator__error-message">
            {errors.optionsCount || errors.duplicateOptions || errors.correctSelection || (errors.points && t('testCreationCreator.errors.invalidPoints'))}
          </div>
        )}
      </div>
    </div>
  )
});

export default TestCreationMainCreator;