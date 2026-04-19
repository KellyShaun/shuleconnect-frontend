import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

function StockTransactions() {
  const [openDialog, setOpenDialog] = useState(false);
  const [transactionType, setTransactionType] = useState('in');
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    item_id: '',
    quantity: '',
    reference_no: '',
    notes: ''
  });

  const [transactions, setTransactions] = useState([
    { id: 1, date: '2024-03-15', item: 'A4 Papers', type: 'in', quantity: 100, reference: 'PO-001', user: 'Store Keeper', notes: 'New stock received' },
    { id: 2, date: '2024-03-15', item: 'Whiteboard Markers', type: 'out', quantity: 20, reference: 'REQ001', user: 'John Kamau', notes: 'Issued to Admin' },
    { id: 3, date: '2024-03-14', item: 'Detergent', type: 'in', quantity: 50, reference: 'PO-002', user: 'Store Keeper', notes: 'Supplier delivery' },
    { id: 4, date: '2024-03-14', item: 'Exercise Books', type: 'out', quantity: 200, reference: 'REQ003', user: 'Peter Otieno', notes: 'Issued to Academic Dept' }
  ]);

  const items = ['A4 Papers', 'Whiteboard Markers', 'Detergent', 'Exercise Books', 'Pens', 'Chalk'];

  const handleSave = () => {
    const newTransaction = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      item: items.find(i => i === formData.item_id) || formData.item_id,
      type: transactionType,
      quantity: parseInt(formData.quantity),
      reference: formData.reference_no,
      user: 'Store Keeper',
      notes: formData.notes
    };
    setTransactions([newTransaction, ...transactions]);
    setSnackbar({ open: true, message: `${transactionType === 'in' ? 'Stock In' : 'Stock Out'} recorded`, severity: 'success' });
    handleClose();
  };

  const handleClose = () => {
    setOpenDialog(false);
    setFormData({ item_id: '', quantity: '', reference_no: '', notes: '' });
  };

  const filteredTransactions = transactions.filter(t =>
    t.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#FF9800', color: 'white' }}>
        <Typography variant="h4" gutterBottom>Stock Transactions</Typography>
        <Typography variant="body1">Record and track all stock movements</Typography>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by item or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon /> }}
            />
          </Grid>
          <Grid item xs={12} sm={7}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)} sx={{ bgcolor: '#FF9800' }}>
                Record Transaction
              </Button>
              <Button variant="outlined" startIcon={<DownloadIcon />}>Export</Button>
              <Button variant="outlined" startIcon={<PrintIcon />}>Print</Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Date</TableCell>
              <TableCell>Item</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell>Reference No</TableCell>
              <TableCell>Recorded By</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id} hover>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.item}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={transaction.type === 'in' ? 'Stock In' : 'Stock Out'} 
                    size="small" 
                    color={transaction.type === 'in' ? 'success' : 'warning'}
                  />
                </TableCell>
                <TableCell align="center">{transaction.quantity}</TableCell>
                <TableCell>{transaction.reference}</TableCell>
                <TableCell>{transaction.user}</TableCell>
                <TableCell>{transaction.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Record Transaction</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Transaction Type</InputLabel>
                <Select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
                  <MenuItem value="in">Stock In (Receive)</MenuItem>
                  <MenuItem value="out">Stock Out (Issue)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Item</InputLabel>
                <Select value={formData.item_id} onChange={(e) => setFormData({ ...formData, item_id: e.target.value })}>
                  {items.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Quantity" type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Reference Number" placeholder="PO number or Requisition No" value={formData.reference_no} onChange={(e) => setFormData({ ...formData, reference_no: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="Notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: '#FF9800' }}>Record</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default StockTransactions;