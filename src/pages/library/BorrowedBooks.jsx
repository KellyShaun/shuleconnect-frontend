import React, { useState, useEffect } from 'react';
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
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Receipt as ReceiptIcon,
  CheckCircle as ReturnIcon,
  Warning as WarningIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../../services/api';

function BorrowedBooks() {
  const [loading, setLoading] = useState(false);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openReturnDialog, setOpenReturnDialog] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [fineAmount, setFineAmount] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [searchTerm, borrowedBooks]);

  const fetchBorrowedBooks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/librarian/borrowed');
      setBorrowedBooks(response.data);
      setFilteredBooks(response.data);
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
      setSnackbar({ open: true, message: 'Error fetching borrowed books', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    if (!searchTerm) {
      setFilteredBooks(borrowedBooks);
    } else {
      const filtered = borrowedBooks.filter(book =>
        book.book_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.borrower.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  };

  const handleReturn = async () => {
    try {
      await api.post(`/librarian/return/${selectedLoan.id}`, { fine_amount: fineAmount });
      setSnackbar({ open: true, message: 'Book returned successfully', severity: 'success' });
      setOpenReturnDialog(false);
      fetchBorrowedBooks();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error returning book', severity: 'error' });
    }
  };

  const calculateFine = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    if (today > due) {
      const daysOverdue = Math.floor((today - due) / (1000 * 60 * 60 * 24));
      return daysOverdue * 20; // KES 20 per day
    }
    return 0;
  };

  const openReturnDialogHandler = (loan) => {
    setSelectedLoan(loan);
    const fine = calculateFine(loan.due_date);
    setFineAmount(fine);
    setOpenReturnDialog(true);
  };

  const getStatusChip = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    if (today > due) {
      return <Chip label="Overdue" size="small" color="error" icon={<WarningIcon />} />;
    }
    return <Chip label="On Time" size="small" color="success" />;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, mb: 3, bgcolor: '#2E7D32', color: 'white' }}>
          <Typography variant="h4" gutterBottom>Borrowed Books</Typography>
          <Typography variant="body1">Track and manage borrowed books</Typography>
        </Paper>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by book title or borrower..."
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
                <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchBorrowedBooks}>
                  Refresh
                </Button>
                <Button variant="outlined" startIcon={<PrintIcon />}>
                  Print Report
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Book Title</TableCell>
                <TableCell>Borrower</TableCell>
                <TableCell>Borrow Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Fine (KES)</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center"><CircularProgress /></TableCell>
                </TableRow>
              ) : filteredBooks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">No borrowed books found</TableCell>
                </TableRow>
              ) : (
                filteredBooks.map((book) => (
                  <TableRow key={book.id} hover>
                    <TableCell>{book.book_title}</TableCell>
                    <TableCell>{book.borrower}</TableCell>
                    <TableCell>{book.borrow_date}</TableCell>
                    <TableCell>{book.due_date}</TableCell>
                    <TableCell>{getStatusChip(book.due_date)}</TableCell>
                    <TableCell align="center">{calculateFine(book.due_date)}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Return Book">
                        <Button size="small" variant="contained" color="primary" onClick={() => openReturnDialogHandler(book)}>
                          <ReturnIcon sx={{ mr: 1 }} /> Return
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openReturnDialog} onClose={() => setOpenReturnDialog(false)}>
          <DialogTitle>Return Book</DialogTitle>
          <DialogContent>
            <Box sx={{ p: 2 }}>
              <Typography><strong>Book:</strong> {selectedLoan?.book_title}</Typography>
              <Typography><strong>Borrower:</strong> {selectedLoan?.borrower}</Typography>
              <Typography><strong>Due Date:</strong> {selectedLoan?.due_date}</Typography>
              <Typography><strong>Fine Amount:</strong> KES {fineAmount}</Typography>
              {fineAmount > 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  This book is overdue. Fine of KES {fineAmount} applies.
                </Alert>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenReturnDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleReturn}>Confirm Return</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}

export default BorrowedBooks;