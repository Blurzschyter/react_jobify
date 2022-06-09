// import cors from 'cors';
// const express = require('express');
import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import morgan from 'morgan';
import 'express-async-errors'; //no need to setup try catch block again in the controller

// to set static page from build folder
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

//securities
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';

//db and authenticateUser
import connectDB from './db/connect.js'; //above middleware

//routers
import authRouter from './routes/authRoutes.js';
import jobsRouter from './routes/jobsRoutes.js';

//middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import authenticateUser from './middleware/auth.js';

if (process.env.NODE_ENV !== 'PRODUCTION') {
  app.use(morgan('dev'));
}

// set static page from build folder
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, './client/build')));

// app.use(cors());
app.use(express.json());

//securities
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

//dummy route
// app.get('/', (req, res) => {
//   // throw new Error('error');
//   res.send('Welcome');
// });
//real route
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

//redirect to client index.html from the build file. then run node server.js to test (server only)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

// app.listen(port, () => {
//   console.log(`Server is listening on port ${port}`);
// });

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
