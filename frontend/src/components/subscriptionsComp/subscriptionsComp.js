import React from 'react';
import { Link } from 'react-router-dom'; 
import { useTranslation } from 'react-i18next';
import './subscriptionsComp.css';

const Subscriptions = () => {
  const { t } = useTranslation();

  return (
    <div className="subscriptions">
      <div className="subscriptions__content">
      <span className="corner-icon">$$$</span>
        <h2 className="subscriptions__title">{t('subscriptions.title')}</h2>
        <p className="subscriptions__subtitle">{t('subscriptions.subtitle')}</p>

        <div className="subscriptions__plans">
          <div className="subscription__plan-item">
            <p className="plan__desc">{t('subscriptions.plan1.desc')}</p>
            <Link to="/pricingpage" className="plan__button">
              <span className="plan__number">1</span>
              <span className="plan__price">$0</span>
            </Link>
          </div>

          <div className="subscription__plan-item">
            <p className="plan__desc">{t('subscriptions.plan2.desc')}</p>
            <Link to="/pricingpage" className="plan__button">
              <span className="plan__number">2</span>
              <span className="plan__price">$12</span>
            </Link>
          </div>

          <div className="subscription__plan-item">
            <p className="plan__desc">{t('subscriptions.plan3.desc')}</p>
            <Link to="/pricingpage" className="plan__button">
              <span className="plan__number">3</span>
              <span className="plan__price">$30</span>
            </Link>
          </div>
        </div>

        <p className="subscriptions__footer">
          {t('subscriptions.footer')}
        </p>
      </div>
    </div>
  );
};

export default Subscriptions;