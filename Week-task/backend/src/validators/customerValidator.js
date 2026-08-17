const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PHONE_REGEX =
  /^\+?[1-9]\d{7,14}$/;

const validateCustomerData = (
  data,
  { isUpdate = false } = {}
) => {
  const errors = [];
  const value = {};

  if (!isUpdate || data.firstName !== undefined) {
    if (
      typeof data.firstName !== "string" ||
      !data.firstName.trim()
    ) {
      errors.push({
        field: "firstName",
        message:
          "First name is required",
      });
    } else if (
      data.firstName.trim().length < 2 ||
      data.firstName.trim().length > 50
    ) {
      errors.push({
        field: "firstName",
        message:
          "First name must be between 2 and 50 characters",
      });
    } else {
      value.firstName =
        data.firstName.trim();
    }
  }

  if (!isUpdate || data.lastName !== undefined) {
    if (
      typeof data.lastName !== "string" ||
      !data.lastName.trim()
    ) {
      errors.push({
        field: "lastName",
        message:
          "Last name is required",
      });
    } else if (
      data.lastName.trim().length < 1 ||
      data.lastName.trim().length > 50
    ) {
      errors.push({
        field: "lastName",
        message:
          "Last name must be between 1 and 50 characters",
      });
    } else {
      value.lastName =
        data.lastName.trim();
    }
  }

  if (!isUpdate || data.email !== undefined) {
    if (
      typeof data.email !== "string" ||
      !data.email.trim()
    ) {
      errors.push({
        field: "email",
        message:
          "Email is required",
      });
    } else if (
      data.email.trim().length > 254 ||
      !EMAIL_REGEX.test(
        data.email.trim()
      )
    ) {
      errors.push({
        field: "email",
        message:
          "Valid email address is required",
      });
    } else {
      value.email =
        data.email.trim().toLowerCase();
    }
  }

  if (!isUpdate || data.phone !== undefined) {
    if (
      typeof data.phone !== "string" ||
      !data.phone.trim()
    ) {
      errors.push({
        field: "phone",
        message:
          "Phone number is required",
      });
    } else if (
      !PHONE_REGEX.test(
        data.phone.trim()
      )
    ) {
      errors.push({
        field: "phone",
        message:
          "Valid phone number is required",
      });
    } else {
      value.phone =
        data.phone.trim();
    }
  }

  if (data.address !== undefined) {
    if (
      typeof data.address !== "object" ||
      data.address === null ||
      Array.isArray(data.address)
    ) {
      errors.push({
        field: "address",
        message:
          "Address must be an object",
      });
    } else {
      value.address =
        data.address;
    }
  }

  if (data.isActive !== undefined) {
    if (
      typeof data.isActive !== "boolean"
    ) {
      errors.push({
        field: "isActive",
        message:
          "isActive must be a boolean",
      });
    } else {
      value.isActive =
        data.isActive;
    }
  }

  return {
    value: {
      body: value,
    },
    errors,
  };
};

const createCustomerValidator = ({
  body,
}) => {
  return validateCustomerData(body, {
    isUpdate: false,
  });
};

const updateCustomerValidator = ({
  body,
}) => {
  if (!body || Object.keys(body).length === 0) {
    return {
      value: {
        body: {},
      },
      errors: [
        {
          field: "body",
          message:
            "At least one field is required for update",
        },
      ],
    };
  }

  return validateCustomerData(body, {
    isUpdate: true,
  });
};

module.exports = {
  createCustomerValidator,
  updateCustomerValidator,
};