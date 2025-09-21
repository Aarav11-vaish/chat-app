import mongoose from "mongoose";
import Group from "./groupschema.js";
import User from "./userschema.js";


const invitationSchema = new mongoose.Schema({
    groupid: {
        type: mongoose.Schema.Types.ObjectId,// Reference to the Group model
        ref: 'Group',
        required: true
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
}, { timestamps: true });

const Invitation = mongoose.model("Invitation", invitationSchema);
export default Invitation;