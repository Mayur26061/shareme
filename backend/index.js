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

server.listen(port, () => {
    console.log("Server is Running");
    mongoose.connect(process.env.MONGODB_CONNECT_DB_URI);
});
