import React, { useRef, useState } from 'react'
import GeneralTestInfoHeader from '../components/GeneralTestInfoHeader/GeneralTestInfoHeader'
import TestCreationMainCount from '../components/testCreationMain/TestCreationMainCount/TestCreationMainCount'
import TestCreationMainCreator from '../components/testCreationMain/TestCreationMainCreator/TestCreationMainCreator'
import TestCreationMainPreview from '../components/testCreationMain/TestCreationMainPreview/TestCreationMainPreview'

const TestCreationMainPage = () => {
  const [mode, setMode] = useState('create')
  const [questionsCount, setQuestionsCount] = useState(0)
  const [questions, setQuestions] = useState([])

  const creatorRef = useRef(null)

  const handleNextQuestion = () => {
    const q = creatorRef.current?.getCurrentQuestionAndReset()
    if (!q) return
    setQuestions(prev => {
      const updated = [...prev, q]
      setQuestionsCount(updated.length)
      return updated
    })
  }

  const handleDeleteQuestion = (index) => {
    setQuestions(prev => {
      const updated = [...prev]
      updated.splice(index, 1)
      setQuestionsCount(updated.length)
      return updated
    })
  }

  return (
    <div className='page'>
      <GeneralTestInfoHeader
        field="Data Science"
        title="JUNIOR DATA SCIENTIST"
        location="Lviv"
        date="21.03.2025"
        time="18:00"
      />

      <TestCreationMainCount questionsCount={questionsCount} />

      {mode === 'create' ? (
        <TestCreationMainCreator
          ref={creatorRef}
          onQuestionsChange={setQuestionsCount}
        />
      ) : (
        <TestCreationMainPreview
          questions={questions}
          onDeleteQuestion={handleDeleteQuestion}
        />
      )}

      <div className='testCreationMainButtons'>
        <div className='container testCreationMainButtons__container'>
          {mode === 'create' ? (
            <>
              <button
                className='testCreationMainButtons__next white-btn'
                onClick={handleNextQuestion}
              >
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
