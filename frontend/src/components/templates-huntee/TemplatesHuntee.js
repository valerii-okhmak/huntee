import React from 'react'
import './TemplatesHuntee.css'

const TemplatesHuntee = () => {

  return (
<div className='templates-huntee-container'>
    <p className='templates-huntee-text'>Щоб створення тестів було швидким і зручним, ми підготували <strong>4 унікальні шаблони</strong>, які допоможуть адаптувати перевірку знань під будь-які потреби. Кожен шаблон має свою концепцію та стиль, тож ви можете обрати той, що найкраще відповідає вашим цілям.</p>
    <div className='templates-huntee-step'>
        <p className='templates-huntee-digit'>1</p>
        <p className='templates-huntee-steptext'>Base Test</p>
    </div>
    <p className='templates-huntee-text'>Простий і зрозумілий формат: запитання з одним або кількома правильними варіантами відповіді, а також питання типу «так/ні». Підходить для швидкої перевірки теоретичних знань та загального рівня підготовки.</p>
    <p className='templates-huntee-text with-border'>Приклади застосування: базова технічна перевірка, знання інструментів, розуміння термінів.</p>
    <button className="templates-huntee-button">ВИКОРИСТАТИ ШАБЛОН</button>
    <div className='templates-huntee-step'>
        <p className='templates-huntee-digit'>2</p>
        <p className='templates-huntee-steptext'>Mixed Mode</p>
    </div>
    <p className='templates-huntee-text'>Комбінація різних типів завдань: тести, відкриті запитання, короткі задачі на логіку чи аналіз даних. Дає змогу комплексно оцінити кандидата за кількома критеріями.</p>
    <p className='templates-huntee-text with-border'>Приклади застосування: універсальний відбір на будь-яку технічну або креативну позицію.</p>
    <button className="templates-huntee-button">ПЕРЕГЛЯНУТИ ШАБЛОНИ</button>
        <div className='templates-huntee-step'>
        <p className='templates-huntee-digit'>3</p>
        <p className='templates-huntee-steptext'>Practical Task</p>
    </div>
    <p className='templates-huntee-text'>Тест із прикладами реальних робочих завдань: невеликі кейси, фрагменти коду, дизайн-макети або дані для аналізу. Формат максимально наближений до реальної роботи.</p>
    <p className='templates-huntee-text with-border'>Приклади застосування: моделювання робочих ситуацій для розробників, дизайнерів, тестувальників, аналітиків.</p>
    <button className="templates-huntee-button">ПЕРЕГЛЯНУТИ ШАБЛОНИ</button>
    <div className='templates-huntee-step'>
        <p className='templates-huntee-digit'>4</p>
        <p className='templates-huntee-steptext'>Scenario Test</p>
    </div>
    <p className='templates-huntee-text'>Тест у форматі реальних робочих ситуацій: кандидат отримує опис кейсу та має обрати найкраще рішення або запропонувати власне. Формат допомагає перевірити не лише знання, а й уміння застосовувати їх у контексті, знаходити оптимальні підходи та мислити критично.</p>
    <p className='templates-huntee-text with-border'>Приклади застосування: відбір розробників, дизайнерів, тестувальників, аналітиків та менеджерів, коли важливо оцінити практичне мислення та прийняття рішень.</p>
    <button className="templates-huntee-button">ПЕРЕГЛЯНУТИ ШАБЛОНИ</button>
</div>
  )
}

export default TemplatesHuntee;