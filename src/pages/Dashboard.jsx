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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  Book as BookIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  EventNote as EventIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  MenuBook as LibraryIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalBooks: 0,
    presentToday: 0,
    pendingTasks: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data from localStorage or set default values
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    setLoading(true);
    
    // Get data from localStorage if available
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Set mock/default data that works for all roles
    setStats({
      totalStudents: 156,
      totalTeachers: 24,
      totalClasses: 12,
      totalBooks: 5432,
      presentToday: 142,
      pendingTasks: 5
    });
    
    setRecentActivities([
      { id: 1, action: 'New student enrolled', time: '2 hours ago', icon: <SchoolIcon />, color: '#4CAF50' },
      { id: 2, action: 'Attendance marked for Form 4A', time: '3 hours ago', icon: <CheckIcon />, color: '#2196F3' },
      { id: 3, action: '3 books borrowed from library', time: '5 hours ago', icon: <LibraryIcon />, color: '#FF9800' },
      { id: 4, action: 'Fee payment received', time: '1 day ago', icon: <MoneyIcon />, color: '#9C27B0' },
      { id: 5, action: 'New teacher joined', time: '2 days ago', icon: <PeopleIcon />, color: '#2E7D32' }
    ]);
    
    setLoading(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getRoleTitle = () => {
    switch (user?.role) {
      case 'super_admin': return 'Super Administrator';
      case 'school_admin': return 'School Administrator';
      case 'teacher': return 'Teacher';
      case 'student': return 'Student';
      case 'parent': return 'Parent';
      case 'librarian': return 'Librarian';
      case 'accountant': return 'Accountant';
      default: return 'User';
    }
  };

  const getQuickLinks = () => {
    switch (user?.role) {
      case 'teacher':
        return [
          { text: 'Take Attendance', path: '/attendance', icon: <CheckIcon />, color: '#4CAF50' },
          { text: 'Enter Marks', path: '/results', icon: <TrendingUpIcon />, color: '#2196F3' },
          { text: 'View Timetable', path: '/timetable', icon: <ScheduleIcon />, color: '#FF9800' }
        ];
      case 'librarian':
        return [
          { text: 'Add New Book', path: '/library/books', icon: <BookIcon />, color: '#4CAF50' },
          { text: 'Borrow Book', path: '/library/borrowed', icon: <LibraryIcon />, color: '#2196F3' },
          { text: 'Return Book', path: '/library/return', icon: <CheckIcon />, color: '#FF9800' }
        ];
      case 'student':
        return [
          { text: 'View Results', path: '/results/portal', icon: <TrendingUpIcon />, color: '#4CAF50' },
          { text: 'My Timetable', path: '/timetable', icon: <ScheduleIcon />, color: '#2196F3' },
          { text: 'Library', path: '/library', icon: <LibraryIcon />, color: '#FF9800' }
        ];
      case 'parent':
        return [
          { text: 'View Children', path: '/my-children', icon: <PeopleIcon />, color: '#4CAF50' },
          { text: 'Pay Fees', path: '/fees', icon: <MoneyIcon />, color: '#2196F3' },
          { text: 'View Results', path: '/results/portal', icon: <TrendingUpIcon />, color: '#FF9800' }
        ];
      default:
        return [
          { text: 'Manage Students', path: '/students', icon: <SchoolIcon />, color: '#4CAF50' },
          { text: 'Manage Teachers', path: '/users', icon: <PeopleIcon />, color: '#2196F3' },
          { text: 'View Reports', path: '/reports', icon: <TrendingUpIcon />, color: '#FF9800' }
        ];
    }
  };

  const quickLinks = getQuickLinks();

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#2E7D32', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          {getGreeting()}, {user?.firstName || user?.name || 'User'}!
        </Typography>
        <Typography variant="body1">
          Welcome to ShuleConnect - {getRoleTitle()} Dashboard
        </Typography>
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
                  <Typography variant="caption" color="textSecondary">Enrolled this year</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#4CAF50', width: 56, height: 56 }}>
                  <SchoolIcon sx={{ fontSize: 32 }} />
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
                  <Typography color="textSecondary" gutterBottom>Total Teachers</Typography>
                  <Typography variant="h3">{stats.totalTeachers}</Typography>
                  <Typography variant="caption" color="textSecondary">Active staff</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#2196F3', width: 56, height: 56 }}>
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
                  <Typography color="textSecondary" gutterBottom>Total Classes</Typography>
                  <Typography variant="h3">{stats.totalClasses}</Typography>
                  <Typography variant="caption" color="textSecondary">Active classes</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#FF9800', width: 56, height: 56 }}>
                  <EventIcon sx={{ fontSize: 32 }} />
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
                  <Typography color="textSecondary" gutterBottom>Library Books</Typography>
                  <Typography variant="h3">{stats.totalBooks}</Typography>
                  <Typography variant="caption" color="textSecondary">In collection</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#9C27B0', width: 56, height: 56 }}>
                  <LibraryIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Quick Actions</Typography>
        <Grid container spacing={2}>
          {quickLinks.map((link, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={link.icon}
                onClick={() => window.location.href = link.path}
                sx={{
                  py: 2,
                  borderColor: link.color,
                  color: link.color,
                  '&:hover': { bgcolor: `${link.color}10`, borderColor: link.color }
                }}
              >
                {link.text}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Two Column Layout */}
      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
            <List>
              {recentActivities.map((activity) => (
                <ListItem key={activity.id} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: activity.color }}>
                      {activity.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={activity.action}
                    secondary={activity.time}
                  />
                </ListItem>
              ))}
            </List>
            <Button size="small" sx={{ mt: 1 }}>View All Activities</Button>
          </Paper>
        </Grid>

        {/* Today's Overview */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Today's Overview</Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Attendance Rate</Typography>
                <Typography variant="body2" fontWeight="bold">91%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={91} sx={{ height: 8, borderRadius: 4 }} />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Present Today</Typography>
                <Typography variant="body2" fontWeight="bold">{stats.presentToday} / {stats.totalStudents}</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(stats.presentToday / stats.totalStudents) * 100} 
                sx={{ height: 8, borderRadius: 4 }}
                color="success"
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2">Pending Tasks</Typography>
              <Chip label={stats.pendingTasks} size="small" color="warning" />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2">Completed Today</Typography>
              <Chip label="12" size="small" color="success" />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">Upcoming Events</Typography>
              <Chip label="3" size="small" color="info" />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Role-specific Info Cards */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {user?.role === 'teacher' && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, bgcolor: '#E3F2FD' }}>
              <Typography variant="h6" gutterBottom>My Classes Today</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold">Form 4A - Mathematics</Typography>
                      <Typography variant="body2" color="textSecondary">8:00 AM - 9:30 AM</Typography>
                      <Chip label="Room 101" size="small" sx={{ mt: 1 }} />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold">Form 3B - Physics</Typography>
                      <Typography variant="body2" color="textSecondary">10:00 AM - 11:30 AM</Typography>
                      <Chip label="Lab 2" size="small" sx={{ mt: 1 }} />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold">Form 2C - Mathematics</Typography>
                      <Typography variant="body2" color="textSecondary">12:00 PM - 1:30 PM</Typography>
                      <Chip label="Room 103" size="small" sx={{ mt: 1 }} />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}

        {user?.role === 'librarian' && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, bgcolor: '#FFF3E0' }}>
              <Typography variant="h6" gutterBottom>Library Stats</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="h4" color="#FF9800">45</Typography>
                  <Typography variant="caption">Books Borrowed</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="h4" color="#F44336">12</Typography>
                  <Typography variant="caption">Overdue Books</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="h4" color="#4CAF50">156</Typography>
                  <Typography variant="caption">Active Members</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="h4" color="#2196F3">28</Typography>
                  <Typography variant="caption">Visits Today</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default Dashboard;