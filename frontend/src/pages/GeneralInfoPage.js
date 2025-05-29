import React from 'react';
import CustomTitle from '../components/custom_title/CustomTitle';
import BrowserWindow from '../components/browser_window/BrowserWindow';
import BrowserWinText from '../components/browser_win_text/BrowserWinText';
import GeneralInfo from '../components/general_info/GeneralInfo';

const GeneralInfoPage = () => {

    const object = {
      logo: null,
      line: true,
      strong: 'Для чого ми працюємо?',
      p: null
    }
  
    return (
      <div className="page">
         <CustomTitle title='ВІТАЄМО НА HUNTEE!' data={object} /> 
          <BrowserWindow>
            <BrowserWinText company={'Huntee'} text = {"Huntee — це сучасна веб-платформа для онлайн тестування кандидатів із вбудованими інструментами контролю доброчесності. \nМи створили її, щоб об'єднати потреби IT-компаній у швидкому та якісному первинному відборі фахівців із можливістю студентів та молодих спеціалістів показати свої навички на практиці. \nHuntee дає компаніям змогу автоматизувати процес відбору, а кандидатам — реальний шанс отримати запрошення на співбесіду та роботу. \nПрозоро. Об'єктивно. Без зайвих етапів."} />
          </BrowserWindow>
          <GeneralInfo
          first_step={"Компанія створює тести та запрошує кандидатів."}
          second_step={"Кандидат проходить тестування онлайн з контролем доброчесності."}
          third_step={"Компанія отримує результати та обирає тих, хто отримає запрошення на наступний етап — співбесіду або відразу на роботу."}
          title_button1={"НАЙБЛИЖЧІ НАБОРИ"}
          title_button2={"СТВОРИТИ ТЕСТ"}
          />
      </div>
    )
  }
export default GeneralInfoPage;