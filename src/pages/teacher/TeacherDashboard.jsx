import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
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
  Avatar,
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  EventNote as EventIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  MenuBook as BookIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../../services/api';

function TeacherDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    assignmentsToGrade: 0,
    upcomingClasses: 0
  });
  const [myClasses, setMyClasses] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [attendanceRate, setAttendanceRate] = useState([]);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    setLoading(true);
    try {
      const [statsRes, classesRes, scheduleRes, activityRes, attendanceRes] = await Promise.all([
        api.get('/teacher/stats'),
        api.get('/teacher/my-classes'),
        api.get('/teacher/today-schedule'),
        api.get('/teacher/recent-activity'),
        api.get('/teacher/attendance-rate')
      ]);
      
      setStats(statsRes.data);
      setMyClasses(classesRes.data);
      setTodaySchedule(scheduleRes.data);
      setRecentActivity(activityRes.data);
      setAttendanceRate(attendanceRes.data);
    } catch (error) {
      console.error('Error fetching teacher data:', error);
      // Set mock data
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    setStats({
      totalStudents: 156,
      presentToday: 142,
      absentToday: 10,
      lateToday: 4,
      assignmentsToGrade: 23,
      upcomingClasses: 3
    });
    setMyClasses([
      { id: 1, name: 'Mathematics - Form 4A', students: 42, time: '8:00 AM - 9:30 AM' },
      { id: 2, name: 'Physics - Form 3B', students: 38, time: '10:00 AM - 11:30 AM' },
      { id: 3, name: 'Mathematics - Form 2C', students: 40, time: '12:00 PM - 1:30 PM' }
    ]);
    setTodaySchedule([
      { subject: 'Mathematics', class: 'Form 4A', time: '8:00 - 9:30', room: 'Room 101' },
      { subject: 'Physics', class: 'Form 3B', time: '10:00 - 11:30', room: 'Lab 2' },
      { subject: 'Mathematics', class: 'Form 2C', time: '12:00 - 13:30', room: 'Room 103' }
    ]);
    setAttendanceRate([
      { day: 'Mon', rate: 94 },
      { day: 'Tue', rate: 92 },
      { day: 'Wed', rate: 96 },
      { day: 'Thu', rate: 93 },
      { day: 'Fri', rate: 95 }
    ]);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#2E7D32', color: 'white' }}>
        <Typography variant="h4" gutterBottom>Welcome Back, Teacher!</Typography>
        <Typography variant="body1">Here's what's happening with your classes today.</Typography>
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
                </Box>
                <Avatar sx={{ bgcolor: '#4CAF50', width: 56, height: 56 }}>
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
                  <Typography color="textSecondary" gutterBottom>Present Today</Typography>
                  <Typography variant="h3" sx={{ color: '#4CAF50' }}>{stats.presentToday}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#4CAF50', width: 56, height: 56 }}>
                  <CheckIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
              <LinearProgress variant="determinate" value={(stats.presentToday / stats.totalStudents) * 100} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>Assignments to Grade</Typography>
                  <Typography variant="h3" sx={{ color: '#FF9800' }}>{stats.assignmentsToGrade}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#FF9800', width: 56, height: 56 }}>
                  <AssessmentIcon sx={{ fontSize: 32 }} />
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
                  <Typography color="textSecondary" gutterBottom>Upcoming Classes</Typography>
                  <Typography variant="h3" sx={{ color: '#2196F3' }}>{stats.upcomingClasses}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#2196F3', width: 56, height: 56 }}>
                  <EventIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Today's Schedule */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Today's Schedule</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Subject</TableCell>
                    <TableCell>Class</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Room</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {todaySchedule.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.subject}</TableCell>
                      <TableCell>{item.class}</TableCell>
                      <TableCell>{item.time}</TableCell>
                      <TableCell>{item.room}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button sx={{ mt: 2 }} size="small">View Full Schedule</Button>
          </Paper>
        </Grid>

        {/* Attendance Trend */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Attendance Rate (This Week)</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={attendanceRate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#2E7D32" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* My Classes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>My Classes</Typography>
            {myClasses.map((cls) => (
              <Card key={cls.id} sx={{ mb: 2, bgcolor: '#f5f5f5' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">{cls.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {cls.students} Students | {cls.time}
                      </Typography>
                    </Box>
                    <Button size="small" variant="outlined">View Class</Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
            <List>
              {recentActivity.map((activity, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#E8F5E9' }}>
                      <EventIcon sx={{ color: '#2E7D32' }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={activity.title}
                    secondary={activity.time}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={6} md={3}>
          <Button fullWidth variant="contained" startIcon={<AssessmentIcon />} sx={{ bgcolor: '#2E7D32' }}>
            Take Attendance
          </Button>
        </Grid>
        <Grid item xs={6} md={3}>
          <Button fullWidth variant="contained" startIcon={<AssessmentIcon />} sx={{ bgcolor: '#2196F3' }}>
            Enter Marks
          </Button>
        </Grid>
        <Grid item xs={6} md={3}>
          <Button fullWidth variant="contained" startIcon={<BookIcon />} sx={{ bgcolor: '#FF9800' }}>
            Add Assignment
          </Button>
        </Grid>
        <Grid item xs={6} md={3}>
          <Button fullWidth variant="outlined" startIcon={<RefreshIcon />}>
            Refresh
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TeacherDashboard;