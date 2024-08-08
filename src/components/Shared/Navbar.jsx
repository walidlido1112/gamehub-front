import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png'; // ضبط المسار بناءً على هيكل مشروعك
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container mx-auto flex justify-between items-center">
        <div className="logo">
          <img src={logo} alt="GameHub Store" />
          <Link to="/" className="nav-link text-lg font-bold">GameHub Store</Link>
        </div>
        <div className="links">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              {user.role === 'admin' && <Link to="/accounts" className="nav-link">Accounts</Link>}
              {user.role === 'admin' && <Link to="/orders" className="nav-link">Orders</Link>}
              {user.role === 'employee' && <Link to="/employee-dashboard" className="nav-link">Employee Dashboard</Link>}
              <button
                onClick={logout}
                className="nav-link bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
