import React from "react";
import "./AboutTest.css";
import TestInfo from "./TestInfo";
import CompanyInfo from "./CompanyInfo";
import logo from "../../../img/softserve.png"; 

const AboutTest = ({ testData }) => {
    
    const startDate = new Date(testData.startTime);
    const date = startDate.toLocaleDateString('uk-UA'); 
    const time = startDate.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }); 

    return (
        <div className="about-test">
            <TestInfo 
                category={testData.sphere} 
                logo={logo} 
                vacancy={testData.testName} 
                location={testData.city} 
                date={date} 
                time={time}
            />
            <CompanyInfo 
                text={'SoftServe — це перш за все люди.\nТі, які створюють глобальну IT компанію...'}
            />
        </div>
    );
}
export default AboutTest;