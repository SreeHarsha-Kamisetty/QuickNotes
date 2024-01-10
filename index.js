const express = require("express");
const {connection} = require("./db");
const {UserRouter} = require("./routes/user.routes");
const {NotesRouter} = require("./routes/notes.routes");




const app = express();
app.use(express.json());
app.use("/users",UserRouter);
app.use("/notes",NotesRouter);


app.get("/",(req,res)=>{
    res.status(200).json({Message:"This is home page"});
})

app.listen(8080,async()=>{
    try {
        await connection;
        console.log("connected to DB");
        console.log(`Server is running at http://localhost:8080`);
    } catch (error) {
        console.log(error);
    }
    
})