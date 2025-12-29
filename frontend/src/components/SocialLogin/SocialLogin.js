import React, { useEffect } from 'react';
import './SocialLogin.css';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { saveTokens } from '../../utils/auth';
import { useNavigate, useLocation } from 'react-router-dom';

const SocialLogin = ({ setError }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Кожного разу, коли компонент маунтиться, перевіряємо чи є шлях "from"
  // Якщо є, зберігаємо його в sessionStorage, щоб він не зник після взаємодії з Google
  useEffect(() => {
    if (location.state?.from?.pathname) {
      sessionStorage.setItem('redirectAfterLogin', location.state.from.pathname);
    }
  }, [location]);

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const credential = credentialResponse.credential;
      const decoded = jwtDecode(credential);

      const response = await axios.post(`/api/auth/google`, {
        providerUserId: decoded.sub,
        email: decoded.email,
        firstName: decoded.given_name,
        lastName: decoded.family_name,
        profileImageUrl: decoded.picture,
        accessToken: credential,
        refreshToken: null,
        expiresAt: null,
      });

      saveTokens(response.data);

      // 2. Пріоритет вибору шляху:
      // Спочатку пробуємо state, потім sessionStorage, якщо все порожньо - /profile
      const redirectPath = location.state?.from?.pathname 
                           || sessionStorage.getItem('redirectAfterLogin') 
                           || '/profile';

      // Очищуємо тимчасове сховище
      sessionStorage.removeItem('redirectAfterLogin');

      // Переходимо
      navigate(redirectPath, { replace: true });
      
    } catch (err) {
      console.error('Google авторизація не вдалася:', err);
      const errorMsg = err.response?.data?.message || 'Не вдалося увійти через Google.';
      setError(errorMsg);
    }
  };

  return (
    <div className="social-login">
      <GoogleLogin 
        onSuccess={handleGoogleLogin}
        onError={() => setError('Помилка при логіні з Google')}
      />
    </div>
  );
};

export default SocialLogin;