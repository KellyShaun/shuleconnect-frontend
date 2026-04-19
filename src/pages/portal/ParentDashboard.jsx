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
    MenuItem,
    FormControl,
    InputLabel,
    Select
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
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    CalendarToday as CalendarIcon,
    MenuBook as BookIcon,
    Message as MessageIcon,
    Payment as PaymentIcon,
    Warning as WarningIcon,
    ChildCare as ChildIcon,
    Email as EmailIcon,
    Phone as PhoneIcon
} from '@mui/icons-material';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';
import api from '../../services/api';

function ParentDashboard() {
    const [loading, setLoading] = useState(false);
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        attendance_rate: 0,
        average_score: 0,
        fee_balance: 0,
        borrowed_books: 0,
        recent_results: [],
        upcoming_assignments: [],
        attendance_trend: [],
        performance_trend: []
    });
    const [activeTab, setActiveTab] = useState(0);
    const [openFeeDialog, setOpenFeeDialog] = useState(false);
    const [openMessageDialog, setOpenMessageDialog] = useState(false);
    const [openAbsenceDialog, setOpenAbsenceDialog] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [messageData, setMessageData] = useState({ subject: '', message: '' });
    const [absenceData, setAbsenceData] = useState({ date: '', reason: '', attachment: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchChildren();
    }, []);

    useEffect(() => {
        if (selectedChild) {
            fetchChildDashboard();
        }
    }, [selectedChild]);

    const fetchChildren = async () => {
        setLoading(true);
        try {
            const response = await api.get('/parent/children');
            setChildren(response.data);
            if (response.data.length > 0) {
                setSelectedChild(response.data[0]);
            }
        } catch (error) {
            console.error('Error fetching children:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchChildDashboard = async () => {
        if (!selectedChild) return;
        
        setLoading(true);
        try {
            const response = await api.get(`/parent/child/${selectedChild.id}/dashboard`);
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePayFees = async () => {
        try {
            await api.post('/parent/pay-fees', {
                student_id: selectedChild.id,
                amount: parseFloat(paymentAmount)
            });
            setSnackbar({ open: true, message: 'Payment initiated successfully', severity: 'success' });
            setOpenFeeDialog(false);
            setPaymentAmount('');
            fetchChildDashboard();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error processing payment', severity: 'error' });
        }
    };

    const handleSendMessage = async () => {
        try {
            await api.post('/parent/send-message', {
                student_id: selectedChild.id,
                subject: messageData.subject,
                message: messageData.message
            });
            setSnackbar({ open: true, message: 'Message sent to teacher', severity: 'success' });
            setOpenMessageDialog(false);
            setMessageData({ subject: '', message: '' });
        } catch (error) {
            setSnackbar({ open: true, message: 'Error sending message', severity: 'error' });
        }
    };

    const handleRequestAbsence = async () => {
        const formData = new FormData();
        formData.append('student_id', selectedChild.id);
        formData.append('absence_date', absenceData.date);
        formData.append('reason', absenceData.reason);
        if (absenceData.attachment) {
            formData.append('attachment', absenceData.attachment);
        }
        
        try {
            await api.post('/parent/request-absence', formData);
            setSnackbar({ open: true, message: 'Absence request submitted', severity: 'success' });
            setOpenAbsenceDialog(false);
            setAbsenceData({ date: '', reason: '', attachment: null });
        } catch (error) {
            setSnackbar({ open: true, message: 'Error submitting request', severity: 'error' });
        }
    };

    const downloadReportCard = async (termId) => {
        try {
            const response = await api.get(`/parent/report-card/${selectedChild.id}/${termId}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report_card_${selectedChild.admission_number}_term_${termId}.pdf`);
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

    if (loading && children.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (children.length === 0) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="info">No children linked to your account. Please contact the school administrator.</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)', color: 'white' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Parent Portal
                        </Typography>
                        <Typography variant="body2">Monitor your child's academic progress, attendance, and fees</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button 
                            variant="contained" 
                            sx={{ bgcolor: 'white', color: '#2E7D32' }}
                            startIcon={<PaymentIcon />}
                            onClick={() => setOpenFeeDialog(true)}
                        >
                            Pay Fees
                        </Button>
                        <Button 
                            variant="outlined" 
                            sx={{ borderColor: 'white', color: 'white' }}
                            startIcon={<MessageIcon />}
                            onClick={() => setOpenMessageDialog(true)}
                        >
                            Message Teacher
                        </Button>
                        <Button 
                            variant="outlined" 
                            sx={{ borderColor: 'white', color: 'white' }}
                            startIcon={<WarningIcon />}
                            onClick={() => setOpenAbsenceDialog(true)}
                        >
                            Request Absence
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* Child Selector */}
            {children.length > 1 && (
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>Select Child</Typography>
                    <Grid container spacing={2}>
                        {children.map(child => (
                            <Grid item key={child.id}>
                                <Button
                                    variant={selectedChild?.id === child.id ? 'contained' : 'outlined'}
                                    onClick={() => setSelectedChild(child)}
                                    startIcon={<ChildIcon />}
                                >
                                    {child.first_name} {child.last_name} - {child.class_name}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            )}

            {selectedChild && (
                <>
                    {/* Child Info Header */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                <Avatar sx={{ width: 60, height: 60, bgcolor: '#2E7D32' }}>
                                    {selectedChild.first_name?.[0]}{selectedChild.last_name?.[0]}
                                </Avatar>
                                <Box>
                                    <Typography variant="h5">{selectedChild.first_name} {selectedChild.last_name}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {selectedChild.class_name} | Admission: {selectedChild.admission_number}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                        <Chip label="Active Student" size="small" color="success" />
                                        <Chip label={selectedChild.student_type === 'boarding' ? 'Boarding' : 'Day Scholar'} size="small" />
                                    </Box>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Quick Stats Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ textAlign: 'center' }}>
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
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>Average Score</Typography>
                                    <Typography variant="h2" color="primary.main">{dashboardData.average_score}%</Typography>
                                    <LinearProgress variant="determinate" value={dashboardData.average_score} sx={{ mt: 2, height: 8, borderRadius: 4 }} />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ bgcolor: dashboardData.fee_balance > 0 ? '#FFF3E0' : '#E8F5E9' }}>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>Fee Balance</Typography>
                                    <Typography variant="h4" color={dashboardData.fee_balance > 0 ? 'warning.main' : 'success.main'}>
                                        KES {dashboardData.fee_balance?.toLocaleString()}
                                    </Typography>
                                    {dashboardData.fee_balance > 0 && (
                                        <Button size="small" startIcon={<PaymentIcon />} onClick={() => setOpenFeeDialog(true)} sx={{ mt: 1 }}>
                                            Pay Now
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
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Tabs */}
                    <Paper sx={{ mb: 3 }}>
                        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} variant="scrollable" scrollButtons="auto">
                            <Tab label="Overview" />
                            <Tab label="Academic Performance" />
                            <Tab label="Attendance" />
                            <Tab label="Fee Details" />
                            <Tab label="Library" />
                            <Tab label="Communication" />
                        </Tabs>

                        {/* Overview Tab */}
                        {activeTab === 0 && (
                            <Box sx={{ p: 3 }}>
                                <Grid container spacing={3}>
                                    {/* Performance Chart */}
                                    <Grid item xs={12} md={7}>
                                        <Typography variant="h6" gutterBottom>Performance Trend</Typography>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <LineChart data={dashboardData.performance_trend}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="exam" />
                                                        <YAxis domain={[0, 100]} />
                                                        <ReTooltip />
                                                        <Legend />
                                                        <Line type="monotone" dataKey="score" stroke="#2E7D32" name="Your Child's Score" />
                                                        <Line type="monotone" dataKey="class_avg" stroke="#1976D2" name="Class Average" />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    {/* Attendance Chart */}
                                    <Grid item xs={12} md={5}>
                                        <Typography variant="h6" gutterBottom>Attendance Summary</Typography>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <ResponsiveContainer width="100%" height={250}>
                                                    <PieChart>
                                                        <Pie
                                                            data={[
                                                                { name: 'Present', value: dashboardData.attendance_rate, color: '#4CAF50' },
                                                                { name: 'Absent', value: 100 - dashboardData.attendance_rate, color: '#F44336' }
                                                            ]}
                                                            cx="50%"
                                                            cy="50%"
                                                            labelLine={false}
                                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                            outerRadius={80}
                                                            dataKey="value"
                                                        >
                                                            <Cell fill="#4CAF50" />
                                                            <Cell fill="#F44336" />
                                                        </Pie>
                                                        <ReTooltip />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    {/* Recent Results */}
                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>Recent Results</Typography>
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

                        {/* Academic Performance Tab */}
                        {activeTab === 1 && (
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>Subject-wise Performance</Typography>
                                <Card variant="outlined" sx={{ mb: 3 }}>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <BarChart data={dashboardData.subject_performance}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="subject" />
                                                <YAxis domain={[0, 100]} />
                                                <ReTooltip />
                                                <Legend />
                                                <Bar dataKey="your_score" fill="#2E7D32" name="Your Child's Score" />
                                                <Bar dataKey="class_avg" fill="#1976D2" name="Class Average" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                                
                                <Typography variant="h6" gutterBottom>Term Summary</Typography>
                                <TableContainer component={Paper} variant="outlined">
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Term</TableCell>
                                                <TableCell align="center">Average Score</TableCell>
                                                <TableCell align="center">Mean Grade</TableCell>
                                                <TableCell align="center">Position</TableCell>
                                                <TableCell align="center">Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {dashboardData.term_summary?.map((term, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell>{term.term_name} - {term.academic_year}</TableCell>
                                                    <TableCell align="center">{term.average_score}%</TableCell>
                                                    <TableCell align="center">
                                                        <Chip label={term.mean_grade} color={getGradeColor(term.mean_grade)} size="small" />
                                                    </TableCell>
                                                    <TableCell align="center">{term.position}</TableCell>
                                                    <TableCell align="center">
                                                        <Button size="small" startIcon={<DownloadIcon />} onClick={() => downloadReportCard(term.term_id)}>
                                                            Report Card
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}

                        {/* Attendance Tab */}
                        {activeTab === 2 && (
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>Attendance Trend</Typography>
                                <Card variant="outlined" sx={{ mb: 3 }}>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <AreaChart data={dashboardData.attendance_trend}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <ReTooltip />
                                                <Legend />
                                                <Area type="monotone" dataKey="present" stackId="1" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.6} name="Present" />
                                                <Area type="monotone" dataKey="absent" stackId="1" stroke="#F44336" fill="#F44336" fillOpacity={0.6} name="Absent" />
                                                <Area type="monotone" dataKey="late" stackId="1" stroke="#FF9800" fill="#FF9800" fillOpacity={0.6} name="Late" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                                
                                <Typography variant="h6" gutterBottom>Monthly Attendance Summary</Typography>
                                <TableContainer component={Paper} variant="outlined">
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Month</TableCell>
                                                <TableCell align="center">Present</TableCell>
                                                <TableCell align="center">Absent</TableCell>
                                                <TableCell align="center">Late</TableCell>
                                                <TableCell align="center">Attendance Rate</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {dashboardData.monthly_attendance?.map((month, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell>{month.month}</TableCell>
                                                    <TableCell align="center">{month.present}</TableCell>
                                                    <TableCell align="center">{month.absent}</TableCell>
                                                    <TableCell align="center">{month.late}</TableCell>
                                                    <TableCell align="center">
                                                        <Chip label={`${month.rate}%`} color={getAttendanceColor(month.rate)} size="small" />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}

                        {/* Fee Details Tab */}
                        {activeTab === 3 && (
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>Fee Breakdown</Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                        <Card sx={{ bgcolor: '#E8F5E9' }}>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography color="textSecondary" gutterBottom>Total Expected</Typography>
                                                <Typography variant="h4">KES {dashboardData.total_fees?.toLocaleString()}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Card sx={{ bgcolor: '#E3F2FD' }}>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography color="textSecondary" gutterBottom>Total Paid</Typography>
                                                <Typography variant="h4" color="success.main">KES {dashboardData.total_paid?.toLocaleString()}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Card sx={{ bgcolor: dashboardData.fee_balance > 0 ? '#FFF3E0' : '#E8F5E9' }}>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography color="textSecondary" gutterBottom>Balance</Typography>
                                                <Typography variant="h4" color={dashboardData.fee_balance > 0 ? 'warning.main' : 'success.main'}>
                                                    KES {dashboardData.fee_balance?.toLocaleString()}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                                
                                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Payment History</Typography>
                                <TableContainer component={Paper} variant="outlined">
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Receipt No</TableCell>
                                                <TableCell align="right">Amount (KES)</TableCell>
                                                <TableCell>Method</TableCell>
                                                <TableCell>Reference</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {dashboardData.payment_history?.map((payment, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                                                    <TableCell>{payment.receipt_number}</TableCell>
                                                    <TableCell align="right">{payment.amount?.toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <Chip label={payment.payment_method} size="small" />
                                                    </TableCell>
                                                    <TableCell>{payment.reference || '-'}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}

                        {/* Library Tab */}
                        {activeTab === 4 && (
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>Borrowed Books</Typography>
                                {dashboardData.borrowed_books_list?.map((book, idx) => (
                                    <Card key={idx} variant="outlined" sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
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
                                                <Button variant="outlined" size="small">Renew Book</Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        )}

                        {/* Communication Tab */}
                        {activeTab === 5 && (
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>Recent Messages</Typography>
                                {dashboardData.messages?.map((msg, idx) => (
                                    <Card key={idx} variant="outlined" sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Typography variant="subtitle2">{msg.subject}</Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                From: {msg.sender_name} | {new Date(msg.created_at).toLocaleString()}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 1 }}>{msg.message}</Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        )}
                    </Paper>
                </>
            )}

            {/* Pay Fees Dialog */}
            <Dialog open={openFeeDialog} onClose={() => setOpenFeeDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Pay School Fees</DialogTitle>
                <DialogContent>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Outstanding Balance: KES {dashboardData.fee_balance?.toLocaleString()}
                    </Alert>
                    <TextField
                        fullWidth
                        label="Amount (KES)"
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Payment Method</InputLabel>
                        <Select defaultValue="mpesa">
                            <MenuItem value="mpesa">M-Pesa</MenuItem>
                            <MenuItem value="bank">Bank Transfer</MenuItem>
                            <MenuItem value="card">Credit/Debit Card</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenFeeDialog(false)}>Cancel</Button>
                    <Button onClick={handlePayFees} variant="contained">Proceed to Pay</Button>
                </DialogActions>
            </Dialog>

            {/* Message Teacher Dialog */}
            <Dialog open={openMessageDialog} onClose={() => setOpenMessageDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Message Teacher</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Subject"
                        value={messageData.subject}
                        onChange={(e) => setMessageData({ ...messageData, subject: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Message"
                        value={messageData.message}
                        onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenMessageDialog(false)}>Cancel</Button>
                    <Button onClick={handleSendMessage} variant="contained">Send Message</Button>
                </DialogActions>
            </Dialog>

            {/* Request Absence Dialog */}
            <Dialog open={openAbsenceDialog} onClose={() => setOpenAbsenceDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Request Excused Absence</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Date of Absence"
                        type="date"
                        value={absenceData.date}
                        onChange={(e) => setAbsenceData({ ...absenceData, date: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Reason for Absence"
                        value={absenceData.reason}
                        onChange={(e) => setAbsenceData({ ...absenceData, reason: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <Button variant="outlined" component="label">
                        Upload Supporting Document
                        <input type="file" hidden onChange={(e) => setAbsenceData({ ...absenceData, attachment: e.target.files[0] })} />
                    </Button>
                    {absenceData.attachment && (
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            Selected: {absenceData.attachment.name}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAbsenceDialog(false)}>Cancel</Button>
                    <Button onClick={handleRequestAbsence} variant="contained">Submit Request</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default ParentDashboard;