const { Schema, model } = require('mongoose')

const NoteSchema = new Schema({
    userId: {
        type: Schema.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const Note = new model('Note', NoteSchema)

module.exports = Note;