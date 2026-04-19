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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Avatar,
  Rating,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  EmojiEvents as AwardIcon,
  ReportProblem as ReportIcon,
  Close as CloseIcon
} from '@mui/icons-material';

function ConductTracking() {
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [editingConduct, setEditingConduct] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    student_id: '',
    conduct_type: 'positive',
    title: '',
    description: '',
    points: 0,
    date: new Date().toISOString().split('T')[0]
  });

  const [students, setStudents] = useState([
    { id: 1, name: 'John Kamau', admission: 'STU2024001', room: '201', total_points: 85, positive_count: 5, negative_count: 1 },
    { id: 2, name: 'James Otieno', admission: 'STU2024002', room: '202', total_points: 65, positive_count: 2, negative_count: 3 },
    { id: 3, name: 'Peter Maina', admission: 'STU2024003', room: '201', total_points: 92, positive_count: 7, negative_count: 0 },
    { id: 4, name: 'Mary Wanjiku', admission: 'STU2024004', room: '101', total_points: 78, positive_count: 4, negative_count: 2 },
    { id: 5, name: 'Sarah Muthoni', admission: 'STU2024005', room: '102', total_points: 45, positive_count: 1, negative_count: 5 }
  ]);

  const [conductRecords, setConductRecords] = useState([
    { id: 1, student_id: 1, conduct_type: 'positive', title: 'Excellent Behavior', description: 'Helped clean common area without being asked', points: 10, date: '2024-03-15', reported_by: 'Dorm Mistress' },
    { id: 2, student_id: 1, conduct_type: 'positive', title: 'Academic Excellence', description: 'Topped in Mathematics test', points: 15, date: '2024-03-10', reported_by: 'Dorm Mistress' },
    { id: 3, student_id: 2, conduct_type: 'negative', title: 'Late Return', description: 'Returned to dorm after curfew', points: -5, date: '2024-03-14', reported_by: 'Dorm Mistress' },
    { id: 4, student_id: 3, conduct_type: 'positive', title: 'Leadership', description: 'Organized study group for classmates', points: 10, date: '2024-03-12', reported_by: 'Dorm Mistress' },
    { id: 5, student_id: 4, conduct_type: 'negative', title: 'Room Cleanliness', description: 'Room found untidy during inspection', points: -3, date: '2024-03-11', reported_by: 'Dorm Mistress' }
  ]);

  const handleSave = () => {
    const newRecord = {
      ...formData,
      id: editingConduct?.id || Date.now(),
      reported_by: 'Dorm Mistress'
    };
    
    if (editingConduct) {
      setConductRecords(conductRecords.map(r => r.id === editingConduct.id ? newRecord : r));
      setSnackbar({ open: true, message: 'Conduct record updated', severity: 'success' });
    } else {
      setConductRecords([...conductRecords, newRecord]);
      setSnackbar({ open: true, message: 'Conduct record added', severity: 'success' });
    }
    
    // Update student points
    const student = students.find(s => s.id === formData.student_id);
    if (student) {
      const pointsChange = formData.conduct_type === 'positive' ? formData.points : -Math.abs(formData.points);
      const updatedStudents = students.map(s => 
        s.id === formData.student_id 
          ? { 
              ...s, 
              total_points: s.total_points + pointsChange,
              positive_count: formData.conduct_type === 'positive' ? s.positive_count + 1 : s.positive_count,
              negative_count: formData.conduct_type === 'negative' ? s.negative_count + 1 : s.negative_count
            }
          : s
      );
      setStudents(updatedStudents);
    }
    
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this conduct record?')) {
      const record = conductRecords.find(r => r.id === id);
      const student = students.find(s => s.id === record.student_id);
      
      // Reverse points
      const pointsChange = record.conduct_type === 'positive' ? -record.points : record.points;
      const updatedStudents = students.map(s => 
        s.id === record.student_id 
          ? { 
              ...s, 
              total_points: s.total_points + pointsChange,
              positive_count: record.conduct_type === 'positive' ? s.positive_count - 1 : s.positive_count,
              negative_count: record.conduct_type === 'negative' ? s.negative_count - 1 : s.negative_count
            }
          : s
      );
      setStudents(updatedStudents);
      setConductRecords(conductRecords.filter(r => r.id !== id));
      setSnackbar({ open: true, message: 'Conduct record deleted', severity: 'success' });
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setEditingConduct(null);
    setFormData({
      student_id: '',
      conduct_type: 'positive',
      title: '',
      description: '',
      points: 0,
      date: new Date().toISOString().split('T')[0]
    });
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown';
  };

  const getConductColor = (type) => {
    return type === 'positive' ? 'success' : 'error';
  };

  const getPointsColor = (points) => {
    return points > 0 ? '#4CAF50' : '#F44336';
  };

  const filteredRecords = conductRecords.filter(record => {
    const studentName = getStudentName(record.student_id);
    const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || record.conduct_type === filterType;
    return matchesSearch && matchesType;
  });

  const sortedStudents = [...students].sort((a, b) => b.total_points - a.total_points);

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#9C27B0', color: 'white' }}>
        <Typography variant="h4" gutterBottom>Conduct Tracking</Typography>
        <Typography variant="body1">Monitor and manage student behavior and conduct</Typography>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#E8F5E9' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Positive Records</Typography>
              <Typography variant="h3" sx={{ color: '#4CAF50' }}>
                {conductRecords.filter(r => r.conduct_type === 'positive').length}
              </Typography>
              <Typography variant="caption">Good behavior records</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#FFEBEE' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Negative Records</Typography>
              <Typography variant="h3" sx={{ color: '#F44336' }}>
                {conductRecords.filter(r => r.conduct_type === 'negative').length}
              </Typography>
              <Typography variant="caption">Behavior concerns</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#E3F2FD' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Average Points</Typography>
              <Typography variant="h3">{(students.reduce((sum, s) => sum + s.total_points, 0) / students.length).toFixed(0)}</Typography>
              <Typography variant="caption">Overall student score</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Performers */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Top Performers</Typography>
        <Grid container spacing={2}>
          {sortedStudents.slice(0, 3).map((student, index) => (
            <Grid item xs={12} sm={4} key={student.id}>
              <Card sx={{ bgcolor: index === 0 ? '#FFF8E1' : '#f5f5f5' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: index === 0 ? '#FF9800' : '#9C27B0', width: 56, height: 56 }}>
                      {index === 0 ? <AwardIcon /> : <ThumbUpIcon />}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{student.name}</Typography>
                      <Typography variant="body2" color="textSecondary">{student.room}</Typography>
                      <Typography variant="h4" sx={{ color: '#FF9800' }}>{student.total_points}</Typography>
                      <Typography variant="caption">points</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by student or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon /> }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Conduct Type</InputLabel>
              <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="positive">Positive</MenuItem>
                <MenuItem value="negative">Negative</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)} sx={{ bgcolor: '#9C27B0' }}>
                Add Record
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Conduct Records Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Date</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Points</TableCell>
              <TableCell>Reported By</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.map((record) => (
              <TableRow key={record.id} hover>
                <TableCell>{record.date}</TableCell>
                <TableCell>{getStudentName(record.student_id)}</TableCell>
                <TableCell>
                  <Chip 
                    label={record.conduct_type} 
                    size="small" 
                    color={getConductColor(record.conduct_type)}
                    icon={record.conduct_type === 'positive' ? <ThumbUpIcon /> : <ThumbDownIcon />}
                  />
                </TableCell>
                <TableCell>{record.title}</TableCell>
                <TableCell>{record.description}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={`${record.points > 0 ? '+' : ''}${record.points}`} 
                    size="small" 
                    sx={{ bgcolor: getPointsColor(record.points), color: 'white' }}
                  />
                </TableCell>
                <TableCell>{record.reported_by}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => { setEditingConduct(record); setFormData(record); setOpenDialog(true); }}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDelete(record.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Student Conduct Summary */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>Student Conduct Summary</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Student Name</TableCell>
                <TableCell>Room</TableCell>
                <TableCell align="center">Positive</TableCell>
                <TableCell align="center">Negative</TableCell>
                <TableCell align="center">Total Points</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} hover>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.room}</TableCell>
                  <TableCell align="center">
                    <Chip label={student.positive_count} size="small" color="success" />
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={student.negative_count} size="small" color="error" />
                  </TableCell>
                  <TableCell align="center">
                    <Typography fontWeight="bold" sx={{ color: getPointsColor(student.total_points) }}>
                      {student.total_points}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(100, (student.total_points / 100) * 100)} 
                      sx={{ width: 100, height: 8, borderRadius: 4 }}
                      color={student.total_points >= 70 ? 'success' : student.total_points >= 50 ? 'warning' : 'error'}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingConduct ? 'Edit Conduct Record' : 'Add Conduct Record'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Student</InputLabel>
                <Select value={formData.student_id} onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}>
                  {students.map(student => (
                    <MenuItem key={student.id} value={student.id}>{student.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Conduct Type</InputLabel>
                <Select value={formData.conduct_type} onChange={(e) => setFormData({ ...formData, conduct_type: e.target.value })}>
                  <MenuItem value="positive">Positive</MenuItem>
                  <MenuItem value="negative">Negative</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Points" type="number" value={formData.points} onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} InputLabelProps={{ shrink: true }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: '#9C27B0' }}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default ConductTracking;