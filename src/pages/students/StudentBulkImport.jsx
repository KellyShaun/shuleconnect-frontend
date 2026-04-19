import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Alert,
    LinearProgress,
    Paper
} from '@mui/material';
import { CloudUpload as UploadIcon, Download as DownloadIcon } from '@mui/icons-material';
import api from '../../services/api';

function StudentBulkImport({ open, onClose, onSuccess }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setResult(null);
    };

    const handleUpload = async () => {
        if (!file) return;
        
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await api.post('/students/bulk-import', formData);
            setResult(response.data);
            if (response.data.successCount > 0) {
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 2000);
            }
        } catch (error) {
            setResult({ error: error.response?.data?.error || 'Import failed' });
        } finally {
            setLoading(false);
        }
    };

    const downloadTemplate = () => {
        window.location.href = '/templates/student_import_template.xlsx';
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Bulk Import Students</DialogTitle>
            <DialogContent>
                <Alert severity="info" sx={{ mb: 2 }}>
                    Download the template, fill with student data, and upload back.
                </Alert>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Button variant="outlined" startIcon={<DownloadIcon />} onClick={downloadTemplate}>
                        Download Template
                    </Button>
                    <Button variant="outlined" component="label" startIcon={<UploadIcon />}>
                        Select File
                        <input type="file" hidden accept=".xlsx,.csv" onChange={handleFileChange} />
                    </Button>
                </Box>
                
                {file && (
                    <Paper sx={{ p: 2, mb: 2 }}>
                        <Typography>Selected: {file.name}</Typography>
                    </Paper>
                )}
                
                {loading && <LinearProgress sx={{ mt: 2 }} />}
                
                {result && (
                    <Alert severity={result.error ? 'error' : 'success'} sx={{ mt: 2 }}>
                        {result.error || `${result.successCount} students imported successfully${result.errorCount ? `, ${result.errorCount} failed` : ''}`}
                    </Alert>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleUpload} disabled={!file || loading}>
                    Upload
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default StudentBulkImport;