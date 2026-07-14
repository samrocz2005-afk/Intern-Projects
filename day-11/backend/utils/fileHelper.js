const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../data/db.json");

const readData = () => {
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

module.exports = {
  readData,
  writeData,
};