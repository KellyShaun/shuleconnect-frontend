import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Button,
    Avatar,
    Chip,
    LinearProgress,
    CircularProgress,
    Alert,
    Snackbar,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Badge,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemAvatar
} from '@mui/material';
import {
    School as SchoolIcon,
    CheckCircle as PresentIcon,
    Cancel as AbsentIcon,
    AccessTime as LateIcon,
    Assignment as AssignmentIcon,
    LibraryBooks as LibraryIcon,
    AttachMoney as MoneyIcon,
    Schedule as ScheduleIcon,
    Notifications as NotificationIcon,
    Download as DownloadIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    Lock as LockIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    CalendarToday as CalendarIcon,
    MenuBook as BookIcon,
    Message as MessageIcon,
    Settings as SettingsIcon,
    Person as PersonIcon,
    Assessment as AssessmentIcon
} from '@mui/icons-material';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import api from '../../services/api';

function StudentDashboard() {
    const [loading, setLoading] = useState(false);
    const [studentData, setStudentData] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        attendance_rate: 0,
        average_score: 0,
        pending_assignments: 0,
        borrowed_books: 0,
        today_schedule: [],
        announcements: [],
        recent_results: [],
        fee_balance: 0,
        upcoming_assignments: [],
        borrowed_books_list: []
    });
    const [activeTab, setActiveTab] = useState(0);
    const [openProfileDialog, setOpenProfileDialog] = useState(false);
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '', confirm_password: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchStudentData();
        fetchDashboardData();
    }, []);

    const fetchStudentData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/student/profile');
            setStudentData(response.data);
        } catch (error) {
            console.error('Error fetching student data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/student/dashboard');
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.new_password !== passwordData.confirm_password) {
            setSnackbar({ open: true, message: 'Passwords do not match', severity: 'error' });
            return;
        }
        
        try {
            await api.post('/student/change-password', {
                current_password: passwordData.current_password,
                new_password: passwordData.new_password
            });
            setSnackbar({ open: true, message: 'Password changed successfully', severity: 'success' });
            setOpenPasswordDialog(false);
            setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
        } catch (error) {
            setSnackbar({ open: true, message: 'Error changing password', severity: 'error' });
        }
    };

    const downloadReportCard = async (termId) => {
        try {
            const response = await api.get(`/student/report-card/${termId}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report_card_term_${termId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading report card:', error);
        }
    };

    const getAttendanceColor = (rate) => {
        if (rate >= 90) return '#4CAF50';
        if (rate >= 75) return '#FF9800';
        return '#F44336';
    };

    const getGradeColor = (grade) => {
        if (grade === 'A' || grade === 'A-') return '#4CAF50';
        if (grade === 'B+' || grade === 'B' || grade === 'B-') return '#2196F3';
        if (grade === 'C+' || grade === 'C' || grade === 'C-') return '#FF9800';
        return '#F44336';
    };

    const attendanceData = [
        { name: 'Present', value: dashboardData.attendance_rate, color: '#4CAF50' },
        { name: 'Absent', value: 100 - dashboardData.attendance_rate, color: '#F44336' }
    ];

    return (
        <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
            {/* Welcome Header */}
            <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)', color: 'white' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 80, height: 80, bgcolor: '#F57C00', fontSize: 40 }}>
                            {studentData?.first_name?.[0]}{studentData?.last_name?.[0]}
                        </Avatar>
                        <Box>
                            <Typography variant="h4">Welcome back, {studentData?.first_name}!</Typography>
                            <Typography variant="subtitle1">
                                {studentData?.class_name} | Admission: {studentData?.admission_number}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Chip label="Active Student" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                                <Chip label={studentData?.student_type === 'boarding' ? 'Boarding' : 'Day Scholar'} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                            </Box>
                        </Box>
                    </Box>
                    <Box>
                        <Tooltip title="Profile Settings">
                            <IconButton sx={{ color: 'white' }} onClick={() => setOpenProfileDialog(true)}>
                                <PersonIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Change Password">
                            <IconButton sx={{ color: 'white' }} onClick={() => setOpenPasswordDialog(true)}>
                                <LockIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </Paper>

            {/* Quick Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: 'center', position: 'relative', overflow: 'visible' }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Attendance Rate</Typography>
                            <Box sx={{ position: 'relative', display: 'inline-flex', mt: 1 }}>
                                <CircularProgress
                                    variant="determinate"
                                    value={dashboardData.attendance_rate}
                                    size={80}
                                    thickness={5}
                                    sx={{ color: getAttendanceColor(dashboardData.attendance_rate) }}
                                />
                                <Box sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography variant="h6">{dashboardData.attendance_rate}%</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
                                <Chip icon={<PresentIcon />} label="Present" size="small" color="success" />
                                <Chip icon={<AbsentIcon />} label="Absent" size="small" color="error" />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Current Average</Typography>
                            <Typography variant="h2" color="primary.main">{dashboardData.average_score}%</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                                <Typography variant="caption" color="success.main">+5% from last term</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={dashboardData.average_score} sx={{ mt: 2, height: 8, borderRadius: 4 }} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: '#FFF3E0' }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Pending Assignments</Typography>
                            <Typography variant="h2" color="warning.main">{dashboardData.pending_assignments}</Typography>
                            <Typography variant="caption">Tasks due soon</Typography>
                            {dashboardData.pending_assignments > 0 && (
                                <Button size="small" sx={{ mt: 1 }} startIcon={<AssignmentIcon />}>
                                    View Tasks
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: '#E3F2FD' }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Library Books</Typography>
                            <Typography variant="h2" color="info.main">{dashboardData.borrowed_books}</Typography>
                            <Typography variant="caption">Currently borrowed</Typography>
                            {dashboardData.borrowed_books > 0 && (
                                <Button size="small" sx={{ mt: 1 }} startIcon={<LibraryIcon />}>
                                    View Books
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Main Content Tabs */}
            <Paper sx={{ mb: 3 }}>
                <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} variant="scrollable" scrollButtons="auto">
                    <Tab label="Overview" />
                    <Tab label="Timetable" />
                    <Tab label="Assignments" />
                    <Tab label="Results" />
                    <Tab label="Library" />
                    <Tab label="Fees" />
                </Tabs>

                {/* Overview Tab */}
                {activeTab === 0 && (
                    <Box sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            {/* Today's Schedule */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>
                                    <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Today's Schedule
                                </Typography>
                                <TableContainer component={Paper} variant="outlined">
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                                <TableCell>Time</TableCell>
                                                <TableCell>Subject</TableCell>
                                                <TableCell>Teacher</TableCell>
                                                <TableCell>Room</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {dashboardData.today_schedule?.map((item, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell>{item.start_time} - {item.end_time}</TableCell>
                                                    <TableCell>{item.subject_name}</TableCell>
                                                    <TableCell>{item.teacher_name}</TableCell>
                                                    <TableCell>{item.room_name || 'TBA'}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>

                            {/* Recent Announcements */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>
                                    <NotificationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Announcements
                                </Typography>
                                {dashboardData.announcements?.map((ann, idx) => (
                                    <Card key={idx} variant="outlined" sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Typography variant="subtitle2">{ann.title}</Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {new Date(ann.date).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 1 }}>{ann.message}</Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Grid>

                            {/* Recent Results */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    <AssessmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Recent Performance
                                </Typography>
                                <TableContainer component={Paper} variant="outlined">
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                                <TableCell>Subject</TableCell>
                                                <TableCell align="center">Score</TableCell>
                                                <TableCell align="center">Grade</TableCell>
                                                <TableCell align="center">Class Average</TableCell>
                                                <TableCell align="center">Status</TableCell>
                                                <TableCell align="center">Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {dashboardData.recent_results?.map((result, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell>{result.subject_name}</TableCell>
                                                    <TableCell align="center">{result.score}%</TableCell>
                                                    <TableCell align="center">
                                                        <Chip label={result.grade} color={getGradeColor(result.grade)} size="small" />
                                                    </TableCell>
                                                    <TableCell align="center">{result.class_average}%</TableCell>
                                                    <TableCell align="center">
                                                        {result.score >= result.class_average ? (
                                                            <Chip label="Above Average" size="small" color="success" icon={<TrendingUpIcon />} />
                                                        ) : (
                                                            <Chip label="Below Average" size="small" color="error" icon={<TrendingDownIcon />} />
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Button size="small" startIcon={<DownloadIcon />} onClick={() => downloadReportCard(result.term_id)}>
                                                            Report Card
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {/* Timetable Tab */}
                {activeTab === 1 && (
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Weekly Timetable</Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableCell>Time</TableCell>
                                        <TableCell>Monday</TableCell>
                                        <TableCell>Tuesday</TableCell>
                                        <TableCell>Wednesday</TableCell>
                                        <TableCell>Thursday</TableCell>
                                        <TableCell>Friday</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* Timetable rows - to be populated from API */}
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            <Typography color="textSecondary">Loading timetable...</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {/* Assignments Tab */}
                {activeTab === 2 && (
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Upcoming Assignments</Typography>
                        {dashboardData.upcoming_assignments?.map((assignment, idx) => (
                            <Card key={idx} variant="outlined" sx={{ mb: 2 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography variant="subtitle1">{assignment.title}</Typography>
                                            <Typography variant="body2" color="textSecondary">{assignment.subject_name}</Typography>
                                            <Typography variant="body2" sx={{ mt: 1 }}>{assignment.description}</Typography>
                                            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                                <Chip label={`Due: ${new Date(assignment.due_date).toLocaleDateString()}`} size="small" color="warning" />
                                                <Chip label={`Max Score: ${assignment.max_score}`} size="small" />
                                            </Box>
                                        </Box>
                                        <Button variant="contained" size="small">Submit Assignment</Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}

                {/* Results Tab */}
                {activeTab === 3 && (
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Performance Analysis</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="subtitle1" gutterBottom>Performance Trend</Typography>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={dashboardData.performance_trend}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="term" />
                                                <YAxis domain={[0, 100]} />
                                                <ReTooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="score" stroke="#2E7D32" name="Your Score" />
                                                <Line type="monotone" dataKey="class_avg" stroke="#1976D2" name="Class Average" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="subtitle1" gutterBottom>Subject-wise Performance</Typography>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={dashboardData.subject_performance}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="subject" />
                                                <YAxis domain={[0, 100]} />
                                                <ReTooltip />
                                                <Legend />
                                                <Bar dataKey="your_score" fill="#2E7D32" name="Your Score" />
                                                <Bar dataKey="class_avg" fill="#1976D2" name="Class Average" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {/* Library Tab */}
                {activeTab === 4 && (
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>My Borrowed Books</Typography>
                        {dashboardData.borrowed_books_list?.map((book, idx) => (
                            <Card key={idx} variant="outlined" sx={{ mb: 2 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="subtitle1">{book.title}</Typography>
                                            <Typography variant="body2" color="textSecondary">{book.author}</Typography>
                                            <Typography variant="caption" display="block">
                                                Borrowed: {new Date(book.borrowed_date).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="caption" display="block" color={new Date(book.due_date) < new Date() ? 'error' : 'textSecondary'}>
                                                Due: {new Date(book.due_date).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                        <Button variant="outlined" size="small">Renew</Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}

                {/* Fees Tab */}
                {activeTab === 5 && (
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Fee Summary</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography color="textSecondary" gutterBottom>Total Expected</Typography>
                                        <Typography variant="h4">KES {dashboardData.fee_expected?.toLocaleString()}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card sx={{ bgcolor: '#E8F5E9' }}>
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography color="textSecondary" gutterBottom>Total Paid</Typography>
                                        <Typography variant="h4" color="success.main">KES {dashboardData.fee_paid?.toLocaleString()}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card sx={{ bgcolor: dashboardData.fee_balance > 0 ? '#FFEBEE' : '#E8F5E9' }}>
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography color="textSecondary" gutterBottom>Balance</Typography>
                                        <Typography variant="h4" color={dashboardData.fee_balance > 0 ? 'error.main' : 'success.main'}>
                                            KES {dashboardData.fee_balance?.toLocaleString()}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Paper>

            {/* Profile Settings Dialog */}
            <Dialog open={openProfileDialog} onClose={() => setOpenProfileDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Profile Settings</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} display="flex" justifyContent="center">
                            <Avatar sx={{ width: 100, height: 100, bgcolor: '#2E7D32', fontSize: 48 }}>
                                {studentData?.first_name?.[0]}{studentData?.last_name?.[0]}
                            </Avatar>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Full Name" value={`${studentData?.first_name} ${studentData?.last_name}`} disabled />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Email" value={studentData?.email} disabled />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Phone" value={studentData?.phone} disabled />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Class" value={studentData?.class_name} disabled />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Admission Number" value={studentData?.admission_number} disabled />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenProfileDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Change Password Dialog */}
            <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField fullWidth type="password" label="Current Password" value={passwordData.current_password} onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth type="password" label="New Password" value={passwordData.new_password} onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth type="password" label="Confirm New Password" value={passwordData.confirm_password} onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
                    <Button onClick={handlePasswordChange} variant="contained">Change Password</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}

export default StudentDashboard;