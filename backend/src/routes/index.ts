import { Router, Request, Response } from 'express';
import authRoutes from './authRoutes';

const router = Router();

// API version prefix
const API_PREFIX = '/api';

// Mount auth routes
router.use(`${API_PREFIX}/auth`, authRoutes);

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Main landing page
router.get('/', (req: Request, res: Response) => {
  const ENV = process.env.NODE_ENV || 'development';
  
  res.send(`<!DOCTYPE html>
<html>
<head>
    <title>Lyra AI</title>
    <meta charset="utf-8">
    <style>
        body {
            font-family: 'JetBrains Mono', 'Fira Code', 'Source Code Pro', monospace;
            background-color: #f5f5f5;
            color: #333;
            padding: 2rem;
        }
        h1 {
            color: #4a4a4a;
        }
        a {
            color: #007acc;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .endpoints {
            background: #fff;
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            border-left: 4px solid #007acc;
        }
        .endpoint {
            margin: 0.5rem 0;
            font-family: monospace;
        }
        .api-section {
            background: #fff;
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            border-left: 4px solid #28a745;
        }
    </style>
</head>
<body>
    <h1>Lyra AI</h1>
    <p>Version: 1.0.0 (Initial Release)</p>
    <p>© Momena Akhtar - 2025</p>
    <p><strong>Environment:</strong> ${ENV}</p>
    
    <div class="endpoints">
        <h3>Available Endpoints:</h3>
        <div class="endpoint">GET /health - Health check</div>
        <div class="endpoint">POST /api/auth/register - User registration</div>
        <div class="endpoint">POST /api/auth/google - Google authentication</div>
        <div class="endpoint">GET /api/auth/profile - Get user profile</div>
        <div class="endpoint">PUT /api/auth/profile - Update user profile</div>
        <div class="endpoint">POST /api/auth/verify-token - Verify Firebase token</div>
    </div>
    
    <div class="api-section">
        <h3>API Information:</h3>
        <p><strong>Base URL:</strong> ${req.protocol}://${req.get('host')}${API_PREFIX}</p>
        <p><strong>Version:</strong> 1.0.0</p>
        <p><strong>Documentation:</strong> <a href="${API_PREFIX}">View API Details</a></p>
    </div>
</body>
</html>`);
});

// API info endpoint
router.get('/api', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Lyra AI API', 
    version: '1.0.0',
    baseUrl: `${req.protocol}://${req.get('host')}${API_PREFIX}`,
    endpoints: {
      auth: {
        base: `${API_PREFIX}/auth`,
        routes: {
          'POST /register': 'User registration with email/password',
          'POST /google': 'Google authentication',
          'GET /profile': 'Get current user profile (authenticated)',
          'PUT /profile': 'Update user profile (authenticated)',
          'GET /users/:uid': 'Get user by UID (authenticated)',
          'DELETE /users/:uid': 'Delete user account (authenticated)',
          'POST /verify-token': 'Verify Firebase ID token',
          'POST /revoke-tokens': 'Revoke all user tokens (authenticated)',
          'GET /users': 'List all users (admin only)'
        }
      },
      health: '/health',
      info: API_PREFIX
    },
    authentication: {
      type: 'Bearer Token',
      header: 'Authorization: Bearer <firebase_id_token>'
    },
    rateLimiting: {
      register: '3 attempts per 15 minutes',
      google: '5 attempts per 15 minutes'
    }
  });
});

// 404 handler for undefined routes
router.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableRoutes: [
      '/',
      '/health',
      '/api',
      '/api/auth/*'
    ]
  });
});

export default router;