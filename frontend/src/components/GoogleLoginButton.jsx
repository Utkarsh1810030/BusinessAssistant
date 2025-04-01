import React from 'react';

const GoogleLoginButton = () => {
    const handleLogin = () => {
        window.open(
            'https://businessassistant-production.up.railway.app/auth/google',
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