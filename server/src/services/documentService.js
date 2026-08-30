const fs = require('fs');
const Document = require('../models/Document');
const DocumentChunk = require('../models/DocumentChunk');
const { ingestDocument } = require('./ingestionService');
const { AppError, DOCUMENT_NOT_FOUND } = require('../utils/errors');
const logger = require('../utils/logger');
const { deleteVectorsByDocumentId } = require('./vectorService');

/**
 * Fetch documents list with query filters
 */
const getDocumentsList = async (filters = {}) => {
  const query = {};
  
  if (filters.search) {
    query.title = { $regex: filters.search, $options: 'i' };
  }
  if (filters.category) {
    query.category = filters.category;
  }
  if (filters.department) {
    query.department = filters.department;
  }
  if (filters.status) {
    query.status = filters.status;
  }

  return await Document.find(query).sort({ createdAt: -1 });
};

/**
 * Fetch a single document record details
 */
const getDocument = async (id) => {
  const doc = await Document.findById(id);
  if (!doc) {
    throw new AppError(DOCUMENT_NOT_FOUND, 'Document not found', 404);
  }
  return doc;
};

/**
 * Update document metadata descriptor fields
 */
const updateDocumentMetadata = async (id, updates) => {
  const { title, description, category, department } = updates;
  const doc = await Document.findById(id);
  if (!doc) {
    throw new AppError(DOCUMENT_NOT_FOUND, 'Document not found', 404);
  }

  if (title) doc.title = title;
  if (description !== undefined) doc.description = description;
  if (category) doc.category = category;
  if (department) doc.department = department;

  return await doc.save();
};

/**
 * Delete a document from local storage and DB chunk models
 */
const deleteDocument = async (id) => {
  const doc = await Document.findById(id);
  if (!doc) {
    throw new AppError(DOCUMENT_NOT_FOUND, 'Document not found', 404);
  }

  logger.info(`[DOCUMENT SERVICE] Deleting document: ${doc.title} (${doc.originalName})`);

  // 1. Delete actual file from disk if it exists
  if (fs.existsSync(doc.filePath)) {
    try {
      fs.unlinkSync(doc.filePath);
    } catch (err) {
      logger.error(`[STORAGE ERROR] Failed to delete file on disk at ${doc.filePath}: ${err.message}`);
    }
  }

  // 2. Cascade delete chunk records from MongoDB
  await DocumentChunk.deleteMany({ documentId: doc._id });

  // 3. Delete vectors from Pinecone
  await deleteVectorsByDocumentId(doc._id);

  // 4. Delete document record itself
  await Document.findByIdAndDelete(doc._id);

  return { success: true };
};

/**
 * Force re-ingestion of a document
 */
const reprocessDocument = async (id) => {
  const doc = await Document.findById(id);
  if (!doc) {
    throw new AppError(DOCUMENT_NOT_FOUND, 'Document not found to reprocess', 404);
  }

  doc.status = 'UPLOADED';
  doc.errorMessage = undefined;
  await doc.save();

  // Trigger ingestion asynchronously (non-blocking)
  ingestDocument(doc._id);

  return doc;
};

module.exports = {
  getDocumentsList,
  getDocument,
  updateDocumentMetadata,
  deleteDocument,
  reprocessDocument
};
