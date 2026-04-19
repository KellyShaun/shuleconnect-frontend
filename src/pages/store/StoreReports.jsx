import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
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
  Card,
  CardContent
} from '@mui/material';
import {
  Download as DownloadIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function StoreReports() {
  const [reportType, setReportType] = useState('stock');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(2024);

  const stockValueData = [
    { category: 'Stationery', value: 450000, color: '#4CAF50' },
    { category: 'Cleaning Supplies', value: 120000, color: '#2196F3' },
    { category: 'Office Equipment', value: 350000, color: '#FF9800' },
    { category: 'Teaching Aids', value: 80000, color: '#9C27B0' }
  ];

  const monthlyIssuesData = [
    { month: 'Jan', issued: 120, value: 60000 },
    { month: 'Feb', issued: 95, value: 45000 },
    { month: 'Mar', issued: 150, value: 75000 },
    { month: 'Apr', issued: 110, value: 55000 },
    { month: 'May', issued: 130, value: 65000 },
    { month: 'Jun', issued: 140, value: 70000 }
  ];

  const topItems = [
    { name: 'A4 Papers', issued: 250, value: 125000 },
    { name: 'Exercise Books', issued: 200, value: 120000 },
    { name: 'Whiteboard Markers', issued: 180, value: 27000 },
    { name: 'Chalk', issued: 150, value: 15000 },
    { name: 'Detergent', issued: 120, value: 36000 }
  ];

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(amount);
  };

  const totalStockValue = stockValueData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#FF9800', color: 'white' }}>
        <Typography variant="h4" gutterBottom>Store Reports</Typography>
        <Typography variant="body1">Generate and analyze store reports</Typography>
      </Paper>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Report Type</InputLabel>
              <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                <MenuItem value="stock">Stock Value Report</MenuItem>
                <MenuItem value="movement">Stock Movement Report</MenuItem>
                <MenuItem value="top-items">Top Issued Items</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Month</InputLabel>
              <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => <MenuItem key={m} value={m}>{new Date(2000, m-1).toLocaleString('default', { month: 'long' })}</MenuItem>)}
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
              <Button variant="contained" startIcon={<RefreshIcon />} sx={{ bgcolor: '#FF9800' }}>Generate</Button>
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
              <Typography color="textSecondary" gutterBottom>Total Stock Value</Typography>
              <Typography variant="h5">{formatMoney(totalStockValue)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#E3F2FD' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Items Issued</Typography>
              <Typography variant="h5">{monthlyIssuesData.reduce((sum, m) => sum + m.issued, 0)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#FFF3E0' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Most Active Category</Typography>
              <Typography variant="h5">Stationery</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Stock Value Chart */}
      {reportType === 'stock' && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Stock Value by Category</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={stockValueData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                    {stockValueData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <ChartTooltip formatter={(value) => formatMoney(value)} />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Stock Value Summary</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Value</TableCell>
                      <TableCell align="center">Percentage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stockValueData.map((item) => (
                      <TableRow key={item.category}>
                        <TableCell>{item.category}</TableCell>
                        <TableCell align="right">{formatMoney(item.value)}</TableCell>
                        <TableCell align="center">{Math.round((item.value / totalStockValue) * 100)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Stock Movement Chart */}
      {reportType === 'movement' && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Monthly Stock Movement</Typography>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyIssuesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => formatMoney(value)} />
              <ChartTooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="issued" fill="#FF9800" name="Items Issued" />
              <Bar yAxisId="right" dataKey="value" fill="#4CAF50" name="Total Value" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      )}

      {/* Top Items Table */}
      {reportType === 'top-items' && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Most Issued Items</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell>Rank</TableCell>
                  <TableCell>Item Name</TableCell>
                  <TableCell align="center">Quantity Issued</TableCell>
                  <TableCell align="right">Total Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topItems.map((item, index) => (
                  <TableRow key={item.name}>
                    <TableCell><Chip label={`#${index + 1}`} size="small" color="primary" /></TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="center">{item.issued}</TableCell>
                    <TableCell align="right">{formatMoney(item.value)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}

export default StoreReports;