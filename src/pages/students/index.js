import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentList from './StudentList';
import StudentStats from './StudentStats';
import StudentProfileView from './StudentProfileView';
import StudentForm from './StudentForm';

function StudentModule() {
    return (
        <Routes>
            <Route index element={<StudentList />} />
            <Route path="list" element={<StudentList />} />
            <Route path="stats" element={<StudentStats />} />
            <Route path="profile/:id" element={<StudentProfileView />} />
            <Route path="add" element={<StudentForm />} />
            <Route path="edit/:id" element={<StudentForm />} />
        </Routes>
    );
}

export default StudentModule;