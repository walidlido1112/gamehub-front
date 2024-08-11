import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import AccountsPage from './components/Accounts/AccountsPage';
import OrdersPage from './components/Orders/OrdersPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import AssignRolePage from './pages/AssignRolePage'; // Adjusted path
import ProtectedRoute from './routes/ProtectedRoute';
import RBBotAccounts from './components/RBBotAccount/RBBotAccountsPage'; // Adjusted path
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes for Admin */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/accounts"
              element={
                <ProtectedRoute role="admin">
                  <AccountsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute role="admin">
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assign-role"
              element={
                <ProtectedRoute role="admin">
                  <AssignRolePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rbbotaccounts"
              element={
                <ProtectedRoute role="admin">
                  <RBBotAccounts />
                </ProtectedRoute>
              }
            />
            
            {/* Protected Route for Employee */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute role="employee">
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />

            {/* Default Route */}
            <Route path="/" element={<Login />} />
          </Routes>
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
