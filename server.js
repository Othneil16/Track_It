const express = require('express')
const config =  require('./config/config')
const cors = require('cors')
const companyRouter = require('./routers/companyRout')
const riderRouter = require('./routers/riderRout')
const userRouter = require('./routers/userRout')

const port = process.env.port || 2035
const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/v1", companyRouter)
app.use("/api/v1", riderRouter)
app.use("/api/v1", userRouter)


app.use('/', (req, res)=>{
    res.send('This is a tracking application software; where companies, riders and users can take real time track of their present location or package location')
})

app.use('/uploads', express.static('uploads'))


app.listen(port,()=>{
    console.log(`Server is listening on port:${port}`)
})