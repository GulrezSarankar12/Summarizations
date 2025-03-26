import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

function Auth({ isRegister }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isRegister ? 'register' : 'login';
            const payload = isRegister ? { username, email, password } : { email, password };
            const response = await axios.post(`http://localhost:5000/${endpoint}`, payload);
    
            if (!isRegister) {
                const token = response.data.access_token;
                localStorage.setItem('token', token);
                navigate('/home');
            } else {
                alert('Registration successful!');
                navigate('/login');
            }
        } catch (err) {
            setError('Error during authentication. Please try again.');
        }
    };

    return (
        <Container 
            component="main"
            maxWidth={false}
            sx={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                background: 'linear-gradient(to right, #f0f2f5, #d9e2ec)', 
                height: '100vh',
                padding: '20px',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Background Blur Effect */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 1.5 }}
                style={{
                    position: 'absolute',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.5), rgba(255,255,255,0.2))',
                    borderRadius: '50%',
                    top: '20%',
                    left: '10%',
                    filter: 'blur(100px)'
                }}
            />
            
            {/* Auth Card with Glassmorphism */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ width: '100%', maxWidth: 450 }}
            >
                <Card 
                    sx={{
                        padding: 4, 
                        boxShadow: '0px 15px 40px rgba(0, 0, 0, 0.15)', 
                        width: '100%', borderRadius: 3, 
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(20px)',
                        transition: '0.3s ease-in-out',
                        '&:hover': { transform: 'scale(1.02)', boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.2)' }
                    }}
                >
                    <CardContent>
                        {/* Title Animation */}
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Typography 
                                variant="h4" align="center" gutterBottom 
                                sx={{ fontWeight: 'bold', color: '#333' }}
                            >
                                {isRegister ? 'Create Your Account' : 'Welcome Back'}
                            </Typography>
                        </motion.div>

                        {error && <Typography color="error" align="center">{error}</Typography>}

                        {/* Form Fields with Animation */}
                        <motion.form 
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            {isRegister && (
                                <TextField 
                                    label="Username" fullWidth margin="normal" 
                                    value={username} onChange={(e) => setUsername(e.target.value)} required 
                                    sx={{ backgroundColor: '#f9fafb', borderRadius: 2 }} 
                                />
                            )}
                            <TextField 
                                label="Email Address" fullWidth margin="normal" 
                                value={email} onChange={(e) => setEmail(e.target.value)} required 
                                sx={{ backgroundColor: '#f9fafb', borderRadius: 2 }} 
                            />
                            <TextField 
                                label="Password" type="password" fullWidth margin="normal" 
                                value={password} onChange={(e) => setPassword(e.target.value)} required 
                                sx={{ backgroundColor: '#f9fafb', borderRadius: 2 }} 
                            />
                            
                            {/* Animated Submit Button */}
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button 
                                    type="submit" fullWidth variant="contained" 
                                    sx={{ 
                                        marginTop: 2, fontWeight: 'bold', textTransform: 'none', 
                                        padding: '12px', background: '#007bff', 
                                        color: '#fff', transition: '0.3s',
                                        '&:hover': { background: '#0056b3' }
                                    }}
                                >
                                    {isRegister ? 'Sign Up' : 'Log In'}
                                </Button>
                            </motion.div>
                        </motion.form>

                        {/* Link to Toggle Between Login & Register */}
                        <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
                            <Grid item>
                                <Button 
                                    variant="text" onClick={() => navigate(isRegister ? '/login' : '/register')} 
                                    sx={{ fontWeight: 'bold', color: '#007bff' }}
                                >
                                    {isRegister ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </motion.div>
        </Container>
    );
}

export default Auth;
