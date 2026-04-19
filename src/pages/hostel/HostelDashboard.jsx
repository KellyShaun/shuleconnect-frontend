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
    Home as HomeIcon,
    Add as AddIcon,
    Bed as BedIcon,
    Restaurant as MealIcon,
    People as PeopleIcon,
    Refresh as RefreshIcon,
    Login as CheckInIcon,
    Logout as CheckOutIcon,
    LocalHospital as MedicalIcon,
    Gavel as DisciplineIcon
} from '@mui/icons-material';
import api from '../../services/api';

// Custom Gauge Component
const CustomGauge = ({ value, size = 140 }) => {
    const radius = 55;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
    
    const getColor = () => {
        if (value >= 85) return '#D32F2F';
        if (value >= 70) return '#ED6C02';
        if (value >= 50) return '#2E7D32';
        return '#4CAF50';
    };

    return (
        <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width={size} height={size}>
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#E0E0E0"
                    strokeWidth={12}
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={getColor()}
                    strokeWidth={12}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
            </svg>
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}
            >
                <Typography variant="h3" component="div" color={getColor()} fontWeight="bold">
                    {value}%
                </Typography>
                <Typography variant="caption" color="textSecondary">
                    Occupancy Rate
                </Typography>
            </Box>
        </Box>
    );
};

function HostelDashboard() {
    const [dashboardData, setDashboardData] = useState({
        occupancy_rate: 0,
        total_beds: 0,
        occupied_beds: 0,
        meal_attendance: [],
        pending_visitors: 0,
        checked_in_students: 0,
        today_activities: []
    });
    const [dormitories, setDormitories] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [openAllocateDialog, setOpenAllocateDialog] = useState(false);
    const [openMealDialog, setOpenMealDialog] = useState(false);
    const [openCheckInDialog, setOpenCheckInDialog] = useState(false);
    const [openCheckOutDialog, setOpenCheckOutDialog] = useState(false);
    const [selectedDormitory, setSelectedDormitory] = useState('');
    const [availableBeds, setAvailableBeds] = useState([]);
    const [students, setStudents] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [allocationForm, setAllocationForm] = useState({
        student_id: '',
        room_id: '',
        bed_number: '',
        notes: ''
    });
    const [checkInForm, setCheckInForm] = useState({
        student_id: '',
        expected_return_date: '',
        notes: ''
    });
    const [mealForm, setMealForm] = useState({
        meal_date: new Date().toISOString().split('T')[0],
        meal_type: 'breakfast',
        menu: '',
        special_notes: ''
    });

    useEffect(() => {
        fetchDashboard();
        fetchDormitories();
        fetchRooms();
        fetchStudents();
    }, []);

    const fetchDashboard = async () => {
        setLoading(true);
        try {
            const response = await api.get('/hostel/dashboard');
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDormitories = async () => {
        try {
            const response = await api.get('/hostel/dormitories');
            setDormitories(response.data);
        } catch (error) {
            console.error('Error fetching dormitories:', error);
        }
    };

    const fetchRooms = async () => {
        try {
            const response = await api.get('/hostel/rooms');
            setRooms(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
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

    const fetchAvailableBeds = async () => {
        try {
            const response = await api.get('/hostel/available-beds', {
                params: { dormitory_id: selectedDormitory }
            });
            setAvailableBeds(response.data);
        } catch (error) {
            console.error('Error fetching available beds:', error);
        }
    };

    const handleAllocateBed = async () => {
        try {
            await api.post('/hostel/allocate-bed', allocationForm);
            setSnackbar({ open: true, message: 'Bed allocated successfully', severity: 'success' });
            setOpenAllocateDialog(false);
            fetchDashboard();
            fetchRooms();
            resetAllocationForm();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error allocating bed', severity: 'error' });
        }
    };

    const handleCheckIn = async () => {
        try {
            await api.post('/hostel/check-in', checkInForm);
            setSnackbar({ open: true, message: 'Student checked in successfully', severity: 'success' });
            setOpenCheckInDialog(false);
            fetchDashboard();
            resetCheckInForm();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error checking in student', severity: 'error' });
        }
    };

    const handleCheckOut = async () => {
        try {
            await api.post('/hostel/check-out', checkInForm);
            setSnackbar({ open: true, message: 'Student checked out successfully', severity: 'success' });
            setOpenCheckOutDialog(false);
            fetchDashboard();
            resetCheckInForm();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error checking out student', severity: 'error' });
        }
    };

    const handleCreateMealMenu = async () => {
        try {
            await api.post('/hostel/meal-menus', mealForm);
            setSnackbar({ open: true, message: 'Meal menu created', severity: 'success' });
            setOpenMealDialog(false);
            resetMealForm();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error creating meal menu', severity: 'error' });
        }
    };

    const resetAllocationForm = () => {
        setAllocationForm({
            student_id: '',
            room_id: '',
            bed_number: '',
            notes: ''
        });
        setSelectedDormitory('');
    };

    const resetCheckInForm = () => {
        setCheckInForm({
            student_id: '',
            expected_return_date: '',
            notes: ''
        });
    };

    const resetMealForm = () => {
        setMealForm({
            meal_date: new Date().toISOString().split('T')[0],
            meal_type: 'breakfast',
            menu: '',
            special_notes: ''
        });
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: '#2E7D32', color: 'white' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            <HomeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Hostel Management
                        </Typography>
                        <Typography variant="body2">Manage dormitories, rooms, meals, and student welfare</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button 
                            variant="contained" 
                            sx={{ bgcolor: 'white', color: '#2E7D32' }}
                            startIcon={<BedIcon />}
                            onClick={() => {
                                fetchAvailableBeds();
                                setOpenAllocateDialog(true);
                            }}
                        >
                            Allocate Bed
                        </Button>
                        <Button 
                            variant="outlined" 
                            sx={{ borderColor: 'white', color: 'white' }}
                            startIcon={<CheckInIcon />}
                            onClick={() => setOpenCheckInDialog(true)}
                        >
                            Check In
                        </Button>
                        <Button 
                            variant="outlined" 
                            sx={{ borderColor: 'white', color: 'white' }}
                            startIcon={<CheckOutIcon />}
                            onClick={() => setOpenCheckOutDialog(true)}
                        >
                            Check Out
                        </Button>
                        <Button 
                            variant="outlined" 
                            sx={{ borderColor: 'white', color: 'white' }}
                            startIcon={<MealIcon />}
                            onClick={() => setOpenMealDialog(true)}
                        >
                            Set Meal Menu
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: 'center', py: 2 }}>
                        <CardContent>
                            <CustomGauge value={dashboardData.occupancy_rate} />
                            <LinearProgress 
                                variant="determinate" 
                                value={dashboardData.occupancy_rate} 
                                sx={{ mt: 2, height: 8, borderRadius: 4 }}
                                color={dashboardData.occupancy_rate > 85 ? 'error' : dashboardData.occupancy_rate > 70 ? 'warning' : 'success'}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: 'center', py: 2 }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Total Beds</Typography>
                            <Typography variant="h2" fontWeight="bold">{dashboardData.total_beds}</Typography>
                            <Typography variant="caption" color="success.main">
                                {dashboardData.occupied_beds} occupied
                            </Typography>
                            <LinearProgress 
                                variant="determinate" 
                                value={(dashboardData.occupied_beds / dashboardData.total_beds) * 100} 
                                sx={{ mt: 2, height: 6, borderRadius: 4 }}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: 'center', py: 2, bgcolor: '#FFF3E0' }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Checked In Today</Typography>
                            <Typography variant="h2" fontWeight="bold" color="warning.main">{dashboardData.checked_in_students}</Typography>
                            <Typography variant="caption">Students currently in hostel</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: 'center', py: 2, bgcolor: '#FFEBEE' }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Pending Visitors</Typography>
                            <Typography variant="h2" fontWeight="bold" color="error.main">{dashboardData.pending_visitors}</Typography>
                            <Button size="small" startIcon={<PeopleIcon />} sx={{ mt: 1 }}>Review Requests</Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Meal Attendance Summary */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Today's Meal Attendance</Typography>
                <Grid container spacing={2}>
                    {dashboardData.meal_attendance?.map((meal, idx) => (
                        <Grid item xs={12} sm={4} key={idx}>
                            <Card variant="outlined">
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>{meal.meal_type}</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
                                        <Chip label={`Present: ${meal.present || 0}`} color="success" size="small" />
                                        <Chip label={`Total: ${meal.total || 0}`} color="default" size="small" />
                                    </Box>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={((meal.present || 0) / (meal.total || 1)) * 100} 
                                        sx={{ mt: 2, height: 6, borderRadius: 4 }}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            {/* Tabs */}
            <Paper sx={{ mb: 3 }}>
                <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                    <Tab label="Dormitories" />
                    <Tab label="Rooms" />
                    <Tab label="Today's Activities" />
                </Tabs>

                {/* Dormitories Tab */}
                {activeTab === 0 && (
                    <Box sx={{ p: 3 }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Dormitory Name</TableCell>
                                        <TableCell>Building</TableCell>
                                        <TableCell>Gender</TableCell>
                                        <TableCell align="center">Rooms</TableCell>
                                        <TableCell align="center">Total Beds</TableCell>
                                        <TableCell align="center">Occupied</TableCell>
                                        <TableCell align="center">Occupancy</TableCell>
                                        <TableCell>House Parent</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dormitories.map((dorm) => {
                                        const occupancy = (dorm.occupied_beds / dorm.total_beds) * 100;
                                        return (
                                            <TableRow key={dorm.id} hover>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="bold">{dorm.dormitory_name}</Typography>
                                                </TableCell>
                                                <TableCell>{dorm.building}</TableCell>
                                                <TableCell>
                                                    <Chip label={dorm.gender} size="small" color={dorm.gender === 'Female' ? 'secondary' : 'primary'} />
                                                </TableCell>
                                                <TableCell align="center">{dorm.room_count || 0}</TableCell>
                                                <TableCell align="center">{dorm.total_beds}</TableCell>
                                                <TableCell align="center">{dorm.occupied_beds || 0}</TableCell>
                                                <TableCell align="center" sx={{ minWidth: 100 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LinearProgress 
                                                            variant="determinate" 
                                                            value={occupancy} 
                                                            sx={{ width: 80, height: 6, borderRadius: 3 }}
                                                        />
                                                        <Typography variant="caption">{occupancy.toFixed(0)}%</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{dorm.house_parent_first} {dorm.house_parent_last}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {/* Rooms Tab */}
                {activeTab === 1 && (
                    <Box sx={{ p: 3 }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Dormitory</TableCell>
                                        <TableCell>Room Number</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell align="center">Capacity</TableCell>
                                        <TableCell align="center">Occupancy</TableCell>
                                        <TableCell align="center">Availability</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rooms.map((room) => {
                                        const occupancy = (room.current_occupancy / room.capacity) * 100;
                                        const available = room.capacity - room.current_occupancy;
                                        return (
                                            <TableRow key={room.id} hover>
                                                <TableCell>{room.dormitory_name}</TableCell>
                                                <TableCell>{room.room_number}</TableCell>
                                                <TableCell>
                                                    <Chip label={room.room_type} size="small" />
                                                </TableCell>
                                                <TableCell align="center">{room.capacity}</TableCell>
                                                <TableCell align="center">{room.current_occupancy}</TableCell>
                                                <TableCell align="center">
                                                    <Chip 
                                                        label={`${available} beds`} 
                                                        size="small" 
                                                        color={available > 0 ? 'success' : 'error'}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <LinearProgress 
                                                        variant="determinate" 
                                                        value={occupancy} 
                                                        sx={{ width: 100, height: 6, borderRadius: 3 }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {/* Activities Tab */}
                {activeTab === 2 && (
                    <Box sx={{ p: 3 }}>
                        {dashboardData.today_activities?.length === 0 ? (
                            <Alert severity="info">No activities scheduled for today</Alert>
                        ) : (
                            dashboardData.today_activities?.map((activity, idx) => (
                                <Card key={idx} variant="outlined" sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Typography variant="subtitle1">{activity.activity_name}</Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {activity.start_time} - {activity.end_time} | Location: {activity.location}
                                                </Typography>
                                                <Typography variant="body2">{activity.description}</Typography>
                                            </Box>
                                            <Chip 
                                                label={activity.status} 
                                                color={activity.status === 'scheduled' ? 'primary' : 'success'}
                                                size="small"
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </Box>
                )}
            </Paper>

            {/* Allocate Bed Dialog */}
            <Dialog open={openAllocateDialog} onClose={() => setOpenAllocateDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Allocate Bed to Student</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Select Dormitory</InputLabel>
                                <Select 
                                    value={selectedDormitory} 
                                    onChange={(e) => {
                                        setSelectedDormitory(e.target.value);
                                        fetchAvailableBeds();
                                    }}
                                >
                                    <MenuItem value="">Select Dormitory</MenuItem>
                                    {dormitories.map(d => (
                                        <MenuItem key={d.id} value={d.id}>{d.dormitory_name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Select Room & Bed</InputLabel>
                                <Select 
                                    value={allocationForm.room_id} 
                                    onChange={(e) => {
                                        const room = availableBeds.find(r => r.id === e.target.value);
                                        setAllocationForm({ ...allocationForm, room_id: e.target.value, bed_number: '' });
                                    }}
                                >
                                    <MenuItem value="">Select Room</MenuItem>
                                    {availableBeds.map(room => (
                                        <MenuItem key={room.id} value={room.id}>
                                            Room {room.room_number} - {room.available_beds} beds available
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Bed Number"
                                value={allocationForm.bed_number}
                                onChange={(e) => setAllocationForm({ ...allocationForm, bed_number: e.target.value })}
                                placeholder="e.g., Bed 1, Upper Bunk"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Select Student</InputLabel>
                                <Select 
                                    value={allocationForm.student_id} 
                                    onChange={(e) => setAllocationForm({ ...allocationForm, student_id: e.target.value })}
                                >
                                    <MenuItem value="">Select Student</MenuItem>
                                    {students.map(s => (
                                        <MenuItem key={s.id} value={s.id}>
                                            {s.first_name} {s.last_name} - {s.admission_number}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Notes (Optional)"
                                value={allocationForm.notes}
                                onChange={(e) => setAllocationForm({ ...allocationForm, notes: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAllocateDialog(false)}>Cancel</Button>
                    <Button onClick={handleAllocateBed} variant="contained">Allocate Bed</Button>
                </DialogActions>
            </Dialog>

            {/* Check In Dialog */}
            <Dialog open={openCheckInDialog} onClose={() => setOpenCheckInDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Student Check In</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Select Student</InputLabel>
                                <Select 
                                    value={checkInForm.student_id} 
                                    onChange={(e) => setCheckInForm({ ...checkInForm, student_id: e.target.value })}
                                >
                                    <MenuItem value="">Select Student</MenuItem>
                                    {students.map(s => (
                                        <MenuItem key={s.id} value={s.id}>
                                            {s.first_name} {s.last_name} - {s.admission_number}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Expected Return Date"
                                type="date"
                                value={checkInForm.expected_return_date}
                                onChange={(e) => setCheckInForm({ ...checkInForm, expected_return_date: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Notes"
                                value={checkInForm.notes}
                                onChange={(e) => setCheckInForm({ ...checkInForm, notes: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCheckInDialog(false)}>Cancel</Button>
                    <Button onClick={handleCheckIn} variant="contained">Check In</Button>
                </DialogActions>
            </Dialog>

            {/* Check Out Dialog */}
            <Dialog open={openCheckOutDialog} onClose={() => setOpenCheckOutDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Student Check Out</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Select Student</InputLabel>
                                <Select 
                                    value={checkInForm.student_id} 
                                    onChange={(e) => setCheckInForm({ ...checkInForm, student_id: e.target.value })}
                                >
                                    <MenuItem value="">Select Student</MenuItem>
                                    {students.map(s => (
                                        <MenuItem key={s.id} value={s.id}>
                                            {s.first_name} {s.last_name} - {s.admission_number}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Notes"
                                value={checkInForm.notes}
                                onChange={(e) => setCheckInForm({ ...checkInForm, notes: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCheckOutDialog(false)}>Cancel</Button>
                    <Button onClick={handleCheckOut} variant="contained">Check Out</Button>
                </DialogActions>
            </Dialog>

            {/* Meal Menu Dialog */}
            <Dialog open={openMealDialog} onClose={() => setOpenMealDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Set Meal Menu</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Date"
                                type="date"
                                value={mealForm.meal_date}
                                onChange={(e) => setMealForm({ ...mealForm, meal_date: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Meal Type</InputLabel>
                                <Select 
                                    value={mealForm.meal_type} 
                                    onChange={(e) => setMealForm({ ...mealForm, meal_type: e.target.value })}
                                >
                                    <MenuItem value="breakfast">Breakfast</MenuItem>
                                    <MenuItem value="lunch">Lunch</MenuItem>
                                    <MenuItem value="dinner">Dinner</MenuItem>
                                    <MenuItem value="snack">Snack</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Menu"
                                value={mealForm.menu}
                                onChange={(e) => setMealForm({ ...mealForm, menu: e.target.value })}
                                placeholder="e.g., Ugali, Sukuma Wiki, Beef Stew, Fresh Fruit"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Special Notes (Dietary restrictions, allergies, etc.)"
                                value={mealForm.special_notes}
                                onChange={(e) => setMealForm({ ...mealForm, special_notes: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenMealDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateMealMenu} variant="contained">Save Menu</Button>
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

export default HostelDashboard;