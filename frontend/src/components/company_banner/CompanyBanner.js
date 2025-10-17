import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CompanyBanner.css";

const CompanyBanner = () => {
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    navigate("/companymain");
  };

  const handleClose = (e) => {
    e.stopPropagation(); 
    setClosed(true);
    setTimeout(() => setVisible(false), 400); 
  };

  if (!visible) return null;

  return (
    <div className="banner-wrapper">
    <div className={`company-banner ${closed ? "hide" : "show"}`} onClick={handleClick}>
      <button className="close-btn" onClick={handleClose}>
        ✖
      </button>
      <div className="banner-content">
        <div>
          <h4>ВИ ПРЕДСТАВНИК<br/>КОМПАНІЙ?</h4>
          <p>Переходьте на сторінку компаній!</p>
        </div>
        <span className="arrow">➜</span>
      </div>
    </div>
    </div>
  );
};

export default CompanyBanner;
