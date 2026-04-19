import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Avatar
} from '@mui/material';
import {
  Bed as BedIcon,
  PersonAdd as AddIcon,
  Delete as DeleteIcon,
  SwapHoriz as TransferIcon
} from '@mui/icons-material';

function BedAllocation() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [bedNumber, setBedNumber] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [students, setStudents] = useState([
    { id: 1, name: 'John Kamau', admission: 'STU2024001', class: 'Form 4A', room: '201', bed: 'A', allocated_date: '2024-01-15' },
    { id: 2, name: 'James Otieno', admission: 'STU2024002', class: 'Form 3B', room: '202', bed: 'B', allocated_date: '2024-01-15' },
    { id: 3, name: 'Peter Maina', admission: 'STU2024003', class: 'Form 2C', room: '201', bed: 'C', allocated_date: '2024-01-15' }
  ]);

  const [unallocatedStudents, setUnallocatedStudents] = useState([
    { id: 4, name: 'Michael Kiprono', admission: 'STU2024004', class: 'Form 4A' },
    { id: 5, name: 'Brian Omondi', admission: 'STU2024005', class: 'Form 3B' }
  ]);

  const rooms = [
    { id: 1, room_number: '201', type: 'boys', capacity: 4, current: 2, beds: ['A', 'B', 'C', 'D'] },
    { id: 2, room_number: '202', type: 'boys', capacity: 4, current: 1, beds: ['A', 'B', 'C', 'D'] }
  ];

  const handleAllocate = () => {
    const student = unallocatedStudents.find(s => s.id === selectedStudent);
    const room = rooms.find(r => r.room_number === selectedRoom);
    
    setStudents([...students, { ...student, room: selectedRoom, bed: bedNumber, allocated_date: new Date().toISOString().split('T')[0] }]);
    setUnallocatedStudents(unallocatedStudents.filter(s => s.id !== selectedStudent));
    setSnackbar({ open: true, message: `${student.name} allocated to Room ${selectedRoom}, Bed ${bedNumber}`, severity: 'success' });
    setOpenDialog(false);
  };

  const handleDeallocate = (studentId) => {
    const student = students.find(s => s.id === studentId);
    setStudents(students.filter(s => s.id !== studentId));
    setUnallocatedStudents([...unallocatedStudents, { id: student.id, name: student.name, admission: student.admission, class: student.class }]);
    setSnackbar({ open: true, message: `${student.name} deallocated from dormitory`, severity: 'success' });
  };

  const availableBeds = rooms
    .filter(r => r.room_number === selectedRoom)
    .flatMap(r => r.beds.filter(bed => !students.some(s => s.room === r.room_number && s.bed === bed)));

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#9C27B0', color: 'white' }}>
        <Typography variant="h4" gutterBottom>Bed Allocation</Typography>
        <Typography variant="body1">Allocate and manage student beds in dormitory</Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Allocated Students */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Allocated Students</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Admission</TableCell>
                    <TableCell>Class</TableCell>
                    <TableCell>Room</TableCell>
                    <TableCell>Bed</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id} hover>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.admission}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell><Chip label={`Room ${student.room}`} size="small" color="primary" /></TableCell>
                      <TableCell><Chip label={`Bed ${student.bed}`} size="small" /></TableCell>
                      <TableCell align="center">
                        <Tooltip title="Deallocate">
                          <IconButton size="small" color="error" onClick={() => handleDeallocate(student.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Transfer">
                          <IconButton size="small">
                            <TransferIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Unallocated Students */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Unallocated Students</Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
                Allocate
              </Button>
            </Box>
            
            {unallocatedStudents.map((student) => (
              <Card key={student.id} sx={{ mb: 2, bgcolor: '#FFF3E0' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1">{student.name}</Typography>
                      <Typography variant="caption" color="textSecondary">{student.admission} | {student.class}</Typography>
                    </Box>
                    <Button size="small" variant="outlined" onClick={() => { setSelectedStudent(student.id); setOpenDialog(true); }}>
                      Allocate
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Allocate Bed</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Room</InputLabel>
                <Select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
                  {rooms.map(room => (
                    <MenuItem key={room.id} value={room.room_number}>
                      Room {room.room_number} ({room.current}/{room.capacity} occupied)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Bed</InputLabel>
                <Select value={bedNumber} onChange={(e) => setBedNumber(e.target.value)} disabled={!selectedRoom}>
                  {availableBeds.map(bed => (
                    <MenuItem key={bed} value={bed}>Bed {bed}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAllocate}>Allocate</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default BedAllocation;