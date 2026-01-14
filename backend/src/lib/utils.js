import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {

    const {JWT_SECRET , NODE_ENV} = process.env;
    if(!JWT_SECRET){
        throw new Error("Please provide JWT_SECRET in the environment variables");
    }
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: NODE_ENV === "development" ? false : true, // only for production
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token;
};  
