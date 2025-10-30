import userModel from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

async function registerUser (req, res) {

    const{ username, email, password } = req.body;

    const isUserAlreadyExist = await userModel.findOne({ email });
    if(isUserAlreadyExist){
        return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword
    })

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)
    
    res.cookie("token", token)

    res.status(201).json({
        message: "user register successfully",
        user:{
            _id: user._id,
        email: user.email,
        username: user.username
        }  
    })
}

async function loginUser (req, res) {
    const { email, password } = req.body;

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET);
    
    res.cookie("token", token);

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            _id: user._id,
            email: user.email,
            username: user.username
        }
    });
}

function logoutUser (req, res) {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
}


export {
    registerUser,
    loginUser,
    logoutUser
}
