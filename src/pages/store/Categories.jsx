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
  IconButton,
  Chip,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

function Categories() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    category_name: '',
    description: ''
  });

  const [categories, setCategories] = useState([
    { id: 1, category_name: 'Stationery', description: 'Pens, papers, notebooks, etc.', item_count: 45 },
    { id: 2, category_name: 'Cleaning Supplies', description: 'Detergents, brooms, mops, etc.', item_count: 28 },
    { id: 3, category_name: 'Office Equipment', description: 'Chairs, tables, computers, etc.', item_count: 15 },
    { id: 4, category_name: 'Teaching Aids', description: 'Charts, models, laboratory supplies', item_count: 32 },
    { id: 5, category_name: 'Kitchen Supplies', description: 'Utensils, food items', item_count: 20 },
    { id: 6, category_name: 'Sports Equipment', description: 'Balls, uniforms, nets', item_count: 16 }
  ]);

  const handleSave = () => {
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...formData, id: c.id, item_count: c.item_count } : c));
      setSnackbar({ open: true, message: 'Category updated', severity: 'success' });
    } else {
      setCategories([...categories, { ...formData, id: Date.now(), item_count: 0 }]);
      setSnackbar({ open: true, message: 'Category added', severity: 'success' });
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
      setSnackbar({ open: true, message: 'Category deleted', severity: 'success' });
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setFormData({ category_name: '', description: '' });
  };

  const filteredCategories = categories.filter(c =>
    c.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#FF9800', color: 'white' }}>
        <Typography variant="h4" gutterBottom>Categories Management</Typography>
        <Typography variant="body1">Manage inventory categories</Typography>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by category name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon /> }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)} sx={{ bgcolor: '#FF9800' }}>
                Add Category
              </Button>
              <Button variant="outlined" startIcon={<RefreshIcon />}>Refresh</Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Category Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Items Count</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CategoryIcon sx={{ color: '#FF9800' }} />
                    {category.category_name}
                  </Box>
                </TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell align="center">
                  <Chip label={category.item_count} size="small" color="primary" />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => { setEditingCategory(category); setFormData(category); setOpenDialog(true); }}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDelete(category.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Category Name" value={formData.category_name} onChange={(e) => setFormData({ ...formData, category_name: e.target.value })} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
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

export default Categories;