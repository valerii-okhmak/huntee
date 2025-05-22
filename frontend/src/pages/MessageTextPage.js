import React from 'react'
import CustomTitle from '../components/custom_title/CustomTitle';
import softserve from '../img/softserve.png'
import BrowserWindow from '../components/browser_window/BrowserWindow';
import BrowserWinText from '../components/browser_win_text/BrowserWinText';

const MessageTextPage = () => {

  const object = {
    logo: softserve,
    line: false,
    strong: null,
    p: null
  }

  return (
    <div className="page">
        <CustomTitle title='JUNIOR DATA SCIENTIST' data={object} />
        <BrowserWindow>
          <BrowserWinText company={'SoftServe'} text = {'Ми раді повідомити, що за результатами виконаного тестового завдання та загального оцінювання вашого підходу,  ми прийняли рішення запросити вас приєднатися до нашої команди. Ваш рівень професіоналізму, увага до деталей і вміння аналітично мислити справили на нас позитивне враження. Ми впевнені, що ваші навички та підхід до роботи чудово доповнять нашу команду та допоможуть у реалізації спільних проєктів.\n Очікуємо Вас о 9:00, 13.04.2025 за адресою вул.Садова 2Д.\nВітаємо вас з успішним проходженням відбору — попереду цікаві виклики та можливості для професійного зростання!'} />
        </BrowserWindow>
    </div>
  )
}

export default MessageTextPage