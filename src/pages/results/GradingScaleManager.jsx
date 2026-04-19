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
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Switch,
    FormControlLabel,
    Chip,
    Alert,
    Snackbar,
    Tabs,
    Tab,
    Card,
    CardContent
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    School as SchoolIcon
} from '@mui/icons-material';
import api from '../../services/api';

function GradingScaleManager() {
    const [scales, setScales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingScale, setEditingScale] = useState(null);
    const [formData, setFormData] = useState({
        grade: '',
        min_percentage: '',
        max_percentage: '',
        points: '',
        cbc_level: '',
        remark: '',
        is_cbc: false
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchGradingScales();
    }, []);

    const fetchGradingScales = async () => {
        setLoading(true);
        try {
            const response = await api.get('/results/grading-scales');
            setScales(response.data);
        } catch (error) {
            console.error('Error fetching grading scales:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (scale = null) => {
        if (scale) {
            setEditingScale(scale);
            setFormData({
                grade: scale.grade,
                min_percentage: scale.min_percentage,
                max_percentage: scale.max_percentage,
                points: scale.points,
                cbc_level: scale.cbc_level || '',
                remark: scale.remark,
                is_cbc: scale.is_cbc
            });
        } else {
            setEditingScale(null);
            setFormData({
                grade: '',
                min_percentage: '',
                max_percentage: '',
                points: '',
                cbc_level: '',
                remark: '',
                is_cbc: activeTab === 1
            });
        }
        setOpenDialog(true);
    };

    const handleSave = async () => {
        try {
            if (editingScale) {
                await api.put(`/results/grading-scales/${editingScale.id}`, formData);
                setSnackbar({ open: true, message: 'Grading scale updated', severity: 'success' });
            } else {
                await api.post('/results/grading-scales', formData);
                setSnackbar({ open: true, message: 'Grading scale added', severity: 'success' });
            }
            setOpenDialog(false);
            fetchGradingScales();
        } catch (error) {
            console.error('Error saving grading scale:', error);
            setSnackbar({ open: true, message: 'Error saving grading scale', severity: 'error' });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this grading scale?')) {
            try {
                await api.delete(`/results/grading-scales/${id}`);
                setSnackbar({ open: true, message: 'Grading scale deleted', severity: 'success' });
                fetchGradingScales();
            } catch (error) {
                console.error('Error deleting grading scale:', error);
                setSnackbar({ open: true, message: 'Error deleting grading scale', severity: 'error' });
            }
        }
    };

    const eightFourFourScales = scales.filter(s => !s.is_cbc);
    const cbcScales = scales.filter(s => s.is_cbc);

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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h4" gutterBottom>Grading Scale Manager</Typography>
                        <Typography variant="body2">Configure grading scales for 8-4-4 and CBC curricula</Typography>
                    </Box>
                    <Button 
                        variant="contained" 
                        sx={{ bgcolor: 'white', color: 'primary.main' }}
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                    >
                        Add Grade
                    </Button>
                </Box>
            </Paper>

            {/* Tabs */}
            <Paper sx={{ mb: 3 }}>
                <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                    <Tab label="8-4-4 Grading Scale" />
                    <Tab label="CBC Grading Scale" />
                </Tabs>

                {/* 8-4-4 Grading Scale */}
                {activeTab === 0 && (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                    <TableCell>Grade</TableCell>
                                    <TableCell>Percentage Range</TableCell>
                                    <TableCell>Points</TableCell>
                                    <TableCell>Remark</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {eightFourFourScales.map((scale) => (
                                    <TableRow key={scale.id}>
                                        <TableCell>
                                            <Chip 
                                                label={scale.grade} 
                                                color={getGradeColor(scale.grade)}
                                                sx={{ fontWeight: 'bold', minWidth: 50 }}
                                            />
                                        </TableCell>
                                        <TableCell>{scale.min_percentage}% - {scale.max_percentage}%</TableCell>
                                        <TableCell>{scale.points}</TableCell>
                                        <TableCell>{scale.remark}</TableCell>
                                        <TableCell>
                                            <IconButton size="small" onClick={() => handleOpenDialog(scale)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => handleDelete(scale.id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* CBC Grading Scale */}
                {activeTab === 1 && (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                    <TableCell>Level</TableCell>
                                    <TableCell>Percentage Range</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cbcScales.map((scale) => (
                                    <TableRow key={scale.id}>
                                        <TableCell>
                                            <Chip 
                                                label={scale.cbc_level} 
                                                color={scale.grade === 'EE' ? 'success' : scale.grade === 'ME' ? 'info' : scale.grade === 'AE' ? 'warning' : 'error'}
                                            />
                                        </TableCell>
                                        <TableCell>{scale.min_percentage}% - {scale.max_percentage}%</TableCell>
                                        <TableCell>{scale.remark}</TableCell>
                                        <TableCell>
                                            <IconButton size="small" onClick={() => handleOpenDialog(scale)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => handleDelete(scale.id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            {/* Info Cards */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>About 8-4-4 Grading</Typography>
                            <Typography variant="body2" color="textSecondary">
                                The 8-4-4 system uses letter grades from A to E with corresponding points:
                                A=12, A-=11, B+=10, B=9, B-=8, C+=7, C=6, C-=5, D+=4, D=3, D-=2, E=1
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>About CBC Grading</Typography>
                            <Typography variant="body2" color="textSecondary">
                                The Competency-Based Curriculum uses four levels:
                                Exceeding Expectations (EE), Meeting Expectations (ME), 
                                Approaching Expectations (AE), Below Expectations (BE)
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingScale ? 'Edit Grade' : 'Add New Grade'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {activeTab === 0 ? (
                            <>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Grade"
                                        value={formData.grade}
                                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                        placeholder="A, A-, B+, etc."
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Min Percentage"
                                        type="number"
                                        value={formData.min_percentage}
                                        onChange={(e) => setFormData({ ...formData, min_percentage: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Max Percentage"
                                        type="number"
                                        value={formData.max_percentage}
                                        onChange={(e) => setFormData({ ...formData, max_percentage: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Points"
                                        type="number"
                                        step="0.1"
                                        value={formData.points}
                                        onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                                        placeholder="12.0 for A, 11.0 for A-, etc."
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Remark"
                                        value={formData.remark}
                                        onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                                        placeholder="Excellent, Very Good, Good, etc."
                                    />
                                </Grid>
                            </>
                        ) : (
                            <>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.is_cbc}
                                                onChange={(e) => setFormData({ ...formData, is_cbc: e.target.checked })}
                                            />
                                        }
                                        label="CBC Grading Scale"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="CBC Level"
                                        value={formData.cbc_level}
                                        onChange={(e) => setFormData({ ...formData, cbc_level: e.target.value })}
                                        placeholder="Exceeding Expectations, Meeting Expectations, etc."
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Min Percentage"
                                        type="number"
                                        value={formData.min_percentage}
                                        onChange={(e) => setFormData({ ...formData, min_percentage: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Max Percentage"
                                        type="number"
                                        value={formData.max_percentage}
                                        onChange={(e) => setFormData({ ...formData, max_percentage: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        value={formData.remark}
                                        onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                                        placeholder="Description of the performance level"
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save</Button>
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

export default GradingScaleManager;