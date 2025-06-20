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

dotenv.config()

const app = express()
const PORT = process.env.PORT

app.use(logger)
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 100, 
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
app.use(compression)



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  connectDB(process.env.CONNECTION_STRING)
});