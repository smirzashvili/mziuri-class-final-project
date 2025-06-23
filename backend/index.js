import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import connectDB from './db/connection.js'
import UsersRouter from './routes/users.js';
import { rateLimit } from 'express-rate-limit'
import helmet from "helmet";
import compression from 'compression';
import { Server } from 'socket.io';
import http from 'http';
import initializeSocket from './socket/socket.js';
import path from 'path';

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

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'dist')));

// app.use('/api/todos', auth, TodosRouter)
app.use('/api/users', UsersRouter)

// Socket.IO setup
initializeSocket(io); // Call the function to set up socket listeners

server.listen(process.env.PORT || 3003, () => {
    console.log('server has started')
    connectDB(process.env.CONNECTION_STRING)
})