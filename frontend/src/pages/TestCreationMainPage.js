import React, { useState } from 'react'
import GeneralTestInfoHeader from '../components/GeneralTestInfoHeader/GeneralTestInfoHeader'
import TestCreationMainCount from '../components/testCreationMain/TestCreationMainCount/TestCreationMainCount'
import TestCreationMainCreator from '../components/testCreationMain/TestCreationMainCreator/TestCreationMainCreator'
import TestCreationMainPreview from '../components/testCreationMain/TestCreationMainPreview/TestCreationMainPreview'

const TestCreationMainPage = () => {
    const [mode, setMode] = useState("create");
    const [questionsCount, setQuestionsCount] = useState(0)

    return (
      <div className='page'>
        <GeneralTestInfoHeader field="Data Science" title="JUNIOR DATA SCIENTIST" location="Lviv" date="21.03.2025" time="18:00" />
        <TestCreationMainCount questionsCount={questionsCount} />
        {mode === 'create' ? (
          <TestCreationMainCreator onQuestionsChange={setQuestionsCount} />
        ) : (
          <TestCreationMainPreview />
        )}

        <div className='testCreationMainButtons'>
          <div className='container testCreationMainButtons__container'>
            {mode === 'create' ? (
              <>
                <button className='testCreationMainButtons__next white-btn'>
                  Наступне запитання
                </button>
                <button
                  className='testCreationMainButtons__finish black-btn'
                  onClick={() => setMode('preview')}
                >
                  Переглянути результат
                </button>
              </>
            ) : (
              <>
                <button
                  className='testCreationMainButtons__back white-btn'
                  onClick={() => setMode('create')}
                >
                  Повернутися до створення
                </button>
                <button className='testCreationMainButtons__publish black-btn'>
                  Завершити створення
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
}

export default TestCreationMainPage