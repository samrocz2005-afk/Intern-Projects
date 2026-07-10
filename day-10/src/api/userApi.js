import axios from "axios";

const userApi = axios.create({
  baseURL: "http://localhost:3001",
});

export default userApi;