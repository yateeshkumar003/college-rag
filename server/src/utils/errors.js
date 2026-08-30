class AppError extends Error {
  constructor(errorCode, message, statusCode) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  AppError,
  // Error codes list
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  FORBIDDEN: 'FORBIDDEN',
  DOCUMENT_NOT_FOUND: 'DOCUMENT_NOT_FOUND',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  DOCUMENT_PROCESSING_FAILED: 'DOCUMENT_PROCESSING_FAILED',
  VECTOR_SEARCH_FAILED: 'VECTOR_SEARCH_FAILED',
  EMBEDDING_FAILED: 'EMBEDDING_FAILED',
  LLM_FAILED: 'LLM_FAILED',
  NO_RELEVANT_INFORMATION: 'NO_RELEVANT_INFORMATION',
  CONVERSATION_NOT_FOUND: 'CONVERSATION_NOT_FOUND',
};
