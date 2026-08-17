const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    stats: {
      totalRevenue: { type: Number, default: 0 },
      totalOrders: { type: Number, default: 0 },
      customers: { type: Number, default: 0 },
      revenueGrowth: { type: Number, default: 0 },
    },
    trends: [
      {
        month: { type: String, required: true },
        orders: { type: Number, default: 0 },
        revenue: { type: Number, default: 0 },
        growth: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Analytics", analyticsSchema);