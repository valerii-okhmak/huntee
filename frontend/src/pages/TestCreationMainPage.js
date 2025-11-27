import React, { useRef, useState } from 'react'
import axios from 'axios'
import GeneralTestInfoHeader from '../components/GeneralTestInfoHeader/GeneralTestInfoHeader'
import TestCreationMainCount from '../components/testCreationMain/TestCreationMainCount/TestCreationMainCount'
import TestCreationMainCreator from '../components/testCreationMain/TestCreationMainCreator/TestCreationMainCreator'
import TestCreationMainPreview from '../components/testCreationMain/TestCreationMainPreview/TestCreationMainPreview'
import { getAccessToken} from '../utils/auth'

const TestCreationMainPage = () => {
  const [mode, setMode] = useState('create')
  const [questionsCount, setQuestionsCount] = useState(0)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)

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

  // Маппінг фронтового питання → QuestionCreateRequest для бекенду
  const mapQuestionToCreateRequest = (q) => {
    switch (q.type) {
      case 'regular': {
        // одна правильна відповідь → SINGLE_CHOICE
        return {
          questionText: q.question,
          questionType: 'SINGLE_CHOICE',
          choiceOptions: (q.options || []).map((opt, i) => ({
            optionText: opt,
            correct: q.correctIndex === i,
          })),
        }
      }
      case 'multiple': {
        // декілька правильних → MULTIPLE_CHOICE
        const correctSet = new Set(q.correctIndices || [])
        return {
          questionText: q.question,
          questionType: 'MULTIPLE_CHOICE',
          choiceOptions: (q.options || []).map((opt, i) => ({
            optionText: opt,
            correct: correctSet.has(i),
          })),
        }
      }
      case 'open':
      case 'practical': {
        // текстова відповідь → TEXT
        // бекенд вимагає textAnswer != null
        return {
          questionText: q.question,
          questionType: 'TEXT',
          textAnswer: {
            correctText: q.expectedEnabled ? (q.expected || '') : '',
            caseSensitive: false,
          },
        }
      }
      default:
        throw new Error(`Unsupported question type: ${q.type}`)
    }
  }

  const handlePublish = async () => {
    if (!questions.length) {
      alert("Немає питань для збереження!")
      return
    }

    try {
      setLoading(true)

      const token = getAccessToken();

      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }

      // 1) Створюємо тест (TestCreateRequest)
      const testPayload = {
        testName: "JUNIOR DATA SCIENTIST",  // назва тесту
        sphere: "Data Science",
        level: "JUNIOR",
        city: "Lviv",
        vacancyDescription: "",   // можеш підставити реальні значення з окремої форми
        responsibilities: "",
        fixedTime: false,         // якщо буде фіксований час — став true і передавай startTime/endTime
        startTime: null,          // формат ISO, напр. "2025-03-21T18:00:00"
        endTime: null,
        durationMinutes: 60       // тривалість, якщо fixedTime === false
      }

      const testResponse = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/tests`,
        testPayload,
        { headers }
      )

      const createdTest = testResponse.data
      const testId = createdTest?.testId

      if (!testId) {
        throw new Error('Сервер не повернув testId при створенні тесту')
      }

      // 2) Додаємо всі питання до цього тесту
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i]
        const questionPayload = mapQuestionToCreateRequest(q)

        await axios.post(
          `${process.env.REACT_APP_BACKEND}/api/tests/${testId}/questions`,
          questionPayload,
          { headers }
        )
      }

      console.log('Тест і питання успішно збережені, testId =', testId)
      alert('✅ Тест і питання успішно збережені!')

      setQuestions([])
      setQuestionsCount(0)
      setMode("create")
    } catch (error) {
      console.error("Помилка при збереженні тесту:", error)
      alert(`❌ Помилка при збереженні тесту: ${error?.response?.data || error.message}`)
    } finally {
      setLoading(false)
    }
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
                disabled={loading}
              >
                Повернутися до створення
              </button>
              <button
                className='testCreationMainButtons__publish black-btn'
                onClick={handlePublish}
                disabled={loading}
              >
                {loading ? "Збереження..." : "Завершити створення"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TestCreationMainPage
