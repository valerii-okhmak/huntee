import React from 'react';
import { Link } from 'react-router-dom'; 
import './subscriptionsComp.css';

const Subscriptions = () => {
  return (
    <div className="subscriptions">
      <div className="subscriptions__content">
      <span className="corner-icon">$$$</span>
        <h2 className="subscriptions__title">subscriptions</h2>
        <p className="subscriptions__subtitle">Дізнайтеся, що пропонують наші плани!</p>

        <div className="subscriptions__plans">
          <div className="subscription__plan-item">
            <p className="plan__desc">Ідеально для знайомства.</p>
            <Link to="/pricingpage" className="plan__button">
              <span className="plan__number">1</span>
              <span className="plan__price">$0</span>
            </Link>
          </div>

          <div className="subscription__plan-item">
            <p className="plan__desc">Для тих, хто хоче більше.</p>
            <Link to="/pricingpage" className="plan__button">
              <span className="plan__number">2</span>
              <span className="plan__price">$12</span>
            </Link>
          </div>

          <div className="subscription__plan-item">
            <p className="plan__desc">Для тих, хто серйозно.</p>
            <Link to="/pricingpage" className="plan__button">
              <span className="plan__number">3</span>
              <span className="plan__price">$30</span>
            </Link>
          </div>
        </div>

        <p className="subscriptions__footer">
          ПРИ ПОКУПЦІ РІЧНОЇ ПІДПИСКИ -20%
        </p>
      </div>
    </div>
  );
};

export default Subscriptions;
