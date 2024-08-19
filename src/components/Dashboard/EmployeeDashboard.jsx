import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { apiUrl } from '../../config';
import { 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography, 
  Paper, 
  IconButton, 
  MenuItem, 
  Select, 
  InputAdornment, 
  TextField 
} from "@mui/material";
import { Visibility, VisibilityOff, Logout, Edit } from "@mui/icons-material";
import { motion } from "framer-motion";

const statusColors = {
  'in progress': 'bg-blue-100 text-blue-800',
  'in testing': 'bg-orange-100 text-orange-800',
  'completed': 'bg-green-100 text-green-800',
  'on hold': 'bg-red-100 text-red-800',
};

const accountTypes = {
  'admin': 'bg-yellow-100 text-yellow-800',
  'user': 'bg-gray-100 text-gray-800',
  // Add more types as needed
};

const EmployeeDashboard = () => {
  const { user, loading, logout } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [showPassword, setShowPassword] = useState({});

  useEffect(() => {
    if (loading) return;

    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchAccounts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/accounts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetched Accounts:', response.data.accounts);

        const filteredAccounts = response.data.accounts.filter(account =>
          user.id && account.employee
          ? account.employee.toString() === user.id.toString()
          : false
        );
        console.log('Filtered Accounts:', filteredAccounts);
        setAccounts(filteredAccounts);
      } catch (error) {
        console.error('Failed to fetch accounts:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          window.location.href = '/login';
        }
      }
    };

    fetchAccounts();
  }, [user, loading]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.put(`${apiUrl}/accounts/${id}`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Status updated:', response.data);
      setAccounts(accounts.map(account =>
        account._id === id ? response.data : account
      ));
    } catch (error) {
      console.error('Failed to update status:', error.response?.data || error.message);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="container mx-auto p-4">
      {user && (
        <>
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h4">
              مرحبا، {user.name}!
            </Typography>
            <Button 
              onClick={handleLogout} 
              variant="contained" 
              color="error"
              startIcon={<Logout />}
            >
              Logout
            </Button>
          </div>
          <Typography variant="h5" gutterBottom>
            حساباتك المخصصة
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>البريد الإلكتروني</TableCell>
                  <TableCell>كود</TableCell>
                  <TableCell>كلمة المرور</TableCell>
                  <TableCell>نوع الحساب</TableCell>
                  <TableCell>حالة</TableCell>
                  <TableCell>تعديل الحالة</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accounts.length > 0 ? (
                  accounts.map((account) => (
                    <TableRow key={account._id} className={statusColors[account.status] || 'bg-gray-50'}>
                      <TableCell>{account.email}</TableCell>
                      <TableCell>{account.code}</TableCell>
                      <TableCell>
                        <TextField
                          type={showPassword[account._id] ? 'text' : 'password'}
                          value={account.password}
                          readOnly
                          variant="outlined"
                          size="small"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => togglePasswordVisibility(account._id)}
                                >
                                  {showPassword[account._id] ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded ${accountTypes[account.type] || 'bg-gray-200 text-gray-700'}`}>
                          {account.type || 'Unknown'}
                        </span>
                      </TableCell>
                      <TableCell>{account.status}</TableCell>
                      <TableCell>
                        <Select
                          value={account.status}
                          onChange={(e) => handleStatusChange(account._id, e.target.value)}
                          size="small"
                        >
                          <MenuItem value="in progress">In Progress</MenuItem>
                          <MenuItem value="in testing">In Testing</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                          <MenuItem value="on hold">On Hold</MenuItem>
                        </Select>
                        <IconButton color="primary">
                          <Edit />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="py-2 px-4 text-center">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Typography variant="h6">لا توجد حسابات لعرضها.</Typography>
                      </motion.div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default EmployeeDashboard;
