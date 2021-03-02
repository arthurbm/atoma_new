const express = require('express');
const authMiddleware = require('../middlewares/auth');

const jwt = require('jsonwebtoken');

const authConfig = require("../config/auth.json");

const User = require('../models/User');

const router = express.Router();

router.use(authMiddleware);

function generateToken(params = {}){
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400, //um dia em segundos
  });
}

//List
router.get('/', async (req, res) => {
  try{
    const users = await User.find().populate();
    return res.send({ users });
  } 
  catch(err){
    console.log(err)
  }
  
});

//Show
router.get('/:userID', async (req, res) => {
  try{
    const user = await User.findById(req.params.userID).populate();
    return res.send({ user });
  } 
  catch(err){
    console.log(err)
  }
  
});




//update2
router.put("/:userId", async (req, res) => {
  try {
    
    const user = await User.findByIdAndUpdate(req.params.userId, req.body)
    user.password = undefined
    return res.send(
      {
        user,
        token: generateToken({ id: user.id })
      }  
    )
  } catch (err) {
    console.log(err)
    return res.status(400).send({ error: "Error updating user" })
  }
})

//Delete
router.delete('/:userID', async (req,res) => {
  try {
    await User.findByIdAndDelete(req.params.userID)
    return res.send() 
  }
  catch (err) {
    return res.status(400).send({ error: "Error removing user" })
  }
});
module.exports = app => app.use('/users', router);