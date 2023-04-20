import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import environment from './environments/environment.js';
// import Role from './roles/role.model.js';

import authController from './auth/auth.controller.js';
import usersController from './users/users.controller.js';

import errorMiddleware from './middlewares/error.middleware.js';

const PORT = environment.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', authController);
app.use('/api', usersController);
app.use(errorMiddleware);

const start = () => {
  try {
    app.listen(PORT, async () => {
      await mongoose.connect(`${environment.DB_URL}${environment.DB_NAME}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      // await new Role().save();
      // await new Role({ value: 'admin' }).save();

      console.log(`listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(`Error:::`);
    console.log(error);
  }
};

start();
