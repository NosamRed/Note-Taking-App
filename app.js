import express from "express";

const app = express();

app.use(express.json());

// example route that uses a model function
import { findByUsername } from "./models/user.js";

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

export default app;