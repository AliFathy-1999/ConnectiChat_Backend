const express = require('express');
const { asycnWrapper, AppError } = require('../lib/index');

const { messageController } = require('../controllers/index');
const { Auth } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const { signIn } = require('../Validations/user');
const { userValidator } = require('../Validations/index');
const { upload } = require('../middlewares/imageMiddleware');
const router = express.Router();

// Send a MESSAGE  

router.post('/:chat', Auth, async (req, res, next) => {
  const sender = req.user._id;
  const { params : { chat } } = req
  const { body : {
      content
    }} = req;

    const user = messageController.sendMessage({
        sender, content, chat
    });
    const [err, data] = await asycnWrapper(user);
    if (err) return next(err);
    res.status(201).json({ status : 'success', data });
  });

// Sign in 

router.post('/signin', validate(signIn), async (req, res, next) => {
  try {
    const { userName, password } = req.body;    
    const data = await userController.signIn({ userName, password });    
    res.status(200).json({status : 'success', data })
  } catch (err) {
    next(err);
  }
});

// Get My Data

router.get('/', Auth, validate(signIn), async (req, res) => {
  try {
    const myID = req.user._id   
    const data = await userController.getMe(myID);    
    res.status(200).json({status : 'success', data })
  } catch (err) {
    next(err);
  }
});

module.exports = router;

