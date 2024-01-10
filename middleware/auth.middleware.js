const jwt = require("jsonwebtoken");
require("dotenv").config();

let secret_key = process.env.secret_key

const auth = (req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    if(token){
        try {
            const decoded = jwt.verify(token,secret_key);
            if(decoded){
                
                req.body.username = decoded.username;
                req.body.userID = decoded.userID;
                
                next();
            }
        } catch (error) {
            res.status(200).json({err:error})
        }
    }
    else{
        res.status(400).json({Message:"Please Login!"});
    }
}

module.exports={
    auth
}