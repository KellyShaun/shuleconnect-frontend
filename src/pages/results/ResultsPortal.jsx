/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-undef */
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Dialog,
    LinearProgress,
    Tabs,
    Tab,
    Avatar
} from '@mui/material';
import {
    Download as DownloadIcon,
    Print as PrintIcon,
    School as SchoolIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    PictureAsPdf as PdfIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../../services/api';

function ResultsPortal() {
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [performanceData, setPerformanceData] = useState([]);
    const [subjectPerformance, setSubjectPerformance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [openReportDialog, setOpenReportDialog] = useState(false);
    const [selectedTerm, setSelectedTerm] = useState(null);

    useEffect(() => {
        fetchChildren();
    }, []);

    useEffect(() => {
        if (selectedChild) {
            fetchPerformanceTrends();
            fetchSubjectPerformance();
        }
    }, [selectedChild]);

    const fetchChildren = async () => {
        setLoading(true);
        try {
            const response = await api.get('/students/my-children');
            setChildren(response.data);
            if (response.data.length > 0) {
                setSelectedChild(response.data[0]);
            }
        } catch (error) {
            console.error('Error fetching children:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPerformanceTrends = async () => {
        if (!selectedChild) return;
        
        try {
            const response = await api.get(`/results/performance/trends/${selectedChild.id}`);
            setPerformanceData(response.data);
        } catch (error) {
            console.error('Error fetching performance trends:', error);
        }
    };

    const fetchSubjectPerformance = async () => {
        if (!selectedChild) return;
        
        try {
            const response = await api.get(`/results/subject-performance/${selectedChild.id}`);
            setSubjectPerformance(response.data);
        } catch (error) {
            console.error('Error fetching subject performance:', error);
        }
    };

    const downloadReportCard = async (termId) => {
        try {
            const response = await api.get(`/results/report-card/${selectedChild.id}/${termId}`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report_card_${selectedChild.admission_number}_term_${termId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading report card:', error);
        }
    };

    const getGradeColor = (grade) => {
        if (grade === 'A' || grade === 'A-') return 'success';
        if (grade === 'B+' || grade === 'B' || grade === 'B-') return 'info';
        if (grade === 'C+' || grade === 'C' || grade === 'C-') return 'warning';
        return 'error';
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h4" gutterBottom>Academic Results Portal</Typography>
                <Typography variant="body2">View performance reports and download report cards</Typography>
            </Paper>

            {/* Child Selector */}
            {children.length > 1 && (
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>Select Student</Typography>
                    <Grid container spacing={2}>
                        {children.map(child => (
                            <Grid item key={child.id}>
                                <Button
                                    variant={selectedChild?.id === child.id ? 'contained' : 'outlined'}
                                    onClick={() => setSelectedChild(child)}
                                    startIcon={<SchoolIcon />}
                                >
                                    {child.first_name} {child.last_name} - {child.class_name}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            )}

            {selectedChild && (
                <>
                    {/* Student Info Card */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}>
                                    {selectedChild.first_name?.[0]}{selectedChild.last_name?.[0]}
                                </Avatar>
                                <Box>
                                    <Typography variant="h5">{selectedChild.first_name} {selectedChild.last_name}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {selectedChild.class_name} | Admission: {selectedChild.admission_number}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Tabs */}
                    <Paper sx={{ mb: 3 }}>
                        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                            <Tab label="Performance Overview" />
                            <Tab label="Subject Analysis" />
                            <Tab label="Report Cards" />
                        </Tabs>

                        {/* Performance Overview Tab */}
                        {activeTab === 0 && (
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>Performance Trend</Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={performanceData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="term_name" />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="average_score" stroke="#2E7D32" name="Average Score (%)" />
                                        <Line type="monotone" dataKey="class_position" stroke="#1976D2" name="Class Position" />
                                    </LineChart>
                                </ResponsiveContainer>
                                
                                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Performance Summary</Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Term</TableCell>
                                                <TableCell align="center">Average Score</TableCell>
                                                <TableCell align="center">Mean Grade</TableCell>
                                                <TableCell align="center">Position</TableCell>
                                                <TableCell align="center">Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {performanceData.map((term) => (
                                                <TableRow key={term.id}>
                                                    <TableCell>{term.term_name} - {term.academic_year}</TableCell>
                                                    <TableCell align="center">{term.average_score?.toFixed(1)}%</TableCell>
                                                    <TableCell align="center">
                                                        <Chip label={term.mean_grade} color={getGradeColor(term.mean_grade)} size="small" />
                                                    </TableCell>
                                                    <TableCell align="center">{term.class_position}</TableCell>
                                                    <TableCell align="center">
                                                        <Button size="small" startIcon={<PdfIcon />} onClick={() => downloadReportCard(term.term_id)}>
                                                            Report Card
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}

                        {/* Subject Analysis Tab */}
                        {activeTab === 1 && (
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>Subject-wise Performance</Typography>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={subjectPerformance}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="subject_name" />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="score" fill="#2E7D32" name="Your Score" />
                                        <Bar dataKey="class_average" fill="#1976D2" name="Class Average" />
                                    </BarChart>
                                </ResponsiveContainer>
                                
                                <TableContainer sx={{ mt: 3 }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Subject</TableCell>
                                                <TableCell align="center">Your Score</TableCell>
                                                <TableCell align="center">Class Average</TableCell>
                                                <TableCell align="center">Grade</TableCell>
                                                <TableCell align="center">Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {subjectPerformance.map((subject) => (
                                                <TableRow key={subject.subject_id}>
                                                    <TableCell>{subject.subject_name}</TableCell>
                                                    <TableCell align="center">{subject.score}%</TableCell>
                                                    <TableCell align="center">{subject.class_average}%</TableCell>
                                                    <TableCell align="center">
                                                        <Chip label={subject.grade} color={getGradeColor(subject.grade)} size="small" />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {subject.score >= subject.class_average ? (
                                                            <Chip label="Above Average" color="success" size="small" icon={<TrendingUpIcon />} />
                                                        ) : (
                                                            <Chip label="Below Average" color="error" size="small" icon={<TrendingDownIcon />} />
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}

                        {/* Report Cards Tab */}
                        {activeTab === 2 && (
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>Available Report Cards</Typography>
                                <Grid container spacing={2}>
                                    {performanceData.map((term) => (
                                        <Grid item xs={12} sm={6} md={4} key={term.id}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="h6">{term.term_name} {term.academic_year}</Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Average: {term.average_score?.toFixed(1)}% | Grade: {term.mean_grade}
                                                    </Typography>
                                                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                                        <Button 
                                                            size="small" 
                                                            variant="contained" 
                                                            startIcon={<PdfIcon />}
                                                            onClick={() => downloadReportCard(term.term_id)}
                                                        >
                                                            Download PDF
                                                        </Button>
                                                        <Button size="small" variant="outlined" startIcon={<PrintIcon />}>
                                                            Print
                                                        </Button>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}
                    </Paper>
                </>
            )}

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

export default ResultsPortal;