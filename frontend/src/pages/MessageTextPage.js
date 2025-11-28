import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getAccessToken } from '../utils/auth';

import CustomTitle from '../components/custom_title/CustomTitle';
import BrowserWindow from '../components/browser_window/BrowserWindow';
import BrowserWinText from '../components/browser_win_text/BrowserWinText';
import defaultLogo from '../img/softserve.png';

const MessageTextPage = () => {
  const { id } = useParams();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const token = getAccessToken();
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND}/api/notifications`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        const foundMessage = response.data.find(msg => msg.id === Number(id));
        
        if (foundMessage) {
          setMessage(foundMessage);
          if (!foundMessage.isRead) {
             await axios.put(
                `${process.env.REACT_APP_BACKEND}/api/notifications/${id}/read`,
                {},
                { headers: { 'Authorization': `Bearer ${token}` } }
             );
          }
        } else {
          setError("Повідомлення не знайдено");
        }

      } catch (err) {
        console.error("Помилка:", err);
        setError("Не вдалося завантажити повідомлення");
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [id]);

  if (loading) return <div className="page"><div className='container'>Завантаження...</div></div>;
  if (error || !message) return <div className="page"><div className='container'>{error || "Помилка"}</div></div>;


  const logoSrc = message.sender?.avatarUrl 
    ? `${process.env.REACT_APP_BACKEND}/api/profile/avatar/${message.sender.avatarUrl}`
    : defaultLogo;

  const senderName = message.sender?.name || "Системне повідомлення";
  
  const date = new Date(message.createdAt).toLocaleDateString('uk-UA', {
      day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
  });

  const object = {
    logo: logoSrc,
    line: false,
    strong: senderName, 
    p: date 
  };

  return (
    <div className="page">
        <CustomTitle title={message.title} data={object} />
        
        <div className='container' style={{marginTop: '30px'}}>
            <BrowserWindow>
              <BrowserWinText text={message.message} />
            </BrowserWindow>
        </div>
    </div>
  );
};

export default MessageTextPage;