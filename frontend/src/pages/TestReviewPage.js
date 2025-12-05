import React from 'react'
import GeneralTestInfoHeader from '../components/GeneralTestInfoHeader/GeneralTestInfoHeader';
import TestReviewGrading from '../components/TestReviewGrading/TestReviewGrading';
import TestReviewQuestions from '../components/TestReviewQuestions/TestReviewQuestions';
import tryTestQuestions from "../data/questions.json";

const TestReviewPage = () => {
  return (
    <div className='page'>
        <GeneralTestInfoHeader
            field={"Frontend "}
            title={"JUNIOR FRONTEND DEVELOPER"}
            name={"Петрикович Антоніна Юрівна"}
        />
        <TestReviewGrading />
        <TestReviewQuestions questionsLink={tryTestQuestions} />
    </div>
  )
}

export default TestReviewPage