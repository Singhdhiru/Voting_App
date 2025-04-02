const express = require('express');
const router = express.Router();
const user = require('../Models/user');
const bodyParser = require('body-parser');
const {jwtAuthMiddleware, generateToken} = require('../jwt');
const user = require('../Models/user');
const user = require('../Models/user');

//* post route to add new user
router.post('/signup', async(req, res)=>{
    try{
        const data = req.body; //* Assuming req body contains user data

        //* check if their user user already admin user
        const adminUser = await user.findOne({role: 'admin'});
        if(data.role === 'admin' && adminUser){
            return res.status(400).json({error: 'Admin user already exist'});
        }

        // * check adhar number must be 12 digit
        if(data.aadharCardNumber !== 12){
            return res.status(400).json({error: 'Aadhar card number must be 12 digit'});
        }

        //* check if user already exist with same aadhar card number
        const userExist = await user.findOne({aadharCardNumber: data.aadharCardNumber});
        if(userExist){
            return res.status(400).json({error: 'User already exist in data base'});
        }

        //* create new user using moongoose document
        const newUser = new user(data);
        //* save the new user
        const response = await newUser.save();
        console.log('data Save');

        const payLoad = {
            id: response.id
        };
        console.log(JSON.stringify(payLoad));
        const token = generateToken(payLoad);
        res.status(200).json({response:response, token: token});

    }
    catch(error){
        console.log(err);
        return res.status(5005).json({error: 'Internal Server Error'});
    }
})
//* Post route to Login user
router.post('/login', async(req,res)=>{
    try{
        const {aadharCardNumber, password} = req.body; //* extract the paswword and aadhar from request body
        //* check aadhar and password is missing
        if(!aadharCardNumber || !password){
            return res.status(400).json({error: 'Aadhar card and password is required'});
        }

        //* find user by aadhar card number
        const user = await user.findOne({aadharCardNumber: aadharCardNumber});
        if(!user || !await user.comparePassword(password)){
            return res.status(401).json({error: 'Invalid user and password'});
        }

        //* generate Token
        const payload = {
            id: user.id
        }
        const token = generateToken(payload);
        //* return token as a response
        res.json({token});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal Server error'});
    }
})

//* get profile route
router.get('/profile', jwtAuthMiddleware, async(req, res)=>{
    try{
        const userData = req.body;
        const userId = userData.id;
        const user = await user.findId(userId);
        res.status(200).json({user});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal Server error'});
    }
})
// //* Update password
router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // extract id from the token
        const {currentPassword, newPassword} = req.body; // extract newPassword and password from req body
        
        // check newPassword and old password both are present 
        if (!currentPassword || !newPassword) {
            return res.status(400).json({error: 'New password and old password both are required'});
        }
        
        // find user by id
        const user = await User.findById(userId); // Fixed: User model name capitalized and using findById method
        
        // if user not exist or password is incorrect
        if (!user || !(await user.comparePassword(currentPassword))) {
            return res.status(400).json({error: 'Invalid user or password'});
        }
        
        // Update password
        user.password = newPassword;
        await user.save();
        console.log('Password updated');
        res.status(200).json({message: 'Password updated successfully'});
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }  
});
module.exports = router;