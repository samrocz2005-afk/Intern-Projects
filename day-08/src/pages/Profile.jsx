import { Card, Typography, Divider } from "antd";
import { Avatar, Stack } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const { Title, Text } = Typography;

function Profile() {
  return (
    <Card className="profile-card">
      <Stack
        direction="column"
        spacing={2}
        alignItems="center"
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: "#1976d2",
          }}
        >
          <PersonIcon fontSize="large" />
        </Avatar>

        <Title level={3}>Sam</Title>

        <Divider />

        <div className="profile-info">
          <p>
            <Text strong>Email : </Text>
            sam@example.com
          </p>

          <p>
            <Text strong>Role : </Text>
            Software Engineer Intern
          </p>

          <p>
            <Text strong>Department : </Text>
            Development
          </p>

          <p>
            <Text strong>Company : </Text>
            Zybisys
          </p>
        </div>
      </Stack>
    </Card>
  );
}

export default Profile;