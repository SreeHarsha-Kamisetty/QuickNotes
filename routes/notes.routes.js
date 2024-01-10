const express  = require("express");
const {auth} = require("../middleware/auth.middleware");
const {NotesModel} = require("../models/notes.model")

const NotesRouter = express.Router();

NotesRouter.use(auth);

NotesRouter.post("/create",async(req,res)=>{
    try {
        
        let new_note =  NotesModel(req.body);
        await new_note.save();
        res.status(200).json({Message:"New Note created",Notes:new_note});
    } catch (error) {
        res.status(400).json({Error:error});
    }

   
})

NotesRouter.get("/",async(req,res)=>{
    try {
        let {userID} = req.body
        let notes = await NotesModel.find({userID});
        if(notes.length==0){
            res.status(200).json({Message:"Its empty please starting adding some notes"})
        }
        else{
            res.status(200).json({Notes:notes});
        }
        
    } catch (error) {
        res.status(400).json({Error:error});
    }
    
})


NotesRouter.patch("/update/:id",async(req,res)=>{
    try{
        let noteID = req.params.id;
        let note = await NotesModel.findOne({_id:noteID});
        
        if(note.userID == req.body.userID){
            let payload = req.body;
            let updated_note = await NotesModel.findByIdAndUpdate({_id:noteID},payload);
            res.status(200).json({Message:"Note has been updated",updatedNote:updated_note});
        }
        else{
            res.status(200).json({Message:"You are not authorized to access this note"});
        }
    }
    catch(error){
        res.status(400).json({Error:error});
    }

})

NotesRouter.delete("/delete/:id",async(req,res)=>{
    try{
        let noteID = req.params.id;
        let note = await NotesModel.findOne({_id:noteID});
        
        if(note.userID == req.body.userID){
            let payload = req.body;
            let updated_note = await NotesModel.findByIdAndDelete({_id:noteID});
            res.status(200).json({Message:"Note has been Deleted"});
        }
        else{
            res.status(200).json({Message:"You are not authorized to access this note"});
        }
    }
    catch(error){
        res.status(400).json({Error:error});
    }
})

module.exports={
    NotesRouter
}