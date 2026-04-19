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
  Tooltip,
  Divider,
  Alert
} from '@mui/material';
import {
  Download as DownloadIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Receipt as ReceiptIcon,
  School as SchoolIcon,
  People as PeopleIcon
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

function FeeReports() {
  const [reportType, setReportType] = useState('class');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState('term1');
  const [selectedYear, setSelectedYear] = useState(2024);

  const feeSummaryData = [
    { class: 'Form 1A', total: 45000, paid: 38000, balance: 7000, percentage: 84 },
    { class: 'Form 1B', total: 45000, paid: 35000, balance: 10000, percentage: 78 },
    { class: 'Form 2A', total: 45000, paid: 42000, balance: 3000, percentage: 93 },
    { class: 'Form 2B', total: 45000, paid: 39000, balance: 6000, percentage: 87 },
    { class: 'Form 3A', total: 45000, paid: 31000, balance: 14000, percentage: 69 },
    { class: 'Form 3B', total: 45000, paid: 28000, balance: 17000, percentage: 62 },
    { class: 'Form 4A', total: 45000, paid: 43000, balance: 2000, percentage: 96 },
    { class: 'Form 4B', total: 45000, paid: 40000, balance: 5000, percentage: 89 }
  ];

  const monthlyCollectionData = [
    { month: 'Jan', amount: 850000, students: 120 },
    { month: 'Feb', amount: 920000, students: 135 },
    { month: 'Mar', amount: 1100000, students: 160 },
    { month: 'Apr', amount: 780000, students: 110 },
    { month: 'May', amount: 950000, students: 140 },
    { month: 'Jun', amount: 1050000, students: 155 },
    { month: 'Jul', amount: 980000, students: 145 },
    { month: 'Aug', amount: 890000, students: 130 },
    { month: 'Sep', amount: 1020000, students: 150 },
    { month: 'Oct', amount: 950000, students: 140 },
    { month: 'Nov', amount: 880000, students: 125 },
    { month: 'Dec', amount: 720000, students: 100 }
  ];

  const topDefaulters = [
    { id: 1, name: 'James Otieno', admission: 'STU2024001', class: 'Form 3A', balance: 25000, days: 45, parent: 'John Otieno', phone: '0712345678' },
    { id: 2, name: 'Sarah Muthoni', admission: 'STU2024002', class: 'Form 3B', balance: 18000, days: 30, parent: 'Peter Muthoni', phone: '0723456789' },
    { id: 3, name: 'Michael Kiprono', admission: 'STU2024003', class: 'Form 2A', balance: 15000, days: 25, parent: 'Joseph Kiprono', phone: '0734567890' },
    { id: 4, name: 'Esther Chebet', admission: 'STU2024004', class: 'Form 4B', balance: 12000, days: 20, parent: 'David Chebet', phone: '0745678901' },
    { id: 5, name: 'Brian Omondi', admission: 'STU2024005', class: 'Form 1B', balance: 10000, days: 15, parent: 'Paul Omondi', phone: '0756789012' }
  ];

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 90) return '#4CAF50';
    if (percentage >= 70) return '#FF9800';
    return '#F44336';
  };

  const totalCollected = monthlyCollectionData.reduce((sum, item) => sum + item.amount, 0);
  const totalExpected = feeSummaryData.reduce((sum, item) => sum + item.total, 0);
  const totalBalance = feeSummaryData.reduce((sum, item) => sum + item.balance, 0);
  const collectionRate = ((totalCollected / totalExpected) * 100).toFixed(1);

  const pieData = [
    { name: 'Collected', value: totalCollected, color: '#4CAF50' },
    { name: 'Pending', value: totalBalance, color: '#F44336' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#2E7D32', color: 'white' }}>
        <Typography variant="h4" gutterBottom>Fee Reports</Typography>
        <Typography variant="body1">Generate and analyze fee collection reports</Typography>
      </Paper>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Report Type</InputLabel>
              <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                <MenuItem value="class">By Class</MenuItem>
                <MenuItem value="monthly">Monthly Collection</MenuItem>
                <MenuItem value="defaulters">Top Defaulters</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Class</InputLabel>
              <Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                <MenuItem value="all">All Classes</MenuItem>
                <MenuItem value="form1">Form 1</MenuItem>
                <MenuItem value="form2">Form 2</MenuItem>
                <MenuItem value="form3">Form 3</MenuItem>
                <MenuItem value="form4">Form 4</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Term</InputLabel>
              <Select value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)}>
                <MenuItem value="term1">Term 1</MenuItem>
                <MenuItem value="term2">Term 2</MenuItem>
                <MenuItem value="term3">Term 3</MenuItem>
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
              <Typography color="textSecondary" gutterBottom>Total Collected</Typography>
              <Typography variant="h4" sx={{ color: '#4CAF50' }}>{formatMoney(totalCollected)}</Typography>
              <Typography variant="caption">From {monthlyCollectionData.length} months</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#FFEBEE' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Pending Balance</Typography>
              <Typography variant="h4" sx={{ color: '#F44336' }}>{formatMoney(totalBalance)}</Typography>
              <Typography variant="caption">Outstanding fees</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#E3F2FD' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Collection Rate</Typography>
              <Typography variant="h4" sx={{ color: '#2196F3' }}>{collectionRate}%</Typography>
              <Typography variant="caption">Target: 95%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Monthly Collection Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyCollectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                <ChartTooltip formatter={(value) => formatMoney(value)} />
                <Legend />
                <Bar dataKey="amount" fill="#2E7D32" name="Amount Collected" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Collection Summary</Typography>
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
                <ChartTooltip formatter={(value) => formatMoney(value)} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Fee Summary Table */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Fee Collection by Class</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Class</TableCell>
                <TableCell align="right">Total Fees</TableCell>
                <TableCell align="right">Collected</TableCell>
                <TableCell align="right">Balance</TableCell>
                <TableCell align="center">Collection Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feeSummaryData.map((row) => (
                <TableRow key={row.class} hover>
                  <TableCell>{row.class}</TableCell>
                  <TableCell align="right">{formatMoney(row.total)}</TableCell>
                  <TableCell align="right" sx={{ color: '#4CAF50' }}>{formatMoney(row.paid)}</TableCell>
                  <TableCell align="right" sx={{ color: '#F44336' }}>{formatMoney(row.balance)}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={`${row.percentage}%`} 
                        size="small" 
                        sx={{ bgcolor: getStatusColor(row.percentage), color: 'white' }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Top Defaulters Table */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Top Fee Defaulters</Typography>
        <Alert severity="warning" sx={{ mb: 2 }}>
          These students have outstanding balances. Contact parents for fee collection.
        </Alert>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Student Name</TableCell>
                <TableCell>Admission No</TableCell>
                <TableCell>Class</TableCell>
                <TableCell align="right">Balance</TableCell>
                <TableCell>Days Overdue</TableCell>
                <TableCell>Parent Contact</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topDefaulters.map((student) => (
                <TableRow key={student.id} hover>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.admission}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell align="right" sx={{ color: '#F44336', fontWeight: 'bold' }}>
                    {formatMoney(student.balance)}
                  </TableCell>
                  <TableCell>
                    <Chip label={`${student.days} days`} size="small" color="error" />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="caption">{student.parent}</Typography>
                      <Typography variant="caption" display="block">{student.phone}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Button size="small" variant="outlined" color="warning">
                      Send Reminder
                    </Button>
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

export default FeeReports;