import React from "react";
import { Button as AntButton, Select } from "antd";
import { FaPlus, FaEye, FaUsers, FaUserXmark } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { RiLoginBoxLine, RiUserAddLine } from "react-icons/ri";

const COLOR_CONFIGS = {
  brand: {
    bg: "#2596be",
    border: "#2596be",
    text: "#ffffff",
  },
  danger: {
    bg: "#dc2626",
    border: "#dc2626",
    text: "#ffffff",
  },
  default: {
    bg: "#ffffff",
    border: "#d9d9d9",
    text: "#000000d9",
  },
};

export const BaseButton = ({
  children,
  icon,
  type = "default",
  danger = false,
  size = "default",
  variant = "default",
  className = "",
  style = {},
  onClick,
  ...props
}) => {
  // Determine active color set
  const colors = danger
    ? COLOR_CONFIGS.danger
    : COLOR_CONFIGS[variant] || COLOR_CONFIGS.default;

  return (
    <AntButton
      type={type}
      danger={danger}
      size={size}
      onClick={onClick}
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text,
        boxShadow: "none",
        ...style,
      }}
      className={`inline-flex items-center gap-1.5 justify-center hover:opacity-100 focus:opacity-100 active:opacity-100 ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex items-center">{icon}</span>}
      {children}
    </AntButton>
  );
};

/* ==========================================================================
   MOVIE BUTTONS
   ========================================================================== */

// 1. Add Movie Button
export const AddMovieButton = ({ onClick, label = "Add Movie", ...props }) => (
  <BaseButton
    type="primary"
    variant="brand"
    icon={<FaPlus />}
    onClick={onClick}
    {...props}
  >
    {label}
  </BaseButton>
);

// 2. View Movie Button
export const ViewMovieButton = ({ onClick, label = "View", ...props }) => (
  <BaseButton
    type="primary"
    variant="brand"
    size="small"
    icon={<FaEye />}
    onClick={onClick}
    {...props}
  >
    {label}
  </BaseButton>
);

// 3. Edit Movie Button
export const EditMovieButton = ({ onClick, label = "Edit", ...props }) => (
  <BaseButton
    size="small"
    variant="default"
    icon={<FaEdit />}
    onClick={onClick}
    {...props}
  >
    {label}
  </BaseButton>
);

// 4. Delete Movie Button
export const DeleteMovieButton = ({ onClick, label = "Delete", ...props }) => (
  <BaseButton
    danger
    size="small"
    icon={<MdDeleteSweep />}
    onClick={onClick}
    {...props}
  >
    {label}
  </BaseButton>
);

/* ==========================================================================
   CINEMA BUTTONS
   ========================================================================== */

// 5. Add Cinema Button
export const AddCinemaButton = ({ onClick, label = "Add Cinema", ...props }) => (
  <BaseButton
    type="primary"
    variant="brand"
    icon={<FaPlus />}
    onClick={onClick}
    {...props}
  >
    {label}
  </BaseButton>
);

// 6. View Cinema Button
export const ViewCinemaButton = ({ onClick, label = "View", ...props }) => (
  <BaseButton
    type="primary"
    variant="brand"
    size="small"
    icon={<FaEye />}
    onClick={onClick}
    {...props}
  >
    {label}
  </BaseButton>
);

// 7. Edit Cinema Button
export const EditCinemaButton = ({ onClick, label = "Edit", ...props }) => (
  <BaseButton
    size="small"
    variant="default"
    icon={<FaEdit />}
    onClick={onClick}
    {...props}
  >
    {label}
  </BaseButton>
);

// 8. Delete Cinema Button
export const DeleteCinemaButton = ({ onClick, label = "Delete", ...props }) => (
  <BaseButton
    danger
    size="small"
    icon={<MdDeleteSweep />}
    onClick={onClick}
    {...props}
  >
    {label}
  </BaseButton>
);

/* ==========================================================================
   AUTHENTICATION & USER MANAGEMENT BUTTONS
   ========================================================================== */

// 9. Logout Button
export const LogoutButton = ({ onClick, label = "Logout", ...props }) => (
  <BaseButton
    type="primary"
    danger
    onClick={onClick}
    {...props}
  >
    {label}
  </BaseButton>
);

// 10. Login Submit Button
export const LoginSubmitButton = ({ loading = false, label = "Login", ...props }) => (
  <BaseButton
    type="primary"
    variant="brand"
    htmlType="submit"
    block
    loading={loading}
    disabled={loading}
    icon={<RiLoginBoxLine />}
    {...props}
  >
    {label}
  </BaseButton>
);

// 11. Signup Submit Button
export const SignupSubmitButton = ({ loading = false, label = "Signup", ...props }) => (
  <BaseButton
    type="primary"
    variant="brand"
    htmlType="submit"
    block
    loading={loading}
    disabled={loading}
    icon={<RiUserAddLine />}
    {...props}
  >
    {label}
  </BaseButton>
);

// 12. Manage Users Button
export const ManageUsersButton = ({ onClick, label = "Manage Users", ...props }) => (
  <BaseButton
    variant="default"
    icon={<FaUsers />}
    onClick={onClick}
    {...props}
  >
    {label}
  </BaseButton>
);

// 13. Delete User Button
export const DeleteUserButton = ({ onClick, label = "Delete User", ...props }) => (
  <BaseButton
    danger
    size="small"
    icon={<FaUserXmark />}
    onClick={onClick}
    {...props}
  >
    {label}
  </BaseButton>
);

// 14. Role Select
export const RoleSelect = ({
  currentRole,
  onChange,
  disabled = false,
  size = "small",
}) => {
  return (
    <Select
      value={currentRole}
      onChange={onChange}
      disabled={disabled}
      size={size}
      style={{ width: 140 }}
      options={[
        {
          value: "Admin",
          label: "Admin",
        },
        {
          value: "Member",
          label: "Member",
        },
        {
          value: "Reader",
          label: "Reader",
        },
        {
          value: "Movie Create",
          label: "Movie Create",
        },
        {
          value: "Movie Read",
          label: "Movie Read",
        },
        {
          value: "Movie Update",
          label: "Movie Update",
        },
        {
          value: "Movie Delete",
          label: "Movie Delete",
        },
        {
          value: "Cinema Create",
          label: "Cinema Create",
        },
        {
          value: "Cinema Read",
          label: "Cinema Read",
        },
        {
          value: "Cinema Update",
          label: "Cinema Update",
        },
        {
          value: "Cinema Delete",
          label: "Cinema Delete",
        },
      ]}
    />
  );
};