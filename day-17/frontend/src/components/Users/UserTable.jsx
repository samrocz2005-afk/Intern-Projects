// src/components/Users/UserTable.jsx

import React, { useState } from "react";
import { Table, Select, Tag, Space, Empty, message } from "antd";

import { ROLES } from "../../utils/constants";


const { Option } = Select;


const UserTable = ({
  users = [],
  loading = false,
  onRoleChange,
}) => {

  const [updatingId, setUpdatingId] = useState(null);



  const getRoleColor = (role) => {

    switch (role) {

      case ROLES.ADMIN:
        return "red";

      case ROLES.MEMBER:
        return "blue";

      case ROLES.READER:
        return "green";

      default:
        return "default";

    }

  };




  const handleRoleChange = async (userId, role) => {

    try {

      setUpdatingId(userId);


      await onRoleChange(
        userId,
        role
      );


    } catch (error) {

      message.error(
        "Role update failed"
      );


    } finally {

      setUpdatingId(null);

    }

  };




  const columns = [

    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },


    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },


    {
      title: "Role",
      dataIndex: "role",
      key: "role",

      render: (role) => (

        <Tag color={getRoleColor(role)}>
          {role}
        </Tag>

      ),
    },



    {
      title: "Action",
      key: "action",

      render: (_, record) => (

        <Space>

          <Select

            value={record.role}

            loading={
              updatingId === record._id
            }

            disabled={
              updatingId === record._id
            }

            style={{
              width: 140,
            }}


            onChange={(value) => {

              if (
                value !== record.role
              ) {

                handleRoleChange(
                  record._id,
                  value
                );

              }

            }}

          >


            <Option value={ROLES.MEMBER}>
              Member
            </Option>


            <Option value={ROLES.READER}>
              Reader
            </Option>


          </Select>


        </Space>

      ),
    },

  ];





  return (

    <Table

      rowKey="_id"

      columns={columns}

      dataSource={users}

      loading={loading}


      locale={{
        emptyText: (
          <Empty description="No users found" />
        ),
      }}


      pagination={{
        pageSize: 10,
        showSizeChanger: false,
      }}

    />

  );

};


export default UserTable;