import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    IconButton,
    Alert,
    Snackbar,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    Card,
    CardContent,
    LinearProgress,
    Tooltip
} from '@mui/material';
import {
    Save as SaveIcon,
    Upload as UploadIcon,
    Download as DownloadIcon,
    Lock as LockIcon,
    LockOpen as LockOpenIcon,
    CheckCircle as CheckIcon,
    Warning as WarningIcon,
    Print as PrintIcon,
    Refresh as RefreshIcon,
    Calculate as CalculateIcon,
    Assessment as AssessmentIcon
} from '@mui/icons-material';
import api from '../../services/api';

function TeacherMarksEntry() {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [exams, setExams] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedExam, setSelectedExam] = useState('');
    const [students, setStudents] = useState([]);
    const [marksData, setMarksData] = useState({});
    const [examDetails, setExamDetails] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [openBulkDialog, setOpenBulkDialog] = useState(false);
    const [bulkData, setBulkData] = useState('');
    const [gradingScales, setGradingScales] = useState([]);

    useEffect(() => {
        fetchTeacherClasses();
        fetchGradingScales();
    }, []);

    // FIXED: When class changes, fetch subjects for that class
    useEffect(() => {
        if (selectedClass) {
            fetchSubjects();
        }
    }, [selectedClass]);

    useEffect(() => {
        if (selectedClass && selectedSubject) {
            fetchExams();
        }
    }, [selectedClass, selectedSubject]);

    useEffect(() => {
        if (selectedExam) {
            fetchStudentsForMarks();
            fetchExamDetails();
        }
    }, [selectedExam]);

    // FIXED: Changed from '/teacher/classes' to '/classes'
    const fetchTeacherClasses = async () => {
        setLoading(true);
        try {
            const response = await api.get('/classes');
            setClasses(response.data);
            if (response.data.length > 0) {
                setSelectedClass(response.data[0].id);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
            setSnackbar({ open: true, message: 'Error fetching classes: ' + (error.response?.data?.error || error.message), severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // NEW: Fetch subjects for the selected class
    const fetchSubjects = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/classes/${selectedClass}/subjects`);
            setSubjects(response.data);
            if (response.data.length > 0) {
                setSelectedSubject(response.data[0].id);
            } else {
                setSelectedSubject('');
                setSubjects([]);
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
            setSubjects([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchGradingScales = async () => {
        try {
            const response = await api.get('/results/grading-scales');
            setGradingScales(response.data);
        } catch (error) {
            console.error('Error fetching grading scales:', error);
        }
    };

    const fetchExams = async () => {
        setLoading(true);
        try {
            const response = await api.get('/results/exams', {
                params: { class_id: selectedClass, subject_id: selectedSubject }
            });
            setExams(response.data);
            if (response.data.length > 0) {
                setSelectedExam(response.data[0].id);
            } else {
                setSelectedExam('');
            }
        } catch (error) {
            console.error('Error fetching exams:', error);
            setSnackbar({ open: true, message: 'Error fetching exams', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const fetchExamDetails = async () => {
        try {
            const response = await api.get(`/results/exams/${selectedExam}`);
            setExamDetails(response.data);
        } catch (error) {
            console.error('Error fetching exam details:', error);
        }
    };

    const fetchStudentsForMarks = async () => {
        setLoading(true);
        try {
            const response = await api.get('/results/marks/students', {
                params: { class_id: selectedClass, exam_id: selectedExam }
            });
            setStudents(response.data);
            
            // Initialize marks data
            const initialData = {};
            response.data.forEach(student => {
                initialData[student.id] = {
                    score: student.current_score || '',
                    remarks: student.remarks || '',
                    grade: student.current_grade || ''
                };
            });
            setMarksData(initialData);
        } catch (error) {
            console.error('Error fetching students:', error);
            setSnackbar({ open: true, message: 'Error fetching students', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleScoreChange = (studentId, value) => {
        const score = parseFloat(value);
        const grade = calculateGrade(score, examDetails?.max_score || 100);
        
        setMarksData(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                score: value,
                grade: grade.grade
            }
        }));
    };

    const calculateGrade = (score, maxScore) => {
        if (!score || isNaN(score)) return { grade: 'N/A', points: 0, remark: 'Not graded' };
        const percentage = (score / maxScore) * 100;
        const grade = gradingScales.find(g => 
            percentage >= g.min_percentage && percentage <= g.max_percentage
        );
        return grade || { grade: 'N/A', points: 0, remark: 'Not graded' };
    };

    const handleRemarksChange = (studentId, value) => {
        setMarksData(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                remarks: value
            }
        }));
    };

    const saveMarks = async () => {
        setLoading(true);
        
        const marksArray = Object.entries(marksData)
            .filter(([_, data]) => data.score !== '')
            .map(([studentId, data]) => ({
                student_id: parseInt(studentId),
                score: parseFloat(data.score),
                remarks: data.remarks || ''
            }));
        
        if (marksArray.length === 0) {
            setSnackbar({ open: true, message: 'No marks to save', severity: 'warning' });
            setLoading(false);
            return;
        }
        
        try {
            await api.post('/results/marks/save', {
                exam_id: selectedExam,
                marks_data: marksArray
            });
            
            setSnackbar({ open: true, message: 'Marks saved successfully!', severity: 'success' });
            fetchStudentsForMarks(); // Refresh
        } catch (error) {
            console.error('Error saving marks:', error);
            setSnackbar({ open: true, message: 'Error saving marks: ' + (error.response?.data?.error || error.message), severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleBulkUpload = () => {
        try {
            const rows = bulkData.split('\n');
            const newMarksData = { ...marksData };
            
            rows.forEach(row => {
                const [admissionNumber, score] = row.split(',');
                if (admissionNumber && score) {
                    const student = students.find(s => s.admission_number === admissionNumber.trim());
                    if (student) {
                        const grade = calculateGrade(parseFloat(score.trim()), examDetails?.max_score || 100);
                        newMarksData[student.id] = {
                            ...newMarksData[student.id],
                            score: parseFloat(score.trim()),
                            grade: grade.grade
                        };
                    }
                }
            });
            
            setMarksData(newMarksData);
            setOpenBulkDialog(false);
            setBulkData('');
            setSnackbar({ open: true, message: 'Bulk data imported successfully', severity: 'success' });
        } catch (error) {
            setSnackbar({ open: true, message: 'Error parsing bulk data', severity: 'error' });
        }
    };

    const downloadTemplate = () => {
        const headers = ['Admission Number', 'Score'];
        const rows = students.map(s => `${s.admission_number},`);
        const csv = [headers.join(','), ...rows].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'marks_template.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const calculateStatistics = () => {
        const scores = Object.values(marksData)
            .filter(d => d.score !== '')
            .map(d => parseFloat(d.score));
        
        if (scores.length === 0) return null;
        
        const sum = scores.reduce((a, b) => a + b, 0);
        const average = sum / scores.length;
        const highest = Math.max(...scores);
        const lowest = Math.min(...scores);
        const passCount = scores.filter(s => s >= (examDetails?.pass_mark || 40)).length;
        
        return {
            average: average.toFixed(1),
            highest,
            lowest,
            passRate: ((passCount / scores.length) * 100).toFixed(1)
        };
    };

    const stats = calculateStatistics();

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h4" gutterBottom>Marks Entry</Typography>
                <Typography variant="body2">Enter and manage student marks for assessments</Typography>
            </Paper>

            {/* Selection Filters */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Select Class</InputLabel>
                            <Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                                <MenuItem value="">Select Class</MenuItem>
                                {classes.map(cls => (
                                    <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Select Subject</InputLabel>
                            <Select 
                                value={selectedSubject} 
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                disabled={!selectedClass || subjects.length === 0}
                            >
                                <MenuItem value="">Select Subject</MenuItem>
                                {subjects.map(sub => (
                                    <MenuItem key={sub.id} value={sub.id}>{sub.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Select Exam</InputLabel>
                            <Select 
                                value={selectedExam} 
                                onChange={(e) => setSelectedExam(e.target.value)}
                                disabled={!selectedSubject || exams.length === 0}
                            >
                                <MenuItem value="">Select Exam</MenuItem>
                                {exams.map(exam => (
                                    <MenuItem key={exam.id} value={exam.id}>{exam.exam_name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            {selectedExam && examDetails && (
                <>
                    {/* Exam Info Card */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={3}>
                                    <Typography color="textSecondary" gutterBottom>Exam Name</Typography>
                                    <Typography variant="h6">{examDetails.exam_name}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Typography color="textSecondary" gutterBottom>Max Score</Typography>
                                    <Typography variant="h6">{examDetails.max_score}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Typography color="textSecondary" gutterBottom>Pass Mark</Typography>
                                    <Typography variant="h6">{examDetails.pass_mark || 40}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Typography color="textSecondary" gutterBottom>Status</Typography>
                                    <Chip 
                                        label={examDetails.is_locked ? 'Locked' : 'Open'} 
                                        color={examDetails.is_locked ? 'error' : 'success'}
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Statistics Cards */}
                    {stats && (
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={6} sm={3}>
                                <Card sx={{ bgcolor: '#E3F2FD' }}>
                                    <CardContent>
                                        <Typography color="textSecondary">Class Average</Typography>
                                        <Typography variant="h4">{stats.average}%</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Card sx={{ bgcolor: '#E8F5E9' }}>
                                    <CardContent>
                                        <Typography color="textSecondary">Highest Score</Typography>
                                        <Typography variant="h4">{stats.highest}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Card sx={{ bgcolor: '#FFF3E0' }}>
                                    <CardContent>
                                        <Typography color="textSecondary">Lowest Score</Typography>
                                        <Typography variant="h4">{stats.lowest}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Card sx={{ bgcolor: '#F3E5F5' }}>
                                    <CardContent>
                                        <Typography color="textSecondary">Pass Rate</Typography>
                                        <Typography variant="h4">{stats.passRate}%</Typography>
                                        <LinearProgress variant="determinate" value={parseFloat(stats.passRate)} />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    )}

                    {/* Action Buttons */}
                    <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button variant="contained" startIcon={<SaveIcon />} onClick={saveMarks} disabled={loading}>
                            Save Marks
                        </Button>
                        <Button variant="outlined" startIcon={<UploadIcon />} onClick={() => setOpenBulkDialog(true)}>
                            Bulk Upload
                        </Button>
                        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={downloadTemplate}>
                            Download Template
                        </Button>
                        <Button variant="outlined" startIcon={<CalculateIcon />}>
                            Calculate Grades
                        </Button>
                    </Box>

                    {/* Marks Entry Table */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                    <TableCell>Admission No</TableCell>
                                    <TableCell>Student Name</TableCell>
                                    <TableCell align="center">Score / {examDetails.max_score}</TableCell>
                                    <TableCell>Grade</TableCell>
                                    <TableCell>Remarks</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                ) : students.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <Typography color="textSecondary">No students found in this class</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    students.map((student) => (
                                        <TableRow key={student.id} hover>
                                            <TableCell>{student.admission_number}</TableCell>
                                            <TableCell>{student.first_name} {student.last_name}</TableCell>
                                            <TableCell align="center">
                                                <TextField
                                                    size="small"
                                                    type="number"
                                                    value={marksData[student.id]?.score || ''}
                                                    onChange={(e) => handleScoreChange(student.id, e.target.value)}
                                                    sx={{ width: 100 }}
                                                    inputProps={{ min: 0, max: examDetails.max_score }}
                                                    disabled={examDetails?.is_locked}
                                                />
                                                <Typography variant="caption" color="textSecondary">
                                                    / {examDetails.max_score}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={marksData[student.id]?.grade || 'N/A'}
                                                    size="small"
                                                    color={marksData[student.id]?.grade?.startsWith('A') ? 'success' : 'default'}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    placeholder="Remarks"
                                                    value={marksData[student.id]?.remarks || ''}
                                                    onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                                                    disabled={examDetails?.is_locked}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            {/* Bulk Upload Dialog */}
            <Dialog open={openBulkDialog} onClose={() => setOpenBulkDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Bulk Upload Marks</DialogTitle>
                <DialogContent>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Format: Admission Number, Score (one per line)
                        <br />
                        Example: 2024001,85
                    </Alert>
                    <TextField
                        fullWidth
                        multiline
                        rows={10}
                        placeholder="2024001,85&#10;2024002,72&#10;2024003,91"
                        value={bulkData}
                        onChange={(e) => setBulkData(e.target.value)}
                        sx={{ fontFamily: 'monospace' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenBulkDialog(false)}>Cancel</Button>
                    <Button onClick={handleBulkUpload} variant="contained">Upload</Button>
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

export default TeacherMarksEntry;