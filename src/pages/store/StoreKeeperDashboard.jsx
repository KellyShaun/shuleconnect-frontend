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
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as CartIcon,
  LocalShipping as DeliveryIcon,
  Refresh as RefreshIcon,
  Category as CategoryIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useSelector } from 'react-redux';

function StoreKeeperDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    pendingRequisitions: 0,
    totalValue: 0,
    monthlyIssues: 0
  });
  const [lowStockItems, setLowStockItems] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    setStats({
      totalItems: 156,
      lowStockItems: 12,
      outOfStockItems: 5,
      pendingRequisitions: 8,
      totalValue: 1250000,
      monthlyIssues: 342
    });

    setLowStockItems([
      { id: 1, name: 'A4 Papers', current: 50, reorder_level: 100, unit: 'reams', category: 'Stationery' },
      { id: 2, name: 'Whiteboard Markers', current: 15, reorder_level: 30, unit: 'pieces', category: 'Teaching Aids' },
      { id: 3, name: 'Detergent', current: 8, reorder_level: 20, unit: 'liters', category: 'Cleaning Supplies' },
      { id: 4, name: 'Exercise Books', current: 120, reorder_level: 200, unit: 'dozens', category: 'Stationery' }
    ]);

    setRecentTransactions([
      { id: 1, item: 'A4 Papers', type: 'out', quantity: 20, date: '2024-03-15', department: 'Admin Office' },
      { id: 2, item: 'Whiteboard Markers', type: 'in', quantity: 50, date: '2024-03-14', supplier: 'Stationery Mart' },
      { id: 3, item: 'Detergent', type: 'out', quantity: 5, date: '2024-03-14', department: 'Kitchen' },
      { id: 4, item: 'Exercise Books', type: 'in', quantity: 200, date: '2024-03-13', supplier: 'Stationery Mart' }
    ]);

    setCategoryData([
      { name: 'Stationery', value: 45, color: '#4CAF50' },
      { name: 'Cleaning Supplies', value: 25, color: '#2196F3' },
      { name: 'Office Equipment', value: 15, color: '#FF9800' },
      { name: 'Teaching Aids', value: 10, color: '#9C27B0' },
      { name: 'Kitchen Supplies', value: 5, color: '#F44336' }
    ]);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#FF9800', color: 'white' }}>
        <Typography variant="h4" gutterBottom>Store Keeper Dashboard</Typography>
        <Typography variant="body1">{getGreeting()}, {user?.firstName || 'Store Keeper'}! Manage inventory and stock levels</Typography>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>Total Items</Typography>
                  <Typography variant="h3">{stats.totalItems}</Typography>
                  <Typography variant="caption">Unique stock items</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#FF9800', width: 56, height: 56 }}>
                  <InventoryIcon sx={{ fontSize: 32 }} />
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
                  <Typography color="textSecondary" gutterBottom>Low Stock Alert</Typography>
                  <Typography variant="h3" sx={{ color: '#F44336' }}>{stats.lowStockItems}</Typography>
                  <Typography variant="caption">Items need reorder</Typography>
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
                  <Typography color="textSecondary" gutterBottom>Pending Requisitions</Typography>
                  <Typography variant="h3">{stats.pendingRequisitions}</Typography>
                  <Typography variant="caption">Awaiting approval</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#2196F3', width: 56, height: 56 }}>
                  <CartIcon sx={{ fontSize: 32 }} />
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
                  <Typography color="textSecondary" gutterBottom>Inventory Value</Typography>
                  <Typography variant="h5">KES {stats.totalValue.toLocaleString()}</Typography>
                  <Typography variant="caption">Total stock value</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#4CAF50', width: 56, height: 56 }}>
                  <ReceiptIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Stock by Category</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Quick Actions</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button fullWidth variant="contained" startIcon={<CartIcon />} sx={{ bgcolor: '#FF9800' }}>
                  New Requisition
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button fullWidth variant="contained" startIcon={<DeliveryIcon />} sx={{ bgcolor: '#4CAF50' }}>
                  Receive Stock
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button fullWidth variant="outlined" startIcon={<InventoryIcon />}>
                  Stock Take
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button fullWidth variant="outlined" startIcon={<RefreshIcon />}>
                  Refresh
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Low Stock Alert Table */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#F44336' }}>
          ⚠️ Low Stock Alert
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Item Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="center">Current Stock</TableCell>
                <TableCell align="center">Reorder Level</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lowStockItems.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell align="center">{item.current} {item.unit}</TableCell>
                  <TableCell align="center">{item.reorder_level} {item.unit}</TableCell>
                  <TableCell align="center">
                    <Chip label="Low Stock" size="small" color="warning" />
                  </TableCell>
                  <TableCell align="center">
                    <Button size="small" variant="outlined" color="warning">Reorder</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Recent Transactions */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Date</TableCell>
                <TableCell>Item</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell>Reference</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id} hover>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.item}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={transaction.type === 'in' ? 'Stock In' : 'Stock Out'} 
                      size="small" 
                      color={transaction.type === 'in' ? 'success' : 'warning'}
                    />
                  </TableCell>
                  <TableCell align="center">{transaction.quantity}</TableCell>
                  <TableCell>{transaction.supplier || transaction.department}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default StoreKeeperDashboard;