import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
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
    Chip,
    IconButton,
    LinearProgress,
    Alert,
    Snackbar,
    CircularProgress,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
    Switch,
    FormControlLabel
} from '@mui/material';
import {
    Settings as SettingsIcon,
    Security as SecurityIcon,
    Backup as BackupIcon,
    Healing as HealthIcon,
    History as AuditIcon,
    Error as ErrorIcon,
    Router as GatewayIcon,
    AdminPanelSettings as RoleIcon,
    Refresh as RefreshIcon,
    Download as DownloadIcon,
    Restore as RestoreIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckIcon,
    Warning as WarningIcon,
    Storage as StorageIcon,
    Memory as MemoryIcon,
    Speed as SpeedIcon
} from '@mui/icons-material';
import api from '../../services/api';

function SystemDashboard() {
    const [dashboardData, setDashboardData] = useState({
        total_users: 0,
        unresolved_errors: 0,
        pending_backups: 0,
        active_sessions: 0,
        recent_errors: [],
        recent_activity: [],
        last_backup: null
    });
    const [healthData, setHealthData] = useState({});
    const [settings, setSettings] = useState({});
    const [auditLogs, setAuditLogs] = useState([]);
    const [backups, setBackups] = useState([]);
    const [errorLogs, setErrorLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [openBackupDialog, setOpenBackupDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchDashboard();
        fetchHealthData();
        fetchSettings();
        fetchAuditLogs();
        fetchBackups();
        fetchErrorLogs();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await api.get('/system/dashboard');
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        }
    };

    const fetchHealthData = async () => {
        try {
            const response = await api.get('/system/health');
            setHealthData(response.data);
        } catch (error) {
            console.error('Error fetching health data:', error);
        }
    };

    const fetchSettings = async () => {
        try {
            const response = await api.get('/system/settings');
            setSettings(response.data);
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const fetchAuditLogs = async () => {
        try {
            const response = await api.get('/system/audit-logs', { params: { limit: 20 } });
            setAuditLogs(response.data.logs);
        } catch (error) {
            console.error('Error fetching audit logs:', error);
        }
    };

    const fetchBackups = async () => {
        try {
            const response = await api.get('/system/backups');
            setBackups(response.data.backups);
        } catch (error) {
            console.error('Error fetching backups:', error);
        }
    };

    const fetchErrorLogs = async () => {
        try {
            const response = await api.get('/system/error-logs', { params: { resolved: false, limit: 20 } });
            setErrorLogs(response.data.errors);
        } catch (error) {
            console.error('Error fetching error logs:', error);
        }
    };

    const handleCreateBackup = async () => {
        setLoading(true);
        try {
            await api.post('/system/backups', { backup_type: 'full' });
            setSnackbar({ open: true, message: 'Backup started successfully', severity: 'success' });
            setOpenBackupDialog(false);
            fetchBackups();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error creating backup', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleRestoreBackup = async (backupId) => {
        if (window.confirm('Are you sure you want to restore this backup? This will overwrite current data.')) {
            try {
                await api.post(`/system/backups/${backupId}/restore`);
                setSnackbar({ open: true, message: 'Restore started', severity: 'success' });
            } catch (error) {
                setSnackbar({ open: true, message: 'Error restoring backup', severity: 'error' });
            }
        }
    };

    const handleDeleteBackup = async (backupId) => {
        if (window.confirm('Are you sure you want to delete this backup?')) {
            try {
                await api.delete(`/system/backups/${backupId}`);
                setSnackbar({ open: true, message: 'Backup deleted', severity: 'success' });
                fetchBackups();
            } catch (error) {
                setSnackbar({ open: true, message: 'Error deleting backup', severity: 'error' });
            }
        }
    };

    const handleResolveError = async (errorId) => {
        try {
            await api.post(`/system/error-logs/${errorId}/resolve`, { resolution_notes: 'Resolved by admin' });
            setSnackbar({ open: true, message: 'Error marked as resolved', severity: 'success' });
            fetchErrorLogs();
            fetchDashboard();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error resolving error', severity: 'error' });
        }
    };

    const exportAuditLogs = async () => {
        try {
            const response = await api.get('/system/audit-logs/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error exporting logs', severity: 'error' });
        }
    };

    const healthMetrics = [
        { name: 'CPU Usage', value: healthData.cpu_usage || 0, icon: <MemoryIcon />, color: '#2E7D32' },
        { name: 'Memory Usage', value: healthData.memory_usage || 0, icon: <StorageIcon />, color: '#1976D2' },
        { name: 'Disk Usage', value: healthData.disk_usage || 0, icon: <StorageIcon />, color: '#ED6C02' },
        { name: 'Response Time', value: healthData.average_response_time || 0, icon: <SpeedIcon />, color: '#9C27B0', unit: 'ms' }
    ];

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: '#2E7D32', color: 'white' }}>
                <Typography variant="h4" gutterBottom>
                    <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    System Administration
                </Typography>
                <Typography variant="body2">Manage system settings, backups, security, and monitor health</Typography>
            </Paper>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Total Users</Typography>
                            <Typography variant="h3">{dashboardData.total_users}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: '#FFEBEE' }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Unresolved Errors</Typography>
                            <Typography variant="h3" color="error.main">{dashboardData.unresolved_errors}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: '#FFF3E0' }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Active Sessions</Typography>
                            <Typography variant="h3" color="warning.main">{dashboardData.active_sessions}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: '#E3F2FD' }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Pending Backups</Typography>
                            <Typography variant="h3" color="info.main">{dashboardData.pending_backups}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* System Health Metrics */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>System Health</Typography>
                <Grid container spacing={3}>
                    {healthMetrics.map((metric, idx) => (
                        <Grid item xs={12} sm={6} md={3} key={idx}>
                            <Card variant="outlined">
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Box sx={{ color: metric.color, mb: 1 }}>{metric.icon}</Box>
                                    <Typography variant="h4">{metric.value}%</Typography>
                                    <Typography variant="body2" color="textSecondary">{metric.name}</Typography>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={metric.value} 
                                        sx={{ mt: 1, height: 6, borderRadius: 3 }}
                                        color={metric.value > 80 ? 'error' : metric.value > 60 ? 'warning' : 'success'}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    <Grid item xs={12}>
                        <Alert severity="info">
                            Uptime: {Math.floor(healthData.uptime / 3600)} hours {Math.floor((healthData.uptime % 3600) / 60)} minutes
                            | Database Size: {healthData.database_size} MB
                            | Last Health Check: {healthData.last_health_check ? new Date(healthData.last_health_check).toLocaleString() : 'N/A'}
                        </Alert>
                    </Grid>
                </Grid>
            </Paper>

            {/* Tabs */}
            <Paper sx={{ mb: 3 }}>
                <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                    <Tab label="Audit Logs" />
                    <Tab label="Backups" />
                    <Tab label="Error Logs" />
                    <Tab label="System Settings" />
                </Tabs>

                {/* Audit Logs Tab */}
                {activeTab === 0 && (
                    <Box sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                            <Button startIcon={<DownloadIcon />} onClick={exportAuditLogs} variant="outlined">
                                Export Logs
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Timestamp</TableCell>
                                        <TableCell>User</TableCell>
                                        <TableCell>Action</TableCell>
                                        <TableCell>Entity</TableCell>
                                        <TableCell>IP Address</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {auditLogs.map((log) => (
                                        <TableRow key={log.id} hover>
                                            <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                                            <TableCell>{log.username}</TableCell>
                                            <TableCell>{log.action}</TableCell>
                                            <TableCell>{log.entity_type}</TableCell>
                                            <TableCell>{log.ip_address}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={log.status_code === 200 ? 'Success' : 'Error'} 
                                                    color={log.status_code === 200 ? 'success' : 'error'}
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {/* Backups Tab */}
                {activeTab === 1 && (
                    <Box sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                            <Button variant="contained" onClick={() => setOpenBackupDialog(true)} startIcon={<BackupIcon />}>
                                Create Backup
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Backup Name</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Size</TableCell>
                                        <TableCell>Created</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {backups.map((backup) => (
                                        <TableRow key={backup.id} hover>
                                            <TableCell>{backup.backup_name}</TableCell>
                                            <TableCell>{backup.backup_type}</TableCell>
                                            <TableCell>{backup.backup_size ? (backup.backup_size / 1024 / 1024).toFixed(2) + ' MB' : 'N/A'}</TableCell>
                                            <TableCell>{new Date(backup.created_at).toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={backup.status} 
                                                    color={backup.status === 'completed' ? 'success' : backup.status === 'failed' ? 'error' : 'warning'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                {backup.status === 'completed' && (
                                                    <>
                                                        <IconButton size="small" color="primary" onClick={() => handleRestoreBackup(backup.id)}>
                                                            <RestoreIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton size="small" color="error" onClick={() => handleDeleteBackup(backup.id)}>
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {/* Error Logs Tab */}
                {activeTab === 2 && (
                    <Box sx={{ p: 3 }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Timestamp</TableCell>
                                        <TableCell>Level</TableCell>
                                        <TableCell>Error Message</TableCell>
                                        <TableCell>File</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {errorLogs.map((error) => (
                                        <TableRow key={error.id} hover>
                                            <TableCell>{new Date(error.created_at).toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={error.error_level} 
                                                    color={error.error_level === 'critical' ? 'error' : error.error_level === 'error' ? 'warning' : 'info'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{error.error_message}</TableCell>
                                            <TableCell>{error.file_path}:{error.line_number}</TableCell>
                                            <TableCell>
                                                <Chip label={error.resolved ? 'Resolved' : 'Pending'} color={error.resolved ? 'success' : 'error'} size="small" />
                                            </TableCell>
                                            <TableCell align="center">
                                                {!error.resolved && (
                                                    <Button size="small" onClick={() => handleResolveError(error.id)} startIcon={<CheckIcon />}>
                                                        Resolve
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {/* System Settings Tab */}
                {activeTab === 3 && (
                    <Box sx={{ p: 3 }}>
                        <Alert severity="info" sx={{ mb: 3 }}>
                            System configuration settings. Changes will take effect immediately.
                        </Alert>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="System Name"
                                    value={settings.system_name?.value || ''}
                                    helperText={settings.system_name?.description}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Time Zone</InputLabel>
                                    <Select value={settings.system_timezone?.value || 'Africa/Nairobi'}>
                                        <MenuItem value="Africa/Nairobi">Africa/Nairobi</MenuItem>
                                        <MenuItem value="Africa/Cairo">Africa/Cairo</MenuItem>
                                        <MenuItem value="Africa/Johannesburg">Africa/Johannesburg</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Date Format"
                                    value={settings.date_format?.value || 'DD/MM/YYYY'}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Currency</InputLabel>
                                    <Select value={settings.currency?.value || 'KES'}>
                                        <MenuItem value="KES">Kenyan Shilling (KES)</MenuItem>
                                        <MenuItem value="USD">US Dollar (USD)</MenuItem>
                                        <MenuItem value="GBP">British Pound (GBP)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Language</InputLabel>
                                    <Select value={settings.language?.value || 'en'}>
                                        <MenuItem value="en">English</MenuItem>
                                        <MenuItem value="sw">Kiswahili</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" gutterBottom>Backup Settings</Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Auto Backup Frequency</InputLabel>
                                    <Select value={settings.auto_backup_frequency?.value || 'daily'}>
                                        <MenuItem value="daily">Daily</MenuItem>
                                        <MenuItem value="weekly">Weekly</MenuItem>
                                        <MenuItem value="monthly">Monthly</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Backup Retention (days)"
                                    value={settings.backup_retention_days?.value || 30}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Backup Storage</InputLabel>
                                    <Select value={settings.backup_storage?.value || 'local'}>
                                        <MenuItem value="local">Local Storage</MenuItem>
                                        <MenuItem value="s3">Amazon S3</MenuItem>
                                        <MenuItem value="google_drive">Google Drive</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    <Button variant="contained">Save Settings</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Paper>

            {/* Create Backup Dialog */}
            <Dialog open={openBackupDialog} onClose={() => setOpenBackupDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create Backup</DialogTitle>
                <DialogContent>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        This will create a full database backup. The backup process may take a few minutes.
                    </Alert>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Backup Type</InputLabel>
                        <Select defaultValue="full">
                            <MenuItem value="full">Full Backup</MenuItem>
                            <MenuItem value="schema_only">Schema Only</MenuItem>
                            <MenuItem value="data_only">Data Only</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Notes (Optional)"
                        placeholder="Add notes about this backup..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenBackupDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateBackup} variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Create Backup'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
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
    );
}

export default SystemDashboard;