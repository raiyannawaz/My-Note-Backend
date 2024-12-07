const express = require('express')
const router = express.Router()
const fetchuser = require('../middleware/fetchuser')
const { check, validationResult, body } = require('express-validator')
const Note = require('../model/Note')

router.get('/getnotes', fetchuser, async (req, res)=>{
    try{

        let notes = await Note.find({userId: req._id})
        res.status(202).json(notes)

    }
    catch(err){
        console.log(err)
        res.status(404).json(err)
    }
})

router.post('/addnote', [
    check('title').notEmpty().withMessage('Title is required').isLength({max: 15})
    .withMessage('Title cannot exeed more than 15 characters'),
    check('description').notEmpty().withMessage('Description is required'),
    check('tag').notEmpty().withMessage('Tag is required')
], fetchuser, async (req, res)=>{
    try{

        let result = await validationResult(req)

        if(!result.isEmpty()){
            return res.status(404).json({message: result.errors[0].msg})
        }

        let { title, description, tag } = await req.body;

        let newNote = await Note.create({userId: req._id, title, description, tag})
        res.status(202).json({newNote, message: 'Note added'})

    }
    catch(err){
        console.log(err)
        res.status(404).json(err)
    }
})

router.put('/updatenote/:id', [
    body('title').notEmpty().withMessage('Title is required').isLength({max: 15})
    .withMessage('Title cannot exeed more than 15 characters'),
    body('description').notEmpty().withMessage('Description is required'),
    body('tag').notEmpty().withMessage('Tag is required')
], fetchuser, async (req, res)=>{
    try{

        let _id = req.params.id;

        let note = await Note.findOne({_id})

        if(!note){
            return res.status(404).json({message: 'Note not exist'})
        }
        
        if(note.userId.toString() !== req._id){
            return res.status(404).json({message: 'Not not allowed to update'})
        }

        let result = await validationResult(req)

        if(!result.isEmpty()){
            return res.status(404).json({message: result.errors[0].msg})
        }

        let { title, description, tag } = req.body

        let newNote = {}

        if(title){
            newNote = {...newNote, title}
        }
        if(description){
            newNote = {...newNote, description}
        }
        if(tag){
            newNote = {...newNote, tag}
        }

        await Note.findByIdAndUpdate(_id, newNote)

        res.status(202).json({message: 'Note updated'})

    }
    catch(err){
        console.log(err)
        res.status(404).json(err)
    }
})

router.delete('/deletenote/:id', fetchuser, async (req, res)=>{
    try{

        let _id = await req.params.id;
        
        let note = await Note.findOne({_id})

        if(!note){
            return res.status(404).json({message: 'Note note exist'})
        }

        if(note.userId.toString() !== req._id){
            return res.status(404).json({message: 'Note not allowed to delete'})
        }
        
        await Note.findByIdAndDelete(_id)
        res.status(202).json({message: 'Note deleted'})
        
    }
    catch(err){
        console.log(err)
        res.status(404).json(err)
    }
})

module.exports = router