import express from 'express';
import { connectDB } from './config/db';
import authRouter from './routes/auth.route';
const PORT = 3005
const app = express();

connectDB();

app.use(express.json());

app.use('/', authRouter);
// 
app.listen(PORT, () => {
  console.log(`Server is running port ${PORT}`);
});