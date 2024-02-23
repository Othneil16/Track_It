const express = require('express')
const config =  require('./config/config')
const cors = require('cors')

const port = process.env.port || 2035
const app = express()
app.use(cors())
app.use(express.json())



app.use('/', (req, res)=>{
    res.send('This is a tracking application software; where companies, riders and users can take real time track of their present location or package location')
})

app.listen(port,()=>{
    console.log(`Server is listening on port:${port}`)
})