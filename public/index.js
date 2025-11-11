import mongoose from "mongoose";
import readline from "readline";
import app from "./app.js";
import { findByUsername, changeNoteByTitle } from "./models.js";

const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/NOTE_TAKING_APP_DB";

(async () => {
  try {
    //Connect to the server
    await mongoose.connect(MONGO_URI);
    console.log("DB CONNECTED");

    const port = process.env.PORT ?? 3000;
    app.listen(port, () => {
      console.log(`Listening on http://localhost:${port}`);

      //Prompt for user inputs
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question("Enter username: ", (usernameInput) => {
  const username = usernameInput.trim();
  rl.question("Enter note title to update (or create): ", (titleInput) => {
    const title = titleInput.trim();
    rl.question("Enter new content: ", async (contentInput) => {
      try {
        const user = await findByUsername(username);
        if (!user) {
          console.log(`No user found with username: ${username}`);
          rl.close();
          return;
        }

        const updatedUser = await changeNoteByTitle(username, title, contentInput);
        if (!updatedUser) {
          console.log("Update failed (user not found).");
        } else {
          const output = { username: updatedUser.username, notes: updatedUser.notes ?? [] };
          console.log("Updated user notes:");
          console.log(JSON.stringify(output, null, 2));
        }
      } catch (err) {
        console.error("Error updating note:", err);
      } finally {
        rl.close();
      }
    });
  });
});
})} catch (err) {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  }
})();
//This is to test if the information from the codespaces gets save to the overall project

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

let currentUsername = null;

function show(el) { if (el) el.classList.remove("hidden"); }
function hide(el) { if (el) el.classList.add("hidden"); }

// Use existing HTML as-is: hide sections until login
hide(notesSection);
hide(addOrEditSection);

// Login button: set username and optionally load notes via GET endpoint
loadUserBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  if (!username) return alert("Please enter a username");
  currentUsername = username;
  welcomeEl.textContent = `Welcome, ${currentUsername}!`;
  // show notes area, keep login area unchanged
  show(notesSection);
  // try to load notes from server endpoint /api/get-user
  try {
    const resp = await fetch(`/api/get-user?username=${encodeURIComponent(currentUsername)}`);
    if (resp.ok) {
      const data = await resp.json();
      renderNotesList(data.notes ?? []);
    } else {
      notesListEl.textContent = `No user data loaded from server; logged in as ${currentUsername}.`;
    }
  } catch (err) {
    notesListEl.textContent = `Unable to load notes: ${err.message}`;
  }
});

// Toggle Add/Edit panel (keeps same HTML)
addOrEditBtn.addEventListener("click", () => {
  if (!currentUsername) return alert("Please login first");
  addOrEditSection.classList.toggle("hidden");
  if (!addOrEditSection.classList.contains("hidden")) {
    titleInput.value = "";
    contentInput.value = "";
    titleInput.focus();
  }
});

// Save note -> POST /api/update-note (calls changeNoteByTitle on server)
saveNoteBtn.addEventListener("click", async () => {
  if (!currentUsername) return alert("Please login first");
  const title = titleInput.value.trim();
  const content = contentInput.value;
  if (!title) return alert("Please enter a note title");

  saveNoteBtn.disabled = true;
  saveNoteBtn.textContent = "Saving...";

  try {
    const resp = await fetch("/api/update-note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: currentUsername, title, content })
    });
    const data = await resp.json();
    if (!resp.ok) {
      alert(`Save failed: ${data.error ?? resp.statusText}`);
    } else {
      renderNotesList(data.notes ?? []);
      addOrEditSection.classList.add("hidden");
    }
  } catch (err) {
    alert(`Network error: ${err.message}`);
  } finally {
    saveNoteBtn.disabled = false;
    saveNoteBtn.textContent = "Save Note";
  }
});

function renderNotesList(notes) {
  if (!Array.isArray(notes) || notes.length === 0) {
    notesListEl.textContent = "No notes yet.";
    return;
  }
  notesListEl.innerHTML = notes.map(n =>
    `<div class="note"><strong>${escapeHtml(n.title ?? "Untitled")}</strong><div class="note-content">${escapeHtml(n.content ?? "")}</div></div>`
  ).join("");
}

function escapeHtml(str) {
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

