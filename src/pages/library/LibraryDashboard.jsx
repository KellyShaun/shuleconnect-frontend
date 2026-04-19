import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tabs,
  Tab,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  LinearProgress,
  Alert,
  Snackbar,
  Tooltip,
  Divider
} from '@mui/material';
import {
  MenuBook as BookIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  LibraryBooks as LibraryIcon,
  Receipt as ReceiptIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  QrCode as QrCodeIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../services/api';

function LibrarianDashboard() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({
    totalBooks: 0,
    booksBorrowed: 0,
    booksAvailable: 0,
    overdueBooks: 0,
    activeMembers: 0,
    totalBorrowers: 0,
    popularGenre: '',
    dailyVisitors: 0
  });
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [openBookDialog, setOpenBookDialog] = useState(false);
  const [openBorrowDialog, setOpenBorrowDialog] = useState(false);
  const [openReturnDialog, setOpenReturnDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    publisher: '',
    year: '',
    copies: 1,
    location: ''
  });
  const [borrowForm, setBorrowForm] = useState({
    memberId: '',
    bookId: '',
    dueDate: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const categories = ['Fiction', 'Non-Fiction', 'Science', 'Mathematics', 'History', 'Geography', 'Literature', 'Reference', 'Children', 'Magazine'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, booksRes, borrowedRes, overdueRes, membersRes, activityRes, popularRes] = await Promise.all([
        api.get('/librarian/stats'),
        api.get('/librarian/books'),
        api.get('/librarian/borrowed'),
        api.get('/librarian/overdue'),
        api.get('/librarian/members'),
        api.get('/librarian/recent-activity'),
        api.get('/librarian/popular-books')
      ]);
      
      setStats(statsRes.data);
      setBooks(booksRes.data);
      setBorrowedBooks(borrowedRes.data);
      setOverdueBooks(overdueRes.data);
      setMembers(membersRes.data);
      setRecentActivity(activityRes.data);
      setPopularBooks(popularRes.data);
    } catch (error) {
      console.error('Error fetching library data:', error);
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    setStats({
      totalBooks: 5432,
      booksBorrowed: 234,
      booksAvailable: 5198,
      overdueBooks: 45,
      activeMembers: 1250,
      totalBorrowers: 890,
      popularGenre: 'Fiction',
      dailyVisitors: 87
    });

    setBooks([
      { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0-7432-7356-5', category: 'Fiction', copies: 5, available: 3, location: 'A-12' },
      { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0-06-112008-4', category: 'Fiction', copies: 4, available: 2, location: 'A-15' },
      { id: 3, title: '1984', author: 'George Orwell', isbn: '978-0-452-28423-4', category: 'Fiction', copies: 6, available: 4, location: 'B-03' },
      { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0-14-143951-8', category: 'Classic', copies: 3, available: 1, location: 'C-08' }
    ]);

    setBorrowedBooks([
      { id: 1, bookTitle: 'The Great Gatsby', borrower: 'John Kamau', borrowDate: '2024-03-01', dueDate: '2024-03-15', status: 'borrowed' },
      { id: 2, bookTitle: '1984', borrower: 'Mary Wanjiku', borrowDate: '2024-03-05', dueDate: '2024-03-19', status: 'borrowed' }
    ]);

    setOverdueBooks([
      { id: 1, bookTitle: 'To Kill a Mockingbird', borrower: 'James Otieno', borrowDate: '2024-02-15', dueDate: '2024-02-29', daysOverdue: 16 },
      { id: 2, bookTitle: 'Pride and Prejudice', borrower: 'Sarah Muthoni', borrowDate: '2024-02-20', dueDate: '2024-03-05', daysOverdue: 11 }
    ]);
  };

  const handleAddBook = async () => {
    try {
      await api.post('/librarian/books', formData);
      setSnackbar({ open: true, message: 'Book added successfully!', severity: 'success' });
      setOpenBookDialog(false);
      fetchDashboardData();
      setFormData({ title: '', author: '', isbn: '', category: '', publisher: '', year: '', copies: 1, location: '' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error adding book', severity: 'error' });
    }
  };

  const handleBorrowBook = async () => {
    try {
      await api.post('/librarian/borrow', borrowForm);
      setSnackbar({ open: true, message: 'Book borrowed successfully!', severity: 'success' });
      setOpenBorrowDialog(false);
      fetchDashboardData();
      setBorrowForm({ memberId: '', bookId: '', dueDate: '' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error borrowing book', severity: 'error' });
    }
  };

  const handleReturnBook = async (borrowId) => {
    try {
      await api.post(`/librarian/return/${borrowId}`);
      setSnackbar({ open: true, message: 'Book returned successfully!', severity: 'success' });
      fetchDashboardData();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error returning book', severity: 'error' });
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/librarian/books/${bookId}`);
        setSnackbar({ open: true, message: 'Book deleted successfully!', severity: 'success' });
        fetchDashboardData();
      } catch (error) {
        setSnackbar({ open: true, message: 'Error deleting book', severity: 'error' });
      }
    }
  };

  const pieData = [
    { name: 'Available', value: stats.booksAvailable, color: '#4CAF50' },
    { name: 'Borrowed', value: stats.booksBorrowed, color: '#FF9800' },
    { name: 'Overdue', value: stats.overdueBooks, color: '#F44336' }
  ];

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm)
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#2E7D32', color: 'white' }}>
        <Typography variant="h4" gutterBottom>Library Management Dashboard</Typography>
        <Typography variant="body1">Manage books, track borrowings, and monitor library activities</Typography>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>Total Books</Typography>
                  <Typography variant="h3">{stats.totalBooks}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#4CAF50', width: 56, height: 56 }}>
                  <LibraryIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="body2" color="textSecondary">Available: {stats.booksAvailable}</Typography>
                <Typography variant="body2" color="textSecondary">Borrowed: {stats.booksBorrowed}</Typography>
              </Box>
              <LinearProgress variant="determinate" value={(stats.booksAvailable / stats.totalBooks) * 100} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>Overdue Books</Typography>
                  <Typography variant="h3" sx={{ color: '#F44336' }}>{stats.overdueBooks}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#F44336', width: 56, height: 56 }}>
                  <WarningIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>Active Members</Typography>
                  <Typography variant="h3">{stats.activeMembers}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#2196F3', width: 56, height: 56 }}>
                  <PersonIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>Daily Visitors</Typography>
                  <Typography variant="h3">{stats.dailyVisitors}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#FF9800', width: 56, height: 56 }}>
                  <TrendingUpIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Library Collection Status</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Popular Books This Month</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Book Title</TableCell>
                    <TableCell align="center">Times Borrowed</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {popularBooks.map((book, index) => (
                    <TableRow key={index}>
                      <TableCell>{book.title}</TableCell>
                      <TableCell align="center">
                        <Chip label={`${book.count} times`} size="small" color="primary" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label="Books Catalog" />
          <Tab label="Borrowed Books" />
          <Tab label="Overdue Books" />
          <Tab label="Members" />
          <Tab label="Activity Log" />
        </Tabs>

        {/* Books Catalog Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, gap: 2, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: 300 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenBookDialog(true)}>
                Add New Book
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>ISBN</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="center">Copies</TableCell>
                    <TableCell align="center">Available</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>{book.isbn}</TableCell>
                      <TableCell>
                        <Chip label={book.category} size="small" />
                      </TableCell>
                      <TableCell align="center">{book.copies}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={book.available} 
                          size="small" 
                          color={book.available > 0 ? 'success' : 'error'}
                        />
                      </TableCell>
                      <TableCell>{book.location}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Borrow">
                          <IconButton size="small" color="primary" onClick={() => {
                            setBorrowForm({ ...borrowForm, bookId: book.id });
                            setOpenBorrowDialog(true);
                          }}>
                            <ReceiptIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDeleteBook(book.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Borrowed Books Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Book Title</TableCell>
                    <TableCell>Borrower</TableCell>
                    <TableCell>Borrow Date</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {borrowedBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>{book.bookTitle}</TableCell>
                      <TableCell>{book.borrower}</TableCell>
                      <TableCell>{book.borrowDate}</TableCell>
                      <TableCell>{book.dueDate}</TableCell>
                      <TableCell>
                        <Chip label={book.status} size="small" color="warning" />
                      </TableCell>
                      <TableCell align="center">
                        <Button size="small" variant="outlined" onClick={() => handleReturnBook(book.id)}>
                          Return
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Overdue Books Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 2 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              {overdueBooks.length} books are overdue. Please contact the borrowers.
            </Alert>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Book Title</TableCell>
                    <TableCell>Borrower</TableCell>
                    <TableCell>Borrow Date</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Days Overdue</TableCell>
                    <TableCell align="center">Fine</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {overdueBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>{book.bookTitle}</TableCell>
                      <TableCell>{book.borrower}</TableCell>
                      <TableCell>{book.borrowDate}</TableCell>
                      <TableCell>{book.dueDate}</TableCell>
                      <TableCell>
                        <Chip label={`${book.daysOverdue} days`} size="small" color="error" />
                      </TableCell>
                      <TableCell align="center">
                        KES {book.daysOverdue * 20}
                      </TableCell>
                      <TableCell align="center">
                        <Button size="small" variant="contained" color="warning" onClick={() => handleReturnBook(book.id)}>
                          Process Return
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Members Tab */}
        {activeTab === 3 && (
          <Box sx={{ p: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Member Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Member Type</TableCell>
                    <TableCell align="center">Books Borrowed</TableCell>
                    <TableCell>Joined Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.phone}</TableCell>
                      <TableCell>
                        <Chip label={member.type} size="small" />
                      </TableCell>
                      <TableCell align="center">{member.booksBorrowed}</TableCell>
                      <TableCell>{member.joinedDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Activity Log Tab */}
        {activeTab === 4 && (
          <Box sx={{ p: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Activity</TableCell>
                    <TableCell>Book</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentActivity.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{activity.date}</TableCell>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell>{activity.bookTitle}</TableCell>
                      <TableCell>{activity.user}</TableCell>
                      <TableCell>
                        <Chip label={activity.status} size="small" color="success" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Paper>

      {/* Quick Actions */}
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Button fullWidth variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#2E7D32' }} onClick={() => setOpenBookDialog(true)}>
            Add Book
          </Button>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Button fullWidth variant="contained" startIcon={<ReceiptIcon />} sx={{ bgcolor: '#2196F3' }} onClick={() => setOpenBorrowDialog(true)}>
            Borrow Book
          </Button>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Button fullWidth variant="outlined" startIcon={<DownloadIcon />}>
            Export Report
          </Button>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Button fullWidth variant="outlined" startIcon={<RefreshIcon />} onClick={fetchDashboardData}>
            Refresh
          </Button>
        </Grid>
      </Grid>

      {/* Add Book Dialog */}
      <Dialog open={openBookDialog} onClose={() => setOpenBookDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Book</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Author" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="ISBN" value={formData.isbn} onChange={(e) => setFormData({ ...formData, isbn: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Publisher" value={formData.publisher} onChange={(e) => setFormData({ ...formData, publisher: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Year" type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Number of Copies" type="number" value={formData.copies} onChange={(e) => setFormData({ ...formData, copies: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Shelf Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBookDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddBook}>Add Book</Button>
        </DialogActions>
      </Dialog>

      {/* Borrow Book Dialog */}
      <Dialog open={openBorrowDialog} onClose={() => setOpenBorrowDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Borrow Book</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Member</InputLabel>
                <Select value={borrowForm.memberId} onChange={(e) => setBorrowForm({ ...borrowForm, memberId: e.target.value })}>
                  {members.map(member => (
                    <MenuItem key={member.id} value={member.id}>{member.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Book</InputLabel>
                <Select value={borrowForm.bookId} onChange={(e) => setBorrowForm({ ...borrowForm, bookId: e.target.value })}>
                  {books.filter(b => b.available > 0).map(book => (
                    <MenuItem key={book.id} value={book.id}>{book.title} ({book.available} available)</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Due Date" type="date" InputLabelProps={{ shrink: true }} value={borrowForm.dueDate} onChange={(e) => setBorrowForm({ ...borrowForm, dueDate: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBorrowDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleBorrowBook}>Borrow Book</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default LibrarianDashboard;