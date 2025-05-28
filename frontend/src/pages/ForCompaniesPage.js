import React from 'react';
import CustomTitle from '../components/custom_title/CustomTitle';
import BrowserWindow from '../components/browser_window/BrowserWindow';
import BrowserWinText from '../components/browser_win_text/BrowserWinText';
import CreateTestInfo from '../components/create_test_info/CreateTestInfo';

const ForCompaniesPage = () => {

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
            <BrowserWinText company={'Huntee'} text = {'Ми надзвичайно раді, що ви приєдналися до спільноти роботодавців, які допомагають студентам зробити перші кроки у професійному житті. \nНа нашій платформі ви маєте можливість не лише знаходити талановитих молодих спеціалістів, а й створювати власні тести для оцінки знань та навичок кандидатів. Це дозволить вам швидко і зручно визначити рівень підготовки студентів та знайти саме тих, хто найкраще відповідає вимогам вашої компанії.Якщо потрібна допомога зі створенням тестів чи налаштуванням процесу відбору — наша команда завжди готова підтримати вас. \nРозвиваймо ІТ-таланти разом!'} />
          </BrowserWindow>
          <CreateTestInfo 
          title_button={'СТВОРИТИ ТЕСТ'}
          first_step={"Створюєте обліковий запис"}
          second_step={"Створюєте тести"}
          third_step={"Отримуєте результати тестів"}
          four_step={"Отримуєте перелік найкращих кандидатів на певну вакансію"}/>
      </div>
    )
  }
export default ForCompaniesPage;
