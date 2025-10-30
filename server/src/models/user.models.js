import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        minlength: 6,
    }
},{ timestamps: true });

const userModel = mongoose.model('User', userSchema);
export default userModel;