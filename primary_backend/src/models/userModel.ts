import { BaseDocument, AuthProvider, Theme, NotificationType } from './index';

export interface UserProfile {
  // Basic Information
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  timezone: string;
  language: string;
  
  // Personal Details
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'prefer-not-to-say';
  occupation?: string;
  company?: string;
  website?: string;
  
  // AI Personalization
  aiPersonality: 'professional' | 'casual' | 'friendly' | 'formal' | 'creative';
  communicationStyle: 'direct' | 'detailed' | 'visual' | 'concise';
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  productivityStyle: 'morning-person' | 'night-owl' | 'flexible';
  
  // Interests & Skills
  interests: string[];
  skills: string[];
  hobbies: string[];
  goals: string[];
  
  // Social & Professional
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    instagram?: string;
  };
  
  // Preferences
  preferredContactMethod: 'email' | 'push' | 'sms' | 'in_app';
  emailFrequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
}

export interface UserPreferences {
  // Visual & UI
  theme: Theme;
  customTheme?: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
  };
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  reducedMotion: boolean;
  highContrast: boolean;
  
  // Notifications
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
  };
  notificationPreferences: {
    [key in NotificationType]: {
      enabled: boolean;
      frequency: 'immediate' | 'daily' | 'weekly';
      quietHours: {
        enabled: boolean;
        start: string; // HH:MM
        end: string;   // HH:MM
        timezone: string;
      };
    };
  };
  
  // AI & Assistant
  aiAssistant: {
    name: string;
    voice: 'male' | 'female' | 'neutral';
    personality: 'helpful' | 'motivational' | 'analytical' | 'creative';
    responseLength: 'concise' | 'detailed' | 'conversational';
    proactiveSuggestions: boolean;
    learningEnabled: boolean;
    privacyLevel: 'minimal' | 'standard' | 'strict';
  };
  
  // Productivity
  productivity: {
    workHours: {
      start: string; // HH:MM
      end: string;   // HH:MM
      timezone: string;
    };
    breakReminders: boolean;
    focusMode: boolean;
    pomodoroTimer: number; // minutes
    weeklyReviewReminder: boolean;
  };
  
  // Privacy & Security
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends-only';
    dataSharing: 'minimal' | 'standard' | 'enhanced';
    analyticsEnabled: boolean;
    personalizedAds: boolean;
  };
}

export interface UserStats {
  // Activity Metrics
  totalGoals: number;
  completedGoals: number;
  totalTasks: number;
  completedTasks: number;
  totalNotes: number;
  totalConversations: number;
  
  // Streaks & Consistency
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
  
  // AI Interaction
  aiInteractions: number;
  voiceInteractions: number;
  textInteractions: number;
  averageResponseTime: number; // milliseconds
  
  // Productivity
  averageTasksPerDay: number;
  averageGoalsPerMonth: number;
  completionRate: number; // percentage
  focusTime: number; // total minutes
}

export interface UserSettings {
  // Account
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastPasswordChange: Date;
  
  // Data & Storage
  dataRetentionDays: number;
  autoBackup: boolean;
  exportFrequency: 'monthly' | 'quarterly' | 'yearly';
  
  // Integrations
  connectedServices: string[];
  autoSync: boolean;
  
  // Accessibility
  screenReader: boolean;
  keyboardNavigation: boolean;
  voiceCommands: boolean;
}

export interface User extends BaseDocument {
  // Core Identity
  uid: string;
  email: string;
  emailVerified: boolean;
  
  // Authentication
  authProvider: AuthProvider;
  lastSignInAt: Date;
  lastSignInIp?: string;
  failedLoginAttempts: number;
  accountLocked: boolean;
  lockExpiresAt?: Date;
  
  // Profile & Preferences
  profile: UserProfile;
  preferences: UserPreferences;
  settings: UserSettings;
  stats: UserStats;
  
  // Status & Verification
  isActive: boolean;
  isPremium: boolean;
  subscriptionTier: 'free' | 'basic' | 'premium' | 'enterprise';
  subscriptionExpiresAt?: Date;
  
  // Onboarding
  onboardingCompleted: boolean;
  onboardingStep: number;
  welcomeMessageSent: boolean;
  
  // AI Learning
  aiLearningData: {
    conversationHistory: boolean;
    taskPatterns: boolean;
    goalPreferences: boolean;
    productivityHabits: boolean;
  };
  
  // Metadata
  source: 'web' | 'mobile' | 'api';
  referrer?: string;
  campaign?: string;
  tags: string[];
}

// Create user data interface
export interface CreateUserData {
  uid: string;
  email: string;
  profile: Partial<UserProfile>;
  preferences?: Partial<UserPreferences>;
  authProvider: AuthProvider;
}

// Update user data interface
export interface UpdateUserData {
  profile?: Partial<UserProfile>;
  preferences?: Partial<UserPreferences>;
  settings?: Partial<UserSettings>;
}

// User search and filter interface
export interface UserSearchFilters {
  isActive?: boolean;
  subscriptionTier?: string;
  location?: string;
  skills?: string[];
  interests?: string[];
  createdAfter?: Date;
  createdBefore?: Date;
}

// User analytics interface
export interface UserAnalytics {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  metrics: {
    goalsCreated: number;
    goalsCompleted: number;
    tasksCreated: number;
    tasksCompleted: number;
    notesCreated: number;
    aiInteractions: number;
    focusTime: number;
    productivityScore: number;
  };
  trends: {
    goalCompletionRate: number;
    taskEfficiency: number;
    aiEngagement: number;
    overallProgress: number;
  };
}
