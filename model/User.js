const { Schema, model } = require('mongoose')
const { genSalt, hash, compare } = require('bcrypt')
const { sign } = require('jsonwebtoken')

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    tokens: [{
        token: {
            type: String, 
            required: true
        }
    }]
})

UserSchema.methods.generateToken = async function(){
    let token = await sign({_id: this._id.toString()}, process.env.SECRET_KEY,{
        expiresIn: '30d'
    })

    this.tokens = [...this.tokens, {token}]

    await this.save()

    return token
}

UserSchema.pre('save', async function(next){
    if(this.isModified('password')){
        let salt = await genSalt(10);
        this.password = await hash(this.password, salt)
        this.confirmPassword = await hash(this.confirmPassword, salt)
    }
    next()
})

UserSchema.methods.comparePassword = async function (password) {
    let comPass = await compare(password, this.password)
    return comPass
}

const User = new model('User', UserSchema)

module.exports = User