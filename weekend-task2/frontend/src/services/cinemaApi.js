import api from "./axios";

export const getCinemas = (params = {}) => {
  return api.get("/cinemas", { params });
};

export const getCinemaById = (id) => {
  return api.get(`/cinemas/${id}`);
};

export const createCinema = (data) => {
  console.log("CREATE CINEMA API:", data);
  return api.post("/cinemas", data);
};

export const updateCinema = (id, data) => {
  console.log("UPDATE CINEMA API:", id, data);
  return api.put(`/cinemas/${id}`, data);
};

export const deleteCinema = (id) => {
  return api.delete(`/cinemas/${id}`);
};