import React, { useState, forwardRef, useImperativeHandle } from "react";
import './TestCreationMainCreator.css'
import regular_icon from '../../../img/testCreation/regular.png'
import multiple_icon from '../../../img/testCreation/multiple.png'
import open_icon from '../../../img/testCreation/open.png'
import practical_icon from '../../../img/testCreation/practical.png'
import addImage_icon from '../../../img/testCreation/addImage.png'
import TestCreationMainAnswers from "../TestCreationMainAnswers/TestCreationMainAnswers";

const MIN_BASE_OPTIONS = 2;

const TestCreationMainCreator = forwardRef(({ onQuestionsChange }, ref) => {
  const [selectedType, setSelectedType] = useState("regular");
  const [questionText, setQuestionText] = useState("");
  const [addToBank, setAddToBank] = useState(false);
  const [comment, setComment] = useState("");

  const [options, setOptions] = useState(["", ""]);
  const [regularCorrect, setRegularCorrect] = useState(null);
  const [multipleCorrect, setMultipleCorrect] = useState([false, false]);

  const [openExpectedEnabled, setOpenExpectedEnabled] = useState(true);
  const [openExpectedText, setOpenExpectedText] = useState("");

  const [codeLanguage, setCodeLanguage] = useState("java");
  const [codeMethodName, setCodeMethodName] = useState("");
  const [codeTemplate, setCodeTemplate] = useState("");
  const [codeTestCasesJSON, setCodeTestCasesJSON] = useState('[{"args": [1, 2], "expected": 3}]');

  const addOption = () => {
    setOptions(prev => [...prev, ""]);
    setMultipleCorrect(prev => [...prev, false]);
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
  };

  const pickRegularCorrect = (idx) => setRegularCorrect(idx);

  const toggleMultipleCorrect = (idx) => {
    setMultipleCorrect(prev => prev.map((val, i) => (i === idx ? !val : val)));
  };

  useImperativeHandle(ref, () => ({
    getCurrentQuestionAndReset() {
      if (!questionText.trim()) {
        alert("Введіть текст запитання");
        return null;
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
          questionType: backendType 
      };

      if (selectedType === "regular" || selectedType === "multiple") {
        if (options.length < MIN_BASE_OPTIONS) {
          alert(`Має бути щонайменше ${MIN_BASE_OPTIONS} варіанти`);
          return null;
        }
        if (options.some(o => !o.trim())) {
          alert("Усі варіанти відповіді мають бути заповнені");
          return null;
        }

        if (selectedType === "regular") {
          if (regularCorrect === null) {
            alert("Позначте правильну відповідь");
            return null;
          }
          payload.choiceOptions = options.map((text, index) => ({
              optionText: text.trim(),
              isCorrect: index === regularCorrect
          }));
        } else {
          if (!multipleCorrect.some(v => v)) {
            alert("Позначте щонайменше одну правильну відповідь");
            return null;
          }
          payload.choiceOptions = options.map((text, index) => ({
              optionText: text.trim(),
              isCorrect: multipleCorrect[index]
          }));
        }
      }

      if (selectedType === "open") {
        if (openExpectedEnabled && !openExpectedText.trim()) {
          alert("Введіть очікувану відповідь");
          return null;
        }
        payload.textAnswer = {
            correctText: openExpectedText.trim(),
            isCaseSensitive: false
        };
      }

      if (selectedType === "practical") {
         if (!codeMethodName.trim() || !codeTemplate.trim()) {
             alert("Заповніть назву методу та шаблон коду");
             return null;
         }
         try {
             JSON.parse(codeTestCasesJSON);
         } catch (e) {
             alert("Невірний формат JSON для тест-кейсів");
             return null;
         }
         payload.codeAnswer = {
             language: codeLanguage,
             methodName: codeMethodName.trim(),
             templateCode: codeTemplate,
             testCases: codeTestCasesJSON
         };
      }

      setQuestionText("");
      setComment("");
      setOptions(["", ""]);
      setRegularCorrect(null);
      setMultipleCorrect([false, false]);
      setOpenExpectedText("");
      
      setCodeLanguage("java");
      setCodeMethodName("");
      setCodeTemplate("");
      setCodeTestCasesJSON('[{"args": [1, 2], "expected": 3}]');

      onQuestionsChange?.(prev => (typeof prev === 'number' ? prev + 1 : prev));
      
      console.log("Generated Payload:", payload); 
      return payload;
    }
  }));

  return (
    <div className='testCreationMainCreator'>
      <div className='container testCreationMainCreator__container'>
        <h2 className='testCreationMainCreator__title'>Оберіть тип запитання:</h2>

        <div className='testCreationMainCreator__typeSelector'>
          <button className={`testCreationMainCreator__selectedType ${selectedType === "regular" ? "active" : ""}`} onClick={() => setSelectedType("regular")}>
            <img alt='img' className='testCreationMainCreator_icon' src={regular_icon} /> З однією відповіддю
          </button>
          <button className={`testCreationMainCreator__selectedType ${selectedType === "multiple" ? "active" : ""}`} onClick={() => setSelectedType("multiple")}>
            <img alt='img' className='testCreationMainCreator_icon' src={multiple_icon} /> Множинний вибір
          </button>
          <button className={`testCreationMainCreator__selectedType ${selectedType === "open" ? "active" : ""}`} onClick={() => setSelectedType("open")}>
            <img alt='img' className='testCreationMainCreator_icon' src={open_icon} /> Відкрита відповідь
          </button>
          <button className={`testCreationMainCreator__selectedType ${selectedType === "practical" ? "active" : ""}`} onClick={() => setSelectedType("practical")}>
            <img alt='img' className='testCreationMainCreator_icon' src={practical_icon} /> Практичний тест
          </button>
        </div>

        <div className="testCreationMainCreator__questionField">
          <div className="testCreationMainCreator__questionField-header">
            <h2 className="testCreationMainCreator__questionField-title">Запитання</h2>
            <label className="testCreationMainCreator__addToJar">
              <input type="checkbox" checked={addToBank} onChange={(e) => setAddToBank(e.target.checked)} />
              <span className="testCreationMainCreator__addToJar_radio-circle"></span>
              <span>Додати запитання до банки запитань</span>
            </label>
          </div>
          <div className="testCreationMainCreator__questionField-wrapper">
            <input
              type="text"
              placeholder="Введіть запитання"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="testCreationMainCreator__questionField-input"
            />
            <button className="testCreationMainCreator__questionField-btn" title="Додати зображення">
              <img alt='add image' src={addImage_icon} />
            </button>
          </div>
        </div>

        <TestCreationMainAnswers
          selectedType={selectedType}
          comment={comment}
          setComment={setComment}

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
          setOpenExpectedText={setOpenExpectedText}

          codeLanguage={codeLanguage}
          setCodeLanguage={setCodeLanguage}
          codeMethodName={codeMethodName}
          setCodeMethodName={setCodeMethodName}
          codeTemplate={codeTemplate}
          setCodeTemplate={setCodeTemplate}
          codeTestCasesJSON={codeTestCasesJSON}
          setCodeTestCasesJSON={setCodeTestCasesJSON}
        />
      </div>
    </div>
  )
});

export default TestCreationMainCreator;