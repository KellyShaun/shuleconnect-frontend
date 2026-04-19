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
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Add as AddIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  LocalShipping as IssueIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';

function Requisitions() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [requisitions, setRequisitions] = useState([
    { id: 1, requisition_no: 'REQ001', department: 'Admin Office', requested_by: 'John Kamau', items: 'A4 Papers (10 reams), Pens (5 boxes)', quantity: 15, date: '2024-03-15', status: 'pending' },
    { id: 2, requisition_no: 'REQ002', department: 'Science Lab', requested_by: 'Mary Wanjiku', items: 'Beakers (20), Test tubes (50)', quantity: 70, date: '2024-03-14', status: 'approved' },
    { id: 3, requisition_no: 'REQ003', department: 'Kitchen', requested_by: 'Peter Otieno', items: 'Detergent (10L), Sponges (20)', quantity: 30, date: '2024-03-13', status: 'issued' },
    { id: 4, requisition_no: 'REQ004', department: 'Sports Dept', requested_by: 'James Kariuki', items: 'Football (5), Jerseys (20)', quantity: 25, date: '2024-03-12', status: 'pending' },
    { id: 5, requisition_no: 'REQ005', department: 'Library', requested_by: 'Grace Muthoni', items: 'Books (50), Shelves (2)', quantity: 52, date: '2024-03-11', status: 'rejected' }
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'warning';
      case 'approved': return 'info';
      case 'issued': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const handleApprove = (id) => {
    setRequisitions(requisitions.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    setSnackbar({ open: true, message: 'Requisition approved', severity: 'success' });
  };

  const handleIssue = (id) => {
    setRequisitions(requisitions.map(r => r.id === id ? { ...r, status: 'issued' } : r));
    setSnackbar({ open: true, message: 'Items issued successfully', severity: 'success' });
  };

  const handleReject = (id) => {
    setRequisitions(requisitions.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    setSnackbar({ open: true, message: 'Requisition rejected', severity: 'error' });
  };

  const filteredRequisitions = requisitions.filter(r => {
    const matchesSearch = r.requisition_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#FF9800', color: 'white' }}>
        <Typography variant="h4" gutterBottom>Requisitions</Typography>
        <Typography variant="body1">Manage department requisitions and issue items</Typography>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by requisition no or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon /> }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="issued">Issued</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button fullWidth variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)} sx={{ bgcolor: '#FF9800' }}>
              New Requisition
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Requisition No</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Requested By</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequisitions.map((req) => (
              <TableRow key={req.id} hover>
                <TableCell>{req.requisition_no}</TableCell>
                <TableCell>{req.department}</TableCell>
                <TableCell>{req.requested_by}</TableCell>
                <TableCell>{req.items}</TableCell>
                <TableCell>{req.date}</TableCell>
                <TableCell align="center">
                  <Chip label={req.status} size="small" color={getStatusColor(req.status)} />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View">
                    <IconButton size="small" onClick={() => { setSelectedRequisition(req); setOpenViewDialog(true); }}>
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  {req.status === 'pending' && (
                    <>
                      <Tooltip title="Approve">
                        <IconButton size="small" color="success" onClick={() => handleApprove(req.id)}>
                          <ApproveIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton size="small" color="error" onClick={() => handleReject(req.id)}>
                          <RejectIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                  {req.status === 'approved' && (
                    <Tooltip title="Issue Items">
                      <IconButton size="small" color="primary" onClick={() => handleIssue(req.id)}>
                        <IssueIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Requisition Details - {selectedRequisition?.requisition_no}</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}><Typography variant="subtitle2">Department:</Typography><Typography>{selectedRequisition?.department}</Typography></Grid>
              <Grid item xs={6}><Typography variant="subtitle2">Requested By:</Typography><Typography>{selectedRequisition?.requested_by}</Typography></Grid>
              <Grid item xs={6}><Typography variant="subtitle2">Date:</Typography><Typography>{selectedRequisition?.date}</Typography></Grid>
              <Grid item xs={6}><Typography variant="subtitle2">Status:</Typography><Chip label={selectedRequisition?.status} size="small" color={getStatusColor(selectedRequisition?.status)} /></Grid>
              <Grid item xs={12}><Typography variant="subtitle2">Items Requested:</Typography><Typography>{selectedRequisition?.items}</Typography></Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default Requisitions;