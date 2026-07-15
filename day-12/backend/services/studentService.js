const fs = require("fs/promises");
const path = require("path");

const DB_PATH = path.join(__dirname, "../data/db.json");


// Read database
const readDatabase = async () => {
  const data = await fs.readFile(DB_PATH, "utf-8");

  return JSON.parse(data);
};


// Write database
const writeDatabase = async (data) => {
  await fs.writeFile(
    DB_PATH,
    JSON.stringify(data, null, 2)
  );
};


// Get all students
const getStudents = async () => {
  const db = await readDatabase();

  return db.students;
};


// Get student by id
const getStudentById = async (id) => {
  const db = await readDatabase();

  const student = db.students.find(
    (student) => student.id === Number(id)
  );

  if (!student) {
    throw new Error("Student not found");
  }

  return student;
};


// Create student
const createStudent = async (studentData) => {
  const db = await readDatabase();

  const newStudent = {
    id: Date.now(),
    ...studentData
  };

  db.students.push(newStudent);

  await writeDatabase(db);

  return newStudent;
};


// Update student
const updateStudent = async (id, studentData) => {
  const db = await readDatabase();

  const index = db.students.findIndex(
    (student) => student.id === Number(id)
  );


  if (index === -1) {
    throw new Error("Student not found");
  }


  db.students[index] = {
    ...db.students[index],
    ...studentData
  };


  await writeDatabase(db);

  return db.students[index];
};


// Delete student
const deleteStudent = async (id) => {
  const db = await readDatabase();

  const index = db.students.findIndex(
    (student) => student.id === Number(id)
  );


  if (index === -1) {
    throw new Error("Student not found");
  }


  const deletedStudent = db.students.splice(index, 1);


  await writeDatabase(db);

  return deletedStudent[0];
};


module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};