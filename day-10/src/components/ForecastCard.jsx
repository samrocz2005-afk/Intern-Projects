import { Card, Col, Row, Typography } from "antd";

const { Title, Text } = Typography;

function ForecastCard({ forecast }) {
  if (!forecast || !forecast.list) {
    return null;
  }

  // Show one forecast per day (12:00 PM)
  const dailyForecast = forecast.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );

  return (
    <div style={{ marginTop: 30 }}>
      <Title level={3}>5-Day Forecast</Title>

      <Row gutter={[16, 16]}>
        {dailyForecast.map((day) => (
          <Col xs={24} sm={12} md={8} lg={4} key={day.dt}>
            <Card hoverable>
              <Title level={5}>
                {new Date(day.dt_txt).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </Title>

              <img
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt={day.weather[0].description}
                width={80}
              />

              <Text strong>
                {day.main.temp} °C
              </Text>

              <br />

              <Text>{day.weather[0].description}</Text>

              <br />
              <br />

              <Text>
                💧 Humidity: {day.main.humidity}%
              </Text>

              <br />

              <Text>
                🌬 Wind: {day.wind.speed} m/s
              </Text>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ForecastCard;