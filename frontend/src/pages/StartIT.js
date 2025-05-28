import React from 'react';
import CustomTitle from '../components/custom_title/CustomTitle';
import BrowserWindow from '../components/browser_window/BrowserWindow';
import BrowserWinText from '../components/browser_win_text/BrowserWinText';
import CreateTestInfo from '../components/create_test_info/CreateTestInfo';

const StartIT = () => {

    const object = {
      logo: null,
      line: true,
      strong: 'Ми допоможемо знайти якісних працівників!',
      p: null
    }
  
    return (
      <div className="page">
         <CustomTitle title='ВІТАЄМО НА HUNTEE!' data={object} /> 
          <BrowserWindow>
            <BrowserWinText company={'Huntee'} text = {'Твій старт у кар’єру починається тут!\n Ми створили цю платформу, щоб допомогти саме тобі — студенту, який шукає перший крок у професійне життя.\nУ нас ти знайдеш можливості для першої роботи та розвитку практичних навичок. Ми не просто платформа — ми твій надійний партнер на шляху до успішної кар’єри. З нами твій потенціал знайде свій шлях. \nДій зараз — майбутнє починається сьогодні.'} />
          </BrowserWindow>
          <CreateTestInfo
          title_button={'НАЙБЛИЖЧІ НАБОРИ'}
          first_step={"Створюєте обліковий запис"}
          second_step={"Обираєте напрям та місто роботи"}
          third_step={"Проходите тест в назначений час"}
          four_step={"Отримуйте запрошення на роботу!"}/>
      </div>
    )
  }
export default StartIT;