import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/connection.js';
import productRoutes from './routes/productRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT


app.use(cors());
app.use(express.json());
app.use('/api/products', productRoutes);



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  connectDB(process.env.CONNECTION_STRING)
});