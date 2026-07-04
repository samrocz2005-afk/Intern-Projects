// ======================================
// VARIABLES
// ======================================

// Student Form
const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const departmentInput = document.getElementById("department");

const saveBtn = document.getElementById("saveBtn");

// Search
const searchInput = document.getElementById("search");

// Filter
const filterDepartment = document.getElementById("filterDepartment");

// Sort
const sortBtn = document.getElementById("sortBtn");

// Table
const tableBody = document.getElementById("studentTableBody");

// Statistics
const totalStudents = document.getElementById("totalStudents");
const averageAge = document.getElementById("averageAge");

// ======================================
// ADD STUDENT MODAL
// ======================================

const addModal = document.getElementById("addModal");
const openAddModal = document.getElementById("openAddModal");
const closeAddModal = document.getElementById("closeAddModal");
const cancelAddBtn = document.getElementById("cancelAddBtn");

// ======================================
// DETAILS MODAL
// ======================================

const detailsModal = document.getElementById("detailsModal");
const detailsText = document.getElementById("detailsText");
const closeModal = document.getElementById("closeModal");

// ======================================
// ACTION MODAL
// ======================================

const actionModal = document.getElementById("actionModal");
const closeActionModal = document.getElementById("closeActionModal");

const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");
const viewBtn = document.getElementById("viewBtn");

// ======================================
// VARIABLES
// ======================================
let isSorted = false;

let nextId = 8;

let selectedStudentId = null;

let editMode = false;

let editStudentId = null;

// ======================================
// STUDENT ARRAY
// ======================================

let students = [

    {
        id: 1,
        name: "Sam",
        age: 22,
        department: "CSE"
    },

    {
        id: 2,
        name: "Arun",
        age: 21,
        department: "ECE"
    },

    {
        id: 3,
        name: "Priya",
        age: 20,
        department: "IT"
    },

    {
        id: 4,
        name: "Karthik",
        age: 23,
        department: "EEE"
    },

    {
        id: 5,
        name: "Divya",
        age: 22,
        department: "CSE"
    },

    {
        id: 6,
        name: "Sooriya",
        age: 22,
        department: "IT"
    },

    {
        id: 7,
        name: "Kamal",
        age: 22,
        department: "CSE"
    }

];

// ======================================
// EVENT LISTENERS
// ======================================

saveBtn.addEventListener("click", addStudent);

sortBtn.addEventListener("click", sortStudents);


searchInput.addEventListener("input", applyFilters);

filterDepartment.addEventListener("change", applyFilters);

// ======================================
// OPEN ADD MODAL
// ======================================

openAddModal.addEventListener("click", function () {

    editMode = false;

    saveBtn.textContent = "Add Student";

    nameInput.value = "";
    ageInput.value = "";
    departmentInput.value = "";

    addModal.style.display = "flex";

});

// ======================================
// CLOSE ADD MODAL
// ======================================

closeAddModal.addEventListener("click", function () {

    addModal.style.display = "none";

});

cancelAddBtn.addEventListener("click", function () {

    addModal.style.display = "none";

});

// ======================================
// CLOSE MODAL ON OUTSIDE CLICK
// ======================================

window.addEventListener("click", function (event) {

    if (event.target === addModal) {

        addModal.style.display = "none";

    }

});
// ======================================
// VALIDATE STUDENT
// ======================================

function validateStudent(name, age, department) {

    // Name

    if (name === "") {

        alert("Student name is required.");
        return false;

    }

    // Name should contain only letters

    const namePattern = /^[A-Za-z ]+$/;

    if (!namePattern.test(name)) {

        alert("Name should contain only letters.");
        return false;

    }

    // Age

    if (isNaN(age)) {

        alert("Age is required.");
        return false;

    }

    if (age < 16 || age > 60) {

        alert("Age must be between 16 and 60.");
        return false;

    }

    // Department

    if (department === "") {

        alert("Department is required.");
        return false;

    }

    const departments = [

        "CSE",
        "ECE",
        "EEE",
        "IT"

    ];

    if (!departments.includes(department.toUpperCase())) {

        alert("Invalid Department.");
        return false;

    }

    // Duplicate Check

    const duplicate = students.some(student =>

        student.id !== editStudentId &&

        student.name.toLowerCase() === name.toLowerCase() &&

        student.department.toUpperCase() === department.toUpperCase()

    );

    if (duplicate) {

        alert("Student already exists.");
        return false;

    }

    return true;

}
// ======================================
// ADD / UPDATE STUDENT
// ======================================

function addStudent() {

    const name = nameInput.value.trim();
    const age = Number(ageInput.value);
    const department = departmentInput.value.trim().toUpperCase();

    if (!validateStudent(name, age, department)) {

        return;

    }

    if (name === "" || age <= 0 || department === "") {

        alert("Please fill all fields.");
        return;

    }

    // ==========================
    // UPDATE STUDENT
    // ==========================

    if (editMode) {

        students = students.map(student => {

            if (student.id === editStudentId) {

                return {

                    ...student,
                    name,
                    age,
                    department

                };

            }

            return student;

        });

        editMode = false;
        editStudentId = null;

        saveBtn.textContent = "Add Student";

    }

    // ==========================
    // ADD NEW STUDENT
    // ==========================

    else {

        const student = {

            id: nextId++,
            name,
            age,
            department

        };

        students.push(student);

    }

    // ==========================
    // CLEAR FORM
    // ==========================

    nameInput.value = "";
    ageInput.value = "";
    departmentInput.value = "";

    // Close Modal

    addModal.style.display = "none";

    // Refresh Table

    displayStudents();

}

// ======================================
// DISPLAY STUDENTS
// ======================================

function displayStudents(studentArray = students) {

    tableBody.innerHTML = "";

    studentArray.forEach(student => {

        const {

            id,
            name,
            age,
            department

        } = student;

        tableBody.innerHTML += `

            <tr>

                <td>${id}</td>

                <td>${name}</td>

                <td>${age}</td>

                <td>${department}</td>

                <td>

                    <button
                        class="action-btn"
                        onclick="openActionMenu(${id})">

                        ⋮

                    </button>

                </td>

            </tr>

        `;

    });

    displayStatistics(studentArray);

}

// ======================================
// STATISTICS
// ======================================

function displayStatistics(studentArray) {

    totalStudents.textContent = studentArray.length;

    if (studentArray.length === 0) {

        averageAge.textContent = "0";

        return;

    }

    const totalAge = studentArray.reduce(

        (sum, student) => sum + student.age,

        0

    );

    averageAge.textContent = (

        totalAge / studentArray.length

    ).toFixed(1);

}
// ======================================
// OPEN ACTION MENU
// ======================================

function openActionMenu(id) {

    selectedStudentId = id;

    actionModal.style.display = "flex";

}

// ======================================
// EDIT STUDENT
// ======================================

editBtn.addEventListener("click", function () {

    const student = students.find(student => student.id === selectedStudentId);

    if (!student) return;

    const {

        id,
        name,
        age,
        department

    } = student;

    editMode = true;

    editStudentId = id;

    nameInput.value = name;
    ageInput.value = age;
    departmentInput.value = department;

    saveBtn.textContent = "Update Student";

    actionModal.style.display = "none";

    addModal.style.display = "flex";

});

// ======================================
// DELETE STUDENT
// ======================================

deleteBtn.addEventListener("click", function () {

    students = students.filter(student => {

        return student.id !== selectedStudentId;

    });

    displayStudents();

    actionModal.style.display = "none";

});

// ======================================
// VIEW DETAILS
// ======================================

viewBtn.addEventListener("click", function () {

    const student = students.find(student => {

        return student.id === selectedStudentId;

    });

    if (!student) return;

    const {

        id,
        name,
        age,
        department

    } = student;

    detailsText.innerHTML = `

        <p><strong>ID :</strong> ${id}</p>

        <p><strong>Name :</strong> ${name}</p>

        <p><strong>Age :</strong> ${age}</p>

        <p><strong>Department :</strong> ${department}</p>

    `;

    actionModal.style.display = "none";

    detailsModal.style.display = "flex";

});

// ======================================
// CLOSE DETAILS MODAL
// ======================================

closeModal.addEventListener("click", function () {

    detailsModal.style.display = "none";

});

// ======================================
// CLOSE ACTION MODAL
// ======================================

closeActionModal.addEventListener("click", function () {

    actionModal.style.display = "none";

});

// ======================================
// CLOSE MODALS WHEN CLICKING OUTSIDE
// ======================================

window.addEventListener("click", function (event) {

    if (event.target === detailsModal) {

        detailsModal.style.display = "none";

    }

    if (event.target === actionModal) {

        actionModal.style.display = "none";

    }

});
// ======================================
// SEARCH STUDENTS
// ======================================

function searchStudents() {
    applyFilters();

    const keyword = searchInput.value
        .trim()
        .toLowerCase();

    if (keyword === "") {

        displayStudents();
        return;

    }

    const filteredStudents = students.filter(student => {

        const name = student.name.toLowerCase();
        const department = student.department.toLowerCase();
        const id = String(student.id);

        return (

            name.includes(keyword) ||
            department.includes(keyword) ||
            id.includes(keyword)

        );

    });

    displayStudents(filteredStudents);

}
// ======================================
// SEARCH + FILTER
// ======================================

function applyFilters() {

    const keyword = searchInput.value.trim().toLowerCase();

    const selectedDepartment = filterDepartment.value;

    let filteredStudents = [...students];

    // Search
    if (keyword !== "") {

        filteredStudents = filteredStudents.filter(student =>

            student.name.toLowerCase().includes(keyword) ||

            student.department.toLowerCase().includes(keyword) ||

            String(student.id).includes(keyword)

        );

    }

    // Department Filter
    if (selectedDepartment !== "All") {

        filteredStudents = filteredStudents.filter(student =>

            student.department === selectedDepartment

        );

    }

    // Sort
    if (isSorted) {

        filteredStudents.sort((a, b) =>

            a.name.localeCompare(b.name)

        );

    }

    displayStudents(filteredStudents);

}
// ======================================
// FILTER STUDENTS
// ======================================

function filterStudents() {
    applyFilters();

    const department = filterDepartment.value;

    if (department === "All") {

        displayStudents();
        return;

    }

    const filteredStudents = students.filter(student => {

        return student.department === department;

    });

    displayStudents(filteredStudents);

}

// ======================================
// SORT STUDENTS
// ======================================

function sortStudents() {

    isSorted = !isSorted;

    applyFilters();

}

// ======================================
// FIRST LOAD
// ======================================

displayStudents();