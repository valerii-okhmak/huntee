import React, { useEffect, useState } from 'react';
import './ChooseYourFuture.css';
import ChooseYourFutureItem from './ChooseYourFutureItem';
import BrowserWindow from '../browser_window/BrowserWindow';
import axios from 'axios';
import { getAccessToken } from '../../utils/auth';

const ChooseYourFuture = () => {
  const [spheres, setSpheres] = useState([]);

  useEffect(() => {
    const fetchSpheres = async () => {
      try {
        const token = getAccessToken();
        const response = await axios.get(
          `/api/tests`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const uniqueSpheres = [...new Set(response.data.map(test => test.sphere))];
        setSpheres(uniqueSpheres);
      } catch (err) {
        console.error('Помилка завантаження сфер:', err);
      }
    };

    fetchSpheres();
  }, []);

  return (
    <div className="choose-your-future">
      <div className='choose-your-future-title'>
        <h2>CHOOSE YOUR<br />FUTURE</h2>
      </div>

      <BrowserWindow>
        {spheres.map((sphere) => (
          <ChooseYourFutureItem 
            key={sphere} 
            testname={sphere} 
          />
        ))}
      </BrowserWindow>
    </div>
  );
};

export default ChooseYourFuture;
