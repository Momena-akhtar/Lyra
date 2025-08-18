import { BaseDocument, UserOwnedDocument } from './index';

export interface VoiceInput {
  // Audio data
  audioData: string; // Base64 encoded or data URL
  audioFormat: 'wav' | 'mp3' | 'm4a' | 'webm' | 'ogg' | 'flac';
  duration: number; // seconds
  sampleRate: number; // Hz
  channels: number; // mono/stereo
  bitrate?: number; // kbps
  
  // Context
  context: {
    device: string;
    platform: 'web' | 'mobile' | 'desktop';
    browser?: string;
    os?: string;
    location?: string;
    timeOfDay: string;
    userMood?: string;
    userEnergy?: string;
  };
  
  // Quality metrics
  quality: {
    signalStrength: number; // 0-100
    noiseLevel: number; // 0-100
    clarity: number; // 0-100
    backgroundNoise: boolean;
  };
}

export interface VoiceTranscription {
  // Core transcription
  text: string;
  confidence: number; // 0-100
  language: string;
  detectedLanguage: string;
  
  // Detailed transcription
  segments: {
    id: string;
    start: number; // seconds
    end: number; // seconds
    text: string;
    confidence: number;
    speaker?: string;
    emotions?: string[];
  }[];
  
  // AI Analysis
  aiAnalysis: {
    intent: string;
    entities: {
      name: string;
      type: string;
      confidence: number;
      start: number;
      end: number;
    }[];
    sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
    topics: string[];
    keywords: string[];
    actionItems: string[];
    questions: string[];
    commands: string[];
  };
  
  // Voice characteristics
  voiceCharacteristics: {
    gender: 'male' | 'female' | 'neutral' | 'unknown';
    age: 'child' | 'teen' | 'young-adult' | 'adult' | 'senior';
    accent?: string;
    dialect?: string;
    speakingRate: 'slow' | 'normal' | 'fast';
    clarity: 'clear' | 'moderate' | 'unclear';
    emotion: string[];
    stress: 'low' | 'medium' | 'high';
  };
  
  // Quality assessment
  qualityAssessment: {
    transcriptionAccuracy: number; // 0-100
    audioQuality: number; // 0-100
    confidenceFactors: string[];
    improvementSuggestions: string[];
  };
}

export interface VoiceSession {
  // Session metadata
  sessionId: string;
  title?: string;
  description?: string;
  category: string;
  tags: string[];
  
  // Session lifecycle
  startTime: Date;
  endTime?: Date;
  duration: number; // minutes
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  
  // Content
  inputs: VoiceInput[];
  transcriptions: VoiceTranscription[];
  
  // AI & Personalization
  aiFeatures: {
    personality: string;
    learningEnabled: boolean;
    adaptiveResponses: boolean;
    contextAwareness: boolean;
    personalizationLevel: 'basic' | 'standard' | 'advanced';
  };
  
  // Context & Environment
  context: {
    userGoals: string[];
    userTasks: string[];
    userNotes: string[];
    conversationHistory: string[];
    userPreferences: any;
    environmentalFactors: {
      noise: 'low' | 'medium' | 'high';
      privacy: 'private' | 'semi-private' | 'public';
      interruptions: number;
      focusLevel: 'high' | 'medium' | 'low';
    };
  };
  
  // Analytics
  analytics: {
    totalInputs: number;
    totalTranscriptions: number;
    averageConfidence: number;
    averageResponseTime: number; // milliseconds
    userEngagement: number; // 0-100
    aiPerformance: number; // 0-100
    qualityMetrics: {
      audioQuality: number;
      transcriptionAccuracy: number;
      userSatisfaction: number;
    };
  };
  
  // Actions & Outcomes
  actions: {
    id: string;
    type: 'goal-set' | 'task-created' | 'note-created' | 'reminder-set' | 'integration-triggered';
    description: string;
    timestamp: Date;
    status: 'pending' | 'completed' | 'failed';
    result?: any;
  }[];
  
  // Learning & Adaptation
  learning: {
    userPatterns: string[];
    preferredTopics: string[];
    communicationStyle: string;
    voicePreferences: string[];
    improvementAreas: string[];
    successfulInteractions: string[];
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
  
  // Integration
  externalId?: string; // for syncing with external tools
  source: 'manual' | 'template' | 'ai-suggested' | 'imported';
  
  // Metadata
  visibility: 'private' | 'shared' | 'public';
  searchable: boolean;
  featured: boolean;
}

export interface VoiceTemplate {
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
    suggestedTopics: string[];
  };
  
  // Usage
  usageCount: number;
  successRate: number;
  averageRating: number;
  createdBy: string;
  isPublic: boolean;
  
  // AI Configuration
  aiConfig: {
    personality: string;
    knowledgeBase: string[];
    capabilities: string[];
    conversationStyle: string;
    responseLength: 'short' | 'medium' | 'long';
  };
}

export interface VoiceAnalytics {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  
  // Usage metrics
  metrics: {
    totalSessions: number;
    activeSessions: number;
    completedSessions: number;
    totalInputs: number;
    totalTranscriptions: number;
    totalDuration: number; // minutes
    averageSessionLength: number; // minutes
    averageConfidence: number;
  };
  
  // Performance metrics
  performance: {
    transcriptionAccuracy: number;
    aiResponseTime: number;
    userSatisfaction: number;
    engagementRate: number;
    completionRate: number;
  };
  
  // Trends
  trends: {
    sessionCreationRate: number;
    usageGrowth: number;
    qualityImprovement: number;
    categoryDistribution: { [category: string]: number };
    topicDistribution: { [topic: string]: number };
  };
  
  // Insights
  insights: {
    mostPopularCategory: string;
    mostEngagingTopics: string[];
    optimalSessionTime: string;
    commonUserGoals: string[];
    voiceQualityFactors: string[];
    improvementOpportunities: string[];
  };
  
  // AI Performance
  aiPerformance: {
    modelAccuracy: number;
    responseQuality: number;
    personalizationEffectiveness: number;
    learningProgress: number;
    userAdaptation: number;
  };
}

export interface VoicePreferences {
  // Audio preferences
  audio: {
    preferredFormat: VoiceInput['audioFormat'];
    qualityPreference: 'low' | 'medium' | 'high';
    noiseReduction: boolean;
    echoCancellation: boolean;
    autoGainControl: boolean;
  };
  
  // AI preferences
  ai: {
    personality: string;
    responseStyle: 'concise' | 'detailed' | 'conversational';
    formality: 'casual' | 'formal' | 'technical';
    language: string;
    accent: string;
    speed: 'slow' | 'normal' | 'fast';
  };
  
  // Interaction preferences
  interaction: {
    confirmationLevel: 'minimal' | 'standard' | 'verbose';
    interruptionHandling: 'allow' | 'discourage' | 'prevent';
    followUpQuestions: boolean;
    proactiveSuggestions: boolean;
    learningEnabled: boolean;
  };
  
  // Privacy preferences
  privacy: {
    dataRetention: 'minimal' | 'standard' | 'extended';
    voiceRecording: boolean;
    transcriptionStorage: boolean;
    aiLearning: boolean;
    analytics: boolean;
  };
}

// Create voice session data interface
export interface CreateVoiceSessionData {
  title?: string;
  description?: string;
  category: string;
  tags?: string[];
  aiFeatures?: Partial<VoiceSession['aiFeatures']>;
  context?: Partial<VoiceSession['context']>;
  isShared?: boolean;
  sharedWith?: string[];
}

// Update voice session data interface
export interface UpdateVoiceSessionData {
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  status?: VoiceSession['status'];
  aiFeatures?: Partial<VoiceSession['aiFeatures']>;
  context?: Partial<VoiceSession['context']>;
  isShared?: boolean;
  sharedWith?: string[];
}

// Voice session search and filter interface
export interface VoiceSessionSearchFilters {
  title?: string;
  category?: string;
  tags?: string[];
  status?: VoiceSession['status'];
  hasActions?: boolean;
  linkedGoals?: string[];
  linkedTasks?: string[];
  linkedNotes?: string[];
  createdAfter?: Date;
  createdBefore?: Date;
  duration?: {
    min?: number;
    max?: number;
  };
}

// Voice template interface
export interface CreateVoiceTemplateData {
  name: string;
  description: string;
  category: string;
  tags: string[];
  structure: VoiceTemplate['structure'];
  aiConfig: VoiceTemplate['aiConfig'];
  isPublic: boolean;
}

// Voice quality assessment interface
export interface VoiceQualityAssessment {
  sessionId: string;
  inputId: string;
  transcriptionId: string;
  
  // User feedback
  userFeedback: {
    accuracy: number; // 1-5
    helpfulness: number; // 1-5
    satisfaction: number; // 1-5
    comments?: string;
    suggestions?: string;
  };
  
  // AI assessment
  aiAssessment: {
    confidence: number; // 0-100
    quality: number; // 0-100
    improvements: string[];
    strengths: string[];
  };
  
  // Technical metrics
  technicalMetrics: {
    audioQuality: number;
    transcriptionAccuracy: number;
    responseTime: number;
    errorRate: number;
  };
}
