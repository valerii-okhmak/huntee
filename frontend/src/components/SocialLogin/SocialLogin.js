// import React, { useState } from 'react';
import './SocialLogin.css';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { saveTokens } from '../../utils/auth';

const SocialLogin = ({ setError }) => {
  // const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      // setLoading(true);
      const credential = credentialResponse.credential;
      const decoded = jwtDecode(credential);

      const response = await axios.post('http://localhost:8080/api/auth/google', {
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
      window.location.href = '/';
    } catch (err) {
      console.error('Google авторизація не вдалася:', err);
      setError('Не вдалося увійти через Google.');
    } finally {
      // setLoading(false);
    }
  };

  // const handleRedirect = (providerUrl) => {
  //   window.location.href = providerUrl;
  // };

  return (
    <div className="social-login">
        <GoogleLogin className="social-btn"
            onSuccess={handleGoogleLogin}
            onError={() => setError('Помилка при логіні з Google')}
        />

      {/* <button className="social-btn linkedin-btn" onClick={() => handleRedirect('https://java-application-latest-mlfc.onrender.com/oauth2/authorization/linkedin')}>
        <img src="https://www.linkedin.com/favicon.ico" alt="LinkedIn" />
        Авторизація через LinkedIn
      </button>

      <button className="social-btn facebook-btn" onClick={() => handleRedirect('https://java-application-latest-mlfc.onrender.com/oauth2/authorization/facebook')}>
        <img src="https://www.facebook.com/favicon.ico" alt="Facebook" />
        Авторизація через Facebook
      </button> */}
    </div>
  );
};

export default SocialLogin;
