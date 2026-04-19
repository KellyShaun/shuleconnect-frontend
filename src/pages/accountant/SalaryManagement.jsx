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
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon
} from '@mui/icons-material';

function SalaryManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSalary, setEditingSalary] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(2024);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    staff_id: '',
    staff_name: '',
    role: '',
    basic_salary: '',
    allowance: '',
    bonus: '',
    deductions: '',
    net_salary: '',
    payment_method: 'Bank Transfer',
    bank_account: '',
    month: new Date().getMonth(),
    year: 2024
  });

  const [staffSalaries, setStaffSalaries] = useState([
    { id: 1, staff_name: 'John Odhiambo', role: 'Senior Teacher', basic_salary: 80000, allowance: 15000, bonus: 5000, deductions: 10000, net_salary: 90000, status: 'paid', payment_date: '2024-03-28' },
    { id: 2, staff_name: 'Mary Wanjiku', role: 'Teacher', basic_salary: 60000, allowance: 10000, bonus: 3000, deductions: 8000, net_salary: 65000, status: 'paid', payment_date: '2024-03-28' },
    { id: 3, staff_name: 'Peter Otieno', role: 'Teacher', basic_salary: 55000, allowance: 10000, bonus: 2000, deductions: 7000, net_salary: 60000, status: 'pending', payment_date: null },
    { id: 4, staff_name: 'Grace Muthoni', role: 'Accountant', basic_salary: 70000, allowance: 12000, bonus: 4000, deductions: 9000, net_salary: 77000, status: 'paid', payment_date: '2024-03-28' },
    { id: 5, staff_name: 'James Kariuki', role: 'Support Staff', basic_salary: 30000, allowance: 5000, bonus: 1000, deductions: 4000, net_salary: 32000, status: 'pending', payment_date: null }
  ]);

  const salarySummary = {
    total_payroll: staffSalaries.reduce((sum, s) => sum + s.net_salary, 0),
    paid_amount: staffSalaries.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.net_salary, 0),
    pending_amount: staffSalaries.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.net_salary, 0),
    total_staff: staffSalaries.length,
    paid_staff: staffSalaries.filter(s => s.status === 'paid').length
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleSave = () => {
    const netSalary = (parseFloat(formData.basic_salary) + parseFloat(formData.allowance) + parseFloat(formData.bonus)) - parseFloat(formData.deductions);
    const newData = { ...formData, net_salary: netSalary, id: editingSalary?.id || Date.now() };
    
    if (editingSalary) {
      setStaffSalaries(staffSalaries.map(s => s.id === editingSalary.id ? newData : s));
      setSnackbar({ open: true, message: 'Salary record updated', severity: 'success' });
    } else {
      setStaffSalaries([...staffSalaries, newData]);
      setSnackbar({ open: true, message: 'Salary record added', severity: 'success' });
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this salary record?')) {
      setStaffSalaries(staffSalaries.filter(s => s.id !== id));
      setSnackbar({ open: true, message: 'Salary record deleted', severity: 'success' });
    }
  };

  const handleProcessPayment = (id) => {
    setStaffSalaries(staffSalaries.map(s => 
      s.id === id ? { ...s, status: 'paid', payment_date: new Date().toISOString().split('T')[0] } : s
    ));
    setSnackbar({ open: true, message: 'Payment processed successfully', severity: 'success' });
  };

  const handleClose = () => {
    setOpenDialog(false);
    setEditingSalary(null);
    setFormData({
      staff_id: '',
      staff_name: '',
      role: '',
      basic_salary: '',
      allowance: '',
      bonus: '',
      deductions: '',
      net_salary: '',
      payment_method: 'Bank Transfer',
      bank_account: '',
      month: selectedMonth,
      year: selectedYear
    });
  };

  const calculateNetSalary = () => {
    const basic = parseFloat(formData.basic_salary) || 0;
    const allowance = parseFloat(formData.allowance) || 0;
    const bonus = parseFloat(formData.bonus) || 0;
    const deductions = parseFloat(formData.deductions) || 0;
    return basic + allowance + bonus - deductions;
  };

  const filteredSalaries = staffSalaries.filter(s =>
    s.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#2E7D32', color: 'white' }}>
        <Typography variant="h4" gutterBottom>Salary Management</Typography>
        <Typography variant="body1">Manage staff salaries and payroll processing</Typography>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <Card sx={{ bgcolor: '#E3F2FD' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Payroll</Typography>
              <Typography variant="h5">{formatMoney(salarySummary.total_payroll)}</Typography>
              <Typography variant="caption">All staff</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card sx={{ bgcolor: '#E8F5E9' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Paid Amount</Typography>
              <Typography variant="h5" sx={{ color: '#4CAF50' }}>{formatMoney(salarySummary.paid_amount)}</Typography>
              <Typography variant="caption">{salarySummary.paid_staff} staff paid</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card sx={{ bgcolor: '#FFEBEE' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Pending Amount</Typography>
              <Typography variant="h5" sx={{ color: '#F44336' }}>{formatMoney(salarySummary.pending_amount)}</Typography>
              <Typography variant="caption">{salarySummary.total_staff - salarySummary.paid_staff} staff pending</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card sx={{ bgcolor: '#FFF3E0' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Collection Rate</Typography>
              <Typography variant="h5">{((salarySummary.paid_amount / salarySummary.total_payroll) * 100).toFixed(1)}%</Typography>
              <LinearProgress variant="determinate" value={(salarySummary.paid_amount / salarySummary.total_payroll) * 100} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by staff name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon /> }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Month</InputLabel>
              <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                <MenuItem value={0}>January</MenuItem>
                <MenuItem value={1}>February</MenuItem>
                <MenuItem value={2}>March</MenuItem>
                <MenuItem value={3}>April</MenuItem>
                <MenuItem value={4}>May</MenuItem>
                <MenuItem value={5}>June</MenuItem>
                <MenuItem value={6}>July</MenuItem>
                <MenuItem value={7}>August</MenuItem>
                <MenuItem value={8}>September</MenuItem>
                <MenuItem value={9}>October</MenuItem>
                <MenuItem value={10}>November</MenuItem>
                <MenuItem value={11}>December</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Year</InputLabel>
              <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                <MenuItem value={2023}>2023</MenuItem>
                <MenuItem value={2024}>2024</MenuItem>
                <MenuItem value={2025}>2025</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button fullWidth variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
              Add Salary
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Salary Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Staff Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Basic Salary</TableCell>
              <TableCell align="right">Allowance</TableCell>
              <TableCell align="right">Bonus</TableCell>
              <TableCell align="right">Deductions</TableCell>
              <TableCell align="right">Net Salary</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSalaries.map((salary) => (
              <TableRow key={salary.id} hover>
                <TableCell>{salary.staff_name}</TableCell>
                <TableCell>{salary.role}</TableCell>
                <TableCell align="right">{formatMoney(salary.basic_salary)}</TableCell>
                <TableCell align="right">{formatMoney(salary.allowance)}</TableCell>
                <TableCell align="right">{formatMoney(salary.bonus)}</TableCell>
                <TableCell align="right" sx={{ color: '#F44336' }}>{formatMoney(salary.deductions)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatMoney(salary.net_salary)}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={salary.status} 
                    size="small" 
                    color={salary.status === 'paid' ? 'success' : 'warning'} 
                  />
                </TableCell>
                <TableCell align="center">
                  {salary.status === 'pending' && (
                    <Tooltip title="Process Payment">
                      <IconButton size="small" color="primary" onClick={() => handleProcessPayment(salary.id)}>
                        <PaymentIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => { setEditingSalary(salary); setFormData(salary); setOpenDialog(true); }}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDelete(salary.id)}>
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
        <DialogTitle>{editingSalary ? 'Edit Salary Record' : 'Add New Salary Record'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Staff Name" value={formData.staff_name} onChange={(e) => setFormData({ ...formData, staff_name: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Role/Position" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Basic Salary (KES)" type="number" value={formData.basic_salary} onChange={(e) => setFormData({ ...formData, basic_salary: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Allowances (KES)" type="number" value={formData.allowance} onChange={(e) => setFormData({ ...formData, allowance: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Bonus (KES)" type="number" value={formData.bonus} onChange={(e) => setFormData({ ...formData, bonus: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Deductions (KES)" type="number" value={formData.deductions} onChange={(e) => setFormData({ ...formData, deductions: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                Net Salary: <strong>{formatMoney(calculateNetSalary())}</strong>
              </Alert>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select value={formData.payment_method} onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Cheque">Cheque</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Bank Account Number" value={formData.bank_account} onChange={(e) => setFormData({ ...formData, bank_account: e.target.value })} />
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

export default SalaryManagement;