import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }
}, { _id: false }); // optional: prevent separate _id for each note

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  notes: { type: [NoteSchema], default: [] }
}, { timestamps: true, strict: false });

const User = mongoose.model("User", UserSchema, "users");
export default User;

export function findByUsername(username) {
  return User.findOne({ username }).lean().exec();
}