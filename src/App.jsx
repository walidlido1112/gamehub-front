import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import AccountsPage from './components/Accounts/AccountsPage';
import OrdersPage from './components/Orders/OrdersPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import AssignRolePage from './pages/AssignRolePage'; // Ensure correct import
import ProtectedRoute from './routes/ProtectedRoute';
import RBBotAccountsPage from './components/RBBotAccount/RBBotAccountsPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
              path="/employee-dashboard"
              element={
                <ProtectedRoute role="employee">
                  <EmployeeDashboard />
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
              path="/RBBotAccount"
              element={
                <ProtectedRoute role="admin">
                  <RBBotAccountsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Login />} /> {/* Default route */}
          </Routes>
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
