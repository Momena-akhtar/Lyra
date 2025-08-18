import { BaseDocument, UserOwnedDocument } from './index';

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string;
  timestamp: Date;
  
  // Message metadata
  type: 'text' | 'voice' | 'image' | 'file' | 'action' | 'suggestion';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  
  // Rich content
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    thumbnail?: string;
  }[];
  
  // AI-specific data
  ai?: {
    model: string;
    tokens: number;
    confidence: number;
    intent: string;
    entities: {
      name: string;
      type: string;
      confidence: number;
    }[];
    sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
    topics: string[];
    suggestedActions: string[];
  };
  
  // User context
  userContext?: {
    mood: string;
    energy: string;
    location: string;
    device: string;
    timeOfDay: string;
    previousMessages: number;
  };
  
  // Function calls
  functionCall?: {
    name: string;
    arguments: any;
    result?: any;
    success: boolean;
    executionTime: number;
  };
  
  // Feedback
  feedback?: {
    rating: number; // 1-5
    helpful: boolean;
    comment?: string;
    timestamp: Date;
  };
}

export interface ConversationContext {
  // Session context
  sessionId: string;
  startTime: Date;
  lastActivity: Date;
  duration: number; // minutes
  
  // User context
  userProfile: {
    preferences: any;
    history: any;
    currentGoals: string[];
    currentTasks: string[];
    recentNotes: string[];
  };
  
  // Conversation context
  topic: string;
  subtopics: string[];
  intent: string;
  goal: string;
  
  // Environment context
  environment: {
    platform: 'web' | 'mobile' | 'desktop' | 'voice';
    browser?: string;
    os?: string;
    device?: string;
    location?: string;
    timezone: string;
  };
  
  // AI context
  aiContext: {
    personality: string;
    knowledgeBase: string[];
    capabilities: string[];
    limitations: string[];
    conversationStyle: string;
  };
}

export interface ConversationAnalytics {
  // Engagement metrics
  messageCount: number;
  userMessages: number;
  assistantMessages: number;
  averageResponseTime: number; // milliseconds
  conversationLength: number; // messages
  
  // Quality metrics
  userSatisfaction: number; // 1-5 average
  helpfulnessScore: number; // 0-100
  completionRate: number; // percentage
  followUpQuestions: number;
  
  // AI performance metrics
  aiResponseTime: number; // milliseconds
  aiConfidence: number; // 0-100
  aiAccuracy: number; // 0-100
  functionCallSuccess: number; // percentage
  
  // User behavior patterns
  userEngagement: {
    activeTime: number; // minutes
    responseTime: number; // milliseconds
    messageLength: number; // characters
    interactionPattern: string;
  };
  
  // Topic analysis
  topics: {
    name: string;
    frequency: number;
    userInterest: number; // 0-100
    aiExpertise: number; // 0-100
  }[];
  
  // Sentiment analysis
  sentiment: {
    overall: 'positive' | 'neutral' | 'negative';
    trend: 'improving' | 'stable' | 'declining';
    userSentiment: number; // -1 to 1
    aiSentiment: number; // -1 to 1
  };
}

export interface ConversationInsights {
  // Learning insights
  userPreferences: {
    communicationStyle: string;
    preferredTopics: string[];
    avoidedTopics: string[];
    responseLength: 'short' | 'medium' | 'long';
    formality: 'casual' | 'formal' | 'technical';
  };
  
  // Behavioral insights
  behaviorPatterns: {
    peakActivityTime: string;
    averageSessionLength: number;
    commonQuestions: string[];
    typicalGoals: string[];
    preferredActions: string[];
  };
  
  // AI improvement insights
  aiImprovements: {
    weakAreas: string[];
    strongAreas: string[];
    suggestedTraining: string[];
    userFeedback: string[];
    performanceTrends: string[];
  };
  
  // Personalization insights
  personalization: {
    customResponses: string[];
    userSpecificKnowledge: string[];
    adaptiveBehaviors: string[];
    relationshipBuilding: string[];
  };
}

export interface ConversationAction {
  id: string;
  type: 'task-created' | 'goal-set' | 'note-created' | 'reminder-set' | 'integration-triggered' | 'custom';
  description: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  
  // Action details
  details: {
    entityType: string;
    entityId?: string;
    data: any;
    metadata: any;
  };
  
  // Execution
  executedAt?: Date;
  executedBy?: string;
  result?: any;
  error?: string;
  
  // Follow-up
  followUpRequired: boolean;
  followUpDate?: Date;
  followUpMessage?: string;
}

export interface ConversationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  
  // Template structure
  structure: {
    opening: string;
    mainPoints: string[];
    questions: string[];
    closing: string;
    expectedDuration: number; // minutes
  };
  
  // Usage
  usageCount: number;
  successRate: number;
  averageRating: number;
  createdBy: string;
  isPublic: boolean;
}

export interface Conversation extends UserOwnedDocument {
  // Basic Information
  title: string;
  summary: string;
  category: string;
  tags: string[];
  
  // Messages
  messages: ConversationMessage[];
  
  // Context
  context: ConversationContext;
  
  // Analytics
  analytics: ConversationAnalytics;
  
  // Insights
  insights: ConversationInsights;
  
  // Actions
  actions: ConversationAction[];
  
  // Status
  status: 'active' | 'paused' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Relationships
  relatedConversations: string[]; // conversation IDs
  linkedGoals: string[]; // goal IDs
  linkedTasks: string[]; // task IDs
  linkedNotes: string[]; // note IDs
  
  // AI & Personalization
  aiFeatures: {
    personality: string;
    knowledgeBase: string[];
    learningEnabled: boolean;
    personalizationLevel: 'basic' | 'standard' | 'advanced';
    adaptiveResponses: boolean;
  };
  
  // Collaboration
  isShared: boolean;
  sharedWith: string[]; // user IDs
  collaborators: string[]; // user IDs
  
  // Attachments
  attachments: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: Date;
    uploadedBy: string;
  }[];
  
  // Reminders & Follow-ups
  reminders: {
    id: string;
    type: 'follow-up' | 'action-reminder' | 'review' | 'custom';
    message: string;
    triggerTime: Date;
    isActive: boolean;
    sentAt?: Date;
  }[];
  
  // Integration
  externalId?: string; // for syncing with external tools
  source: 'manual' | 'template' | 'ai-generated' | 'imported' | 'email' | 'chat';
  
  // Metadata
  visibility: 'private' | 'shared' | 'public';
  searchable: boolean;
  featured: boolean;
}

// Create conversation data interface
export interface CreateConversationData {
  title: string;
  category: string;
  tags?: string[];
  initialMessage?: string;
  context?: Partial<ConversationContext>;
  linkedGoals?: string[];
  linkedTasks?: string[];
  linkedNotes?: string[];
}

// Update conversation data interface
export interface UpdateConversationData {
  title?: string;
  summary?: string;
  category?: string;
  tags?: string[];
  status?: Conversation['status'];
  priority?: Conversation['priority'];
  linkedGoals?: string[];
  linkedTasks?: string[];
  linkedNotes?: string[];
}

// Add message data interface
export interface AddMessageData {
  role: ConversationMessage['role'];
  content: string;
  type?: ConversationMessage['type'];
  attachments?: ConversationMessage['attachments'];
  ai?: Partial<ConversationMessage['ai']>;
  userContext?: ConversationMessage['userContext'];
}

// Conversation search and filter interface
export interface ConversationSearchFilters {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
  status?: Conversation['status'];
  priority?: Conversation['priority'];
  hasActions?: boolean;
  linkedGoals?: string[];
  linkedTasks?: string[];
  linkedNotes?: string[];
  createdAfter?: Date;
  createdBefore?: Date;
  lastActivityAfter?: Date;
  lastActivityBefore?: Date;
}

// Conversation analytics interface
export interface ConversationAnalyticsSummary {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  metrics: {
    totalConversations: number;
    activeConversations: number;
    completedConversations: number;
    totalMessages: number;
    averageConversationLength: number;
    averageResponseTime: number;
    userSatisfaction: number;
    aiAccuracy: number;
  };
  trends: {
    conversationCreationRate: number;
    messageVolume: number;
    satisfactionTrend: 'improving' | 'declining' | 'stable';
    categoryDistribution: { [category: string]: number };
    topicDistribution: { [topic: string]: number };
  };
  insights: {
    mostPopularCategory: string;
    mostEngagingTopics: string[];
    optimalConversationTime: string;
    commonUserGoals: string[];
    aiPerformanceAreas: {
      strengths: string[];
      weaknesses: string[];
      improvementOpportunities: string[];
    };
  };
}

// Conversation template interface
export interface CreateConversationTemplateData {
  name: string;
  description: string;
  category: string;
  tags: string[];
  structure: ConversationTemplate['structure'];
  isPublic: boolean;
}
