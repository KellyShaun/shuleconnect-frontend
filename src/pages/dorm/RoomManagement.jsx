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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Tooltip,
  Snackbar,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Bed as BedIcon,
  MeetingRoom as RoomIcon
} from '@mui/icons-material';

function RoomManagement() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    room_number: '',
    floor: '',
    room_type: 'girls',
    capacity: 4,
    has_bathroom: false,
    has_balcony: false
  });

  const [rooms, setRooms] = useState([
    { id: 1, room_number: '101', floor: 1, room_type: 'girls', capacity: 4, current_occupancy: 3, has_bathroom: true, has_balcony: false },
    { id: 2, room_number: '102', floor: 1, room_type: 'girls', capacity: 4, current_occupancy: 2, has_bathroom: false, has_balcony: true },
    { id: 3, room_number: '103', floor: 1, room_type: 'girls', capacity: 4, current_occupancy: 4, has_bathroom: true, has_balcony: false },
    { id: 4, room_number: '201', floor: 2, room_type: 'boys', capacity: 4, current_occupancy: 3, has_bathroom: true, has_balcony: true },
    { id: 5, room_number: '202', floor: 2, room_type: 'boys', capacity: 4, current_occupancy: 2, has_bathroom: false, has_balcony: false }
  ]);

  const handleSave = () => {
    if (editingRoom) {
      setRooms(rooms.map(r => r.id === editingRoom.id ? { ...formData, id: r.id, current_occupancy: r.current_occupancy } : r));
      setSnackbar({ open: true, message: 'Room updated', severity: 'success' });
    } else {
      setRooms([...rooms, { ...formData, id: Date.now(), current_occupancy: 0 }]);
      setSnackbar({ open: true, message: 'Room added', severity: 'success' });
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      setRooms(rooms.filter(r => r.id !== id));
      setSnackbar({ open: true, message: 'Room deleted', severity: 'success' });
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setEditingRoom(null);
    setFormData({ room_number: '', floor: '', room_type: 'girls', capacity: 4, has_bathroom: false, has_balcony: false });
  };

  const filteredRooms = rooms.filter(r =>
    r.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.room_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#9C27B0', color: 'white' }}>
        <Typography variant="h4" gutterBottom>Room Management</Typography>
        <Typography variant="body1">Manage dormitory rooms and bed allocation</Typography>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by room number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon /> }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
                Add Room
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {filteredRooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RoomIcon /> Room {room.room_number}
                  </Typography>
                    <Chip 
                         label={room.room_type} 
                         size="small" 
                         sx={{ bgcolor: room.room_type === 'girls' ? '#E91E63' : '#2196F3', color: 'white' }}
                    />
                </Box>
                
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Floor {room.floor} | Capacity: {room.capacity} beds
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Occupancy</Typography>
                    <Typography variant="body2">{room.current_occupancy} / {room.capacity}</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(room.current_occupancy / room.capacity) * 100} 
                    sx={{ height: 8, borderRadius: 4 }}
                    color={room.current_occupancy === room.capacity ? 'error' : 'success'}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  {room.has_bathroom && <Chip label="Ensuite Bathroom" size="small" variant="outlined" />}
                  {room.has_balcony && <Chip label="Balcony" size="small" variant="outlined" />}
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => { setEditingRoom(room); setFormData(room); setOpenDialog(true); }}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDelete(room.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Room Number" value={formData.room_number} onChange={(e) => setFormData({ ...formData, room_number: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Floor" type="number" value={formData.floor} onChange={(e) => setFormData({ ...formData, floor: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Room Type</InputLabel>
                <Select value={formData.room_type} onChange={(e) => setFormData({ ...formData, room_type: e.target.value })}>
                  <MenuItem value="girls">Girls</MenuItem>
                  <MenuItem value="boys">Boys</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Capacity" type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default RoomManagement;