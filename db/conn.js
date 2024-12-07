const { connect } = require('mongoose')

connect(process.env.MONGOURL).then(()=>{
    console.log('Connecting...')
}).catch((err)=>{
    console.log(err)
})