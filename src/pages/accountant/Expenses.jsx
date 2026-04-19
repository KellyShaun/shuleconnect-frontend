import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
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
  IconButton,
  Chip,
  Tooltip,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Receipt as ReceiptIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function Expenses() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    payment_method: 'Cash',
    receipt: '',
    vendor: '',
    notes: ''
  });

  const [expenses, setExpenses] = useState([
    { id: 1, category: 'Salaries', description: 'Teacher Salaries - March', amount: 350000, date: '2024-03-15', payment_method: 'Bank Transfer', vendor: 'Staff', status: 'paid' },
    { id: 2, category: 'Stationery', description: 'Office Stationery', amount: 25000, date: '2024-03-10', payment_method: 'Cash', vendor: 'Stationery Mart', status: 'paid' },
    { id: 3, category: 'Maintenance', description: 'Classroom Repairs', amount: 45000, date: '2024-03-05', payment_method: 'M-Pesa', vendor: 'Maintenance Co', status: 'paid' },
    { id: 4, category: 'Utilities', description: 'Electricity Bill', amount: 18000, date: '2024-03-01', payment_method: 'Bank Transfer', vendor: 'KPLC', status: 'paid' },
    { id: 5, category: 'Transport', description: 'Bus Fuel', amount: 30000, date: '2024-02-28', payment_method: 'Cash', vendor: 'Fuel Station', status: 'paid' },
    { id: 6, category: 'Salaries', description: 'Support Staff Salaries', amount: 150000, date: '2024-02-28', payment_method: 'Bank Transfer', vendor: 'Staff', status: 'paid' }
  ]);

  const categories = ['Salaries', 'Stationery', 'Maintenance', 'Utilities', 'Transport', 'Equipment', 'Marketing', 'Other'];

  const categoryData = categories.map(cat => ({
    name: cat,
    amount: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
  })).filter(c => c.amount > 0);

  const monthlyData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => ({
    month,
    amount: expenses.filter(e => new Date(e.date).getMonth() === index).reduce((sum, e) => sum + e.amount, 0)
  }));

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const topCategory = categoryData.length > 0 ? categoryData.reduce((max, cat) => cat.amount > max.amount ? cat : max, categoryData[0]) : { name: 'N/A', amount: 0 };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleSave = () => {
    if (editingExpense) {
      setExpenses(expenses.map(e => e.id === editingExpense.id ? { ...formData, id: e.id, status: 'paid' } : e));
      setSnackbar({ open: true, message: 'Expense updated', severity: 'success' });
    } else {
      setExpenses([...expenses, { ...formData, id: Date.now(), status: 'paid' }]);
      setSnackbar({ open: true, message: 'Expense added', severity: 'success' });
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(expenses.filter(e => e.id !== id));
      setSnackbar({ open: true, message: 'Expense deleted', severity: 'success' });
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setEditingExpense(null);
    setFormData({
      category: '',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      payment_method: 'Cash',
      receipt: '',
      vendor: '',
      notes: ''
    });
  };

  const filteredExpenses = expenses.filter(e =>
    e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0', '#00BCD4', '#FFC107', '#795548'];

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#2E7D32', color: 'white' }}>
        <Typography variant="h4" gutterBottom>Expenses Management</Typography>
        <Typography variant="body1">Track and manage all school expenses</Typography>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#E3F2FD' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Expenses</Typography>
              <Typography variant="h4">{formatMoney(totalExpenses)}</Typography>
              <Typography variant="caption">Year to date</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#FFF3E0' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Top Expense Category</Typography>
              <Typography variant="h4">{topCategory.name || 'N/A'}</Typography>
              <Typography variant="caption">{formatMoney(topCategory.amount)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#E8F5E9' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>This Month</Typography>
              <Typography variant="h4">{formatMoney(monthlyData[2]?.amount || 0)}</Typography>
              <Typography variant="caption">March 2024</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Monthly Expenses Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                <ChartTooltip formatter={(value) => formatMoney(value)} />
                <Bar dataKey="amount" fill="#F44336" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Expenses by Category</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip formatter={(value) => formatMoney(value)} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Actions */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon /> }}
            />
          </Grid>
          <Grid item xs={12} sm={7}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
                Add Expense
              </Button>
              <Button variant="outlined" startIcon={<DownloadIcon />}>Export</Button>
              <Button variant="outlined" startIcon={<PrintIcon />}>Print</Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Expenses Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExpenses.map((expense) => (
              <TableRow key={expense.id} hover>
                <TableCell>{expense.date}</TableCell>
                <TableCell>
                  <Chip label={expense.category} size="small" />
                </TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>{expense.vendor}</TableCell>
                <TableCell align="right" sx={{ color: '#F44336', fontWeight: 'bold' }}>
                  {formatMoney(expense.amount)}
                </TableCell>
                <TableCell>{expense.payment_method}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => { setEditingExpense(expense); setFormData(expense); setOpenDialog(true); }}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDelete(expense.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Amount (KES)" type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select value={formData.payment_method} onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}>
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  <MenuItem value="M-Pesa">M-Pesa</MenuItem>
                  <MenuItem value="Cheque">Cheque</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Vendor/Supplier" value={formData.vendor} onChange={(e) => setFormData({ ...formData, vendor: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Receipt/Invoice No" value={formData.receipt} onChange={(e) => setFormData({ ...formData, receipt: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="Notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default Expenses;