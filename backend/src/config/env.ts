import dotenv from "dotenv";
import path from "path";

// Load the correct .env file based on NODE_ENV
const envPath = process.env.NODE_ENV === "production" 
  ? ".env.production" 
  : ".env.development";

dotenv.config({ path: path.resolve(process.cwd(), envPath) });

interface Config {
  // Server configuration
  NODE_ENV: string;
  PORT: number;
  
  // Firebase configuration
  FIREBASE_PROJECT_ID: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_PRIVATE_KEY: string;
  FIREBASE_CLIENT_EMAIL: string;
  FIREBASE_CLIENT_ID: string;
  
  // Database configuration (if needed later)
  DATABASE_URL?: string;
  
  // API configuration
  API_VERSION: string;
  API_PREFIX: string;
  
  // Security
  JWT_SECRET?: string;
  CORS_ORIGIN?: string;
  
  // Logging
  LOG_LEVEL: string;
}

// Validate required environment variables
const requiredEnvVars = [
  'NODE_ENV',
  'PORT'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

export const config: Config = {
  // Server configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  
  // Firebase configuration
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || 'lyra-a6da0',
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || 'lyra-a6da0.appspot.com',
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY || '968188ba8caff7ce6ea782bb4968b27f3da481af',
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@lyra-a6da0.iam.gserviceaccount.com',
  FIREBASE_CLIENT_ID: process.env.FIREBASE_CLIENT_ID || '101470012091286827574',
  
  // Database configuration
  DATABASE_URL: process.env.DATABASE_URL,
  
  // API configuration
  API_VERSION: process.env.API_VERSION || 'v1',
  API_PREFIX: process.env.API_PREFIX || '/api',
  
  // Security
  JWT_SECRET: process.env.JWT_SECRET,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};

// Helper functions
export const isDevelopment = config.NODE_ENV === 'development';
export const isProduction = config.NODE_ENV === 'production';
export const isTest = config.NODE_ENV === 'test';

// Export individual config sections for convenience
export const serverConfig = {
  port: config.PORT,
  env: config.NODE_ENV,
  isDevelopment,
  isProduction,
  isTest
};

export const firebaseConfig = {
  projectId: config.FIREBASE_PROJECT_ID,
  storageBucket: config.FIREBASE_STORAGE_BUCKET,
  privateKey: config.FIREBASE_PRIVATE_KEY,
  clientEmail: config.FIREBASE_CLIENT_EMAIL,
  clientId: config.FIREBASE_CLIENT_ID
};

export const apiConfig = {
  version: config.API_VERSION,
  prefix: config.API_PREFIX
};

export default config;
