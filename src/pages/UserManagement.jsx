import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormControlLabel,
    Checkbox,
    RadioGroup,
    Radio,
    FormLabel,
    Divider,
    Alert,
    Snackbar,
    Stepper,
    Step,
    StepLabel,
    Card,
    CardContent,
    IconButton,
    InputAdornment,
    Chip,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
    CircularProgress,
    Breadcrumbs,
    Link,
    Stack,
    Tab,
    Tabs,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Switch,
    Badge,
    Menu,
    ListItemIcon,
    ListItemText,
    useTheme,
    Fade,
    Grow,
    Zoom,
    Collapse,
    LinearProgress,
    alpha
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Add as AddIcon,
    Close as CloseIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    CopyAll as CopyIcon,
    CheckCircle as CheckIcon,
    Warning as WarningIcon,
    CloudUpload as UploadIcon,
    PersonAdd as PersonAddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Refresh as RefreshIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    MoreVert as MoreVertIcon,
    People as PeopleIcon,
    Security as SecurityIcon,
    Settings as SettingsIcon,
    School as SchoolIcon,
    AttachMoney as MoneyIcon,
    LocalLibrary as LibraryIcon,
    DirectionsBus as BusIcon,
    Home as HomeIcon,
    Work as WorkIcon,
    Description as DocumentIcon,
    History as HistoryIcon,
    Email as EmailIcon,
    Sms as SmsIcon,
    WhatsApp as WhatsAppIcon,
    Print as PrintIcon,
    Download as DownloadIcon,
    Lock as LockIcon,
    LockOpen as LockOpenIcon,
    Assignment as AssignmentIcon,
    Timeline as TimelineIcon,
    Group as GroupIcon,
    Build as BuildIcon,
    Badge as BadgeIcon,
    Phone as PhoneIcon,
    Email as MailIcon,
    LocationOn as LocationIcon,
    CalendarToday as CalendarIcon,
    AttachMoney as AttachMoneyIcon,
    CreditCard as CardIcon,
    Business as BusinessIcon,
    Verified as VerifiedIcon,
    Pending as PendingIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../services/api';

// Role definitions with their specific fields
const ROLES = {
    teacher: {
        name: 'Teacher',
        icon: <SchoolIcon />,
        color: '#2196F3',
        description: 'Classroom teacher, subject teacher',
        fields: ['tsc_number', 'subjects', 'qualifications', 'specialization', 'employment_type', 'employment_date', 'salary_scale', 'bank_details']
    },
    accountant: {
        name: 'Accountant / Bursar',
        // eslint-disable-next-line react/jsx-no-undef
        icon: <AttachMoneyIcon />,
        color: '#4CAF50',
        description: 'Handles fees, payments, financial reports',
        fields: ['job_title', 'responsibilities', 'financial_access']
    },
    non_teaching_staff: {
        name: 'Non-Teaching Staff',
        icon: <WorkIcon />,
        color: '#FF9800',
        description: 'Secretary, nurse, cook, admin staff',
        fields: ['department', 'job_title', 'responsibilities']
    },
    support_staff: {
        name: 'Support Staff',
        // eslint-disable-next-line react/jsx-no-undef
        icon: <BuildIcon />,
        color: '#9C27B0',
        description: 'Cleaners, security, drivers, groundsmen',
        fields: ['department', 'job_title', 'responsibilities']
    },
    transport_manager: {
        name: 'Transport Manager / Driver',
        icon: <BusIcon />,
        color: '#00BCD4',
        description: 'Manages buses, routes, drivers',
        fields: ['license_number', 'vehicle_assigned', 'route_experience']
    },
    hostel_manager: {
        name: 'Hostel / Boarding Manager',
        icon: <HomeIcon />,
        color: '#E91E63',
        description: 'Manages boarding facilities, rooms, meals',
        fields: ['responsibilities', 'manage_boarding_fees']
    },
    librarian: {
        name: 'Librarian',
        icon: <LibraryIcon />,
        color: '#795548',
        description: 'Manages library and borrowing',
        fields: ['library_access']
    },
    class_teacher: {
        name: 'Class Teacher / Form Teacher',
        icon: <GroupIcon />,
        color: '#673AB7',
        description: 'Form teacher with extra responsibilities',
        fields: ['assigned_class', 'subjects', 'form_level']
    }
};

// Department options
const DEPARTMENTS = {
    non_teaching_staff: ['Administration', 'Kitchen', 'Security', 'Maintenance', 'Cleaning', 'Nursing', 'Counselling', 'IT', 'Reception', 'Records'],
    support_staff: ['Cleaning', 'Security', 'Grounds Maintenance', 'Kitchen Assistant', 'Office Assistant', 'Messenger']
};

// Subject options
const SUBJECTS = [
    'Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physics',
    'History', 'Geography', 'CRE', 'IRE', 'Business Studies', 'Agriculture',
    'Computer Studies', 'Home Science', 'Art & Design', 'Music', 'Physical Education'
];

// Qualification options
const QUALIFICATIONS = ['Certificate', 'Diploma', "Bachelor's Degree", "Master's Degree", 'PhD', 'Professional Certification'];

// Employment types
const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Intern', 'Casual', 'Temporary'];

// Permission groups
const PERMISSION_GROUPS = {
    academic: {
        name: 'Academic Permissions',
        permissions: ['take_attendance', 'post_assignments', 'enter_results', 'view_student_profiles']
    },
    administrative: {
        name: 'Administrative Permissions',
        permissions: ['manage_timetable', 'approve_leave', 'manage_documents']
    },
    financial: {
        name: 'Financial Permissions',
        permissions: ['manage_fees', 'generate_reports', 'reconcile_payments', 'issue_receipts']
    },
    communication: {
        name: 'Communication Permissions',
        permissions: ['send_sms', 'send_email', 'send_notifications', 'view_announcements']
    }
};

function UserManagement() {
    const navigate = useNavigate();
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [createdUser, setCreatedUser] = useState(null);
    const [duplicateWarning, setDuplicateWarning] = useState(null);
    const [usersList, setUsersList] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    
    // Basic Information
    const [formData, setFormData] = useState({
        // Personal Info
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '',
        dateOfBirth: null,
        phoneNumber: '',
        alternativePhone: '',
        email: '',
        nationalId: '',
        physicalAddress: '',
        county: '',
        town: '',
        
        // Account Info
        username: '',
        password: '',
        
        // Role
        role: 'teacher',
        
        // Status
        status: 'active',
        
        // Notifications
        sendSms: true,
        sendEmail: false,
        sendWhatsApp: false,
        
        // Profile Photo
        profilePhoto: null,
        profilePhotoPreview: null,
        
        // Employment Details
        employeeId: '',
        employmentType: 'Full-time',
        employmentDate: null,
        contractEndDate: null,
        salaryScale: '',
        basicSalary: '',
        
        // Bank Details
        bankDetails: {
            accountName: '',
            accountNumber: '',
            bankName: '',
            bankBranch: ''
        },
        
        // Tax & Deductions
        kraPin: '',
        nssfNumber: '',
        nhifNumber: '',
        
        // Emergency Contact
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelation: '',
        
        // Role-specific fields
        tscNumber: '',
        subjects: [],
        qualifications: [],
        specialization: '',
        jobTitle: '',
        responsibilities: '',
        department: '',
        licenseNumber: '',
        vehicleAssigned: '',
        routeExperience: '',
        manageBoardingFees: false,
        libraryAccess: true,
        assignedClass: '',
        formLevel: '',
        
        // Financial Access
        financialAccess: {
            viewFees: true,
            generateReports: true,
            reconcilePayments: true,
            issueReceipts: true,
            viewAllTransactions: false,
            editPayments: false
        },
        
        // Permissions
        permissions: {
            take_attendance: false,
            post_assignments: false,
            enter_results: false,
            view_student_profiles: false,
            manage_timetable: false,
            approve_leave: false,
            manage_documents: false,
            manage_fees: false,
            generate_reports: false,
            reconcile_payments: false,
            issue_receipts: false,
            send_sms: false,
            send_email: false,
            send_notifications: false,
            view_announcements: true
        },
        
        // Documents
        documents: [],
        
        // Audit
        createdBy: '',
        createdAt: null,
        updatedAt: null
    });

    // Load users list
    useEffect(() => {
        fetchUsers();
    }, []);

    // Generate username suggestion
    useEffect(() => {
        if (formData.firstName && formData.lastName && !formData.username && !editMode) {
            const suggestion = `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`;
            setFormData(prev => ({ ...prev, username: suggestion }));
        }
    }, [formData.firstName, formData.lastName]);

    // Generate temporary password
    useEffect(() => {
        if (!formData.password && !editMode) {
            const generatedPassword = generateTemporaryPassword();
            setFormData(prev => ({ ...prev, password: generatedPassword }));
        }
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsersList(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const generateTemporaryPassword = () => {
        const length = 12;
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*';
        
        let password = '';
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += symbols[Math.floor(Math.random() * symbols.length)];
        
        for (let i = password.length; i < length; i++) {
            const all = uppercase + lowercase + numbers + symbols;
            password += all[Math.floor(Math.random() * all.length)];
        }
        
        return password.split('').sort(() => Math.random() - 0.5).join('');
    };

    const generateEmployeeId = () => {
        const prefix = formData.role.substring(0, 3).toUpperCase();
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}/${year}/${random}`;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (field === 'phoneNumber' || field === 'nationalId') {
            setDuplicateWarning(null);
        }
    };

    const handleSubjectsChange = (event) => {
        setFormData(prev => ({ ...prev, subjects: event.target.value }));
    };

    const handleQualificationsChange = (event) => {
        setFormData(prev => ({ ...prev, qualifications: event.target.value }));
    };

    const handlePermissionChange = (permission) => {
        setFormData(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [permission]: !prev.permissions[permission]
            }
        }));
    };

    const handleGroupPermissionChange = (group, checked) => {
        const newPermissions = { ...formData.permissions };
        PERMISSION_GROUPS[group].permissions.forEach(perm => {
            newPermissions[perm] = checked;
        });
        setFormData(prev => ({ ...prev, permissions: newPermissions }));
    };

    const handleFinancialAccessChange = (access) => {
        setFormData(prev => ({
            ...prev,
            financialAccess: {
                ...prev.financialAccess,
                [access]: !prev.financialAccess[access]
            }
        }));
    };

    const handlePhotoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    profilePhoto: file,
                    profilePhotoPreview: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const checkDuplicate = async () => {
        try {
            const response = await api.get('/users/check-duplicate', {
                params: {
                    phone: formData.phoneNumber,
                    nationalId: formData.nationalId,
                    email: formData.email
                }
            });
            if (response.data.hasDuplicate) {
                setDuplicateWarning(response.data.message);
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error checking duplicates:', error);
            return true;
        }
    };

    const validateForm = () => {
        if (!formData.firstName) return 'First name is required';
        if (!formData.lastName) return 'Last name is required';
        if (!formData.gender) return 'Gender is required';
        if (!formData.phoneNumber) return 'Phone number is required';
        if (!formData.nationalId) return 'National ID number is required';
        
        const phoneRegex = /^07\d{8}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            return 'Phone number must be in format 07xx xxx xxx';
        }
        
        if (!formData.username) return 'Username is required';
        
        return null;
    };

    const handleSubmit = async () => {
        const validationError = validateForm();
        if (validationError) {
            setSnackbar({ open: true, message: validationError, severity: 'error' });
            return;
        }
        
        const isUnique = await checkDuplicate();
        if (!isUnique) return;
        
        setLoading(true);
        
        try {
            const submitData = {
                ...formData,
                employeeId: formData.employeeId || generateEmployeeId(),
                status: 'active'
            };
            
            let response;
            if (editMode) {
                response = await api.put(`/users/${selectedUser.id}`, submitData);
            } else {
                response = await api.post('/users/create-staff', submitData);
            }
            
            setCreatedUser(response.data.user || response.data);
            setShowSuccessDialog(true);
            
            await api.post('/activity-logs', {
                action: editMode ? 'updated_user' : 'created_user',
                details: `${editMode ? 'Updated' : 'Created new'} ${formData.role}: ${formData.firstName} ${formData.lastName}`
            });
            
            fetchUsers();
            
            if (!editMode) {
                resetForm();
            }
        } catch (error) {
            console.error('Error saving user:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.error || 'Error saving user',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            firstName: '',
            middleName: '',
            lastName: '',
            gender: '',
            dateOfBirth: null,
            phoneNumber: '',
            alternativePhone: '',
            email: '',
            nationalId: '',
            physicalAddress: '',
            county: '',
            town: '',
            username: '',
            password: generateTemporaryPassword(),
            role: 'teacher',
            status: 'active',
            sendSms: true,
            sendEmail: false,
            sendWhatsApp: false,
            profilePhoto: null,
            profilePhotoPreview: null,
            employeeId: '',
            employmentType: 'Full-time',
            employmentDate: null,
            contractEndDate: null,
            salaryScale: '',
            basicSalary: '',
            bankDetails: {
                accountName: '',
                accountNumber: '',
                bankName: '',
                bankBranch: ''
            },
            kraPin: '',
            nssfNumber: '',
            nhifNumber: '',
            emergencyContactName: '',
            emergencyContactPhone: '',
            emergencyContactRelation: '',
            tscNumber: '',
            subjects: [],
            qualifications: [],
            specialization: '',
            jobTitle: '',
            responsibilities: '',
            department: '',
            licenseNumber: '',
            vehicleAssigned: '',
            routeExperience: '',
            manageBoardingFees: false,
            libraryAccess: true,
            assignedClass: '',
            formLevel: '',
            financialAccess: {
                viewFees: true,
                generateReports: true,
                reconcilePayments: true,
                issueReceipts: true,
                viewAllTransactions: false,
                editPayments: false
            },
            permissions: {
                take_attendance: false,
                post_assignments: false,
                enter_results: false,
                view_student_profiles: false,
                manage_timetable: false,
                approve_leave: false,
                manage_documents: false,
                manage_fees: false,
                generate_reports: false,
                reconcile_payments: false,
                issue_receipts: false,
                send_sms: false,
                send_email: false,
                send_notifications: false,
                view_announcements: true
            },
            documents: []
        });
        setActiveStep(0);
        setEditMode(false);
        setSelectedUser(null);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setFormData({
            ...user,
            dateOfBirth: user.date_of_birth ? new Date(user.date_of_birth) : null,
            employmentDate: user.employment_date ? new Date(user.employment_date) : null,
            contractEndDate: user.contract_end_date ? new Date(user.contract_end_date) : null,
            subjects: user.subjects || [],
            qualifications: user.qualifications || [],
            bankDetails: user.bank_details || {
                accountName: '',
                accountNumber: '',
                bankName: '',
                bankBranch: ''
            },
            financialAccess: user.financial_access || {
                viewFees: true,
                generateReports: true,
                reconcilePayments: true,
                issueReceipts: true,
                viewAllTransactions: false,
                editPayments: false
            },
            permissions: user.permissions || {}
        });
        setEditMode(true);
        setActiveStep(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to deactivate this user?')) {
            try {
                await api.delete(`/users/${userId}`);
                setSnackbar({ open: true, message: 'User deactivated successfully', severity: 'success' });
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                setSnackbar({ open: true, message: 'Error deactivating user', severity: 'error' });
            }
        }
    };

    const handleResetPassword = async (userId) => {
        try {
            const response = await api.post(`/users/${userId}/reset-password`);
            setSnackbar({
                open: true,
                message: `Password reset successfully. New password: ${response.data.newPassword}`,
                severity: 'info'
            });
        } catch (error) {
            console.error('Error resetting password:', error);
            setSnackbar({ open: true, message: 'Error resetting password', severity: 'error' });
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setSnackbar({ open: true, message: 'Copied to clipboard!', severity: 'success' });
    };

    const handleSaveAndAddAnother = () => {
        resetForm();
        setShowSuccessDialog(false);
    };

    // Filter users
    const filteredUsers = usersList.filter(user => {
        const matchesSearch = searchTerm === '' || 
            `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone?.includes(searchTerm);
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesStatus = filterStatus === 'all' || 
            (filterStatus === 'active' && user.is_active) ||
            (filterStatus === 'inactive' && !user.is_active);
        return matchesSearch && matchesRole && matchesStatus;
    });

    // Role-specific fields renderer
    const getRoleSpecificFields = () => {
        switch (formData.role) {
            case 'teacher':
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="TSC Number"
                                value={formData.tscNumber}
                                onChange={(e) => handleInputChange('tscNumber', e.target.value)}
                                helperText="Teachers Service Commission registration number"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Subjects Taught</InputLabel>
                                <Select
                                    multiple
                                    value={formData.subjects}
                                    onChange={handleSubjectsChange}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} size="small" />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {SUBJECTS.map((subject) => (
                                        <MenuItem key={subject} value={subject}>
                                            <Checkbox checked={formData.subjects.indexOf(subject) > -1} />
                                            {subject}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Qualifications</InputLabel>
                                <Select
                                    multiple
                                    value={formData.qualifications}
                                    onChange={handleQualificationsChange}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} size="small" />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {QUALIFICATIONS.map((qual) => (
                                        <MenuItem key={qual} value={qual}>
                                            <Checkbox checked={formData.qualifications.indexOf(qual) > -1} />
                                            {qual}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Specialization / Department"
                                value={formData.specialization}
                                onChange={(e) => handleInputChange('specialization', e.target.value)}
                            />
                        </Grid>
                    </Grid>
                );
                
            case 'accountant':
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Job Title"
                                value={formData.jobTitle}
                                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Responsibilities"
                                value={formData.responsibilities}
                                onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                            />
                        </Grid>
                    </Grid>
                );
                
            case 'non_teaching_staff':
            case 'support_staff':
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Department</InputLabel>
                                <Select
                                    value={formData.department}
                                    onChange={(e) => handleInputChange('department', e.target.value)}
                                >
                                    {DEPARTMENTS[formData.role]?.map((dept) => (
                                        <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Job Title / Position"
                                value={formData.jobTitle}
                                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Responsibilities"
                                value={formData.responsibilities}
                                onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                            />
                        </Grid>
                    </Grid>
                );
                
            case 'transport_manager':
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="License Number"
                                value={formData.licenseNumber}
                                onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Vehicle Assigned"
                                value={formData.vehicleAssigned}
                                onChange={(e) => handleInputChange('vehicleAssigned', e.target.value)}
                                placeholder="e.g., Bus KBX 123A"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Transport Route Experience"
                                value={formData.routeExperience}
                                onChange={(e) => handleInputChange('routeExperience', e.target.value)}
                            />
                        </Grid>
                    </Grid>
                );
                
            case 'hostel_manager':
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Responsibilities"
                                value={formData.responsibilities}
                                onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.manageBoardingFees}
                                        onChange={(e) => handleInputChange('manageBoardingFees', e.target.checked)}
                                    />
                                }
                                label="Can manage boarding fees"
                            />
                        </Grid>
                    </Grid>
                );
                
            default:
                return null;
        }
    };

    // Preview Summary
    const PreviewSummary = () => (
        <Zoom in={true}>
            <Card sx={{ mt: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <VerifiedIcon color="primary" /> Preview Summary
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="caption" color="textSecondary">Full Name</Typography>
                            <Typography variant="body2" fontWeight="bold">
                                {formData.firstName} {formData.middleName} {formData.lastName}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="caption" color="textSecondary">Role</Typography>
                            <Chip 
                                icon={ROLES[formData.role]?.icon}
                                label={ROLES[formData.role]?.name}
                                size="small"
                                color="primary"
                                sx={{ mt: 0.5 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="caption" color="textSecondary">Employee ID</Typography>
                            <Typography variant="body2" fontWeight="bold">
                                {formData.employeeId || generateEmployeeId()}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="caption" color="textSecondary">Phone</Typography>
                            <Typography variant="body2">{formData.phoneNumber}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="caption" color="textSecondary">Email</Typography>
                            <Typography variant="body2">{formData.email || 'Not provided'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="caption" color="textSecondary">Username</Typography>
                            <Typography variant="body2">{formData.username}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="caption" color="textSecondary">National ID</Typography>
                            <Typography variant="body2">{formData.nationalId}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="caption" color="textSecondary">Employment Type</Typography>
                            <Typography variant="body2">{formData.employmentType}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="caption" color="textSecondary">Status</Typography>
                            <Chip 
                                label="Active" 
                                color="success" 
                                size="small" 
                                sx={{ mt: 0.5 }}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Zoom>
    );

    // Users List View
    const UsersListView = () => (
        <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleIcon /> Staff & Users List
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        size="small"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                        sx={{ width: 250 }}
                    />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Filter by Role</InputLabel>
                        <Select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                            <MenuItem value="all">All Roles</MenuItem>
                            {Object.entries(ROLES).map(([key, role]) => (
                                <MenuItem key={key} value={key}>{role.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Status</InputLabel>
                        <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        onClick={() => {
                            resetForm();
                            setEditMode(false);
                            setActiveTab(0);
                        }}
                    >
                        Add New User
                    </Button>
                </Box>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Employee ID</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Last Login</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                            <TableRow key={user.id} hover>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar src={user.profile_photo_url} sx={{ width: 40, height: 40 }}>
                                            {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight="bold">
                                                {user.first_name} {user.last_name}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {user.username}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        icon={ROLES[user.role]?.icon}
                                        label={ROLES[user.role]?.name || user.role}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{user.phone}</Typography>
                                    <Typography variant="caption" color="textSecondary">{user.email}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{user.employee_id || 'N/A'}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={user.is_active ? 'Active' : 'Inactive'}
                                        color={user.is_active ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="caption">
                                        {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <IconButton size="small" onClick={() => handleEditUser(user)}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleResetPassword(user.id)}>
                                        <RefreshIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDeleteUser(user.id)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredUsers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            />
        </Paper>
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
                {/* Header */}
                <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PersonAddIcon sx={{ fontSize: 35 }} /> User Management
                            </Typography>
                            <Breadcrumbs sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                <Link color="inherit" sx={{ cursor: 'pointer' }}>Dashboard</Link>
                                <Typography color="white">User Management</Typography>
                            </Breadcrumbs>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button 
                                variant="contained" 
                                sx={{ bgcolor: 'white', color: 'primary.main' }}
                                startIcon={<GroupIcon />}
                                onClick={() => setViewMode('list')}
                            >
                                View Users
                            </Button>
                            <Button 
                                variant="outlined" 
                                sx={{ borderColor: 'white', color: 'white' }}
                                startIcon={<PersonAddIcon />}
                                onClick={() => {
                                    resetForm();
                                    setEditMode(false);
                                    setActiveTab(0);
                                    setViewMode('grid');
                                }}
                            >
                                Add New
                            </Button>
                        </Box>
                    </Box>
                </Paper>

                {viewMode === 'list' ? (
                    <UsersListView />
                ) : (
                    <>
                        {/* Duplicate Warning */}
                        {duplicateWarning && (
                            <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setDuplicateWarning(null)}>
                                {duplicateWarning}
                            </Alert>
                        )}

                        {/* Stepper */}
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                                <Step>
                                    <StepLabel>Basic Information</StepLabel>
                                </Step>
                                <Step>
                                    <StepLabel>Role & Employment</StepLabel>
                                </Step>
                                <Step>
                                    <StepLabel>Permissions & Review</StepLabel>
                                </Step>
                            </Stepper>

                            {/* Step 1: Basic Information */}
                            {activeStep === 0 && (
                                <Fade in={true}>
                                    <Box>
                                        <Typography variant="h6" gutterBottom>Basic Information</Typography>
                                        <Divider sx={{ mb: 3 }} />
                                        
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} display="flex" justifyContent="center">
                                                <Box sx={{ textAlign: 'center' }}>
                                                    <Badge
                                                        overlap="circular"
                                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                        badgeContent={
                                                            <IconButton 
                                                                component="label"
                                                                sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                                                            >
                                                                <UploadIcon fontSize="small" />
                                                                <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
                                                            </IconButton>
                                                        }
                                                    >
                                                        <Avatar
                                                            src={formData.profilePhotoPreview}
                                                            sx={{ width: 120, height: 120, mb: 2, border: '3px solid white', boxShadow: 3 }}
                                                        >
                                                            {!formData.profilePhotoPreview && <PersonAddIcon sx={{ fontSize: 60 }} />}
                                                        </Avatar>
                                                    </Badge>
                                                    <Typography variant="caption" display="block" color="textSecondary">
                                                        Recommended: 300x300px
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    fullWidth
                                                    label="First Name"
                                                    value={formData.firstName}
                                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                    required
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    fullWidth
                                                    label="Middle Name"
                                                    value={formData.middleName}
                                                    onChange={(e) => handleInputChange('middleName', e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    fullWidth
                                                    label="Last Name"
                                                    value={formData.lastName}
                                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                    required
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={4}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Gender</InputLabel>
                                                    <Select
                                                        value={formData.gender}
                                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                                        required
                                                    >
                                                        <MenuItem value="Male">Male</MenuItem>
                                                        <MenuItem value="Female">Female</MenuItem>
                                                        <MenuItem value="Other">Other</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <DatePicker
                                                    label="Date of Birth"
                                                    value={formData.dateOfBirth}
                                                    onChange={(date) => handleInputChange('dateOfBirth', date)}
                                                    slotProps={{ textField: { fullWidth: true } }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    fullWidth
                                                    label="National ID Number"
                                                    value={formData.nationalId}
                                                    onChange={(e) => handleInputChange('nationalId', e.target.value)}
                                                    required
                                                    error={!!duplicateWarning && duplicateWarning.includes('ID')}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Phone Number"
                                                    value={formData.phoneNumber}
                                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                                    required
                                                    placeholder="07xx xxx xxx"
                                                    error={!!duplicateWarning && duplicateWarning.includes('phone')}
                                                    helperText="Format: 07xx xxx xxx"
                                                    InputProps={{
                                                        startAdornment: <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Alternative Phone Number"
                                                    value={formData.alternativePhone}
                                                    onChange={(e) => handleInputChange('alternativePhone', e.target.value)}
                                                    placeholder="07xx xxx xxx (optional)"
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Email Address"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    error={!!duplicateWarning && duplicateWarning.includes('email')}
                                                    InputProps={{
                                                        startAdornment: <MailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Physical Address"
                                                    value={formData.physicalAddress}
                                                    onChange={(e) => handleInputChange('physicalAddress', e.target.value)}
                                                    multiline
                                                    rows={2}
                                                    InputProps={{
                                                        startAdornment: <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                    }}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Username"
                                                    value={formData.username}
                                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                                    required
                                                    helperText="Auto-generated suggestion"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Temporary Password"
                                                    value={formData.password}
                                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                                    type={showPassword ? 'text' : 'password'}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton onClick={() => setShowPassword(!showPassword)}>
                                                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                                </IconButton>
                                                                <IconButton onClick={() => copyToClipboard(formData.password)}>
                                                                    <CopyIcon />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" gutterBottom>Send Login Details Via</Typography>
                                                <Box sx={{ display: 'flex', gap: 3 }}>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={formData.sendSms} onChange={(e) => handleInputChange('sendSms', e.target.checked)} />}
                                                        label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><SmsIcon fontSize="small" /> SMS</Box>}
                                                    />
                                                    <FormControlLabel
                                                        control={<Checkbox checked={formData.sendEmail} onChange={(e) => handleInputChange('sendEmail', e.target.checked)} />}
                                                        label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><EmailIcon fontSize="small" /> Email</Box>}
                                                        disabled={!formData.email}
                                                    />
                                                    <FormControlLabel
                                                        control={<Checkbox checked={formData.sendWhatsApp} onChange={(e) => handleInputChange('sendWhatsApp', e.target.checked)} />}
                                                        label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><WhatsAppIcon fontSize="small" /> WhatsApp</Box>}
                                                    />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Fade>
                            )}

                            {/* Step 2: Role & Employment */}
                            {activeStep === 1 && (
                                <Fade in={true}>
                                    <Box>
                                        <Typography variant="h6" gutterBottom>Role & Employment Details</Typography>
                                        <Divider sx={{ mb: 3 }} />
                                        
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Select Role</InputLabel>
                                                    <Select
                                                        value={formData.role}
                                                        onChange={(e) => handleInputChange('role', e.target.value)}
                                                    >
                                                        {Object.entries(ROLES).map(([key, role]) => (
                                                            <MenuItem key={key} value={key}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                    {role.icon}
                                                                    <Box>
                                                                        <Typography variant="body1">{role.name}</Typography>
                                                                        <Typography variant="caption" color="textSecondary">
                                                                            {role.description}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Divider>
                                                    <Chip label={`${ROLES[formData.role]?.name} Specific Details`} />
                                                </Divider>
                                            </Grid>

                                            {getRoleSpecificFields()}

                                            <Grid item xs={12}>
                                                <Divider>
                                                    <Chip label="Employment Details" />
                                                </Divider>
                                            </Grid>

                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    fullWidth
                                                    label="Employee ID"
                                                    value={formData.employeeId}
                                                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                                                    helperText="Auto-generated if left empty"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Employment Type</InputLabel>
                                                    <Select
                                                        value={formData.employmentType}
                                                        onChange={(e) => handleInputChange('employmentType', e.target.value)}
                                                    >
                                                        {EMPLOYMENT_TYPES.map((type) => (
                                                            <MenuItem key={type} value={type}>{type}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <DatePicker
                                                    label="Employment Date"
                                                    value={formData.employmentDate}
                                                    onChange={(date) => handleInputChange('employmentDate', date)}
                                                    slotProps={{ textField: { fullWidth: true } }}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <DatePicker
                                                    label="Contract End Date (if applicable)"
                                                    value={formData.contractEndDate}
                                                    onChange={(date) => handleInputChange('contractEndDate', date)}
                                                    slotProps={{ textField: { fullWidth: true } }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Salary Scale / Basic Pay"
                                                    type="number"
                                                    value={formData.basicSalary}
                                                    onChange={(e) => handleInputChange('basicSalary', e.target.value)}
                                                    placeholder="Optional"
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Divider>
                                                    <Chip label="Bank Details (Optional)" />
                                                </Divider>
                                            </Grid>

                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Account Name"
                                                    value={formData.bankDetails.accountName}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        bankDetails: { ...prev.bankDetails, accountName: e.target.value }
                                                    }))}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Account Number"
                                                    value={formData.bankDetails.accountNumber}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        bankDetails: { ...prev.bankDetails, accountNumber: e.target.value }
                                                    }))}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Bank Name"
                                                    value={formData.bankDetails.bankName}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        bankDetails: { ...prev.bankDetails, bankName: e.target.value }
                                                    }))}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Divider>
                                                    <Chip label="Tax & Deductions" />
                                                </Divider>
                                            </Grid>

                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="KRA PIN"
                                                    value={formData.kraPin}
                                                    onChange={(e) => handleInputChange('kraPin', e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="NSSF Number"
                                                    value={formData.nssfNumber}
                                                    onChange={(e) => handleInputChange('nssfNumber', e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="NHIF Number"
                                                    value={formData.nhifNumber}
                                                    onChange={(e) => handleInputChange('nhifNumber', e.target.value)}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Divider>
                                                    <Chip label="Emergency Contact" />
                                                </Divider>
                                            </Grid>

                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Contact Name"
                                                    value={formData.emergencyContactName}
                                                    onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Contact Phone"
                                                    value={formData.emergencyContactPhone}
                                                    onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Relation"
                                                    value={formData.emergencyContactRelation}
                                                    onChange={(e) => handleInputChange('emergencyContactRelation', e.target.value)}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Fade>
                            )}

                            {/* Step 3: Permissions & Review */}
                            {activeStep === 2 && (
                                <Fade in={true}>
                                    <Box>
                                        <Typography variant="h6" gutterBottom>Permissions & Access Control</Typography>
                                        <Divider sx={{ mb: 3 }} />

                                        <Grid container spacing={3}>
                                            {Object.entries(PERMISSION_GROUPS).map(([groupKey, group]) => (
                                                <Grid item xs={12} md={6} key={groupKey}>
                                                    <Card variant="outlined">
                                                        <CardContent>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                                <Typography variant="subtitle1" fontWeight="bold">
                                                                    {group.name}
                                                                </Typography>
                                                                <FormControlLabel
                                                                    control={
                                                                        <Switch
                                                                            checked={group.permissions.every(p => formData.permissions[p])}
                                                                            onChange={(e) => handleGroupPermissionChange(groupKey, e.target.checked)}
                                                                        />
                                                                    }
                                                                    label="Select All"
                                                                />
                                                            </Box>
                                                            <Divider sx={{ mb: 2 }} />
                                                            <Grid container spacing={1}>
                                                                {group.permissions.map((permission) => (
                                                                    <Grid item xs={12} key={permission}>
                                                                        <FormControlLabel
                                                                            control={
                                                                                <Checkbox
                                                                                    checked={formData.permissions[permission]}
                                                                                    onChange={() => handlePermissionChange(permission)}
                                                                                />
                                                                            }
                                                                            label={permission.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                                        />
                                                                    </Grid>
                                                                ))}
                                                            </Grid>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>

                                        <PreviewSummary />
                                    </Box>
                                </Fade>
                            )}

                            {/* Navigation Buttons */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                                <Button
                                    disabled={activeStep === 0}
                                    onClick={() => setActiveStep(prev => prev - 1)}
                                >
                                    Back
                                </Button>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button onClick={() => navigate('/dashboard')}>
                                        Cancel
                                    </Button>
                                    {activeStep === 2 ? (
                                        <Button
                                            variant="contained"
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                                        >
                                            {editMode ? 'Update User' : 'Save User'}
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            onClick={() => setActiveStep(prev => prev + 1)}
                                        >
                                            Next
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </Paper>
                    </>
                )}

                {/* Success Dialog */}
                <Dialog open={showSuccessDialog} onClose={() => setShowSuccessDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
                        <CheckIcon sx={{ fontSize: 60 }} />
                        <Typography variant="h5">User Added Successfully!</Typography>
                    </DialogTitle>
                    <DialogContent sx={{ p: 3 }}>
                        <Alert severity="success" sx={{ mb: 2 }}>
                            User has been created successfully.
                        </Alert>
                        
                        <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
                            <Typography variant="subtitle2" gutterBottom>Login Credentials</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2">Username:</Typography>
                                <Typography variant="body2" fontWeight="bold">{createdUser?.username}</Typography>
                                <IconButton size="small" onClick={() => copyToClipboard(createdUser?.username)}>
                                    <CopyIcon fontSize="small" />
                                </IconButton>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2">Password:</Typography>
                                <Typography variant="body2" fontWeight="bold" color="warning.main">{createdUser?.temporaryPassword || formData.password}</Typography>
                                <IconButton size="small" onClick={() => copyToClipboard(createdUser?.temporaryPassword || formData.password)}>
                                    <CopyIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Paper>

                        <Typography variant="body2" color="textSecondary" align="center">
                            Login details have been sent via {formData.sendSms && 'SMS '}{formData.sendEmail && 'Email '}{formData.sendWhatsApp && 'WhatsApp'}
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, gap: 2 }}>
                        <Button variant="outlined" onClick={() => navigate('/users')}>
                            Go to Users List
                        </Button>
                        <Button variant="contained" onClick={handleSaveAndAddAnother}>
                            Add Another User
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    );
}

export default UserManagement;