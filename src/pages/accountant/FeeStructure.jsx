import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

function FeeStructure() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    fee_type: '',
    amount: '',
    class_level: '',
    term: '',
    is_mandatory: true
  });

  const [feeItems, setFeeItems] = useState([
    { id: 1, fee_type: 'Tuition Fee', amount: 25000, class_level: 'All Classes', term: 'Term 1', is_mandatory: true },
    { id: 2, fee_type: 'Activity Fee', amount: 5000, class_level: 'All Classes', term: 'Term 1', is_mandatory: true },
    { id: 3, fee_type: 'Library Fee', amount: 3000, class_level: 'All Classes', term: 'Term 1', is_mandatory: true },
    { id: 4, fee_type: 'Sports Fee', amount: 2000, class_level: 'Form 1-4', term: 'Term 1', is_mandatory: false },
    { id: 5, fee_type: 'Boarding Fee', amount: 15000, class_level: 'Form 1-4', term: 'Term 1', is_mandatory: false }
  ]);

  const feeTypes = ['Tuition Fee', 'Activity Fee', 'Library Fee', 'Sports Fee', 'Boarding Fee', 'Transport Fee', 'Uniform Fee', 'Exam Fee'];
  const classLevels = ['All Classes', 'Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 1-4'];
  const terms = ['Term 1', 'Term 2', 'Term 3'];

  const handleSave = () => {
    if (editingItem) {
      setFeeItems(feeItems.map(item => 
        item.id === editingItem.id ? { ...formData, id: item.id } : item
      ));
      setSnackbar({ open: true, message: 'Fee structure updated', severity: 'success' });
    } else {
      setFeeItems([...feeItems, { ...formData, id: Date.now() }]);
      setSnackbar({ open: true, message: 'Fee added successfully', severity: 'success' });
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this fee item?')) {
      setFeeItems(feeItems.filter(item => item.id !== id));
      setSnackbar({ open: true, message: 'Fee item deleted', severity: 'success' });
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setFormData({
      fee_type: '',
      amount: '',
      class_level: '',
      term: '',
      is_mandatory: true
    });
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#2E7D32', color: 'white' }}>
        <Typography variant="h4" gutterBottom>Fee Structure</Typography>
        <Typography variant="body1">Manage school fee structure and payment categories</Typography>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Fee Items</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
            Add Fee Item
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Fee Type</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Class Level</TableCell>
                <TableCell>Term</TableCell>
                <TableCell align="center">Mandatory</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feeItems.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.fee_type}</TableCell>
                  <TableCell align="right">{formatMoney(item.amount)}</TableCell>
                  <TableCell>{item.class_level}</TableCell>
                  <TableCell>{item.term}</TableCell>
                  <TableCell align="center">
                    <Chip label={item.is_mandatory ? 'Yes' : 'No'} size="small" color={item.is_mandatory ? 'success' : 'default'} />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEdit(item)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingItem ? 'Edit Fee Item' : 'Add Fee Item'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Fee Type</InputLabel>
                <Select
                  value={formData.fee_type}
                  onChange={(e) => setFormData({ ...formData, fee_type: e.target.value })}
                >
                  {feeTypes.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount (KES)"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Class Level</InputLabel>
                <Select
                  value={formData.class_level}
                  onChange={(e) => setFormData({ ...formData, class_level: e.target.value })}
                >
                  {classLevels.map(level => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Term</InputLabel>
                <Select
                  value={formData.term}
                  onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                >
                  {terms.map(term => (
                    <MenuItem key={term} value={term}>{term}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} startIcon={<CancelIcon />}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} startIcon={<SaveIcon />}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default FeeStructure;