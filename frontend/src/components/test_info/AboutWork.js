import React from "react";
import "./AboutWork.css";
import BrowserWindow from "../browser_window/BrowserWindow";
import BrowserWinText from "../browser_win_text/BrowserWinText";

const AboutWork = () => {
  return (
      <div className="about-work">
        <div className="about-work-title">
        <h2>ABOUT WORK</h2>
        </div>
        <div className="about-work-text">
        <BrowserWindow>
          <BrowserWinText who={'шановний(на) студенте(тко)'} company={'huntee'} text = {'Ми шукаємо талановитого Data Scientist для роботи над генеративними рішеннями штучного інтелекту в різних галузях та сферах використання. Ви будете використовувати свій досвід машинного навчання для вирішення складних бізнес-завдань, застосовуючи останні досягнення в галузі науки про дані та штучного інтелекту до текстів, зображень, відео та інших типів даних.\nВи співпрацюватимете з міжфункціональними командами інженерів, науковців та продакт-менеджерів, відіграючи ключову роль у просуванні генеративного ШІ від концепції до реалізації.\nЯкщо відчуваєш сили і віриш, що саме ти можеш стати членом нашої команди, то ця можливість саме для тебе!'} />
        </BrowserWindow>
        </div>
      </div>
  );
}
export default AboutWork;