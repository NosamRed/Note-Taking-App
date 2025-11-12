import express from "express";
import { findByUsername, changeNoteByTitle, verifyUserPassword } from "./models.js";

const app = express();

app.use(express.static("public"));

app.use(express.json());

app.get("/users/:username", async (req, res) => {
  try {
    const user = await findByUsername(req.params.username);
    if (!user) return res.status(404).json({ message: "Not found" });
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

app.put("/users/:username/notes", async (req, res) => {
  try {
    const username = req.params.username;
    const { title, content } = req.body;
    if (!title) return res.status(400).json({ message: "title required" });

    const updatedUser = await changeNoteByTitle(username, title, content ?? "");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    // return just username and notes if you prefer
    const response = {
      username: updatedUser.username,
      notes: updatedUser.notes ?? [],
    };
    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", express.json(), async (req, res) => {
  try {
    const { username, password } = req.body ?? {};
    if (!username || !password) return res.status(400).json({ message: "username and password required" });

    const safeUser = await verifyUserPassword(username, password);
    if (!safeUser) return res.status(401).json({ message: "invalid credentials" });

    return res.status(200).json(safeUser); // { username, notes }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});


export default app;
