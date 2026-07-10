import api from "./api";

export const loginStudent = async (credentials) => {
  console.log("Credentials:", credentials);

  const response = await api.get("/students");

  console.log("All Students:", response.data);

  const student = response.data.find(
    (s) =>
      s.email === credentials.email.trim() &&
      s.password === credentials.password
  );

  console.log("Matched Student:", student);

  if (!student) {
    throw new Error("Invalid email or password.");
  }

  return {
    user: student,
    token: `student-token-${student.id}`,
  };
};