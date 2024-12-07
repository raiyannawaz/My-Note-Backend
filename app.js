require('dotenv').config()
require('./db/conn')
const express = require('express')
const app = express();
const port = process.env.PORT || 2000;
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use('/api/user', require('./routes/user'))
app.use('/api/note', require('./routes/note'))

app.listen(port, ()=>{
    console.log('Listening...')
})