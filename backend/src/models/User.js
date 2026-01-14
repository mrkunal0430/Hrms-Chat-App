import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },  
    email:{
        type: String,
        required: true,
        unique: true
    },  
    password:{
        type: String,
        required: true,
        minLength: 6
    },
    profilePicture:{
        type: String,
        default: ""
    }, 
    
},{timestamps:true}     // Add createdAt and updatedAt field
);

const User = mongoose.model("User", UserSchema);

export default User;