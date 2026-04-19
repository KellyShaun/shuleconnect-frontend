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
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  QrCode as QrCodeIcon
} from '@mui/icons-material';

function InventoryManagement() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    item_code: '',
    name: '',
    category_id: '',
    unit: '',
    quantity: 0,
    minimum_stock: 0,
    reorder_level: 0,
    unit_price: 0,
    location: '',
    supplier_id: ''
  });

  const [items, setItems] = useState([
    { id: 1, item_code: 'ST001', name: 'A4 Papers', category: 'Stationery', unit: 'reams', quantity: 50, minimum_stock: 20, reorder_level: 100, unit_price: 500, location: 'Shelf A1' },
    { id: 2, item_code: 'ST002', name: 'Whiteboard Markers', category: 'Teaching Aids', unit: 'pieces', quantity: 15, minimum_stock: 10, reorder_level: 30, unit_price: 150, location: 'Shelf B2' },
    { id: 3, item_code: 'ST003', name: 'Detergent', category: 'Cleaning Supplies', unit: 'liters', quantity: 8, minimum_stock: 5, reorder_level: 20, unit_price: 300, location: 'Shelf C3' }
  ]);

  const categories = ['Stationery', 'Cleaning Supplies', 'Office Equipment', 'Teaching Aids', 'Kitchen Supplies', 'Sports Equipment'];
  const units = ['pieces', 'kilograms', 'liters', 'boxes', 'reams', 'dozens', 'pairs'];

  const generateItemCode = () => {
    const prefix = 'ITM';
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${random}`;
  };

  const handleSave = () => {
    if (!formData.item_code) {
      formData.item_code = generateItemCode();
    }
    
    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? { ...formData, id: i.id } : i));
      setSnackbar({ open: true, message: 'Item updated', severity: 'success' });
    } else {
      setItems([...items, { ...formData, id: Date.now() }]);
      setSnackbar({ open: true, message: 'Item added', severity: 'success' });
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(i => i.id !== id));
      setSnackbar({ open: true, message: 'Item deleted', severity: 'success' });
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setFormData({
      item_code: '',
      name: '',
      category_id: '',
      unit: '',
      quantity: 0,
      minimum_stock: 0,
      reorder_level: 0,
      unit_price: 0,
      location: '',
      supplier_id: ''
    });
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.item_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (quantity, minStock) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'error' };
    if (quantity <= minStock) return { label: 'Low Stock', color: 'warning' };
    return { label: 'In Stock', color: 'success' };
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#FF9800', color: 'white' }}>
        <Typography variant="h4" gutterBottom>Inventory Management</Typography>
        <Typography variant="body1">Manage all store items and stock levels</Typography>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by code, name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon /> }}
            />
          </Grid>
          <Grid item xs={12} sm={7}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)} sx={{ bgcolor: '#FF9800' }}>
                Add Item
              </Button>
              <Button variant="outlined" startIcon={<DownloadIcon />}>Export</Button>
              <Button variant="outlined" startIcon={<RefreshIcon />}>Refresh</Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Item Code</TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Unit Price</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => {
              const status = getStockStatus(item.quantity, item.minimum_stock);
              return (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Chip label={item.item_code} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="right">KES {item.unit_price.toLocaleString()}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell align="center">
                    <Chip label={status.label} size="small" color={status.color} />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => { setEditingItem(item); setFormData(item); setOpenDialog(true); }}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Item Code" value={formData.item_code} onChange={(e) => setFormData({ ...formData, item_code: e.target.value })} placeholder="Auto-generated if empty" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Item Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}>
                  {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Unit</InputLabel>
                <Select value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })}>
                  {units.map(unit => <MenuItem key={unit} value={unit}>{unit}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Current Quantity" type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Minimum Stock" type="number" value={formData.minimum_stock} onChange={(e) => setFormData({ ...formData, minimum_stock: parseInt(e.target.value) })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Reorder Level" type="number" value={formData.reorder_level} onChange={(e) => setFormData({ ...formData, reorder_level: parseInt(e.target.value) })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Unit Price (KES)" type="number" value={formData.unit_price} onChange={(e) => setFormData({ ...formData, unit_price: parseFloat(e.target.value) })} InputProps={{ startAdornment: <InputAdornment position="start">KES</InputAdornment> }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Storage Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: '#FF9800' }}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default InventoryManagement;