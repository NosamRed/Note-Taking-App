import mongoose from "mongoose";
import readline from "readline";
import app from "./app.js";
import {
  findByUsername,
  changeNoteByTitle,
  verifyUserPassword,
} from "./models.js";

const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/local";
//"mongodb://localhost:27017/NOTE_TAKING_APP_DB";

(async () => {
  try {
    //Connect to the server
    await mongoose.connect(MONGO_URI);
    console.log("DB CONNECTED");

    const port = process.env.PORT ?? 3000;
    app.listen(port, () => {
      console.log(`Listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  }
})();
