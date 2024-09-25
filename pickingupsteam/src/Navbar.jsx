import React from 'react';
import './Navbar.css'; // Optional: for styling

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="navbar-logo">Picking Up Steam</h2>
      <button className="login-button">Login</button>
    </nav>
  );
};

export default Navbar;