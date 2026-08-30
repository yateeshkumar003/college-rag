const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a display title'],
      trim: true,
    },
    originalName: {
      type: String,
      required: [true, 'Please provide original filename'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Please provide a department'],
      trim: true,
    },
    filePath: {
      type: String,
      required: [true, 'Please provide local file path'],
    },
    fileType: {
      type: String,
      required: [true, 'Please provide file extension type'],
      enum: ['pdf', 'docx'],
    },
    status: {
      type: String,
      enum: ['UPLOADED', 'PROCESSING', 'READY', 'FAILED'],
      default: 'UPLOADED',
    },
    chunkCount: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    errorMessage: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Document', DocumentSchema);
