import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    Snackbar,
    LinearProgress,
    Avatar,
    Divider,
    Tabs,
    Tab
} from '@mui/material';
import {
    School as SchoolIcon,
    CheckCircle as PresentIcon,
    Cancel as AbsentIcon,
    AccessTime as LateIcon,
    MedicalServices as ExcusedIcon,
    Download as DownloadIcon,
    Print as PrintIcon,
    Notifications as NotificationIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Warning as WarningIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import api from '../../services/api';

function ParentAttendanceView() {
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedChild, setSelectedChild] = useState(null);
    const [openRequestDialog, setOpenRequestDialog] = useState(false);
    const [requestData, setRequestData] = useState({
        absence_date: new Date().toISOString().split('T')[0],
        reason: '',
        attachment: null
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchChildrenAttendance();
    }, []);

    const fetchChildrenAttendance = async () => {
        setLoading(true);
        try {
            const response = await api.get('/attendance/parent/dashboard');
            setChildren(response.data);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const requestAbsenceExcuse = async () => {
        try {
            const formData = new FormData();
            formData.append('student_id', selectedChild.id);
            formData.append('absence_date', requestData.absence_date);
            formData.append('reason', requestData.reason);
            if (requestData.attachment) {
                formData.append('attachment', requestData.attachment);
            }
            
            await api.post('/attendance/request-excuse', formData);
            setSnackbar({ open: true, message: 'Absence request submitted successfully', severity: 'success' });
            setOpenRequestDialog(false);
        } catch (error) {
            console.error('Error submitting request:', error);
            setSnackbar({ open: true, message: 'Error submitting request', severity: 'error' });
        }
    };

    const getAttendanceColor = (percentage) => {
        if (percentage >= 90) return '#4CAF50';
        if (percentage >= 75) return '#FF9800';
        return '#F44336';
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'present': return <PresentIcon sx={{ color: '#4CAF50', fontSize: 20 }} />;
            case 'absent': return <AbsentIcon sx={{ color: '#F44336', fontSize: 20 }} />;
            case 'late': return <LateIcon sx={{ color: '#FF9800', fontSize: 20 }} />;
            case 'excused': return <ExcusedIcon sx={{ color: '#2196F3', fontSize: 20 }} />;
            default: return null;
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h4" gutterBottom>Children Attendance</Typography>
                <Typography variant="body2">Monitor your children's attendance and request excused absences</Typography>
            </Paper>

            {loading ? (
                <LinearProgress />
            ) : (
                <Grid container spacing={3}>
                    {children.map((child) => (
                        <Grid item xs={12} key={child.id}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                                                {child.first_name?.[0]}{child.last_name?.[0]}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6">
                                                    {child.first_name} {child.last_name}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {child.class_name} | Admission: {child.admission_number}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Button 
                                                variant="outlined" 
                                                size="small"
                                                onClick={() => {
                                                    setSelectedChild(child);
                                                    setOpenRequestDialog(true);
                                                }}
                                            >
                                                Request Excuse
                                            </Button>
                                            <Button variant="outlined" size="small" startIcon={<DownloadIcon />}>
                                                Download Report
                                            </Button>
                                        </Box>
                                    </Box>

                                    {/* Attendance Statistics Cards */}
                                    <Grid container spacing={2} sx={{ mb: 3 }}>
                                        <Grid item xs={6} sm={3}>
                                            <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                                                <Typography variant="body2" color="textSecondary">Attendance Rate</Typography>
                                                <Typography variant="h5" sx={{ color: getAttendanceColor(child.statistics?.percentage) }}>
                                                    {child.statistics?.percentage || 0}%
                                                </Typography>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={child.statistics?.percentage || 0} 
                                                    sx={{ height: 6, borderRadius: 3 }}
                                                />
                                            </Card>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                                                <Typography variant="body2" color="textSecondary">Present</Typography>
                                                <Typography variant="h5" color="success.main">{child.statistics?.present || 0}</Typography>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                                                <Typography variant="body2" color="textSecondary">Absent</Typography>
                                                <Typography variant="h5" color="error.main">{child.statistics?.absent || 0}</Typography>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                                                <Typography variant="body2" color="textSecondary">Late</Typography>
                                                <Typography variant="h5" color="warning.main">{child.statistics?.late || 0}</Typography>
                                            </Card>
                                        </Grid>
                                    </Grid>

                                    {/* Alert if attendance is low */}
                                    {child.statistics?.percentage < 75 && (
                                        <Alert severity="warning" sx={{ mb: 2 }} icon={<WarningIcon />}>
                                            Attendance is below 75%. Please ensure regular attendance for academic success.
                                        </Alert>
                                    )}

                                    {/* Recent Attendance Table */}
                                    <Typography variant="subtitle1" gutterBottom>Recent Attendance Records</Typography>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Date</TableCell>
                                                    <TableCell>Status</TableCell>
                                                    <TableCell>Check In</TableCell>
                                                    <TableCell>Check Out</TableCell>
                                                    <TableCell>Remarks</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {child.attendance?.map((record, idx) => (
                                                    <TableRow key={idx}>
                                                        <TableCell>{new Date(record.attendance_date).toLocaleDateString()}</TableCell>
                                                        <TableCell>
                                                            <Chip 
                                                                icon={getStatusIcon(record.status)}
                                                                label={record.status.toUpperCase()}
                                                                size="small"
                                                                color={record.status === 'present' ? 'success' : record.status === 'late' ? 'warning' : 'error'}
                                                            />
                                                        </TableCell>
                                                        <TableCell>{record.check_in_time || '--:--'}</TableCell>
                                                        <TableCell>{record.check_out_time || '--:--'}</TableCell>
                                                        <TableCell>{record.remarks || '-'}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Request Excuse Dialog */}
            <Dialog open={openRequestDialog} onClose={() => setOpenRequestDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Request Excused Absence</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" gutterBottom>
                        Student: {selectedChild?.first_name} {selectedChild?.last_name}
                    </Typography>
                    <TextField
                        fullWidth
                        label="Date of Absence"
                        type="date"
                        value={requestData.absence_date}
                        onChange={(e) => setRequestData({ ...requestData, absence_date: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Reason for Absence"
                        multiline
                        rows={3}
                        value={requestData.reason}
                        onChange={(e) => setRequestData({ ...requestData, reason: e.target.value })}
                        sx={{ mt: 2 }}
                        placeholder="Please provide reason for absence..."
                    />
                    <Button
                        variant="outlined"
                        component="label"
                        sx={{ mt: 2 }}
                    >
                        Upload Supporting Document (Medical Note, etc.)
                        <input
                            type="file"
                            hidden
                            onChange={(e) => setRequestData({ ...requestData, attachment: e.target.files[0] })}
                        />
                    </Button>
                    {requestData.attachment && (
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            Selected: {requestData.attachment.name}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRequestDialog(false)}>Cancel</Button>
                    <Button onClick={requestAbsenceExcuse} variant="contained">Submit Request</Button>
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

export default ParentAttendanceView;