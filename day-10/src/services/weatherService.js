import api from "../api/api";

// ==============================
// Get Current Weather
// ==============================
export const getCurrentWeather = async (city) => {
  const response = await api.get("/weather", {
    params: {
      q: city,
    },
  });

  return response.data;
};

// ==============================
// Get 5-Day / 3-Hour Forecast
// ==============================
export const getForecast = async (city) => {
  const response = await api.get("/forecast", {
    params: {
      q: city,
    },
  });

  return response.data;
};