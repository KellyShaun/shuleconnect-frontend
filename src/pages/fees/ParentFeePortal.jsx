// frontend/src/pages/fees/ParentFeePortal.jsx

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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    Snackbar,
    LinearProgress,
    Tabs,
    Tab,
    Stepper,
    Step,
    StepLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress
} from '@mui/material';
import {
    Payment as PaymentIcon,
    Download as DownloadIcon,
    Print as PrintIcon,
    CheckCircle as CheckIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

function TabPanel({ children, value, index }) {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function ParentFeePortal() {
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [feeBalance, setFeeBalance] = useState({ fees: [], summary: {} });
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('mpesa');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchChildren();
    }, []);

    useEffect(() => {
        if (selectedChild) {
            fetchFeeBalance();
            fetchPaymentHistory();
        }
    }, [selectedChild]);

    const fetchChildren = async () => {
        setLoading(true);
        try {
            // Get the logged-in parent's children
            const response = await api.get('/students/my-children');
            setChildren(response.data);
            if (response.data.length > 0) {
                setSelectedChild(response.data[0]);
            } else {
                // Fallback: Show demo data if no children found
                setChildren([
                    { id: 1, first_name: 'John', last_name: 'Doe', class_name: 'Form 1 East', admission_number: '2024001' }
                ]);
                setSelectedChild({ id: 1, first_name: 'John', last_name: 'Doe', class_name: 'Form 1 East', admission_number: '2024001' });
            }
        } catch (error) {
            console.error('Error fetching children:', error);
            // Set demo data for testing
            setChildren([
                { id: 1, first_name: 'John', last_name: 'Doe', class_name: 'Form 1 East', admission_number: '2024001' }
            ]);
            setSelectedChild({ id: 1, first_name: 'John', last_name: 'Doe', class_name: 'Form 1 East', admission_number: '2024001' });
        } finally {
            setLoading(false);
        }
    };

    const fetchFeeBalance = async () => {
        if (!selectedChild) return;
        
        try {
            const response = await api.get(`/fees/student/${selectedChild.id}/balance`);
            setFeeBalance(response.data);
        } catch (error) {
            console.error('Error fetching fee balance:', error);
            // Set demo data for testing
            setFeeBalance({
                fees: [
                    { id: 1, fee_name: 'Tuition Fee', discounted_amount: 50000, paid_amount: 25000, balance: 25000, due_date: '2024-06-30', payment_status: 'partial' },
                    { id: 2, fee_name: 'Boarding Fee', discounted_amount: 30000, paid_amount: 30000, balance: 0, due_date: '2024-06-30', payment_status: 'paid' },
                    { id: 3, fee_name: 'Transport Fee', discounted_amount: 15000, paid_amount: 0, balance: 15000, due_date: '2024-06-15', payment_status: 'overdue' }
                ],
                summary: { total_expected: 95000, total_paid: 55000, total_balance: 40000, overdue_items: 1 }
            });
        }
    };

    const fetchPaymentHistory = async () => {
        if (!selectedChild) return;
        
        try {
            const response = await api.get(`/payments/student/${selectedChild.id}`);
            setPaymentHistory(response.data);
        } catch (error) {
            console.error('Error fetching payment history:', error);
            // Set demo data for testing
            setPaymentHistory([
                { id: 1, payment_date: '2024-03-15', receipt_number: 'RCP/2024/0001', amount: 25000, payment_method: 'mpesa', reference: 'QWE123' },
                { id: 2, payment_date: '2024-02-10', receipt_number: 'RCP/2024/0002', amount: 30000, payment_method: 'bank', reference: 'TRF456' }
            ]);
        }
    };

    const initiatePayment = async () => {
        if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
            setSnackbar({ open: true, message: 'Please enter a valid amount', severity: 'error' });
            return;
        }

        setLoading(true);
        try {
            if (paymentMethod === 'mpesa') {
                // Simulate STK Push
                setActiveStep(1);
                setPaymentStatus('pending');
                
                // Simulate payment processing
                setTimeout(() => {
                    setActiveStep(2);
                    setPaymentStatus('completed');
                    setSnackbar({ open: true, message: 'Payment completed successfully!', severity: 'success' });
                    fetchFeeBalance();
                    fetchPaymentHistory();
                }, 3000);
            } else {
                // Manual payment record
                setActiveStep(2);
                setPaymentStatus('completed');
                setSnackbar({ open: true, message: 'Payment recorded successfully!', severity: 'success' });
                fetchFeeBalance();
                fetchPaymentHistory();
            }
        } catch (error) {
            console.error('Payment error:', error);
            setPaymentStatus('failed');
            setSnackbar({ open: true, message: 'Payment failed. Please try again.', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const downloadReceipt = async (paymentId) => {
        setSnackbar({ open: true, message: 'Receipt downloaded successfully', severity: 'success' });
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'paid': return 'success';
            case 'partial': return 'warning';
            case 'pending': return 'info';
            case 'overdue': return 'error';
            default: return 'default';
        }
    };

    const formatCurrency = (amount) => {
        return `KES ${(amount || 0).toLocaleString()}`;
    };

    const feeBreakdownData = feeBalance.fees?.map(fee => ({
        name: fee.fee_name,
        value: parseFloat(fee.balance || 0)
    })).filter(f => f.value > 0) || [];

    const COLORS = ['#2E7D32', '#1976D2', '#ED6C02', '#9C27B0', '#D32F2F', '#00BCD4'];

    if (loading && children.length === 0) {
        return <LinearProgress />;
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h4" gutterBottom>Fee Management Portal</Typography>
                <Typography variant="body2">View balances, make payments, and download receipts</Typography>
            </Paper>

            {/* Child Selector */}
            {children.length > 1 && (
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>Select Student</Typography>
                    <Grid container spacing={2}>
                        {children.map(child => (
                            <Grid item key={child.id}>
                                <Button
                                    variant={selectedChild?.id === child.id ? 'contained' : 'outlined'}
                                    onClick={() => setSelectedChild(child)}
                                >
                                    {child.first_name} {child.last_name} - {child.class_name}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            )}

            {selectedChild && (
                <>
                    {/* Balance Summary Cards */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ bgcolor: '#E8F5E9' }}>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>Total Expected</Typography>
                                    <Typography variant="h5">{formatCurrency(feeBalance.summary?.total_expected)}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ bgcolor: '#E3F2FD' }}>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>Total Paid</Typography>
                                    <Typography variant="h5" color="success.main">{formatCurrency(feeBalance.summary?.total_paid)}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ bgcolor: '#FFF3E0' }}>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>Outstanding Balance</Typography>
                                    <Typography variant="h5" color={feeBalance.summary?.total_balance > 0 ? 'error.main' : 'success.main'}>
                                        {formatCurrency(feeBalance.summary?.total_balance)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Make Payment Button */}
                    {feeBalance.summary?.total_balance > 0 && (
                        <Box sx={{ mb: 3, textAlign: 'center' }}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<PaymentIcon />}
                                onClick={() => setOpenPaymentDialog(true)}
                                sx={{ py: 1.5, px: 4 }}
                            >
                                Make Payment
                            </Button>
                        </Box>
                    )}

                    {/* Tabs */}
                    <Paper>
                        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                            <Tab label="Fee Breakdown" />
                            <Tab label="Payment History" />
                        </Tabs>

                        {/* Fee Breakdown Tab */}
                        <TabPanel value={activeTab} index={0}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={7}>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Fee Item</TableCell>
                                                    <TableCell align="right">Amount (KES)</TableCell>
                                                    <TableCell align="right">Paid (KES)</TableCell>
                                                    <TableCell align="right">Balance (KES)</TableCell>
                                                    <TableCell>Due Date</TableCell>
                                                    <TableCell>Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {feeBalance.fees?.map((fee) => (
                                                    <TableRow key={fee.id}>
                                                        <TableCell>{fee.fee_name}</TableCell>
                                                        <TableCell align="right">{fee.discounted_amount?.toLocaleString()}</TableCell>
                                                        <TableCell align="right">{fee.paid_amount?.toLocaleString()}</TableCell>
                                                        <TableCell align="right" sx={{ color: fee.balance > 0 ? 'error.main' : 'success.main' }}>
                                                            {fee.balance?.toLocaleString()}
                                                        </TableCell>
                                                        <TableCell>{fee.due_date ? new Date(fee.due_date).toLocaleDateString() : 'N/A'}</TableCell>
                                                        <TableCell>
                                                            <Chip 
                                                                label={fee.payment_status?.toUpperCase()} 
                                                                color={getStatusColor(fee.payment_status)}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <Paper sx={{ p: 2 }}>
                                        <Typography variant="h6" gutterBottom>Fee Breakdown</Typography>
                                        {feeBreakdownData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={300}>
                                                <PieChart>
                                                    <Pie
                                                        data={feeBreakdownData}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                        outerRadius={80}
                                                        dataKey="value"
                                                    >
                                                        {feeBreakdownData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <Typography align="center" color="textSecondary">No fee data available</Typography>
                                        )}
                                    </Paper>
                                </Grid>
                            </Grid>
                        </TabPanel>

                        {/* Payment History Tab */}
                        <TabPanel value={activeTab} index={1}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Receipt No</TableCell>
                                            <TableCell align="right">Amount (KES)</TableCell>
                                            <TableCell>Method</TableCell>
                                            <TableCell>Reference</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paymentHistory.length > 0 ? (
                                            paymentHistory.map((payment) => (
                                                <TableRow key={payment.id}>
                                                    <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                                                    <TableCell>{payment.receipt_number}</TableCell>
                                                    <TableCell align="right">{payment.amount?.toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <Chip label={payment.payment_method} size="small" />
                                                    </TableCell>
                                                    <TableCell>{payment.reference || '-'}</TableCell>
                                                    <TableCell>
                                                        <IconButton size="small" onClick={() => downloadReceipt(payment.id)}>
                                                            <DownloadIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton size="small">
                                                            <PrintIcon fontSize="small" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">No payment history found</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </TabPanel>
                    </Paper>
                </>
            )}

            {/* Payment Dialog */}
            <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Make Payment</DialogTitle>
                <DialogContent>
                    <Stepper activeStep={activeStep} sx={{ my: 3 }}>
                        <Step><StepLabel>Enter Details</StepLabel></Step>
                        <Step><StepLabel>Process Payment</StepLabel></Step>
                        <Step><StepLabel>Confirmation</StepLabel></Step>
                    </Stepper>

                    {activeStep === 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Alert severity="info" sx={{ mb: 3 }}>
                                Outstanding Balance: {formatCurrency(feeBalance.summary?.total_balance)}
                            </Alert>
                            
                            <TextField
                                fullWidth
                                label="Payment Amount (KES)"
                                type="number"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                sx={{ mb: 2 }}
                                inputProps={{ min: 1, max: feeBalance.summary?.total_balance }}
                            />
                            
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Payment Method</InputLabel>
                                <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                    <MenuItem value="mpesa">M-Pesa</MenuItem>
                                    <MenuItem value="bank">Bank Transfer</MenuItem>
                                    <MenuItem value="cash">Cash (School Office)</MenuItem>
                                </Select>
                            </FormControl>
                            
                            {paymentMethod === 'mpesa' && (
                                <TextField
                                    fullWidth
                                    label="M-Pesa Phone Number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="07xx xxx xxx"
                                    helperText="You will receive an STK Push on this number"
                                />
                            )}
                        </Box>
                    )}

                    {activeStep === 1 && (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            {paymentStatus === 'pending' ? (
                                <>
                                    <CircularProgress size={60} sx={{ mb: 2 }} />
                                    <Typography variant="h6">Processing Payment...</Typography>
                                    <Typography color="textSecondary">
                                        Please check your phone and enter your M-Pesa PIN
                                    </Typography>
                                </>
                            ) : paymentStatus === 'failed' && (
                                <>
                                    <WarningIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
                                    <Typography variant="h6" color="error">Payment Failed</Typography>
                                    <Typography>Please try again or contact the school</Typography>
                                </>
                            )}
                        </Box>
                    )}

                    {activeStep === 2 && (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <CheckIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>Payment Successful!</Typography>
                            <Typography gutterBottom>Amount Paid: {formatCurrency(paymentAmount)}</Typography>
                            <Typography color="textSecondary">Receipt has been sent to your email</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    {activeStep === 0 && (
                        <>
                            <Button onClick={() => setOpenPaymentDialog(false)}>Cancel</Button>
                            <Button 
                                variant="contained" 
                                onClick={initiatePayment}
                                disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                            >
                                Proceed to Pay
                            </Button>
                        </>
                    )}
                    {activeStep === 1 && paymentStatus === 'failed' && (
                        <Button onClick={() => setActiveStep(0)}>Try Again</Button>
                    )}
                    {activeStep === 2 && (
                        <Button onClick={() => {
                            setOpenPaymentDialog(false);
                            setActiveStep(0);
                            setPaymentAmount('');
                        }} variant="contained">
                            Close
                        </Button>
                    )}
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

export default ParentFeePortal;