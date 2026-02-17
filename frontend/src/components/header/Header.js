import React, { useRef, useEffect, useState, useMemo} from "react";
import axios from 'axios';
import { getAccessToken } from '../../utils/auth';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons'; 

import "./Header.css";
import logo from "../../img/logo.png"; 
import BurgerMenu from "../burgerMenu/burgerMenu"; 

const Header = () => {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();
  const location = useLocation();
  const isAllTestsPage = location.pathname === "/alltests";

  const menuRef = useRef(null);
  const btnRef = useRef(null);

  const toggleMenu = () => {
    if (menuRef.current) {
      menuRef.current.classList.toggle("active");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        btnRef.current &&
        !btnRef.current.contains(event.target)
      ) {
        menuRef.current.classList.remove("active");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const header = document.querySelector('header');
      const set = document.querySelector('.set');
      if (window.scrollY > 0) {
        header.classList.add('scrolled');
        set?.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
        set?.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

    const fetchNotifications = async () => {
    try {
      const token = getAccessToken();
      const response = await axios.get(
        `/api/notifications`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (Array.isArray(response.data)) {
        setNotifications(response.data);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Помилка:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

const counts = useMemo(() => {
    if (!Array.isArray(notifications)) return { all: 0, unread: 0, read: 0, user: 0, system: 0 };

    return {
      all: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      read: notifications.filter(n => n.read).length,
      user: notifications.filter(n => !!n.sender).length, // Якщо є sender - це User
      system: notifications.filter(n => !n.sender).length // Якщо немає sender - це System
    };
  }, [notifications]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    // Ця функція запуститься, коли MessagesPage скаже, що все оновилось
    const handleNotificationUpdate = () => {
      fetchNotifications(); // Просто перезавантажуємо дані в хедері
    };

    // Підписуємось на подію
    window.addEventListener('notificationsUpdated', handleNotificationUpdate);

    // Прибираємо підписку, коли компонент зникає (щоб не було глюків)
    return () => {
      window.removeEventListener('notificationsUpdated', handleNotificationUpdate);
    };
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <nav className="nav">
        <ul>
          {!isAllTestsPage && (
            <li>
              <Link to="/alltests" className="headermenu">
                <div className="set">{t('header.closestSets')}</div>
              </Link>
            </li>
          )}
          <div className="header-icons">
            <li>
              <Link to="/messages" className="headermenu" aria-label={t('header.messages')}>
                <FontAwesomeIcon icon={faEnvelope} className="header-icon" />
                {counts.unread > 0 && <span className="notification-count">{counts.unread > 99 ? "99+" : counts.unread}</span>}
              </Link>
            </li>
            <li>
              <Link to="/profile" className="headermenu" aria-label={t('header.profile')}>
                <FontAwesomeIcon icon={faUser} className="header-icon" />
              </Link>
            </li>
            <li>
              <button ref={btnRef} onClick={toggleMenu} className="headermenu burger" aria-label={t('header.menu')}>
                <FontAwesomeIcon icon={faBars} className="header-icon"/>
              </button>
            </li>
          </div>
        </ul>
      </nav>
      <BurgerMenu menuRef={menuRef} toggleMenu={toggleMenu} />
    </header>
  );
};

export default Header;