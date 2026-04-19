import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Download as DownloadIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
  Refresh as RefreshIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function DormReports() {
  const [reportType, setReportType] = useState('attendance');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);

  // Sample data
  const attendanceData = [
    { day: 'Week 1', present: 145, absent: 11, late: 4 },
    { day: 'Week 2', present: 148, absent: 8, late: 3 },
    { day: 'Week 3', present: 150, absent: 6, late: 2 },
    { day: 'Week 4', present: 142, absent: 14, late: 5 }
  ];

  const conductData = [
    { type: 'Positive', count: 45, color: '#4CAF50' },
    { type: 'Negative', count: 28, color: '#F44336' }
  ];

  const occupancyData = [
    { floor: 'Floor 1', occupied: 42, total: 60, percentage: 70 },
    { floor: 'Floor 2', occupied: 38, total: 48, percentage: 79 },
    { floor: 'Floor 3', occupied: 45, total: 52, percentage: 87 }
  ];

  const topStudents = [
    { name: 'John Kamau', points: 95, room: '201', conduct: 'Excellent' },
    { name: 'Peter Maina', points: 92, room: '201', conduct: 'Very Good' },
    { name: 'Mary Wanjiku', points: 88, room: '101', conduct: 'Good' },
    { name: 'James Otieno', points: 75, room: '202', conduct: 'Satisfactory' },
    { name: 'Sarah Muthoni', points: 65, room: '102', conduct: 'Needs Improvement' }
  ];

  const formatDate = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[selectedMonth - 1]} ${selectedYear}`;
  };

  const handleGenerateReport = () => {
    setOpenPreviewDialog(true);
  };

  const handleExport = () => {
    alert('Report exported successfully!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#9C27B0', color: 'white' }}>
        <Typography variant="h4" gutterBottom>Dormitory Reports</Typography>
        <Typography variant="body1">Generate and analyze dormitory reports</Typography>
      </Paper>

      {/* Report Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Report Type</InputLabel>
              <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                <MenuItem value="attendance">Attendance Report</MenuItem>
                <MenuItem value="conduct">Conduct Report</MenuItem>
                <MenuItem value="occupancy">Occupancy Report</MenuItem>
                <MenuItem value="top-students">Top Students Report</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Month</InputLabel>
              <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                <MenuItem value={1}>January</MenuItem>
                <MenuItem value={2}>February</MenuItem>
                <MenuItem value={3}>March</MenuItem>
                <MenuItem value={4}>April</MenuItem>
                <MenuItem value={5}>May</MenuItem>
                <MenuItem value={6}>June</MenuItem>
                <MenuItem value={7}>July</MenuItem>
                <MenuItem value={8}>August</MenuItem>
                <MenuItem value={9}>September</MenuItem>
                <MenuItem value={10}>October</MenuItem>
                <MenuItem value={11}>November</MenuItem>
                <MenuItem value={12}>December</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Year</InputLabel>
              <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                <MenuItem value={2023}>2023</MenuItem>
                <MenuItem value={2024}>2024</MenuItem>
                <MenuItem value={2025}>2025</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button fullWidth variant="contained" startIcon={<RefreshIcon />} onClick={handleGenerateReport} sx={{ bgcolor: '#9C27B0' }}>
                Generate
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Report Preview */}
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {reportType === 'attendance' && 'Attendance Report'}
            {reportType === 'conduct' && 'Conduct Report'}
            {reportType === 'occupancy' && 'Occupancy Report'}
            {reportType === 'top-students' && 'Top Students Report'}
          </Typography>
          <Box>
            <Button size="small" startIcon={<PdfIcon />} onClick={handleExport}>PDF</Button>
            <Button size="small" startIcon={<PrintIcon />} onClick={handlePrint}>Print</Button>
            <Button size="small" startIcon={<DownloadIcon />} onClick={handleExport}>Export</Button>
          </Box>
        </Box>

        {reportType === 'attendance' && (
          <>
            <Typography variant="subtitle1" gutterBottom>Period: {formatDate()}</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip />
                <Legend />
                <Bar dataKey="present" fill="#4CAF50" name="Present" />
                <Bar dataKey="absent" fill="#F44336" name="Absent" />
                <Bar dataKey="late" fill="#FF9800" name="Late" />
              </BarChart>
            </ResponsiveContainer>
            <TableContainer sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell>Week</TableCell>
                    <TableCell align="center">Present</TableCell>
                    <TableCell align="center">Absent</TableCell>
                    <TableCell align="center">Late</TableCell>
                    <TableCell align="center">Attendance Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceData.map((week, index) => (
                    <TableRow key={index}>
                      <TableCell>{week.day}</TableCell>
                      <TableCell align="center">{week.present}</TableCell>
                      <TableCell align="center">{week.absent}</TableCell>
                      <TableCell align="center">{week.late}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={`${Math.round((week.present / (week.present + week.absent)) * 100)}%`}
                          size="small"
                          color="success"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {reportType === 'conduct' && (
          <>
            <Typography variant="subtitle1" gutterBottom>Period: {formatDate()}</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={conductData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      dataKey="count"
                    >
                      {conductData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Summary</Typography>
                <Typography>Total Positive Records: {conductData.find(d => d.type === 'Positive')?.count}</Typography>
                <Typography>Total Negative Records: {conductData.find(d => d.type === 'Negative')?.count}</Typography>
                <Typography>Positive Rate: {Math.round((conductData.find(d => d.type === 'Positive')?.count / (conductData.find(d => d.type === 'Positive')?.count + conductData.find(d => d.type === 'Negative')?.count)) * 100)}%</Typography>
              </Grid>
            </Grid>
          </>
        )}

        {reportType === 'occupancy' && (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="floor" />
                <YAxis />
                <ChartTooltip />
                <Legend />
                <Bar dataKey="occupied" fill="#4CAF50" name="Occupied Beds" />
                <Bar dataKey="total" fill="#FF9800" name="Total Beds" />
              </BarChart>
            </ResponsiveContainer>
            <TableContainer sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell>Floor</TableCell>
                    <TableCell align="center">Occupied</TableCell>
                    <TableCell align="center">Total</TableCell>
                    <TableCell align="center">Available</TableCell>
                    <TableCell align="center">Occupancy Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {occupancyData.map((floor, index) => (
                    <TableRow key={index}>
                      <TableCell>{floor.floor}</TableCell>
                      <TableCell align="center">{floor.occupied}</TableCell>
                      <TableCell align="center">{floor.total}</TableCell>
                      <TableCell align="center">{floor.total - floor.occupied}</TableCell>
                      <TableCell align="center">
                        <Chip label={`${floor.percentage}%`} size="small" color={floor.percentage >= 80 ? 'success' : 'warning'} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {reportType === 'top-students' && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell>Rank</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Room</TableCell>
                  <TableCell align="center">Points</TableCell>
                  <TableCell>Conduct</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topStudents.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Chip label={`#${index + 1}`} size="small" color={index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze'} />
                    </TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.room}</TableCell>
                    <TableCell align="center">
                      <Typography fontWeight="bold" sx={{ color: '#FF9800' }}>{student.points}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={student.conduct} size="small" color={student.conduct === 'Excellent' ? 'success' : 'default'} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Preview Dialog */}
      <Dialog open={openPreviewDialog} onClose={() => setOpenPreviewDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Report Preview - {formatDate()}</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            {reportType === 'attendance' && (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ChartTooltip />
                    <Legend />
                    <Bar dataKey="present" fill="#4CAF50" name="Present" />
                    <Bar dataKey="absent" fill="#F44336" name="Absent" />
                  </BarChart>
                </ResponsiveContainer>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreviewDialog(false)}>Close</Button>
          <Button variant="contained" onClick={handleExport} sx={{ bgcolor: '#9C27B0' }}>Download Report</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DormReports;