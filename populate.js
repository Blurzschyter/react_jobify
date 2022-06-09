// This file purpose used for directly add mock data from mockaroo to our db

import { readFile } from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './db/connect.js';
import Job from './models/Job.js';

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Job.deleteMany(); //remove all current data in the sub-collections
    const jsonProducts = JSON.parse(
      await readFile(new URL('./mock-data.json', import.meta.url))
    );
    await Job.create(jsonProducts);
    console.log('Success!!!');
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
