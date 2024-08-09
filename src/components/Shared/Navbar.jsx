import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTachometerAlt, faUser, faShoppingCart, faSignOutAlt, faSignInAlt, faUserPlus, faBars } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          <FontAwesomeIcon icon={faHome} className="icon" />
          GameHub Store
        </Link>
        <button onClick={toggleMobileMenu} className="menu-toggle">
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className={`links ${isMobileMenuOpen ? 'open' : ''}`}>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">
                <FontAwesomeIcon icon={faTachometerAlt} className="icon" />
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <>
                  <Link to="/accounts" className="nav-link">
                    <FontAwesomeIcon icon={faUser} className="icon" />
                    Accounts
                  </Link>
                  <Link to="/orders" className="nav-link">
                    <FontAwesomeIcon icon={faShoppingCart} className="icon" />
                    Orders
                  </Link>
                </>
              )}
              <button onClick={logout} className="nav-link logout">
                <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                <FontAwesomeIcon icon={faSignInAlt} className="icon" />
                Login
              </Link>
              <Link to="/register" className="nav-link">
                <FontAwesomeIcon icon={faUserPlus} className="icon" />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
