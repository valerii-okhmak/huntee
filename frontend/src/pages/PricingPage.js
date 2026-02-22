import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../components/pricing_plans/pricing.css';
import checkMark from '../img/check_mark.png';

const PricingPage = () => {
  const { t } = useTranslation();
  
  // Data structure moved to component to use t()
  const plansData = {
    yearly: [
      {
        name: 'Starter',
        price: '$0',
        description: t('pricingPage.plans.starter.description'),
        features: t('pricingPage.plans.starter.features', { returnObjects: true }),
      },
      {
        name: 'Pro Journey',
        price: '$10',
        priceId: 'price_1Rl6oNCkXSDPUZVKQF8reeM1',
        popular: true,
        description: t('pricingPage.plans.pro.description'),
        features: t('pricingPage.plans.pro.features', { returnObjects: true }),
      },
      {
        name: 'Ultimate Self',
        price: '$24',
        priceId: 'price_1Rl6pACkXSDPUZVKvENoUIsz',
        description: t('pricingPage.plans.ultimate.description'),
        features: t('pricingPage.plans.ultimate.features', { returnObjects: true }),
      },
    ],
    monthly: [
      {
        name: 'Starter',
        price: '$0',
        description: t('pricingPage.plans.starter.description'),
        features: t('pricingPage.plans.starter.features', { returnObjects: true }),
      },
      {
        name: 'Pro Journey',
        price: '$12',
        priceId: 'price_1Rl6qyCkXSDPUZVKNHTUzPQ0',
        popular: true,
        description: t('pricingPage.plans.pro.description'),
        features: t('pricingPage.plans.pro.features', { returnObjects: true }),
      },
      {
        name: 'Ultimate Self',
        price: '$30',
        priceId: 'price_1Rl6rpCkXSDPUZVK42uEPSu0',
        description: t('pricingPage.plans.ultimate.description'),
        features: t('pricingPage.plans.ultimate.features', { returnObjects: true }),
      },
    ],
  };

  const [isYearly, setIsYearly] = useState(true);
  const [loading, setLoading] = useState(false);

  const plans = isYearly ? plansData.yearly : plansData.monthly;

  const handleSubscribe = async (priceId) => {
  setLoading(true);
  try {
    const response = await fetch('http://localhost:8080/api/payment/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(t('pricingPage.errorPrefix') + (errorData.error || t('pricingPage.unknownError')));
      setLoading(false);
      return;
    }

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(t('pricingPage.sessionError'));
    }
  } catch (error) {
    alert(t('pricingPage.errorPrefix') + error.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="pricing-page">
      <div className="pricing-container">
        <div className="toggle">
          <button
            className={isYearly ? 'active' : ''}
            id="yearly-button"
            onClick={() => setIsYearly(true)}
          >
            <div className="text-button">{t('pricingPage.yearly')}</div>{' '}
            {isYearly && <span className="discount">{t('pricingPage.discount')}</span>}
          </button>
          <button
            className={!isYearly ? 'active' : ''}
            id="monthly-button"
            onClick={() => setIsYearly(false)}
          >
            {t('pricingPage.monthly')}
          </button>
        </div>

        <div className="plans">
          {plans.map((plan) => (
            <div key={plan.priceId || plan.name} className="plan-wrapper">
              <div className={`plan ${plan.popular ? 'popular' : ''}`}>
                <div className="plan-information">
                  {plan.popular && <div className="badge">{t('pricingPage.bestOffer')}</div>}

                  <h3>{plan.name}</h3>

                  <p className="price">
                    {plan.price}{' '}
                    <span className="mounth-span">
                      / {isYearly ? t('pricingPage.perYear') : t('pricingPage.perMonth')}
                    </span>
                  </p>

                  <p className="description">{plan.description}</p>

                  {plan.name !== 'Starter' && (
                    <button
                      className="subscribe-btn"
                      disabled={loading}
                      onClick={() => handleSubscribe(plan.priceId)}
                    >
                      {loading ? t('pricingPage.processing') : t('pricingPage.subscribeBtn')}
                    </button>
                  )}
                </div>

                <div className="features">
                  <ul>
                    {Array.isArray(plan.features) && plan.features.map((feature, i) => (
                      <li key={i}>
                        <img src={checkMark} alt="checkMark" /> <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;