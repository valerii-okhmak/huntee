import React from 'react'
import './TestCreation.css'
import { Link } from 'react-router-dom';

const TestCreation = () => {

  return (
      <div className='test-creation-container'>
          <p className='test-creation-text'>На платформі передбачено два підходи до створення тестів залежно від ваших цілей та потреб. <strong>Перший — індивідуальне створення</strong>, яке дозволяє самостійно обрати запитання з бази або додати власні, налаштувати структуру тесту, рівень складності та формат подачі. <strong>Другий — використання готових тестів</strong>, розроблених фахівцями з урахуванням актуальних вимог до різних напрямів та компетенцій. Обидва варіанти забезпечують гнучкість і точність у процесі оцінювання.</p>
          <div className='test-creation-step'>
              <p className='test-creation-digit'>1</p>
              <p className='test-creation-steptext'>Створення сайту самостійно</p>
          </div>
          <p className='test-creation-text'>Цей варіант підходить для компаній, які хочуть максимально адаптувати зміст тестування до власних вимог. Ви самостійно формуєте тест, обираючи запитання з доступної бази або створюючи власні. Є можливість налаштувати структуру тесту, розподіл за темами, формат відповідей (відкриті, закриті, ситуаційні), рівень складності, обмеження за часом, кількість спроб тощо. Такий підхід дозволяє врахувати особливості конкретної позиції, корпоративні цінності або специфіку професійного напряму.</p>
          <Link to="start" className="test-creation-button">СТВОРИТИ ВЛАСНИЙ ТЕСТ</Link>
          <div className='test-creation-step'>
              <p className='test-creation-digit'>2</p>
              <p className='test-creation-steptext'>Обрати готовий тест</p>
          </div>
          <p className='test-creation-text'>Це оптимальний варіант для швидкого старту тестування без потреби самостійного наповнення. На платформі доступна колекція професійно підготовлених тестів, які охоплюють різні напрями ІТ: Front-End, Back-End, UI/UX Design, Data Science, QA, Game Development, Project Management, DevOps та інші. Кожен тест структуровано відповідно до сучасних підходів у HR, психології та освіті, з урахуванням аналітики результатів. Ви просто обираєте потрібний тест, а далі надсилаєте його кандидатам або студентам.</p>
          <button className="test-creation-button">ПЕРЕГЛЯНУТИ ШАБЛОНИ</button>
          <div className='test-creation-gradient'>
              <p className='test-creation-gradient-title'>МАЄТЕ<br/>ЗАПИТАННЯ?</p>
              <button className="test-creation-button test-creation-gradient-button">ЗВ’ЯЗАТИСЯ З НАМИ</button>
          </div>
          <div className='forspace'></div>
      </div>
  )
}

export default TestCreation;