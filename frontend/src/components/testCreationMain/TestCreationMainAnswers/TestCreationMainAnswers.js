import React from "react";
import './TestCreationMainAnswers.css'
import addImage_icon from '../../../img/testCreation/addImage.png'

const TestCreationMainAnswers = ({
  selectedType,

  // options
  options,
  updateOption,
  addOption,
  removeOption,
  minBase,

  // regular
  regularCorrect,
  pickRegularCorrect,

  // multiple
  multipleCorrect,
  toggleMultipleCorrect,

  // open
  openExpectedEnabled,
  setOpenExpectedEnabled,
  openCommentEnabled,
  setOpenCommentEnabled,
  openExpectedText,
  setOpenExpectedText,
  openCommentText,
  setOpenCommentText,

  // practical
  prExpectedEnabled,
  setPrExpectedEnabled,
  prCommentEnabled,
  setPrCommentEnabled,
  prExpectedText,
  setPrExpectedText,
  prCommentText,
  setPrCommentText,
}) => {

  const renderChoiceRow = (i, control) => (
    <div key={i} className="testCreationMainCreatorAnswers__option">
      <label className='testCreationMainCreatorAnswers__75p'>
        {control}
        <input
          type="text"
          placeholder="Введіть варіант відповіді"
          className="testCreationMainCreatorAnswers__input"
          value={options[i]}
          onChange={e => updateOption(i, e.target.value)}
        />
      </label>

      <div className="testCreationMainCreatorAnswers__btns">
        <button className="testCreationMainCreatorAnswers__btn" title="Додати зображення">
          <img alt='add image' src={addImage_icon} />
        </button>
        {i >= minBase && (
          <button
            type="button"
            className="testCreationMainCreatorAnswers__btn testCreationMainCreatorAnswers__btn--remove"
            title="Видалити варіант"
            onClick={() => removeOption(i)}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );

  switch (selectedType) {
    case "regular":
      return (
        <div className="testCreationMainCreatorAnswers">
          <h3 className='testCreationMainCreatorAnswers__title'>Відповідь (позначте одну правильну)</h3>

          {options.map((_, i) =>
            renderChoiceRow(i, (
              <>
                <input
                  type="radio"
                  name="regularQuestionRadio"
                  className='testCreationMainCreatorAnswers__none'
                  checked={regularCorrect === i}
                  onChange={() => pickRegularCorrect(i)}
                />
                <span className='testCreationMainCreatorAnswers__radio-circle'></span>
              </>
            ))
          )}

          <button className="testCreationMainCreatorAnswers__add" onClick={addOption}>
            Додати варіант відповіді <span>+</span>
          </button>
        </div>
      );

    case "multiple":
      return (
        <div className="testCreationMainCreatorAnswers">
          <h3 className='testCreationMainCreatorAnswers__title'>Відповідь (позначте мінімум одну правильну)</h3>

          {options.map((_, i) =>
            renderChoiceRow(i, (
              <>
                <input
                  type="checkbox"
                  name="multipleQuestionCheckbox"
                  className='testCreationMainCreatorAnswers__none'
                  checked={!!multipleCorrect[i]}
                  onChange={() => toggleMultipleCorrect(i)}
                />
                <span className='testCreationMainCreatorAnswers__radio-square'></span>
              </>
            ))
          )}

          <button className="testCreationMainCreatorAnswers__add" onClick={addOption}>
            Додати варіант відповіді <span>+</span>
          </button>
        </div>
      );

    case "open":
      return (
        <div className="testCreationMainCreatorAnswers testCreationMainCreatorAnswers-open">
          <h3 className='testCreationMainCreatorAnswers__title'>Відповідь</h3>

          <label className='testCreationMainCreatorAnswers__text'>
            <input
              className='testCreationMainCreatorAnswers__none'
              type="checkbox"
              checked={openExpectedEnabled}
              onChange={(e) => setOpenExpectedEnabled(e.target.checked)}
            />
            <span className='testCreationMainCreatorAnswers__radio-circle'></span>
            Очікувана відповідь
          </label>
          <input
            type="text"
            placeholder="Введіть відповідь"
            className="testCreationMainCreatorAnswers__input-open"
            disabled={!openExpectedEnabled}
            value={openExpectedText}
            onChange={e => setOpenExpectedText(e.target.value)}
          />

          <label className='testCreationMainCreatorAnswers__text'>
            <input
              className='testCreationMainCreatorAnswers__none'
              type="checkbox"
              checked={openCommentEnabled}
              onChange={(e) => setOpenCommentEnabled(e.target.checked)}
            />
            <span className='testCreationMainCreatorAnswers__radio-circle'></span>
            Коментар
          </label>
          <input
            type="text"
            placeholder="Введіть коментар"
            className="testCreationMainCreatorAnswers__input-open"
            disabled={!openCommentEnabled}
            value={openCommentText}
            onChange={e => setOpenCommentText(e.target.value)}
          />
        </div>
      );

    case "practical":
      return (
        <div className="testCreationMainCreatorAnswers testCreationMainCreatorAnswers-open">
          <h3 className='testCreationMainCreatorAnswers__title'>Відповідь</h3>

          <label className='testCreationMainCreatorAnswers__text'>
            <input
              className='testCreationMainCreatorAnswers__none'
              type="checkbox"
              checked={prExpectedEnabled}
              onChange={(e) => setPrExpectedEnabled(e.target.checked)}
            />
            <span className='testCreationMainCreatorAnswers__radio-circle'></span>
            Очікувана відповідь
          </label>
          <input
            type="text"
            placeholder="Введіть відповідь"
            className="testCreationMainCreatorAnswers__input-open"
            disabled={!prExpectedEnabled}
            value={prExpectedText}
            onChange={e => setPrExpectedText(e.target.value)}
          />

          <label className='testCreationMainCreatorAnswers__text'>
            <input
              className='testCreationMainCreatorAnswers__none'
              type="checkbox"
              checked={prCommentEnabled}
              onChange={(e) => setPrCommentEnabled(e.target.checked)}
            />
            <span className='testCreationMainCreatorAnswers__radio-circle'></span>
            Коментар
          </label>
          <input
            type="text"
            placeholder="Введіть коментар"
            className="testCreationMainCreatorAnswers__input-open"
            disabled={!prCommentEnabled}
            value={prCommentText}
            onChange={e => setPrCommentText(e.target.value)}
          />
        </div>
      );

    default:
      return null;
  }
}

export default TestCreationMainAnswers
