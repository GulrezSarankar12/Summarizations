import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:5000/register', { username, email, password });
            alert('Registration successful!');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Error during registration. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            maxWidth="false"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                    backdropFilter: 'blur(15px)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    padding: '40px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    maxWidth: '450px',
                }}
            >
                <CardContent>
                    <Typography
                        variant="h5"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: 'bold', color: '#333' }}
                        component={motion.div}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Create Your Account
                    </Typography>

                    {error && <Typography color="error" align="center">{error}</Typography>}

                    <form onSubmit={handleSubmit}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <TextField
                                label="Username"
                                fullWidth
                                margin="normal"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                InputLabelProps={{ style: { color: '#555' } }}
                                sx={{ bgcolor: '#f1f3f5', borderRadius: 1 }}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <TextField
                                label="Email Address"
                                fullWidth
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                InputLabelProps={{ style: { color: '#555' } }}
                                sx={{ bgcolor: '#f1f3f5', borderRadius: 1 }}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <TextField
                                label="Password"
                                type="password"
                                fullWidth
                                margin="normal"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                InputLabelProps={{ style: { color: '#555' } }}
                                sx={{ bgcolor: '#f1f3f5', borderRadius: 1 }}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    marginTop: 2,
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    padding: '12px',
                                    bgcolor: '#1976d2',
                                    '&:hover': { bgcolor: '#125ea7' },
                                }}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                            </Button>
                        </motion.div>
                    </form>

                    <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
                        <Grid item>
                            <Button
                                variant="text"
                                onClick={() => navigate('/')}
                                sx={{ fontWeight: 'bold', color: '#1976d2', '&:hover': { color: '#125ea7' } }}
                            >
                                Already have an account? Log In
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </motion.div>
        </Container>
    );
}

export default Register;
