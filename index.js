const dotenv = require('dotenv');
dotenv.config({path:"./.env"});
const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const User = require('./schema');
const app = express();
const port = process.env.PORT;

app.use(express.static('static'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});
mongoose.connect(process.env.MONGO_URL,{
  useNewUrlParser : true,
  useUnifiedTopology : true,
}).then((conn)=>{
  console.log("Connected to database")
})
.catch((err)=>{
  console.log("Error connecting to database: ",err.message)
})

const create = async (req,res)=>{
  try{
    const {name,email,password} = req.body;
    const user = new User({name,email,password});
    await user.save();
    res.status(201).json({message:`User created succesfully`});
  }
  catch(err){
    if(err === `ValidationError`){
      res.status(400).json({message:`Validation Error` , error: err.message})
    }
    else{
      res.status(500).json({message:`Server error` , error: err.message})
    }
  }
} 


app.post("/api/users", create);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
 