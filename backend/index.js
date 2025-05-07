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

const app = express()

dotenv.config()

app.use(logger)
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, //5 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later"
})
app.use(limiter)

app.use(cors({
    origin: (origin, callback) => {
        callback(null, origin || '*'); // Allow any origin
    },    
    credentials: true // Allow cookies to be sent
}));

app.use(helmet())
app.use(express.json())
app.use(cookieParser()); //to access cookies in node.js
app.use(compression())

// app.use('/api/todos', auth, TodosRouter)
app.use('/api/users', UsersRouter)

app.listen(process.env.PORT || 3003, () => {
    console.log('server has started')
    connectDB(process.env.CONNECTION_STRING)
})