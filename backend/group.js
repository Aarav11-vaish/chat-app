import mongoose from "mongoose";

const groupSchema =new mongoose.Schema ({
    name: {
        type: String,
        required: true,
    },
    roomid:{
        type: String,
        required: true,
        unique: true,
    }, 
    ispublic: {
        type: Boolean,
        default: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User',
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User',
    }],


}, {timestamps: true});
export default mongoose.model('Group', groupSchema);