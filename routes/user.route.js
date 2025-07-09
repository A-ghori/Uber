const express = require('express');
const router = express.Router();
const {body} = require ('express-validator')
const userController = require ('../controllers/user.controller'); 

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email Bhai Sahi Email Likh Chori Mat Kar'),
    
    body('fullname.firstname').isLength({min:5}).withMessage('Baba maa name dey ni bc?'),
    
    body('password').isLength({min:5}).withMessage("Firse chori kar raha !")


],
userController.registerUser,
)

router.post('/login',[
    body('email').isEmail().withMessage('Incorrect Email'),


    body('password').isLength({ min:5}).withMessage("Firse Galat Password diya tune")
],
userController.loginUser,
)



module.exports = router;