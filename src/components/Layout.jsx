import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  School,
  EventNote,
  Assessment,
  AttachMoney,
  Schedule,
  Message,
  Settings,
  Logout,
  LibraryBooks as LibraryBooksIcon,
  Inventory as InventoryIcon,
  Home as HostelIcon,
  BusinessCenter as HRPayrollIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  AccountBox as AccountIcon,
  MeetingRoom as MeetingRoomIcon,
  Bed as BedIcon,
  Warning as WarningIcon,
  DirectionsBus as DirectionsBusIcon,
  Receipt as ReceiptIcon,
  MenuBook as MenuBookIcon,
  TrendingUp as TrendingUpIcon,
  Book as BookIcon,
  Restaurant as RestaurantIcon,
  Payment as PaymentIcon,
  Assignment as AssignmentIcon,
  Announcement as AnnouncementIcon,
  Dashboard as DashboardIcon,
  Class as ClassIcon,
  Groups as GroupsIcon,
} from '@mui/icons-material';
import { logout } from '../store/slices/authSlice';

const drawerWidth = 240;

// ==================== SUPER ADMIN MENU ITEMS ====================
const superAdminMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin-dashboard' },
  { text: 'System Overview', icon: <Assessment />, path: '/system-overview' },
  { text: 'Schools Management', icon: <School />, path: '/schools' },
  { text: 'Users Management', icon: <People />, path: '/users' },
  { text: 'System Settings', icon: <Settings />, path: '/settings' },
  { text: 'Audit Logs', icon: <AssignmentIcon />, path: '/audit-logs' },
  { text: 'Backup & Restore', icon: <InventoryIcon />, path: '/backup' },
  { text: 'Reports', icon: <Assessment />, path: '/reports' },
];

// ==================== SCHOOL ADMIN MENU ITEMS ====================
const schoolAdminMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin-dashboard' },
  { text: 'Students', icon: <School />, path: '/students' },
  { text: 'Teachers', icon: <People />, path: '/teachers' },
  { text: 'Classes', icon: <ClassIcon />, path: '/classes' },
  { text: 'Subjects', icon: <BookIcon />, path: '/subjects' },
  { text: 'Attendance', icon: <Assessment />, path: '/attendance' },
  { text: 'Results', icon: <TrendingUpIcon />, path: '/results' },
  { text: 'Fees Management', icon: <AttachMoney />, path: '/fees' },
  { text: 'Timetable', icon: <Schedule />, path: '/timetable' },
  { text: 'Library', icon: <LibraryBooksIcon />, path: '/library' },
  { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
  { text: 'HR & Payroll', icon: <HRPayrollIcon />, path: '/hr' },
  { text: 'Transport', icon: <DirectionsBusIcon />, path: '/transport' },
  { text: 'Hostel', icon: <HostelIcon />, path: '/hostel' },
  { text: 'Communications', icon: <Message />, path: '/communications' },
  { text: 'Reports', icon: <Assessment />, path: '/reports' },
  { text: 'User Management', icon: <People />, path: '/users' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

// ==================== TEACHER MENU ITEMS ====================
const teacherMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/teacher-dashboard' },
  { text: 'My Classes', icon: <ClassIcon />, path: '/classes' },
  { text: 'My Students', icon: <GroupsIcon />, path: '/students' },
  { text: 'Attendance', icon: <Assessment />, path: '/attendance' },
  { text: 'Marks Entry', icon: <AssignmentIcon />, path: '/results' },
  { text: 'Results', icon: <TrendingUpIcon />, path: '/results/portal' },
  { text: 'Timetable', icon: <Schedule />, path: '/timetable' },
  { text: 'Lesson Plans', icon: <MenuBookIcon />, path: '/lesson-plans' },
  { text: 'Assignments', icon: <AssignmentIcon />, path: '/assignments' },
  { text: 'Communications', icon: <Message />, path: '/communications' },
  { text: 'Reports', icon: <Assessment />, path: '/reports' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
];

const storeKeeperMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/store-dashboard' },
  { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
  { text: 'Stock Transactions', icon: <ReceiptIcon />, path: '/stock-transactions' },
  { text: 'Requisitions', icon: <AssignmentIcon />, path: '/requisitions' },
  { text: 'Suppliers', icon: <People />, path: '/suppliers' },
  { text: 'Stock Reports', icon: <Assessment />, path: '/store-reports' },
  { text: 'Categories', icon: <BookIcon />, path: '/categories' },
  { text: 'Low Stock Alert', icon: <WarningIcon />, path: '/low-stock' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
];
// ==================== STUDENT MENU ITEMS ====================
const studentMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/portal/student' },
  { text: 'My Classes', icon: <ClassIcon />, path: '/my-classes' },
  { text: 'Timetable', icon: <Schedule />, path: '/timetable' },
  { text: 'Attendance', icon: <Assessment />, path: '/attendance/student' },
  { text: 'Results', icon: <TrendingUpIcon />, path: '/results/portal' },
  { text: 'Assignments', icon: <AssignmentIcon />, path: '/assignments' },
  { text: 'Library', icon: <LibraryBooksIcon />, path: '/library' },
  { text: 'Fees', icon: <PaymentIcon />, path: '/fees' },
  { text: 'Events', icon: <EventNote />, path: '/events' },
  { text: 'Announcements', icon: <AnnouncementIcon />, path: '/announcements' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
];

// ==================== PARENT MENU ITEMS ====================
const parentMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/portal/parent' },
  { text: 'My Children', icon: <GroupsIcon />, path: '/my-children' },
  { text: 'Attendance', icon: <Assessment />, path: '/attendance/parent' },
  { text: 'Results', icon: <TrendingUpIcon />, path: '/results/portal' },
  { text: 'Fees', icon: <PaymentIcon />, path: '/fees' },
  { text: 'Library', icon: <LibraryBooksIcon />, path: '/library' },
  { text: 'Events', icon: <EventNote />, path: '/events' },
  { text: 'Announcements', icon: <AnnouncementIcon />, path: '/announcements' },
  { text: 'Communications', icon: <Message />, path: '/communications' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
];

// ==================== LIBRARIAN MENU ITEMS ====================
const librarianMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/librarian-dashboard' },
  { text: 'Books Catalog', icon: <MenuBookIcon />, path: '/library/books' },
  { text: 'Borrowed Books', icon: <ReceiptIcon />, path: '/library/borrowed' },
  { text: 'Return Books', icon: <AssignmentIcon />, path: '/library/return' },
  { text: 'Members', icon: <People />, path: '/library/members' },
  { text: 'Reports', icon: <Assessment />, path: '/reports' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

// Add Dorm Mistress menu items
const dormMistressMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dorm-dashboard' },
  { text: 'Room Management', icon: <MeetingRoomIcon />, path: '/dorm-rooms' },
  { text: 'Bed Allocation', icon: <BedIcon />, path: '/dorm-bed-allocation' },
  { text: 'Attendance', icon: <AssignmentIcon />, path: '/dorm-attendance' },
  { text: 'Conduct Tracking', icon: <WarningIcon />, path: '/dorm-conduct' },
  { text: 'Reports', icon: <Assessment />, path: '/dorm-reports' },
];


// ==================== ACCOUNTANT MENU ITEMS ====================
const accountantMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/accountant-dashboard' },
  { text: 'Fee Structure', icon: <AttachMoney />, path: '/fee-structure' },
  { text: 'Fee Collection', icon: <PaymentIcon />, path: '/fee-collection' },
  { text: 'Fee Reports', icon: <Assessment />, path: '/fee-reports' },
  { text: 'Expenses', icon: <InventoryIcon />, path: '/expenses' },
  { text: 'Salary Management', icon: <HRPayrollIcon />, path: '/salary-management' },
  { text: 'Financial Reports', icon: <Assessment />, path: '/financial-reports' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

// ==================== TRANSPORT MANAGER MENU ITEMS ====================
const transportManagerMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/transport-dashboard' },
  { text: 'Vehicles', icon: <DirectionsBusIcon />, path: '/vehicles' },
  { text: 'Routes', icon: <Schedule />, path: '/routes' },
  { text: 'Drivers', icon: <People />, path: '/drivers' },
  { text: 'Students', icon: <School />, path: '/transport-students' },
  { text: 'Trip Reports', icon: <Assessment />, path: '/trip-reports' },
  { text: 'Maintenance', icon: <InventoryIcon />, path: '/maintenance' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

// ==================== HOSTEL MANAGER MENU ITEMS ====================
const hostelManagerMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/hostel-dashboard' },
  { text: 'Rooms', icon: <HostelIcon />, path: '/rooms' },
  { text: 'Students', icon: <School />, path: '/hostel-students' },
  { text: 'Attendance', icon: <Assessment />, path: '/hostel-attendance' },
  { text: 'Meals', icon: <RestaurantIcon />, path: '/meals' },
  { text: 'Complaints', icon: <Message />, path: '/complaints' },
  { text: 'Reports', icon: <Assessment />, path: '/reports' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

function Layout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Get menu items based on user role
  const getMenuItems = () => {
    if (!user) return [];
    
    console.log('User role for menu:', user.role);
    
    switch (user.role) {
      case 'super_admin':
        return superAdminMenuItems;
      case 'school_admin':
        return schoolAdminMenuItems;
      case 'teacher':
        return teacherMenuItems;
      case 'student':
        return studentMenuItems;
      case 'parent':
        return parentMenuItems;
      case 'librarian':
        return librarianMenuItems;
      case 'accountant':
        return accountantMenuItems;
      case 'transport_manager':
        return transportManagerMenuItems;
      case 'dorm_mistress':
        return dormMistressMenuItems;
      case 'store_keeper':
        return storeKeeperMenuItems;
      default:
        return schoolAdminMenuItems;
    }
  };

  const filteredMenuItems = getMenuItems();

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get role display name
  const getRoleDisplay = () => {
    switch (user?.role) {
      case 'super_admin': return 'Super Administrator';
      case 'school_admin': return 'School Administrator';
      case 'teacher': return 'Teacher';
      case 'student': return 'Student';
      case 'parent': return 'Parent';
      case 'librarian': return 'Librarian';
      case 'accountant': return 'Accountant';
      case 'transport_manager': return 'Transport Manager';
      case 'hostel_manager': return 'Hostel Manager';
      default: return 'User';
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
          ShuleConnect
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => navigate(item.path)}
            sx={{
              '&:hover': {
                bgcolor: 'rgba(46, 125, 50, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#2E7D32' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#2E7D32',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            ShuleConnect - {getRoleDisplay()}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {getGreeting()}, {user?.firstName || user?.name || 'User'}
            </Typography>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: '#F57C00' }}>
                {user?.firstName?.[0] || user?.name?.[0] || 'U'}
              </Avatar>
            </IconButton>
          </Box>
          <Menu 
            anchorEl={anchorEl} 
            open={Boolean(anchorEl)} 
            onClose={handleMenuClose}
            PaperProps={{
              sx: { width: 200, mt: 1 }
            }}
          >
            <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
              <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
              <ListItemText>My Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
              <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: '#D32F2F' }}>
              <ListItemIcon><Logout fontSize="small" sx={{ color: '#D32F2F' }} /></ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ 
            display: { xs: 'block', sm: 'none' }, 
            '& .MuiDrawer-paper': { 
              width: drawerWidth,
              bgcolor: '#f5f5f5'
            } 
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ 
            display: { xs: 'none', sm: 'block' }, 
            '& .MuiDrawer-paper': { 
              width: drawerWidth, 
              boxSizing: 'border-box',
              bgcolor: '#f5f5f5',
              borderRight: '1px solid #e0e0e0'
            } 
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: '#f5f5f5',
          minHeight: '100vh'
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;