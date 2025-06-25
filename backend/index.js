import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/connection.js';
import cookieParser from 'cookie-parser';
import ProductsRouter from './routes/productRoutes.js'
import UsersRouter from './routes/usersRoutes.js';
import { rateLimit } from 'express-rate-limit'
import helmet from "helmet";
import compression from 'compression';
import logger from './middlewares/logger.js';
import { fileURLToPath } from 'url';
import { URL } from 'url'
import path from 'path'
dotenv.config()

const app = express()
const PORT = process.env.PORT

app.use(logger)
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 1000, 
  message: "Too many requests from this IP, please try again later"
})
app.use(limiter)




app.use(cors({
  origin: (origin, callback) => {
      callback(null, origin || '*'); 
  },    
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

app.use(helmet())
app.use('/api/products', ProductsRouter);
app.use('/api/users', logger, UsersRouter);
app.use(compression())


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  connectDB(process.env.CONNECTION_STRING)
});