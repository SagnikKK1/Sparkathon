import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth/auth_routes';
import userRoutes from './routes/user/user_routes';
import activityRoutes from './routes/user/activity_routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Sparkathon Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      user: '/api/user',
      activity: '/api/activity',
      health: '/health'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Sparkathon Backend Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/activity', activityRoutes);

app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: {
      auth: [
        'POST /api/auth/signup',
        'POST /api/auth/login',
        'POST /api/auth/logout'
      ],
      user: [
        'GET /api/user/profile',
        'GET /api/user/all',
        'GET /api/user/online'
      ],
      activity: [
        'POST /api/activity/heartbeat'
      ],
      general: [
        'GET /',
        'GET /health'
      ]
    }
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Sparkathon Backend Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
  console.log(`👤 User endpoints: http://localhost:${PORT}/api/user`);
  console.log(`📊 Activity endpoints: http://localhost:${PORT}/api/activity`);
  console.log(`🌐 Root endpoint: http://localhost:${PORT}/`);
});

export default app;
