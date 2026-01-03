import React, { useState } from 'react';

const PasswordInput = ({ placeholder, value, onChange }) => {
  const [show, setShow] = useState(false);

  const toggleVisibility = () => {
    setShow((prev) => !prev);
  };

  return (
    <div className="password-input-wrapper">
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="modal-input-password"
      />
      {value.length > 0 && (
        <span
          className="toggle-password-visibility"
          onMouseDown={(e) => {
            e.preventDefault(); 
            toggleVisibility();
          }}
        >
          {show ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a21.77 21.77 0 014.62-5.43m3.18-1.8A10.94 10.94 0 0112 4c7 0 11 8 11 8a21.77 21.77 0 01-4.62 5.43M1 1l22 22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      )}
    </div>
  );
};

export default PasswordInput;