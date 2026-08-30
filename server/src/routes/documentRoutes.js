const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const env = require('../config/env');
const documentController = require('../controllers/documentController');
const protect = require('../middleware/authMiddleware');
const restrictTo = require('../middleware/roleMiddleware');
const { AppError } = require('../utils/errors');

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../', env.UPLOAD_DIR);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Prevent path traversal and naming collisions using secure random UUIDs
    const uniqueId = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueId}${ext}`);
  }
});

// Multer File filter constraints
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (!allowedExtensions.includes(ext)) {
    return cb(new AppError('INVALID_FILE_TYPE', 'Only PDF and DOCX files are allowed', 400), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024 // e.g. 10MB in bytes
  }
});

// All document management routes require logged-in users
router.use(protect);

// Upload document (POST - Admin only)
router.post('/upload', restrictTo('admin'), upload.single('file'), documentController.uploadDocument);

// Get list of documents (GET - Admin and Student)
router.get('/', documentController.getDocuments);

// Single document operations
router.get('/:id', documentController.getDocumentDetails);
router.put('/:id', restrictTo('admin'), documentController.updateMetadata);
router.delete('/:id', restrictTo('admin'), documentController.deleteDocument);

// Reprocess document parsing (POST - Admin only)
router.post('/:id/reprocess', restrictTo('admin'), documentController.reprocessDocument);

module.exports = router;
