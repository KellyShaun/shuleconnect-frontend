import React from 'react';
import { useSelector } from 'react-redux';
import SuperAdminDashboard from './dashboards/SuperAdminDashboard';
import SchoolAdminDashboard from './dashboards/SchoolAdminDashboard';
import TeacherDashboard from './dashboards/TeacherDashboard';
import StudentDashboard from './dashboards/StudentDashboard';
import ParentDashboard from './dashboards/ParentDashboard';
import AccountantDashboard from './dashboards/AccountantDashboard';

function DashboardRouter() {
    const { user } = useSelector((state) => state.auth);

    if (!user) return null;

    switch (user.role) {
        case 'super_admin':
            return <SuperAdminDashboard />;
        case 'school_admin':
            return <SchoolAdminDashboard />;
        case 'teacher':
        case 'class_teacher':
            return <TeacherDashboard />;
        case 'student':
            return <StudentDashboard />;
        case 'parent':
            return <ParentDashboard />;
        case 'accountant':
            return <AccountantDashboard />;
        default:
            return <SchoolAdminDashboard />;
    }
}

export default DashboardRouter;