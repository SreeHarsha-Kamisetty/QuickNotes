const express = require("express")
const{UserModel} = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRouter = express.Router();
require('dotenv').config()
const swaggerUI = require("swagger-ui-express");



/**
 * @swagger
 * /users/register:
 *   post:
 *      summary: Register a new user 
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              description: Name of the user
 *                          email:
 *                              type: string
 *                              description: Email of the user
 *                          password:
 *                              type: string
 *                              description: Password of the user
 *      responses:
 *          200: 
 *              description: Message about successful registration and the user details
 *              content: 
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                      message: 
 *                                              type: string
 *                                              description: Message about the registration status
 *                                      Details:
 *                                              type: string
 *                                              description: Details of the user
 *                                              content: 
 *                                                      application/json:
 *                                                          schema:
 *                                                              type: object
 *                                                              properties:
 *                                                                      email:
 *                                                                            type: string
 *                                                                            description: Email of the registered user 
 *                                                                      username:
 *                                                                               type: string
 *                                                                               description: Username of the registered user
 *                                                                      password:
 *                                                                                type: string
 *                                                                                description: Hashed password of the user
 */
UserRouter.post("/register",(req,res)=>{

    let payload = req.body;

    bcrypt.hash(payload.password,5,async(err,hash)=>{
        try {
            payload.password = hash
            let new_user = new UserModel(payload);
            await new_user.save();
            res.status(200).json({Message:"User registered",Details:payload});
        } catch (error) {
            console.log(err);
        }
    })

})


/**
 * @swagger
 * /users/login:
 *   post:
 *       summary: For user login with registered email and password
 *       tags: [Users]
 *       requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              description: Registered Email of the user
 *                          password:
 *                              type: string
 *                              description: Password
 *       responses:
 *          200:
 *              description: login successful
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties: 
 *                              Message:
 *                                  type: string
 *                                  description: Message 
 *                              token:
 *                                  type: string
 *                                  description: Token for the logged in user
 *                              user:
 *                                      type: object
 *                                      properties:
 *                                          email:
 *                                              type: string
 *                                              description: Email of the logged in user
 *                                          username:
 *                                              type: string
 *                                              description: Username of the logged in user
 *                                          password:
 *                                               type: string
 *                                               description: hashed password
 *          400:
 *              description: Bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties: 
 *                              Message:
 *                                  type: string
 *                                  description: Error Message        
 */

UserRouter.post("/login",async (req,res)=>{
    try {
        let {email,password} = req.body;

    let user = await UserModel.findOne({email});

    if(user){
        bcrypt.compare(password,user.password,(err,result)=>{
           
            if(result){
                let token_payload = {userID:user._id,username:user.username};
                let secret_key = process.env.secret_key
                let token = jwt.sign(token_payload,secret_key);
                res.status(200).json({Message:"login succcessful",token,user});
            }
            else{
                
                res.status(400).json({Message:"Invalid Credentials"})
            }
        })
    }
    else{
        res.status(400).json({Message:"User doesnt exists . Please Register"});
    }
    } catch (error) {
        res.status(400).json({error:error});
    }
    

})


module.exports={
    UserRouter
}