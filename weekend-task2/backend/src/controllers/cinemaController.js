import * as cinemaService from "../services/cinemaService.js";

/**
 * GET /api/cinemas
 * Search + Pagination + Sorting
 */
export const getCinemas = async (req, res, next) => {
  try {
    const result = await cinemaService.getCinemas(req.query);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/cinemas/:id
 */
export const getCinemaById = async (req, res, next) => {
  try {
    const cinema = await cinemaService.getCinemaById(req.params.id);

    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: "Cinema not found",
      });
    }

    res.status(200).json({
      success: true,
      data: cinema,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/cinemas
 */
export const createCinema = async (req, res, next) => {
  try {
    const cinema = await cinemaService.createCinema(req.body);

    res.status(201).json({
      success: true,
      message: "Cinema created successfully",
      data: cinema,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/cinemas/:id
 */
export const updateCinema = async (req, res, next) => {
  try {
    const cinema = await cinemaService.updateCinema(
      req.params.id,
      req.body
    );

    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: "Cinema not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cinema updated successfully",
      data: cinema,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/cinemas/:id
 */
export const deleteCinema = async (req, res, next) => {
  try {
    const cinema = await cinemaService.deleteCinema(req.params.id);

    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: "Cinema not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cinema deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};