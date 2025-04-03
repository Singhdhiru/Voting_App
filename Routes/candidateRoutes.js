const express = require('express');
const router = express.Router();
const user = require('../Models/user');
const bodyParser = require('body-parser');
const {jwtAuthMiddleware, generateToken} = require('../jwt');
const candidate = require('../Models/candidate');

const checkAdminRole = async(userId)=>{
    try{
        const user = await user.findById(userId);
        if(user.role === 'admin'){
            return true;
        }
    }
    catch(error){
        return false;
    }
}
//* Post route for add new user 
router.post('/', jwtAuthMiddleware, async(req,res)=>{
    try{
        if(!await checkAdminRole(req.user.id)){
            return res.status(401).json({error: 'user does not admin role'});
        }
        const data = req.body; //* extrat data from req body
        ///* create a new candidate document using mongoose model
        const newCandidate = new candidate(data);
        //* save new candidate to data base
        const response = await new newCandidate.save();
        console.log('data save');
        res.status(200).json({response: response});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal error '});
    }
})

//* Update candidatedata using put method'
router.put('/:candidateId', jwtAuthMiddleware, async(req,res)=>{
    try{
        if(!await checkAdminRole(req.user.id)){
            return res.status(401).json({error: 'user does not admin role'});
        }
        const candidateId = req.params.candidateId; //* extract candidate id from req params
        const updatedCandidateData = req.body; //* extract data from req body
        const updateCandidate = await candidate.findByIdAndUpdate(candidateId, updatedCandidateData,{
            new: true, //* return upadate data
            runValidators: true, //* Run mongoose validator
        });
        if(!updateCandidate){
            return res.status(200).json({error: 'Candidate not found' });
        }
        console.log('Candidate update');
        res.status(200).json({updateCandidate});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal error'});
    }
})

//* delete candidate
router.delete('/:candidateId', jwtAuthMiddleware, async(req,res)=>{
    try{
        if(!await checkAdminRole(req.user.id)){
            return res.status(401).json({error: 'User does not have admin role'});
        }
        const candidateId = req.params.candidateId;//* extract data from URL params
        const deleteCandidate = await candidate.findByIdAndDelete(candidateId);
        if(!deleteCandidate){
            return res.status(404).json({error: 'candidate not found in DB'});
        }
        console.log('candiadte Delete Successfully');
        res.status(200).json({deleteCandidate});

    }
    catch(err){
        console.log(err);
        return res.status(500).json({erroe: 'Internal server error'});
    }
})

//* let's start voting


