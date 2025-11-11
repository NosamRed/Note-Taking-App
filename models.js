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

const User = mongoose.model("User", UserSchema, "NOTES_COLLECTION");
export default User;

export function findByUsername(username) {
  return User.findOne({ username }).lean().exec();
}

export async function changeNoteByTitle(username, title, content) {
  // try to update an existing note with that title
  const updateResult = await User.findOneAndUpdate(
    { username, "notes.title": title },
    { $set: { "notes.$.content": content } },
    { new: true, lean: true }
  ).exec();

  if (updateResult) {
    return updateResult; // user document after update (lean)
  }

  // no existing note with that title — push a new note
  const pushResult = await User.findOneAndUpdate(
    { username },
    { $push: { notes: { title, content } } },
    { new: true, lean: true, upsert: false }
  ).exec();

  return pushResult;
}
