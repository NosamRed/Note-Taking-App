// Client-side JavaScript implementation to ensure DOM elements are accessible
// Get HTML elements
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loadUserBtn = document.getElementById("loadUser");
const welcomeEl = document.getElementById("welcome");
const notesListEl = document.getElementById("notesList");
const notesSection = document.getElementById("notesSection");
const addOrEditBtn = document.getElementById("addOrEditNote");
const addOrEditSection = document.getElementById("addOrEditNoteSection");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const saveNoteBtn = document.getElementById("saveNote");

let currentUser = null;

// Hide or show sections functions
function show(el) {
  el.classList.remove("hidden");
}
function hide(el) {
  el.classList.add("hidden");
}

// Initially hide notes and edit section
hide(notesSection);
hide(addOrEditSection);

// Login button
loadUserBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  try {
    const res = await fetch(`/users/${encodeURIComponent(username)}`);
    if (!res.ok) return alert("User not found dewb.");

    const user = await res.json();

    if (user.password !== password) {
      alert("Incorrect password dumby.");
      return;
    }

    currentUser = user;
    welcomeEl.textContent = `Ah, so you have returned ${user.username}...`;
    renderNotes(user.notes ?? []);

    show(notesSection);
    hide(document.querySelector(".login-section"));
  } catch (err) {
    alert("Error loading user: " + err.message);
  }
});

// show add/edit section
addOrEditBtn.addEventListener("click", () => {
  if (!currentUser) return alert("Please login first.");
  addOrEditSection.classList.toggle("hidden");
  titleInput.value = "";
  contentInput.value = "";
});

// Save note button
saveNoteBtn.addEventListener("click", async () => {
  if (!currentUser) return alert("Please log in first!");

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title) {
    alert("Title is required!");
    return;
  }

  try {
    const res = await fetch(
      `/users/${encodeURIComponent(currentUser.username)}/notes`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      }
    );
    if (!res.ok) {
      alert("Failed to save note.");
      return;
    }
    const update = await res.json();
    renderNotes(update.notes);
    alert("Note saved successfully.");
    addOrEditSection.classList.add("hidden");
  } catch (err) {
    alert("Error saving note: " + err.message);
  }
});

function renderNotes(notes) {
  notesListEl.innerHTML = "";
  if (!notes || notes.length === 0) {
    notesListEl.innerHTML = "<p>No notes yet.</p>";
    return;
  }
  notes.forEach((note) => {
    const div = document.createElement("div");
    div.className = "note";
    div.innerHTML = `<strong>${note.title}</strong><p>${note.content}</p>`;
    notesListEl.appendChild(div);
  });
}
