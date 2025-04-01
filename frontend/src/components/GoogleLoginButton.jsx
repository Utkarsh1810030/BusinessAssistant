import React from 'react';

const GoogleLoginButton = () => {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL

    const handleLogin = () => {
        window.open(
            `${BASE_URL}/auth/google`,
            '_self'
        );
    };

    return (
        <button
            onClick={handleLogin}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
        >
            Login with Google
        </button>
    );
};

export default GoogleLoginButton;