import { Card, Col, Row, Statistic, Typography } from "antd";

const { Title, Text } = Typography;

function WeatherCard({ weather }) {
  if (!weather) return null;

  return (
    <Card style={{ marginTop: 20 }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3}>
            {weather.name}, {weather.sys.country}
          </Title>

          <Text>{weather.weather[0].description}</Text>
        </Col>

        <Col>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col xs={24} sm={12} md={8}>
          <Statistic
            title="Temperature"
            value={weather.main.temp}
            suffix="°C"
          />
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Statistic
            title="Feels Like"
            value={weather.main.feels_like}
            suffix="°C"
          />
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Statistic
            title="Humidity"
            value={weather.main.humidity}
            suffix="%"
          />
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Statistic
            title="Pressure"
            value={weather.main.pressure}
            suffix="hPa"
          />
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Statistic
            title="Wind Speed"
            value={weather.wind.speed}
            suffix="m/s"
          />
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Statistic
            title="Visibility"
            value={weather.visibility / 1000}
            suffix="km"
          />
        </Col>
      </Row>
    </Card>
  );
}

export default WeatherCard;