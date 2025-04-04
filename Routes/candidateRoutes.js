const express = require('express');
const router = express.Router();
const user = require('../Models/User');
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
router.get('/vote', jwtAuthMiddleware, async(req, res)=>{
    //* admin can't vote
    //* user can vote only one time
    candidateId = req.params.candidateId;
    userId = req.user.id;
    try{
        const candidate = await candidate.findById(candidateId);
        if(!candidate){
            return res.status(404).json({error: 'Candidate not found'});
        }
        const user = await user.findById(userId);
        if(!user){
            return res.status(404).json({error: 'User not found'});
        }
        if(candidate.role === 'admin'){
            return res.status(403).json({error: 'Admin can not vote'});
        }
        if(user.isVoted){
            return res.status(403).json({error: 'User already voted'});
        }
        //* update candidate document to record the vote
        candidate.votes.push({userId: user.id});
        candidate.voteCount ++;
        await candidate.save();

        //* update user document 
        user.isVoted = true;
        await user.save();
        return res.status(200).json({error: 'Voted successfully'});
    }
    catch(err){
        console.log('Internal server error');
        return res.status(400).json({error: 'Internal server error'});
    }
})
//* vote count
router.get('/vote/count', async(req,res)=>{
    try{
        //* find all candidate and sort them by vote count in desc
        const candidates = await candidates.find().sort({voteCount:'desc'});
        //* map the candidate to their name and voteCount
        const voteRecord = candidates.map((data)=>{
            return{
                party: data.party,
                count: voteCount
            }
        });
        return res.status(200).json(voteRecord);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }

})

// Get List of all candidates with only name and party fields
router.get('/', async (req, res) => {
    try {
        // Find all candidates and select only the name and party fields, excluding _id
        const candidates = await Candidate.find({}, 'name party -_id');

        // Return the list of candidates
        res.status(200).json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

