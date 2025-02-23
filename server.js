const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const port = process.env.PORT || 3000; // Use uppercase PORT and provide a default value

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})
console.log(6+7);