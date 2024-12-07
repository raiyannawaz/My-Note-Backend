const { verify } = require('jsonwebtoken')

const fetchuser = async (req, res, next) =>{
    try{
        let token = await req.headers['auth-token']
        let verifyToken = await verify(token, process.env.SECRET_KEY)
        
        req._id = verifyToken._id;
        req.token = token
        next()
    }
    catch(err){
        console.log(err)
        res.status(404).json(err)
    }
}

module.exports = fetchuser