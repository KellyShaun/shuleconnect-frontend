import React, { useState, useEffect } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip
} from '@mui/material';
import {
    School as SchoolIcon,
    People as PeopleIcon,
    TrendingUp as TrendingIcon,
    Computer as ComputerIcon
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

function StatCard({ title, value, icon: Icon, color }) {
    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography color="textSecondary" gutterBottom variant="body2">
                            {title}
                        </Typography>
                        <Typography variant="h4">{value}</Typography>
                    </Box>
                    <Box sx={{ backgroundColor: color, borderRadius: '50%', p: 1 }}>
                        <Icon sx={{ color: 'white' }} />
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

function SuperAdminDashboard() {
    const [dashboardData, setDashboardData] = useState({
        stats: {},
        schools: [],
        recentActivities: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/users/dashboard');
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                System Overview
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
                Welcome to ShuleConnect Platform Administration
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Schools"
                        value={dashboardData.stats.totalSchools || 0}
                        icon={SchoolIcon}
                        color="#2E7D32"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Users"
                        value={dashboardData.stats.totalUsers || 0}
                        icon={PeopleIcon}
                        color="#1976D2"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Active Sessions"
                        value={dashboardData.stats.activeSessions || 0}
                        icon={ComputerIcon}
                        color="#ED6C02"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Platform Revenue"
                        value={`KES ${(dashboardData.stats.totalRevenue || 0).toLocaleString()}`}
                        icon={TrendingIcon}
                        color="#9C27B0"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Schools Performance</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dashboardData.schools || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="students" fill="#2E7D32" name="Students" />
                                <Bar dataKey="revenue" fill="#1976D2" name="Revenue (KES)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Recent Activities</Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableBody>
                                    {dashboardData.recentActivities?.map((activity, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Typography variant="body2">{activity.action}</Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {new Date(activity.created_at).toLocaleString()}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default SuperAdminDashboard;