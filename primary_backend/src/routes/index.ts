import { Router, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { specs } from '../config/swagger';
import authRoutes from './authRoutes';
import voiceRoutes from './voiceRoutes';
import taskRoutes from './taskRoutes';
import goalRoutes from './goalRoutes';
import noteRoutes from './noteRoutes';
import assistantRoutes from './assistantRoutes';

const router = Router();

const API_PREFIX = '/api';

router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Lyra AI API Documentation'
}));

router.use(`${API_PREFIX}/auth`, authRoutes);
router.use(`${API_PREFIX}/voice`, voiceRoutes);
router.use(`${API_PREFIX}/tasks`, taskRoutes);
router.use(`${API_PREFIX}/goals`, goalRoutes);
router.use(`${API_PREFIX}/notes`, noteRoutes);
router.use(`${API_PREFIX}/assistant`, assistantRoutes);

router.get('/health', (req: Request, res: Response) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
    <title>Lyra AI - Health Check</title>
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
        .status {
            background: #4CAF50;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            display: inline-block;
            margin: 1rem 0;
        }
        .info {
            background: #fff;
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            border-left: 4px solid #4CAF50;
        }
        .info-item {
            margin: 0.5rem 0;
        }
        .label {
            font-weight: bold;
            color: #666;
        }
    </style>
</head>
<body>
    <h1>Lyra AI - Health Check</h1>
    <div class="status">Server is running</div>
    
    <div class="info">
        <div class="info-item">
            <span class="label">Status:</span> Healthy
        </div>
        <div class="info-item">
            <span class="label">Timestamp:</span> ${new Date().toISOString()}
        </div>
        <div class="info-item">
            <span class="label">Uptime:</span> ${Math.floor(process.uptime())} seconds
        </div>
        <div class="info-item">
            <span class="label">Environment:</span> ${process.env.NODE_ENV || 'development'}
        </div>
    </div>
    
    <p><a href="/">← Back to Home</a></p>
</body>
</html>`);
});

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
        .api-section {
            background: #fff;
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            border-left: 4px solid #28a745;
        }
        .docs-link {
            background: #007acc;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            display: inline-block;
            margin: 1rem 0;
            font-weight: bold;
        }
        .docs-link:hover {
            background: #005a9e;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <h1>Lyra AI</h1>
    <p>Version: 1.0.0 (Initial Release)</p>
    <p>© Momena Akhtar - 2025</p>
    <p><strong>Environment:</strong> ${ENV}</p>
    
    <div class="api-section">
        <h3>API Documentation:</h3>
        <p><strong>Base URL:</strong> ${req.protocol}://${req.get('host')}${API_PREFIX}</p>
        <p><strong>Version:</strong> 1.0.0</p>
        <a href="/docs" class="docs-link">View API Docs</a>
    </div>
    
            <div class="api-section">
            <h3>Quick Links:</h3>
            <p><a href="/health">🔍 Health Check</a></p>
            <p><a href="/docs">📖 API Docs</a></p>
        </div>
</body>
</html>`);
});

router.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableRoutes: [
      '/',
      '/health',
      '/docs',
      '/api',
      '/api/auth/*',
      '/api/voice/*',
      '/api/tasks/*',
      '/api/goals/*',
      '/api/notes/*',
      '/api/assistant/*'
    ]
  });
});

export default router;