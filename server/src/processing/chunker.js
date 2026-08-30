/**
 * Splitting text into chunks of specified sizes with overlaps
 * @param {Array<{text: string, page: number}>} pages - Extracted text page-by-page
 * @param {number} chunkSizeTokens - Target chunk size in tokens
 * @param {number} chunkOverlapTokens - Overlap size in tokens
 * @returns {Array<{text: string, page: number, chunkIndex: number}>}
 */
const chunkDocument = (pages, chunkSizeTokens = 900, chunkOverlapTokens = 120) => {
  // Approximate conversion: 1 token ≈ 4 characters
  const charLimit = chunkSizeTokens * 4;
  const overlapLimit = chunkOverlapTokens * 4;
  
  const chunks = [];
  let globalChunkIndex = 0;

  pages.forEach((pageObj) => {
    const text = pageObj.text;
    const pageNum = pageObj.page;

    // If the text on this page is shorter than the chunk limit, keep it as one chunk
    if (text.length <= charLimit) {
      if (text.trim()) {
        chunks.push({
          text: text,
          page: pageNum,
          chunkIndex: globalChunkIndex++
        });
      }
      return;
    }

    // Otherwise, split the page content with overlap
    let start = 0;
    while (start < text.length) {
      let end = start + charLimit;
      
      // If we're not at the end of the page, try to find a natural break (like space or newline)
      if (end < text.length) {
        const lastSpace = text.lastIndexOf(' ', end);
        if (lastSpace > start + charLimit * 0.7) {
          end = lastSpace;
        }
      }

      const chunkText = text.substring(start, end).trim();
      if (chunkText) {
        chunks.push({
          text: chunkText,
          page: pageNum,
          chunkIndex: globalChunkIndex++
        });
      }

      // Slide window forwards by chunk limit minus overlap
      start = end - overlapLimit;
      if (start >= text.length || end >= text.length) {
        break;
      }
    }
  });

  return chunks;
};

module.exports = {
  chunkDocument
};
