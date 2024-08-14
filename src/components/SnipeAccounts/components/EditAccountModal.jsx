// EditAccountModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button
} from '@mui/material';

const EditAccountModal = ({ account, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({ ...account });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    axios.put(`${apiUrl}/snipeaccounts/${account._id}`, formData)
      .then(() => {
        onUpdate();
        onClose();
      })
      .catch(error => {
        console.error('Error updating account:', error);
      });
  };

  return (
    <Dialog open={Boolean(account)} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Account</DialogTitle>
      <DialogContent>
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="RDP"
          name="rdp"
          value={formData.rdp}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Searches"
          name="searches"
          type="number"
          value={formData.searches}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Coins"
          name="coins"
          type="number"
          value={formData.coins}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
        >
          <FontAwesomeIcon icon={faSave} className="mr-1" />
          Save
        </Button>
        <Button
          onClick={onClose}
          color="secondary"
          variant="outlined"
        >
          <FontAwesomeIcon icon={faTimes} className="mr-1" />
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAccountModal;
