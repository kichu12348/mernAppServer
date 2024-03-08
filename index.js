const express = require('express');
const app = express();
const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');
require('dotenv').config();


//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//mongoDB connection
const {connect} = require('./services/connect');
connect(process.env.MONGO_URL);

const PORT = process.env.PORT

//routes
app.use('/user', userRoutes);
app.use('/message', messageRoutes);

app.get('/', (req, res) => {
    
    res.json({
        message: 'Welcome to the server',
    })

});

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

//socket.io
const io = require('socket.io')(server,{
    pingTimeout: 60000,
    cors: {
        origin: '*',
    }
});

io.on('connection', (socket) => {
    
    socket.on('setup',(userData)=>{
        socket.join(userData)
        socket.emit('connected')
    })

    socket.on('joinRoom', (roomID) => {
        socket.join(roomID);
    });

    socket.on('sendMessage', (message) => {
        io.to(message.roomID).emit('message', message);
    });
});