import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tab,
    Tabs,
    Card,
    CardContent,
    Alert,
    Snackbar,
    CircularProgress,
    InputAdornment,
    Tooltip,
    Fab
} from '@mui/material';
import {
    Search as SearchIcon,
    Add as AddIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    School as SchoolIcon,
    People as PeopleIcon,
    Male as MaleIcon,
    Female as FemaleIcon,
    Refresh as RefreshIcon,
    Upload as UploadIcon,
    Download as DownloadIcon,
    Close as CloseIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import StudentForm from './StudentForm';
import StudentBulkImport from './StudentBulkImport';

function StudentList() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState('');
    const [filterStatus, setFilterStatus] = useState('active');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [openBulkDialog, setOpenBulkDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [stats, setStats] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        fetchStudents();
        fetchClasses();
        fetchStats();
    }, [searchTerm, filterClass, filterStatus, page, rowsPerPage]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const params = {
                page: page + 1,
                limit: rowsPerPage
            };
            if (filterClass) params.class_id = filterClass;
            if (filterStatus) params.status = filterStatus;
            if (searchTerm) params.search = searchTerm;
            
            const response = await api.get('/students', { params });
            setStudents(response.data.students || []);
        } catch (error) {
            console.error('Error fetching students:', error);
            setSnackbar({ open: true, message: 'Error fetching students', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const response = await api.get('/classes');
            setClasses(response.data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/students/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleDeleteStudent = async () => {
        if (!selectedStudent) return;
        
        try {
            await api.delete(`/students/${selectedStudent.id}`);
            setSnackbar({ open: true, message: 'Student deleted successfully', severity: 'success' });
            fetchStudents();
            fetchStats();
            setOpenDeleteDialog(false);
            setSelectedStudent(null);
        } catch (error) {
            console.error('Error deleting student:', error);
            setSnackbar({ open: true, message: 'Error deleting student', severity: 'error' });
        }
    };

    const handleViewStudent = (student) => {
        navigate(`/students/profile/${student.id}`);
    };

    const handleEditStudent = (student) => {
        navigate(`/students/edit/${student.id}`);
    };

    const handleAddStudent = () => {
        navigate('/students/add');
    };

    const handleFormSuccess = () => {
        fetchStudents();
        fetchStats();
        setSnackbar({ open: true, message: 'Student saved successfully', severity: 'success' });
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'active': return 'success';
            case 'inactive': return 'default';
            case 'pending': return 'warning';
            case 'alumni': return 'info';
            default: return 'default';
        }
    };

    const getRiskColor = (score) => {
        if (score >= 70) return 'error';
        if (score >= 50) return 'warning';
        if (score >= 30) return 'info';
        return 'success';
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h4" gutterBottom>Student Management</Typography>
                        <Typography variant="body2">Manage all students, track enrollment, and monitor progress</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button 
                            variant="contained" 
                            sx={{ bgcolor: 'white', color: 'primary.main' }}
                            startIcon={<UploadIcon />}
                            onClick={() => setOpenBulkDialog(true)}
                        >
                            Bulk Import
                        </Button>
                        <Button 
                            variant="contained" 
                            sx={{ bgcolor: 'white', color: 'primary.main' }}
                            startIcon={<AddIcon />}
                            onClick={handleAddStudent}
                        >
                            Add Student
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>Total Students</Typography>
                                    <Typography variant="h4">{stats.total_students || 0}</Typography>
                                </Box>
                                <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>Active Students</Typography>
                                    <Typography variant="h4" color="success.main">{stats.active_students || 0}</Typography>
                                </Box>
                                <PeopleIcon sx={{ fontSize: 40, color: 'success.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>At Risk Students</Typography>
                                    <Typography variant="h4" color="error.main">{stats.at_risk_students || 0}</Typography>
                                </Box>
                                <WarningIcon sx={{ fontSize: 40, color: 'error.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>Special Needs</Typography>
                                    <Typography variant="h4">{stats.special_needs || 0}</Typography>
                                </Box>
                                <SchoolIcon sx={{ fontSize: 40, color: 'info.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabs */}
            <Paper sx={{ mb: 3 }}>
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
                    <Tab label="All Students" />
                    <Tab label="Active" />
                    <Tab label="At Risk" />
                    <Tab label="Special Needs" />
                </Tabs>
            </Paper>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search by name or admission number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Class</InputLabel>
                            <Select 
                                value={filterClass || ''} 
                                onChange={(e) => setFilterClass(e.target.value || '')}
                            >
                                <MenuItem value="">All Classes</MenuItem>
                                {classes.map(cls => (
                                    <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select 
                                value={filterStatus} 
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="alumni">Alumni</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button fullWidth variant="outlined" onClick={fetchStudents} startIcon={<RefreshIcon />}>
                            Refresh
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Students Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                            <TableCell>Admission No</TableCell>
                            <TableCell>Student Name</TableCell>
                            <TableCell>Class</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Risk</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : students.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography color="textSecondary">No students found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            students.map((student) => (
                                <TableRow key={student.id} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold">{student.admission_number}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                                {student.first_name?.[0]}{student.last_name?.[0]}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2">{student.first_name} {student.last_name}</Typography>
                                                <Typography variant="caption" color="textSecondary">{student.email}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{student.class_name}</TableCell>
                                    <TableCell>{student.gender}</TableCell>
                                    <TableCell>{student.phone}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={`${student.risk_score || 0}%`}
                                            size="small"
                                            color={getRiskColor(student.risk_score)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={student.enrollment_status?.toUpperCase()} 
                                            color={getStatusColor(student.enrollment_status)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="View Details">
                                            <IconButton size="small" color="info" onClick={() => handleViewStudent(student)}>
                                                <ViewIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit">
                                            <IconButton size="small" color="primary" onClick={() => handleEditStudent(student)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton size="small" color="error" onClick={() => {
                                                setSelectedStudent(student);
                                                setOpenDeleteDialog(true);
                                            }}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={students.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
                />
            </TableContainer>

            {/* Bulk Import Dialog */}
            <StudentBulkImport
                open={openBulkDialog}
                onClose={() => setOpenBulkDialog(false)}
                onSuccess={() => {
                    fetchStudents();
                    fetchStats();
                }}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete {selectedStudent?.first_name} {selectedStudent?.last_name}?
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                    <Button onClick={handleDeleteStudent} color="error" variant="contained">Delete</Button>
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

            {/* FAB for adding student */}
            <Fab
                color="primary"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                onClick={handleAddStudent}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
}

export default StudentList;