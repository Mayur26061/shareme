const express = require("express");
const server = express()
const port = 8080
const cors = require("cors")
server.use(cors())
server.get('/',(req,res)=>{
    console.log("HHello")
    res.json({message:"Helllo"})
})
server.listen(port,()=>{
    console.log("Server is Running")
})