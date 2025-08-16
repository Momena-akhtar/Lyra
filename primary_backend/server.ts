import express, { Request, Response, NextFunction } from "express";
import { config, serverConfig } from "./src/config/env";
import routes from "./src/routes";
import { errorHandler, notFoundHandler } from "./src/middleware/errorMiddleware";

const app = express();
const PORT = serverConfig.port;
const ENV = serverConfig.env;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', config.CORS_ORIGIN);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Mount all routes
app.use(routes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[${ENV}] Server running on http://localhost:${PORT}`);
});
