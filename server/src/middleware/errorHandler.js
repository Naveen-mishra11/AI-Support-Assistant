// 404 handler for unmatched routes
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.originalUrl}`,
  });
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  console.error('Unhandled error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: Object.values(err.errors)
        .map((e) => e.message)
        .join(', '),
    });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format',
    });
  }

  // Duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate value entered',
    });
  }

  return res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};

module.exports = { notFound, errorHandler };