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

  const [filterReadStatus, setFilterReadStatus] = useState('all');
  const [filterSenderType, setFilterSenderType] = useState('all');

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

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifications = useMemo(() => {
    if (!Array.isArray(notifications)) return [];

    return notifications.filter(notif => {
      let matchesReadStatus = true;
      if (filterReadStatus === 'unread') matchesReadStatus = !notif.read;
      if (filterReadStatus === 'read') matchesReadStatus = notif.read;

      let matchesSenderType = true;
      if (filterSenderType === 'system') matchesSenderType = (!notif.sender);
      if (filterSenderType === 'user') matchesSenderType = (!!notif.sender);

      return matchesReadStatus && matchesSenderType;
    });
  }, [notifications, filterReadStatus, filterSenderType]);

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
    } catch (error) {
      console.error("Помилка:", error);
    }
  };

  return (
    <div className="page">
      <div className='container'>
        <MessageTitle />
        
        <div style={{ display: 'flex', gap: '30px', marginTop: '30px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <MessageType 
            activeRead={filterReadStatus}
            setActiveRead={setFilterReadStatus}
            activeType={filterSenderType}
            setActiveType={setFilterSenderType}
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