import React from "react";
import { Container, Typography, Button, Card, CardContent, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { motion } from "framer-motion";

function Summary() {
    const location = useLocation();
    const navigate = useNavigate();

    console.log("Location State Received:", location.state); // Debugging step

    // Ensure meeting_id is displayed whether auto-generated or manually entered
    const meeting_id = location.state?.meeting_id ?? "Auto-Generated";  // Default message for missing IDs

    const summary = location.state?.summary || "No summary available";

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([`Meeting ID: ${meeting_id}\n\nSummary:\n${summary}`], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = `Meeting_Summary_${meeting_id}.txt`;
        document.body.appendChild(element);
        element.click();
    };

    const handleGenerateAgain = () => {
        navigate("/home");
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
                        Meeting Summary
                    </Typography>

                    {/* Display Meeting ID */}
                    <Typography
                        variant="body1"
                        paragraph
                        sx={{ fontWeight: "bold", color: "#1976D2", textAlign: "center" }}
                    >
                        <strong>Meeting ID:</strong> {meeting_id}
                    </Typography>

                    {/* Summary Display Box */}
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        sx={{
                            border: "1px solid #ccc",
                            borderRadius: 2,
                            p: 2,
                            backgroundColor: "#f1f3f5",
                            minHeight: "120px",
                            textAlign: "center",
                        }}
                    >
                        <Typography variant="body2" sx={{ color: "#555" }}>
                            {summary}
                        </Typography>
                    </Box>

                    {/* Buttons: Download & Generate Again */}
                    <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<CloudDownloadIcon />}
                            onClick={handleDownload}
                            sx={{ textTransform: "none", fontWeight: "bold" }}
                        >
                            Download Summary
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleGenerateAgain}
                            sx={{ textTransform: "none", fontWeight: "bold" }}
                        >
                            Generate Again
                        </Button>
                    </Box>
                </CardContent>
            </motion.div>
        </Container>
    );
}

export default Summary;
