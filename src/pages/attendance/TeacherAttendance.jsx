import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  Chip
} from '@mui/material';
import { Save as SaveIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../../services/api';

function TeacherAttendance() {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [summary, setSummary] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchAttendance();
    }
  }, [selectedClass, selectedDate]);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/classes');
      setClasses(response.data);
      if (response.data.length > 0) {
        setSelectedClass(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      setSnackbar({ open: true, message: 'Error fetching classes', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    if (!selectedClass) return;
    
    setLoading(true);
    try {
      const response = await api.get('/attendance/today', {
        params: {
          class_id: selectedClass,
          date: selectedDate.toISOString().split('T')[0]
        }
      });
      
      setStudents(response.data.students);
      setSummary(response.data.summary);
      
      const initialData = {};
      response.data.students.forEach(student => {
        initialData[student.id] = student.status || '';
      });
      setAttendanceData(initialData);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setSnackbar({ open: true, message: 'Error fetching attendance', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const saveAttendance = async () => {
    const attendanceList = Object.entries(attendanceData)
      .filter(([_, status]) => status)
      .map(([studentId, status]) => ({
        student_id: parseInt(studentId),
        status: status
      }));
    
    if (attendanceList.length === 0) {
      setSnackbar({ open: true, message: 'No attendance data to save', severity: 'warning' });
      return;
    }
    
    setLoading(true);
    try {
      await api.post('/attendance/mark', {
        class_id: selectedClass,
        date: selectedDate.toISOString().split('T')[0],
        attendance_data: attendanceList
      });
      setSnackbar({ open: true, message: 'Attendance saved successfully!', severity: 'success' });
      fetchAttendance();
    } catch (error) {
      console.error('Error saving attendance:', error);
      setSnackbar({ open: true, message: 'Error saving attendance', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const bulkMarkPresent = () => {
    const newData = { ...attendanceData };
    students.forEach(student => {
      if (!newData[student.id]) {
        newData[student.id] = 'present';
      }
    });
    setAttendanceData(newData);
    setSnackbar({ open: true, message: 'All unmarked students marked as present', severity: 'success' });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return 'success';
      case 'absent': return 'error';
      case 'late': return 'warning';
      case 'excused': return 'info';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'present': return 'Present';
      case 'absent': return 'Absent';
      case 'late': return 'Late';
      case 'excused': return 'Excused';
      default: return 'Not Marked';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, mb: 3, bgcolor: '#2E7D32', color: 'white' }}>
          <Typography variant="h4" gutterBottom>Attendance Management</Typography>
          <Typography variant="body2">Mark student attendance</Typography>
        </Paper>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
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
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Date"
                value={selectedDate}
                onChange={setSelectedDate}
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button 
                fullWidth 
                variant="contained" 
                onClick={fetchAttendance}
                startIcon={<RefreshIcon />}
                sx={{ bgcolor: '#2E7D32' }}
              >
                Load Attendance
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {students.length > 0 && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={2.4}>
              <Card sx={{ bgcolor: '#4CAF50', color: 'white' }}>
                <CardContent>
                  <Typography variant="body2">Present</Typography>
                  <Typography variant="h4">{summary.present || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={2.4}>
              <Card sx={{ bgcolor: '#F44336', color: 'white' }}>
                <CardContent>
                  <Typography variant="body2">Absent</Typography>
                  <Typography variant="h4">{summary.absent || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={2.4}>
              <Card sx={{ bgcolor: '#FF9800', color: 'white' }}>
                <CardContent>
                  <Typography variant="body2">Late</Typography>
                  <Typography variant="h4">{summary.late || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={2.4}>
              <Card sx={{ bgcolor: '#2196F3', color: 'white' }}>
                <CardContent>
                  <Typography variant="body2">Excused</Typography>
                  <Typography variant="h4">{summary.excused || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={2.4}>
              <Card sx={{ bgcolor: '#9C27B0', color: 'white' }}>
                <CardContent>
                  <Typography variant="body2">Not Marked</Typography>
                  <Typography variant="h4">{summary.not_marked || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {students.length > 0 && (
          <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={bulkMarkPresent}
              sx={{ borderColor: '#4CAF50', color: '#4CAF50' }}
            >
              Mark All Present
            </Button>
            <Button 
              variant="contained" 
              size="small" 
              onClick={saveAttendance}
              startIcon={<SaveIcon />}
              disabled={loading}
              sx={{ bgcolor: '#2E7D32', ml: 'auto' }}
            >
              Save Attendance
            </Button>
          </Box>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell>Admission No</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography color="textSecondary">
                        {selectedClass ? 'No students found' : 'Please select a class'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => (
                    <TableRow key={student.id} hover>
                      <TableCell>{student.admission_number}</TableCell>
                      <TableCell>{student.first_name} {student.last_name}</TableCell>
                      <TableCell>
                        <RadioGroup
                          row
                          value={attendanceData[student.id] || ''}
                          onChange={(e) => handleStatusChange(student.id, e.target.value)}
                        >
                          <FormControlLabel value="present" control={<Radio size="small" />} label="Present" />
                          <FormControlLabel value="absent" control={<Radio size="small" />} label="Absent" />
                          <FormControlLabel value="late" control={<Radio size="small" />} label="Late" />
                          <FormControlLabel value="excused" control={<Radio size="small" />} label="Excused" />
                        </RadioGroup>
                        {attendanceData[student.id] && (
                          <Chip 
                            label={getStatusLabel(attendanceData[student.id])} 
                            size="small" 
                            color={getStatusColor(attendanceData[student.id])}
                            sx={{ ml: 1 }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

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
    </LocalizationProvider>
  );
}

export default TeacherAttendance;