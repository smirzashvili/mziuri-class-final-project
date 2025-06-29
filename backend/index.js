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
import { fileURLToPath } from 'url';
import { URL } from 'url';
import Users from './models/users.js';
import ChatRooms from './models/chatRooms.js';
import Messages from './models/messages.js';
import {hashPassword} from './utils/bcrypt.js'

const app = express()

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://demo-melodymatch.onrender.com"], // React frontend
    credentials: true
  } 
});

dotenv.config()

// app.use(logger)
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, //5 minutes
    max: 500, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later"
})
app.use(limiter)

app.use(cors({
    origin: ["http://localhost:5173", "https://demo-melodymatch.onrender.com"], // React frontend
    credentials: true // Allow cookies to be sent
}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "*"],
      mediaSrc: ["'self'", "*"],
      imgSrc: ["'self'", "*", "data:"],  // note: no quotes around data: here
      connectSrc: ["'self'", "*"],
      scriptSrc: ["'self'", "*"],
    } 
  }
}));
app.use(express.json())
app.use(cookieParser()); //to access cookies in node.js
app.use(compression())

// app.use('/api/todos', auth, TodosRouter)
app.use('/api/users', UsersRouter)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Socket.IO setup
initializeSocket(io); // Call the function to set up socket listeners

//query to delete guests
// setTimeout(async () => {
//   const allowedEmails = [
//     "test1@gmail.com", "test2@gmail.com", "test3@gmail.com", "bot@bot.local", 
//     "wilsonmalon@gmail.com", "anishprajapati@gmail.com", "leonardozorzi@gmail.com", "anastasiakhardina@gmail.com", "angelinabishep@gmail.com"
//   ];
  
//   await Users.deleteMany({ email: { $nin: allowedEmails } });
//   await ChatRooms.deleteMany({});
//   await Messages.deleteMany({});

//   await Users.updateMany(
//     { email: { $in: allowedEmails } }, // filter allowed users
//     { $set: { likedUsers: [], dislikedUsers: [], matches: [] } }       // set likedUsers to empty array
//   );
// }, 4999)

//query to add user
// setTimeout(async () => {
//   const hashedPassword = await hashPassword('angelinabishep@gmail.com')

//   const newUser = new Users({
//       fullName: 'Angelina Bishep',
//       email: 'angelinabishep@gmail.com',
//       city: 'Tbilisi',
//       password: hashedPassword,
//       gender: 'female',
//       favoriteGenre: 'Punk',
//       favoriteInstrument: 'Bass',
//       date: '1997-01-26',
//       bio: "Portraits. Concerts. Reports.",
//       avatarIndex: 2,
//       media: [
//         'https://images.unsplash.com/photo-1547390531-4f359384980b?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//         'https://images.unsplash.com/photo-1547391856-d4a48f1e394f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//         'https://images.unsplash.com/photo-1543573981-f8599fecdbc8?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
//       ],
//   });

//   await newUser.save()

// }, 4999)

server.listen(process.env.PORT || 3003, () => {
    console.log('server has started')
    connectDB(process.env.CONNECTION_STRING) 
})