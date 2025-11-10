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