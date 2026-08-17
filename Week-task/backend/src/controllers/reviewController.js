const asyncHandler = require("../utils/asyncHandler");
const reviewService = require("../services/reviewService");

const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(req.body);

  res.status(201).json({
    success: true,
    message: "Review created successfully",
    data: review,
  });
});

const getReviews = asyncHandler(async (req, res) => {
  const result = await reviewService.getReviews(req.query);

  res.status(200).json({
    success: true,
    message: "Reviews fetched successfully",
    data: result.reviews,
    pagination: result.pagination,
  });
});

const getReviewById = asyncHandler(async (req, res) => {
  const review = await reviewService.getReviewById(req.params.id);

  res.status(200).json({
    success: true,
    message: "Review fetched successfully",
    data: review,
  });
});

const updateReview = asyncHandler(async (req, res) => {
  const review = await reviewService.updateReview(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Review updated successfully",
    data: review,
  });
});

const approveReview = asyncHandler(async (req, res) => {
  const review = await reviewService.updateReviewStatus(
    req.params.id,
    "Approved"
  );

  res.status(200).json({
    success: true,
    message: "Review approved successfully",
    data: review,
  });
});

const rejectReview = asyncHandler(async (req, res) => {
  const review = await reviewService.updateReviewStatus(
    req.params.id,
    "Rejected"
  );

  res.status(200).json({
    success: true,
    message: "Review rejected successfully",
    data: review,
  });
});

const deleteReview = asyncHandler(async (req, res) => {
  await reviewService.deleteReview(req.params.id);

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
    data: null,
  });
});

module.exports = {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  approveReview,
  rejectReview,
  deleteReview,
};