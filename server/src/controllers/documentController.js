const documentService = require('../services/documentService');
const { ingestDocument } = require('../services/ingestionService');
const Document = require('../models/Document');
const { AppError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * Handle multipart document uploads
 */
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('FILE_REQUIRED', 'Please select a PDF or DOCX file to upload', 400));
    }

    const { title, category, department, description } = req.body;
    if (!title || !category || !department) {
      return next(new AppError('METADATA_REQUIRED', 'Please provide title, category, and department', 400));
    }

    const originalName = req.file.originalname;
    const filePath = req.file.path;
    const fileType = originalName.endsWith('.docx') ? 'docx' : 'pdf';

    // Create the document record in database
    const doc = await Document.create({
      title,
      originalName,
      description,
      category,
      department,
      filePath,
      fileType,
      status: 'UPLOADED',
      uploadedBy: req.user._id
    });

    logger.info(`[CONTROLLER] Document uploaded. Starting ingestion pipeline in background for: ${title}`);
    
    // Trigger extraction pipeline asynchronously in background (non-blocking)
    ingestDocument(doc._id);

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully. Processing started in background.',
      data: doc
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get all documents (Admin only, support search/filter)
 */
const getDocuments = async (req, res, next) => {
  try {
    const filters = {
      search: req.query.search,
      category: req.query.category,
      department: req.query.department,
      status: req.query.status
    };

    const docs = await documentService.getDocumentsList(filters);

    res.status(200).json({
      success: true,
      count: docs.length,
      data: docs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single document details
 */
const getDocumentDetails = async (req, res, next) => {
  try {
    const doc = await documentService.getDocument(req.params.id);
    res.status(200).json({
      success: true,
      data: doc
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update document tags metadata
 */
const updateMetadata = async (req, res, next) => {
  try {
    const doc = await documentService.updateDocumentMetadata(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Metadata updated successfully',
      data: doc
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a document and its references
 */
const deleteDocument = async (req, res, next) => {
  try {
    await documentService.deleteDocument(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Document and chunk database records deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reprocess a document text extraction
 */
const reprocessDocument = async (req, res, next) => {
  try {
    const doc = await documentService.reprocessDocument(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Reprocessing started in background',
      data: doc
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentDetails,
  updateMetadata,
  deleteDocument,
  reprocessDocument
};
