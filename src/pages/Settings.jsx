// frontend/src/pages/Settings.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Save as SaveIcon,
  PhotoCamera as PhotoIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';

function Settings() {
  const [schoolSettings, setSchoolSettings] = useState({
    name: 'ShuleConnect Demo School',
    email: 'info@shuleconnect.com',
    phone: '+254700000000',
    address: 'Nairobi, Kenya',
    curriculum: '844',
    term: 'Term 1',
    year: '2024',
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: true,
    pushNotifications: true,
    parentPortal: true,
  });

  const handleSchoolChange = (e) => {
    setSchoolSettings({
      ...schoolSettings,
      [e.target.name]: e.target.value,
    });
  };

  const handleNotificationChange = (e) => {
    setNotifications({
      ...notifications,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSave = () => {
    console.log('Saving settings:', { schoolSettings, notifications });
    alert('Settings saved successfully!');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      
      <Grid container spacing={3}>
        {/* School Profile */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <BusinessIcon sx={{ fontSize: 30, mr: 2, color: 'primary.main' }} />
              <Typography variant="h6">School Profile</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}>
                  <BusinessIcon sx={{ fontSize: 50 }} />
                </Avatar>
                <IconButton
                  sx={{ position: 'absolute', bottom: 0, right: 0 }}
                  size="small"
                >
                  <PhotoIcon />
                </IconButton>
              </Box>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="School Name"
                  name="name"
                  value={schoolSettings.name}
                  onChange={handleSchoolChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={schoolSettings.email}
                  onChange={handleSchoolChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={schoolSettings.phone}
                  onChange={handleSchoolChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  multiline
                  rows={2}
                  value={schoolSettings.address}
                  onChange={handleSchoolChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Curriculum"
                  name="curriculum"
                  value={schoolSettings.curriculum}
                  onChange={handleSchoolChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current Term"
                  name="term"
                  value={schoolSettings.term}
                  onChange={handleSchoolChange}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Notification Settings</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.emailAlerts}
                  onChange={handleNotificationChange}
                  name="emailAlerts"
                />
              }
              label="Email Alerts"
            />
            <Typography variant="body2" color="textSecondary" sx={{ ml: 4, mb: 2 }}>
              Receive email notifications for important events
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.smsAlerts}
                  onChange={handleNotificationChange}
                  name="smsAlerts"
                />
              }
              label="SMS Alerts"
            />
            <Typography variant="body2" color="textSecondary" sx={{ ml: 4, mb: 2 }}>
              Send SMS notifications to parents
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.pushNotifications}
                  onChange={handleNotificationChange}
                  name="pushNotifications"
                />
              }
              label="Push Notifications"
            />
            <Typography variant="body2" color="textSecondary" sx={{ ml: 4, mb: 2 }}>
              Enable in-app push notifications
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.parentPortal}
                  onChange={handleNotificationChange}
                  name="parentPortal"
                />
              }
              label="Parent Portal Access"
            />
            <Typography variant="body2" color="textSecondary" sx={{ ml: 4, mb: 2 }}>
              Allow parents to access student information
            </Typography>
          </Paper>
          
          {/* Save Button */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Changes may take a few minutes to apply across the system.
            </Alert>
            <Button 
              fullWidth 
              variant="contained" 
              size="large"
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              Save All Settings
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Settings;