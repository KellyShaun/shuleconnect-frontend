import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { store } from './store';

// Layout Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

// Main Pages
import Login from './pages/Login';
import AdminDashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';

// Role-specific Dashboards
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import LibrarianDashboard from './pages/librarian/LibrarianDashboard';
import AccountantDashboard from './pages/accountant/AccountantDashboard';
import TransportManagerDashboard from './pages/transport/TransportManagerDashboard';
import HostelDashboard from './pages/hostel/HostelDashboard';

// Accountant Pages
import FeeStructure from './pages/accountant/FeeStructure';
import FeeCollection from './pages/accountant/FeeCollection';
import FinancialReports from './pages/accountant/FinancialReports';
import FeeReports from './pages/accountant/FeeReports';
import Expenses from './pages/accountant/Expenses';
import SalaryManagement from './pages/accountant/SalaryManagement';

// Library Pages
import BooksCatalog from './pages/library/BooksCatalog';
import BorrowedBooks from './pages/library/BorrowedBooks';
import LibraryMembers from './pages/library/LibraryMembers';
import ReturnBooks from './pages/library/ReturnBooks';

// Student Module
import StudentModule from './pages/students/index';

// Attendance Module
import TeacherAttendance from './pages/attendance/TeacherAttendance';
import ParentAttendanceView from './pages/attendance/ParentAttendanceView';
import AttendanceReports from './pages/attendance/AttendanceReports';

// Fees Module
import ParentFeePortal from './pages/fees/ParentFeePortal';

// Results Module
import TeacherMarksEntry from './pages/results/TeacherMarksEntry';
import GradingScaleManager from './pages/results/GradingScaleManager';
import ResultsPortal from './pages/results/ResultsPortal';
import Classes from './pages/Classes';

// Timetable Module
import TimetableManager from './pages/timetable/TimetableManager';

// Library Module
import LibraryDashboard from './pages/library/LibraryDashboard';

// Inventory Module
import InventoryDashboard from './pages/inventory/InventoryDashboard';

// HR Module
import HRDashboard from './pages/hr/HRDashboard';

// Portal Modules
import ParentDashboard from './pages/portal/ParentDashboard';
import StudentDashboard from './pages/portal/StudentDashboard';

// Messaging Modules
import ChatInterface from './pages/messaging/ChatInterface';
import Announcements from './pages/messaging/Announcements';
import MeetingBooking from './pages/messaging/MeetingBooking';

// Transport Module
import TransportDashboard from './pages/transport/TransportDashboard';

import DormMistressDashboard from './pages/dorm/DormMistressDashboard';
import RoomManagement from './pages/dorm/RoomManagement';
import BedAllocation from './pages/dorm/BedAllocation';
import DormAttendance from './pages/dorm/DormAttendance';
import ConductTracking from './pages/dorm/ConductTracking';
import DormReports from './pages/dorm/DormReports';

import StoreKeeperDashboard from './pages/store/StoreKeeperDashboard';
import InventoryManagement from './pages/store/InventoryManagement';
import Requisitions from './pages/store/Requisitions';
import StockTransactions from './pages/store/StockTransactions';
import Suppliers from './pages/store/Suppliers';
import Categories from './pages/store/Categories';
import LowStockAlert from './pages/store/LowStockAlert';
import StoreReports from './pages/store/StoreReports';

import Profile from './pages/Profile';

// System Admin Module
import SystemDashboard from './pages/admin/SystemDashboard';

// Settings & Reports
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import Communications from './pages/Communications';

const theme = createTheme({
  palette: {
    primary: { main: '#2E7D32', light: '#4CAF50', dark: '#1B5E20', contrastText: '#ffffff' },
    secondary: { main: '#F57C00', light: '#FF9800', dark: '#E65100', contrastText: '#ffffff' },
    error: { main: '#D32F2F' },
    warning: { main: '#ED6C02' },
    info: { main: '#0288D1' },
    success: { main: '#2E7D32' },
    background: { default: '#f5f5f5', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 8 } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 12 } } },
    MuiPaper: { styleOverrides: { root: { borderRadius: 12 } } },
  },
});

// Role-based dashboard redirect component
function RoleBasedDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  console.log('Redirecting user role:', user.role);
  
  switch (user.role) {
    case 'student':
      return <Navigate to="/portal/student" />;
    case 'parent':
      return <Navigate to="/portal/parent" />;
    case 'teacher':
      return <Navigate to="/teacher-dashboard" />;
    case 'librarian':
      return <Navigate to="/librarian-dashboard" />;
    case 'accountant':
      return <Navigate to="/accountant-dashboard" />;
    case 'transport_manager':
      return <Navigate to="/transport-manager-dashboard" />;
    case 'hostel_manager':
      return <Navigate to="/hostel-dashboard" />;
    case 'school_admin':
    case 'super_admin':
      return <Navigate to="/admin-dashboard" />;
    default:
      return <Navigate to="/dashboard" />;
  }
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<RoleBasedDashboard />} />
              
              {/* Admin Routes */}
              <Route path="admin-dashboard" element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              
              {/* Role-specific Dashboards */}
              <Route path="teacher-dashboard" element={<TeacherDashboard />} />
              <Route path="librarian-dashboard" element={<LibrarianDashboard />} />
              <Route path="accountant-dashboard" element={<AccountantDashboard />} />
              <Route path="transport-manager-dashboard" element={<TransportManagerDashboard />} />
              <Route path="hostel-dashboard" element={<HostelDashboard />} />
              
              {/* Accountant Routes */}
              <Route path="fee-structure" element={<FeeStructure />} />
              <Route path="fee-collection" element={<FeeCollection />} />
              <Route path="financial-reports" element={<FinancialReports />} />
              <Route path="fee-reports" element={<FeeReports />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="salary-management" element={<SalaryManagement />} />
              
              {/* Library Routes */}
              <Route path="library/books" element={<BooksCatalog />} />
              <Route path="library/borrowed" element={<BorrowedBooks />} />
              <Route path="library/members" element={<LibraryMembers />} />
              <Route path="library/return" element={<ReturnBooks />} />
              
              {/* Student Management */}
              <Route path="students/*" element={<StudentModule />} />
              <Route path="classes" element={<Classes />} />
              
              {/* Attendance Routes */}
              <Route path="attendance">
                <Route index element={<TeacherAttendance />} />
                <Route path="teacher" element={<TeacherAttendance />} />
                <Route path="parent" element={<ParentAttendanceView />} />
                <Route path="reports" element={<AttendanceReports />} />
              </Route>
              
              {/* Fees Routes */}
              <Route path="fees">
                <Route index element={<ParentFeePortal />} />
                <Route path="parent" element={<ParentFeePortal />} />
              </Route>
              
              {/* Results Routes */}
              <Route path="results">
                <Route index element={<TeacherMarksEntry />} />
                <Route path="teacher" element={<TeacherMarksEntry />} />
                <Route path="grading" element={<GradingScaleManager />} />
                <Route path="portal" element={<ResultsPortal />} />
              </Route>

              <Route path="dorm-dashboard" element={<DormMistressDashboard />} />
              <Route path="dorm-rooms" element={<RoomManagement />} />
              <Route path="dorm-bed-allocation" element={<BedAllocation />} />
              <Route path="dorm-attendance" element={<DormAttendance />} />
              <Route path="dorm-conduct" element={<ConductTracking />} />
              <Route path="dorm-reports" element={<DormReports />} />
              
              {/* Other Modules */}
              <Route path="timetable" element={<TimetableManager />} />
              <Route path="library" element={<LibraryDashboard />} />
              <Route path="inventory" element={<InventoryDashboard />} />
              <Route path="hr" element={<HRDashboard />} />
              <Route path="transport" element={<TransportDashboard />} />
              
              {/* Portal Routes */}
              <Route path="portal/student" element={<StudentDashboard />} />
              <Route path="portal/parent" element={<ParentDashboard />} />

              <Route path="profile" element={<Profile />} />
              
              {/* Messaging Routes */}
              <Route path="messaging/chat" element={<ChatInterface />} />
              <Route path="messaging/announcements" element={<Announcements />} />
              <Route path="messaging/meetings" element={<MeetingBooking />} />

              <Route path="store-dashboard" element={<StoreKeeperDashboard />} />
              <Route path="inventory" element={<InventoryManagement />} />
              <Route path="requisitions" element={<Requisitions />} />
              <Route path="stock-transactions" element={<StockTransactions />} />
              <Route path="suppliers" element={<Suppliers />} />
              <Route path="categories" element={<Categories />} />
              <Route path="low-stock" element={<LowStockAlert />} />
              <Route path="store-reports" element={<StoreReports />} />
              
              {/* System Routes */}
              <Route path="admin" element={<SystemDashboard />} />
              <Route path="settings" element={<Settings />} />
              <Route path="reports" element={<Reports />} />
              <Route path="communications" element={<Communications />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;