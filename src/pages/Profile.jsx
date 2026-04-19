/* eslint-disable react/jsx-no-undef */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Avatar,
  TextField,
  Button,
  Divider,
  Card,
  CardContent,
  Chip,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Badge as BadgeIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Lock as LockIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  DarkMode as DarkModeIcon,
  Security as SecurityIcon,
  History as HistoryIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import api from '../services/api';

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    sms_notifications: false,
    dark_mode: false,
    language: 'en'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        date_of_birth: user.date_of_birth || ''
      });
    }
    fetchUserActivity();
  }, [user]);

  const fetchUserActivity = async () => {
    // Mock data for activity log
    setUserActivity([
      { id: 1, action: 'Logged in', time: '2024-03-15 08:30:00', ip: '192.168.1.1' },
      { id: 2, action: 'Updated profile', time: '2024-03-14 15:20:00', ip: '192.168.1.1' },
      { id: 3, action: 'Changed password', time: '2024-03-10 10:00:00', ip: '192.168.1.1' }
    ]);
  };

  const [userActivity, setUserActivity] = useState([]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      // await api.put('/users/profile', formData);
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
      setEditing(false);
      // Update local storage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      setSnackbar({ open: true, message: 'Error updating profile', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setSnackbar({ open: true, message: 'Passwords do not match!', severity: 'error' });
      return;
    }
    if (passwordData.new_password.length < 6) {
      setSnackbar({ open: true, message: 'Password must be at least 6 characters!', severity: 'error' });
      return;
    }
    
    setLoading(true);
    try {
      // await api.post('/users/change-password', passwordData);
      setSnackbar({ open: true, message: 'Password changed successfully!', severity: 'success' });
      setOpenPasswordDialog(false);
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error changing password', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = () => {
    switch(user?.role) {
      case 'super_admin': return '#F44336';
      case 'school_admin': return '#2196F3';
      case 'teacher': return '#4CAF50';
      case 'student': return '#FF9800';
      case 'parent': return '#9C27B0';
      case 'librarian': return '#00BCD4';
      case 'accountant': return '#FF5722';
      case 'dorm_mistress': return '#E91E63';
      case 'store_keeper': return '#795548';
      default: return '#2E7D32';
    }
  };

  const getRoleDisplay = () => {
    switch(user?.role) {
      case 'super_admin': return 'Super Administrator';
      case 'school_admin': return 'School Administrator';
      case 'teacher': return 'Teacher';
      case 'student': return 'Student';
      case 'parent': return 'Parent';
      case 'librarian': return 'Librarian';
      case 'accountant': return 'Accountant';
      case 'dorm_mistress': return 'Dorm Mistress';
      case 'store_keeper': return 'Store Keeper';
      default: return 'User';
    }
  };

  const getInitials = () => {
    const first = formData.first_name?.charAt(0) || '';
    const last = formData.last_name?.charAt(0) || '';
    return (first + last).toUpperCase();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#2E7D32', color: 'white' }}>
        <Typography variant="h4" gutterBottom>My Profile</Typography>
        <Typography variant="body1">Manage your personal information and account settings</Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Left Column - Profile Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: getRoleColor(),
                fontSize: 48,
                margin: '0 auto',
                mb: 2
              }}
            >
              {getInitials()}
            </Avatar>
            <Typography variant="h5">{formData.first_name} {formData.last_name}</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {getRoleDisplay()}
            </Typography>
            <Chip 
              label={user?.role?.replace('_', ' ').toUpperCase()} 
              size="small" 
              sx={{ bgcolor: getRoleColor(), color: 'white', mt: 1 }}
            />
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="subtitle2" gutterBottom>Contact Information</Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon><EmailIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Email" secondary={formData.email} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><PhoneIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Phone" secondary={formData.phone || 'Not provided'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><BadgeIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Member Since" secondary="2024-01-15" />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Edit Form & Tabs */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
              <Tab label="Personal Information" />
              <Tab label="Preferences" />
              <Tab label="Security" />
              <Tab label="Activity Log" />
            </Tabs>

            {/* Personal Information Tab */}
            {activeTab === 0 && (
              <Box>
                {editing ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        multiline
                        rows={2}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Date of Birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button variant="outlined" onClick={() => setEditing(false)} startIcon={<CancelIcon />}>
                          Cancel
                        </Button>
                        <Button variant="contained" onClick={handleUpdateProfile} startIcon={<SaveIcon />} disabled={loading}>
                          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                ) : (
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary">First Name</Typography>
                        <Typography variant="body1">{formData.first_name}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary">Last Name</Typography>
                        <Typography variant="body1">{formData.last_name}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textSecondary">Email Address</Typography>
                        <Typography variant="body1">{formData.email}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textSecondary">Phone Number</Typography>
                        <Typography variant="body1">{formData.phone || 'Not provided'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textSecondary">Address</Typography>
                        <Typography variant="body1">{formData.address || 'Not provided'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textSecondary">Date of Birth</Typography>
                        <Typography variant="body1">{formData.date_of_birth || 'Not provided'}</Typography>
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button variant="contained" startIcon={<EditIcon />} onClick={() => setEditing(true)}>
                        Edit Profile
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {/* Preferences Tab */}
            {activeTab === 1 && (
              <Box>
                <List>
                  <ListItem>
                    <ListItemIcon><NotificationsIcon /></ListItemIcon>
                    <ListItemText primary="Email Notifications" secondary="Receive email notifications about important updates" />
                    <Switch checked={preferences.email_notifications} onChange={(e) => setPreferences({ ...preferences, email_notifications: e.target.checked })} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><PhoneIcon /></ListItemIcon>
                    <ListItemText primary="SMS Notifications" secondary="Receive SMS alerts for urgent matters" />
                    <Switch checked={preferences.sms_notifications} onChange={(e) => setPreferences({ ...preferences, sms_notifications: e.target.checked })} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><DarkModeIcon /></ListItemIcon>
                    <ListItemText primary="Dark Mode" secondary="Switch to dark theme" />
                    <Switch checked={preferences.dark_mode} onChange={(e) => setPreferences({ ...preferences, dark_mode: e.target.checked })} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><LanguageIcon /></ListItemIcon>
                    <ListItemText primary="Language" secondary="Select your preferred language" />
                    <Button size="small" variant="outlined">English (Default)</Button>
                  </ListItem>
                </List>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" onClick={() => setSnackbar({ open: true, message: 'Preferences saved!', severity: 'success' })}>
                    Save Preferences
                  </Button>
                </Box>
              </Box>
            )}

            {/* Security Tab */}
            {activeTab === 2 && (
              <Box>
                <Card sx={{ mb: 3, bgcolor: '#FFF3E0' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LockIcon sx={{ fontSize: 40, color: '#FF9800' }} />
                      <Box>
                        <Typography variant="h6">Change Password</Typography>
                        <Typography variant="body2" color="textSecondary">Update your password regularly to keep your account secure</Typography>
                      </Box>
                    </Box>
                    <Button variant="contained" sx={{ mt: 2 }} onClick={() => setOpenPasswordDialog(true)}>
                      Change Password
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <SecurityIcon sx={{ fontSize: 40, color: '#4CAF50' }} />
                      <Box>
                        <Typography variant="h6">Two-Factor Authentication</Typography>
                        <Typography variant="body2" color="textSecondary">Add an extra layer of security to your account</Typography>
                      </Box>
                    </Box>
                    <Button variant="outlined" sx={{ mt: 2 }}>
                      Enable 2FA
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            )}

            {/* Activity Log Tab */}
            {activeTab === 3 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>Recent Account Activity</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                        <TableCell>Action</TableCell>
                        <TableCell>Date & Time</TableCell>
                        <TableCell>IP Address</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userActivity.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell>{activity.action}</TableCell>
                          <TableCell>{activity.time}</TableCell>
                          <TableCell>{activity.ip}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Current Password"
                value={passwordData.current_password}
                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="New Password"
                value={passwordData.new_password}
                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                helperText="Password must be at least 6 characters"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                value={passwordData.confirm_password}
                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleChangePassword} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default Profile;