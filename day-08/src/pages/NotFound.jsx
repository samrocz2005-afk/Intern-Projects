import { Result, Button } from "antd";
import { Link } from "react-router-dom";

function NotFound() {
  const token = localStorage.getItem("token");

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you are looking for does not exist."
      extra={
        token ? (
          <Button type="primary">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        ) : (
          <Button type="primary">
            <Link to="/login">Go to Login</Link>
          </Button>
        )
      }
    />
  );
}

export default NotFound;