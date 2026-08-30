const mongoose = require('mongoose');

const DocumentChunkSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true,
    },
    chunkIndex: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    page: {
      type: Number,
    },
    section: {
      type: String,
      trim: true,
    },
    pineconeVectorId: {
      type: String,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only log creation date
  }
);

// Compound index to ensure uniqueness per chunk per document
DocumentChunkSchema.index({ documentId: 1, chunkIndex: 1 }, { unique: true });

module.exports = mongoose.model('DocumentChunk', DocumentChunkSchema);
