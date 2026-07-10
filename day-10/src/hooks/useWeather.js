import { useQuery } from "@tanstack/react-query";
import {
  getCurrentWeather,
  getForecast,
} from "../services/weatherService";

// ==============================
// Current Weather
// ==============================
export const useCurrentWeather = (city) => {
  return useQuery({
    queryKey: ["weather", city],
    queryFn: () => getCurrentWeather(city),

    // Don't call API until city is entered
    enabled: !!city,

    // Cache stays fresh for 5 minutes
    staleTime: 1000 * 60 * 5,

    // Remove unused cache after 10 minutes
    gcTime: 1000 * 60 * 10,

    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// ==============================
// 5-Day Forecast
// ==============================
export const useForecast = (city) => {
  return useQuery({
    queryKey: ["forecast", city],
    queryFn: () => getForecast(city),

    enabled: !!city,

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,

    retry: 1,
    refetchOnWindowFocus: false,
  });
};