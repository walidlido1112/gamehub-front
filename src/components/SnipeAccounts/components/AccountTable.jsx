import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop, faEdit, faTrash, faCheck, faUndo } from '@fortawesome/free-solid-svg-icons';
import EditAccountModal from './EditAccountModal';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Grid,
  Checkbox,
  TablePagination
} from '@mui/material';
import { motion } from 'framer-motion';

const AccountTable = () => {
  const [accountData, setAccountData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownRDP, setDropdownRDP] = useState([]);
  const [selectedRDP, setSelectedRDP] = useState('');
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [accountsPerPage] = useState(15);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get(`${apiUrl}/snipeaccounts`)
      .then(response => {
        setAccountData(response.data);
        setFilteredData(response.data);
        setTotalCount(response.data.length);
        const rdpOptions = [...new Set(response.data.map(account => account.rdp))];
        setDropdownRDP(rdpOptions);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = accountData.filter(account =>
      (account.email.toLowerCase().includes(lowerCaseQuery) || account.rdp.toLowerCase().includes(lowerCaseQuery)) &&
      (selectedRDP ? account.rdp === selectedRDP : true)
    );
    setFilteredData(filtered);
  }, [searchQuery, accountData, selectedRDP]);

  const startAccount = (accountId) => {
    axios.post(`${apiUrl}/snipeaccounts/starttime`, { id: accountId })
        .then(() => {
            fetchData();
        })
        .catch(error => {
            console.error('Error starting account:', error);
        });
  };

  const stopAccount = (accountId) => {
    axios.post(`${apiUrl}/snipeaccounts/stop`, { id: accountId })
        .then(() => {
            fetchData();
        })
        .catch(error => {
            console.error('Error stopping account:', error);
        });
  };

  const resetAccount = (accountId) => {
    axios.post(`${apiUrl}/snipeaccounts/reset`, { id: accountId })
        .then(() => {
            fetchData();
        })
        .catch(error => {
            console.error('Error resetting account:', error);
        });
  };

  const deleteAccount = (accountId) => {
    axios.delete(`${apiUrl}/snipeaccounts/${accountId}`)
        .then(() => {
            fetchData();
        })
        .catch(error => {
            console.error('Error deleting account:', error);
        });
  };

  const startAccounts = () => {
    confirmAlert({
      title: 'Confirm Start',
      message: 'Are you sure you want to start the selected accounts?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            const startPromises = selectedAccounts.map(accountId =>
              axios.post(`${apiUrl}/snipeaccounts/starttime`, { id: accountId })
            );
            Promise.all(startPromises)
              .then(() => {
                fetchData();
                setSelectedAccounts([]);
              })
              .catch(error => {
                console.error('Error starting accounts:', error);
              });
          }
        },
        {
          label: 'No'
        }
      ]
    });
  };

  const stopAccounts = () => {
    confirmAlert({
      title: 'Confirm Stop',
      message: 'Are you sure you want to stop the selected accounts?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            const stopPromises = selectedAccounts.map(accountId =>
              axios.post(`${apiUrl}/snipeaccounts/stop`, { id: accountId })
            );
            Promise.all(stopPromises)
              .then(() => {
                fetchData();
                setSelectedAccounts([]);
              })
              .catch(error => {
                console.error('Error stopping accounts:', error);
              });
          }
        },
        {
          label: 'No'
        }
      ]
    });
  };

  const resetAccounts = () => {
    confirmAlert({
      title: 'Confirm Reset',
      message: 'Are you sure you want to reset the selected accounts?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            const resetPromises = selectedAccounts.map(accountId =>
              axios.post(`${apiUrl}/snipeaccounts/reset`, { id: accountId })
            );
            Promise.all(resetPromises)
              .then(() => {
                fetchData();
                setSelectedAccounts([]);
              })
              .catch(error => {
                console.error('Error resetting accounts:', error);
              });
          }
        },
        {
          label: 'No'
        }
      ]
    });
  };

  const deleteAccounts = () => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete the selected accounts?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            const deletePromises = selectedAccounts.map(accountId =>
              axios.delete(`${apiUrl}/snipeaccounts/${accountId}`)
            );
            Promise.all(deletePromises)
              .then(() => {
                fetchData();
                setSelectedAccounts([]);
              })
              .catch(error => {
                console.error('Error deleting accounts:', error);
              });
          }
        },
        {
          label: 'No'
        }
      ]
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedAccounts(filteredData.slice(currentPage * accountsPerPage, (currentPage + 1) * accountsPerPage).map(account => account._id));
    } else {
      setSelectedAccounts([]);
    }
  };

  const handleRowSelect = (event, accountId) => {
    if (event.target.checked) {
      setSelectedAccounts(prevSelected => [...prevSelected, accountId]);
    } else {
      setSelectedAccounts(prevSelected => prevSelected.filter(id => id !== accountId));
    }
  };

  const openEditModal = (account) => {
    setSelectedAccount(account);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAccount(null);
  };

  if (loading) {
    return <Typography variant="h6" align="center" color="textSecondary">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" align="center" color="error">Error fetching data: {error.message}</Typography>;
  }

  const getRowColor = (status, stopTime) => {
    if (status === 'in progress') return '#0f4fff'; // Light blue
    if (status === 'completed today')return '#04e097'; {
      const stopDate = new Date(stopTime);
      const currentDate = new Date();
      const isPast5Minutes = (currentDate - stopDate) > (24 * 60 * 60 * 1000);
      return isPast5Minutes ? '#e6f4ea' : '#d0f5e2'; // Light green
    }
    if (status === 'reset') return '#fef5e6'; // Light yellow
    return 'white'; // Default
  };

  const isStartButtonDisabled = (status, stopTime) => {
    if (status === 'in progress') return true;
    if (status === 'completed today') {
      const stopDate = new Date(stopTime);
      const currentDate = new Date();
      return (currentDate - stopDate) < (24 * 60 * 60 * 1000); // 5 minutes
    }
    return false;
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Account Management</Typography>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>RDP</InputLabel>
            <Select
              value={selectedRDP}
              onChange={(e) => setSelectedRDP(e.target.value)}
              label="RDP"
            >
              <MenuItem value="">All</MenuItem>
              {dropdownRDP.map(rdp => (
                <MenuItem key={rdp} value={rdp}>{rdp}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ maxHeight: 3000 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  onChange={handleSelectAll}
                  checked={selectedAccounts.length === filteredData.length}
                />
              </TableCell>
              <TableCell>#</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>RDP</TableCell>
              <TableCell>Searches</TableCell>
              <TableCell>Coins</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>Stop Time</TableCell>
              <TableCell>Time Elapsed</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice(currentPage * accountsPerPage, (currentPage + 1) * accountsPerPage).map((account, index) => (
              <motion.tr
                key={account._id}
                style={{ backgroundColor: getRowColor(account.status, account.stopTime) }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedAccounts.includes(account._id)}
                    onChange={(e) => handleRowSelect(e, account._id)}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{index + 1}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{account.email}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{account.rdp}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{account.searches}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{account.coins}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  {account.startTime ? new Date(account.startTime).toLocaleString() : 'N/A'}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  {account.stopTime ? new Date(account.stopTime).toLocaleString() : 'N/A'}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  {account.startTime && account.stopTime
                    ? `${Math.round((new Date(account.stopTime) - new Date(account.startTime)) / 60000)} mins`
                    : 'N/A'
                  }
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  <span style={{
                    color: account.status === 'in progress' ? 'white' :
                      account.status === 'completed today' ? 'black' : 'inherit',
                    fontWeight: 'bold'
                  }}>
                    {account.status === 'in progress' ? (
                      <>
                        <FontAwesomeIcon icon={faPlay} className="mr-1" />
                        In Progress
                      </>
                    ) : account.status === 'completed today' ? (
                      <>
                        <FontAwesomeIcon icon={faCheck} className="mr-1" />
                        Completed
                      </>
                    ) : 'N/A'}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => startAccount(account._id)}
                    variant="contained"
                    color="primary"
                    disabled={isStartButtonDisabled(account.status, account.stopTime)}
                    sx={{ mr: 1 }}
                  >
                    <FontAwesomeIcon icon={faPlay} />
                  </Button>
                  <Button
                    onClick={() => stopAccount(account._id)}
                    variant="contained"
                    color="error"
                    disabled={account.status !== 'in progress'}
                    sx={{ mr: 1 }}
                  >
                    <FontAwesomeIcon icon={faStop} />
                  </Button>
                  <Button
                    onClick={() => openEditModal(account)}
                    variant="contained"
                    color="warning"
                    sx={{ mr: 1 }}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    onClick={() => deleteAccount(account._id)}
                    variant="contained"
                    color="error"
                    sx={{ mr: 1 }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                  <Button
                    onClick={() => resetAccount(account._id)}
                    variant="contained"
                    color="secondary"
                  >
                    <FontAwesomeIcon icon={faUndo} />
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[15]}
        component="div"
        count={totalCount}
        rowsPerPage={accountsPerPage}
        page={currentPage}
        onPageChange={handleChangePage}
      />
      {isEditModalOpen && selectedAccount && (
        <EditAccountModal
          open={isEditModalOpen}
          onClose={closeEditModal}
          account={selectedAccount}
          onUpdate={fetchData}
        />
      )}
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={startAccounts}
            disabled={selectedAccounts.length === 0}
          >
            <FontAwesomeIcon icon={faPlay} /> Start Selected
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={stopAccounts}
            disabled={selectedAccounts.length === 0}
          >
            <FontAwesomeIcon icon={faStop} /> Stop Selected
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={resetAccounts}
            disabled={selectedAccounts.length === 0}
          >
            <FontAwesomeIcon icon={faUndo} /> Reset Selected
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={deleteAccounts}
            disabled={selectedAccounts.length === 0}
          >
            <FontAwesomeIcon icon={faTrash} /> Delete Selected
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default AccountTable;
