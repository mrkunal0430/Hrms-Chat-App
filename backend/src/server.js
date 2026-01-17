import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import path from "path";
import connectDB from "./lib/db.js";


const app = express();

const __dirname = path.resolve();

const PORT = process.env.PORT || 5000;

app.use(express.json());  // for parsing the json data - req.body
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}));

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

// make ready for the deployement
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (_, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    })
}


app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
    connectDB();
}
);
