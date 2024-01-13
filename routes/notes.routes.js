const express  = require("express");
const {auth} = require("../middleware/auth.middleware");
const {NotesModel} = require("../models/notes.model")

const NotesRouter = express.Router();

NotesRouter.use(auth);



/**
 * @swagger
 * components:
 *      schemas:
 *          Notes:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: string
 *                          description: Auto-generated id of the Note
 *                      title:
 *                          type: string
 *                          description: Title of the Note
 *                      body:
 *                          type: string
 *                          description: Body/description of the Note
 *                      userID:
 *                          type: string
 *                          description: Id of the user to whom the note belongs
 *                      username:
 *                          type: string
 *                          description: Username of the note owner
 *      securitySchemes:
 *          bearerAuth:
 *              type: http
 *              scheme: bearer
 *              bearerFormat: JWT           
 */


/**
 * @swagger
 * /notes/create:
 *      post:
 *          summary: Used to create new note
 *          tags: [Notes]
 *          security:
 *              - bearerAuth: []
 *          requestBody: 
 *                  required: true
 *                  content:
 *                        application/json:
 *                             schema:
 *                                   type: object
 *                                   properties:
 *                                         title:
 *                                             type: string
 *                                             description: Title of the note
 *                                         body:
 *                                              type: string
 *                                              description: Body/description of the note
 *          responses:
 *                  200:
 *                      description: Completion of creating new notes
 *                      content:
 *                            application/json:
 *                              schema:
 *                                  type: object
 *                                  $ref: "#/components/schemas/Notes"
 *                  400:
 *                      description: Error message
 *                      content: 
 *                            application/json:
 *                              schema:
 *                                  type: object
 *                                  properties:
 *                                          error:
 *                                              type: string
 *                                              description: Error Message
 *              
 *                                          
 */
NotesRouter.post("/create",async(req,res)=>{
    try {
        
        let new_note =  NotesModel(req.body);
        await new_note.save();
        res.status(200).json({Message:"New Note created",Notes:new_note});
    } catch (error) {
        res.status(400).json({Error:error});
    }

   
})

/**
 * @swagger
 * /notes:
 *     get:
 *          summary: List all the notes of the logged in user
 *          tags: [Notes]
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: List of all notes of the logged in user
 *                  content:
 *                          application/json:
 *                                  schema:
 *                                      type: array
 *                                      $ref: "#/components/schemas/Notes"
 *              400:
 *                      description: Error message
 *                      content: 
 *                            application/json:
 *                              schema:
 *                                  type: object
 *                                  properties:
 *                                          error:
 *                                              type: string
 *                                              description: Error Message
 */

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

/**
 * @swagger
 * /notes/update/{id}:
 *     patch:
 *          summary: Update notes by ID
 *          tags: [Notes]
 *          security: 
 *              - bearerAuth: []
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                description: Note ID to update
 *                schema:
 *                  type: string
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              title: 
 *                                  type: string
 *                                  description: Update notes title
 *                              body:
 *                                  type: string
 *                                  description: Update notes body 
 *          responses:
 *              200:
 *                  description: Updated details of the notes
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      description: Success message
 *                                  updatedNote:
 *                                      type: object
 *                                      description: details of the notes
 *                                      $ref: "#/components/schemas/Notes"
 *              400:
 *                      description: Error message
 *                      content: 
 *                            application/json:
 *                              schema:
 *                                  type: object
 *                                  properties:
 *                                          error:
 *                                              type: string
 *                                              description: Error Message
 *              
 */
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
            res.status(400).json({Message:"You are not authorized to access this note"});
        }
    }
    catch(error){
        res.status(400).json({Error:error});
    }

})
/**
 * @swagger
 * /notes/delete/{id}:
 *     delete:
 *          summary: Update notes by ID
 *          tags: [Notes]
 *          security: 
 *              - bearerAuth: []
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                description: Note ID to delete
 *                schema:
 *                  type: string
 *          responses:
 *              200:
 *                  description: Delete success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      description: Success message
 *              400:
 *                      description: Error message
 *                      content: 
 *                            application/json:
 *                              schema:
 *                                  type: object
 *                                  properties:
 *                                          error:
 *                                              type: string
 *                                              description: Error Message
 *              
 */
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