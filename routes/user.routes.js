const express = require("express")
const{UserModel} = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRouter = express.Router();
require('dotenv').config()

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