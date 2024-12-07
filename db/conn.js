const { connect } = require('mongoose')

connect(process.env.MONGO_URL).then(()=>{
    console.log('Connecting...')
}).catch((err)=>{
    console.log(err)
})