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

  // Варіанти (для regular/multiple)
  const [options, setOptions] = useState(["", ""]);

  const [regularCorrect, setRegularCorrect] = useState(null);      
  const [multipleCorrect, setMultipleCorrect] = useState([false, false]);

  // Open
  const [openExpectedEnabled, setOpenExpectedEnabled] = useState(true);
  const [openCommentEnabled, setOpenCommentEnabled] = useState(false);
  const [openExpectedText, setOpenExpectedText] = useState("");
  const [openCommentText, setOpenCommentText] = useState("");

  // Practical
  const [prExpectedEnabled, setPrExpectedEnabled] = useState(true);
  const [prCommentEnabled, setPrCommentEnabled] = useState(false);
  const [prExpectedText, setPrExpectedText] = useState("");
  const [prCommentText, setPrCommentText] = useState("");

  const addOption = () => {
    setOptions(prev => [...prev, ""]);
    setMultipleCorrect(prev => [...prev, false]);
  };

  const removeOption = (idx) => {
    if (idx < MIN_BASE_OPTIONS) return; 
    setOptions(prev => {
      const next = prev.slice();
      next.splice(idx, 1);
      return next;
    });
    setMultipleCorrect(prev => {
      const next = prev.slice();
      next.splice(idx, 1);
      return next;
    });
    if (regularCorrect === idx) setRegularCorrect(null);
    if (regularCorrect !== null && regularCorrect > idx) {
      setRegularCorrect(regularCorrect - 1);
    }
  };

  const updateOption = (idx, value) => {
    const next = [...options];
    next[idx] = value;
    setOptions(next);
  };

  const pickRegularCorrect = (idx) => setRegularCorrect(idx);

  const toggleMultipleCorrect = (idx) => {
    const next = [...multipleCorrect];
    next[idx] = !next[idx];
    setMultipleCorrect(next);
  };

  useImperativeHandle(ref, () => ({
    getCurrentQuestionAndReset() {
      if (!questionText.trim()) {
        alert("Введіть текст запитання");
        return null;
      }

      let payload = { type: selectedType, question: questionText.trim() };

      if (selectedType === "regular" || selectedType === "multiple") {
        // Усі варіанти мають бути заповнені
        if (options.length < MIN_BASE_OPTIONS) {
          alert(`Має бути щонайменше ${MIN_BASE_OPTIONS} варіанти`);
          return null;
        }
        const trimmed = options.map(o => o.trim());
        if (trimmed.some(o => o.length === 0)) {
          alert("Усі варіанти відповіді мають бути заповнені");
          return null;
        }

        if (selectedType === "regular") {
          if (regularCorrect === null) {
            alert("Для запитання з однією відповіддю обовʼязково позначте правильну відповідь");
            return null;
          }
          payload.options = trimmed;
          payload.correctIndex = regularCorrect;
        }

        if (selectedType === "multiple") {
          const correctIdxs = multipleCorrect
            .map((v, i) => (v ? i : -1))
            .filter(i => i !== -1);
          if (correctIdxs.length < 1) {
            alert("Для запитання з багатьма відповідями позначте щонайменше одну правильну відповідь");
            return null;
          }
          payload.options = trimmed;
          payload.correctIndices = correctIdxs; 
        }
      }

      if (selectedType === "open") {
        if (openExpectedEnabled && !openExpectedText.trim()) {
          alert("Поле «Очікувана відповідь» увімкнено — його потрібно заповнити");
          return null;
        }
        if (openCommentEnabled && !openCommentText.trim()) {
          alert("Поле «Коментар» увімкнено — його потрібно заповнити");
          return null;
        }
        payload.expectedEnabled = openExpectedEnabled;
        payload.commentEnabled = openCommentEnabled;
        payload.expected = openExpectedText.trim();
        payload.comment = openCommentText.trim();
      }

      if (selectedType === "practical") {
        if (prExpectedEnabled && !prExpectedText.trim()) {
          alert("Поле «Очікувана відповідь» увімкнено — його потрібно заповнити");
          return null;
        }
        if (prCommentEnabled && !prCommentText.trim()) {
          alert("Поле «Коментар» увімкнено — його потрібно заповнити");
          return null;
        }
        payload.expectedEnabled = prExpectedEnabled;
        payload.commentEnabled = prCommentEnabled;
        payload.expected = prExpectedText.trim();
        payload.comment = prCommentText.trim();
      }

      // Скидання форми
      setQuestionText("");
      setOptions(["", ""]);
      setRegularCorrect(null);
      setMultipleCorrect([false, false]);

      setOpenExpectedEnabled(true);
      setOpenCommentEnabled(false);
      setOpenExpectedText("");
      setOpenCommentText("");

      setPrExpectedEnabled(true);
      setPrCommentEnabled(false);
      setPrExpectedText("");
      setPrCommentText("");

      onQuestionsChange?.(prev => (typeof prev === 'number' ? prev + 1 : prev));
      return payload;
    }
  }));

  return (
    <div className='testCreationMainCreator'>
      <div className='container testCreationMainCreator__container'>
        <h2 className='testCreationMainCreator__title'>Оберіть тип запитання:</h2>

        <div className='testCreationMainCreator__typeSelector'>
          <button className={`testCreationMainCreator__selectedType ${selectedType === "regular" ? "active" : ""}`} onClick={() => setSelectedType("regular")}>
            <img alt='img' className='testCreationMainCreator_icon' src={regular_icon} />
            З однією відповіддю
          </button>
          <button className={`testCreationMainCreator__selectedType ${selectedType === "multiple" ? "active" : ""}`} onClick={() => setSelectedType("multiple")}>
            <img alt='img' className='testCreationMainCreator_icon' src={multiple_icon} />
            Множинний вибір
          </button>
          <button className={`testCreationMainCreator__selectedType ${selectedType === "open" ? "active" : ""}`} onClick={() => setSelectedType("open")}>
            <img alt='img' className='testCreationMainCreator_icon' src={open_icon} />
            Відкрита відповідь
          </button>
          <button className={`testCreationMainCreator__selectedType ${selectedType === "practical" ? "active" : ""}`} onClick={() => setSelectedType("practical")}>
            <img alt='img' className='testCreationMainCreator_icon' src={practical_icon} />
            Практичний тест
          </button>
        </div>

        <div className="testCreationMainCreator__questionField">
          <div className="testCreationMainCreator__questionField-header">
            <h2 className="testCreationMainCreator__questionField-title">Запитання</h2>
            <label className="testCreationMainCreator__addToJar">
              <input
                type="checkbox"
                checked={addToBank}
                onChange={(e) => setAddToBank(e.target.checked)}
              />
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

          // options
          options={options}
          updateOption={updateOption}
          addOption={addOption}
          removeOption={removeOption}
          minBase={MIN_BASE_OPTIONS}

          // regular
          regularCorrect={regularCorrect}
          pickRegularCorrect={pickRegularCorrect}

          // multiple
          multipleCorrect={multipleCorrect}
          toggleMultipleCorrect={toggleMultipleCorrect}

          // open
          openExpectedEnabled={openExpectedEnabled}
          setOpenExpectedEnabled={setOpenExpectedEnabled}
          openCommentEnabled={openCommentEnabled}
          setOpenCommentEnabled={setOpenCommentEnabled}
          openExpectedText={openExpectedText}
          setOpenExpectedText={setOpenExpectedText}
          openCommentText={openCommentText}
          setOpenCommentText={setOpenCommentText}

          // practical
          prExpectedEnabled={prExpectedEnabled}
          setPrExpectedEnabled={setPrExpectedEnabled}
          prCommentEnabled={prCommentEnabled}
          setPrCommentEnabled={setPrCommentEnabled}
          prExpectedText={prExpectedText}
          setPrExpectedText={setPrExpectedText}
          prCommentText={prCommentText}
          setPrCommentText={setPrCommentText}
        />
      </div>
    </div>
  )
})

export default TestCreationMainCreator
