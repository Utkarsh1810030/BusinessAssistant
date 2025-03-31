// middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR]: ${err.message}`);

    // Customize based on environment
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
};

module.exports = errorHandler;
