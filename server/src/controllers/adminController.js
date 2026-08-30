const Document = require('../models/Document');
const logger = require('../utils/logger');

/**
 * Fetch knowledge base status and aggregation statistics (Admin only)
 */
const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Calculate document counts by status
    const totalDocs = await Document.countDocuments({});
    const readyCount = await Document.countDocuments({ status: 'READY' });
    const processingCount = await Document.countDocuments({ status: 'PROCESSING' });
    const failedCount = await Document.countDocuments({ status: 'FAILED' });
    const uploadedCount = await Document.countDocuments({ status: 'UPLOADED' });

    // 2. Sum the chunks from all documents
    const chunkSumResult = await Document.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$chunkCount' }
        }
      }
    ]);
    const totalChunks = chunkSumResult.length > 0 ? chunkSumResult[0].total : 0;

    // 3. Retrieve the 5 most recent documents
    const recentDocs = await Document.find({})
      .sort({ createdAt: -1 })
      .limit(5);

    logger.info('[ADMIN SERVICE] Compiled dashboard statistics successfully.');

    res.status(200).json({
      success: true,
      data: {
        totalDocuments: totalDocs,
        readyCount,
        processingCount,
        failedCount,
        uploadedCount,
        totalChunks,
        recentDocuments: recentDocs
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
