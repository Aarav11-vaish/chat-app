import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    id :{

        type: String, 
        required:true, 
        unique: true,
    },

    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },

},
    { timestamps: true }
);


const User = mongoose.model("User", userSchema);

export default User;