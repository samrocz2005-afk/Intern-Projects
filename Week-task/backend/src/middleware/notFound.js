const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    error: "ROUTE_NOT_FOUND",
  });
};

module.exports = notFound;