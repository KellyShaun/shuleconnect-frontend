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
    InputLabel,
    Badge
} from '@mui/material';
import {
    People as PeopleIcon,
    Add as AddIcon,
    EventNote as LeaveIcon,
    AttachMoney as PayrollIcon,
    Assignment as ContractIcon,
    School as TrainingIcon,
    Description as DocumentIcon,
    TrendingUp as TrendingUpIcon,
    Warning as WarningIcon,
    CheckCircle as CheckIcon,
    Refresh as RefreshIcon,
    Download as DownloadIcon,
    Print as PrintIcon,
    Email as EmailIcon,
    Phone as PhoneIcon
} from '@mui/icons-material';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../services/api';

function HRDashboard() {
    const [dashboardData, setDashboardData] = useState({
        staff_by_department: [],
        pending_leave_requests: 0,
        expiring_contracts: 0,
        staff_on_leave_today: 0,
        attendance_rate: 0
    });
    const [staff, setStaff] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [openStaffDialog, setOpenStaffDialog] = useState(false);
    const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
    const [openPayrollDialog, setOpenPayrollDialog] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [staffForm, setStaffForm] = useState({
        user_id: '',
        job_title: '',
        department: '',
        employment_type: 'permanent',
        tsc_number: '',
        kra_pin: '',
        nssf_number: '',
        nhif_number: '',
        bank_name: '',
        bank_account: '',
        joining_date: '',
        highest_qualification: ''
    });
    const [leaveForm, setLeaveForm] = useState({
        staff_id: '',
        leave_type_id: '',
        start_date: '',
        end_date: '',
        reason: ''
    });
    const [payrollForm, setPayrollForm] = useState({
        payroll_month: new Date().toISOString().slice(0, 7),
        staff_ids: []
    });

    useEffect(() => {
        fetchDashboard();
        fetchStaff();
        fetchLeaveRequests();
        fetchLeaveTypes();
    }, []);

    const fetchDashboard = async () => {
        setLoading(true);
        try {
            const response = await api.get('/hr/dashboard');
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStaff = async () => {
        try {
            const response = await api.get('/hr/staff');
            setStaff(response.data.staff || []);
        } catch (error) {
            console.error('Error fetching staff:', error);
        }
    };

    const fetchLeaveRequests = async () => {
        try {
            const response = await api.get('/hr/leave/requests');
            setLeaveRequests(response.data);
        } catch (error) {
            console.error('Error fetching leave requests:', error);
        }
    };

    const fetchLeaveTypes = async () => {
        try {
            const response = await api.get('/hr/leave/types');
            setLeaveTypes(response.data);
        } catch (error) {
            console.error('Error fetching leave types:', error);
        }
    };

    const handleCreateStaff = async () => {
        try {
            await api.post('/hr/staff', staffForm);
            setSnackbar({ open: true, message: 'Staff record created successfully', severity: 'success' });
            setOpenStaffDialog(false);
            fetchStaff();
            resetStaffForm();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error creating staff record', severity: 'error' });
        }
    };

    const handleSubmitLeave = async () => {
        try {
            await api.post('/hr/leave/requests', leaveForm);
            setSnackbar({ open: true, message: 'Leave request submitted successfully', severity: 'success' });
            setOpenLeaveDialog(false);
            fetchLeaveRequests();
            resetLeaveForm();
        } catch (error) {
            setSnackbar({ open: true, message: error.response?.data?.error || 'Error submitting leave request', severity: 'error' });
        }
    };

    const handleProcessPayroll = async () => {
        try {
            const response = await api.post('/hr/payroll/process', payrollForm);
            setSnackbar({ open: true, message: `Payroll processed: KES ${response.data.summary.total_net.toLocaleString()}`, severity: 'success' });
            setOpenPayrollDialog(false);
        } catch (error) {
            setSnackbar({ open: true, message: 'Error processing payroll', severity: 'error' });
        }
    };

    const handleApproveLeave = async (id, status) => {
        try {
            await api.put(`/hr/leave/requests/${id}/approve`, { status });
            setSnackbar({ open: true, message: `Leave request ${status}`, severity: 'success' });
            fetchLeaveRequests();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error updating leave request', severity: 'error' });
        }
    };

    const resetStaffForm = () => {
        setStaffForm({
            user_id: '',
            job_title: '',
            department: '',
            employment_type: 'permanent',
            tsc_number: '',
            kra_pin: '',
            nssf_number: '',
            nhif_number: '',
            bank_name: '',
            bank_account: '',
            joining_date: '',
            highest_qualification: ''
        });
    };

    const resetLeaveForm = () => {
        setLeaveForm({
            staff_id: '',
            leave_type_id: '',
            start_date: '',
            end_date: '',
            reason: ''
        });
    };

    const departmentData = dashboardData.staff_by_department || [];

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            <PeopleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            HR & Payroll Management
                        </Typography>
                        <Typography variant="body2">Manage staff, leave, payroll, and HR operations</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button 
                            variant="contained" 
                            sx={{ bgcolor: 'white', color: 'primary.main' }}
                            startIcon={<AddIcon />}
                            onClick={() => setOpenStaffDialog(true)}
                        >
                            Add Staff
                        </Button>
                        <Button 
                            variant="outlined" 
                            sx={{ borderColor: 'white', color: 'white' }}
                            startIcon={<PayrollIcon />}
                            onClick={() => setOpenPayrollDialog(true)}
                        >
                            Process Payroll
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Total Staff</Typography>
                            <Typography variant="h4">{staff.length}</Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Chip label="Active" size="small" color="success" />
                                <Chip label="On Leave" size="small" color="warning" />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: '#FFF3E0' }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Pending Leave</Typography>
                            <Typography variant="h4" color="warning.main">{dashboardData.pending_leave_requests}</Typography>
                            <Typography variant="caption">Requests awaiting approval</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: '#FFEBEE' }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Expiring Contracts</Typography>
                            <Typography variant="h4" color="error.main">{dashboardData.expiring_contracts}</Typography>
                            <Typography variant="caption">Within 30 days</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Attendance Rate</Typography>
                            <Typography variant="h4">{dashboardData.attendance_rate}%</Typography>
                            <LinearProgress variant="determinate" value={dashboardData.attendance_rate} sx={{ mt: 1 }} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Department Distribution */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Staff by Department</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={departmentData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="department" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#2E7D32" name="Staff Count" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Button fullWidth variant="outlined" startIcon={<LeaveIcon />} onClick={() => setOpenLeaveDialog(true)}>
                                    Request Leave
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button fullWidth variant="outlined" startIcon={<DocumentIcon />}>
                                    Upload Document
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button fullWidth variant="outlined" startIcon={<ContractIcon />}>
                                    View Contracts
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button fullWidth variant="outlined" startIcon={<TrainingIcon />}>
                                    Training Records
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* Tabs */}
            <Paper sx={{ mb: 3 }}>
                <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                    <Tab label="Staff Directory" />
                    <Tab label="Leave Requests" />
                    <Tab label="Payroll History" />
                </Tabs>

                {/* Staff Directory Tab */}
                {activeTab === 0 && (
                    <Box sx={{ p: 3 }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Staff Number</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Job Title</TableCell>
                                        <TableCell>Department</TableCell>
                                        <TableCell>Employment Type</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {staff.map((employee) => (
                                        <TableRow key={employee.id} hover>
                                            <TableCell>{employee.staff_number}</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Avatar sx={{ width: 32, height: 32 }}>
                                                        {employee.first_name?.[0]}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body2">{employee.first_name} {employee.last_name}</Typography>
                                                        <Typography variant="caption" color="textSecondary">{employee.email}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{employee.job_title}</TableCell>
                                            <TableCell>{employee.department}</TableCell>
                                            <TableCell>
                                                <Chip label={employee.employment_type} size="small" />
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={employee.is_active ? 'Active' : 'Inactive'} 
                                                    color={employee.is_active ? 'success' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton size="small" color="info">
                                                    <DownloadIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" color="primary">
                                                    <EmailIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small">
                                                    <PhoneIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {/* Leave Requests Tab */}
                {activeTab === 1 && (
                    <Box sx={{ p: 3 }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Staff</TableCell>
                                        <TableCell>Leave Type</TableCell>
                                        <TableCell>Period</TableCell>
                                        <TableCell>Days</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {leaveRequests.map((request) => (
                                        <TableRow key={request.id} hover>
                                            <TableCell>{request.first_name} {request.last_name}</TableCell>
                                            <TableCell>{request.leave_name}</TableCell>
                                            <TableCell>
                                                {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>{request.total_days}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={request.status} 
                                                    color={request.status === 'approved' ? 'success' : request.status === 'pending' ? 'warning' : 'error'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                {request.status === 'pending' && (
                                                    <>
                                                        <Button size="small" color="success" onClick={() => handleApproveLeave(request.id, 'approved')}>
                                                            Approve
                                                        </Button>
                                                        <Button size="small" color="error" onClick={() => handleApproveLeave(request.id, 'rejected')}>
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {/* Payroll History Tab */}
                {activeTab === 2 && (
                    <Box sx={{ p: 3 }}>
                        <Typography variant="body2" color="textSecondary">Payroll history will appear here after processing</Typography>
                    </Box>
                )}
            </Paper>

            {/* Add Staff Dialog */}
            <Dialog open={openStaffDialog} onClose={() => setOpenStaffDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="User ID"
                                value={staffForm.user_id}
                                onChange={(e) => setStaffForm({ ...staffForm, user_id: e.target.value })}
                                placeholder="Select user ID from existing users"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Job Title"
                                value={staffForm.job_title}
                                onChange={(e) => setStaffForm({ ...staffForm, job_title: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Department"
                                value={staffForm.department}
                                onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Employment Type</InputLabel>
                                <Select
                                    value={staffForm.employment_type}
                                    onChange={(e) => setStaffForm({ ...staffForm, employment_type: e.target.value })}
                                >
                                    <MenuItem value="permanent">Permanent</MenuItem>
                                    <MenuItem value="contract">Contract</MenuItem>
                                    <MenuItem value="part-time">Part Time</MenuItem>
                                    <MenuItem value="casual">Casual</MenuItem>
                                    <MenuItem value="internship">Internship</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="TSC Number"
                                value={staffForm.tsc_number}
                                onChange={(e) => setStaffForm({ ...staffForm, tsc_number: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="KRA PIN"
                                value={staffForm.kra_pin}
                                onChange={(e) => setStaffForm({ ...staffForm, kra_pin: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="NSSF Number"
                                value={staffForm.nssf_number}
                                onChange={(e) => setStaffForm({ ...staffForm, nssf_number: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="NHIF Number"
                                value={staffForm.nhif_number}
                                onChange={(e) => setStaffForm({ ...staffForm, nhif_number: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Bank Name"
                                value={staffForm.bank_name}
                                onChange={(e) => setStaffForm({ ...staffForm, bank_name: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Bank Account"
                                value={staffForm.bank_account}
                                onChange={(e) => setStaffForm({ ...staffForm, bank_account: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Joining Date"
                                type="date"
                                value={staffForm.joining_date}
                                onChange={(e) => setStaffForm({ ...staffForm, joining_date: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Highest Qualification"
                                value={staffForm.highest_qualification}
                                onChange={(e) => setStaffForm({ ...staffForm, highest_qualification: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenStaffDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateStaff} variant="contained">Add Staff</Button>
                </DialogActions>
            </Dialog>

            {/* Leave Request Dialog */}
            <Dialog open={openLeaveDialog} onClose={() => setOpenLeaveDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Request Leave</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Select Staff</InputLabel>
                                <Select
                                    value={leaveForm.staff_id}
                                    onChange={(e) => setLeaveForm({ ...leaveForm, staff_id: e.target.value })}
                                >
                                    {staff.map(s => (
                                        <MenuItem key={s.id} value={s.id}>{s.first_name} {s.last_name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Leave Type</InputLabel>
                                <Select
                                    value={leaveForm.leave_type_id}
                                    onChange={(e) => setLeaveForm({ ...leaveForm, leave_type_id: e.target.value })}
                                >
                                    {leaveTypes.map(lt => (
                                        <MenuItem key={lt.id} value={lt.id}>{lt.leave_name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Start Date"
                                type="date"
                                value={leaveForm.start_date}
                                onChange={(e) => setLeaveForm({ ...leaveForm, start_date: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="End Date"
                                type="date"
                                value={leaveForm.end_date}
                                onChange={(e) => setLeaveForm({ ...leaveForm, end_date: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Reason"
                                value={leaveForm.reason}
                                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenLeaveDialog(false)}>Cancel</Button>
                    <Button onClick={handleSubmitLeave} variant="contained">Submit Request</Button>
                </DialogActions>
            </Dialog>

            {/* Process Payroll Dialog */}
            <Dialog open={openPayrollDialog} onClose={() => setOpenPayrollDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Process Payroll</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Payroll Month"
                                type="month"
                                value={payrollForm.payroll_month}
                                onChange={(e) => setPayrollForm({ ...payrollForm, payroll_month: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" color="textSecondary">
                                This will calculate salaries for all active staff including:
                                PAYE, NSSF, NHIF deductions
                            </Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPayrollDialog(false)}>Cancel</Button>
                    <Button onClick={handleProcessPayroll} variant="contained">Process Payroll</Button>
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

export default HRDashboard;