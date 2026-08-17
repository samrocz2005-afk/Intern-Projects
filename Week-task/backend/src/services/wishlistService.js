const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const ApiError = require("../utils/ApiError");

const getPagination = (page = 1, limit = 10) => {
  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedLimit = Math.min(
    Math.max(Number(limit) || 10, 1),
    100
  );

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip: (parsedPage - 1) * parsedLimit,
  };
};

const getWishlists = async ({
  page = 1,
  limit = 10,
  search = "",
} = {}) => {
  const pagination = getPagination(page, limit);

  // Match stage for search query if provided
  const productMatch = search
    ? { "productDetails.name": { $regex: search, $options: "i" } }
    : {};

  const pipeline = [
    // 1. Unwind the products array so each product becomes its own row
    { $unwind: "$products" },
    
    // 2. Group by product to calculate how many customers wishlisted each product
    {
      $group: {
        _id: "$products",
        wishlistCount: { $sum: 1 },
        customers: { $addToSet: "$customer" },
      },
    },
    
    // 3. Populate product details from the Product collection
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    
    // 4. Flatten the productDetails array
    { $unwind: "$productDetails" },
    
    // 5. Apply search filter if user typed something in search box
    ...(search ? [{ $match: productMatch }] : []),
    
    // 6. Sort by most wishlisted products descending
    { $sort: { wishlistCount: -1, updatedAt: -1 } },
    
    // 7. Facet to get both total count and paginated results simultaneously
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: pagination.skip }, { $limit: pagination.limit }],
      },
    },
  ];

  const result = await Wishlist.aggregate(pipeline);
  const total = result[0]?.metadata[0]?.total || 0;
  const rawData = result[0]?.data || [];

  // Transform data to match frontend expectations
  const wishlists = rawData.map((item) => ({
    _id: item._id,
    productName: item.productDetails.name || "Unknown Product",
    category: item.productDetails.category?.name || item.productDetails.category || "General",
    price: item.productDetails.price || 0,
    wishlistCount: item.wishlistCount,
    customers: item.customers.length,
    status: item.productDetails.status || "In Stock",
    image: item.productDetails.image,
  }));

  return {
    wishlists,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
};

const getWishlistByCustomer = async (
  customerId
) => {
  const customerExists = await Customer.exists({
    _id: customerId,
  });

  if (!customerExists) {
    throw new ApiError(
      404,
      "Customer not found",
      "CUSTOMER_NOT_FOUND"
    );
  }

  let wishlist = await Wishlist.findOne({
    customer: customerId,
  })
    .populate(
      "products",
      "_id name price image stock status"
    )
    .lean();

  if (!wishlist) {
    wishlist = await Wishlist.create({
      customer: customerId,
      products: [],
    });

    wishlist = await Wishlist.findById(
      wishlist._id
    )
      .populate(
        "products",
        "_id name price image stock status"
      )
      .lean();
  }

  return wishlist;
};

const addProduct = async (
  customerId,
  productId
) => {
  const [customerExists, productExists] =
    await Promise.all([
      Customer.exists({
        _id: customerId,
      }),

      Product.exists({
        _id: productId,
      }),
    ]);

  if (!customerExists) {
    throw new ApiError(
      404,
      "Customer not found",
      "CUSTOMER_NOT_FOUND"
    );
  }

  if (!productExists) {
    throw new ApiError(
      404,
      "Product not found",
      "PRODUCT_NOT_FOUND"
    );
  }

  const wishlist =
    await Wishlist.findOneAndUpdate(
      {
        customer: customerId,
      },
      {
        $addToSet: {
          products: productId,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    )
      .populate(
        "products",
        "_id name price image stock status"
      )
      .lean();

  return wishlist;
};

const removeProduct = async (
  customerId,
  productId
) => {
  const wishlist =
    await Wishlist.findOneAndUpdate(
      {
        customer: customerId,
      },
      {
        $pull: {
          products: productId,
        },
      },
      {
        new: true,
      }
    )
      .populate(
        "products",
        "_id name price image stock status"
      )
      .lean();

  if (!wishlist) {
    throw new ApiError(
      404,
      "Wishlist not found",
      "WISHLIST_NOT_FOUND"
    );
  }

  return wishlist;
};

const clearWishlist = async (
  customerId
) => {
  const wishlist =
    await Wishlist.findOneAndUpdate(
      {
        customer: customerId,
      },
      {
        $set: {
          products: [],
        },
      },
      {
        new: true,
      }
    )
      .populate(
        "products",
        "_id name price image stock status"
      )
      .lean();

  if (!wishlist) {
    throw new ApiError(
      404,
      "Wishlist not found",
      "WISHLIST_NOT_FOUND"
    );
  }

  return wishlist;
};

module.exports = {
  getWishlists,
  getWishlistByCustomer,
  addProduct,
  removeProduct,
  clearWishlist,
};