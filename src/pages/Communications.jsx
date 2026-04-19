import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Avatar,
    Divider,
    Alert,
    IconButton,
    Tab,
    Tabs
} from '@mui/material';
import {
    Send as SendIcon,
    Email as EmailIcon,
    Sms as SmsIcon,
    Notifications as NotificationIcon,
    WhatsApp as WhatsAppIcon,
    AttachFile as AttachIcon,
    History as HistoryIcon,
    People as PeopleIcon
} from '@mui/icons-material';

function Communications() {
    const [activeTab, setActiveTab] = useState(0);
    const [messageType, setMessageType] = useState('sms');
    const [recipient, setRecipient] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSend = () => {
        alert(`Message sent via ${messageType.toUpperCase()}!`);
        setMessage('');
        setSubject('');
    };

    const recentMessages = [
        { id: 1, type: 'sms', recipient: 'Parents of Grade 8', subject: 'School Opens Monday', date: '2024-03-20', status: 'sent' },
        { id: 2, type: 'email', recipient: 'All Teachers', subject: 'Staff Meeting', date: '2024-03-19', status: 'sent' },
        { id: 3, type: 'push', recipient: 'Form 4 Students', subject: 'Exam Timetable', date: '2024-03-18', status: 'sent' }
    ];

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h4" gutterBottom>Communications Center</Typography>
                <Typography variant="body2">Send messages, announcements, and notifications</Typography>
            </Paper>

            <Grid container spacing={3}>
                {/* Send Message Form */}
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Send New Message</Typography>
                        
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Message Type</InputLabel>
                                    <Select 
                                        value={messageType} 
                                        onChange={(e) => setMessageType(e.target.value)}
                                    >
                                        <MenuItem value="sms">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <SmsIcon fontSize="small" /> SMS
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value="email">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <EmailIcon fontSize="small" /> Email
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value="push">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <NotificationIcon fontSize="small" /> Push Notification
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value="whatsapp">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <WhatsAppIcon fontSize="small" /> WhatsApp
                                            </Box>
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Send To</InputLabel>
                                    <Select 
                                        value={recipient} 
                                        onChange={(e) => setRecipient(e.target.value)}
                                    >
                                        <MenuItem value="all_parents">All Parents</MenuItem>
                                        <MenuItem value="all_teachers">All Teachers</MenuItem>
                                        <MenuItem value="all_students">All Students</MenuItem>
                                        <MenuItem value="specific_class">Specific Class</MenuItem>
                                        <MenuItem value="specific_user">Specific User</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                            </Grid>
                            
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message here..."
                                />
                            </Grid>
                            
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button variant="outlined" startIcon={<AttachIcon />}>
                                        Attach File
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        startIcon={<SendIcon />}
                                        onClick={handleSend}
                                        disabled={!message}
                                    >
                                        Send Message
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Recent Messages */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Recent Messages</Typography>
                        
                        {recentMessages.map((msg) => (
                            <Card key={msg.id} variant="outlined" sx={{ mb: 2 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        {msg.type === 'sms' && <SmsIcon fontSize="small" color="primary" />}
                                        {msg.type === 'email' && <EmailIcon fontSize="small" color="primary" />}
                                        {msg.type === 'push' && <NotificationIcon fontSize="small" color="primary" />}
                                        <Typography variant="subtitle2">{msg.subject}</Typography>
                                        <Chip label={msg.status} size="small" color="success" sx={{ ml: 'auto' }} />
                                    </Box>
                                    <Typography variant="caption" color="textSecondary">
                                        To: {msg.recipient} | {msg.date}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Paper>
                </Grid>
            </Grid>

            {/* Quick Stats */}
            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <PeopleIcon color="primary" />
                                <Box>
                                    <Typography variant="h6">2,450</Typography>
                                    <Typography variant="caption">Total Recipients</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <EmailIcon color="success" />
                                <Box>
                                    <Typography variant="h6">1,280</Typography>
                                    <Typography variant="caption">Messages Sent (This Month)</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <HistoryIcon color="info" />
                                <Box>
                                    <Typography variant="h6">98%</Typography>
                                    <Typography variant="caption">Delivery Rate</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                    💡 Tip: Schedule important announcements in advance using the calendar feature.
                </Typography>
            </Alert>
        </Box>
    );
}

export default Communications;