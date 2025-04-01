// pages/LandingPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GoogleLoginButton from '../components/GoogleLoginButton';

const LandingPage = () => {
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_BACKEND_URL
    console.log(BASE_URL)

    useEffect(() => {
        axios
            .get(`${BASE_URL}/auth/me`, {
                withCredentials: true,
            })
            .then((res) => {
                if (res.data) {
                    navigate('/dashboard');
                }
            })
            .catch(() => {
                // user not logged in – do nothing
            });
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6 text-gray-900">
            <h1 className="text-4xl font-bold mb-4">Business Assistant</h1>
            <p className="text-lg text-gray-600 mb-8">Your AI-powered business growth partner</p>
            <GoogleLoginButton />
        </div>
    );
};

export default LandingPage;
