import Cinema from "../models/Cinema.js";

/**
 * Safely escape regular expression special characters.
 */
const escapeRegex = (text = "") => {
  return String(text).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};

const cleanQueryParam = (term = "") => {
  let cleaned = String(term || "").trim();

  cleaned = cleaned.replace(
    /^\??[a-zA-Z0-9_]+=/i,
    ""
  );

  cleaned = cleaned.replace(/^\?/, "");

  return cleaned;
};

/**
 * Get All Cinemas
 * Search + City Filter + Pagination + Sorting
 */
export const getCinemas = async (query = {}) => {
  let {
    search = "",
    city = "",
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    order = "desc",
  } = query;

  search = cleanQueryParam(search);
  city = cleanQueryParam(city);

  const filter = {};

  // Search
  if (search) {
    const safeSearch = escapeRegex(search);

    filter.$or = [
      {
        name: {
          $regex: safeSearch,
          $options: "i",
        },
      },
      {
        city: {
          $regex: safeSearch,
          $options: "i",
        },
      },
      {
        state: {
          $regex: safeSearch,
          $options: "i",
        },
      },
      {
        location: {
          $regex: safeSearch,
          $options: "i",
        },
      },
    ];
  }

  // City filter
  if (
    city &&
    city.toLowerCase() !== "all"
  ) {
    const safeCity = escapeRegex(city);

    filter.city = {
      $regex: `^${safeCity}$`,
      $options: "i",
    };
  }

  const safePage = Math.max(
    Number(page) || 1,
    1
  );

  const safeLimit = Math.max(
    Number(limit) || 20,
    1
  );

  const sort = {
    [sortBy]: order === "asc" ? 1 : -1,
  };

  const skip =
    (safePage - 1) * safeLimit;

  const [cinemas, total] =
    await Promise.all([
      Cinema.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(safeLimit),

      Cinema.countDocuments(filter),
    ]);

  return {
    cinemas,
    total,
    page: safePage,
    pages:
      Math.ceil(total / safeLimit) || 0,
  };
};

/**
 * Get Cinema By ID
 */
export const getCinemaById = async (id) => {
  return await Cinema.findById(id);
};

/**
 * Create Cinema
 */
export const createCinema = async (data) => {
  const existingCinema =
    await Cinema.findOne({
      name: data.name,
      city: data.city,
    });

  if (existingCinema) {
    throw new Error("Cinema already exists.");
  }

  return await Cinema.create(data);
};

/**
 * Update Cinema
 */
export const updateCinema = async (
  id,
  data
) => {
  if (data.name && data.city) {
    const existingCinema =
      await Cinema.findOne({
        name: data.name,
        city: data.city,
        _id: { $ne: id },
      });

    if (existingCinema) {
      throw new Error(
        "Cinema already exists."
      );
    }
  }

  return await Cinema.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};

/**
 * Delete Cinema
 */
export const deleteCinema = async (id) => {
  return await Cinema.findByIdAndDelete(id);
};
