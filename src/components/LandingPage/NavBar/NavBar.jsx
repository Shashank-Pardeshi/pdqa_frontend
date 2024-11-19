// src/components/Navbar.jsx
import React from "react";
import "./Navbar.css"; // CSS file for styling the navbar

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Inventory Management & Billing System</div>
      <ul className="navbar-links">
        <li>
          <a href="/">About</a>
        </li>
        <li>
          <a href="login">Login</a>
        </li>
        <li>
          <a href="/register">Register</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
