const express = require("express");
const {connection} = require("./db");
const {UserRouter} = require("./routes/user.routes");
const {NotesRouter} = require("./routes/notes.routes");
const cors = require("cors");
const morgan = require("morgan");
require('dotenv').config();
const PORT = process.env.PORT || 8080
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerUI = require('swagger-ui-express');
const { version } = require("mongoose");

const options = {
    definition: {
        openapi: "3.0.0",
        info:{
            title: "Notes API Docs",
            version: "1.0.0"
        },
        servers:[
            {
                url: "http://localhost:8080"
            },
            {
                url: "https://notesapi-jpgf.onrender.com/"
            }
        ],
        
    },
    apis:["./routes/*.js"]
}

const openAPIspec = swaggerjsdoc(options);



const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use("/apidocs",swaggerUI.serve,swaggerUI.setup(openAPIspec));
app.use("/users",UserRouter);
app.use("/notes",NotesRouter);


app.get("/",(req,res)=>{
    res.status(200).json({Message:"This is home page"});
})

app.listen(PORT,async()=>{
    try {
        await connection;
        console.log("connected to DB");
        console.log(`Server is running at http://localhost:${PORT}`);
    } catch (error) {
        console.log(error);
    }
    
})

module.exports={
    openAPIspec
}