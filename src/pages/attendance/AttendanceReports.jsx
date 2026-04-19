/* eslint-disable no-undef */
import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert
} from '@mui/material';
import {
    Download as DownloadIcon,
    Print as PrintIcon,
    PictureAsPdf as PdfIcon,
    BarChart as BarChartIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function AttendanceReports() {
    const [reportType, setReportType] = useState('class');
    const [selectedClass, setSelectedClass] = useState('');
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(1)));
    const [endDate, setEndDate] = useState(new Date());
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);

    const generateReport = async () => {
        setLoading(true);
        try {
            // API call to generate report
            const response = await api.get('/attendance/reports', {
                params: {
                    class_id: selectedClass,
                    start_date: startDate.toISOString().split('T')[0],
                    end_date: endDate.toISOString().split('T')[0],
                    report_type: reportType
                }
            });
            setReportData(response.data);
        } catch (error) {
            console.error('Error generating report:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportReport = async (format) => {
        try {
            const response = await api.get('/attendance/export', {
                params: {
                    class_id: selectedClass,
                    start_date: startDate.toISOString().split('T')[0],
                    end_date: endDate.toISOString().split('T')[0],
                    format: format
                },
                responseType: format === 'pdf' ? 'blob' : 'text'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `attendance_report.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting report:', error);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ p: 3 }}>
                <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
                    <Typography variant="h4" gutterBottom>Attendance Reports</Typography>
                    <Typography variant="body2">Generate and export comprehensive attendance reports</Typography>
                </Paper>

                <Paper sx={{ p: 3, mb: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Report Type</InputLabel>
                                <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                                    <MenuItem value="class">Class Report</MenuItem>
                                    <MenuItem value="student">Student Report</MenuItem>
                                    <MenuItem value="summary">Summary Report</MenuItem>
                                    <MenuItem value="trend">Trend Analysis</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Select Class</InputLabel>
                                <Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                                    <MenuItem value="">All Classes</MenuItem>
                                    <MenuItem value="1">Form 1 East</MenuItem>
                                    <MenuItem value="2">Form 1 West</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={setStartDate}
                                slotProps={{ textField: { size: 'small', fullWidth: true } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={setEndDate}
                                slotProps={{ textField: { size: 'small', fullWidth: true } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button variant="contained" onClick={generateReport}>Generate Report</Button>
                                <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => exportReport('csv')}>Export CSV</Button>
                                <Button variant="outlined" startIcon={<PdfIcon />} onClick={() => exportReport('pdf')}>Export PDF</Button>
                                <Button variant="outlined" startIcon={<PrintIcon />}>Print</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {reportData && (
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Report Summary</Typography>
                        
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} sm={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary">Total Days</Typography>
                                        <Typography variant="h4">{reportData.statistics?.total_days}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary">Present Days</Typography>
                                        <Typography variant="h4" color="success.main">{reportData.statistics?.present}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary">Absent Days</Typography>
                                        <Typography variant="h4" color="error.main">{reportData.statistics?.absent}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary">Attendance Rate</Typography>
                                        <Typography variant="h4">{reportData.statistics?.attendance_percentage}%</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        <Typography variant="h6" gutterBottom>Detailed Records</Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Student Name</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Check In</TableCell>
                                        <TableCell>Check Out</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reportData.records?.map((record, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{new Date(record.attendance_date).toLocaleDateString()}</TableCell>
                                            <TableCell>{record.first_name} {record.last_name}</TableCell>
                                            <TableCell>
                                                <Chip label={record.status} size="small" color={record.status === 'present' ? 'success' : 'error'} />
                                            </TableCell>
                                            <TableCell>{record.check_in_time || '--:--'}</TableCell>
                                            <TableCell>{record.check_out_time || '--:--'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                )}
            </Box>
        </LocalizationProvider>
    );
}

export default AttendanceReports;