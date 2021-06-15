const router = require('express').Router();
const bcrypt = require('bcryptjs')
const User = require('../users/users-model')
const {
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength} = require('./auth-middleware')





// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
router.post('/register',checkUsernameFree,checkPasswordLength, async (req,res,next) => {
try{
  const {username,password} = req.body
  const hash = bcrypt.hashSync(password,8,)
  const newUser = {username,password:hash}
  const createdUser = await User.add(newUser)
  res.json(createdUser)
}catch(err){
  next(err)
}
})

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */

router.post("/login",checkUsernameExists, async (req,res,next) => {
  try{
    const {password} = req.body
    //? DELETED OR COMMENTED OUT LINE BELOW BECAUSE OF WHAT WE DID IN AUTH MIDDLEWARE LINE 63
    // const [user] = await User.findBy({username}) 
if(bcrypt.compareSync(password, req.user.password)){
  req.session.user = req.user
  res.json({message:`Welcome ${req.user.username}`})
}else{
  next({ status:401,message:"Invalid credentials"})
}
  }catch(err){
    next(err)
  }
})


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */


/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */
router.get('/logout', (req, res, next) => {
if (req.session.user) {
  req.session.destroy(err => {
    if(err){
      next(err)
    }else{
      next({ 
        status:200,
        message:"logged out"
      })
    }
})
}else{
  next({ status:200,
    message:"no session"})
}
})

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});
 
// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router 
