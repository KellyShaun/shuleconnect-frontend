import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
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
    Chip,
    IconButton,
    LinearProgress,
    Alert,
    Snackbar,
    CircularProgress,
    Tabs,
    Tab,
    Avatar,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import {
    Inventory as InventoryIcon,
    Add as AddIcon,
    QrCodeScanner as ScanIcon,
    Warning as WarningIcon,
    CheckCircle as CheckIcon,
    Build as MaintenanceIcon,
    Assignment as AssignmentIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    Download as DownloadIcon,
    Print as PrintIcon,
    Refresh as RefreshIcon,
    Category as CategoryIcon,
    ShoppingCart as PurchaseIcon,
    LocalShipping as SupplierIcon
} from '@mui/icons-material';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../services/api';

function InventoryDashboard() {
    const [dashboardData, setDashboardData] = useState({
        asset_stats: {},
        stock_stats: {},
        recent_transactions: [],
        low_stock_alerts: []
    });
    const [assets, setAssets] = useState([]);
    const [stockItems, setStockItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [openAssetDialog, setOpenAssetDialog] = useState(false);
    const [openStockDialog, setOpenStockDialog] = useState(false);
    const [openAssignDialog, setOpenAssignDialog] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category_id: '',
        supplier_id: '',
        model: '',
        serial_number: '',
        manufacturer: '',
        purchase_date: '',
        purchase_cost: '',
        location: '',
        department: '',
        condition: 'good'
    });
    const [stockForm, setStockForm] = useState({
        item_code: '',
        item_name: '',
        category: '',
        unit_of_measure: 'pieces',
        current_quantity: 0,
        minimum_quantity: 0,
        reorder_point: 0,
        unit_cost: 0,
        location: ''
    });

    useEffect(() => {
        fetchDashboard();
        fetchAssets();
        fetchStockItems();
        fetchCategories();
        fetchSuppliers();
    }, []);

    const fetchDashboard = async () => {
        setLoading(true);
        try {
            const response = await api.get('/inventory/dashboard');
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAssets = async () => {
        try {
            const response = await api.get('/inventory/assets');
            setAssets(response.data.assets || []);
        } catch (error) {
            console.error('Error fetching assets:', error);
        }
    };

    const fetchStockItems = async () => {
        try {
            const response = await api.get('/inventory/stock');
            setStockItems(response.data.stock_items || []);
        } catch (error) {
            console.error('Error fetching stock:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/inventory/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const response = await api.get('/inventory/suppliers');
            setSuppliers(response.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const handleCreateAsset = async () => {
        try {
            await api.post('/inventory/assets', formData);
            setSnackbar({ open: true, message: 'Asset created successfully', severity: 'success' });
            setOpenAssetDialog(false);
            fetchAssets();
            fetchDashboard();
            resetForm();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error creating asset', severity: 'error' });
        }
    };

    const handleCreateStockItem = async () => {
        try {
            await api.post('/inventory/stock', stockForm);
            setSnackbar({ open: true, message: 'Stock item created successfully', severity: 'success' });
            setOpenStockDialog(false);
            fetchStockItems();
            fetchDashboard();
            resetStockForm();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error creating stock item', severity: 'error' });
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            category_id: '',
            supplier_id: '',
            model: '',
            serial_number: '',
            manufacturer: '',
            purchase_date: '',
            purchase_cost: '',
            location: '',
            department: '',
            condition: 'good'
        });
    };

    const resetStockForm = () => {
        setStockForm({
            item_code: '',
            item_name: '',
            category: '',
            unit_of_measure: 'pieces',
            current_quantity: 0,
            minimum_quantity: 0,
            reorder_point: 0,
            unit_cost: 0,
            location: ''
        });
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'available': return 'success';
            case 'assigned': return 'warning';
            case 'maintenance': return 'error';
            case 'disposed': return 'default';
            default: return 'default';
        }
    };

    const assetStatusData = [
        { name: 'Available', value: dashboardData.asset_stats?.available || 0, color: '#2E7D32' },
        { name: 'Assigned', value: dashboardData.asset_stats?.assigned || 0, color: '#ED6C02' },
        { name: 'Maintenance', value: dashboardData.asset_stats?.maintenance || 0, color: '#D32F2F' }
    ];

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            <InventoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Inventory & Asset Management
                        </Typography>
                        <Typography variant="body2">Track assets, manage stock, and monitor maintenance</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button 
                            variant="contained" 
                            sx={{ bgcolor: 'white', color: 'primary.main' }}
                            startIcon={<AddIcon />}
                            onClick={() => setOpenAssetDialog(true)}
                        >
                            Add Asset
                        </Button>
                        <Button 
                            variant="outlined" 
                            sx={{ borderColor: 'white', color: 'white' }}
                            startIcon={<AddIcon />}
                            onClick={() => setOpenStockDialog(true)}
                        >
                            Add Stock Item
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Total Assets</Typography>
                            <Typography variant="h4">{dashboardData.asset_stats?.total_assets || 0}</Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Chip label={`${dashboardData.asset_stats?.available || 0} Available`} size="small" color="success" />
                                <Chip label={`${dashboardData.asset_stats?.assigned || 0} Assigned`} size="small" color="warning" />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Stock Value</Typography>
                            <Typography variant="h4">KES {(dashboardData.stock_stats?.total_value || 0).toLocaleString()}</Typography>
                            <Typography variant="caption" color="textSecondary">
                                {dashboardData.stock_stats?.total_items || 0} items tracked
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: '#FFF3E0' }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Upcoming Maintenance</Typography>
                            <Typography variant="h4" color="warning.main">{dashboardData.asset_stats?.upcoming_maintenance || 0}</Typography>
                            <Typography variant="caption">Assets due in 30 days</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: '#FFEBEE' }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Low Stock Alerts</Typography>
                            <Typography variant="h4" color="error.main">{dashboardData.low_stock_alerts?.length || 0}</Typography>
                            <Button size="small" startIcon={<WarningIcon />}>View Alerts</Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Asset Status Distribution</Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={assetStatusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    dataKey="value"
                                >
                                    {assetStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Recent Stock Movements</Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Item</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell>Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dashboardData.recent_transactions?.slice(0, 5).map((transaction, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{transaction.item_name}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={transaction.transaction_type} 
                                                    size="small"
                                                    color={transaction.transaction_type === 'receive' ? 'success' : 'warning'}
                                                />
                                            </TableCell>
                                            <TableCell align="right">{transaction.quantity}</TableCell>
                                            <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>

            {/* Tabs */}
            <Paper sx={{ mb: 3 }}>
                <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                    <Tab label="Assets" />
                    <Tab label="Stock Inventory" />
                    <Tab label="Low Stock Alerts" />
                </Tabs>

                {/* Assets Tab */}
                {activeTab === 0 && (
                    <Box sx={{ p: 3 }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Asset Tag</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Location</TableCell>
                                        <TableCell>Condition</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {assets.map((asset) => (
                                        <TableRow key={asset.id} hover>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="bold">{asset.asset_tag}</Typography>
                                            </TableCell>
                                            <TableCell>{asset.name}</TableCell>
                                            <TableCell>{asset.category_name}</TableCell>
                                            <TableCell>{asset.location || 'N/A'}</TableCell>
                                            <TableCell>
                                                <Chip label={asset.condition} size="small" />
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={asset.status} 
                                                    color={getStatusColor(asset.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton size="small" color="info">
                                                    <ViewIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" color="primary">
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" color="warning">
                                                    <AssignmentIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {/* Stock Inventory Tab */}
                {activeTab === 1 && (
                    <Box sx={{ p: 3 }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Item Code</TableCell>
                                        <TableCell>Item Name</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell align="center">Quantity</TableCell>
                                        <TableCell align="right">Unit Cost (KES)</TableCell>
                                        <TableCell align="right">Total Value (KES)</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stockItems.map((item) => (
                                        <TableRow key={item.id} hover>
                                            <TableCell>{item.item_code}</TableCell>
                                            <TableCell>{item.item_name}</TableCell>
                                            <TableCell>{item.category}</TableCell>
                                            <TableCell align="center">
                                                <Typography 
                                                    fontWeight={item.current_quantity <= item.reorder_point ? 'bold' : 'normal'}
                                                    color={item.current_quantity <= item.reorder_point ? 'error.main' : 'inherit'}
                                                >
                                                    {item.current_quantity} {item.unit_of_measure}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">{item.unit_cost?.toLocaleString()}</TableCell>
                                            <TableCell align="right">{(item.current_quantity * item.unit_cost).toLocaleString()}</TableCell>
                                            <TableCell>
                                                {item.current_quantity <= item.reorder_point ? (
                                                    <Chip label="Low Stock" size="small" color="error" />
                                                ) : (
                                                    <Chip label="In Stock" size="small" color="success" />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {/* Low Stock Alerts Tab */}
                {activeTab === 2 && (
                    <Box sx={{ p: 3 }}>
                        {dashboardData.low_stock_alerts?.length === 0 ? (
                            <Alert severity="success">No low stock items. All stock levels are adequate.</Alert>
                        ) : (
                            <Grid container spacing={2}>
                                {dashboardData.low_stock_alerts?.map((item) => (
                                    <Grid item xs={12} md={6} key={item.id}>
                                        <Card variant="outlined" sx={{ borderColor: 'error.main' }}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <Box>
                                                        <Typography variant="subtitle1">{item.item_name}</Typography>
                                                        <Typography variant="body2" color="textSecondary">{item.item_code}</Typography>
                                                        <Box sx={{ mt: 1 }}>
                                                            <Typography variant="body2">
                                                                Current: <strong>{item.current_quantity} {item.unit_of_measure}</strong>
                                                            </Typography>
                                                            <Typography variant="body2" color="error">
                                                                Reorder Point: {item.reorder_point} {item.unit_of_measure}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                Minimum: {item.minimum_quantity} {item.unit_of_measure}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Button size="small" variant="outlined" color="warning">
                                                        Reorder Now
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                )}
            </Paper>

            {/* Add Asset Dialog */}
            <Dialog open={openAssetDialog} onClose={() => setOpenAssetDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Add New Asset</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Asset Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                >
                                    <MenuItem value="">Select Category</MenuItem>
                                    {categories.map(cat => (
                                        <MenuItem key={cat.id} value={cat.id}>{cat.category_name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Model"
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Serial Number"
                                value={formData.serial_number}
                                onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Manufacturer"
                                value={formData.manufacturer}
                                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Purchase Date"
                                type="date"
                                value={formData.purchase_date}
                                onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Purchase Cost (KES)"
                                type="number"
                                value={formData.purchase_cost}
                                onChange={(e) => setFormData({ ...formData, purchase_cost: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAssetDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateAsset} variant="contained">Create Asset</Button>
                </DialogActions>
            </Dialog>

            {/* Add Stock Item Dialog */}
            <Dialog open={openStockDialog} onClose={() => setOpenStockDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Add Stock Item</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Item Code"
                                value={stockForm.item_code}
                                onChange={(e) => setStockForm({ ...stockForm, item_code: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Item Name"
                                value={stockForm.item_name}
                                onChange={(e) => setStockForm({ ...stockForm, item_name: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Category"
                                value={stockForm.category}
                                onChange={(e) => setStockForm({ ...stockForm, category: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Unit of Measure</InputLabel>
                                <Select
                                    value={stockForm.unit_of_measure}
                                    onChange={(e) => setStockForm({ ...stockForm, unit_of_measure: e.target.value })}
                                >
                                    <MenuItem value="pieces">Pieces</MenuItem>
                                    <MenuItem value="kg">Kilograms (kg)</MenuItem>
                                    <MenuItem value="liters">Liters</MenuItem>
                                    <MenuItem value="boxes">Boxes</MenuItem>
                                    <MenuItem value="reams">Reams</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                label="Current Quantity"
                                type="number"
                                value={stockForm.current_quantity}
                                onChange={(e) => setStockForm({ ...stockForm, current_quantity: parseInt(e.target.value) })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                label="Minimum Quantity"
                                type="number"
                                value={stockForm.minimum_quantity}
                                onChange={(e) => setStockForm({ ...stockForm, minimum_quantity: parseInt(e.target.value) })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                label="Reorder Point"
                                type="number"
                                value={stockForm.reorder_point}
                                onChange={(e) => setStockForm({ ...stockForm, reorder_point: parseInt(e.target.value) })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                label="Unit Cost (KES)"
                                type="number"
                                value={stockForm.unit_cost}
                                onChange={(e) => setStockForm({ ...stockForm, unit_cost: parseFloat(e.target.value) })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Location"
                                value={stockForm.location}
                                onChange={(e) => setStockForm({ ...stockForm, location: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenStockDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateStockItem} variant="contained">Add Stock Item</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default InventoryDashboard;