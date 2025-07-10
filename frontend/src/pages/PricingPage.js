import React , {useState} from 'react'
import '../components/pricing_plans/pricing.css'
import  checkMark from'../img/check_mark.png' 

const PricingPage = () => {

const plansData = {
  yearly: [
    { name: 'Starter', price: '$0', description: 'Ідеально для знайомства.', features: ['Доступ до аналізів тестів.', 'Доступ до пробного тесту.', 'Доступ до звіту з твого результату.', 'Тест на Soft & Hard IT.', 'Високі рекомендації.', 'Можливість повторного проходження протягом 30 днів.'] },
    { name: 'Pro Journey', price: '$10', popular: true, description: 'Оптимальний вибір для тих, хто хоче більше.', features: ['Розширені тести.', 'Детальний аналіз результатів.', 'PDF-роздрук з твого результату.', 'Доступ до мобільних копій.', 'Гнучке проходження будь-якого тесту в зручний час.'] },
    { name: 'Ultimate Self', price: '$24', description: 'Для тих, хто серйозно.', features: ['Індивідуальний підхід.', 'Доступ до спеціального звіту-порівняння твоїх результатів із групою.', 'Інсайти зі справжніми кейсами.', 'Супровід від Soft Skills Simulation – симуляторів інтерв’ю та вибору рішень.'] }
  ],
  monthly: [
    { name: 'Starter', price: '$0', description: 'Ідеально для знайомства.', features: ['Доступ до аналізів тестів.', 'Доступ до пробного тесту.', 'Доступ до звіту з твого результату.', 'Тест на Soft & Hard IT.', 'Високі рекомендації.', 'Можливість повторного проходження протягом 30 днів.'] },
    { name: 'Pro Journey', price: '$12', popular: true, description: 'Оптимальний вибір для тих, хто хоче більше.', features: ['Розширені тести.', 'Детальний аналіз результатів.', 'PDF-роздрук з твого результату.', 'Доступ до мобільних копій.', 'Гнучке проходження будь-якого тесту в зручний час.'] },
    { name: 'Ultimate Self', price: '$30', description: 'Для тих, хто серйозно.', features: ['Індивідуальний підхід.', 'Доступ до спеціального звіту-порівняння твоїх результатів із групою.', 'Інсайти зі справжніми кейсами.', 'Супровід від Soft Skills Simulation – симуляторів інтерв’ю та вибору рішень.'] }
  ]
};

const [isYearly, setIsYearly] = useState(true);
const plans = isYearly ? plansData.yearly : plansData.monthly;

  return (  
   <div className="pricing-page">
    <div className='pricing-container'>
        <div className='toggle'>
            <button className={isYearly ? "active" : ""} id='yearly-button' onClick={() => setIsYearly(true)}><div className='text-button'>Річна підписка </div> {isYearly ? <span className="discount">до -20%🔥</span>: ""}</button>
            <button className={!isYearly ? "active" : ""} id='mouth-button' onClick={() => setIsYearly(false)}>Місячна підписка</button>
        </div>
        <div className='plans'>
            {plans.map((plan, index)=> (
                <div className="plan-wrapper">
                <div key={index} className={`plan ${plan.popular ? "popular" : ""}`}>
                    <div className='plan-information'>
                    {plan.popular && <div className="badge">Найкраща пропозиція</div>}
                      <h3>{plan.name}</h3>
                      {isYearly &&
                       <p className="price">{plan.price} <span className='mounth-span'> / рік</span></p>}
                       {!isYearly &&
                       <p className="price">{plan.price} <span className='mounth-span'> / місяць</span></p>}
                       <p className="description">{plan.description}</p>
                       {plan.name !="Starter" && <button className="subscribe-btn">ОФОРМИТИ ЗАРАЗ</button>}
                       </div>
                        <div className='features'>
                       <ul>          
              {plan.features.map((feature, i) => (
                <li key={i}> <img src={checkMark} alt="checkMark" /> <span> {feature}</span></li>
              ))}
            </ul>
             </div>
             </div>
                </div>
            ))}
        </div>
    </div>
   </div>
  )
}

export default PricingPage