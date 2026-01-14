import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const {MONGO_URL} = process.env;

        if(!MONGO_URL){
            throw new Error("Please provide MONGO_URL in the environment variables");
        }

        const conn = await mongoose.connect(MONGO_URL);
        console.log("MongoDB connected", conn.connection.host);
    } catch (error) {
        console.log("Error in MongoDb : ",error);
        process.exit(1);   // 1 for fail and 0 for the success
    }
}

export default connectDB;
