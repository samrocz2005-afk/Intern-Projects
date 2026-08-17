import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Layout,
  Table,
  Tag,
  Typography,
  Card,
  Space,
  message,
  Modal,
  Button,
  Select,
  Checkbox,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RiAdminFill } from "react-icons/ri";
import { FaShieldAlt } from "react-icons/fa";

import Sidebar from "../components/Sidebar";

import {
  getUsers,
  updateUserRole,
  deleteUser,
} from "../services/authApi";

import { logout } from "../redux/authSlice";

import {
  LogoutButton,
  DeleteUserButton,
} from "../utils/buttons";

const { Header: AntHeader, Content } = Layout;
const { Title, Text } = Typography;

const INITIAL_PERMISSIONS_DATA = [
  { key: "1", entity: "Movie Management", action: "Movie Create" },
  { key: "2", entity: "Movie Management", action: "Movie Read" },
  { key: "3", entity: "Movie Management", action: "Movie Update" },
  { key: "4", entity: "Movie Management", action: "Movie Delete" },
  { key: "5", entity: "Cinema Management", action: "Cinema Create" },
  { key: "6", entity: "Cinema Management", action: "Cinema Read" },
  { key: "7", entity: "Cinema Management", action: "Cinema Update" },
  { key: "8", entity: "Cinema Management", action: "Cinema Delete" },
];

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [isCustomRoleModalOpen, setIsCustomRoleModalOpen] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth || {});

  const userRole = useMemo(() => {
    return Array.isArray(user?.role) ? user.role : [user?.role || "Reader"];
  }, [user?.role]);

  useEffect(() => {
    if (!userRole.includes("Admin")) {
      message.error("Access Denied");
      navigate("/dashboard");
    }
  }, [userRole, navigate]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/");
  }, [dispatch, navigate]);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res.data?.users || []);
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userRole.includes("Admin")) {
      loadUsers();
    }
  }, [userRole, loadUsers]);

  const handleRoleChange = async (userId, roleValue, record) => {
    if (roleValue === "Custom Role") {
      setSelectedUserForRole(record);
      const standardRoles = ["Admin", "Member", "Reader"];
      
      let existingPerms = [];
      if (Array.isArray(record.role)) {
        existingPerms = record.role.filter(r => !standardRoles.includes(r));
      }
      setSelectedPermissions(existingPerms);
      setIsCustomRoleModalOpen(true);
      return;
    }

    try {
      await updateUserRole(userId, [roleValue]);

      message.success("Role updated successfully");

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId
            ? { ...u, role: [roleValue] }
            : u
        )
      );
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to update role"
      );
    }
  };

  const handleCheckboxChange = (permissionValue, checked, category) => {
    let updated = [...selectedPermissions];

    if (checked) {
      if (!updated.includes(permissionValue)) {
        updated.push(permissionValue);
      }
      if (
        permissionValue.includes("Create") ||
        permissionValue.includes("Update") ||
        permissionValue.includes("Delete")
      ) {
        const readPerm = category === "movie" ? "Movie Read" : "Cinema Read";
        if (!updated.includes(readPerm)) {
          updated.push(readPerm);
        }
      }
    } else {
      updated = updated.filter((p) => p !== permissionValue);
    }

    setSelectedPermissions(updated);
  };

  const handleSaveCustomRole = async () => {
    if (!selectedUserForRole || selectedPermissions.length === 0) {
      message.error("Please select at least one permission");
      return;
    }

    try {
      await updateUserRole(selectedUserForRole._id, selectedPermissions);

      message.success("Custom roles updated successfully");

      setUsers((prev) =>
        prev.map((u) =>
          u._id === selectedUserForRole._id
            ? { ...u, role: selectedPermissions }
            : u
        )
      );

      setIsCustomRoleModalOpen(false);
      setSelectedUserForRole(null);
      setSelectedPermissions([]);
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to update custom roles"
      );
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete._id);
      message.success("User deleted successfully");
      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  };

  const getRoleColor = (roleStr) => {
    if (roleStr?.includes("Admin")) return "red";
    if (roleStr?.includes("Member")) return "blue";
    if (roleStr?.includes("Reader")) return "green";
    return "purple";
  };

  const permissionColumns = [
    { title: "Entity", dataIndex: "entity", key: "entity", align: "center" },
    { title: "Action", dataIndex: "action", key: "action", align: "center" },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Current Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const rolesArray = Array.isArray(role) ? role : [role || "Reader"];
        return (
          <Space wrap>
            {rolesArray.map((r, index) => (
              <Tag key={index} color={getRoleColor(r)}>
                {r.toUpperCase()}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: "Change Role",
      key: "changeRole",
      render: (_, record) => {
        const rolesArray = Array.isArray(record.role) ? record.role : [record.role];
        const isProtectedUser =
          rolesArray.includes("Admin") ||
          record.email === user?.email;

        const standardRoles = ["Admin", "Member", "Reader"];
        const isStandard = rolesArray.length === 1 && standardRoles.includes(rolesArray[0]);
        const displayValue = isStandard ? rolesArray[0] : "Custom Role";

        return (
          <Select
            value={displayValue}
            placeholder="Edit Roles"
            disabled={isProtectedUser}
            style={{ width: 150 }}
            onChange={(value) =>
              handleRoleChange(record._id, value, record)
            }
            options={[
              { value: "Reader", label: "Reader" },
              { value: "Member", label: "Member" },
              { value: "Custom Role", label: "Custom Roles" },
            ]}
          />
        );
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => {
        const rolesArray = Array.isArray(record.role) ? record.role : [record.role];
        const isProtectedUser =
          rolesArray.includes("Admin") ||
          record.email === user?.email;

        return (
          <DeleteUserButton
            disabled={isProtectedUser}
            label="Delete"
            onClick={() => {
              setUserToDelete(record);
              setIsDeleteModalOpen(true);
            }}
          />
        );
      },
    },
  ];

  const primaryUserRoleStr = userRole.includes("Admin") ? "Admin" : userRole[0] || "Reader";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />

      <Layout>
        <AntHeader
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#2596be",
            padding: "0 24px",
          }}
        >
          <Title level={3} style={{ color: "#fff", margin: 0 }}>
            Movie Explorer
          </Title>

          <Space size="middle">
            <Text style={{ color: "#fff", fontWeight: 500 }}>
              {user?.name || "Guest"}
            </Text>

            <Tag
              color={getRoleColor(primaryUserRoleStr)}
              icon={userRole.includes("Admin") ? <RiAdminFill /> : undefined}
              style={{
                margin: 0,
                padding: "6px 8px",
                fontSize: "12px",
                lineHeight: "20px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {primaryUserRoleStr.toUpperCase()}
            </Tag>

            <LogoutButton onClick={handleLogout} />
          </Space>
        </AntHeader>

        <Content style={{ padding: 24 }}>
          <Card style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Title level={3} style={{ margin: 0 }}>
                User Management
              </Title>

              {userRole.includes("Admin") && (
                <Button
                  type="primary"
                  icon={<FaShieldAlt />}
                  onClick={() => setIsPermissionModalOpen(true)}
                  style={{ background: "#2596be" }}
                >
                  Manage Role Permissions
                </Button>
              )}
            </div>

            <Table
              rowKey={(record) => record._id}
              loading={loading}
              columns={columns}
              dataSource={users}
              bordered
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20"],
                showTotal: (total, range) =>
                  `Showing ${range[0]}-${range[1]} of ${total} users`,
              }}
            />
          </Card>
        </Content>
      </Layout>

      {/* DELETE USER MODAL */}
      <Modal
        title="Delete User"
        open={isDeleteModalOpen}
        onOk={confirmDeleteUser}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        okText="Yes"
        cancelText="No"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete user{" "}
          <strong>{userToDelete?.name || userToDelete?.email}</strong>?
        </p>
      </Modal>

      {/* CUSTOM ROLES PERMISSIONS SELECTION MODAL */}
      <Modal
        title={`Select Custom Access for ${selectedUserForRole?.name || selectedUserForRole?.email || "User"}`}
        open={isCustomRoleModalOpen}
        onOk={handleSaveCustomRole}
        onCancel={() => {
          setIsCustomRoleModalOpen(false);
          setSelectedUserForRole(null);
          setSelectedPermissions([]);
        }}
        okText="Save Access"
        cancelText="Cancel"
        width={600}
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            Select multiple permissions (selecting Create/Update/Delete automatically grants Read):
          </Text>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <Title level={5} style={{ marginBottom: 8, color: "#2596be" }}>
              Movie Management
            </Title>
            <div style={{ display: "flex", gap: "16px" }}>
              {["Movie Read", "Movie Create", "Movie Update", "Movie Delete"].map((perm) => (
                <Checkbox
                  key={perm}
                  checked={selectedPermissions.includes(perm)}
                  onChange={(e) => handleCheckboxChange(perm, e.target.checked, "movie")}
                >
                  {perm.replace("Movie ", "")}
                </Checkbox>
              ))}
            </div>
          </div>
          <div>
            <Title level={5} style={{ marginBottom: 8, color: "#2596be" }}>
              Cinema Management
            </Title>
            <div style={{ display: "flex", gap: "16px" }}>
              {["Cinema Read", "Cinema Create", "Cinema Update", "Cinema Delete"].map((perm) => (
                <Checkbox
                  key={perm}
                  checked={selectedPermissions.includes(perm)}
                  onChange={(e) => handleCheckboxChange(perm, e.target.checked, "cinema")}
                >
                  {perm.replace("Cinema ", "")}
                </Checkbox>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* ADMIN PERMISSION OVERVIEW MODAL */}
      <Modal
        title="Admin Permission Overview"
        open={isPermissionModalOpen}
        onOk={() => setIsPermissionModalOpen(false)}
        onCancel={() => setIsPermissionModalOpen(false)}
        okText="Close"
        cancelButtonProps={{ style: { display: "none" } }}
        width={650}
      >
        <Table
          dataSource={INITIAL_PERMISSIONS_DATA}
          columns={permissionColumns}
          bordered
          pagination={false}
          size="middle"
        />
      </Modal>
    </Layout>
  );
}

export default Users;