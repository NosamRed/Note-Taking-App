import mongoose from "mongoose";
import app from "./app.js";

const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/NOTE_TAKING_APP_DB";

(async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("DB CONNECTED");

    const port = process.env.PORT ?? 3000;
    app.listen(port, () => {
      console.log(`Listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("error: ", error);
    process.exit(1);
  }
})();


consol.log("Test Statement");