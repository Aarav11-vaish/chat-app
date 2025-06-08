import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
const app = express();
dotenv.config();
app.use(cookieParser());

//apply cors
app.use(cors({
  origin: 'http://localhost:5173', // your Vite frontend
  credentials: true,              // allow cookies, auth headers
}));

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/chat-app");



const messageSchema = new mongoose.Schema({
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

},
    { timestamps: true }
);


const messagingSchema = new mongoose.Schema({
    senderID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverID:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },
    text:{
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
const User = mongoose.model("User", messageSchema);

app.post('/login', async (req, res) => {


    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }



        const token = generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            email: user.email,
            username: user.username,
            token: token
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
})

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        // console.log("Token:", token);

        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userid);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        req.user = user;
        next();
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}
// what will this function do?
// The protectRoute function is a middleware that checks for a valid JWT token in the request cookies.
// If the token is valid, it retrieves the user from the database and attaches it to the request object.


const generateToken = (userid, res) => {
    const token = jwt.sign({ userid }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        sameSite: 'strict', // Helps prevent CSRF attacks
        secure: process.env.NODE_ENV === 'development' // Use secure cookies in production
    })
    return token;
}
// what is the purpose of this function?
// The generateToken function creates a JWT token for the user and sets it as a cookie in the response.
// This token can be used for authentication in subsequent requests, allowing the server to verify the user's identity without requiring them to log in again.


app.post('/signup', async (req, res) => {
    const { fullName: username,email, password } = req.body;
    try {
        if (!email || !username || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);



        const newUser = new User({
            email,
            username,
            password: hashedPassword
        });
        // res.status(200).json({message: "Signup successful"});

        if (newUser) {

            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({ _id: newUser._id, email: newUser.email, username: newUser.username });

        }
        else {
            res.status(400).json({ error: "Signup failed" });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.get('/logout', (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0, // Set cookie to expire immediately
        })
        res.status(200).json({ message: "Logout successful" });
        console.log("logging out");


    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }

})

app.get('/users', protectRoute,async (req, res)=>{
try{

    const loggedinuser= req.user;
    const users =await User.find({_id: {$ne:loggedinuser._id}}).select("-password");// Exclude password from the response
    res.status(200).json(users);
}
catch(err){
    console.error(err, "Error in fetching users");
    res.status(500).json({ error: "Internal server error" });
}
})


app.post('/send/:id', protectRoute, async(req, res)=>{
    const {id} = req.params;
    const { text, image } = req.body;
    const senderID = req.user._id;
    const newmessage=new messageModel({
        senderID: senderID,
        receiverID: id,
        text: text,
        image: image
    })
    await newmessage.save()
    res.status(201).json(newmessage);
    // need to implement socket.io to send the message to the receiver in real-time
    
})
app.get('/checkAuth', protectRoute, (req, res) => {
    try {
        res.status(200).json(req.user);
    }
    catch (err) {
        console.error(err, "Error in checkAuth");
        
        res.status(500).json({ error: "Internal server error" });
    }
})

app.get('/:id', protectRoute, async (req, res) => {
    try{
const {id}=req.params;
const senderID = req.user._id;
const messages= await messageModel.find({
    $or: [
        { senderID: senderID, receiverID: id },
        { senderID: id, receiverID: senderID }
    ]
})

res.status(200).json(messages);


    }
    catch (err) {
        console.error(err, "Error in fetching user by ID");
        res.status(500).json({ error: "Internal server error" });
    }
})
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});



