const validateCategoryData = (
  data,
  { isUpdate = false } = {}
) => {
  const errors = [];
  const value = {};

  if (!isUpdate || data.name !== undefined) {
    if (
      typeof data.name !== "string" ||
      !data.name.trim()
    ) {
      errors.push({
        field: "name",
        message: "Category name is required",
      });
    } else if (
      data.name.trim().length < 2 ||
      data.name.trim().length > 100
    ) {
      errors.push({
        field: "name",
        message:
          "Category name must be between 2 and 100 characters",
      });
    } else {
      value.name = data.name.trim();
    }
  }

  if (data.description !== undefined) {
    if (
      typeof data.description !== "string"
    ) {
      errors.push({
        field: "description",
        message:
          "Description must be a string",
      });
    } else if (
      data.description.length > 1000
    ) {
      errors.push({
        field: "description",
        message:
          "Description cannot exceed 1000 characters",
      });
    } else {
      value.description =
        data.description.trim();
    }
  }

  if (data.image !== undefined) {
    if (
      data.image !== null &&
      typeof data.image !== "string"
    ) {
      errors.push({
        field: "image",
        message:
          "Image must be a string",
      });
    } else {
      value.image =
        data.image?.trim() || null;
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
      value.isActive = data.isActive;
    }
  }

  return {
    value: {
      body: value,
    },
    errors,
  };
};

const createCategoryValidator = ({
  body,
}) => {
  return validateCategoryData(body, {
    isUpdate: false,
  });
};

const updateCategoryValidator = ({
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

  return validateCategoryData(body, {
    isUpdate: true,
  });
};

module.exports = {
  createCategoryValidator,
  updateCategoryValidator,
};