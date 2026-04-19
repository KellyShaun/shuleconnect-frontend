import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    IconButton,
    Alert
} from '@mui/material';
import {
    Download as DownloadIcon,
    Print as PrintIcon,
    PictureAsPdf as PdfIcon,
    BarChart as BarChartIcon
} from '@mui/icons-material';

function Reports() {
    const [reportType, setReportType] = React.useState('');
    const [dateRange, setDateRange] = React.useState({ start: '', end: '' });

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h4" gutterBottom>Reports Dashboard</Typography>
                <Typography variant="body2">Generate and download various school reports</Typography>
            </Paper>

            <Grid container spacing={3}>
                {/* Report Generation Form */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Generate Report</Typography>
                        
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Report Type</InputLabel>
                                    <Select 
                                        value={reportType} 
                                        onChange={(e) => setReportType(e.target.value)}
                                    >
                                        <MenuItem value="attendance">Attendance Report</MenuItem>
                                        <MenuItem value="fees">Fee Collection Report</MenuItem>
                                        <MenuItem value="academic">Academic Performance Report</MenuItem>
                                        <MenuItem value="library">Library Report</MenuItem>
                                        <MenuItem value="student">Student Demographic Report</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Start Date"
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="End Date"
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Format</InputLabel>
                                    <Select defaultValue="pdf">
                                        <MenuItem value="pdf">PDF Document</MenuItem>
                                        <MenuItem value="excel">Excel Spreadsheet</MenuItem>
                                        <MenuItem value="csv">CSV File</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Button 
                                    fullWidth 
                                    variant="contained" 
                                    startIcon={<DownloadIcon />}
                                >
                                    Generate Report
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Available Reports */}
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Available Reports</Typography>
                        
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Typography variant="subtitle1">Attendance Summary - Term 1 2024</Typography>
                                                <Typography variant="caption" color="textSecondary">Generated: March 15, 2024</Typography>
                                            </Box>
                                            <Box>
                                                <IconButton size="small"><DownloadIcon fontSize="small" /></IconButton>
                                                <IconButton size="small"><PrintIcon fontSize="small" /></IconButton>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Typography variant="subtitle1">Fee Collection Report - February 2024</Typography>
                                                <Typography variant="caption" color="textSecondary">Generated: March 1, 2024</Typography>
                                            </Box>
                                            <Box>
                                                <IconButton size="small"><DownloadIcon fontSize="small" /></IconButton>
                                                <IconButton size="small"><PrintIcon fontSize="small" /></IconButton>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Typography variant="subtitle1">Exam Results - End Term 2023</Typography>
                                                <Typography variant="caption" color="textSecondary">Generated: December 20, 2023</Typography>
                                            </Box>
                                            <Box>
                                                <IconButton size="small"><DownloadIcon fontSize="small" /></IconButton>
                                                <IconButton size="small"><PrintIcon fontSize="small" /></IconButton>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                    💡 Tip: You can schedule automatic reports to be sent to your email weekly.
                </Typography>
            </Alert>
        </Box>
    );
}

export default Reports;