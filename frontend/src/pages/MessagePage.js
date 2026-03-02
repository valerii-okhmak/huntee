import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { getAccessToken } from '../utils/auth';
import MessageTitle from '../components/message/messageTitle/MessageTitle';
import MessageType from '../components/message/messageType/MessageType';
import MessageList from '../components/message/messageList/MessageList';
import Loader from '../components/loader/Loader';

const MessagesPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Стан фільтрів
  const [filterReadStatus, setFilterReadStatus] = useState('all');
  const [filterSenderType, setFilterSenderType] = useState('all');
  
  // Стан пошуку
  const [searchQuery, setSearchQuery] = useState('');

  // Завантаження повідомлень
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
      console.error("Помилка завантаження повідомлень:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Логіка підрахунку цифр для фільтрів
  const counts = useMemo(() => {
    if (!Array.isArray(notifications)) return {};

    const filteredByType = notifications.filter(n => {
      const matchesSearch = searchQuery === '' || 
        (n.title && n.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (n.message && n.message.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (n.sender?.name && n.sender.name.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (filterSenderType === 'user') return !!n.sender;
      if (filterSenderType === 'system') return !n.sender;
      return true; 
    });

    const filteredByRead = notifications.filter(n => {
      const matchesSearch = searchQuery === '' || 
        (n.title && n.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (n.message && n.message.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (n.sender?.name && n.sender.name.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (filterReadStatus === 'unread') return !n.read;
      if (filterReadStatus === 'read') return n.read;
      return true; 
    });

    return {
      read_all: filteredByType.length,
      read_unread: filteredByType.filter(n => !n.read).length,
      read_read: filteredByType.filter(n => n.read).length,
      type_all: filteredByRead.length,
      type_user: filteredByRead.filter(n => !!n.sender).length,
      type_system: filteredByRead.filter(n => !n.sender).length
    };
  }, [notifications, filterReadStatus, filterSenderType, searchQuery]);

  // Головна фільтрація списку
  const filteredNotifications = useMemo(() => {
    if (!Array.isArray(notifications)) return [];

    return notifications.filter(notif => {
      let matchesReadStatus = true;
      if (filterReadStatus === 'unread') matchesReadStatus = !notif.read;
      if (filterReadStatus === 'read') matchesReadStatus = notif.read;

      let matchesSenderType = true;
      if (filterSenderType === 'system') matchesSenderType = (!notif.sender);
      if (filterSenderType === 'user') matchesSenderType = (!!notif.sender);

      let matchesSearch = true;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        matchesSearch = 
          (notif.title && notif.title.toLowerCase().includes(query)) ||
          (notif.message && notif.message.toLowerCase().includes(query)) ||
          (notif.sender?.name && notif.sender.name.toLowerCase().includes(query));
      }

      return matchesReadStatus && matchesSenderType && matchesSearch;
    });
  }, [notifications, filterReadStatus, filterSenderType, searchQuery]);

  // Функція: Прочитати ВСІ
  const markAllAsRead = async () => {
    const unreadMessages = notifications.filter(n => !n.read);
    if (unreadMessages.length === 0) return;

    // 1. Оптимістичне оновлення UI сторінки
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    
    // 2. Оптимістичне оновлення Хедера (відправляємо спец. сигнал)
    window.dispatchEvent(new CustomEvent('notificationsUpdated', { 
        detail: { type: 'readAll' } 
    }));

    try {
      const token = getAccessToken();
      // 3. Паралельні запити на сервер
      await Promise.all(unreadMessages.map(msg => 
        axios.put(
          `/api/notifications/${msg.id}/read`,
          {},
          { headers: { 'Authorization': `Bearer ${token}` } }
        )
      ));
    } catch (error) {
      console.error("Помилка при масовому оновленні:", error);
      fetchNotifications(); // Відкат при помилці
    }
  };

  // Функція: Прочитати ОДНЕ
  const markAsRead = async (id) => {
    try {
      const token = getAccessToken();
      await axios.put(
        `/api/notifications/${id}/read`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));

      // Звичайне оновлення хедера
      window.dispatchEvent(new Event('notificationsUpdated'));
      
    } catch (error) {
      console.error("Помилка при позначенні прочитаним:", error);
    }
  };

  return (
    <div className="page messages-page">
      <div className='container'>
        <MessageTitle 
           searchQuery={searchQuery}
           setSearchQuery={setSearchQuery}
           onMarkAllRead={markAllAsRead}
        />
        
        <div className='message-page-block'>
          <MessageType 
            activeRead={filterReadStatus}
            setActiveRead={setFilterReadStatus}
            activeType={filterSenderType}
            setActiveType={setFilterSenderType}
            counts={counts}
          />

          {loading ? (
            <Loader />
          ) : (
            <MessageList 
              messages={filteredNotifications} 
              onMarkAsRead={markAsRead}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;