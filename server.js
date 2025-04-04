const express = require('express')
const app = express();
const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); // req.body
const PORT = process.env.PORT || 3000;

// Import the router files
const userRoutes = require('./Routes/userRoutes');
const candidateRoutes = require('./Routes/candidateRoutes');

// Use the routers
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);


app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
})

//* Db connection
db.on('open', () => {
    console.log('Database connection established successfully');
});

process.on('SIGINT', () => {
    db.close(() => {
        console.log('Database connection closed due to app termination');
        process.exit(0);
    });
});
