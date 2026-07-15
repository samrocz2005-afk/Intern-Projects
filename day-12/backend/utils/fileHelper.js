const fs = require("fs/promises");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "data", "db.json");

const readDatabase = async () => {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });

    try {
      await fs.access(DB_PATH);
    } catch {
      await fs.writeFile(
        DB_PATH,
        JSON.stringify(
          {
            students: [],
            books: [],
          },
          null,
          2
        ),
        "utf-8"
      );
    }

    const data = await fs.readFile(DB_PATH, "utf-8");

    return JSON.parse(data);
  } catch (error) {
    console.error("Read Database Error:", error);
    throw error;
  }
};

const writeDatabase = async (data) => {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });

    await fs.writeFile(
      DB_PATH,
      JSON.stringify(data, null, 2),
      "utf-8"
    );

    return true;
  } catch (error) {
    console.error("Write Database Error:", error);
    throw error;
  }
};

module.exports = {
  readDatabase,
  writeDatabase,
};