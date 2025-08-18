import { BaseDocument, UserOwnedDocument, GoalStatus } from './index';

export interface GoalMilestone {
  id: string;
  title: string;
  description?: string;
  targetDate: Date;
  completedAt?: Date;
  isCompleted: boolean;
  progress: number; // 0-100
  weight: number; // importance weight for overall goal progress
}

export interface GoalProgress {
  currentValue: number;
  targetValue: number;
  unit: string; // e.g., "pages", "hours", "dollars", "items"
  percentage: number; // 0-100
  trend: 'increasing' | 'decreasing' | 'stable';
  lastUpdated: Date;
}

export interface GoalMetrics {
  // Time-based metrics
  estimatedDuration: number; // days
  actualDuration?: number; // days
  timeSpent: number; // minutes
  averageTimePerDay: number; // minutes
  
  // Progress metrics
  milestonesCompleted: number;
  totalMilestones: number;
  tasksCompleted: number;
  totalTasks: number;
  
  // Quality metrics
  qualityScore?: number; // 1-10
  satisfactionScore?: number; // 1-10
  difficultyLevel: 'easy' | 'medium' | 'hard' | 'expert';
  
  // Consistency metrics
  streakDays: number;
  longestStreak: number;
  missedDays: number;
  consistencyRate: number; // percentage
}

export interface GoalCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
  parentCategoryId?: string;
  isDefault: boolean;
}

export interface GoalTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedDuration: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  tags: string[];
  isPublic: boolean;
  usageCount: number;
  rating: number;
  createdBy: string;
}

export interface Goal extends UserOwnedDocument {
  // Basic Information
  title: string;
  description: string;
  category: string;
  tags: string[];
  
  // Status & Progress
  status: GoalStatus;
  progress: GoalProgress;
  metrics: GoalMetrics;
  
  // Timeline
  startDate: Date;
  dueDate: Date;
  completedAt?: Date;
  archivedAt?: Date;
  
  // Planning & Structure
  milestones: GoalMilestone[];
  estimatedEffort: number; // hours
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Motivation & Psychology
  motivation: {
    why: string; // why this goal matters
    benefits: string[]; // what will be gained
    obstacles: string[]; // potential challenges
    strategies: string[]; // how to overcome obstacles
  };
  
  // AI & Personalization
  aiInsights: {
    suggestedMilestones: string[];
    recommendedTasks: string[];
    optimalSchedule: string[];
    motivationTips: string[];
    progressPredictions: {
      estimatedCompletion: Date;
      confidence: number; // 0-100
      factors: string[];
    };
  };
  
  // Social & Collaboration
  isPublic: boolean;
  sharedWith: string[]; // user IDs
  collaborators: string[]; // user IDs
  comments: {
    id: string;
    userId: string;
    message: string;
    timestamp: Date;
    isPrivate: boolean;
  }[];
  
  // Attachments & Resources
  attachments: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: Date;
  }[];
  
  // Reminders & Notifications
  reminders: {
    id: string;
    type: 'daily' | 'weekly' | 'milestone' | 'custom';
    message: string;
    frequency: string;
    nextReminder: Date;
    isActive: boolean;
  }[];
  
  // Reflection & Learning
  reflections: {
    id: string;
    date: Date;
    content: string;
    mood: 'excited' | 'motivated' | 'neutral' | 'frustrated' | 'overwhelmed';
    insights: string[];
    actionItems: string[];
  }[];
  
  // Integration
  externalId?: string; // for syncing with external tools
  source: 'manual' | 'template' | 'ai-suggested' | 'imported';
  
  // Metadata
  visibility: 'private' | 'shared' | 'public';
  searchable: boolean;
  featured: boolean;
}

// Create goal data interface
export interface CreateGoalData {
  title: string;
  description: string;
  category: string;
  tags?: string[];
  startDate: Date;
  dueDate: Date;
  estimatedEffort?: number;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  isPublic?: boolean;
  motivation?: {
    why: string;
    benefits?: string[];
    obstacles?: string[];
    strategies?: string[];
  };
}

// Update goal data interface
export interface UpdateGoalData {
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  status?: GoalStatus;
  dueDate?: Date;
  estimatedEffort?: number;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  isPublic?: boolean;
  motivation?: Partial<Goal['motivation']>;
}

// Goal search and filter interface
export interface GoalSearchFilters {
  status?: GoalStatus;
  category?: string;
  tags?: string[];
  priority?: string;
  dueDate?: {
    before?: Date;
    after?: Date;
  };
  isPublic?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
}

// Goal analytics interface
export interface GoalAnalytics {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  metrics: {
    totalGoals: number;
    activeGoals: number;
    completedGoals: number;
    averageCompletionTime: number; // days
    successRate: number; // percentage
    averageProgress: number; // percentage
    totalTimeSpent: number; // minutes
  };
  trends: {
    goalCreationRate: number;
    completionRate: number;
    productivityTrend: 'improving' | 'declining' | 'stable';
    categoryDistribution: { [category: string]: number };
  };
  insights: {
    bestPerformingCategory: string;
    mostChallengingGoals: string[];
    optimalGoalDuration: number; // days
    recommendedCategories: string[];
  };
}

// Goal template interface
export interface CreateGoalTemplateData {
  name: string;
  description: string;
  category: string;
  estimatedDuration: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  tags: string[];
  isPublic: boolean;
  milestones?: Omit<GoalMilestone, 'id'>[];
  motivation?: Partial<Goal['motivation']>;
}
