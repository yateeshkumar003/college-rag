const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const chatRoutes = require('./routes/chatRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const logger = require('./utils/logger');
const { AppError } = require('./utils/errors');

// Initialize app
const app = express();

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

// Logging middleware
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'TOO_MANY_REQUESTS',
    message: 'Too many authentication attempts, please try again after 15 minutes'
  }
});
app.use('/api/auth', authLimiter);

// Rate limiting for chat query endpoints to prevent API costs abuse
const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1055, // 10 minutes
  max: 35, // Limit each IP to 35 requests per windowMs
  message: {
    success: false,
    error: 'TOO_MANY_REQUESTS',
    message: 'Too many queries submitted. Please wait 10 minutes before asking more questions.'
  }
});

// Rate limiting for administrative document upload endpoints
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // Limit each IP to 25 file uploads per windowMs
  message: {
    success: false,
    error: 'TOO_MANY_REQUESTS',
    message: 'Too many document upload requests. Please try again after 15 minutes.'
  }
});

// Connect to Database
connectDB();

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  // Pinecone/Gemini checks will be fully connected in later phases
  const vectorDbStatus = env.PINECONE_API_KEY ? 'configured' : 'missing_api_key';
  const aiProviderStatus = env.GEMINI_API_KEY ? 'configured' : 'missing_api_key';

  res.status(200).json({
    success: true,
    server: 'running',
    database: dbStatus,
    vectorDatabase: vectorDbStatus,
    aiProvider: aiProviderStatus,
    timestamp: new Date()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', uploadLimiter, documentRoutes);
app.use('/api/chat', chatLimiter, chatRoutes);
app.use('/api/admin', adminRoutes);

// Fallback route for 404
app.use('*', (req, res, next) => {
  next(new AppError('NOT_FOUND', `Route ${req.originalUrl} not found`, 404));
});

// Error handling middleware
app.use(errorHandler);

// Start listening
const server = app.listen(env.PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

process.on('unhandledRejection', (err) => {
  logger.error(`[UNHANDLED REJECTION] Shutting down: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  logger.info('[SIGTERM] Shutting down server gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});
