import express from "express";
import dotenv from "dotenv";

import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);


app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
