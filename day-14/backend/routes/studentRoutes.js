const { readData, writeData } = require("../utils/fileHelper");
const { URL } = require("url");

const studentRoutes = (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  console.log(req.headers.host);
  const path = url.pathname;
  const method = req.method;

  const data = readData();
  const students = data.students;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  if (method === "GET" && path === "/students") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(students));
  }


  if (method === "GET" && path.startsWith("/students/")) {
    const id = Number(path.split("/")[2]);

    const student = students.find((item) => item.id === id);

    if (!student) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Student not found" }));
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(student));
  }


  if (method === "POST" && path === "/students") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const student = JSON.parse(body);

      // Validation
      if (
        !student.name ||
        student.name.trim().length < 3 ||
        !student.email ||
        !student.department ||
        !student.age
      ) {
        res.writeHead(400, {
          "Content-Type": "application/json",
        });

        return res.end(
          JSON.stringify({
            message: "All fields are required",
          })
        );
      }

      if (!emailRegex.test(student.email)) {
        res.writeHead(400, {
          "Content-Type": "application/json",
        });

        return res.end(
          JSON.stringify({
            message: "Invalid email",
          })
        );
      }

      if (student.age < 18 || student.age > 60) {
        res.writeHead(400, {
          "Content-Type": "application/json",
        });

        return res.end(
          JSON.stringify({
            message: "Age must be between 18 and 60",
          })
        );
      }

      const emailExists = students.find(
        (item) =>
          item.email.toLowerCase() === student.email.toLowerCase()
      );

      if (emailExists) {
        res.writeHead(400, {
          "Content-Type": "application/json",
        });

        return res.end(
          JSON.stringify({
            message: "Email already exists",
          })
        );
      }

      student.id = Date.now();

      students.push(student);

      writeData(data);

      res.writeHead(201, {
        "Content-Type": "application/json",
      });

      res.end(JSON.stringify(student));
    });

    return;
  }

  // =========================
  // UPDATE STUDENT
  // =========================
  if (method === "PUT" && path.startsWith("/students/")) {
    const id = Number(path.split("/")[2]);

    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const updatedStudent = JSON.parse(body);

      const index = students.findIndex((item) => item.id === id);

      if (index === -1) {
        res.writeHead(404, {
          "Content-Type": "application/json",
        });

        return res.end(
          JSON.stringify({
            message: "Student not found",
          })
        );
      }

      // Validation
      if (
        !updatedStudent.name ||
        updatedStudent.name.trim().length < 3 ||
        !updatedStudent.email ||
        !updatedStudent.department ||
        !updatedStudent.age
      ) {
        res.writeHead(400, {
          "Content-Type": "application/json",
        });

        return res.end(
          JSON.stringify({
            message: "All fields are required",
          })
        );
      }

      if (!emailRegex.test(updatedStudent.email)) {
        res.writeHead(400, {
          "Content-Type": "application/json",
        });

        return res.end(
          JSON.stringify({
            message: "Invalid email",
          })
        );
      }

      if (
        updatedStudent.age < 18 ||
        updatedStudent.age > 60
      ) {
        res.writeHead(400, {
          "Content-Type": "application/json",
        });

        return res.end(
          JSON.stringify({
            message: "Age must be between 18 and 60",
          })
        );
      }

      const emailExists = students.find(
        (item) =>
          item.email.toLowerCase() ===
            updatedStudent.email.toLowerCase() &&
          item.id !== id
      );

      if (emailExists) {
        res.writeHead(400, {
          "Content-Type": "application/json",
        });

        return res.end(
          JSON.stringify({
            message: "Email already exists",
          })
        );
      }

      students[index] = {
        ...students[index],
        ...updatedStudent,
        id,
      };

      writeData(data);

      res.writeHead(200, {
        "Content-Type": "application/json",
      });

      res.end(JSON.stringify(students[index]));
    });

    return;
  }

  // =========================
  // DELETE STUDENT
  // =========================
  if (method === "DELETE" && path.startsWith("/students/")) {
    const id = Number(path.split("/")[2]);

    const index = students.findIndex((item) => item.id === id);

    if (index === -1) {
      res.writeHead(404, {
        "Content-Type": "application/json",
      });

      return res.end(
        JSON.stringify({
          message: "Student not found",
        })
      );
    }

    students.splice(index, 1);

    writeData(data);

    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    return res.end(
      JSON.stringify({
        message: "Student deleted successfully",
      })
    );
  }

  // =========================
  // NOT FOUND
  // =========================
  res.writeHead(404, {
    "Content-Type": "application/json",
  });

  res.end(
    JSON.stringify({
      message: "Route not found",
    })
  );
};

module.exports = studentRoutes;