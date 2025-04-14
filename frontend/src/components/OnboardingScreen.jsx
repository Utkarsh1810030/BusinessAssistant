// OnboardingScreen.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import assistantImage from '../assets/assistant.jpg'

const OnboardingScreen = ({ onChoice }) => {
  const [showWelcome, setShowWelcome] = useState(true);
  console.log('aaya' , assistantImage)

  const handleChoice = (presence) => {
    onChoice(presence);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      <div className="absolute right-0 top-0 h-full w-1/2 bg-purple-100 rounded-l-full" />

      <AnimatePresence>
        {showWelcome ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="z-10 p-10 max-w-lg bg-white rounded-2xl shadow-xl text-center"
          >
            <img src={assistantImage} alt="Assistant" className="mx-auto w-32 mb-6" />
            <h1 className="text-3xl font-bold text-blue-600 mb-4">Welcome!</h1>
            <p className="text-gray-700 text-md mb-6">
              This is your first step towards unlocking the power of your personal Business Assistant.
            </p>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              onClick={() => setShowWelcome(false)}
            >
              Let’s Begin
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="presence"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="z-10 p-10 max-w-lg bg-white rounded-2xl shadow-xl text-center"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Does your business have an online presence?</h2>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleChoice(true)}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow"
              >
                Yes
              </button>
              <button
                onClick={() => handleChoice(false)}
                className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow"
              >
                No
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OnboardingScreen;