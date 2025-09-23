import React, { useState } from 'react';
import '../components/pricing_plans/pricing.css';
import checkMark from '../img/check_mark.png';

const PricingPage = () => {
  const plansData = {
    yearly: [
      {
        name: 'Starter',
        price: '$0',
        description: 'Ідеально для знайомства.',
        features: [
          'Доступ до аналізів тестів.',
          'Доступ до пробного тесту.',
          'Доступ до звіту з твого результату.',
          'Тест на Soft & Hard IT.',
          'Високі рекомендації.',
          'Можливість повторного проходження протягом 30 днів.',
        ],
      },
      {
        name: 'Pro Journey',
        price: '$10',
        priceId: 'price_1Rl6oNCkXSDPUZVKQF8reeM1',
        popular: true,
        description: 'Оптимальний вибір для тих, хто хоче більше.',
        features: [
          'Розширені тести.',
          'Детальний аналіз результатів.',
          'PDF-роздрук з твого результату.',
          'Доступ до мобільних копій.',
          'Гнучке проходження будь-якого тесту в зручний час.',
        ],
      },
      {
        name: 'Ultimate Self',
        price: '$24',
        priceId: 'price_1Rl6pACkXSDPUZVKvENoUIsz',
        description: 'Для тих, хто серйозно.',
        features: [
          'Індивідуальний підхід.',
          'Доступ до спеціального звіту-порівняння твоїх результатів із групою.',
          'Інсайти зі справжніми кейсами.',
          'Супровід від Soft Skills Simulation – симуляторів інтерв’ю та вибору рішень.',
        ],
      },
    ],
    monthly: [
      {
        name: 'Starter',
        price: '$0',
        description: 'Ідеально для знайомства.',
        features: [
          'Доступ до аналізів тестів.',
          'Доступ до пробного тесту.',
          'Доступ до звіту з твого результату.',
          'Тест на Soft & Hard IT.',
          'Високі рекомендації.',
          'Можливість повторного проходження протягом 30 днів.',
        ],
      },
      {
        name: 'Pro Journey',
        price: '$12',
        priceId: 'price_1Rl6qyCkXSDPUZVKNHTUzPQ0',
        popular: true,
        description: 'Оптимальний вибір для тих, хто хоче більше.',
        features: [
          'Розширені тести.',
          'Детальний аналіз результатів.',
          'PDF-роздрук з твого результату.',
          'Доступ до мобільних копій.',
          'Гнучке проходження будь-якого тесту в зручний час.',
        ],
      },
      {
        name: 'Ultimate Self',
        price: '$30',
        priceId: 'price_1Rl6rpCkXSDPUZVK42uEPSu0',
        description: 'Для тих, хто серйозно.',
        features: [
          'Індивідуальний підхід.',
          'Доступ до спеціального звіту-порівняння твоїх результатів із групою.',
          'Інсайти зі справжніми кейсами.',
          'Супровід від Soft Skills Simulation – симуляторів інтерв’ю та вибору рішень.',
        ],
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
      alert('Помилка: ' + (errorData.error || 'Невідома помилка'));
      setLoading(false);
      return;
    }

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Не вдалося створити сесію оплати');
    }
  } catch (error) {
    alert('Помилка: ' + error.message);
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
            <div className="text-button">Річна підписка</div>{' '}
            {isYearly && <span className="discount">до -20%🔥</span>}
          </button>
          <button
            className={!isYearly ? 'active' : ''}
            id="monthly-button"
            onClick={() => setIsYearly(false)}
          >
            Місячна підписка
          </button>
        </div>

        <div className="plans">
          {plans.map((plan) => (
            <div key={plan.priceId || plan.name} className="plan-wrapper">
              <div className={`plan ${plan.popular ? 'popular' : ''}`}>
                <div className="plan-information">
                  {plan.popular && <div className="badge">Найкраща пропозиція</div>}

                  <h3>{plan.name}</h3>

                  <p className="price">
                    {plan.price}{' '}
                    <span className="mounth-span">
                      / {isYearly ? 'рік' : 'місяць'}
                    </span>
                  </p>

                  <p className="description">{plan.description}</p>

                  {plan.name !== 'Starter' && (
                    <button
                      className="subscribe-btn"
                      disabled={loading}
                      onClick={() => handleSubscribe(plan.priceId)}
                    >
                      {loading ? 'Обробка...' : 'ОФОРМИТИ ЗАРАЗ'}
                    </button>
                  )}
                </div>

                {/* Особливості тарифу */}
                <div className="features">
                  <ul>
                    {plan.features.map((feature, i) => (
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
