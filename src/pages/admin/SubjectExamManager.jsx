import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar,
    Tab,
    Tabs
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../../services/api';

function SubjectExamManager() {
    const [activeTab, setActiveTab] = useState(0);
    const [subjects, setSubjects] = useState([]);
    const [exams, setExams] = useState([]);
    const [classes, setClasses] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchSubjects();
        fetchClasses();
    }, []);

    useEffect(() => {
        if (activeTab === 1) {
            fetchExams();
        }
    }, [activeTab]);

    const fetchSubjects = async () => {
        try {
            const response = await api.get('/subjects');
            setSubjects(response.data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    const fetchExams = async () => {
        try {
            const response = await api.get('/exams');
            setExams(response.data);
        } catch (error) {
            console.error('Error fetching exams:', error);
        }
    };

    const fetchClasses = async () => {
        try {
            const response = await api.get('/classes');
            setClasses(response.data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const handleCreateSubject = async () => {
        try {
            await api.post('/subjects', formData);
            setSnackbar({ open: true, message: 'Subject created successfully', severity: 'success' });
            setOpenDialog(false);
            fetchSubjects();
            setFormData({});
        } catch (error) {
            setSnackbar({ open: true, message: 'Error creating subject', severity: 'error' });
        }
    };

    const handleCreateExam = async () => {
        try {
            await api.post('/exams', formData);
            setSnackbar({ open: true, message: 'Exam created successfully', severity: 'success' });
            setOpenDialog(false);
            fetchExams();
            setFormData({});
        } catch (error) {
            setSnackbar({ open: true, message: 'Error creating exam', severity: 'error' });
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h4" gutterBottom>Subject & Exam Manager</Typography>
                <Typography variant="body2">Manage subjects and examinations</Typography>
            </Paper>

            <Paper sx={{ p: 2 }}>
                <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                    <Tab label="Subjects" />
                    <Tab label="Exams" />
                </Tabs>

                <Box sx={{ p: 2 }}>
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />} 
                        onClick={() => {
                            setEditingItem(null);
                            setFormData({});
                            setOpenDialog(true);
                        }}
                        sx={{ mb: 2 }}
                    >
                        Add {activeTab === 0 ? 'Subject' : 'Exam'}
                    </Button>

                    {activeTab === 0 && (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Subject Name</TableCell>
                                        <TableCell>Code</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {subjects.map((subject) => (
                                        <TableRow key={subject.id}>
                                            <TableCell>{subject.name}</TableCell>
                                            <TableCell>{subject.code}</TableCell>
                                            <TableCell>{subject.description}</TableCell>
                                            <TableCell>
                                                <IconButton size="small">
                                                    <EditIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {subjects.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                No subjects found. Click "Add Subject" to create one.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {activeTab === 1 && (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Exam Name</TableCell>
                                        <TableCell>Class</TableCell>
                                        <TableCell>Subject</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Max Score</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {exams.map((exam) => (
                                        <TableRow key={exam.id}>
                                            <TableCell>{exam.exam_name}</TableCell>
                                            <TableCell>{exam.class_name}</TableCell>
                                            <TableCell>{exam.subject_name}</TableCell>
                                            <TableCell>{exam.exam_date}</TableCell>
                                            <TableCell>{exam.max_score}</TableCell>
                                            <TableCell>
                                                <IconButton size="small">
                                                    <EditIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {exams.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                No exams found. Click "Add Exam" to create one.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </Paper>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{activeTab === 0 ? 'Add Subject' : 'Add Exam'}</DialogTitle>
                <DialogContent>
                    {activeTab === 0 ? (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Subject Name"
                                    value={formData.name || ''}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Subject Code"
                                    value={formData.code || ''}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Description"
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Exam Name"
                                    value={formData.exam_name || ''}
                                    onChange={(e) => setFormData({ ...formData, exam_name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Class</InputLabel>
                                    <Select
                                        value={formData.class_id || ''}
                                        onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                                    >
                                        {classes.map(cls => (
                                            <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Subject</InputLabel>
                                    <Select
                                        value={formData.subject_id || ''}
                                        onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                                    >
                                        {subjects.map(sub => (
                                            <MenuItem key={sub.id} value={sub.id}>{sub.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Exam Date"
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.exam_date || ''}
                                    onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Max Score"
                                    value={formData.max_score || 100}
                                    onChange={(e) => setFormData({ ...formData, max_score: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Pass Mark"
                                    value={formData.pass_mark || 40}
                                    onChange={(e) => setFormData({ ...formData, pass_mark: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={activeTab === 0 ? handleCreateSubject : handleCreateExam}>
                        Create
                    </Button>
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

export default SubjectExamManager;