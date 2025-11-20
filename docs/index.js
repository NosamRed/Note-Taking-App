import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./models.js";

dotenv.config();
const port = process.env.PORT ?? 3000;

async function start() {
  try {
    await connectDB();
    console.log("DB CONNECTED");

    app.listen(port, () => {
      console.log(`Listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  }
}

start();
