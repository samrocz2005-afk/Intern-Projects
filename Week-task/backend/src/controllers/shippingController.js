const asyncHandler = require("../utils/asyncHandler");
const shippingService = require("../services/shippingService");

const createShipment = asyncHandler(async (req, res) => {
  const shipment = await shippingService.createShipment(req.body);

  res.status(201).json({
    success: true,
    message: "Shipment created successfully",
    data: shipment,
  });
});

const getShipments = asyncHandler(async (req, res) => {
  const result = await shippingService.getShipments(req.query);

  res.status(200).json({
    success: true,
    message: "Shipments fetched successfully",
    data: result.shipments,
    pagination: result.pagination,
  });
});

const getShipmentById = asyncHandler(async (req, res) => {
  const shipment = await shippingService.getShipmentById(
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Shipment fetched successfully",
    data: shipment,
  });
});

const getShipmentByOrder = asyncHandler(async (req, res) => {
  const shipment = await shippingService.getShipmentByOrder(
    req.params.orderId
  );

  res.status(200).json({
    success: true,
    message: "Order shipment fetched successfully",
    data: shipment,
  });
});

const updateShipment = asyncHandler(async (req, res) => {
  const shipment = await shippingService.updateShipment(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Shipment updated successfully",
    data: shipment,
  });
});

const updateShipmentStatus = asyncHandler(async (req, res) => {
  const shipment = await shippingService.updateShipmentStatus(
    req.params.id,
    req.body.status
  );

  res.status(200).json({
    success: true,
    message: "Shipment status updated successfully",
    data: shipment,
  });
});

module.exports = {
  createShipment,
  getShipments,
  getShipmentById,
  getShipmentByOrder,
  updateShipment,
  updateShipmentStatus,
};