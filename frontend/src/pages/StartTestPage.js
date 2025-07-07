import React from 'react';
import StartTest from '../components/start_test/StartTest';
import CustomTitle from '../components/custom_title/CustomTitle';

const TestPage = () => {

  const object = {
    logo: null,
    line: false,
    strong: null,
    p: null
  }

  return (
    <div className="page">
        <CustomTitle title='Пройди пробне тестування' data={object} />
        <div className="trialMain">
            <StartTest gradienttext='Пробне тестування складається з 10 запитань з різним форматом відповідей, щоб студент міг побачити, як усе виглядає на практиці, звикнути до інтерфейсу та зменшити стрес перед основним тестом.'
                       text='Пробне тестування створене для попереднього розуміння формату екзамену. Воно не впливає на Ваш прогрес та не містить питань з реальних тестів. '
            />
        </div>
    </div>
  );
};

export default TestPage;