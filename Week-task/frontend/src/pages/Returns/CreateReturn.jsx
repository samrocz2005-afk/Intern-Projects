import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Typography,
  message,
} from "antd";

import {
  ArrowLeftOutlined,
  SaveOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs";
import api from "../../services/axios";

const { Title, Text } = Typography;

function CreateReturn() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  /*
   * --------------------------------------------------
   * Load Orders
   * --------------------------------------------------
   */

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setOrdersLoading(true);

        const response = await api.get("/orders", {
          params: {
            page: 1,
            limit: 100,
          },
        });

        const responseData = response?.data;

        const result =
          responseData?.data ?? responseData ?? {};

        const ordersData = Array.isArray(result)
          ? result
          : result?.orders || [];

        setOrders(
          Array.isArray(ordersData)
            ? ordersData
            : []
        );
      } catch (error) {
        message.error(
          error.response?.data?.message ||
            "Failed to load orders"
        );
      } finally {
        setOrdersLoading(false);
      }
    };

    loadOrders();
  }, []);

  /*
   * --------------------------------------------------
   * Helpers
   * --------------------------------------------------
   */

  const getOrderNumber = (order) => {
    if (!order) {
      return "N/A";
    }

    return (
      order.orderNumber ||
      order._id ||
      "N/A"
    );
  };

  const getCustomerId = (customer) => {
    if (!customer) {
      return undefined;
    }

    if (typeof customer === "string") {
      return customer;
    }

    return customer._id || customer.id;
  };

  const getCustomerName = (customer) => {
    if (!customer) {
      return "N/A";
    }

    if (typeof customer === "string") {
      return customer.trim() || "N/A";
    }

    if (customer.name?.trim()) {
      return customer.name.trim();
    }

    if (customer.fullName?.trim()) {
      return customer.fullName.trim();
    }

    const fullName = `${customer.firstName || ""} ${
      customer.lastName || ""
    }`.trim();

    return (
      fullName ||
      customer.email ||
      customer.phone ||
      "N/A"
    );
  };

  const getProductId = (product) => {
    if (!product) {
      return undefined;
    }

    if (typeof product === "string") {
      return product;
    }

    return product._id || product.id;
  };

  const getProductName = (product) => {
    if (!product) {
      return "N/A";
    }

    if (typeof product === "string") {
      return product.trim() || "N/A";
    }

    return (
      product.name ||
      product.title ||
      "N/A"
    );
  };

  /*
   * --------------------------------------------------
   * Order Selection
   * --------------------------------------------------
   */

  const handleOrderChange = (orderId) => {
    const order = orders.find(
      (item) => item?._id === orderId
    );

    setSelectedOrder(order || null);

    form.setFieldsValue({
      customerId: undefined,
      productId: undefined,
      quantity: undefined,
      amount: undefined,
    });

    if (!order) {
      return;
    }

    const customerId = getCustomerId(
      order.customer
    );

    if (customerId) {
      form.setFieldsValue({
        customerId,
      });
    }
  };

  /*
   * --------------------------------------------------
   * Product Selection
   * --------------------------------------------------
   */

  const handleProductChange = (productId) => {
    if (!selectedOrder || !productId) {
      form.setFieldsValue({
        quantity: undefined,
        amount: undefined,
      });

      return;
    }

    const selectedItem =
      selectedOrder.items?.find(
        (item) =>
          getProductId(item?.product) ===
          productId
      );

    if (!selectedItem) {
      form.setFieldsValue({
        quantity: undefined,
        amount: undefined,
      });

      return;
    }

    const orderedQuantity = Number(
      selectedItem.quantity || 0
    );

    const price = Number(
      selectedItem.price || 0
    );

    form.setFieldsValue({
      quantity: orderedQuantity,
      amount: price * orderedQuantity,
    });
  };

  /*
   * --------------------------------------------------
   * Quantity Change
   * --------------------------------------------------
   */

  const handleQuantityChange = (quantity) => {
    if (!selectedOrder) {
      return;
    }

    const productId =
      form.getFieldValue("productId");

    if (!productId || !quantity) {
      return;
    }

    const selectedItem =
      selectedOrder.items?.find(
        (item) =>
          getProductId(item?.product) ===
          productId
      );

    if (!selectedItem) {
      return;
    }

    const price = Number(
      selectedItem.price || 0
    );

    form.setFieldsValue({
      amount: price * quantity,
    });
  };

  /*
   * --------------------------------------------------
   * Submit
   * --------------------------------------------------
   */

  const handleSubmit = async (values) => {
    try {
      setSaving(true);

      const reason = values.reason?.trim();
      const notes = values.notes?.trim() || "";

      const selectedItem =
        selectedOrder?.items?.find(
          (item) =>
            getProductId(item?.product) ===
            values.productId
        );

      if (!selectedItem) {
        message.error(
          "Selected product was not found in the order"
        );
        return;
      }

      const orderedQuantity = Number(
        selectedItem.quantity || 0
      );

      if (values.quantity > orderedQuantity) {
        message.error(
          `Return quantity cannot exceed ordered quantity (${orderedQuantity})`
        );
        return;
      }

      const payload = {
        orderId: values.orderId,
        customerId: values.customerId,
        productId: values.productId,
        reason,
        type: values.type,
        quantity: Number(values.quantity),
        amount: Number(values.amount),
        notes,
      };

      await api.post("/returns", payload);

      message.success(
        "Return request created successfully"
      );

      form.resetFields();
      setSelectedOrder(null);

      navigate("/returns");
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to create return request"
      );
    } finally {
      setSaving(false);
    }
  };

  const selectedProducts =
    selectedOrder?.items || [];

  /*
   * --------------------------------------------------
   * UI
   * --------------------------------------------------
   */

  return (
    <Card>
      {/* Breadcrumb */}
      <Breadcrumbs
        items={[
          {
            label: "Returns & Refunds",
            path: "/returns",
          },
          {
            label: "Create Return",
          },
        ]}
      />

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/returns")}
          style={{
            paddingLeft: 0,
          }}
          disabled={saving}
        >
          Back to Returns
        </Button>

        <Title
          level={3}
          style={{
            marginTop: 12,
            marginBottom: 0,
          }}
        >
          Create Return
        </Title>

        <Text type="secondary">
          Create a return, refund, or exchange request.
        </Text>
      </div>

      {/* Form */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        style={{
          maxWidth: 700,
        }}
      >
        {/* Order */}
        <Form.Item
          label="Order"
          name="orderId"
          rules={[
            {
              required: true,
              message: "Please select an order",
            },
          ]}
        >
          <Select
            showSearch
            allowClear
            loading={ordersLoading}
            disabled={ordersLoading || saving}
            placeholder="Select order"
            optionFilterProp="label"
            onChange={handleOrderChange}
            options={orders
              .filter((order) => order?._id)
              .map((order) => ({
                label: getOrderNumber(order),
                value: order._id,
              }))}
          />
        </Form.Item>

        {/* Customer */}
        <Form.Item
          label="Customer"
          name="customerId"
          rules={[
            {
              required: true,
              message: "Please select a customer",
            },
          ]}
        >
          <Select
            disabled={!selectedOrder || saving}
            placeholder={
              selectedOrder
                ? "Customer"
                : "Select an order first"
            }
            options={
              selectedOrder?.customer
                ? [
                    {
                      label: getCustomerName(
                        selectedOrder.customer
                      ),
                      value: getCustomerId(
                        selectedOrder.customer
                      ),
                    },
                  ]
                : []
            }
          />
        </Form.Item>

        {/* Product */}
        <Form.Item
          label="Product"
          name="productId"
          rules={[
            {
              required: true,
              message: "Please select a product",
            },
          ]}
        >
          <Select
            showSearch
            allowClear
            disabled={!selectedOrder || saving}
            placeholder={
              selectedOrder
                ? "Select product"
                : "Select an order first"
            }
            optionFilterProp="label"
            onChange={handleProductChange}
            options={selectedProducts
              .filter((item) =>
                Boolean(
                  getProductId(item?.product)
                )
              )
              .map((item) => ({
                label: getProductName(
                  item.product
                ),
                value: getProductId(
                  item.product
                ),
              }))}
          />
        </Form.Item>

        {/* Type */}
        <Form.Item
          label="Type"
          name="type"
          initialValue="Refund"
          rules={[
            {
              required: true,
              message: "Please select return type",
            },
          ]}
        >
          <Select
            disabled={saving}
            options={[
              {
                label: "Refund",
                value: "Refund",
              },
              {
                label: "Exchange",
                value: "Exchange",
              },
              {
                label: "Return",
                value: "Return",
              },
            ]}
          />
        </Form.Item>

        {/* Reason */}
        <Form.Item
          label="Reason"
          name="reason"
          normalize={(value) =>
            typeof value === "string"
              ? value.trimStart()
              : value
          }
          rules={[
            {
              required: true,
              message: "Please enter return reason",
            },
            {
              validator: (_, value) => {
                const reason = value?.trim();

                if (!reason) {
                  return Promise.reject(
                    new Error(
                      "Reason cannot be empty or contain only spaces"
                    )
                  );
                }

                if (reason.length < 5) {
                  return Promise.reject(
                    new Error(
                      "Reason must be at least 5 characters"
                    )
                  );
                }

                if (reason.length > 250) {
                  return Promise.reject(
                    new Error(
                      "Reason cannot exceed 250 characters"
                    )
                  );
                }

                if (/\s{2,}/.test(reason)) {
                  return Promise.reject(
                    new Error(
                      "Reason cannot contain consecutive spaces"
                    )
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            maxLength={250}
            placeholder="Enter return reason"
            disabled={saving}
          />
        </Form.Item>

        {/* Quantity */}
        <Form.Item
          label="Quantity"
          name="quantity"
          dependencies={["productId"]}
          rules={[
            {
              required: true,
              message:
                "Please enter return quantity",
            },
            {
              type: "integer",
              message:
                "Quantity must be a whole number",
            },
            {
              type: "number",
              min: 1,
              message:
                "Quantity must be at least 1",
            },
            {
              validator: (_, value) => {
                if (
                  value === undefined ||
                  value === null
                ) {
                  return Promise.resolve();
                }

                const selectedProductId =
                  form.getFieldValue(
                    "productId"
                  );

                const selectedItem =
                  selectedOrder?.items?.find(
                    (item) =>
                      getProductId(
                        item?.product
                      ) === selectedProductId
                  );

                if (
                  selectedItem &&
                  value >
                    Number(
                      selectedItem.quantity || 0
                    )
                ) {
                  return Promise.reject(
                    new Error(
                      `Quantity cannot exceed ordered quantity (${selectedItem.quantity})`
                    )
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            min={1}
            precision={0}
            disabled={!selectedOrder || saving}
            placeholder="Enter quantity"
            onChange={handleQuantityChange}
            style={{
              width: "100%",
            }}
          />
        </Form.Item>

        {/* Amount */}
        <Form.Item
          label="Refund Amount"
          name="amount"
          rules={[
            {
              required: true,
              message:
                "Please enter refund amount",
            },
            {
              type: "number",
              min: 0.01,
              message:
                "Refund amount must be greater than 0",
            },
            {
              validator: (_, value) => {
                if (
                  value === undefined ||
                  value === null
                ) {
                  return Promise.resolve();
                }

                if (!Number.isFinite(value)) {
                  return Promise.reject(
                    new Error(
                      "Please enter a valid refund amount"
                    )
                  );
                }

                if (value > 99999999.99) {
                  return Promise.reject(
                    new Error(
                      "Refund amount cannot exceed ₹99,999,999.99"
                    )
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            min={0.01}
            max={99999999.99}
            step={0.01}
            precision={2}
            disabled={saving}
            placeholder="Enter refund amount"
            style={{
              width: "100%",
            }}
            prefix="₹"
          />
        </Form.Item>

        {/* Notes */}
        <Form.Item
          label="Notes"
          name="notes"
          normalize={(value) =>
            typeof value === "string"
              ? value.trimStart()
              : value
          }
          rules={[
            {
              validator: (_, value) => {
                const notes = value?.trim();

                if (!notes) {
                  return Promise.resolve();
                }

                if (notes.length > 500) {
                  return Promise.reject(
                    new Error(
                      "Notes cannot exceed 500 characters"
                    )
                  );
                }

                if (/\s{2,}/.test(notes)) {
                  return Promise.reject(
                    new Error(
                      "Notes cannot contain consecutive spaces"
                    )
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.TextArea
            rows={4}
            maxLength={500}
            showCount
            disabled={saving}
            placeholder="Enter additional notes (optional)"
          />
        </Form.Item>

        {/* Actions */}
        <Form.Item>
          <Space>
            <Button
              onClick={() => navigate("/returns")}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={saving}
            >
              Create Return
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default CreateReturn;