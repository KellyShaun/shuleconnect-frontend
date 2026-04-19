import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Chip,
    Divider,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField
} from '@mui/material';
import {
    School as SchoolIcon,
    People as PeopleIcon,
    Male as MaleIcon,
    Female as FemaleIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Warning as WarningIcon,
    CheckCircle as CheckIcon,
    PictureAsPdf as PdfIcon,
    Download as DownloadIcon,
    Print as PrintIcon,
    Refresh as RefreshIcon,
    BarChart as BarChartIcon,
    PieChart as PieChartIcon,
    Timeline as TimelineIcon
} from '@mui/icons-material';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ReTooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import api from '../../services/api';

const COLORS = ['#2E7D32', '#1976D2', '#ED6C02', '#9C27B0', '#D32F2F', '#00BCD4', '#795548', '#607D8B'];

function StudentStats() {
    const [stats, setStats] = useState({
        total_students: 0,
        active_students: 0,
        male_students: 0,
        female_students: 0,
        boarding_students: 0,
        day_scholars: 0,
        special_needs: 0,
        at_risk_students: 0,
        class_distribution: [],
        average_attendance: 0,
        fee_compliance: 0,
        new_enrollments: 0,
        withdrawals: 0
    });
    const [trends, setTrends] = useState([]);
    const [classPerformance, setClassPerformance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedClass, setSelectedClass] = useState('all');
    const [openReportDialog, setOpenReportDialog] = useState(false);
    const [reportType, setReportType] = useState('pdf');

    useEffect(() => {
        fetchStats();
        fetchTrends();
        fetchClassPerformance();
    }, [selectedYear, selectedClass]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await api.get('/students/stats', {
                params: { year: selectedYear, class_id: selectedClass }
            });
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrends = async () => {
        try {
            const response = await api.get('/students/trends', {
                params: { year: selectedYear }
            });
            setTrends(response.data);
        } catch (error) {
            console.error('Error fetching trends:', error);
        }
    };

    const fetchClassPerformance = async () => {
        try {
            const response = await api.get('/students/class-performance', {
                params: { year: selectedYear }
            });
            setClassPerformance(response.data);
        } catch (error) {
            console.error('Error fetching class performance:', error);
        }
    };

    const exportReport = async () => {
        try {
            const response = await api.get('/students/export-report', {
                params: { type: reportType, year: selectedYear, class_id: selectedClass },
                responseType: reportType === 'pdf' ? 'blob' : 'text'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `student_report_${selectedYear}.${reportType}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting report:', error);
        }
    };

    // Prepare data for gender distribution pie chart
    const genderData = [
        { name: 'Male', value: stats.male_students || 0, color: '#1976D2' },
        { name: 'Female', value: stats.female_students || 0, color: '#ED6C02' }
    ];

    // Prepare data for student type distribution
    const typeData = [
        { name: 'Boarding', value: stats.boarding_students || 0, color: '#2E7D32' },
        { name: 'Day Scholar', value: stats.day_scholars || 0, color: '#00BCD4' }
    ];

    // Prepare data for risk distribution
    const riskData = [
        { name: 'At Risk', value: stats.at_risk_students || 0, color: '#D32F2F' },
        { name: 'Not at Risk', value: (stats.total_students - (stats.at_risk_students || 0)), color: '#2E7D32' }
    ];

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h4" gutterBottom>Student Statistics Dashboard</Typography>
                        <Typography variant="body2">Comprehensive analytics and insights about student population</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl size="small" sx={{ minWidth: 120, bgcolor: 'white', borderRadius: 1 }}>
                            <InputLabel>Year</InputLabel>
                            <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} label="Year">
                                <MenuItem value={2023}>2023</MenuItem>
                                <MenuItem value={2024}>2024</MenuItem>
                                <MenuItem value={2025}>2025</MenuItem>
                            </Select>
                        </FormControl>
                        <Button 
                            variant="contained" 
                            sx={{ bgcolor: 'white', color: 'primary.main' }}
                            startIcon={<DownloadIcon />}
                            onClick={() => setOpenReportDialog(true)}
                        >
                            Export Report
                        </Button>
                        <Button 
                            variant="outlined" 
                            sx={{ borderColor: 'white', color: 'white' }}
                            startIcon={<RefreshIcon />}
                            onClick={fetchStats}
                        >
                            Refresh
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* Key Metrics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Total Students</Typography>
                                    <Typography variant="h3">{stats.total_students || 0}</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                        <TrendingUpIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                        <Typography variant="caption">+{stats.new_enrollments || 0} new this year</Typography>
                                    </Box>
                                </Box>
                                <SchoolIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>Active Students</Typography>
                                    <Typography variant="h4">{stats.active_students || 0}</Typography>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={((stats.active_students || 0) / (stats.total_students || 1)) * 100} 
                                        sx={{ mt: 1, height: 8, borderRadius: 4 }}
                                    />
                                    <Typography variant="caption" color="textSecondary">
                                        {((stats.active_students || 0) / (stats.total_students || 1) * 100).toFixed(1)}% of total
                                    </Typography>
                                </Box>
                                <PeopleIcon sx={{ fontSize: 40, color: 'success.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>Attendance Rate</Typography>
                                    <Typography variant="h4">{stats.average_attendance || 0}%</Typography>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={stats.average_attendance || 0} 
                                        sx={{ mt: 1, height: 8, borderRadius: 4 }}
                                        color={stats.average_attendance > 85 ? 'success' : stats.average_attendance > 70 ? 'warning' : 'error'}
                                    />
                                </Box>
                                <TimelineIcon sx={{ fontSize: 40, color: 'info.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>Fee Compliance</Typography>
                                    <Typography variant="h4">{stats.fee_compliance || 0}%</Typography>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={stats.fee_compliance || 0} 
                                        sx={{ mt: 1, height: 8, borderRadius: 4 }}
                                        color={stats.fee_compliance > 80 ? 'success' : 'warning'}
                                    />
                                </Box>
                                <CheckIcon sx={{ fontSize: 40, color: 'success.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3}>
                {/* Gender Distribution */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom>Gender Distribution</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={genderData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    dataKey="value"
                                >
                                    {genderData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <ReTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#1976D2' }} />
                                <Typography variant="body2">Male: {stats.male_students || 0}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ED6C02' }} />
                                <Typography variant="body2">Female: {stats.female_students || 0}</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Student Type Distribution */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom>Student Type Distribution</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={typeData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    dataKey="value"
                                >
                                    {typeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <ReTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#2E7D32' }} />
                                <Typography variant="body2">Boarding: {stats.boarding_students || 0}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#00BCD4' }} />
                                <Typography variant="body2">Day: {stats.day_scholars || 0}</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Risk Distribution */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom>Risk Assessment</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={riskData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    dataKey="value"
                                >
                                    {riskData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <ReTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#D32F2F' }} />
                                <Typography variant="body2">At Risk: {stats.at_risk_students || 0}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#2E7D32' }} />
                                <Typography variant="body2">Safe: {(stats.total_students - (stats.at_risk_students || 0))}</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Class Distribution Bar Chart */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: 450 }}>
                        <Typography variant="h6" gutterBottom>Class Distribution</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={stats.class_distribution || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="class_name" />
                                <YAxis />
                                <ReTooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#2E7D32" name="Number of Students" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Enrollment Trends Line Chart */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: 450 }}>
                        <Typography variant="h6" gutterBottom>Enrollment Trends Over Time</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={trends}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="period" />
                                <YAxis />
                                <ReTooltip />
                                <Legend />
                                <Line type="monotone" dataKey="enrollments" stroke="#2E7D32" name="New Enrollments" />
                                <Line type="monotone" dataKey="withdrawals" stroke="#D32F2F" name="Withdrawals" />
                                <Line type="monotone" dataKey="total" stroke="#1976D2" name="Total Students" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Class Performance Table */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Class Performance Overview</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableCell>Class</TableCell>
                                        <TableCell align="center">Total Students</TableCell>
                                        <TableCell align="center">Boys</TableCell>
                                        <TableCell align="center">Girls</TableCell>
                                        <TableCell align="center">Attendance Rate</TableCell>
                                        <TableCell align="center">Avg Score</TableCell>
                                        <TableCell align="center">Top Performer</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {classPerformance.map((cls, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="bold">{cls.class_name}</Typography>
                                            </TableCell>
                                            <TableCell align="center">{cls.total_students}</TableCell>
                                            <TableCell align="center">{cls.boys}</TableCell>
                                            <TableCell align="center">{cls.girls}</TableCell>
                                            <TableCell align="center">
                                                <Chip 
                                                    label={`${cls.attendance_rate}%`}
                                                    size="small"
                                                    color={cls.attendance_rate > 85 ? 'success' : cls.attendance_rate > 70 ? 'warning' : 'error'}
                                                />
                                            </TableCell>
                                            <TableCell align="center">{cls.avg_score}%</TableCell>
                                            <TableCell align="center">{cls.top_performer}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                {/* Special Needs & Categories */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Special Categories</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography>Special Needs Students</Typography>
                                <Chip label={stats.special_needs || 0} color="warning" />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography>Orphan/Vulnerable</Typography>
                                <Chip label={stats.orphans || 0} color="info" />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography>Sponsored Students</Typography>
                                <Chip label={stats.sponsored || 0} color="success" />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography>Talented (Sports/Academics)</Typography>
                                <Chip label={stats.talented || 0} color="secondary" />
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Quick Stats */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Quick Insights</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                            <Grid item xs={6} sm={3}>
                                <Box textAlign="center">
                                    <Typography variant="h4" color="primary.main">{stats.new_enrollments || 0}</Typography>
                                    <Typography variant="caption" color="textSecondary">New Enrollments</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Box textAlign="center">
                                    <Typography variant="h4" color="error.main">{stats.withdrawals || 0}</Typography>
                                    <Typography variant="caption" color="textSecondary">Withdrawals</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Box textAlign="center">
                                    <Typography variant="h4">{stats.classes_with_students || 0}</Typography>
                                    <Typography variant="caption" color="textSecondary">Active Classes</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Box textAlign="center">
                                    <Typography variant="h4">{stats.average_class_size || 0}</Typography>
                                    <Typography variant="caption" color="textSecondary">Avg Class Size</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* Export Report Dialog */}
            <Dialog open={openReportDialog} onClose={() => setOpenReportDialog(false)}>
                <DialogTitle>Export Student Report</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Report Format</InputLabel>
                                <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                                    <MenuItem value="pdf">PDF Document</MenuItem>
                                    <MenuItem value="excel">Excel Spreadsheet</MenuItem>
                                    <MenuItem value="csv">CSV File</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" color="textSecondary">
                                Report will include: Student demographics, class distribution, attendance trends, and performance metrics for {selectedYear}.
                            </Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenReportDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={exportReport} startIcon={<DownloadIcon />}>
                        Export Report
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default StudentStats;