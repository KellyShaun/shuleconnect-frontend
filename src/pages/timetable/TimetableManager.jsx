import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Chip,
    Alert,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Card,
    CardContent
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Refresh as RefreshIcon,
    School as SchoolIcon,
    Person as PersonIcon,
    MeetingRoom as RoomIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import api from '../../services/api';

const days = [
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' }
];

function TimetableManager() {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [terms, setTerms] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedTerm, setSelectedTerm] = useState('');
    const [timetable, setTimetable] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [formData, setFormData] = useState({
        subject_id: '',
        teacher_id: '',
        room_id: '',
        is_double_period: false,
        notes: ''
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (selectedClass && selectedTerm) {
            loadTimetable();
        }
    }, [selectedClass, selectedTerm]);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const [classesRes, subjectsRes, teachersRes, roomsRes, periodsRes, termsRes] = await Promise.all([
                api.get('/timetable/classes'),
                api.get('/timetable/subjects'),
                api.get('/timetable/teachers'),
                api.get('/timetable/rooms'),
                api.get('/timetable/periods'),
                api.get('/timetable/terms')
            ]);
            
            setClasses(classesRes.data);
            setSubjects(subjectsRes.data);
            setTeachers(teachersRes.data);
            setRooms(roomsRes.data);
            setPeriods(periodsRes.data);
            setTerms(termsRes.data);
            
            // Set default selections
            if (classesRes.data.length > 0) setSelectedClass(classesRes.data[0].id);
            if (termsRes.data.length > 0) {
                const currentTerm = termsRes.data.find(t => t.is_current) || termsRes.data[0];
                setSelectedTerm(currentTerm.id);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            setSnackbar({ open: true, message: 'Error loading data', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const loadTimetable = async () => {
        setLoading(true);
        try {
            const response = await api.get('/timetable/class', {
                params: { class_id: selectedClass, term_id: selectedTerm }
            });
            setTimetable(response.data);
        } catch (error) {
            console.error('Error loading timetable:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (day, period) => {
        setSelectedDay(day);
        setSelectedPeriod(period);
        setEditingEntry(null);
        setFormData({
            subject_id: '',
            teacher_id: '',
            room_id: '',
            is_double_period: false,
            notes: ''
        });
        setOpenDialog(true);
    };

    const handleEditEntry = (day, periodId, entry) => {
        setSelectedDay(day);
        setSelectedPeriod(periods.find(p => p.id === periodId));
        setEditingEntry(entry);
        setFormData({
            subject_id: entry.subject_id,
            teacher_id: entry.teacher_id,
            room_id: entry.room_id || '',
            is_double_period: entry.is_double_period || false,
            notes: entry.notes || ''
        });
        setOpenDialog(true);
    };

    const handleSaveEntry = async () => {
        if (!formData.subject_id || !formData.teacher_id) {
            setSnackbar({ open: true, message: 'Please select subject and teacher', severity: 'error' });
            return;
        }

        setLoading(true);
        try {
            const dayNumber = days.find(d => d.name === selectedDay)?.id;
            const payload = {
                class_id: selectedClass,
                subject_id: formData.subject_id,
                teacher_id: formData.teacher_id,
                room_id: formData.room_id || null,
                period_id: selectedPeriod.id,
                day_of_week: dayNumber,
                term_id: selectedTerm,
                is_double_period: formData.is_double_period,
                notes: formData.notes
            };

            if (editingEntry) {
                await api.put(`/timetable/entries/${editingEntry.id}`, payload);
                setSnackbar({ open: true, message: 'Entry updated', severity: 'success' });
            } else {
                await api.post('/timetable/entries', payload);
                setSnackbar({ open: true, message: 'Entry added', severity: 'success' });
            }
            
            setOpenDialog(false);
            loadTimetable();
        } catch (error) {
            console.error('Error saving entry:', error);
            setSnackbar({ 
                open: true, 
                message: error.response?.data?.error || 'Error saving entry', 
                severity: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEntry = async (entryId) => {
        if (!window.confirm('Are you sure you want to remove this entry?')) return;
        
        setLoading(true);
        try {
            await api.delete(`/timetable/entries/${entryId}`);
            setSnackbar({ open: true, message: 'Entry deleted', severity: 'success' });
            loadTimetable();
        } catch (error) {
            console.error('Error deleting entry:', error);
            setSnackbar({ open: true, message: 'Error deleting entry', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const getEntryAt = (day, periodId) => {
        return timetable[day]?.[periodId];
    };

    const getSubjectName = (subjectId) => {
        return subjects.find(s => s.id === subjectId)?.name || 'Unknown';
    };

    const getTeacherName = (teacherId) => {
        const teacher = teachers.find(t => t.id === teacherId);
        return teacher ? `${teacher.first_name} ${teacher.last_name}` : 'Unknown';
    };

    const getRoomName = (roomId) => {
        return rooms.find(r => r.id === roomId)?.room_name || '';
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h4" gutterBottom>Timetable Manager</Typography>
                <Typography variant="body2">Create and manage class timetables</Typography>
            </Paper>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={5}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Select Class</InputLabel>
                            <Select 
                                value={selectedClass} 
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                {classes.map(cls => (
                                    <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Select Term</InputLabel>
                            <Select 
                                value={selectedTerm} 
                                onChange={(e) => setSelectedTerm(e.target.value)}
                            >
                                {terms.map(term => (
                                    <MenuItem key={term.id} value={term.id}>
                                        {term.term_name} - {term.academic_year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button 
                            fullWidth 
                            variant="outlined" 
                            onClick={loadTimetable}
                            startIcon={<RefreshIcon />}
                        >
                            Refresh
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Timetable Table */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Paper sx={{ overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 800 }}>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                <TableCell width="120">Time / Period</TableCell>
                                {days.map(day => (
                                    <TableCell key={day.id} align="center" sx={{ fontWeight: 'bold' }}>
                                        {day.name}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {periods.map((period) => (
                                <TableRow key={period.id}>
                                    <TableCell sx={{ bgcolor: '#fafafa' }}>
                                        <Typography variant="body2" fontWeight="bold">
                                            Period {period.period_number}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {period.start_time.slice(0,5)} - {period.end_time.slice(0,5)}
                                        </Typography>
                                        {period.is_break && (
                                            <Chip label="Break" size="small" color="warning" sx={{ mt: 0.5 }} />
                                        )}
                                    </TableCell>
                                    {days.map((day) => {
                                        const entry = getEntryAt(day.name, period.id);
                                        
                                        if (period.is_break) {
                                            return (
                                                <TableCell key={day.id} sx={{ bgcolor: '#FFF8E1' }}>
                                                    <Typography variant="body2" color="textSecondary" align="center">
                                                        {period.break_name || 'Break Time'}
                                                    </Typography>
                                                </TableCell>
                                            );
                                        }
                                        
                                        return (
                                            <TableCell 
                                                key={day.id}
                                                sx={{ 
                                                    bgcolor: entry ? '#E8F5E9' : 'white',
                                                    cursor: 'pointer',
                                                    '&:hover': { bgcolor: '#f0f0f0' },
                                                    minWidth: 180,
                                                    verticalAlign: 'top'
                                                }}
                                                onClick={() => !entry && handleOpenDialog(day.name, period)}
                                            >
                                                {entry ? (
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {getSubjectName(entry.subject_id)}
                                                        </Typography>
                                                        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                                            <PersonIcon fontSize="inherit" sx={{ fontSize: 12, mr: 0.5 }} />
                                                            {getTeacherName(entry.teacher_id)}
                                                        </Typography>
                                                        {entry.room_name && (
                                                            <Typography variant="caption" display="block">
                                                                <RoomIcon fontSize="inherit" sx={{ fontSize: 12, mr: 0.5 }} />
                                                                {entry.room_name}
                                                            </Typography>
                                                        )}
                                                        {entry.is_double_period && (
                                                            <Chip label="Double" size="small" color="secondary" sx={{ mt: 0.5, fontSize: '10px' }} />
                                                        )}
                                                        <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEditEntry(day.name, period.id, entry);
                                                                }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteEntry(entry.id);
                                                                }}
                                                            >
                                                                <DeleteIcon fontSize="small" color="error" />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
                                                ) : (
                                                    <Button 
                                                        size="small" 
                                                        variant="outlined" 
                                                        startIcon={<AddIcon />}
                                                        sx={{ textTransform: 'none', width: '100%' }}
                                                    >
                                                        Add Class
                                                    </Button>
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingEntry ? 'Edit Timetable Entry' : 'Add Timetable Entry'}
                    <Typography variant="caption" display="block" color="textSecondary">
                        {selectedDay} - {selectedPeriod?.start_time?.slice(0,5)} to {selectedPeriod?.end_time?.slice(0,5)}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Subject</InputLabel>
                                <Select 
                                    value={formData.subject_id} 
                                    onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                                >
                                    <MenuItem value="">Select Subject</MenuItem>
                                    {subjects.map(sub => (
                                        <MenuItem key={sub.id} value={sub.id}>{sub.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Teacher</InputLabel>
                                <Select 
                                    value={formData.teacher_id} 
                                    onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                                >
                                    <MenuItem value="">Select Teacher</MenuItem>
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
                                <InputLabel>Room (Optional)</InputLabel>
                                <Select 
                                    value={formData.room_id} 
                                    onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
                                >
                                    <MenuItem value="">No Room</MenuItem>
                                    {rooms.map(room => (
                                        <MenuItem key={room.id} value={room.id}>
                                            {room.room_name} - {room.building}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Notes (Optional)"
                                multiline
                                rows={2}
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button 
                        onClick={handleSaveEntry} 
                        variant="contained"
                        disabled={!formData.subject_id || !formData.teacher_id}
                    >
                        {editingEntry ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default TimetableManager;