const mongoose = require('mongoose');

const SourceSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
  },
  documentTitle: {
    type: String,
    required: true,
  },
  page: {
    type: Number,
    default: 1,
  },
  chunkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DocumentChunk',
  },
  score: {
    type: Number,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
});

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'assistant'],
    },
    content: {
      type: String,
      required: true,
    },
    sources: [SourceSchema],
    grounded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Message', MessageSchema);
