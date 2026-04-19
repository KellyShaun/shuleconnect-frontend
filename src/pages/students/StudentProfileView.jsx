/* eslint-disable react/jsx-no-undef */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Avatar,
    Chip,
    IconButton,
    Tabs,
    Tab,
    Divider,
    Button,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    LinearProgress,
    Alert,
    Breadcrumbs,
    Link
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Print as PrintIcon,
    School as SchoolIcon,
    MedicalServices as MedicalIcon,
    FamilyRestroom as FamilyIcon,
    Assessment as AssessmentIcon,
    AttachMoney as MoneyIcon,
    Description as DocumentIcon,
    QrCode as QrCodeIcon
} from '@mui/icons-material';
import api from '../../services/api';

function TabPanel({ children, value, index }) {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function StudentProfileView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        fetchStudent();
    }, [id]);

    const fetchStudent = async () => {
        try {
            const response = await api.get(`/students/${id}`);
            setStudent(response.data);
        } catch (error) {
            console.error('Error fetching student:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LinearProgress />;
    if (!student) return <Alert severity="error">Student not found</Alert>;

    return (
        <Box sx={{ p: 3 }}>
            {/* Header with breadcrumbs */}
            <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Breadcrumbs sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                            <Link color="inherit" onClick={() => navigate('/students')} sx={{ cursor: 'pointer' }}>
                                Students
                            </Link>
                            <Typography color="white">Student Profile</Typography>
                        </Breadcrumbs>
                        <Typography variant="h4">{student.first_name} {student.last_name}</Typography>
                        <Typography variant="subtitle1">Admission: {student.admission_number}</Typography>
                    </Box>
                    <Box>
                        <IconButton sx={{ color: 'white' }} onClick={() => navigate(`/students/edit/${id}`)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton sx={{ color: 'white' }}>
                            <PrintIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Paper>

            {/* Student Basic Info Card */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                    <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: 40 }}>
                        {student.first_name?.[0]}{student.last_name?.[0]}
                    </Avatar>
                    <Box>
                        <Typography variant="h5">{student.first_name} {student.middle_name} {student.last_name}</Typography>
                        <Typography variant="body1" color="textSecondary">Class: {student.class_name} | Stream: {student.stream || 'N/A'}</Typography>
                        <Typography variant="body2">Phone: {student.phone} | Email: {student.email}</Typography>
                        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                            <Chip label={student.enrollment_status} color={student.enrollment_status === 'active' ? 'success' : 'default'} size="small" />
                            <Chip label={student.student_type === 'boarding' ? 'Boarding' : 'Day Scholar'} size="small" />
                            {student.ai_risk_score > 50 && <Chip label="At Risk" color="error" size="small" />}
                        </Box>
                    </Box>
                </Box>
            </Paper>

            {/* Tabs */}
            <Paper>
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="scrollable" scrollButtons="auto">
                    <Tab icon={<SchoolIcon />} label="Personal Info" />
                    <Tab icon={<FamilyRestroomIcon />} label="Family" />
                    <Tab icon={<MedicalServicesIcon />} label="Medical" />
                    <Tab icon={<AssessmentIcon />} label="Academic" />
                    <Tab icon={<MoneyIcon />} label="Fees" />
                    <Tab icon={<DocumentIcon />} label="Documents" />
                </Tabs>

                {/* Personal Info Tab */}
                <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">Full Name</Typography>
                            <Typography>{student.first_name} {student.middle_name} {student.last_name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">Admission Number</Typography>
                            <Typography>{student.admission_number}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">Gender</Typography>
                            <Typography>{student.gender}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">Date of Birth</Typography>
                            <Typography>{new Date(student.date_of_birth).toLocaleDateString()}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                            <Typography>{student.phone}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                            <Typography>{student.email || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">National ID</Typography>
                            <Typography>{student.national_id || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="textSecondary">Address</Typography>
                            <Typography>{student.address || 'N/A'}</Typography>
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* Family Tab */}
                <TabPanel value={tabValue} index={1}>
                    {student.parents && student.parents.map((parent, idx) => (
                        <Card key={idx} sx={{ mb: 2 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6">{parent.first_name} {parent.last_name}</Typography>
                                    {parent.is_primary && <Chip label="Primary Contact" color="primary" size="small" />}
                                </Box>
                                <Typography variant="body2">Relationship: {parent.relationship}</Typography>
                                <Typography variant="body2">Phone: {parent.phone}</Typography>
                                <Typography variant="body2">Email: {parent.email}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                </TabPanel>

                {/* Medical Tab */}
                <TabPanel value={tabValue} index={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="textSecondary">Medical Conditions</Typography>
                            <Alert severity="warning">{student.medical_conditions || 'None'}</Alert>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="textSecondary">Allergies</Typography>
                            <Alert severity="error">{student.allergies || 'None'}</Alert>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">Blood Group</Typography>
                            <Chip label={student.blood_group || 'Not specified'} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">Emergency Contact</Typography>
                            <Typography>{student.emergency_contact} - {student.emergency_phone}</Typography>
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* Academic Tab */}
                <TabPanel value={tabValue} index={3}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Year</TableCell>
                                    <TableCell>Class</TableCell>
                                    <TableCell>Position</TableCell>
                                    <TableCell>Average Score</TableCell>
                                    <TableCell>Grade</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {student.academic_progress?.map((progress, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{progress.academic_year}</TableCell>
                                        <TableCell>{progress.class_name}</TableCell>
                                        <TableCell>{progress.position}</TableCell>
                                        <TableCell>{progress.average_score}%</TableCell>
                                        <TableCell>{progress.grade}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>

                {/* Fees Tab */}
                <TabPanel value={tabValue} index={4}>
                    <Typography>Fee information coming soon...</Typography>
                </TabPanel>

                {/* Documents Tab */}
                <TabPanel value={tabValue} index={5}>
                    <Typography>Documents coming soon...</Typography>
                </TabPanel>
            </Paper>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                <Button variant="outlined" onClick={() => navigate('/students')}>
                    Back to List
                </Button>
                <Button variant="contained" onClick={() => navigate(`/students/edit/${id}`)}>
                    Edit Student
                </Button>
            </Box>
        </Box>
    );
}

export default StudentProfileView;