/**
 * Clean extracted raw text
 * @param {string} text - Raw input text
 * @returns {string} - Cleaned text
 */
const cleanText = (text) => {
  if (!text) return '';

  return text
    // Replace duplicate spaces/tabs with single space
    .replace(/[ \t]+/g, ' ')
    // Replace duplicate newlines with a max of two newlines (retaining paragraph layout)
    .replace(/\n\s*\n/g, '\n\n')
    // Remove non-printable or corrupt control characters (except tab and newlines)
    .replace(/[^\x20-\x7E\t\n]/g, '')
    .trim();
};

module.exports = {
  cleanText
};
