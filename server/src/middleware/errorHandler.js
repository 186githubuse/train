function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.statusCode || err.status || 500;
  const message = err.expose ? err.message : status >= 500 ? 'internal_server_error' : err.message;

  if (status >= 500) {
    console.error('[server-error]', err);
  }

  return res.status(status).json({
    code: status,
    message,
    data: err.data || null,
  });
}

module.exports = {
  errorHandler,
};
