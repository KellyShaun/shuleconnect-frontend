import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Switch,
    FormControlLabel,
    Alert,
    Snackbar,
    CircularProgress,
    Tabs,
    Tab,
    Avatar,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    PushPin as PinIcon,
    Notifications as NotificationIcon,
    Visibility as ViewIcon,
    Schedule as ScheduleIcon,
    CheckCircle as CheckIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import api from '../../services/api';

function Announcements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        priority: 'normal',
        target_audience: { roles: [], classes: [] },
        schedule_date: '',
        expires_at: '',
        is_pinned: false
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const response = await api.get('/messaging/announcements');
            setAnnouncements(response.data);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAnnouncement = async () => {
        try {
            await api.post('/messaging/announcements', formData);
            setSnackbar({ open: true, message: 'Announcement created successfully', severity: 'success' });
            setOpenDialog(false);
            fetchAnnouncements();
            resetForm();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error creating announcement', severity: 'error' });
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await api.post(`/messaging/announcements/${id}/read`);
            fetchAnnouncements();
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            content: '',
            priority: 'normal',
            target_audience: { roles: [], classes: [] },
            schedule_date: '',
            expires_at: '',
            is_pinned: false
        });
        setEditingAnnouncement(null);
    };

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'emergency': return 'error';
            case 'high': return 'warning';
            case 'normal': return 'info';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" gutterBottom>Announcements</Typography>
                    <Typography variant="body2">School news and important updates</Typography>
                </Box>
                <Button 
                    variant="contained" 
                    sx={{ bgcolor: 'white', color: 'primary.main' }}
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                >
                    New Announcement
                </Button>
            </Paper>

            {/* Announcements List */}
            <Grid container spacing={3}>
                {loading ? (
                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                        <CircularProgress />
                    </Grid>
                ) : announcements.map((announcement) => (
                    <Grid item xs={12} key={announcement.id}>
                        <Card sx={{ position: 'relative', borderLeft: announcement.is_pinned ? '4px solid #2E7D32' : 'none' }}>
                            {announcement.is_pinned && (
                                <PinIcon sx={{ position: 'absolute', top: 16, right: 16, color: '#2E7D32' }} />
                            )}
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Chip 
                                        label={announcement.priority.toUpperCase()} 
                                        color={getPriorityColor(announcement.priority)}
                                        size="small"
                                    />
                                    {!announcement.is_read && (
                                        <Chip label="New" color="error" size="small" />
                                    )}
                                </Box>
                                <Typography variant="h6">{announcement.title}</Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                    {announcement.content}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                    <Typography variant="caption">
                                        Posted by: {announcement.first_name} {announcement.last_name}
                                    </Typography>
                                    <Typography variant="caption">
                                        {new Date(announcement.published_at).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="caption">
                                        Views: {announcement.view_count}
                                    </Typography>
                                </Box>
                            </CardContent>
                            <CardActions>
                                {!announcement.is_read && (
                                    <Button size="small" onClick={() => handleMarkAsRead(announcement.id)}>
                                        Mark as Read
                                    </Button>
                                )}
                                <Button size="small">Share</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Create Announcement Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Create Announcement</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Content"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Priority</InputLabel>
                                <Select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    <MenuItem value="low">Low</MenuItem>
                                    <MenuItem value="normal">Normal</MenuItem>
                                    <MenuItem value="high">High</MenuItem>
                                    <MenuItem value="emergency">Emergency</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Schedule Date (Optional)"
                                type="datetime-local"
                                value={formData.schedule_date}
                                onChange={(e) => setFormData({ ...formData, schedule_date: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.is_pinned}
                                        onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                                    />
                                }
                                label="Pin this announcement"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateAnnouncement} variant="contained">Post Announcement</Button>
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
    );
}

export default Announcements;