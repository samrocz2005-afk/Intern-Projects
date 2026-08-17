import { Modal, Form, Input, InputNumber, Select } from "antd";
import {
  ShopOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  FlagOutlined,
  AppstoreOutlined,
  TeamOutlined,
  PhoneOutlined,
  PictureOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";

const { Option } = Select;

// Validation rule for cinema name / location
const standardTextValidation = {
  pattern: /^[a-zA-Z0-9\s.,'&/()"\u00C0-\u024F-]+$/,
  message:
    "Only letters, numbers, spaces, and standard punctuation (.,'/&-) are allowed",
};

// State and city options
const stateCityMap = {
  Karnataka: [
    "Bangalore",
    "Mysore",
    "Mangalore",
    "Hubli",
    "Belgaum",
  ],
  Maharashtra: [
    "Mumbai",
    "Pune",
    "Nagpur",
    "Nashik",
    "Aurangabad",
  ],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Salem",
    "Trichy",
  ],
  Telangana: [
    "Hyderabad",
    "Warangal",
    "Nizamabad",
  ],
  Delhi: [
    "New Delhi",
    "North Delhi",
    "South Delhi",
    "West Delhi",
  ],
};

function AddEditCinemaModal({
  open,
  onCancel,
  onSubmit,
  cinema,
  loading = false,
}) {
  const [form] = Form.useForm();

  const [imageUrl, setImageUrl] = useState("");
  const [selectedState, setSelectedState] = useState("");

  // =========================
  // Set / Reset Form
  // =========================
  useEffect(() => {
    if (!open) {
      return;
    }

    if (cinema) {
      form.setFieldsValue({
        name: cinema.name || "",
        location: cinema.location || "",
        city: cinema.city || "",
        state: cinema.state || "",
        screens: cinema.screens || 1,
        capacity: cinema.capacity || 100,
        contactNumber: cinema.contactNumber || "",
        image: cinema.image || "",
        status: cinema.status || "Active",
      });

      setImageUrl(cinema.image || "");
      setSelectedState(cinema.state || "");
    } else {
      form.resetFields();

      form.setFieldsValue({
        status: "Active",
        screens: 1,
        capacity: 100,
      });

      setImageUrl("");
      setSelectedState("");
    }
  }, [open, cinema, form]);

  // =========================
  // Trim Input Values
  // =========================
  const handleBlur = (fieldName) => {
    const value = form.getFieldValue(fieldName);

    if (typeof value === "string") {
      const cleaned = value.trim().replace(/\s+/g, " ");

      form.setFieldValue(fieldName, cleaned);

      if (fieldName === "image") {
        setImageUrl(cleaned);
      }
    }
  };

  // =========================
  // Form Submit
  // =========================
  const handleFinish = async (values) => {
    console.log("FORM VALIDATED");
    console.log("Form values:", values);

    const trimmedValues = Object.entries(values).reduce(
      (acc, [key, value]) => {
        acc[key] =
          typeof value === "string"
            ? value.trim().replace(/\s+/g, " ")
            : value;

        return acc;
      },
      {}
    );

    console.log("Sending to parent:", trimmedValues);

    await onSubmit({
      ...trimmedValues,
      ...(cinema?._id ? { _id: cinema._id } : {}),
    });
  };

  // =========================
  // Validation Failed
  // =========================
  const handleFinishFailed = (errorInfo) => {
    console.error("FORM VALIDATION FAILED:", errorInfo);

    const firstError = errorInfo.errorFields?.[0];

    if (firstError) {
      console.error(
        `Field "${firstError.name?.[0]}" failed:`,
        firstError.errors
      );
    }
  };

  // =========================
  // Cancel
  // =========================
  const handleCancel = () => {
    form.resetFields();
    setImageUrl("");
    setSelectedState("");
    onCancel();
  };

  return (
    <Modal
      open={open}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "18px",
            fontWeight: 600,
          }}
        >
          <ShopOutlined style={{ color: "#1890ff" }} />

          <span>
            {cinema ? "Edit Cinema Details" : "Add New Cinema"}
          </span>
        </div>
      }
      okText={cinema ? "Update Cinema" : "Create Cinema"}
      cancelText="Cancel"
      confirmLoading={loading}
      onCancel={handleCancel}
      onOk={() => {
        console.log("CREATE / UPDATE BUTTON CLICKED");
        form.submit();
      }}
      destroyOnClose
      width={700}
      centered
      okButtonProps={{
        style: {
          backgroundColor: "#1890ff",
          borderRadius: "6px",
        },
      }}
      cancelButtonProps={{
        style: {
          borderRadius: "6px",
        },
      }}
    >
      <div
        style={{
          marginBottom: "16px",
          color: "#666",
          fontSize: "13px",
        }}
      >
        {cinema
          ? "Update the details of the cinema below."
          : "Fill in the information below to register a new cinema location."}
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        requiredMark="optional"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 20px",
          }}
        >
          {/* Cinema Name */}
          <Form.Item
            label={
              <span style={{ fontWeight: 500 }}>
                Cinema Name
              </span>
            }
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter cinema name",
              },
              standardTextValidation,
              {
                max: 100,
                message: "Maximum 100 characters allowed",
              },
            ]}
          >
            <Input
              prefix={
                <ShopOutlined
                  style={{ color: "#bfbfbf" }}
                />
              }
              placeholder="e.g. PVR Cinemas"
              onBlur={() => handleBlur("name")}
              style={{ borderRadius: "6px" }}
            />
          </Form.Item>

          {/* Location */}
          <Form.Item
            label={
              <span style={{ fontWeight: 500 }}>
                Location / Area
              </span>
            }
            name="location"
            rules={[
              {
                required: true,
                message: "Please enter location",
              },
              standardTextValidation,
              {
                max: 150,
                message: "Maximum 150 characters allowed",
              },
            ]}
          >
            <Input
              prefix={
                <EnvironmentOutlined
                  style={{ color: "#bfbfbf" }}
                />
              }
              placeholder="e.g. Forum Mall, Koramangala"
              onBlur={() => handleBlur("location")}
              style={{ borderRadius: "6px" }}
            />
          </Form.Item>

          {/* State */}
          <Form.Item
            label={
              <span style={{ fontWeight: 500 }}>
                State
              </span>
            }
            name="state"
            rules={[
              {
                required: true,
                message: "Please select state",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select state"
              style={{ width: "100%" }}
              optionFilterProp="children"
              suffixIcon={
                <FlagOutlined
                  style={{ color: "#bfbfbf" }}
                />
              }
              onChange={(value) => {
                setSelectedState(value);

                form.setFieldsValue({
                  city: undefined,
                });
              }}
            >
              {Object.keys(stateCityMap).map(
                (state) => (
                  <Option key={state} value={state}>
                    {state}
                  </Option>
                )
              )}
            </Select>
          </Form.Item>

          {/* City */}
          <Form.Item
            label={
              <span style={{ fontWeight: 500 }}>
                City
              </span>
            }
            name="city"
            rules={[
              {
                required: true,
                message: "Please select city",
              },
            ]}
          >
            <Select
              showSearch
              placeholder={
                selectedState
                  ? "Select city"
                  : "Select state first"
              }
              style={{ width: "100%" }}
              disabled={!selectedState}
              optionFilterProp="children"
              suffixIcon={
                <GlobalOutlined
                  style={{ color: "#bfbfbf" }}
                />
              }
            >
              {selectedState &&
                stateCityMap[selectedState]?.map(
                  (city) => (
                    <Option key={city} value={city}>
                      {city}
                    </Option>
                  )
                )}
            </Select>
          </Form.Item>

          {/* Number of Screens */}
          <Form.Item
            label={
              <span style={{ fontWeight: 500 }}>
                Number of Screens
              </span>
            }
            name="screens"
            rules={[
              {
                required: true,
                message: "Please enter total screens",
              },
            ]}
          >
            <InputNumber
              min={1}
              max={100}
              precision={0}
              style={{
                width: "100%",
                borderRadius: "6px",
              }}
              placeholder="e.g. 5"
              prefix={
                <AppstoreOutlined
                  style={{
                    color: "#bfbfbf",
                    marginRight: 8,
                  }}
                />
              }
            />
          </Form.Item>

          {/* Capacity */}
          <Form.Item
            label={
              <span style={{ fontWeight: 500 }}>
                Seating Capacity
              </span>
            }
            name="capacity"
            rules={[
              {
                required: true,
                message:
                  "Please enter seating capacity",
              },
            ]}
          >
            <InputNumber
              min={1}
              max={50000}
              precision={0}
              style={{
                width: "100%",
                borderRadius: "6px",
              }}
              placeholder="e.g. 1200"
              prefix={
                <TeamOutlined
                  style={{
                    color: "#bfbfbf",
                    marginRight: 8,
                  }}
                />
              }
            />
          </Form.Item>

          {/* Contact Number */}
          <Form.Item
            label={
              <span style={{ fontWeight: 500 }}>
                Contact Number
              </span>
            }
            name="contactNumber"
            rules={[
              {
                required: true,
                message:
                  "Please enter contact number",
              },
              {
                pattern: /^[0-9]{10}$/,
                message:
                  "Enter a valid 10-digit contact number",
              },
            ]}
          >
            <Input
              prefix={
                <PhoneOutlined
                  style={{ color: "#bfbfbf" }}
                />
              }
              placeholder="e.g. 9876543210"
              maxLength={10}
              onBlur={() =>
                handleBlur("contactNumber")
              }
              style={{ borderRadius: "6px" }}
            />
          </Form.Item>

          {/* Status */}
          <Form.Item
            label={
              <span style={{ fontWeight: 500 }}>
                Status
              </span>
            }
            name="status"
            rules={[
              {
                required: true,
                message: "Please select status",
              },
            ]}
          >
            <Select
              placeholder="Select status"
              style={{ width: "100%" }}
            >
              <Option value="Active">
                <span style={{ color: "#52c41a" }}>
                  <CheckCircleOutlined /> Active
                </span>
              </Option>

              <Option value="Inactive">
                <span style={{ color: "#ff4d4f" }}>
                  Inactive
                </span>
              </Option>
            </Select>
          </Form.Item>
        </div>

        {/* Cinema Image URL */}
        <Form.Item
          label={
            <span style={{ fontWeight: 500 }}>
              Cinema Image URL
            </span>
          }
          name="image"
          rules={[
            {
              required: false,
            },
            {
              validator: (_, value) => {
                if (!value || value.trim() === "") {
                  return Promise.resolve();
                }

                try {
                  const url = new URL(value);

                  if (
                    url.protocol === "http:" ||
                    url.protocol === "https:"
                  ) {
                    return Promise.resolve();
                  }
                } catch (error) {
                  // Invalid URL
                }

                return Promise.reject(
                  new Error(
                    "Please enter a valid URL starting with http:// or https://"
                  )
                );
              },
            },
          ]}
        >
          <Input
            prefix={
              <PictureOutlined
                style={{ color: "#bfbfbf" }}
              />
            }
            placeholder="e.g. https://example.com/cinema-poster.jpg"
            onBlur={(e) => {
              handleBlur("image");
              setImageUrl(e.target.value);
            }}
            style={{ borderRadius: "6px" }}
          />
        </Form.Item>

        {/* Image Preview */}
        {imageUrl && (
          <div
            style={{
              marginTop: "-8px",
              marginBottom: "16px",
              padding: "10px",
              background: "#fafafa",
              border: "1px dashed #d9d9d9",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#888",
                fontWeight: 500,
              }}
            >
              Image Preview:
            </div>

            <img
              src={imageUrl}
              alt="Cinema Preview"
              style={{
                width: "60px",
                height: "40px",
                objectFit: "cover",
                borderRadius: "4px",
                border: "1px solid #eee",
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />

            <span
              style={{
                fontSize: "11px",
                color: "#fa8c16",
              }}
            >
              Ensure link directs to a publicly
              accessible image format (.jpg, .png).
            </span>
          </div>
        )}
      </Form>
    </Modal>
  );
}

export default AddEditCinemaModal;