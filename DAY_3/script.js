"use strict";

/* ===========================
   CONFIGURATION
=========================== */

const API_URL = "https://jsonplaceholder.typicode.com/posts";

const STORAGE_KEY = "posts";

const SESSION_KEY = "selectedPostId";

/* ===========================
   DOM ELEMENTS
=========================== */

const searchInput = document.getElementById("search");

const filterUser = document.getElementById("filterUser");

const sortBtn = document.getElementById("sortBtn");

const openAddModal = document.getElementById("openAddModal");

const postTableBody = document.getElementById("postTableBody");

const totalPosts = document.getElementById("totalPosts");

const totalUsers = document.getElementById("totalUsers");

/* ---------- Add Modal ---------- */

const addModal = document.getElementById("addModal");

const closeAddModal = document.getElementById("closeAddModal");

const cancelAddBtn = document.getElementById("cancelAddBtn");

const saveBtn = document.getElementById("saveBtn");

const modalTitle = document.getElementById("modalTitle");

const userIdInput = document.getElementById("userId");

const titleInput = document.getElementById("title");

const bodyInput = document.getElementById("body");

/* ---------- Details Modal ---------- */

const detailsModal = document.getElementById("detailsModal");

const closeModal = document.getElementById("closeModal");

const detailsText = document.getElementById("detailsText");

/* ---------- Action Modal ---------- */

const actionModal = document.getElementById("actionModal");

const closeActionModal = document.getElementById("closeActionModal");

const editBtn = document.getElementById("editBtn");

const deleteBtn = document.getElementById("deleteBtn");

const viewBtn = document.getElementById("viewBtn");

/* ===========================
   APPLICATION STATE
=========================== */

let posts = [];

let filteredPosts = [];

let selectedPost = null;

let isAscending = true;

let isEditMode = false;

/* ===========================
   LOCAL STORAGE
=========================== */

function savePostsToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function getPostsFromLocalStorage() {
  const storedPosts = localStorage.getItem(STORAGE_KEY);

  if (!storedPosts) {
    return null;
  }

  return JSON.parse(storedPosts);
}

/* ===========================
   SESSION STORAGE
=========================== */

function saveSelectedPost(id) {
  sessionStorage.setItem(SESSION_KEY, id);
}

function getSelectedPost() {
  return sessionStorage.getItem(SESSION_KEY);
}

function clearSelectedPost() {
  sessionStorage.removeItem(SESSION_KEY);
}

/* ===========================
   FETCH POSTS
=========================== */

async function fetchPosts() {
  try {
    const localPosts = getPostsFromLocalStorage();

    if (localPosts) {
      posts = localPosts;

      filteredPosts = [...posts];

      console.log("Loaded from Local Storage");

      return;
    }

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP Error : ${response.status}`);
    }

    const data = await response.json();

    posts = data;

    filteredPosts = [...posts];

    savePostsToLocalStorage();

    console.log("Loaded from API");
  } catch (error) {
    console.error("Failed to Fetch Posts", error);

    alert("Unable to load posts.");
  }
}

/* ===========================
   INITIALIZE APPLICATION
=========================== */

async function initializeApp() {
  await fetchPosts();

  console.log(posts);
}

initializeApp();
/* ===========================
   RENDER TABLE
=========================== */

function renderPosts(postList = filteredPosts) {
  postTableBody.innerHTML = "";

  if (postList.length === 0) {
    postTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No Posts Found
                </td>
            </tr>
        `;

    updateStatistics(postList);

    return;
  }

  postList.forEach((post) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${post.id}</td>

            <td>${post.userId}</td>

            <td>${post.title}</td>

            <td>${post.body.substring(0, 60)}...</td>

            <td>
                <button
                    class="action-btn"
                    data-id="${post.id}"
                >
                    ⋮
                </button>
            </td>
        `;

    postTableBody.appendChild(row);
  });

  updateStatistics(postList);
}

/* ===========================
   UPDATE STATISTICS
=========================== */

function updateStatistics(postList) {
  totalPosts.textContent = postList.length;

  const users = new Set(postList.map((post) => post.userId));

  totalUsers.textContent = users.size;
}

/* ===========================
   FIND POST
=========================== */

function findPostById(id) {
  return posts.find((post) => post.id === Number(id));
}

/* ===========================
   DETAILS MODAL
=========================== */

function showPostDetails(post) {
  detailsText.innerHTML = `

        <p><strong>ID :</strong> ${post.id}</p>

        <p><strong>User ID :</strong> ${post.userId}</p>

        <p><strong>Title :</strong></p>

        <p>${post.title}</p>

        <p><strong>Description :</strong></p>

        <p>${post.body}</p>

    `;

  detailsModal.style.display = "flex";
}

function closeDetailsModal() {
  detailsModal.style.display = "none";
}

/* ===========================
   ACTION MODAL
=========================== */

function openActionModal(postId) {
  selectedPost = findPostById(postId);

  if (!selectedPost) {
    return;
  }

  saveSelectedPost(postId);

  actionModal.style.display = "flex";
}

function closeAction() {
  actionModal.style.display = "none";
}

/* ===========================
   TABLE EVENTS
=========================== */

postTableBody.addEventListener("click", (event) => {
  const button = event.target.closest(".action-btn");

  if (!button) {
    return;
  }

  const postId = button.dataset.id;

  openActionModal(postId);
});

/* ===========================
   ACTION BUTTONS
=========================== */

viewBtn.addEventListener("click", () => {
  closeAction();

  const id = getSelectedPost();

  const post = findPostById(id);

  if (!post) {
    return;
  }

  showPostDetails(post);
});

closeModal.addEventListener("click", closeDetailsModal);

closeActionModal.addEventListener("click", closeAction);

/* ===========================
   UPDATE INITIALIZE
=========================== */

async function initializeApp() {
  await fetchPosts();

  renderPosts();

  console.log("Application Ready");
}

/* ===========================
   MODAL HELPERS
=========================== */

function openAddPostModal() {
  isEditMode = false;

  selectedPost = null;

  modalTitle.textContent = "Add Post";

  saveBtn.textContent = "Save Post";

  userIdInput.value = "";

  titleInput.value = "";

  bodyInput.value = "";

  addModal.style.display = "flex";
}

function openEditPostModal(post) {
  isEditMode = true;

  selectedPost = post;

  modalTitle.textContent = "Edit Post";

  saveBtn.textContent = "Update Post";

  userIdInput.value = post.userId;

  titleInput.value = post.title;

  bodyInput.value = post.body;

  addModal.style.display = "flex";
}

function closeAddPostModal() {
  addModal.style.display = "none";
}

/* ===========================
   VALIDATION
=========================== */

function validateForm() {
  const userId = Number(userIdInput.value.trim());

  const title = titleInput.value.trim();

  const body = bodyInput.value.trim();

  if (!userId || userId < 1 || userId > 10) {
    alert("User ID must be between 1 and 10.");

    return false;
  }

  if (title.length < 3) {
    alert("Title must contain at least 3 characters.");

    return false;
  }

  if (body.length < 10) {
    alert("Description must contain at least 10 characters.");

    return false;
  }

  return true;
}

/* ===========================
   CREATE POST
=========================== */

async function createPost() {
  try {
    const newPost = {
      userId: Number(userIdInput.value),

      title: titleInput.value.trim(),

      body: bodyInput.value.trim(),
    };

    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(newPost),
    });

    if (!response.ok) {
      throw new Error("Failed to create post.");
    }

    const createdPost = await response.json();

    const maxId = Math.max(...posts.map((post) => post.id), 0);
    createdPost.id = maxId + 1;

    posts.unshift(createdPost);

    filteredPosts = [...posts];

    savePostsToLocalStorage();

    renderPosts();

    closeAddPostModal();

    alert("Post added successfully.");
  } catch (error) {
    console.error(error);

    alert("Unable to create post.");
  }
}

/* ===========================
   UPDATE POST
=========================== */

async function updatePost() {
  try {
    const updatedPost = {
      ...selectedPost,

      userId: Number(userIdInput.value),

      title: titleInput.value.trim(),

      body: bodyInput.value.trim(),
    };

    const response = await fetch(`${API_URL}/${selectedPost.id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(updatedPost),
    });

    if (!response.ok) {
      throw new Error("Failed to update post.");
    }

    await response.json();

    const index = posts.findIndex((post) => post.id === selectedPost.id);

    posts[index] = updatedPost;

    filteredPosts = [...posts];

    savePostsToLocalStorage();

    renderPosts();

    closeAddPostModal();

    alert("Post updated successfully.");
  } catch (error) {
    console.error(error);

    alert("Unable to update post.");
  }
}

/* ===========================
   DELETE POST
=========================== */

async function deletePost() {
  if (!confirm("Delete this post?")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${selectedPost.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Delete failed.");
    }

    posts = posts.filter((post) => post.id !== selectedPost.id);

    filteredPosts = [...posts];

    savePostsToLocalStorage();

    renderPosts();

    closeAction();

    clearSelectedPost();

    alert("Post deleted successfully.");
  } catch (error) {
    console.error(error);

    alert("Unable to delete post.");
  }
}

/* ===========================
   SAVE BUTTON
=========================== */

saveBtn.addEventListener("click", () => {
  if (!validateForm()) {
    return;
  }

  if (isEditMode) {
    updatePost();
  } else {
    createPost();
  }
});

/* ===========================
   OPEN MODAL
=========================== */

openAddModal.addEventListener("click", openAddPostModal);

closeAddModal.addEventListener("click", closeAddPostModal);

cancelAddBtn.addEventListener("click", closeAddPostModal);

/* ===========================
   EDIT BUTTON
=========================== */

editBtn.addEventListener("click", () => {
  closeAction();

  const id = getSelectedPost();

  const post = findPostById(id);

  if (!post) {
    return;
  }

  openEditPostModal(post);
});

/* ===========================
   DELETE BUTTON
=========================== */

deleteBtn.addEventListener("click", deletePost);
/* ===========================
   USER PREFERENCES
=========================== */

const SETTINGS_KEY = "postSettings";

function saveSettings() {
  const settings = {
    search: searchInput.value,

    filter: filterUser.value,

    sortAscending: isAscending,
  };

  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function loadSettings() {
  const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY));

  if (!settings) {
    return;
  }

  searchInput.value = settings.search;

  filterUser.value = settings.filter;

  isAscending = settings.sortAscending;
}

/* ===========================
   SEARCH FILTER SORT
=========================== */

function applyFilters() {
  const searchValue = searchInput.value.trim().toLowerCase();

  const selectedUser = filterUser.value;

  filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchValue) ||
      post.body.toLowerCase().includes(searchValue);

    const matchesUser =
      selectedUser === "All" || String(post.userId) === selectedUser;

    return matchesSearch && matchesUser;
  });

  filteredPosts.sort((a, b) => {
    return isAscending
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title);
  });

  renderPosts();

  saveSettings();
}

/* ===========================
   SORT
=========================== */

sortBtn.addEventListener("click", () => {
  isAscending = !isAscending;

  sortBtn.textContent = isAscending ? "Sort A-Z" : "Sort Z-A";

  applyFilters();
});

/* ===========================
   SEARCH
=========================== */

searchInput.addEventListener("input", () => {
  applyFilters();
});

/* ===========================
   FILTER
=========================== */

filterUser.addEventListener("change", () => {
  applyFilters();
});

/* ===========================
   WINDOW EVENTS
=========================== */

window.addEventListener("click", (event) => {
  if (event.target === addModal) {
    closeAddPostModal();
  }

  if (event.target === actionModal) {
    closeAction();
  }

  if (event.target === detailsModal) {
    closeDetailsModal();
  }
});

/* ===========================
   ESC KEY SUPPORT
=========================== */

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  closeAddPostModal();

  closeAction();

  closeDetailsModal();
});

/* ===========================
   UPDATE UI
=========================== */

function refreshUI() {
  applyFilters();
}
/* ===========================
   INITIALIZATION
=========================== */

async function initializeApp() {
  try {
    console.log("Application Starting...");

    await fetchPosts();

    loadSettings();

    applyFilters();

    console.log("Application Ready");
  } catch (error) {
    console.error(error);

    alert("Application failed to start.");
  }
}

/* ===========================
   START APPLICATION
=========================== */

document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});
