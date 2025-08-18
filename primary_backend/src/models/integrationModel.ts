import { BaseDocument, UserOwnedDocument, IntegrationProvider } from './index';

export interface IntegrationCredentials {
  // OAuth tokens
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  
  // API keys and secrets
  apiKey?: string;
  apiSecret?: string;
  clientId?: string;
  clientSecret?: string;
  
  // Additional auth data
  scope: string[];
  tokenType: 'Bearer' | 'Basic' | 'Custom';
  customHeaders?: { [key: string]: string };
  
  // Security
  isEncrypted: boolean;
  encryptionKey?: string;
  lastRotated: Date;
}

export interface IntegrationConfig {
  // Connection settings
  baseUrl: string;
  apiVersion: string;
  timeout: number; // milliseconds
  retryAttempts: number;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
    burstLimit: number;
  };
  
  // Sync settings
  autoSync: boolean;
  syncInterval: number; // minutes
  lastSyncAt?: Date;
  nextSyncAt?: Date;
  
  // Data mapping
  fieldMappings: {
    [externalField: string]: string; // maps external field to internal field
  };
  
  // Webhooks
  webhooks: {
    id: string;
    url: string;
    events: string[];
    isActive: boolean;
    secret?: string;
    lastTriggered?: Date;
  }[];
  
  // Custom settings
  customSettings: { [key: string]: any };
}

export interface IntegrationCapabilities {
  // Data operations
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canSync: boolean;
  
  // Supported entities
  supportedEntities: string[]; // e.g., ['tasks', 'goals', 'notes', 'calendar']
  
  // Features
  features: {
    realTimeSync: boolean;
    batchOperations: boolean;
    fileUpload: boolean;
    webhooks: boolean;
    api: boolean;
    sdk: boolean;
  };
  
  // Limits
  limits: {
    maxFileSize: number; // bytes
    maxRequestsPerMinute: number;
    maxDataPerSync: number; // records
    maxWebhooks: number;
  };
}

export interface IntegrationStatus {
  // Connection status
  isConnected: boolean;
  lastConnected: Date;
  connectionHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'disconnected';
  
  // Sync status
  lastSyncStatus: 'success' | 'partial' | 'failed' | 'pending';
  lastSyncAt?: Date;
  syncErrors: {
    id: string;
    message: string;
    timestamp: Date;
    severity: 'low' | 'medium' | 'high' | 'critical';
    resolved: boolean;
  }[];
  
  // Performance metrics
  performance: {
    averageResponseTime: number; // milliseconds
    successRate: number; // percentage
    errorRate: number; // percentage
    lastPerformanceCheck: Date;
  };
  
  // Data statistics
  dataStats: {
    totalRecords: number;
    lastRecordAt?: Date;
    syncQueueSize: number;
    pendingChanges: number;
  };
}

export interface IntegrationData {
  // Synced data
  externalId: string;
  externalData: any;
  lastSyncedAt: Date;
  syncVersion: number;
  
  // Conflict resolution
  conflicts: {
    id: string;
    field: string;
    internalValue: any;
    externalValue: any;
    resolution: 'internal' | 'external' | 'manual' | 'pending';
    resolvedAt?: Date;
    resolvedBy?: string;
  }[];
  
  // Change tracking
  changes: {
    id: string;
    field: string;
    oldValue: any;
    newValue: any;
    timestamp: Date;
    source: 'internal' | 'external' | 'sync';
  }[];
}

export interface IntegrationWebhook {
  id: string;
  name: string;
  description?: string;
  url: string;
  events: string[];
  headers: { [key: string]: string };
  secret?: string;
  isActive: boolean;
  retryCount: number;
  maxRetries: number;
  
  // Delivery tracking
  deliveries: {
    id: string;
    event: string;
    payload: any;
    status: 'pending' | 'delivered' | 'failed' | 'retrying';
    attempts: number;
    lastAttempt: Date;
    nextRetry?: Date;
    responseCode?: number;
    responseBody?: string;
  }[];
  
  // Statistics
  stats: {
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    averageResponseTime: number;
    lastDelivery: Date;
  };
}

export interface Integration extends UserOwnedDocument {
  // Basic Information
  name: string;
  description?: string;
  provider: IntegrationProvider;
  icon?: string;
  
  // Configuration
  credentials: IntegrationCredentials;
  config: IntegrationConfig;
  capabilities: IntegrationCapabilities;
  
  // Status & Health
  status: IntegrationStatus;
  
  // Data & Sync
  data: IntegrationData[];
  
  // Webhooks
  webhooks: IntegrationWebhook[];
  
  // AI & Personalization
  aiInsights: {
    usagePatterns: string[];
    optimizationSuggestions: string[];
    recommendedSettings: any;
    performancePredictions: {
      estimatedUptime: number; // percentage
      recommendedSyncInterval: number; // minutes
      potentialIssues: string[];
    };
  };
  
  // Security & Compliance
  security: {
    encryptionEnabled: boolean;
    dataRetentionDays: number;
    auditLogging: boolean;
    compliance: {
      gdpr: boolean;
      ccpa: boolean;
      sox: boolean;
      hipaa: boolean;
    };
  };
  
  // Usage & Analytics
  analytics: {
    totalSyncs: number;
    totalRecords: number;
    averageSyncTime: number; // milliseconds
    errorFrequency: number; // errors per day
    userEngagement: number; // 0-100
    lastUsage: Date;
  };
  
  // Integration-specific data
  providerData: {
    accountId?: string;
    accountName?: string;
    plan?: string;
    features?: string[];
    limits?: { [key: string]: any };
  };
  
  // Metadata
  isActive: boolean;
  isDefault: boolean;
  priority: number; // for sync order
  tags: string[];
}

// Create integration data interface
export interface CreateIntegrationData {
  name: string;
  provider: IntegrationProvider;
  description?: string;
  credentials: Partial<IntegrationCredentials>;
  config?: Partial<IntegrationConfig>;
  autoSync?: boolean;
  syncInterval?: number;
}

// Update integration data interface
export interface UpdateIntegrationData {
  name?: string;
  description?: string;
  credentials?: Partial<IntegrationCredentials>;
  config?: Partial<IntegrationConfig>;
  autoSync?: boolean;
  syncInterval?: number;
  isActive?: boolean;
}

// Integration search and filter interface
export interface IntegrationSearchFilters {
  provider?: IntegrationProvider;
  isActive?: boolean;
  isConnected?: boolean;
  hasErrors?: boolean;
  lastSyncAfter?: Date;
  lastSyncBefore?: Date;
  tags?: string[];
}

// Integration analytics interface
export interface IntegrationAnalytics {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  metrics: {
    totalIntegrations: number;
    activeIntegrations: number;
    totalSyncs: number;
    successfulSyncs: number;
    failedSyncs: number;
    averageSyncTime: number;
    totalRecords: number;
  };
  trends: {
    integrationAdoption: number;
    syncSuccessRate: number;
    performanceTrend: 'improving' | 'declining' | 'stable';
    providerDistribution: { [provider: string]: number };
  };
  insights: {
    mostReliableProvider: string;
    fastestIntegration: string;
    commonIssues: string[];
    optimizationOpportunities: string[];
  };
}

// Integration test interface
export interface IntegrationTestResult {
  success: boolean;
  tests: {
    connection: {
      success: boolean;
      responseTime: number;
      error?: string;
    };
    authentication: {
      success: boolean;
      error?: string;
    };
    permissions: {
      success: boolean;
      error?: string;
      missingPermissions: string[];
    };
    dataAccess: {
      success: boolean;
      error?: string;
      accessibleEntities: string[];
    };
  };
  recommendations: string[];
  estimatedSetupTime: number; // minutes
}

// Integration template interface
export interface IntegrationTemplate {
  id: string;
  name: string;
  description: string;
  provider: IntegrationProvider;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedSetupTime: number; // minutes
  features: string[];
  requirements: string[];
  steps: string[];
  isPublic: boolean;
  usageCount: number;
  rating: number;
  createdBy: string;
  tags: string[];
}
