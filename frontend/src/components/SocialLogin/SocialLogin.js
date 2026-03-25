import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './SocialLogin.css';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { saveTokens } from '../../utils/auth';
import { useNavigate, useLocation } from 'react-router-dom';

const SocialLogin = ({ setError }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

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

      const redirectPath = location.state?.from?.pathname 
                           || sessionStorage.getItem('redirectAfterLogin') 
                           || '/profile';

      sessionStorage.removeItem('redirectAfterLogin');

      navigate(redirectPath, { replace: true });
      
    } catch (err) {
      console.error('Google authorization failed:', err);
      const errorMsg = err.response?.data?.message || t('socialLogin.googleError');
      setError(errorMsg);
    }
  };

  return (
    <div className="social-login-wrapper">
      <div className="social-login-btn-container">
        <GoogleLogin 
          onSuccess={handleGoogleLogin}
          onError={() => setError(t('socialLogin.googleLoginFailed'))}
          text="signin_with" /* Можна змінити текст на кнопці, якщо треба */
          shape="rectangular"
        />
      </div>
    </div>
  );
};

export default SocialLogin;