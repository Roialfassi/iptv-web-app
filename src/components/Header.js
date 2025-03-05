// src/components/Header.js
import React from 'react';
import '../styles/Header.css';

const Header = ({ onLogout }) => {
  return (
    <header className="header">
      <div className="logo">IPTV Player</div>
      <button className="logout-button" onClick={onLogout}>Logout</button>
    </header>
  );
};

export default Header;