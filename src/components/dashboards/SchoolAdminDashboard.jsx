import React, { useState, useEffect } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Chip,
    LinearProgress
} from '@mui/material';
import {
    School as SchoolIcon,
    People as PeopleIcon,
    AttachMoney as MoneyIcon,
    TrendingUp as TrendingIcon,
    Warning as WarningIcon,
    CheckCircle as CheckIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../services/api';

function SchoolAdminDashboard() {
    const [dashboardData, setDashboardData] = useState({
        stats: {},
        attendanceTrend: [],
        recentActivities: [],
        pendingApprovals: []
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/users/dashboard');
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        }
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                School Dashboard
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
                Welcome back! Here's your school's performance overview.
            </Typography>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Total Students</Typography>
                            <Typography variant="h4">{dashboardData.stats?.totalStudents || 0}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <TrendingIcon sx={{ fontSize: 14, color: 'success.main', mr: 0.5 }} />
                                <Typography variant="caption" color="success.main">+12% this term</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Total Teachers</Typography>
                            <Typography variant="h4">{dashboardData.stats?.totalTeachers || 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Fee Collection</Typography>
                            <Typography variant="h4">KES {(dashboardData.stats?.totalFeesCollected || 0).toLocaleString()}</Typography>
                            <LinearProgress variant="determinate" value={dashboardData.stats?.collectionRate || 0} sx={{ mt: 1 }} />
                            <Typography variant="caption" color="textSecondary">
                                {dashboardData.stats?.collectionRate || 0}% collected
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Attendance Rate</Typography>
                            <Typography variant="h4">{dashboardData.stats?.attendanceRate || 0}%</Typography>
                            <LinearProgress variant="determinate" value={dashboardData.stats?.attendanceRate || 0} sx={{ mt: 1 }} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Attendance Trend (Last 30 Days)</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dashboardData.attendanceTrend || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="present" stroke="#2E7D32" name="Present" />
                                <Line type="monotone" dataKey="absent" stroke="#D32F2F" name="Absent" />
                                <Line type="monotone" dataKey="late" stroke="#ED6C02" name="Late" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Fee Collection Status</Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={dashboardData.feeStatus || []}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    dataKey="value"
                                >
                                    {(dashboardData.feeStatus || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Pending Approvals */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Pending Approvals
                            {dashboardData.pendingApprovals?.length > 0 && (
                                <Chip label={`${dashboardData.pendingApprovals.length} pending`} color="warning" size="small" sx={{ ml: 1 }} />
                            )}
                        </Typography>
                        <List>
                            {dashboardData.pendingApprovals?.map((item, index) => (
                                <React.Fragment key={index}>
                                    <ListItem>
                                        <ListItemIcon>
                                            {item.type === 'leave_request' ? <WarningIcon color="warning" /> : <SchoolIcon color="primary" />}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.type === 'leave_request' ? 'Leave Request' : 'New Student Registration'}
                                            secondary={`${item.count} item(s) awaiting approval`}
                                        />
                                        <Chip label="Pending" color="warning" size="small" />
                                    </ListItem>
                                    {index < dashboardData.pendingApprovals.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Recent Activities */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Recent Activities</Typography>
                        <List>
                            {dashboardData.recentActivities?.slice(0, 5).map((activity, index) => (
                                <React.Fragment key={index}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <CheckIcon color="success" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={activity.action}
                                            secondary={new Date(activity.created_at).toLocaleString()}
                                        />
                                    </ListItem>
                                    {index < 4 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default SchoolAdminDashboard;