const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next)=>{
    //* first request header has authorize or not
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({error: 'Token is not found'});
    }
    //* extraxt jwt token from request header
    const token = authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({error: 'Unauthorized'});
    }
    try{
        //* verify jwt token
        const decoded = jwt.verify(token, process.env.jwtSecret);
        req.user = decoded;
        next();
    }
    catch(error){
        console.error(err);
        return res.status(401).json({error: 'Token is invalid'});
    }
}
//* function to generate jwt token
const jsonwebtoken = (user)=>{
    // * Generate jwt token using userdata
    return jwt.sign({user}, process.env.jwtSecret,{expiresIn: '3000'});
}
module.exports = {jwtAuthMiddleware, jsonwebtoken};