import React from 'react';
import { motion } from "framer-motion";

const GoogleLoginButton = () => {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL

    const handleLogin = () => {
        window.open(
            `${BASE_URL}/auth/google`,
            '_self'
        );
    };

    return (
        <motion.button
        onClick={handleLogin}
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white px-8 py-2 rounded-full text-base font-semibold tracking-wide"
      >
        Get Started →
      </motion.button>
    );
};

export default GoogleLoginButton;