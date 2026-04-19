import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as ReturnIcon,
  QrCodeScanner as ScanIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import api from '../../services/api';

function ReturnBooks() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [borrowedBook, setBorrowedBook] = useState(null);
  const [fineAmount, setFineAmount] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const searchBook = async () => {
    if (!searchTerm) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/librarian/search-borrowed/${searchTerm}`);
      if (response.data) {
        setBorrowedBook(response.data);
        calculateFine(response.data.due_date);
      } else {
        setBorrowedBook(null);
        setSnackbar({ open: true, message: 'Book not found or not borrowed', severity: 'warning' });
      }
    } catch (error) {
      console.error('Error searching book:', error);
      setBorrowedBook(null);
      setSnackbar({ open: true, message: 'Book not found', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const calculateFine = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    if (today > due) {
      const daysOverdue = Math.floor((today - due) / (1000 * 60 * 60 * 24));
      setFineAmount(daysOverdue * 20);
    } else {
      setFineAmount(0);
    }
  };

  const handleReturn = async () => {
    try {
      await api.post(`/librarian/return/${borrowedBook.id}`, { fine_amount: fineAmount });
      setSnackbar({ open: true, message: 'Book returned successfully!', severity: 'success' });
      setBorrowedBook(null);
      setSearchTerm('');
    } catch (error) {
      setSnackbar({ open: true, message: 'Error returning book', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#2E7D32', color: 'white' }}>
        <Typography variant="h4" gutterBottom>Return Books</Typography>
        <Typography variant="body1">Scan or search for books to process returns</Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Find Borrowed Book</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Enter Book ISBN, Title or Borrower Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchBook()}
              />
              <Button variant="contained" onClick={searchBook} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : <SearchIcon />}
              </Button>
            </Box>

            {borrowedBook && (
              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#FF9800', width: 56, height: 56 }}>
                      <ReturnIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{borrowedBook.book_title}</Typography>
                      <Typography variant="body2" color="textSecondary">by {borrowedBook.author}</Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary">Borrower</Typography>
                      <Typography variant="body2">{borrowedBook.borrower}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary">Borrow Date</Typography>
                      <Typography variant="body2">{borrowedBook.borrow_date}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary">Due Date</Typography>
                      <Typography variant="body2">{borrowedBook.due_date}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary">Status</Typography>
                      <Chip 
                        label={fineAmount > 0 ? 'Overdue' : 'On Time'} 
                        size="small" 
                        color={fineAmount > 0 ? 'error' : 'success'} 
                      />
                    </Grid>
                  </Grid>
                  
                  {fineAmount > 0 && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      This book is overdue by {Math.floor((new Date() - new Date(borrowedBook.due_date)) / (1000 * 60 * 60 * 24))} days.
                      Fine: KES {fineAmount}
                    </Alert>
                  )}
                  
                  <Button 
                    fullWidth 
                    variant="contained" 
                    color="primary" 
                    onClick={handleReturn}
                    sx={{ mt: 2 }}
                  >
                    Confirm Return
                  </Button>
                </CardContent>
              </Card>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Quick Scan</Typography>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <ScanIcon sx={{ fontSize: 80, color: '#2E7D32', mb: 2 }} />
              <Typography variant="body2" color="textSecondary">
                Use a barcode scanner to quickly find books by ISBN
              </Typography>
              <Button variant="outlined" sx={{ mt: 2 }} startIcon={<RefreshIcon />}>
                Connect Scanner
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default ReturnBooks;