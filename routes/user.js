const express = require('express')
const router = express.Router()
const { validationResult, check } = require('express-validator')
const User = require('../model/User')
const fetchuser = require('../middleware/fetchuser')

router.get('/getuser', fetchuser, async (req, res)=>{
    try{
        let user = await User.findOne({_id: req._id})
        res.status(202).json( user)
    }
    catch(err){
        console.log(err)
        res.status(404).json(err)
    }
})

router.post('/register', 
    [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
    check('password').notEmpty().withMessage('Password is required').isLength({min: 8}).withMessage('Password requires minimum 8 characters'),
    check('confirmPassword').notEmpty().withMessage('Confirm password is required').isLength({min: 8})
    .withMessage('Confirm password requires minimum 8 characters').custom((value, {req})=>{
        if(value!==req.body.password){
            throw new Error(`Password doesn't match`)
        }
        return true
    })
], async (req, res)=>{
    try{
        
        let result = await validationResult(req)

        if(!result.isEmpty()){
            return res.status(404).json({message: result.errors[0].msg})
        }

        let { name, email, password, confirmPassword } = await req.body;

        let userExist = await User.findOne({email})

        if(userExist){
            return res.status(404).json({message: 'User already exist'})
        }

        let response = await User.create({name, email, password, confirmPassword})

        let token = await response.generateToken()

        res.status(202).json({token, message: 'Registered successful'}) 

    }
    catch(err){
        console.log(err)
        res.status(404).json({message: err})
    }
})

router.post('/login', [
    check('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
    check('password').notEmpty().withMessage('Password is required').isLength({min: 8}).withMessage('Password requires minimum 8 characters')
], async (req, res)=>{
    try{

        let result = validationResult(req);

        if(!result.isEmpty()){
            return res.status(404).json({message: result.errors[0].msg})
        }

        let { email, password } = await req.body

        let userExist = await User.findOne({email})

        if(!userExist){
            return res.status(404).json({message: 'User not exist'})
        }

        let comPass = await userExist.comparePassword(password)

        if(!comPass){
            return res.status(404).json({message: 'Wrong password'})
        }

        let token = await userExist.generateToken();
        res.status(202).json({token, message: 'Login successful'})

    }
    catch(err){
        console.log(err)
        res.status(404).json(err)
    }
})

router.get('/logout', fetchuser, async (req, res)=>{
    try{
        let user = await User.findOne({_id: req._id})

        // user.tokens = [];

        user.tokens = user.tokens.filter(({token})=>{
            return token !== req.token
        })

        user.save()

        res.status(202).json({message: 'Logged out'})
    }
    catch(err){
        console.log(err)
        res.status(404).json(err)
    }
})

module.exports = router