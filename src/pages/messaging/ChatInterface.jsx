import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    IconButton,
    Avatar,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Badge,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    InputAdornment,
    CircularProgress,
    Alert,
    Snackbar,
    Tabs,
    Tab,
    AppBar,
    Toolbar,
    Drawer,
    useTheme,
    useMediaQuery,
    Fab,
    Zoom
} from '@mui/material';
import {
    Send as SendIcon,
    AttachFile as AttachIcon,
    Image as ImageIcon,
    EmojiEmotions as EmojiIcon,
    MoreVert as MoreIcon,
    Search as SearchIcon,
    ArrowBack as BackIcon,
    GroupAdd as GroupIcon,
    Announcement as AnnouncementIcon,
    BookOnline as MeetingIcon,
    Reply as ReplyIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    ContentCopy as CopyIcon,
    DoneAll as ReadIcon,
    Check as DeliveredIcon,
    AccessTime as TimeIcon
} from '@mui/icons-material';
import io from 'socket.io-client';
import api from '../../services/api';

function ChatInterface() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState(null);
    const [openGroupDialog, setOpenGroupDialog] = useState(false);
    const [openAnnouncementDialog, setOpenAnnouncementDialog] = useState(false);
    const [openMeetingDialog, setOpenMeetingDialog] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [drawerOpen, setDrawerOpen] = useState(!isMobile);
    const [replyTo, setReplyTo] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchConversations();
        connectSocket();
        
        return () => {
            if (socket) socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages();
            scrollToBottom();
        }
    }, [selectedConversation]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const connectSocket = () => {
        const newSocket = io('http://localhost:5000');
        newSocket.on('connect', () => {
            console.log('Socket connected');
            newSocket.emit('join_user', JSON.parse(localStorage.getItem('user')).id);
        });
        
        newSocket.on('new_message', (data) => {
            if (data.conversation_id === selectedConversation?.id) {
                setMessages(prev => [...prev, data.message]);
            }
            fetchConversations(); // Update conversation list
        });
        
        setSocket(newSocket);
    };

    const fetchConversations = async () => {
        try {
            const response = await api.get('/messaging/conversations');
            setConversations(response.data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const fetchMessages = async () => {
        if (!selectedConversation) return;
        
        setLoading(true);
        try {
            const response = await api.get(`/messaging/conversations/${selectedConversation.id}/messages`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() && !replyTo) return;
        
        try {
            const response = await api.post('/messaging/messages', {
                conversation_id: selectedConversation.id,
                content: newMessage,
                message_type: 'text',
                reply_to_id: replyTo?.id
            });
            
            setMessages(prev => [...prev, response.data]);
            setNewMessage('');
            setReplyTo(null);
            fetchConversations();
            scrollToBottom();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        
        if (isToday) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString();
    };

    const getMessageStatus = (message) => {
        if (message.is_read) return <ReadIcon fontSize="small" color="primary" />;
        if (message.is_delivered) return <DeliveredIcon fontSize="small" color="action" />;
        return <TimeIcon fontSize="small" color="disabled" />;
    };

    return (
        <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
            {/* Conversations Sidebar */}
            <Drawer
                variant={isMobile ? 'temporary' : 'persistent'}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{
                    width: 320,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': { width: 320, boxSizing: 'border-box', position: 'relative' }
                }}
            >
                <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="h6">Messages</Typography>
                    <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mt: 1 }}>
                        <Tab label="Chats" />
                        <Tab label="Groups" />
                    </Tabs>
                </Box>
                
                {activeTab === 0 && (
                    <List sx={{ flex: 1, overflow: 'auto' }}>
                        {conversations.filter(c => c.conversation_type === 'individual').map((conv) => (
                            <ListItem
                                key={conv.id}
                                button
                                selected={selectedConversation?.id === conv.id}
                                onClick={() => setSelectedConversation(conv)}
                                sx={{ borderBottom: '1px solid #f0f0f0' }}
                            >
                                <ListItemAvatar>
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                        color="success"
                                    >
                                        <Avatar src={conv.profile_photo_url}>
                                            {conv.other_first_name?.[0]}
                                        </Avatar>
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" fontWeight="bold">
                                                {conv.other_first_name} {conv.other_last_name}
                                            </Typography>
                                            {conv.last_message_time && (
                                                <Typography variant="caption" color="textSecondary">
                                                    {formatTime(conv.last_message_time)}
                                                </Typography>
                                            )}
                                        </Box>
                                    }
                                    secondary={
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography
                                                variant="caption"
                                                color="textSecondary"
                                                sx={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    maxWidth: 180
                                                }}
                                            >
                                                {conv.last_message}
                                            </Typography>
                                            {conv.unread_count > 0 && (
                                                <Chip label={conv.unread_count} size="small" color="primary" />
                                            )}
                                        </Box>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
                
                {activeTab === 1 && (
                    <List>
                        {conversations.filter(c => c.conversation_type === 'group').map((conv) => (
                            <ListItem
                                key={conv.id}
                                button
                                selected={selectedConversation?.id === conv.id}
                                onClick={() => setSelectedConversation(conv)}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                        <GroupIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={conv.conversation_name}
                                    secondary={conv.last_message}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Drawer>

            {/* Chat Area */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <Paper sx={{ p: 2, borderRadius: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {isMobile && (
                                    <IconButton onClick={() => setDrawerOpen(true)}>
                                        <BackIcon />
                                    </IconButton>
                                )}
                                <Avatar src={selectedConversation.profile_photo_url}>
                                    {selectedConversation.other_first_name?.[0]}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {selectedConversation.other_first_name} {selectedConversation.other_last_name}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {selectedConversation.other_role}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box>
                                <IconButton>
                                    <SearchIcon />
                                </IconButton>
                                <IconButton>
                                    <MoreIcon />
                                </IconButton>
                            </Box>
                        </Paper>

                        {/* Messages Area */}
                        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                messages.map((message, index) => {
                                    const isOwn = message.sender_id === JSON.parse(localStorage.getItem('user')).id;
                                    const showAvatar = !isOwn && (index === 0 || messages[index - 1]?.sender_id !== message.sender_id);
                                    
                                    return (
                                        <Box
                                            key={message.id}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: isOwn ? 'flex-end' : 'flex-start',
                                                mb: 1
                                            }}
                                        >
                                            {!isOwn && showAvatar && (
                                                <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                                                    {message.first_name?.[0]}
                                                </Avatar>
                                            )}
                                            <Box sx={{ maxWidth: '70%' }}>
                                                {!isOwn && !showAvatar && <Box sx={{ width: 40 }} />}
                                                <Paper
                                                    sx={{
                                                        p: 1.5,
                                                        bgcolor: isOwn ? 'primary.main' : 'white',
                                                        color: isOwn ? 'white' : 'text.primary',
                                                        borderRadius: 2,
                                                        position: 'relative'
                                                    }}
                                                >
                                                    {message.reply_to_id && (
                                                        <Box sx={{ mb: 1, p: 1, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 1, fontSize: 12 }}>
                                                            <Typography variant="caption">Replying to:</Typography>
                                                            <Typography variant="caption" display="block" color="textSecondary">
                                                                {message.reply_to_content}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                    <Typography variant="body2">{message.content}</Typography>
                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                                            {formatTime(message.created_at)}
                                                        </Typography>
                                                        {isOwn && getMessageStatus(message)}
                                                    </Box>
                                                </Paper>
                                                <Box sx={{ display: 'flex', gap: 1, mt: 0.5, ml: 1 }}>
                                                    <IconButton size="small" onClick={() => setReplyTo(message)}>
                                                        <ReplyIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small">
                                                        <CopyIcon fontSize="small" />
                                                    </IconButton>
                                                    {isOwn && (
                                                        <IconButton size="small">
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Box>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </Box>

                        {/* Reply Indicator */}
                        {replyTo && (
                            <Paper sx={{ p: 1, mx: 2, mb: 1, bgcolor: '#e3f2fd' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption">
                                        Replying to: {replyTo.content}
                                    </Typography>
                                    <IconButton size="small" onClick={() => setReplyTo(null)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Paper>
                        )}

                        {/* Message Input */}
                        <Paper sx={{ p: 2, borderRadius: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                                <IconButton>
                                    <AttachIcon />
                                </IconButton>
                                <IconButton>
                                    <ImageIcon />
                                </IconButton>
                                <TextField
                                    fullWidth
                                    multiline
                                    maxRows={4}
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    variant="outlined"
                                    size="small"
                                    sx={{ flex: 1 }}
                                />
                                <IconButton 
                                    color="primary" 
                                    onClick={sendMessage}
                                    disabled={!newMessage.trim()}
                                >
                                    <SendIcon />
                                </IconButton>
                            </Box>
                        </Paper>
                    </>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Typography color="textSecondary">Select a conversation to start chatting</Typography>
                    </Box>
                )}
            </Box>

            {/* FAB for new actions */}
            <Zoom in={!selectedConversation}>
                <Fab
                    color="primary"
                    sx={{ position: 'fixed', bottom: 16, right: 16 }}
                    onClick={() => setOpenGroupDialog(true)}
                >
                    <GroupIcon />
                </Fab>
            </Zoom>

            {/* Snackbar */}
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

export default ChatInterface;