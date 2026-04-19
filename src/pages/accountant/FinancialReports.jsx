import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Download as DownloadIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer } from 'recharts';

function FinancialReports() {
  const [reportType, setReportType] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [incomeData] = useState([
    { month: 'Jan', income: 850000, expenses: 450000, profit: 400000 },
    { month: 'Feb', income: 920000, expenses: 480000, profit: 440000 },
    { month: 'Mar', income: 1100000, expenses: 500000, profit: 600000 },
    { month: 'Apr', income: 780000, expenses: 470000, profit: 310000 },
    { month: 'May', income: 950000, expenses: 490000, profit: 460000 },
    { month: 'Jun', income: 1050000, expenses: 520000, profit: 530000 }
  ]);

  const [transactions] = useState([
    { id: 1, date: '2024-03-15', description: 'Fee Payment - John Kamau', type: 'Income', amount: 45000, category: 'Tuition Fee' },
    { id: 2, date: '2024-03-14', description: 'Salary Payment - Teachers', type: 'Expense', amount: 350000, category: 'Salaries' },
    { id: 3, date: '2024-03-14', description: 'Fee Payment - Mary Wanjiku', type: 'Income', amount: 45000, category: 'Tuition Fee' },
    { id: 4, date: '2024-03-13', description: 'Stationery Purchase', type: 'Expense', amount: 25000, category: 'Supplies' },
    { id: 5, date: '2024-03-12', description: 'Fee Payment - James Otieno', type: 'Income', amount: 45000, category: 'Tuition Fee' }
  ]);

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#2E7D32', color: 'white' }}>
        <Typography variant="h4" gutterBottom>Financial Reports</Typography>
        <Typography variant="body1">Generate and view financial reports</Typography>
      </Paper>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Report Type</InputLabel>
              <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                <MenuItem value="monthly">Monthly Report</MenuItem>
                <MenuItem value="quarterly">Quarterly Report</MenuItem>
                <MenuItem value="annual">Annual Report</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Month</InputLabel>
              <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                <MenuItem value={1}>January</MenuItem>
                <MenuItem value={2}>February</MenuItem>
                <MenuItem value={3}>March</MenuItem>
                <MenuItem value={4}>April</MenuItem>
                <MenuItem value={5}>May</MenuItem>
                <MenuItem value={6}>June</MenuItem>
                <MenuItem value={7}>July</MenuItem>
                <MenuItem value={8}>August</MenuItem>
                <MenuItem value={9}>September</MenuItem>
                <MenuItem value={10}>October</MenuItem>
                <MenuItem value={11}>November</MenuItem>
                <MenuItem value={12}>December</MenuItem>
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
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" startIcon={<RefreshIcon />}>Generate</Button>
              <Button variant="outlined" startIcon={<PdfIcon />}>PDF</Button>
              <Button variant="outlined" startIcon={<DownloadIcon />}>Export</Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#E8F5E9' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Income</Typography>
              <Typography variant="h4" sx={{ color: '#4CAF50' }}>{formatMoney(totalIncome)}</Typography>
              <Chip label="+12% vs last month" size="small" icon={<TrendingUpIcon />} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#FFEBEE' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Expenses</Typography>
              <Typography variant="h4" sx={{ color: '#F44336' }}>{formatMoney(totalExpenses)}</Typography>
              <Chip label="+5% vs last month" size="small" icon={<TrendingUpIcon />} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#E3F2FD' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Net Profit</Typography>
              <Typography variant="h4" sx={{ color: '#2196F3' }}>{formatMoney(netProfit)}</Typography>
              <Chip label="+18% vs last month" size="small" icon={<TrendingUpIcon />} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Financial Trend</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={incomeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip formatter={(value) => formatMoney(value)} />
            <Legend />
            <Bar dataKey="income" fill="#4CAF50" name="Income" />
            <Bar dataKey="expenses" fill="#F44336" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Transactions Table */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} hover>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={transaction.type} 
                      size="small" 
                      color={transaction.type === 'Income' ? 'success' : 'error'} 
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ color: transaction.type === 'Income' ? '#4CAF50' : '#F44336' }}>
                    {formatMoney(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default FinancialReports;