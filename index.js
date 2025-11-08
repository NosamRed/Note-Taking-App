import mongoose from "mongoose";
import app from "./app.js";

(async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/Notes");
        console.log("DB CONNECTED");

        const onListening = () => {
            console.log(`Listening on http://localhost:3000`);
        }

        app.listen(3000, onListening);


    } catch (error) {
        console.error("error: ", error);
        throw error;
    }
})()