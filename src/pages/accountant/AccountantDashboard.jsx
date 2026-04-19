import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Receipt as ReceiptIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  AccountBalance as AccountIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { useSelector } from 'react-redux';

function AccountantDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalFeesCollected: 0,
    expectedFees: 0,
    pendingFees: 0,
    totalStudents: 0,
    collectionRate: 0,
    thisMonthCollection: 0
  });
  const [recentPayments, setRecentPayments] = useState([]);
  const [feeCollectionData, setFeeCollectionData] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    setLoading(true);
    
    // Mock data for accountant dashboard
    setStats({
      totalFeesCollected: 12500000,
      expectedFees: 15700000,
      pendingFees: 3200000,
      totalStudents: 1247,
      collectionRate: 79.6,
      thisMonthCollection: 2340000
    });

    setRecentPayments([
      { id: 1, student: 'John Kamau', amount: 45000, date: '2024-03-15', status: 'paid', method: 'M-Pesa', receipt: 'RCP001' },
      { id: 2, student: 'Mary Wanjiku', amount: 45000, date: '2024-03-14', status: 'paid', method: 'Bank Transfer', receipt: 'RCP002' },
      { id: 3, student: 'James Otieno', amount: 45000, date: '2024-03-14', status: 'paid', method: 'Cash', receipt: 'RCP003' },
      { id: 4, student: 'Sarah Muthoni', amount: 45000, date: '2024-03-13', status: 'paid', method: 'M-Pesa', receipt: 'RCP004' },
      { id: 5, student: 'Peter Maina', amount: 45000, date: '2024-03-12', status: 'paid', method: 'Bank Transfer', receipt: 'RCP005' }
    ]);

    setFeeCollectionData([
      { month: 'Jan', collected: 850000, target: 1200000 },
      { month: 'Feb', collected: 920000, target: 1200000 },
      { month: 'Mar', collected: 1100000, target: 1200000 },
      { month: 'Apr', collected: 780000, target: 1200000 },
      { month: 'May', collected: 950000, target: 1200000 },
      { month: 'Jun', collected: 1050000, target: 1200000 }
    ]);

    setPaymentMethods([
      { name: 'M-Pesa', value: 45, color: '#4CAF50' },
      { name: 'Bank Transfer', value: 30, color: '#2196F3' },
      { name: 'Cash', value: 20, color: '#FF9800' },
      { name: 'Cheque', value: 5, color: '#9C27B0' }
    ]);

    setLoading(false);
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#2E7D32', color: 'white' }}>
        <Typography variant="h4" gutterBottom>Accountant Dashboard</Typography>
        <Typography variant="body1">
          {getGreeting()}, {user?.firstName || 'Accountant'}! Track fee collections and financial reports
        </Typography>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>Total Collected</Typography>
                  <Typography variant="h5">{formatMoney(stats.totalFeesCollected)}</Typography>
                  <Typography variant="caption" color="textSecondary">This Year</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#4CAF50', width: 56, height: 56 }}>
                  <MoneyIcon sx={{ fontSize: 32 }} />
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
                  <Typography color="textSecondary" gutterBottom>Expected Fees</Typography>
                  <Typography variant="h5">{formatMoney(stats.expectedFees)}</Typography>
                  <Typography variant="caption" color="textSecondary">Total Budget</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#2196F3', width: 56, height: 56 }}>
                  <AccountIcon sx={{ fontSize: 32 }} />
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
                  <Typography color="textSecondary" gutterBottom>Pending Fees</Typography>
                  <Typography variant="h5" sx={{ color: '#F44336' }}>{formatMoney(stats.pendingFees)}</Typography>
                  <Typography variant="caption" color="textSecondary">Outstanding</Typography>
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
                  <Typography color="textSecondary" gutterBottom>Collection Rate</Typography>
                  <Typography variant="h5">{stats.collectionRate}%</Typography>
                  <Typography variant="caption" color="textSecondary">Target: 85%</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#FF9800', width: 56, height: 56 }}>
                  <TrendingUpIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={stats.collectionRate} 
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
                color={stats.collectionRate >= 80 ? 'success' : 'warning'}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Fee Collection Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={feeCollectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip formatter={(value) => formatMoney(value)} />
                <Legend />
                <Bar dataKey="collected" fill="#2E7D32" name="Collected" />
                <Bar dataKey="target" fill="#FF9800" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Payment Methods</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={paymentMethods}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Payments */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Recent Payments</Typography>
          <Box>
            <Button size="small" startIcon={<DownloadIcon />}>Export</Button>
            <Button size="small" startIcon={<PrintIcon />}>Print</Button>
            <Button size="small" startIcon={<RefreshIcon />} onClick={fetchDashboardData}>Refresh</Button>
          </Box>
        </Box>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Receipt No</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Method</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentPayments.map((payment) => (
                <TableRow key={payment.id} hover>
                  <TableCell>{payment.receipt}</TableCell>
                  <TableCell>{payment.student}</TableCell>
                  <TableCell align="right">{formatMoney(payment.amount)}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell align="center">
                    <Chip label={payment.status} size="small" color="success" icon={<CheckIcon />} />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Receipt">
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
      </Paper>

      {/* Quick Actions */}
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Button fullWidth variant="contained" startIcon={<PaymentIcon />} sx={{ bgcolor: '#2E7D32' }}>
            Record Payment
          </Button>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Button fullWidth variant="contained" startIcon={<ReceiptIcon />} sx={{ bgcolor: '#2196F3' }}>
            Generate Receipt
          </Button>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Button fullWidth variant="outlined" startIcon={<DownloadIcon />}>
            Fee Report
          </Button>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Button fullWidth variant="outlined" startIcon={<RefreshIcon />} onClick={fetchDashboardData}>
            Refresh
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AccountantDashboard;