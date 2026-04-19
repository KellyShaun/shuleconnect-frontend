import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import api from '../../services/api';

function LibraryMembers() {
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [memberType, setMemberType] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    member_type: 'Student',
    address: ''
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [searchTerm, memberType, members]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/librarian/members');
      setMembers(response.data);
      setFilteredMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
      setSnackbar({ open: true, message: 'Error fetching members', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = members;
    
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.includes(searchTerm)
      );
    }
    
    if (memberType !== 'all') {
      filtered = filtered.filter(member => member.member_type === memberType);
    }
    
    setFilteredMembers(filtered);
  };

  const handleSave = async () => {
    try {
      if (editingMember) {
        await api.put(`/librarian/members/${editingMember.id}`, formData);
        setSnackbar({ open: true, message: 'Member updated successfully', severity: 'success' });
      } else {
        await api.post('/librarian/members', formData);
        setSnackbar({ open: true, message: 'Member added successfully', severity: 'success' });
      }
      setOpenDialog(false);
      fetchMembers();
      resetForm();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error saving member', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await api.delete(`/librarian/members/${id}`);
        setSnackbar({ open: true, message: 'Member deleted successfully', severity: 'success' });
        fetchMembers();
      } catch (error) {
        setSnackbar({ open: true, message: 'Error deleting member', severity: 'error' });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      member_type: 'Student',
      address: ''
    });
    setEditingMember(null);
  };

  const getMemberTypeColor = (type) => {
    switch(type) {
      case 'Teacher': return 'primary';
      case 'Student': return 'success';
      case 'Staff': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#2E7D32', color: 'white' }}>
        <Typography variant="h4" gutterBottom>Library Members</Typography>
        <Typography variant="body1">Manage library members and their borrowing privileges</Typography>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Member Type</InputLabel>
              <Select value={memberType} onChange={(e) => setMemberType(e.target.value)}>
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="Teacher">Teacher</MenuItem>
                <MenuItem value="Student">Student</MenuItem>
                <MenuItem value="Staff">Staff</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={5}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => { resetForm(); setOpenDialog(true); }}>
                Add Member
              </Button>
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchMembers}>
                Refresh
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Member</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Member Type</TableCell>
              <TableCell align="center">Books Borrowed</TableCell>
              <TableCell>Joined Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center"><CircularProgress /></TableCell>
              </TableRow>
            ) : filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No members found</TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow key={member.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#2E7D32' }}>
                        {member.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" fontWeight="bold">{member.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="caption" display="flex" alignItems="center">
                        <EmailIcon sx={{ fontSize: 14, mr: 0.5 }} /> {member.email}
                      </Typography>
                      <Typography variant="caption" display="flex" alignItems="center">
                        <PhoneIcon sx={{ fontSize: 14, mr: 0.5 }} /> {member.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={member.member_type} size="small" color={getMemberTypeColor(member.member_type)} />
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={member.books_borrowed || 0} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{member.joined_date}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => { setEditingMember(member); setFormData(member); setOpenDialog(true); }}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => handleDelete(member.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingMember ? 'Edit Member' : 'Add New Member'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Member Type</InputLabel>
                <Select value={formData.member_type} onChange={(e) => setFormData({ ...formData, member_type: e.target.value })}>
                  <MenuItem value="Teacher">Teacher</MenuItem>
                  <MenuItem value="Student">Student</MenuItem>
                  <MenuItem value="Staff">Staff</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default LibraryMembers;