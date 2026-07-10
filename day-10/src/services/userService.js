import userApi from "../api/userApi";

export const getUsers = async () => {
  const response = await userApi.get("/users");
  return response.data;
};

export const createUser = async (user) => {
  const response = await userApi.post("/users", user);
  return response.data;
};