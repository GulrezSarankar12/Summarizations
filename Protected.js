import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Protected() {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProtectedData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }

                const response = await axios.get('http://localhost:5000/protected', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMessage(response.data.message);
            } catch (error) {
                console.error('Error fetching protected data', error);
                navigate('/');
            }
        };

        fetchProtectedData();
    }, [navigate]);

    return (
        <div>
            <h2>Protected Page</h2>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Protected;
