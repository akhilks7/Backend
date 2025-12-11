// 7.import dotenv
require("dotenv").config()

// 1. import express 
const express = require("express")

// 5. import cros 
const cors = require("cors");

// 8. import router
const router =require("./router")

require("./db/connection")

// 2. import express 
const bookstoreserver =express()

// 6. tell server to use cors
bookstoreserver.use(cors())

bookstoreserver.use(express.json())

// 9. tell server to use router
bookstoreserver.use(router)

bookstoreserver.use("/uploadImages",express.static("./uploadImages"))

// 3. create port 3 
const PORT =3000

// 4. tell server to lisen
bookstoreserver.listen(PORT,()=>{
    console.log(`running successfully at ${PORT}`);  
})

bookstoreserver.get("/",(req,res)=>{
    res.status(200).send(`running sucessfully and waiting`)
})