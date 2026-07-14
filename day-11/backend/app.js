const http = require("http");
const studentRoutes = require("./routes/studentRoutes");

const app = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle Preflight Request
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  studentRoutes(req, res);
});

module.exports = app;