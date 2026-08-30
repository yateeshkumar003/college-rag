const mammoth = require('mammoth');

/**
 * Extract plain text from DOCX buffer
 * @param {Buffer} buffer - Raw file buffer
 * @returns {Promise<Array<{text: string, page: number}>>}
 */
const extractDocxText = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value || '';

    // Since Word documents don't have explicit pages in raw extraction,
    // we return the full content as page 1.
    return [{
      text: text.trim(),
      page: 1
    }];
  } catch (error) {
    throw new Error(`DOCX Extraction Failed: ${error.message}`);
  }
};

module.exports = {
  extractDocxText
};
