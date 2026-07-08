const API_URL = process.env.REACT_APP_API_BASE_URL;

console.log("API URL:", API_URL);

// Get All Tasks
export const getTasks = async () => {
  try {
    console.log("Fetching tasks...");

    const response = await fetch(`${API_URL}/tasks`);

    if (!response.ok) {
      throw new Error("Failed to fetch tasks.");
    }

    const data = await response.json();

    console.log("Tasks:", data);

    return data;
  } catch (error) {
    console.error("Get Tasks Error:", error);
    throw new Error(error.message || "Unable to fetch tasks.");
  }
};

// Add New Task
export const addTask = async (task) => {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error("Failed to add task.");
    }

    const data = await response.json();

    console.log("Task Added:", data);

    return data;
  } catch (error) {
    console.error("Add Task Error:", error);
    throw new Error(error.message || "Unable to add task.");
  }
};

// Login User
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/users`);

    if (!response.ok) {
      throw new Error("Unable to connect to server.");
    }

    const users = await response.json();

    console.log("Users:", users);

    const user = users.find(
      (item) =>
        item.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        item.password === password
    );

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    return {
      token: "fake-token-123",
      user,
    };
  } catch (error) {
    console.error("Login Error:", error);
    throw new Error(error.message || "Login failed.");
  }
};