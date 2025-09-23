import React from 'react'
import { useState } from 'react';
import './UserTypeSelector.css';

const UserTypeSelector = () => {
    const [userType, setUserType] = useState("student");

    const handleCompanyClick = () => {
        setUserType('company');
    }

    const handleStudentClick = () => {
        setUserType('student');
    }

    return (
        <div className='UserTypeSelector'>
            <button
                className={`UserTypeSelector__company${userType === 'company' ? ' selected' : ''}`}
                onClick={handleCompanyClick}
            >
                Ви представник компанії?
            </button>
            <button
                className={`UserTypeSelector__student${userType === 'student' ? ' selected' : ''}`}
                onClick={handleStudentClick}
            >
                Ви студент?
            </button>
        </div>
    )
}

export default UserTypeSelector