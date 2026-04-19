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
  TextField,
  InputAdornment,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

function FeeCollection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: 'M-Pesa',
    reference: '',
    notes: ''
  });

  const [students] = useState([
    { id: 1, name: 'John Kamau', admission_no: 'STU2024001', class: 'Form 4A', total_fees: 45000, paid: 45000, balance: 0, status: 'paid' },
    { id: 2, name: 'Mary Wanjiku', admission_no: 'STU2024002', class: 'Form 4A', total_fees: 45000, paid: 30000, balance: 15000, status: 'partial' },
    { id: 3, name: 'James Otieno', admission_no: 'STU2024003', class: 'Form 3B', total_fees: 45000, paid: 20000, balance: 25000, status: 'partial' },
    { id: 4, name: 'Sarah Muthoni', admission_no: 'STU2024004', class: 'Form 3B', total_fees: 45000, paid: 0, balance: 45000, status: 'unpaid' },
    { id: 5, name: 'Peter Maina', admission_no: 'STU2024005', class: 'Form 2C', total_fees: 45000, paid: 45000, balance: 0, status: 'paid' }
  ]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admission_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paymentMethods = ['M-Pesa', 'Bank Transfer', 'Cash', 'Cheque'];

  const handleRecordPayment = (student) => {
    setSelectedStudent(student);
    setPaymentData({ amount: '', method: 'M-Pesa', reference: '', notes: '' });
    setOpenPaymentDialog(true);
  };

  const handleSubmitPayment = () => {
    setSnackbar({ open: true, message: `Payment of KES ${paymentData.amount} recorded for ${selectedStudent.name}`, severity: 'success' });
    setOpenPaymentDialog(false);
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusChip = (status) => {
    switch(status) {
      case 'paid':
        return <Chip label="Paid" size="small" color="success" icon={<CheckIcon />} />;
      case 'partial':
        return <Chip label="Partial" size="small" color="warning" />;
      case 'unpaid':
        return <Chip label="Unpaid" size="small" color="error" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#2E7D32', color: 'white' }}>
        <Typography variant="h4" gutterBottom>Fee Collection</Typography>
        <Typography variant="body1">Record and manage student fee payments</Typography>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by student name or admission number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button variant="outlined" startIcon={<DownloadIcon />}>Export</Button>
              <Button variant="outlined" startIcon={<PrintIcon />}>Print Report</Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Admission No</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Class</TableCell>
              <TableCell align="right">Total Fees</TableCell>
              <TableCell align="right">Paid</TableCell>
              <TableCell align="right">Balance</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id} hover>
                <TableCell>{student.admission_no}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell align="right">{formatMoney(student.total_fees)}</TableCell>
                <TableCell align="right" sx={{ color: '#4CAF50' }}>{formatMoney(student.paid)}</TableCell>
                <TableCell align="right" sx={{ color: student.balance > 0 ? '#F44336' : '#4CAF50' }}>
                  {formatMoney(student.balance)}
                </TableCell>
                <TableCell align="center">{getStatusChip(student.status)}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Record Payment">
                    <IconButton size="small" color="primary" onClick={() => handleRecordPayment(student)}>
                      <PaymentIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View History">
                    <IconButton size="small">
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Print Receipt">
                    <IconButton size="small">
                      <ReceiptIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Record Payment</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">{selectedStudent?.name}</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Admission: {selectedStudent?.admission_no} | Class: {selectedStudent?.class}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Outstanding Balance: <strong style={{ color: '#F44336' }}>{formatMoney(selectedStudent?.balance)}</strong>
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Amount (KES)"
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={paymentData.method}
                    onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value })}
                  >
                    {paymentMethods.map(method => (
                      <MenuItem key={method} value={method}>{method}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Transaction Reference"
                  placeholder="M-Pesa code or cheque number"
                  value={paymentData.reference}
                  onChange={(e) => setPaymentData({ ...paymentData, reference: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Notes"
                  placeholder="Additional payment notes"
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaymentDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitPayment}>Record Payment</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default FeeCollection;