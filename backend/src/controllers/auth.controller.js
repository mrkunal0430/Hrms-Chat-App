import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import "dotenv/config";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // if i use ( new User ) then i have to save it in database by running command newUser.save()
    // if i use ( User.create ) then i don't have to save it in database by running command newUser.save()
    if (newUser) {
      generateToken(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
      });

      // send welcome Email to user

      try {
        await sendWelcomeEmail(
          newUser.email,
          newUser.fullName,
          process.env.CLIENT_URL,
        );
      } catch (error) {
        console.log("Error in sendWelcomeEmail : ", error);
      }
    } else {
      res.status(400).json({ message: "User invalid data" });
    }
  } catch (error) {
    console.log("Error in signup Controller : ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.log("Error in login Controller : ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (_, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log("Error in logout Controller : ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePicture } = req.body;

    if (!profilePicture) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const userId = req.user._id;

    const uploadResponse = cloudinary.uploader.upload(profilePicture);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: uploadResponse.secure_url },
      { new: true },
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateProfile Controller : ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
