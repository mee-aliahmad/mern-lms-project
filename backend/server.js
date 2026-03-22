import express, { json, urlencoded } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import errorHandler from './middleware/errorHandler';

// Load environment variables
config();

// Connect to MongoDB
connectDB();

const app = express();

// ---------- Middleware ----------

// Enable CORS for frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://mern-lms-project-chi.vercel.app",
    credentials: true,
  })
);
// Parse JSON request bodies
app.use(json());

// Parse URL-encoded bodies
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("🚀 LMS Backend is Running Successfully");
});

// ---------- API Routes ----------

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/enroll', require('./routes/enrollmentRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'LMS API is running' });
});

// Handle 404 for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// ---------- Global Error Handler ----------
app.use(errorHandler);

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
