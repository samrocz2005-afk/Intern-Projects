import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "../utils/constants";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you are looking for does not exist."
      extra={
        <Button
          type="primary"
          onClick={() => navigate(ROUTES.DASHBOARD)}
        >
          Back to Dashboard
        </Button>
      }
    />
  );
};

export default NotFound;