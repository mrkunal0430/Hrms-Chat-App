import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;

    try{
            if(!fullName || !email || !password){
                return res.status(400).json({message:"All fields are required"});
            }

            if(password.length < 6){
                return res.status(400).json({message:"Password must be at least 6 characters long"});
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(email)){
                return res.status(400).json({message:"Invalid email format"});
            }

            const user = await User.findOne({email});
            if(user){
                return res.status(400).json({message:"User already exists"});
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await User.create({
                fullName, 
                email, 
                password:hashedPassword
            });

            // if i use ( new User ) then i have to save it in database by running command newUser.save()
            // if i use ( User.create ) then i don't have to save it in database by running command newUser.save()
        if(newUser){
            generateToken(newUser._id,res);
            
            return res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePicture:newUser.profilePicture,
            });
        }else{
            res.status(400).json({message:"User invalid data"});
        }

    }catch(error){
        console.log("Error in signup Controller : ",error);
        res.status(500).json({message:"Internal Server Error"});
    }
   

};

