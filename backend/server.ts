import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'express-async-errors';
import mongoose from 'mongoose';
import industriesRouter from './routes/industries';
import adminRouter from './routes/admin';
import authRouter from './routes/auth';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/market-research';

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((error) => console.error('❌ MongoDB connection error:', error));

// Routes
app.use('/api/industries', industriesRouter);
app.use('/api/admin', adminRouter);
app.use('/api/auth', authRouter);

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'Backend is running' });
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
