// script.js - updated to use Render service as API_BASE

// Use local backend during development, otherwise use the deployed Render URL
const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:3000"
  : "https://note-taking-app-p2tx.onrender.com";

// Elements (script is loaded with `defer` in index.html)
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loadUserBtn = document.getElementById("loadUser");
const showSignupBtn = document.getElementById("show-signup");
const signupForm = document.getElementById("signup-form");
const signupMessage = document.getElementById("signup-message");
const backToLoginBtn = document.getElementById("back-to-login");
const logoutBtn = document.getElementById("logout-btn");

const loginSection = document.getElementById("login-section");
const signupSection = document.getElementById("signup-section");
const welcomeEl = document.getElementById("welcome");
const notesListEl = document.getElementById("notesList");
const notesSection = document.getElementById("notesSection");
const addOrEditBtn = document.getElementById("addOrEditNote");
const addOrEditSection = document.getElementById("addOrEditNoteSection");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const saveNoteBtn = document.getElementById("saveNote");

let currentUser = null;

// Helpers
function show(el) {
  if (!el) return;
  el.classList.remove("hidden");
}
function hide(el) {
  if (!el) return;
  el.classList.add("hidden");
}
function setDisabled(el, val) {
  if (!el) return;
  el.disabled = !!val;
}
function safeJson(res) {
  return res.text().then((t) => {
    try {
      return t ? JSON.parse(t) : {};
    } catch {
      return {};
    }
  });
}

// Escape text for safe insertion (prevents XSS)
function escapeText(str) {
  if (str == null) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// INITIAL STATE: show login only (consistent with HTML classes)
document.addEventListener("DOMContentLoaded", () => {
  show(loginSection);
  hide(signupSection);
  hide(notesSection);
  hide(addOrEditSection);
  if (signupMessage) signupMessage.textContent = "";
});

// Toggle to show signup (hide login)
if (showSignupBtn) {
  showSignupBtn.addEventListener("click", () => {
    hide(loginSection);
    show(signupSection);
    const su = document.getElementById("signup-username");
    if (su) su.focus();
  });
}

// Back button on signup -> show login
if (backToLoginBtn) {
  backToLoginBtn.addEventListener("click", () => {
    hide(signupSection);
    show(loginSection);
    const u = document.getElementById("username");
    if (u) u.focus();
  });
}

// Signup form handling
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("signup-username").value.trim();
    const password = document.getElementById("signup-password").value;
    if (!username || !password) {
      if (signupMessage) {
        signupMessage.style.color = "red";
        signupMessage.textContent = "Username and password are required.";
      }
      return;
    }
    if (signupMessage) signupMessage.textContent = "";
    setDisabled(signupForm.querySelector("button[type=submit]"), true);

    try {
      const res = await fetch(`${API_BASE}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await safeJson(res);
      if (res.ok) {
        if (signupMessage) {
          signupMessage.style.color = "green";
          signupMessage.textContent = "Sign up successful! Redirecting to login...";
        }
        signupForm.reset();
        setTimeout(() => {
          hide(signupSection);
          show(loginSection);
          if (usernameInput) usernameInput.value = username;
          if (passwordInput) passwordInput.focus();
        }, 700);
      } else {
        if (signupMessage) {
          signupMessage.style.color = "red";
          signupMessage.textContent = data.error || data.message || "Sign up failed.";
        } else {
          alert(data.error || data.message || "Sign up failed.");
        }
      }
    } catch (err) {
      if (signupMessage) {
        signupMessage.style.color = "red";
        signupMessage.textContent = "Error connecting to server.";
      } else {
        alert("Error connecting to server.");
      }
    } finally {
      setDisabled(signupForm.querySelector("button[type=submit]"), false);
    }
  });
}

// Login button
if (loadUserBtn) {
  loadUserBtn.addEventListener("click", async () => {
    const username = usernameInput?.value?.trim() ?? "";
    const password = passwordInput?.value ?? "";
    if (!username || !password) return alert("Please enter both username and password.");

    setDisabled(loadUserBtn, true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const body = await safeJson(res);
        return alert(body.message || body.error || "Login failed.");
      }
      const user = await safeJson(res);
      // server should return { username, notes }
      currentUser = user;
      welcomeEl.textContent = `Welcome back, ${escapeText(user.username)}.`;
      renderNotes(user.notes ?? []);
      show(notesSection);
      hide(loginSection);
      hide(signupSection);
      if (logoutBtn) show(logoutBtn);
    } catch (err) {
      alert("Error logging in: " + (err?.message || err));
    } finally {
      setDisabled(loadUserBtn, false);
    }
  });
}

// Logout handler
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    currentUser = null;
    welcomeEl.textContent = "";
    notesListEl.innerHTML = "";
    hide(notesSection);
    hide(addOrEditSection);
    show(loginSection);
    if (usernameInput) usernameInput.value = "";
    if (passwordInput) passwordInput.value = "";
    if (logoutBtn) hide(logoutBtn);
  });
}

// show add/edit section
if (addOrEditBtn) {
  addOrEditBtn.addEventListener("click", () => {
    if (!currentUser) return alert("Please login first.");
    if (addOrEditSection.classList.contains("hidden")) {
      show(addOrEditSection);
      titleInput.value = "";
      contentInput.value = "";
      titleInput.focus();
    } else {
      hide(addOrEditSection);
    }
  });
}

// Save note button
if (saveNoteBtn) {
  saveNoteBtn.addEventListener("click", async () => {
    if (!currentUser) return alert("Please log in first!");
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    if (!title) return alert("Title is required!");

    setDisabled(saveNoteBtn, true);
    try {
      const res = await fetch(`${API_BASE}/users/${encodeURIComponent(currentUser.username)}/notes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) {
        const body = await safeJson(res);
        return alert(body.message || "Failed to save note.");
      }
      const update = await safeJson(res);
      if (update && Array.isArray(update.notes)) {
        currentUser.notes = update.notes;
        renderNotes(update.notes);
      }
      alert("Note saved successfully.");
      hide(addOrEditSection);
    } catch (err) {
      alert("Error saving note: " + (err?.message || err));
    } finally {
      setDisabled(saveNoteBtn, false);
    }
  });
}

// Render notes safely (no innerHTML with user content)
function renderNotes(notes) {
  notesListEl.innerHTML = "";
  if (!notes || notes.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No notes yet.";
    notesListEl.appendChild(p);
    return;
  }
  notes.forEach((note) => {
    const wrapper = document.createElement("div");
    wrapper.className = "note";

    const titleEl = document.createElement("strong");
    titleEl.textContent = note.title ?? "";

    const contentEl = document.createElement("p");
    contentEl.textContent = note.content ?? "";

    wrapper.appendChild(titleEl);
    wrapper.appendChild(contentEl);

    notesListEl.appendChild(wrapper);
  });
}