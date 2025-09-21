import mongoose from "mongoose"
import User from "./userschema.js";
import Group from "./groupschema.js";


const messagingSchema = new mongoose.Schema({
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    text: {
        type: String,
    },
    image: {
        type: String,
    },
}, {
    timestamps: true
}
)
const messageModel = mongoose.model("Message", messagingSchema);
export default messageModel;
