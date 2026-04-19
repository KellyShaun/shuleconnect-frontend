import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import {
  Warning as WarningIcon,
  ShoppingCart as OrderIcon,
  Refresh as RefreshIcon,
  Print as PrintIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

function LowStockAlert() {
  const [lowStockItems, setLowStockItems] = useState([
    { id: 1, item_code: 'ST001', name: 'A4 Papers', category: 'Stationery', current: 50, reorder_level: 100, unit: 'reams', status: 'critical' },
    { id: 2, item_code: 'ST002', name: 'Whiteboard Markers', category: 'Teaching Aids', current: 15, reorder_level: 30, unit: 'pieces', status: 'low' },
    { id: 3, item_code: 'ST003', name: 'Detergent', category: 'Cleaning Supplies', current: 8, reorder_level: 20, unit: 'liters', status: 'critical' },
    { id: 4, item_code: 'ST004', name: 'Exercise Books', category: 'Stationery', current: 120, reorder_level: 200, unit: 'dozens', status: 'low' },
    { id: 5, item_code: 'ST005', name: 'Chalk', category: 'Teaching Aids', current: 5, reorder_level: 50, unit: 'boxes', status: 'critical' }
  ]);

  const outOfStockItems = [
    { id: 6, item_code: 'ST006', name: 'Red Pens', category: 'Stationery', current: 0, reorder_level: 50, unit: 'boxes', status: 'out' },
    { id: 7, item_code: 'ST007', name: 'Glue Sticks', category: 'Stationery', current: 0, reorder_level: 30, unit: 'pieces', status: 'out' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'critical': return 'error';
      case 'low': return 'warning';
      case 'out': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'critical': return 'Critical - Immediate Action';
      case 'low': return 'Low - Reorder Soon';
      case 'out': return 'Out of Stock';
      default: return status;
    }
  };

  const handleReorder = (item) => {
    alert(`Reorder initiated for ${item.name}. Suggested quantity: ${item.reorder_level * 2} ${item.unit}`);
  };

  const handleBulkReorder = () => {
    alert('Bulk reorder for all low stock items has been initiated.');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#F44336', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          <WarningIcon sx={{ fontSize: 40, mr: 2, verticalAlign: 'middle' }} />
          Low Stock Alert
        </Typography>
        <Typography variant="body1">Items that need immediate attention</Typography>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#FFEBEE' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Critical Stock</Typography>
              <Typography variant="h3" sx={{ color: '#F44336' }}>{lowStockItems.filter(i => i.status === 'critical').length}</Typography>
              <Typography variant="caption">Items below 30% of reorder level</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#FFF3E0' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Low Stock</Typography>
              <Typography variant="h3" sx={{ color: '#FF9800' }}>{lowStockItems.filter(i => i.status === 'low').length}</Typography>
              <Typography variant="caption">Items below reorder level</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#FFEBEE' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Out of Stock</Typography>
              <Typography variant="h3" sx={{ color: '#F44336' }}>{outOfStockItems.length}</Typography>
              <Typography variant="caption">Items completely depleted</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Critical & Low Stock Table */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Items Below Reorder Level</Typography>
          <Button variant="contained" startIcon={<OrderIcon />} onClick={handleBulkReorder} sx={{ bgcolor: '#FF9800' }}>
            Bulk Reorder
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Item Code</TableCell>
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
                <TableRow key={item.id} hover sx={{ bgcolor: item.status === 'critical' ? '#FFEBEE' : 'inherit' }}>
                  <TableCell>{item.item_code}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography fontWeight="bold" color={item.status === 'critical' ? 'error' : 'warning'}>
                        {item.current} {item.unit}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={(item.current / item.reorder_level) * 100} 
                        sx={{ width: 80, height: 6, borderRadius: 3 }}
                        color={item.status === 'critical' ? 'error' : 'warning'}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">{item.reorder_level} {item.unit}</TableCell>
                  <TableCell align="center">
                    <Chip label={getStatusLabel(item.status)} size="small" color={getStatusColor(item.status)} />
                  </TableCell>
                  <TableCell align="center">
                    <Button size="small" variant="outlined" color="warning" onClick={() => handleReorder(item)}>
                      Reorder
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Out of Stock Table */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#F44336' }}>Out of Stock Items</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Item Code</TableCell>
                <TableCell>Item Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {outOfStockItems.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.item_code}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell align="center">
                    <Chip label="Out of Stock" size="small" color="error" />
                  </TableCell>
                  <TableCell align="center">
                    <Button size="small" variant="contained" color="error" onClick={() => handleReorder(item)}>
                      Urgent Reorder
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

export default LowStockAlert;