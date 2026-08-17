// src/services/reviewService.js
const Review = require("../models/Review");
const ApiError = require("../utils/ApiError");

const getPagination = (page = 1, limit = 10) => {
  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
  return {
    page: parsedPage,
    limit: parsedLimit,
    skip: (parsedPage - 1) * parsedLimit,
  };
};

const getReviews = async (query = {}) => {
  const { page = 1, limit = 10, status, rating } = query;
  const pagination = getPagination(page, limit);

  const filter = {};
  if (status) filter.status = status;
  if (rating) filter.rating = Number(rating);

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate("customer", "firstName lastName email")
      .populate("product", "name")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    Review.countDocuments(filter),
  ]);

  return {
    reviews,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
};

const getReviewById = async (id) => {
  const review = await Review.findById(id)
    .populate("customer", "firstName lastName email")
    .populate("product", "name")
    .lean();

  if (!review) {
    throw new ApiError(404, "Review not found", "REVIEW_NOT_FOUND");
  }

  return review;
};

const createReview = async (data) => {
  const review = await Review.create(data);
  return review.toObject();
};

const updateReview = async (id, data) => {
  const review = await Review.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  ).lean();

  if (!review) {
    throw new ApiError(404, "Review not found", "REVIEW_NOT_FOUND");
  }

  return review;
};

const updateReviewStatus = async (id, status) => {
  const review = await Review.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true, runValidators: true }
  ).lean();

  if (!review) {
    throw new ApiError(404, "Review not found", "REVIEW_NOT_FOUND");
  }

  return review;
};

const deleteReview = async (id) => {
  const review = await Review.findByIdAndDelete(id).lean();

  if (!review) {
    throw new ApiError(404, "Review not found", "REVIEW_NOT_FOUND");
  }

  return true;
};

module.exports = {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  updateReviewStatus,
  deleteReview,
};