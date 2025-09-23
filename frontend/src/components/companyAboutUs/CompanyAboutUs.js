import React from 'react'
import './CompanyAboutUs.css'
import BrowserWindow from "../browser_window/BrowserWindow";

const CompanyAboutUs = () => {
  return (
    <div className='companyAboutUs'>
        <h2 className='companyAboutUs__title'>ABOUT US</h2>
        <BrowserWindow>
            <div className='companyAboutUs__container'>
                <h4 className='companyAboutUs__hello'>Доброго дня!</h4>
                <p className='companyAboutUs__text'>Huntee — це сучасна платформа для автоматизованого та швидкого відбору кандидатів на роботу, створена з урахуванням потреб IT-компаній та рекрутерів, які цінують час, ефективність і якість. Ми поєднуємо тестування навичок, аналітику й автоматизовану перевірку відповідності, щоб компанії отримували лише релевантних кандидатів — швидко, об’єктивно та без зайвих витрат.
                </p>
                <p className='companyAboutUs__text'>Чому обирають Huntee?</p>
                <div className='companyAboutUs__why'>
                    <div className='companyAboutUs__benefit companyAboutUs__benefit-small'>🔍 Точний відбір</div>
                    <div className='companyAboutUs__benefit companyAboutUs__benefit-small'>⏱ Економія часу</div>
                    <div className='companyAboutUs__benefit companyAboutUs__benefit-small'>📊 Об’єктивна оцінка</div>
                    <div className='companyAboutUs__benefit companyAboutUs__benefit-big'>🛠 Гнучке налаштування під вашу вакансію</div>
                    <div className='companyAboutUs__benefit companyAboutUs__benefit-big'>🤝 Кращий досвід для кандидатів</div>
                </div>
            </div>
        </BrowserWindow>
    </div>
  )
}

export default CompanyAboutUs