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


/*
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const UserModel = require('./models/user');
const CompanyModel = require('./models/company');
const PackageModel = require('./models/package');
// Import other models as needed

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// Listen for changes in the UserModel
const userChangeStream = UserModel.watch();
userChangeStream.on('change', (change) => {
    io.emit('user_updated', { change });
});

// Listen for changes in the CompanyModel
const companyChangeStream = CompanyModel.watch();
companyChangeStream.on('change', (change) => {
    io.emit('company_updated', { change });
});

// Listen for changes in the PackageModel
const packageChangeStream = PackageModel.watch();
packageChangeStream.on('change', (change) => {
    io.emit('package_updated', { change });
});

// Add listeners for other models as needed

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
*/


/*
<script src="/socket.io/socket.io.js"></script>
<script>
    const socket = io();

    // Listen for 'package_updated' events emitted by the server
    socket.on('package_updated', (data) => {
        console.log('Package updated:', data);
        // Update UI or perform other actions based on the received data
    });
</script>
*/