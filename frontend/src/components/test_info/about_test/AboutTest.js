import React from "react";
import "./AboutTest.css";
import TestInfo from "./TestInfo";
import CompanyInfo from "./CompanyInfo";
import logo from "../../../img/softserve.png"; 

const AboutTest = () => {
  return (
    <div className="about-test">
      <TestInfo category={'Data Science'} logo={logo} vacancy={'JUNIOR DATA SCIENCE'} location={'Lviv'} date={'21.03.2025'} time={'18:00'}/>
      <CompanyInfo text={'SoftServe — це перш за все люди.\nТі, які створюють глобальну IT компанію з українським корінням та ростуть разом з нею. Ми консультуємо, генеруємо інновації та розвиваємо таланти в Україні, Європі, США, Латинській Америці та Азії.'}/>
    </div>
  );
}
export default AboutTest;