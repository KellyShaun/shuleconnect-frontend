import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Alert,
    Snackbar,
    CircularProgress,
    Tabs,
    Tab,
    Avatar
} from '@mui/material';
import {
    BookOnline as BookIcon,
    Videocam as VideoIcon,
    LocationOn as LocationIcon,
    CheckCircle as CheckIcon,
    Cancel as CancelIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../../services/api';

function MeetingBooking() {
    const [meetings, setMeetings] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [formData, setFormData] = useState({
        teacher_id: '',
        student_id: '',
        meeting_date: new Date(),
        start_time: '14:00',
        end_time: '14:30',
        purpose: '',
        meeting_type: 'physical'
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchMeetings();
        fetchTeachers();
        fetchChildren();
    }, []);

    const fetchMeetings = async () => {
        try {
            const response = await api.get('/messaging/meetings');
            setMeetings(response.data);
        } catch (error) {
            console.error('Error fetching meetings:', error);
        }
    };

    const fetchTeachers = async () => {
        try {
            const response = await api.get('/users?role=teacher');
            setTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const fetchChildren = async () => {
        try {
            const response = await api.get('/parent/children');
            setChildren(response.data);
        } catch (error) {
            console.error('Error fetching children:', error);
        }
    };

    const bookMeeting = async () => {
        try {
            await api.post('/messaging/meetings/book', formData);
            setSnackbar({ open: true, message: 'Meeting request sent successfully', severity: 'success' });
            setOpenDialog(false);
            fetchMeetings();
        } catch (error) {
            setSnackbar({ open: true, message: error.response?.data?.error || 'Error booking meeting', severity: 'error' });
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'confirmed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'error';
            case 'completed': return 'info';
            default: return 'default';
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ p: 3 }}>
                {/* Header */}
                <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h4" gutterBottom>Parent-Teacher Meetings</Typography>
                        <Typography variant="body2">Schedule and manage meetings with teachers</Typography>
                    </Box>
                    <Button 
                        variant="contained" 
                        sx={{ bgcolor: 'white', color: 'primary.main' }}
                        startIcon={<BookIcon />}
                        onClick={() => setOpenDialog(true)}
                    >
                        Book Meeting
                    </Button>
                </Paper>

                {/* Tabs */}
                <Paper sx={{ mb: 3 }}>
                    <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                        <Tab label="Upcoming Meetings" />
                        <Tab label="Past Meetings" />
                        <Tab label="Meeting History" />
                    </Tabs>

                    {/* Upcoming Meetings */}
                    {activeTab === 0 && (
                        <Box sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                {meetings.filter(m => m.status === 'pending' || m.status === 'confirmed').map((meeting) => (
                                    <Grid item xs={12} md={6} key={meeting.id}>
                                        <Card>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <Box>
                                                        <Typography variant="subtitle1">
                                                            {meeting.teacher_first} {meeting.teacher_last}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            With: {meeting.student_first} {meeting.student_last}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                                            <Chip 
                                                                icon={<ScheduleIcon />} 
                                                                label={`${new Date(meeting.meeting_date).toLocaleDateString()} ${meeting.start_time}`}
                                                                size="small"
                                                            />
                                                            <Chip 
                                                                icon={meeting.meeting_type === 'virtual' ? <VideoIcon /> : <LocationIcon />}
                                                                label={meeting.meeting_type}
                                                                size="small"
                                                            />
                                                            <Chip 
                                                                label={meeting.status}
                                                                color={getStatusColor(meeting.status)}
                                                                size="small"
                                                            />
                                                        </Box>
                                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                                            Purpose: {meeting.purpose}
                                                        </Typography>
                                                    </Box>
                                                    {meeting.meeting_link && (
                                                        <Button size="small" variant="outlined" href={meeting.meeting_link} target="_blank">
                                                            Join Meeting
                                                        </Button>
                                                    )}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </Paper>

                {/* Book Meeting Dialog */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Book Parent-Teacher Meeting</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Select Teacher</InputLabel>
                                    <Select
                                        value={formData.teacher_id}
                                        onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                                    >
                                        {teachers.map(teacher => (
                                            <MenuItem key={teacher.id} value={teacher.id}>
                                                {teacher.first_name} {teacher.last_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Select Student</InputLabel>
                                    <Select
                                        value={formData.student_id}
                                        onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                                    >
                                        {children.map(child => (
                                            <MenuItem key={child.id} value={child.id}>
                                                {child.first_name} {child.last_name} - {child.class_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <DatePicker
                                    label="Meeting Date"
                                    value={formData.meeting_date}
                                    onChange={(date) => setFormData({ ...formData, meeting_date: date })}
                                    slotProps={{ textField: { fullWidth: true } }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Start Time"
                                    type="time"
                                    value={formData.start_time}
                                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="End Time"
                                    type="time"
                                    value={formData.end_time}
                                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Meeting Type</InputLabel>
                                    <Select
                                        value={formData.meeting_type}
                                        onChange={(e) => setFormData({ ...formData, meeting_type: e.target.value })}
                                    >
                                        <MenuItem value="physical">Physical Meeting</MenuItem>
                                        <MenuItem value="virtual">Virtual Meeting (Video Call)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    label="Purpose of Meeting"
                                    value={formData.purpose}
                                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button onClick={bookMeeting} variant="contained">Request Meeting</Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert severity={snackbar.severity}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    );
}

export default MeetingBooking;