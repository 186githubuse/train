function createHttpError(statusCode, message, options = {}) {
  const error = new Error(message);

  error.statusCode = statusCode;
  error.expose = options.expose !== undefined ? options.expose : statusCode < 500;

  if (options.data !== undefined) {
    error.data = options.data;
  }

  return error;
}

module.exports = {
  createHttpError,
};
