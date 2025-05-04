import React from 'react';
import { Link } from 'react-router-dom';
import './burgerMenu.css';
import { getAccessToken, logout } from '../../utils/auth';

const burgerMenu = () => {
    const isAuthenticated = !!getAccessToken();
  return (

        <div className='burger-container'>
            <div className='burger-menu'>
                <div className='burger-line'></div>
                <ul className='burger-list'>
                    <li><Link to="/profile" className='link'><span className='digit'>1</span><span className='burger-text'>Мій аккаунт</span></Link></li>
                    <li><Link to="/alltests" className='link'><span className='digit'>2</span><span className='burger-text'>Активні тести</span></Link></li>
                    <li><Link to="/trialtest" className='link'><span className='digit'>3</span><span className='burger-text'>Пробні тести</span></Link></li>
                    <li>
                        {isAuthenticated ? (
                        <a href="/" className="link" onClick={logout}>
                            <span className="digit">4</span>
                            <span className="burger-text">Вийти</span>
                        </a>
                        ) : (
                        <Link to="/login" className="link">
                            <span className="digit">4</span>
                            <span className="burger-text">Увійти</span>
                        </Link>
                        )}
                    </li>
                </ul>
            </div>    
        </div>
  );
};

export default burgerMenu;
