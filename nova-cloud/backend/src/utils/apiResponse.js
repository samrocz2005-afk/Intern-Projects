const successResponse = (
  res,
  data = null,
  message = "Success",
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const createdResponse = (
  res,
  data = null,
  message = "Created successfully"
) => {
  return successResponse(
    res,
    data,
    message,
    201
  );
};

const noContentResponse = (
  res,
  message = "Operation completed successfully"
) => {
  return res.status(200).json({
    success: true,
    message,
  });
};

module.exports = {
  successResponse,
  createdResponse,
  noContentResponse,
};