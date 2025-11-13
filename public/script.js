// Client-side JavaScript implementation to control view states and auth flows
// Get HTML elements
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

// helpers
function show(el) {
  if (!el) return;
  el.classList.remove("hidden");
}
function hide(el) {
  if (!el) return;
  el.classList.add("hidden");
}

// INITIAL STATE: show login only
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
    // focus first input
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
      signupMessage.style.color = "red";
      signupMessage.textContent = "Username and password are required.";
      return;
    }
    signupMessage.textContent = "";
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        signupMessage.style.color = "green";
        signupMessage.textContent =
          "Sign up successful! Redirecting to login...";
        signupForm.reset();
        // Return to login and prefill username
        setTimeout(() => {
          hide(signupSection);
          show(loginSection);
          if (usernameInput) usernameInput.value = username;
          if (passwordInput) passwordInput.focus();
        }, 900);
      } else {
        signupMessage.style.color = "red";
        signupMessage.textContent = data.error || "Sign up failed.";
      }
    } catch (err) {
      signupMessage.style.color = "red";
      signupMessage.textContent = "Error connecting to server.";
    }
  });
}

// Login button uses /login endpoint which verifies password server-side
if (loadUserBtn) {
  loadUserBtn.addEventListener("click", async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    if (!username || !password)
      return alert("Please enter both username and password.");

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return alert(body.message || body.error || "Login failed.");
      }
      const user = await res.json();
      currentUser = user;
      welcomeEl.textContent = `Ah, so you have returned ${user.username}...`;
      renderNotes(user.notes ?? []);
      show(notesSection);
      hide(loginSection);
      hide(signupSection);
      // ensure logout button visible and wired
      if (logoutBtn) logoutBtn.style.display = "inline-block";
    } catch (err) {
      alert("Error logging in: " + err.message);
    }
  });
}

// Logout handler: clear session and return to login
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    currentUser = null;
    // clear UI
    welcomeEl.textContent = "";
    notesListEl.innerHTML = "";
    hide(notesSection);
    hide(addOrEditSection);
    show(loginSection);
    // clear inputs
    if (usernameInput) usernameInput.value = "";
    if (passwordInput) passwordInput.value = "";
  });
}

// show add/edit section
if (addOrEditBtn) {
  addOrEditBtn.addEventListener("click", () => {
    if (!currentUser) return alert("Please login first.");
    addOrEditSection.classList.toggle("hidden");
    titleInput.value = "";
    contentInput.value = "";
  });
}

// Save note button
if (saveNoteBtn) {
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
}

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
