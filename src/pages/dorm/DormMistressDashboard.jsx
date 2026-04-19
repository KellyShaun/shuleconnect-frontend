import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  MeetingRoom as RoomIcon,
  Bed as BedIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  EventNote as EventIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useSelector } from 'react-redux';

function DormMistressDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRooms: 0,
    availableBeds: 0,
    occupancyRate: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    pendingIssues: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [roomOccupancy, setRoomOccupancy] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    setStats({
      totalStudents: 156,
      totalRooms: 24,
      availableBeds: 18,
      occupancyRate: 85,
      presentToday: 142,
      absentToday: 10,
      lateToday: 4,
      pendingIssues: 3
    });

    setRoomOccupancy([
      { name: 'Floor 1', occupied: 45, total: 60 },
      { name: 'Floor 2', occupied: 38, total: 48 },
      { name: 'Floor 3', occupied: 42, total: 52 }
    ]);

    setAttendanceData([
      { day: 'Mon', present: 145, absent: 11 },
      { day: 'Tue', present: 148, absent: 8 },
      { day: 'Wed', present: 150, absent: 6 },
      { day: 'Thu', present: 142, absent: 14 },
      { day: 'Fri', present: 140, absent: 16 }
    ]);

    setRecentActivities([
      { id: 1, action: 'Student checked out', student: 'John Kamau', time: '2 hours ago', type: 'checkout' },
      { id: 2, action: 'New bed allocated', student: 'Mary Wanjiku', time: '5 hours ago', type: 'allocation' },
      { id: 3, action: 'Conduct record added', student: 'James Otieno', time: '1 day ago', type: 'conduct' },
      { id: 4, action: 'Late arrival reported', student: 'Sarah Muthoni', time: '2 days ago', type: 'late' }
    ]);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const pieData = [
    { name: 'Present', value: stats.presentToday, color: '#4CAF50' },
    { name: 'Absent', value: stats.absentToday, color: '#F44336' },
    { name: 'Late', value: stats.lateToday, color: '#FF9800' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#9C27B0', color: 'white' }}>
        <Typography variant="h4" gutterBottom>Dorm Mistress Dashboard</Typography>
        <Typography variant="body1">{getGreeting()}, {user?.firstName || 'Dorm Mistress'}! Manage dormitory activities and student welfare</Typography>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>Total Students</Typography>
                  <Typography variant="h3">{stats.totalStudents}</Typography>
                  <Typography variant="caption">In dormitory</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#9C27B0', width: 56, height: 56 }}>
                  <PeopleIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>Total Rooms</Typography>
                  <Typography variant="h3">{stats.totalRooms}</Typography>
                  <Typography variant="caption">Available beds: {stats.availableBeds}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#2196F3', width: 56, height: 56 }}>
                  <RoomIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>Occupancy Rate</Typography>
                  <Typography variant="h3">{stats.occupancyRate}%</Typography>
                  <Typography variant="caption">{stats.totalStudents} students housed</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#FF9800', width: 56, height: 56 }}>
                  <BedIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
              <LinearProgress variant="determinate" value={stats.occupancyRate} sx={{ mt: 2, height: 8, borderRadius: 4 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>Present Today</Typography>
                  <Typography variant="h3" sx={{ color: '#4CAF50' }}>{stats.presentToday}</Typography>
                  <Typography variant="caption">Absent: {stats.absentToday}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#4CAF50', width: 56, height: 56 }}>
                  <CheckIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Weekly Attendance Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip />
                <Legend />
                <Bar dataKey="present" fill="#4CAF50" name="Present" />
                <Bar dataKey="absent" fill="#F44336" name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Today's Attendance</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Room Occupancy */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Room Occupancy by Floor</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Floor</TableCell>
                <TableCell align="center">Occupied</TableCell>
                <TableCell align="center">Total</TableCell>
                <TableCell align="center">Occupancy Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roomOccupancy.map((floor) => (
                <TableRow key={floor.name} hover>
                  <TableCell>{floor.name}</TableCell>
                  <TableCell align="center">{floor.occupied}</TableCell>
                  <TableCell align="center">{floor.total}</TableCell>
                  <TableCell align="center" sx={{ width: 200 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={(floor.occupied / floor.total) * 100} 
                        sx={{ flex: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption">{Math.round((floor.occupied / floor.total) * 100)}%</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Recent Activity */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Recent Activity</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Activity</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Time</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentActivities.map((activity) => (
                <TableRow key={activity.id} hover>
                  <TableCell>{activity.action}</TableCell>
                  <TableCell>{activity.student}</TableCell>
                  <TableCell>{activity.time}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={activity.type} 
                      size="small" 
                      color={activity.type === 'checkout' ? 'info' : activity.type === 'allocation' ? 'success' : 'warning'} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default DormMistressDashboard;