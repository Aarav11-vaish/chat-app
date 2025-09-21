import mongoose from "mongoose";
import Group from "./groupschema.js";
import User from "./userschema.js";

const groupMessageSchema = new mongoose.Schema({
  senderID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  groupID: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  text: String,
  image: String,
}, { timestamps: true });
const GroupMessage = mongoose.model("GroupMessage", groupMessageSchema);

export default GroupMessage;