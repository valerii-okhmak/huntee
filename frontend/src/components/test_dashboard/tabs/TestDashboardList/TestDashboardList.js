import React from 'react'
import './TestDashboardList.css'
import DashboardStudentCard from '../../DashboardStudentCard/DashboardStudentCard';
import lupa from '../../../../img/search-icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

const TestDashboardList = ({ activeTab, students, setActiveTab }) => {
    const description = activeTab === 'registered'
    ? 'Тут ви можете переглянути зареєстрвоанх судентів. \nВи можете надіслати автоматичне повідомлення всім студентам або звернутися до кожного окремо.'
    : 'Тут ви можете переглянути результати тестування студентів. \nВи можете надіслати автоматичне повідомлення всім студентам або звернутися до кожного окремо, щоб повідомити про результат чи надати зворотний зв’язок.';

    return (
        <div className='container'>
            <div className="testDashboard__description">
                <p>{description}</p>
                <div className="testDashboard__quote">
                    <p>Щоб надіслати повідомлення всім студентам, натисніть кнопку повідомлення поруч з пошуком.</p>
                    <p>Щоб зв’язатися з окремим студентом, використовуйте кнопку «Повідомлення» поруч із його результатом.</p>
                </div>
            </div>

            <div className="testDashboard__toolbar">
                <div className="search-container">
                    <img src={lupa} alt='search' className='search_icon' />
                    <input 
                    type="text" 
                    placeholder="Пошук"
                    />
                </div>
                <button className="testDashboard__message">
                    <FontAwesomeIcon icon={faEnvelope} className="header-icon" />
                </button>
                <button className="testDashboard__btn-analytics" onClick={() => setActiveTab('analytics')}>
                    Переглянути аналітику
                </button>
            </div>

            <div className="testDashboard__cards-list">
                {students.map(student => (
                    <DashboardStudentCard 
                        key={student.id} 
                        student={student} 
                        type={activeTab}
                    />
                ))}
            </div>
        </div>
    )
}

export default TestDashboardList