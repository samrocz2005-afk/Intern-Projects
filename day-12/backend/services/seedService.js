const axios = require("axios");

const {
  readDatabase,
  writeDatabase,
} = require("../utils/fileHelper");

const USERS_API = "https://dummyjson.com/users";

const OMDB_API_KEY = "4494fe2c";
const OMDB_BASE_URL = "https://www.omdbapi.com/";

const seedDatabase = async () => {
  try {
    // =========================
    // Fetch Students
    // =========================
    const usersResponse = await axios.get(USERS_API);

    const students = usersResponse.data.users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      age: user.age,
      gender: user.gender,
      university: user.university,
    }));

    // =========================
    // Fetch Movies
    // =========================
    const movieResponse = await axios.get(
      `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=batman`
    );

    if (movieResponse.data.Response === "False") {
      throw new Error(movieResponse.data.Error);
    }

    const books = await Promise.all(
      movieResponse.data.Search.map(async (movie, index) => {
        const detail = await axios.get(
          `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${movie.imdbID}`
        );

        return {
          id: index + 1,
          imdbID: movie.imdbID,
          title: movie.Title,
          author: detail.data.Director || "Unknown Director",
          year: movie.Year,
          price: 500,
          stock: 20,
          image:
            movie.Poster !== "N/A"
              ? movie.Poster
              : "https://via.placeholder.com/150",
        };
      })
    );

    // =========================
    // Save to db.json
    // =========================
    const db = await readDatabase();

    db.students = students;
    db.books = books;

    await writeDatabase(db);

    console.log("Database Seeded Successfully");
    console.log(`Students : ${students.length}`);
    console.log(`Books    : ${books.length}`);

    return {
      message: "Database seeded successfully",
      students: students.length,
      books: books.length,
    };
  } catch (error) {
    console.error("Seed Error:", error.message);
    throw error;
  }
};

module.exports = {
  seedDatabase,
};