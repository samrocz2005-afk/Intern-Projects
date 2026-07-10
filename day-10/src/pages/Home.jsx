import { useState } from "react";
import { Button, Card, Col, Input, Row, Typography } from "antd";

import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import ForecastCard from "../components/ForecastCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

import { useCurrentWeather, useForecast } from "../hooks/useWeather";

import { useCreateUser, useUsers } from "../hooks/useUser";

const { Title } = Typography;

function Home() {
  // Weather Search
  const [input, setInput] = useState("");
  const [city, setCity] = useState("");

  // User Form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Get Saved Users
  const { data: users } = useUsers();

  // Mutation
  const { mutate, isPending } = useCreateUser();

  // Current Weather
  const {
    data: weather,
    isLoading: weatherLoading,
    isError: weatherError,
    error: weatherErrorMessage,
  } = useCurrentWeather(city);

  // Forecast
  const {
    data: forecast,
    isLoading: forecastLoading,
    isError: forecastError,
    error: forecastErrorMessage,
  } = useForecast(city);

  const handleSearch = () => {
    if (!input.trim()) return;

    setCity(input.trim());
  };

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      alert("Please enter Name and Email");
      return;
    }

    mutate(
      {
        name,
        email,
      },
      {
        onSuccess: () => {
          setName("");
          setEmail("");
        },
      },
    );
  };

  return (
    <Row justify="center" style={{ padding: "40px 20px" }}>
      <Col xs={24} sm={24} md={20} lg={16}>
        <Card>
          <Title level={2} style={{ textAlign: "center" }}>
            Weather Forecast
          </Title>

          {/* User Form */}

          <Input
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: 10 }}
          />

          <Input
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: 10 }}
          />

          <Button
            type="primary"
            loading={isPending}
            onClick={handleSave}
            style={{ marginBottom: 20 }}
          >
            Save User
          </Button>

          {/* Weather Search */}

          <SearchBar city={input} setCity={setInput} onSearch={handleSearch} />

          {!city && (
            <p style={{ textAlign: "center", marginTop: 20 }}>
              Search for a city to see the weather.
            </p>
          )}

          {(weatherLoading || forecastLoading) && <Loader />}

          {(weatherError || forecastError) && (
            <ErrorMessage
              message={
                weatherErrorMessage?.response?.data?.message ||
                forecastErrorMessage?.response?.data?.message ||
                "Something went wrong."
              }
            />
          )}

          {weather && <WeatherCard weather={weather} />}

          {forecast && <ForecastCard forecast={forecast} />}

          {/* Saved Users */}

          <Title level={4} style={{ marginTop: 30 }}>
            Saved Users
          </Title>

          {users?.map((user) => (
            <Card key={user.id} style={{ marginBottom: 10 }}>
              <p>
                <strong>Name:</strong> {user.name}
              </p>

              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </Card>
          ))}
        </Card>
      </Col>
    </Row>
  );
}

export default Home;
