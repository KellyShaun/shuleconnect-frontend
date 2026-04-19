import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    Alert,
    Snackbar,
    CircularProgress,
    Card,
    CardContent,
    LinearProgress
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    School as SchoolIcon,
    People as PeopleIcon,
    Book as BookIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import api from '../services/api';

function Classes() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        class_level: '',
        capacity: ''
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const response = await api.get('/classes');
            setClasses(response.data);
        } catch (error) {
            console.error('Error fetching classes:', error);
            setSnackbar({ open: true, message: 'Error fetching classes', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (classItem = null) => {
        if (classItem) {
            setEditingClass(classItem);
            setFormData({
                name: classItem.name,
                class_level: classItem.class_level,
                capacity: classItem.capacity || ''
            });
        } else {
            setEditingClass(null);
            setFormData({ name: '', class_level: '', capacity: '' });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingClass(null);
        setFormData({ name: '', class_level: '', capacity: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.class_level) {
            setSnackbar({ open: true, message: 'Please fill all required fields', severity: 'error' });
            return;
        }

        setLoading(true);
        try {
            if (editingClass) {
                await api.put(`/classes/${editingClass.id}`, formData);
                setSnackbar({ open: true, message: 'Class updated successfully', severity: 'success' });
            } else {
                await api.post('/classes', formData);
                setSnackbar({ open: true, message: 'Class created successfully', severity: 'success' });
            }
            handleCloseDialog();
            fetchClasses();
        } catch (error) {
            console.error('Error saving class:', error);
            setSnackbar({ open: true, message: 'Error saving class', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this class? This will also remove all students from this class.')) {
            setLoading(true);
            try {
                await api.delete(`/classes/${id}`);
                setSnackbar({ open: true, message: 'Class deleted successfully', severity: 'success' });
                fetchClasses();
            } catch (error) {
                console.error('Error deleting class:', error);
                setSnackbar({ open: true, message: 'Error deleting class', severity: 'error' });
            } finally {
                setLoading(false);
            }
        }
    };

    // Calculate statistics
    const totalStudents = classes.reduce((sum, cls) => sum + (cls.student_count || 0), 0);
    const totalClasses = classes.length;
    const avgStudentsPerClass = totalClasses > 0 ? (totalStudents / totalClasses).toFixed(1) : 0;

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: '#2E7D32', color: 'white' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h4" gutterBottom>Class Management</Typography>
                        <Typography variant="body2">Manage school classes, streams, and capacity</Typography>
                    </Box>
                    <Button 
                        variant="contained" 
                        sx={{ bgcolor: 'white', color: '#2E7D32' }}
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                    >
                        Add Class
                    </Button>
                </Box>
            </Paper>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>Total Classes</Typography>
                                    <Typography variant="h3">{totalClasses}</Typography>
                                </Box>
                                <SchoolIcon sx={{ fontSize: 48, color: '#2E7D32' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>Total Students</Typography>
                                    <Typography variant="h3">{totalStudents}</Typography>
                                </Box>
                                <PeopleIcon sx={{ fontSize: 48, color: '#1976D2' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>Average Class Size</Typography>
                                    <Typography variant="h3">{avgStudentsPerClass}</Typography>
                                    <LinearProgress variant="determinate" value={(avgStudentsPerClass / 45) * 100} sx={{ mt: 1 }} />
                                </Box>
                                <PeopleIcon sx={{ fontSize: 48, color: '#ED6C02' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Classes Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                            <TableCell>Class Name</TableCell>
                            <TableCell>Level</TableCell>
                            <TableCell align="center">Students</TableCell>
                            <TableCell align="center">Subjects</TableCell>
                            <TableCell align="center">Capacity</TableCell>
                            <TableCell align="center">Utilization</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : classes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography color="textSecondary">No classes found. Click "Add Class" to create one.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            classes.map((cls) => {
                                const utilization = cls.capacity ? ((cls.student_count || 0) / cls.capacity) * 100 : 0;
                                return (
                                    <TableRow key={cls.id} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold">{cls.name}</Typography>
                                        </TableCell>
                                        <TableCell>Class {cls.class_level}</TableCell>
                                        <TableCell align="center">
                                            <Chip 
                                                label={cls.student_count || 0} 
                                                size="small" 
                                                color="primary"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip 
                                                label={cls.subject_count || 0} 
                                                size="small" 
                                                color="info"
                                            />
                                        </TableCell>
                                        <TableCell align="center">{cls.capacity || 'N/A'}</TableCell>
                                        <TableCell align="center" sx={{ minWidth: 100 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={Math.min(utilization, 100)} 
                                                    sx={{ width: 80, height: 8, borderRadius: 4 }}
                                                    color={utilization > 90 ? 'error' : utilization > 75 ? 'warning' : 'success'}
                                                />
                                                <Typography variant="caption">
                                                    {utilization.toFixed(0)}%
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton size="small" color="primary" onClick={() => handleOpenDialog(cls)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => handleDelete(cls.id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingClass ? 'Edit Class' : 'Add New Class'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Class Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Form 1 East, Grade 1A"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Class Level"
                                name="class_level"
                                type="number"
                                value={formData.class_level}
                                onChange={handleChange}
                                placeholder="e.g., 1, 2, 3..."
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Capacity"
                                name="capacity"
                                type="number"
                                value={formData.capacity}
                                onChange={handleChange}
                                placeholder="Maximum number of students"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : (editingClass ? 'Update' : 'Create')}
                    </Button>
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

export default Classes;