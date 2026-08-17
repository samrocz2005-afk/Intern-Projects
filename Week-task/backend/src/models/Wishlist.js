const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer is required"],
      unique: true,
      index: true,
    },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

wishlistSchema.index({
  customer: 1,
});

module.exports = mongoose.model(
  "Wishlist",
  wishlistSchema
);