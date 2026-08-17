import React, { useState } from "react";

import {
  Card,
  Typography,
  Button,
  Space,
  InputNumber,
  message,
} from "antd";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs";
import api from "../../services/axios";

const { Title, Paragraph } = Typography;

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state?.product;

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!product) {
    return (
      <>
        <Breadcrumbs />

        <Card>
          <Paragraph>
            No product selected for checkout.
          </Paragraph>

          <Button
            type="primary"
            onClick={() => navigate("/products")}
          >
            Back to Products
          </Button>
        </Card>
      </>
    );
  }

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const customerId =
        storedUser?._id || storedUser?.id;

      if (!customerId) {
        message.error(
          "Customer information not found. Please log in again."
        );

        navigate("/login");
        return;
      }

      const itemSubtotal =
        product.price * quantity;

      const customerName =
        storedUser.name ||
        storedUser.firstName ||
        "Customer";

      const orderPayload = {
        name: product.name,

        subtotal: itemSubtotal,

        total: itemSubtotal,

        discount: 0,

        shippingCost: 0,

        customer: customerId,

        items: [
          {
            product: product._id,
            name: product.name,
            quantity,
            price: product.price,
            subtotal: itemSubtotal,
          },
        ],

        paymentMethod: "UPI",

        shippingAddress: {
          name: customerName,
          phone:
            storedUser.phone ||
            "9999999999",
          addressLine1: "123 Main St",
          city: "Sample City",
          state: "Sample State",
          postalCode: "123456",
          country: "India",
        },
      };

      const response = await api.post(
        "/orders",
        orderPayload
      );

      if (
        response.status === 201 ||
        response.data?.success
      ) {
        message.success(
          "Order placed successfully! Stock updated."
        );

        navigate("/orders/all-orders");
      } else {
        message.error(
          "Failed to place order."
        );
      }
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Something went wrong during checkout."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Global breadcrumb reads /orders/checkout */}
      <Breadcrumbs />

      <Card>
        <Title level={3}>
          Checkout
        </Title>

        <Paragraph>
          <strong>Product:</strong>{" "}
          {product.name}
        </Paragraph>

        <Paragraph>
          <strong>Price:</strong>{" "}
          ₹
          {Number(product.price || 0).toLocaleString(
            "en-IN"
          )}
        </Paragraph>

        <Paragraph>
          <strong>Available Stock:</strong>{" "}
          {product.stock}
        </Paragraph>

        <Space
          direction="vertical"
          size="large"
          style={{
            width: "100%",
            marginTop: 16,
          }}
        >
          <div>
            <span
              style={{
                marginRight: 12,
              }}
            >
              Quantity:
            </span>

            <InputNumber
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(value) =>
                setQuantity(value || 1)
              }
            />
          </div>

          <Paragraph>
            <strong>
              Total Amount:
            </strong>{" "}
            ₹
            {Number(
              product.price * quantity
            ).toLocaleString("en-IN")}
          </Paragraph>

          <Space>
            <Button
              type="primary"
              loading={loading}
              onClick={handlePlaceOrder}
            >
              Confirm & Place Order
            </Button>

            <Button
              onClick={() =>
                navigate("/products/all-products")
              }
            >
              Cancel
            </Button>
          </Space>
        </Space>
      </Card>
    </>
  );
}

export default Checkout;