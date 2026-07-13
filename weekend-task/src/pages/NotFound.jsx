import { Result, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#20212C",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <Result
        status="404"
        title={
          <span
            style={{
              color: "#FFFFFF",
            }}
          >
            404
          </span>
        }
        subTitle={
          <span
            style={{
              color: "#828FA3",
            }}
          >
            Sorry, the page you are looking for doesn't exist.
          </span>
        }
        extra={
          <Button
            type="primary"
            icon={<HomeOutlined />}
            size="large"
            onClick={() => navigate("/")}
            style={{
              borderRadius: 24,
              height: 44,
              paddingInline: 24,
            }}
          >
            Back to Dashboard
          </Button>
        }
      />
    </div>
  );
}

export default NotFound;