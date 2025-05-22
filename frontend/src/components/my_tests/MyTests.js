import React from "react";
import "./MyTests.css";
import ActiveItem from "./ActiveItem";
import UnactiveItem from "./UnactiveItem";
import logo from "../../img/softserve.png"; 

const MyTests = () => {
  return (
    <div className="mytests-container">
        <div className="activetests-container container">
            <h2 className="tests-type-title">Активні</h2>
            <div className="activetests-list">
            <ActiveItem category={'Data Science'} logo={logo} vacancy={'JUNIOR DATA SCIENTIST'} date={'21.03.2025'} time={'18:00'}/>
            <ActiveItem category={'Data Science'} logo={logo} vacancy={'JUNIOR DATA SCIENTIST'} date={'21.03.2025'} time={'18:00'}/>
            <ActiveItem category={'Data Science'} logo={logo} vacancy={'JUNIOR DATA SCIENTIST'} date={'21.03.2025'} time={'18:00'}/>
            <ActiveItem category={'Data Science'} logo={logo} vacancy={'JUNIOR DATA SCIENTIST'} date={'21.03.2025'} time={'18:00'}/>
            </div>
        </div>
        <div className="unactivetests-container container">
            <h2 className="tests-type-title">Пройдені</h2>
            <div className="unactivetests-list">
            <UnactiveItem category={'Data Science'} logo={logo} vacancy={'JUNIOR DATA SCIENTIST'} date={'21.03.2025'} time={'18:00'} read={false} result={100}/>
            <UnactiveItem category={'Data Science'} logo={logo} vacancy={'JUNIOR DATA SCIENTIST'} date={'21.03.2025'} time={'18:00'} read={true} result={50}/>
            <UnactiveItem category={'Data Science'} logo={logo} vacancy={'JUNIOR DATA SCIENTIST'} date={'21.03.2025'} time={'18:00'} read={true} result={100}/>
            <UnactiveItem category={'Data Science'} logo={logo} vacancy={'JUNIOR DATA SCIENTIST'} date={'21.03.2025'} time={'18:00'} read={false} result={100}/>
            </div>
        </div>
    </div>

  );
};

export default MyTests;