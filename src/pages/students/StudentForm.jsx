import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Checkbox,
    Select,
    MenuItem,
    FormControlLabel,
    Chip,
    Stepper,
    Step,
    StepLabel,
    IconButton,
    Alert,
    CircularProgress,
    Divider
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../../services/api';

const steps = ['Personal Information', 'Academic Details', 'Parent/Guardian', 'Medical Information'];

function StudentForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [classes, setClasses] = useState([]);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',  // REMOVED middle_name
        email: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        // national_id: '', // REMOVED
        address: '',
        class_id: '',
        stream: '',
        student_type: 'day_scholar',
        admission_date: new Date().toISOString().split('T')[0],
        medical_conditions: '',
        allergies: '',
        blood_group: '',
        emergency_contact: '',
        emergency_phone: '',
        previous_school: '',
        parents: [{ first_name: '', last_name: '', email: '', phone: '', relationship: '', is_primary: true }]
    });

    useEffect(() => {
        fetchClasses();
        if (isEditing) {
            fetchStudent();
        }
    }, [id]);

    const fetchClasses = async () => {
        try {
            const response = await api.get('/classes');
            setClasses(response.data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const fetchStudent = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/students/${id}`);
            const student = response.data;
            setFormData({
                ...student,
                date_of_birth: student.date_of_birth?.split('T')[0] || '',
                admission_date: student.admission_date?.split('T')[0] || new Date().toISOString().split('T')[0],
                parents: student.parents?.length ? student.parents : [{ first_name: '', last_name: '', email: '', phone: '', relationship: '', is_primary: true }]
            });
        } catch (error) {
            console.error('Error fetching student:', error);
            setError('Error loading student data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleParentChange = (index, field, value) => {
        const updatedParents = [...formData.parents];
        updatedParents[index][field] = value;
        setFormData(prev => ({ ...prev, parents: updatedParents }));
    };

    const addParent = () => {
        setFormData(prev => ({
            ...prev,
            parents: [...prev.parents, { first_name: '', last_name: '', email: '', phone: '', relationship: '', is_primary: false }]
        }));
    };

    const removeParent = (index) => {
        const updatedParents = formData.parents.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, parents: updatedParents }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        
        try {
            if (isEditing) {
                await api.put(`/students/${id}`, formData);
            } else {
                await api.post('/students', formData);
            }
            navigate('/students');
        } catch (error) {
            console.error('Error saving student:', error);
            setError(error.response?.data?.error || 'Error saving student');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4">
                        {isEditing ? 'Edit Student' : 'Add New Student'}
                    </Typography>
                    <Button onClick={() => navigate('/students')}>Cancel</Button>
                </Box>

                <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {activeStep === 0 && (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="First Name" value={formData.first_name} onChange={(e) => handleChange('first_name', e.target.value)} required />
                        </Grid>
                        {/* REMOVED Middle Name field */}
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Last Name" value={formData.last_name} onChange={(e) => handleChange('last_name', e.target.value)} required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Email" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Phone Number" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Date of Birth" type="date" value={formData.date_of_birth} onChange={(e) => handleChange('date_of_birth', e.target.value)} InputLabelProps={{ shrink: true }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Gender</InputLabel>
                                <Select value={formData.gender} onChange={(e) => handleChange('gender', e.target.value)}>
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* REMOVED National ID field */}
                        <Grid item xs={12}>
                            <TextField fullWidth multiline rows={2} label="Address" value={formData.address} onChange={(e) => handleChange('address', e.target.value)} />
                        </Grid>
                    </Grid>
                )}

                {activeStep === 1 && (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Class</InputLabel>
                                <Select value={formData.class_id} onChange={(e) => handleChange('class_id', e.target.value)}>
                                    {classes.map(cls => (
                                        <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Stream" value={formData.stream} onChange={(e) => handleChange('stream', e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Student Type</InputLabel>
                                <Select value={formData.student_type} onChange={(e) => handleChange('student_type', e.target.value)}>
                                    <MenuItem value="day_scholar">Day Scholar</MenuItem>
                                    <MenuItem value="boarding">Boarding</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Admission Date" type="date" value={formData.admission_date} onChange={(e) => handleChange('admission_date', e.target.value)} InputLabelProps={{ shrink: true }} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Previous School" value={formData.previous_school} onChange={(e) => handleChange('previous_school', e.target.value)} />
                        </Grid>
                    </Grid>
                )}

                {activeStep === 2 && (
                    <Box>
                        {formData.parents.map((parent, index) => (
                            <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="subtitle1">Parent/Guardian {index + 1}</Typography>
                                    {index > 0 && (
                                        <IconButton size="small" color="error" onClick={() => removeParent(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth size="small" label="First Name" value={parent.first_name} onChange={(e) => handleParentChange(index, 'first_name', e.target.value)} required />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth size="small" label="Last Name" value={parent.last_name} onChange={(e) => handleParentChange(index, 'last_name', e.target.value)} required />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth size="small" label="Email" type="email" value={parent.email} onChange={(e) => handleParentChange(index, 'email', e.target.value)} required />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth size="small" label="Phone" value={parent.phone} onChange={(e) => handleParentChange(index, 'phone', e.target.value)} required />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth size="small" label="Relationship" value={parent.relationship} onChange={(e) => handleParentChange(index, 'relationship', e.target.value)} placeholder="Father/Mother/Guardian" />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControlLabel control={<Checkbox checked={parent.is_primary} onChange={(e) => handleParentChange(index, 'is_primary', e.target.checked)} />} label="Primary Contact" />
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}
                        <Button startIcon={<AddIcon />} onClick={addParent}>Add Another Parent</Button>
                    </Box>
                )}

                {activeStep === 3 && (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField fullWidth multiline rows={2} label="Medical Conditions" value={formData.medical_conditions} onChange={(e) => handleChange('medical_conditions', e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth multiline rows={2} label="Allergies" value={formData.allergies} onChange={(e) => handleChange('allergies', e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Blood Group</InputLabel>
                                <Select value={formData.blood_group} onChange={(e) => handleChange('blood_group', e.target.value)}>
                                    <MenuItem value="">Select</MenuItem>
                                    <MenuItem value="A+">A+</MenuItem>
                                    <MenuItem value="A-">A-</MenuItem>
                                    <MenuItem value="B+">B+</MenuItem>
                                    <MenuItem value="B-">B-</MenuItem>
                                    <MenuItem value="O+">O+</MenuItem>
                                    <MenuItem value="O-">O-</MenuItem>
                                    <MenuItem value="AB+">AB+</MenuItem>
                                    <MenuItem value="AB-">AB-</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Emergency Contact Name" value={formData.emergency_contact} onChange={(e) => handleChange('emergency_contact', e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Emergency Contact Phone" value={formData.emergency_phone} onChange={(e) => handleChange('emergency_phone', e.target.value)} />
                        </Grid>
                    </Grid>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button disabled={activeStep === 0} onClick={handleBack}>
                        Back
                    </Button>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button onClick={() => navigate('/students')}>Cancel</Button>
                        {activeStep === steps.length - 1 ? (
                            <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : (isEditing ? 'Update' : 'Submit')}
                            </Button>
                        ) : (
                            <Button variant="contained" onClick={handleNext}>
                                Next
                            </Button>
                        )}
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}

export default StudentForm;