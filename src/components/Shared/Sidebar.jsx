import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // تأكد من وجود ملف CSS

const Sidebar = () => {
  return (
    <div className="flex min-h-screen">
      <aside className="sidebar shadow-lg fixed h-full">
        <h2>GameHub Store</h2>
        <nav className="space-y-6">
          <Link to="/dashboard" className="sidebar-link">Dashboard</Link>
          <Link to="/accounts" className="sidebar-link">Accounts</Link>
          <Link to="/orders" className="sidebar-link">Orders</Link>
          <Link to="/assign-role" className="sidebar-link">Tools</Link> {/* رابط جديد */}

          <Link to="/report-account" className="sidebar-link">Report Account</Link>

        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-100 ml-64">
        {/* محتوى الصفحة الرئيسية */}
      </main>
    </div>
  );
};

export default Sidebar;
