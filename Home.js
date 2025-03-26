import React, { useState } from 'react';
import { Container, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Box, TextField, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
    const [selectedOption, setSelectedOption] = useState('extractive');
    const [textAreaContent, setTextAreaContent] = useState('');
    const [meetingId, setMeetingId] = useState('');  // User entered ID (optional)
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleRadioChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleTextAreaChange = (event) => {
        setTextAreaContent(event.target.value);
    };

    const handleMeetingIdChange = (event) => {
        setMeetingId(event.target.value);
    };

    const handleGenerateSummary = async () => {
        try {
            const response = await axios.post('http://localhost:5000/get_summary', {
                text: textAreaContent,
                type: selectedOption,
                meeting_id: meetingId || null,  // Send null if user didn't enter an ID
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("API Response:", response.data);  // Debugging

            if (response.status === 200) {
                navigate('/summary', { 
                    state: { 
                        meeting_id: response.data.meeting_id,  // ✅ Ensuring correct meeting_id is passed
                        summary: response.data.summary 
                    } 
                });
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error generating summary. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Container
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            maxWidth="false"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
            }}
        >
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <Button variant="contained" color="secondary" onClick={handleLogout}>Logout</Button>
            </Box>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                    backdropFilter: "blur(15px)",
                    background: "rgba(255, 255, 255, 0.8)",
                    padding: "40px",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                    width: "100%",
                    maxWidth: "500px",
                }}
            >
                <CardContent>
                    <Typography
                        variant="h5"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: "bold", color: "#333" }}
                        component={motion.div}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Generate Summary
                    </Typography>

                    <TextField
                        label="Meeting ID (Optional)"
                        fullWidth
                        value={meetingId}
                        onChange={handleMeetingIdChange}
                        margin="normal"
                        sx={{ bgcolor: "#f5f5f5", borderRadius: 1 }}
                    />

                    <FormControl component="fieldset" sx={{ marginY: 2 }}>
                        <FormLabel component="legend" sx={{ color: "#1976D2" }}>Summarization Type</FormLabel>
                        <RadioGroup value={selectedOption} onChange={handleRadioChange} row>
                            <FormControlLabel value="extractive" control={<Radio />} label="Extractive" />
                            <FormControlLabel value="abstractive" control={<Radio />} label="Abstractive" />
                        </RadioGroup>
                    </FormControl>

                    <TextField
                        label="Enter Text to Summarize"
                        multiline
                        rows={4}
                        fullWidth
                        value={textAreaContent}
                        onChange={handleTextAreaChange}
                        sx={{ bgcolor: "#f5f5f5", borderRadius: 1 }}
                    />

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleGenerateSummary}
                            sx={{
                                marginTop: 2,
                                fontWeight: "bold",
                                textTransform: "none",
                                padding: "12px",
                                bgcolor: "#1976D2",
                                "&:hover": { bgcolor: "#125ea7" },
                            }}
                        >
                            Summarize
                        </Button>
                    </motion.div>
                </CardContent>
            </motion.div>
        </Container>
    );
}

export default Home;
