import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'; // Import the jsonwebtoken library
import productRouter from './routes/productRouter.js';
import userRouter from './routes/userRouter.js';
import dotenv from "dotenv";
import orderRouter from './routes/orderRouter.js';
import cors from "cors";
dotenv.config(); //load the .env file on your repository

const app = express();

const mongoUrl =process.env.MONGO_DB_URI

app.use(cors())

mongoose.connect(mongoUrl, {}); 

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('Database connected');
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Ensure there's a space after "Bearer"
  console.log(token);
 
  if (token) {
    jwt.verify(token, process.env.SECRET, (error, decoded) => {
      if (!error) {
        req.user = decoded;
      }
    });
  }
  next();
});

app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
