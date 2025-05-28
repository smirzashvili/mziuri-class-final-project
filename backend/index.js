import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import logger from './middlewares/logger.js'
import cookieParser from 'cookie-parser';
import connectDB from './db/connection.js'
import UsersRouter from './routes/users.js';
import { rateLimit } from 'express-rate-limit'
import helmet from "helmet";
import compression from 'compression';
import { Server } from 'socket.io';
import http from 'http';
import Messages from './models/messages.js';

const app = express()

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // React frontend
    methods: ["GET", "POST"],
    credentials: true
  }
});

dotenv.config()

// app.use(logger)
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, //5 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later"
})
app.use(limiter)

app.use(cors({
    origin: "http://localhost:5173",    
    credentials: true // Allow cookies to be sent
}));

app.use(helmet())
app.use(express.json())
app.use(cookieParser()); //to access cookies in node.js
app.use(compression())

// app.use('/api/todos', auth, TodosRouter)
app.use('/api/users', UsersRouter)


// Socket.IO setup
io.on('connection', async (socket) => {
  console.log('socket connected:', socket.id);

  // Send chat history
  const messages = await Messages.find().sort({ createdAt: 1 }).limit(100);
  socket.emit('chat_history', messages);

  // Receive message and save to DB
  socket.on('send_message', async (data) => {
    const newMessage = new Messages(data);
    console.log(newMessage)
    await newMessage.save();
    io.emit('receive_message', data); // broadcast
  });

  socket.on('disconnect', () => {
    console.log('socket disconnected:', socket.id);
  });
});


server.listen(process.env.PORT || 3003, () => {
    console.log('server has started')
    connectDB(process.env.CONNECTION_STRING)
})