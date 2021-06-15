const router = require("express").Router();
const User = require("./users-model");
const  {restricted}  = require("../auth/auth-middleware");


router.get("/",restricted,(req, res, next) => {
User.find()
.then((users) =>{
  res.json(users)
})
.catch(next)
})


// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!


/**
  [GET] /api/users

  This endpoint is RESTRICTED: only authenticated clients
  should have access.

  response:
  status 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response on non-authenticated:
  status 401
  {
    "message": "You shall not pass!"
  }
 */

router.use((err, req, res, next) => {
  // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
    customMessage: "Something went wrong inside the users router",
  });
});

// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router;
