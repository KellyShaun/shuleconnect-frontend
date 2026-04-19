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
    TextField,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar,
    CircularProgress,
    Tabs,
    Tab,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar,
    Tooltip,
    LinearProgress,
    Badge,
    Divider,
    Stepper,
    Step,
    StepLabel
} from '@mui/material';
import {
    DirectionsBus as BusIcon,
    Add as AddIcon,
    Search as SearchIcon,
    Download as DownloadIcon,
    Print as PrintIcon,
    Refresh as RefreshIcon,
    LocationOn as LocationIcon,
    Person as DriverIcon,
    Route as RouteIcon,
    Warning as WarningIcon,
    CheckCircle as CheckIcon,
    TrendingUp as TrendingUpIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    Schedule as ScheduleIcon,
    Build as BuildIcon,
    Assignment as AssignmentIcon,
    LocalGasStation as FuelIcon,
    Build as MaintenanceIcon,
    GpsFixed as GpsIcon,
    Timeline as TimelineIcon
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import api from '../../services/api';

function TransportManagerDashboard() {
    const [loading, setLoading] = useState(false);
    const [dashboardData, setDashboardData] = useState({
        total_vehicles: 0,
        active_vehicles: 0,
        maintenance_vehicles: 0,
        total_drivers: 0,
        total_routes: 0,
        students_transported: 0,
        total_fuel_consumption: 0,
        active_buses: [],
        upcoming_maintenance: [],
        recent_trips: [],
        route_utilization: []
    });
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [openVehicleDialog, setOpenVehicleDialog] = useState(false);
    const [openDriverDialog, setOpenDriverDialog] = useState(false);
    const [openRouteDialog, setOpenRouteDialog] = useState(false);
    const [openAssignDialog, setOpenAssignDialog] = useState(false);
    const [openMaintenanceDialog, setOpenMaintenanceDialog] = useState(false);
    const [openFuelDialog, setOpenFuelDialog] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [activeStep, setActiveStep] = useState(0);
    
    // Form states
    const [vehicleForm, setVehicleForm] = useState({
        vehicle_number: '',
        registration_number: '',
        model: '',
        manufacturer: '',
        year: '',
        capacity: '',
        fuel_type: 'diesel',
        status: 'active'
    });
    
    const [driverForm, setDriverForm] = useState({
        driver_name: '',
        driver_license: '',
        phone: '',
        email: '',
        hire_date: '',
        salary: '',
        address: '',
        experience_years: ''
    });
    
    const [routeForm, setRouteForm] = useState({
        route_name: '',
        route_code: '',
        start_point: '',
        end_point: '',
        distance_km: '',
        estimated_duration: '',
        stops: []
    });
    
    const [maintenanceForm, setMaintenanceForm] = useState({
        maintenance_date: new Date(),
        maintenance_type: 'routine',
        description: '',
        cost: '',
        next_maintenance_date: ''
    });
    
    const [fuelForm, setFuelForm] = useState({
        fuel_date: new Date(),
        fuel_amount: '',
        fuel_cost: '',
        odometer_reading: ''
    });
    
    const [assignForm, setAssignForm] = useState({
        vehicle_id: '',
        driver_id: '',
        route_id: ''
    });

    useEffect(() => {
        fetchDashboard();
        fetchVehicles();
        fetchDrivers();
        fetchRoutes();
        fetchStudents();
    }, []);

    const fetchDashboard = async () => {
        setLoading(true);
        try {
            const response = await api.get('/transport/manager/dashboard');
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchVehicles = async () => {
        try {
            const response = await api.get('/transport/vehicles');
            setVehicles(response.data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    const fetchDrivers = async () => {
        try {
            const response = await api.get('/transport/drivers');
            setDrivers(response.data);
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    };

    const fetchRoutes = async () => {
        try {
            const response = await api.get('/transport/routes');
            setRoutes(response.data);
        } catch (error) {
            console.error('Error fetching routes:', error);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await api.get('/students', { params: { status: 'active', limit: 100 } });
            setStudents(response.data.students || []);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleAddVehicle = async () => {
        if (!vehicleForm.vehicle_number || !vehicleForm.registration_number) {
            setSnackbar({ open: true, message: 'Please fill required fields', severity: 'error' });
            return;
        }
        
        setLoading(true);
        try {
            await api.post('/transport/vehicles', vehicleForm);
            setSnackbar({ open: true, message: 'Vehicle added successfully', severity: 'success' });
            setOpenVehicleDialog(false);
            resetVehicleForm();
            fetchVehicles();
            fetchDashboard();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error adding vehicle', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddDriver = async () => {
        if (!driverForm.driver_name || !driverForm.driver_license) {
            setSnackbar({ open: true, message: 'Please fill required fields', severity: 'error' });
            return;
        }
        
        setLoading(true);
        try {
            await api.post('/transport/drivers', driverForm);
            setSnackbar({ open: true, message: 'Driver added successfully', severity: 'success' });
            setOpenDriverDialog(false);
            resetDriverForm();
            fetchDrivers();
            fetchDashboard();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error adding driver', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddRoute = async () => {
        if (!routeForm.route_name || !routeForm.start_point || !routeForm.end_point) {
            setSnackbar({ open: true, message: 'Please fill required fields', severity: 'error' });
            return;
        }
        
        setLoading(true);
        try {
            await api.post('/transport/routes', routeForm);
            setSnackbar({ open: true, message: 'Route added successfully', severity: 'success' });
            setOpenRouteDialog(false);
            resetRouteForm();
            fetchRoutes();
            fetchDashboard();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error adding route', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleAssignDriver = async () => {
        if (!assignForm.vehicle_id || !assignForm.driver_id) {
            setSnackbar({ open: true, message: 'Please select vehicle and driver', severity: 'error' });
            return;
        }
        
        try {
            await api.post('/transport/assign-driver', assignForm);
            setSnackbar({ open: true, message: 'Driver assigned successfully', severity: 'success' });
            setOpenAssignDialog(false);
            resetAssignForm();
            fetchVehicles();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error assigning driver', severity: 'error' });
        }
    };

    const handleRecordMaintenance = async () => {
        if (!selectedVehicle || !maintenanceForm.description) {
            setSnackbar({ open: true, message: 'Please fill required fields', severity: 'error' });
            return;
        }
        
        try {
            await api.post('/transport/maintenance', {
                vehicle_id: selectedVehicle.id,
                ...maintenanceForm
            });
            setSnackbar({ open: true, message: 'Maintenance record added', severity: 'success' });
            setOpenMaintenanceDialog(false);
            resetMaintenanceForm();
            fetchVehicles();
            fetchDashboard();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error recording maintenance', severity: 'error' });
        }
    };

    const handleRecordFuel = async () => {
        if (!selectedVehicle || !fuelForm.fuel_amount) {
            setSnackbar({ open: true, message: 'Please fill required fields', severity: 'error' });
            return;
        }
        
        try {
            await api.post('/transport/fuel', {
                vehicle_id: selectedVehicle.id,
                ...fuelForm
            });
            setSnackbar({ open: true, message: 'Fuel record added', severity: 'success' });
            setOpenFuelDialog(false);
            resetFuelForm();
            fetchDashboard();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error recording fuel', severity: 'error' });
        }
    };

    const resetVehicleForm = () => {
        setVehicleForm({
            vehicle_number: '',
            registration_number: '',
            model: '',
            manufacturer: '',
            year: '',
            capacity: '',
            fuel_type: 'diesel',
            status: 'active'
        });
        setActiveStep(0);
    };

    const resetDriverForm = () => {
        setDriverForm({
            driver_name: '',
            driver_license: '',
            phone: '',
            email: '',
            hire_date: '',
            salary: '',
            address: '',
            experience_years: ''
        });
    };

    const resetRouteForm = () => {
        setRouteForm({
            route_name: '',
            route_code: '',
            start_point: '',
            end_point: '',
            distance_km: '',
            estimated_duration: '',
            stops: []
        });
    };

    const resetAssignForm = () => {
        setAssignForm({
            vehicle_id: '',
            driver_id: '',
            route_id: ''
        });
    };

    const resetMaintenanceForm = () => {
        setMaintenanceForm({
            maintenance_date: new Date(),
            maintenance_type: 'routine',
            description: '',
            cost: '',
            next_maintenance_date: ''
        });
    };

    const resetFuelForm = () => {
        setFuelForm({
            fuel_date: new Date(),
            fuel_amount: '',
            fuel_cost: '',
            odometer_reading: ''
        });
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'active': return 'success';
            case 'maintenance': return 'warning';
            case 'inactive': return 'error';
            default: return 'default';
        }
    };

    const vehicleStatusData = [
        { name: 'Active', value: dashboardData.active_vehicles, color: '#2E7D32' },
        { name: 'Maintenance', value: dashboardData.maintenance_vehicles, color: '#ED6C02' },
        { name: 'Inactive', value: dashboardData.total_vehicles - dashboardData.active_vehicles - dashboardData.maintenance_vehicles, color: '#9E9E9E' }
    ];

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ p: 3 }}>
                {/* Header */}
                <Paper sx={{ p: 3, mb: 3, bgcolor: '#2E7D32', color: 'white' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography variant="h4" gutterBottom>
                                <BusIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Transport Manager Dashboard
                            </Typography>
                            <Typography variant="body2">Manage fleet, drivers, routes, and student transportation</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button 
                                variant="contained" 
                                sx={{ bgcolor: 'white', color: '#2E7D32' }}
                                startIcon={<AddIcon />}
                                onClick={() => setOpenVehicleDialog(true)}
                            >
                                Add Vehicle
                            </Button>
                            <Button 
                                variant="outlined" 
                                sx={{ borderColor: 'white', color: 'white' }}
                                startIcon={<AddIcon />}
                                onClick={() => setOpenDriverDialog(true)}
                            >
                                Add Driver
                            </Button>
                            <Button 
                                variant="outlined" 
                                sx={{ borderColor: 'white', color: 'white' }}
                                startIcon={<RouteIcon />}
                                onClick={() => setOpenRouteDialog(true)}
                            >
                                Add Route
                            </Button>
                        </Box>
                    </Box>
                </Paper>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Total Vehicles</Typography>
                                <Typography variant="h3">{dashboardData.total_vehicles}</Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                    <Chip label={`${dashboardData.active_vehicles} Active`} size="small" color="success" />
                                    <Chip label={`${dashboardData.maintenance_vehicles} Maintenance`} size="small" color="warning" />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Drivers</Typography>
                                <Typography variant="h3">{dashboardData.total_drivers}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Active Routes</Typography>
                                <Typography variant="h3">{dashboardData.total_routes}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Students Transported</Typography>
                                <Typography variant="h3">{dashboardData.students_transported}</Typography>
                                <Typography variant="caption">Daily average</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Charts */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>Vehicle Status Distribution</Typography>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={vehicleStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        dataKey="value"
                                    >
                                        {vehicleStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <ReTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>Route Utilization</Typography>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={dashboardData.route_utilization}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="route_name" />
                                    <YAxis />
                                    <ReTooltip />
                                    <Bar dataKey="students" fill="#2E7D32" name="Students" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Tabs */}
                <Paper sx={{ mb: 3 }}>
                    <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                        <Tab label="Fleet Management" />
                        <Tab label="Drivers" />
                        <Tab label="Routes" />
                        <Tab label="Active Buses" />
                        <Tab label="Maintenance" />
                    </Tabs>

                    {/* Fleet Management Tab */}
                    {activeTab === 0 && (
                        <Box sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                                <TextField
                                    size="small"
                                    placeholder="Search vehicles..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} />
                                    }}
                                    sx={{ width: 250 }}
                                />
                                <FormControl size="small" sx={{ minWidth: 150 }}>
                                    <InputLabel>Status</InputLabel>
                                    <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                                        <MenuItem value="">All</MenuItem>
                                        <MenuItem value="active">Active</MenuItem>
                                        <MenuItem value="maintenance">Maintenance</MenuItem>
                                        <MenuItem value="inactive">Inactive</MenuItem>
                                    </Select>
                                </FormControl>
                                <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchVehicles}>
                                    Refresh
                                </Button>
                                <Button variant="outlined" startIcon={<AssignmentIcon />} onClick={() => setOpenAssignDialog(true)}>
                                    Assign Driver
                                </Button>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                            <TableCell>Vehicle No</TableCell>
                                            <TableCell>Registration</TableCell>
                                            <TableCell>Model</TableCell>
                                            <TableCell>Capacity</TableCell>
                                            <TableCell>Driver</TableCell>
                                            <TableCell>Fuel Type</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {vehicles.map((vehicle) => (
                                            <TableRow key={vehicle.id} hover>
                                                <TableCell>{vehicle.vehicle_number}</TableCell>
                                                <TableCell>{vehicle.registration_number}</TableCell>
                                                <TableCell>{vehicle.model}</TableCell>
                                                <TableCell>{vehicle.capacity}</TableCell>
                                                <TableCell>{vehicle.driver_name || 'Unassigned'}</TableCell>
                                                <TableCell>{vehicle.fuel_type}</TableCell>
                                                <TableCell>
                                                    <Chip label={vehicle.status} color={getStatusColor(vehicle.status)} size="small" />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Record Maintenance">
                                                        <IconButton size="small" color="warning" onClick={() => {
                                                            setSelectedVehicle(vehicle);
                                                            setOpenMaintenanceDialog(true);
                                                        }}>
                                                            <BuildIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Record Fuel">
                                                        <IconButton size="small" color="info" onClick={() => {
                                                            setSelectedVehicle(vehicle);
                                                            setOpenFuelDialog(true);
                                                        }}>
                                                            <FuelIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Track Location">
                                                        <IconButton size="small" color="primary">
                                                            <GpsIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}

                    {/* Drivers Tab */}
                    {activeTab === 1 && (
                        <Box sx={{ p: 3 }}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                            <TableCell>Driver Name</TableCell>
                                            <TableCell>License No</TableCell>
                                            <TableCell>Phone</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Experience</TableCell>
                                            <TableCell>Assigned Vehicle</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {drivers.map((driver) => (
                                            <TableRow key={driver.id} hover>
                                                <TableCell>{driver.driver_name}</TableCell>
                                                <TableCell>{driver.driver_license}</TableCell>
                                                <TableCell>{driver.phone}</TableCell>
                                                <TableCell>{driver.email}</TableCell>
                                                <TableCell>{driver.experience_years} years</TableCell>
                                                <TableCell>{driver.assigned_vehicle || 'Not assigned'}</TableCell>
                                                <TableCell>
                                                    <Chip label={driver.status || 'Active'} color="success" size="small" />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}

                    {/* Routes Tab */}
                    {activeTab === 2 && (
                        <Box sx={{ p: 3 }}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                            <TableCell>Route Name</TableCell>
                                            <TableCell>Code</TableCell>
                                            <TableCell>Start - End</TableCell>
                                            <TableCell>Distance (km)</TableCell>
                                            <TableCell>Duration (min)</TableCell>
                                            <TableCell align="center">Students</TableCell>
                                            <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {routes.map((route) => (
                                            <TableRow key={route.id} hover>
                                                <TableCell>{route.route_name}</TableCell>
                                                <TableCell>{route.route_code}</TableCell>
                                                <TableCell>{route.start_point} → {route.end_point}</TableCell>
                                                <TableCell>{route.distance_km}</TableCell>
                                                <TableCell>{route.estimated_duration}</TableCell>
                                                <TableCell align="center">
                                                    <Chip label={route.assigned_students || 0} size="small" color="primary" />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="View Map">
                                                        <IconButton size="small" color="primary">
                                                            <LocationIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Edit">
                                                        <IconButton size="small">
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}

                    {/* Active Buses Tab */}
                    {activeTab === 3 && (
                        <Box sx={{ p: 3 }}>
                            <Grid container spacing={2}>
                                {dashboardData.active_buses?.map((bus) => (
                                    <Grid item xs={12} md={6} key={bus.id}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <Box>
                                                        <Typography variant="h6">{bus.vehicle_number}</Typography>
                                                        <Typography variant="body2" color="textSecondary">{bus.registration_number}</Typography>
                                                        <Typography variant="body2">Driver: {bus.driver_name || 'Not assigned'}</Typography>
                                                        <Typography variant="body2">Route: {bus.route_name || 'Not assigned'}</Typography>
                                                        <Typography variant="body2">Capacity: {bus.capacity} students</Typography>
                                                    </Box>
                                                    <Chip label="Active" color="success" />
                                                </Box>
                                                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                                    <Button size="small" variant="outlined" startIcon={<LocationIcon />}>
                                                        Live Location
                                                    </Button>
                                                    <Button size="small" variant="outlined" startIcon={<ScheduleIcon />}>
                                                        Schedule
                                                    </Button>
                                                    <Button size="small" variant="outlined" startIcon={<AssignmentIcon />}>
                                                        Students
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}

                    {/* Maintenance Tab */}
                    {activeTab === 4 && (
                        <Box sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Upcoming Maintenance</Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                            <TableCell>Vehicle</TableCell>
                                            <TableCell>Maintenance Type</TableCell>
                                            <TableCell>Scheduled Date</TableCell>
                                            <TableCell>Days Left</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dashboardData.upcoming_maintenance?.map((item) => (
                                            <TableRow key={item.id} hover>
                                                <TableCell>{item.vehicle_number}</TableCell>
                                                <TableCell>{item.maintenance_type}</TableCell>
                                                <TableCell>{new Date(item.scheduled_date).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Chip label={`${item.days_left} days`} color={item.days_left <= 7 ? 'error' : 'warning'} size="small" />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={item.status} color="warning" size="small" />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Button size="small" variant="outlined">
                                                        Schedule
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </Paper>

                {/* Add Vehicle Dialog */}
                <Dialog open={openVehicleDialog} onClose={() => setOpenVehicleDialog(false)} maxWidth="md" fullWidth>
                    <DialogTitle>Add New Vehicle</DialogTitle>
                    <DialogContent>
                        <Stepper activeStep={activeStep} sx={{ my: 3 }}>
                            <Step><StepLabel>Basic Info</StepLabel></Step>
                            <Step><StepLabel>Specifications</StepLabel></Step>
                            <Step><StepLabel>Additional</StepLabel></Step>
                        </Stepper>
                        
                        {activeStep === 0 && (
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Vehicle Number" value={vehicleForm.vehicle_number} onChange={(e) => setVehicleForm({ ...vehicleForm, vehicle_number: e.target.value })} required />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Registration Number" value={vehicleForm.registration_number} onChange={(e) => setVehicleForm({ ...vehicleForm, registration_number: e.target.value })} required />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Model" value={vehicleForm.model} onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Manufacturer" value={vehicleForm.manufacturer} onChange={(e) => setVehicleForm({ ...vehicleForm, manufacturer: e.target.value })} />
                                </Grid>
                            </Grid>
                        )}
                        
                        {activeStep === 1 && (
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Year" type="number" value={vehicleForm.year} onChange={(e) => setVehicleForm({ ...vehicleForm, year: e.target.value })} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Capacity" type="number" value={vehicleForm.capacity} onChange={(e) => setVehicleForm({ ...vehicleForm, capacity: e.target.value })} required />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Fuel Type</InputLabel>
                                        <Select value={vehicleForm.fuel_type} onChange={(e) => setVehicleForm({ ...vehicleForm, fuel_type: e.target.value })}>
                                            <MenuItem value="diesel">Diesel</MenuItem>
                                            <MenuItem value="petrol">Petrol</MenuItem>
                                            <MenuItem value="electric">Electric</MenuItem>
                                            <MenuItem value="cng">CNG</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        )}
                        
                        {activeStep === 2 && (
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select value={vehicleForm.status} onChange={(e) => setVehicleForm({ ...vehicleForm, status: e.target.value })}>
                                            <MenuItem value="active">Active</MenuItem>
                                            <MenuItem value="maintenance">Maintenance</MenuItem>
                                            <MenuItem value="inactive">Inactive</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenVehicleDialog(false)}>Cancel</Button>
                        {activeStep > 0 && <Button onClick={() => setActiveStep(activeStep - 1)}>Back</Button>}
                        {activeStep < 2 ? (
                            <Button onClick={() => setActiveStep(activeStep + 1)} variant="contained">Next</Button>
                        ) : (
                            <Button onClick={handleAddVehicle} variant="contained" disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : 'Add Vehicle'}
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>

                {/* Add Driver Dialog */}
                <Dialog open={openDriverDialog} onClose={() => setOpenDriverDialog(false)} maxWidth="md" fullWidth>
                    <DialogTitle>Add New Driver</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Driver Name" value={driverForm.driver_name} onChange={(e) => setDriverForm({ ...driverForm, driver_name: e.target.value })} required />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Driver License" value={driverForm.driver_license} onChange={(e) => setDriverForm({ ...driverForm, driver_license: e.target.value })} required />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Phone" value={driverForm.phone} onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Email" value={driverForm.email} onChange={(e) => setDriverForm({ ...driverForm, email: e.target.value })} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Hire Date" type="date" value={driverForm.hire_date} onChange={(e) => setDriverForm({ ...driverForm, hire_date: e.target.value })} InputLabelProps={{ shrink: true }} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Experience (years)" type="number" value={driverForm.experience_years} onChange={(e) => setDriverForm({ ...driverForm, experience_years: e.target.value })} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Address" multiline rows={2} value={driverForm.address} onChange={(e) => setDriverForm({ ...driverForm, address: e.target.value })} />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDriverDialog(false)}>Cancel</Button>
                        <Button onClick={handleAddDriver} variant="contained" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Add Driver'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Add Route Dialog */}
                <Dialog open={openRouteDialog} onClose={() => setOpenRouteDialog(false)} maxWidth="md" fullWidth>
                    <DialogTitle>Add New Route</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Route Name" value={routeForm.route_name} onChange={(e) => setRouteForm({ ...routeForm, route_name: e.target.value })} required />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Route Code" value={routeForm.route_code} onChange={(e) => setRouteForm({ ...routeForm, route_code: e.target.value })} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Start Point" value={routeForm.start_point} onChange={(e) => setRouteForm({ ...routeForm, start_point: e.target.value })} required />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="End Point" value={routeForm.end_point} onChange={(e) => setRouteForm({ ...routeForm, end_point: e.target.value })} required />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Distance (km)" type="number" value={routeForm.distance_km} onChange={(e) => setRouteForm({ ...routeForm, distance_km: e.target.value })} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Estimated Duration (min)" type="number" value={routeForm.estimated_duration} onChange={(e) => setRouteForm({ ...routeForm, estimated_duration: e.target.value })} />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenRouteDialog(false)}>Cancel</Button>
                        <Button onClick={handleAddRoute} variant="contained" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Add Route'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Assign Driver Dialog */}
                <Dialog open={openAssignDialog} onClose={() => setOpenAssignDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Assign Driver to Vehicle</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Select Vehicle</InputLabel>
                                    <Select value={assignForm.vehicle_id} onChange={(e) => setAssignForm({ ...assignForm, vehicle_id: e.target.value })}>
                                        <MenuItem value="">Select Vehicle</MenuItem>
                                        {vehicles.map(v => (
                                            <MenuItem key={v.id} value={v.id}>{v.vehicle_number} - {v.registration_number}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Select Driver</InputLabel>
                                    <Select value={assignForm.driver_id} onChange={(e) => setAssignForm({ ...assignForm, driver_id: e.target.value })}>
                                        <MenuItem value="">Select Driver</MenuItem>
                                        {drivers.map(d => (
                                            <MenuItem key={d.id} value={d.id}>{d.driver_name} - {d.driver_license}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenAssignDialog(false)}>Cancel</Button>
                        <Button onClick={handleAssignDriver} variant="contained">Assign</Button>
                    </DialogActions>
                </Dialog>

                {/* Record Maintenance Dialog */}
                <Dialog open={openMaintenanceDialog} onClose={() => setOpenMaintenanceDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Record Maintenance</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" gutterBottom>Vehicle: {selectedVehicle?.vehicle_number}</Typography>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <DatePicker
                                    label="Maintenance Date"
                                    value={maintenanceForm.maintenance_date}
                                    onChange={(date) => setMaintenanceForm({ ...maintenanceForm, maintenance_date: date })}
                                    slotProps={{ textField: { fullWidth: true } }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Maintenance Type</InputLabel>
                                    <Select value={maintenanceForm.maintenance_type} onChange={(e) => setMaintenanceForm({ ...maintenanceForm, maintenance_type: e.target.value })}>
                                        <MenuItem value="routine">Routine Service</MenuItem>
                                        <MenuItem value="repair">Repair</MenuItem>
                                        <MenuItem value="inspection">Inspection</MenuItem>
                                        <MenuItem value="emergency">Emergency</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth multiline rows={3} label="Description" value={maintenanceForm.description} onChange={(e) => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })} required />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Cost (KES)" type="number" value={maintenanceForm.cost} onChange={(e) => setMaintenanceForm({ ...maintenanceForm, cost: e.target.value })} />
                            </Grid>
                            <Grid item xs={12}>
                                <DatePicker
                                    label="Next Maintenance Date"
                                    value={maintenanceForm.next_maintenance_date}
                                    onChange={(date) => setMaintenanceForm({ ...maintenanceForm, next_maintenance_date: date })}
                                    slotProps={{ textField: { fullWidth: true } }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenMaintenanceDialog(false)}>Cancel</Button>
                        <Button onClick={handleRecordMaintenance} variant="contained">Record</Button>
                    </DialogActions>
                </Dialog>

                {/* Record Fuel Dialog */}
                <Dialog open={openFuelDialog} onClose={() => setOpenFuelDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Record Fuel Transaction</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" gutterBottom>Vehicle: {selectedVehicle?.vehicle_number}</Typography>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <DatePicker
                                    label="Fuel Date"
                                    value={fuelForm.fuel_date}
                                    onChange={(date) => setFuelForm({ ...fuelForm, fuel_date: date })}
                                    slotProps={{ textField: { fullWidth: true } }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Fuel Amount (Liters)" type="number" value={fuelForm.fuel_amount} onChange={(e) => setFuelForm({ ...fuelForm, fuel_amount: e.target.value })} required />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Fuel Cost (KES)" type="number" value={fuelForm.fuel_cost} onChange={(e) => setFuelForm({ ...fuelForm, fuel_cost: e.target.value })} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Odometer Reading (km)" type="number" value={fuelForm.odometer_reading} onChange={(e) => setFuelForm({ ...fuelForm, odometer_reading: e.target.value })} />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenFuelDialog(false)}>Cancel</Button>
                        <Button onClick={handleRecordFuel} variant="contained">Record Fuel</Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar */}
                <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    );
}

export default TransportManagerDashboard;