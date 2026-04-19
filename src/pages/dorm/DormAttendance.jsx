import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
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
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Snackbar,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import { Save as SaveIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

function DormAttendance() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState('');
  const [students, setStudents] = useState([
    { id: 1, name: 'John Kamau', room: '201', bed: 'A', status: '', reason: '' },
    { id: 2, name: 'James Otieno', room: '202', bed: 'B', status: '', reason: '' },
    { id: 3, name: 'Peter Maina', room: '201', bed: 'C', status: '', reason: '' }
  ]);
  const [attendanceData, setAttendanceData] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const rooms = ['All Rooms', '201', '202', '203', '204'];

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: { ...prev[studentId], status } }));
  };

  const handleReasonChange = (studentId, reason) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: { ...prev[studentId], reason } }));
  };

  const saveAttendance = () => {
    setSnackbar({ open: true, message: 'Attendance saved successfully!', severity: 'success' });
  };

  const filteredStudents = selectedRoom === 'All Rooms' || !selectedRoom 
    ? students 
    : students.filter(s => s.room === selectedRoom);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, mb: 3, bgcolor: '#9C27B0', color: 'white' }}>
          <Typography variant="h4" gutterBottom>Dorm Attendance</Typography>
          <Typography variant="body1">Mark daily dormitory attendance</Typography>
        </Paper>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Select Room</InputLabel>
                <Select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
                  {rooms.map(room => <MenuItem key={room} value={room}>{room}</MenuItem>)}
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
              <Button fullWidth variant="contained" startIcon={<RefreshIcon />} sx={{ bgcolor: '#9C27B0' }}>
                Load Students
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Student Name</TableCell>
                <TableCell>Room</TableCell>
                <TableCell>Bed</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Reason (if absent/late)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} hover>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.room}</TableCell>
                  <TableCell>{student.bed}</TableCell>
                  <TableCell>
                    <RadioGroup
                      row
                      value={attendanceData[student.id]?.status || ''}
                      onChange={(e) => handleStatusChange(student.id, e.target.value)}
                    >
                      <FormControlLabel value="present" control={<Radio size="small" />} label="Present" />
                      <FormControlLabel value="absent" control={<Radio size="small" />} label="Absent" />
                      <FormControlLabel value="late" control={<Radio size="small" />} label="Late" />
                      <FormControlLabel value="weekend_home" control={<Radio size="small" />} label="Weekend Home" />
                    </RadioGroup>
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Reason"
                      value={attendanceData[student.id]?.reason || ''}
                      onChange={(e) => handleReasonChange(student.id, e.target.value)}
                      disabled={attendanceData[student.id]?.status === 'present'}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" startIcon={<SaveIcon />} onClick={saveAttendance} sx={{ bgcolor: '#9C27B0' }}>
            Save Attendance
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default DormAttendance;