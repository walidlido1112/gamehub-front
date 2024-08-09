import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTachometerAlt, faUser, faShoppingCart, faSignOutAlt, faSignInAlt, faUserPlus, faBars } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar fixed top-0 left-0 w-full bg-gray-800 text-white shadow-lg z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="logo flex items-center">
          <Link to="/" className="text-xl font-bold hover:text-gray-400 flex items-center">
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            GameHub Store
          </Link>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-xl hover:text-gray-400 focus:outline-none">
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
        <div className={`links md:flex ${isMobileMenuOpen ? 'flex' : 'hidden'} flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4`}>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link flex items-center text-base md:text-lg hover:text-gray-400">
                <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" />
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <>
                  <Link to="/accounts" className="nav-link flex items-center text-base md:text-lg hover:text-gray-400">
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Accounts
                  </Link>
                  <Link to="/orders" className="nav-link flex items-center text-base md:text-lg hover:text-gray-400">
                    <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                    Orders
                  </Link>
                </>
              )}
              <button
                onClick={logout}
                className="nav-link flex items-center text-base md:text-lg bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link flex items-center text-base md:text-lg hover:text-gray-400">
                <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                Login
              </Link>
              <Link to="/register" className="nav-link flex items-center text-base md:text-lg hover:text-gray-400">
                <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
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
