const { PDFParse } = require('pdf-parse');

/**
 * Extract text from PDF buffer page by page
 * @param {Buffer} buffer - Raw file buffer
 * @returns {Promise<Array<{text: string, page: number}>>}
 */
const extractPdfText = async (buffer) => {
  try {
    // pdf-parse v2.4.5 requires binary data as a Uint8Array
    const uint8Array = new Uint8Array(buffer);
    const p = new PDFParse(uint8Array);
    
    // getText returns an object containing 'pages' array of format [{text, num}]
    const res = await p.getText();

    return res.pages.map((pObj) => ({
      text: pObj.text || '',
      page: pObj.num
    }));
  } catch (error) {
    throw new Error(`PDF Extraction Failed: ${error.message}`);
  }
};

module.exports = {
  extractPdfText
};
