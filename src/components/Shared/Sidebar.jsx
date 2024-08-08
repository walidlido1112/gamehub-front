import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUser, faShoppingCart, faTools, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css'; // تأكد من وجود ملف CSS

const Sidebar = () => {
  return (
    <div className="flex min-h-screen">
      <aside className="sidebar shadow-lg fixed h-full w-64 bg-gray-800 text-white">
        <div className="sidebar-header p-4">
          <h2 className="text-2xl font-bold">GameHub Store</h2>
        </div>
        <nav className="space-y-6 p-4">
          <Link to="/dashboard" className="sidebar-link">
            <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" />
            Dashboard
          </Link>
          <Link to="/accounts" className="sidebar-link">
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            Accounts
          </Link>
          <Link to="/orders" className="sidebar-link">
            <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
            Orders
          </Link>
          <Link to="/assign-role" className="sidebar-link">
            <FontAwesomeIcon icon={faTools} className="mr-2" />
            Tools
          </Link>
          <Link to="/report-account" className="sidebar-link">
            <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
            Report Account
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-100 ml-64">
        {/* محتوى الصفحة الرئيسية */}
      </main>
    </div>
  );
};

export default Sidebar;
