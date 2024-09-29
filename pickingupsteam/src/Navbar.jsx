import React from 'react';
import './Navbar.css'; // Optional: for styling
import { Outlet, Link } from "react-router-dom";


function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="navbar-logo">Picking Up Steam</h2>
      <Link to="/">Home</Link>
      <Link to="/store">Store</Link>
      <Link to="/">Profile</Link>
      <Link to="/">Quests</Link>
      <button className="login-button">Login</button>

    </nav>
  );
};

export default Navbar;