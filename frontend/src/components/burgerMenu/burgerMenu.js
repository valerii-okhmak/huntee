import React from 'react';
import { Link } from 'react-router-dom';
import './burgerMenu.css';
import { getAccessToken, logout } from '../../utils/auth';

const burgerMenu = ({menuBtn}) => {
    const isAuthenticated = !!getAccessToken();
  return (

        <div className='burger-container'>
            <div className='burger-menu'>
                <div className='burger-line'></div>
                <ul className='burger-list'>
                    <li><Link to="/profile" onClick={menuBtn} className='link'><span className='digit'>1</span><span className='burger-text'>Що це за платформа?</span></Link></li>
                    
                    <li className="burger-section delay-1">для студентів</li>

                    <li><Link to="/profile" onClick={menuBtn} className='link'><span className='digit'>2</span><span className='burger-text'>Мій аккаунт</span></Link></li>
                    <li><Link to="/alltests" onClick={menuBtn} className='link'><span className='digit'>3</span><span className='burger-text'>Активні тести</span></Link></li>
                    <li><Link to="/trialtest" onClick={menuBtn} className='link'><span className='digit'>4</span><span className='burger-text'>Пробні тести</span></Link></li>
                    <li><Link to="/trialtest" onClick={menuBtn} className='link'><span className='digit'>5</span><span className='burger-text'>Soft Skills test</span></Link></li>
                    <li><Link to="/trialtest" onClick={menuBtn} className='link'><span className='digit'>6</span><span className='burger-text'>Як обрати напрям IT?</span></Link></li>
                    
                    <li className="burger-section delay-2">для компаній</li>

                    <li><Link to="/trialtest" onClick={menuBtn} className='link'><span className='digit'>7</span><span className='burger-text'>Головна сторінка компаній</span></Link></li>
                    <li><Link to="/trialtest" onClick={menuBtn} className='link'><span className='digit'>8</span><span className='burger-text'>Аккаунт</span></Link></li>
                    <li><Link to="/trialtest" onClick={menuBtn} className='link'><span className='digit'>9</span><span className='burger-text'>Як створити тест?</span></Link></li>
                    <li><Link to="/trialtest" onClick={menuBtn} className='link'><span className='digit'>10</span><span className='burger-text'>Процес оцінювання та результати</span></Link></li>
                    
                </ul>
            </div>    
        </div>
  );
};

export default burgerMenu;
