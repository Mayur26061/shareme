const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoute = require("./routes/userRoute");
require("dotenv").config();
const port = 8080;

server.use(bodyParser.json());
server.use(cors());
server.use("/user", userRoute);

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_DB_URI);
        console.log("DB connected")
    } catch (err) {
        console.log("Failed to connect DB", err)
    }
}
server.listen(port, () => {
    console.log("Server is Running");
    connectDB()
});
