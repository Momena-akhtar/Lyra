import { BaseDocument, UserOwnedDocument, TaskStatus, TaskPriority } from './index';

export interface TaskDependency {
  id: string;
  taskId: string;
  type: 'blocks' | 'required-by' | 'related-to';
  description?: string;
}

export interface TaskTimeTracking {
  estimatedDuration: number; // minutes
  actualDuration: number; // minutes
  timeEntries: {
    id: string;
    startTime: Date;
    endTime: Date;
    duration: number; // minutes
    description?: string;
    isBreak: boolean;
  }[];
  totalTimeSpent: number; // minutes
  averageSessionLength: number; // minutes
  lastWorkedOn: Date;
}

export interface TaskProgress {
  currentStep: number;
  totalSteps: number;
  percentage: number; // 0-100
  completedSteps: string[];
  remainingSteps: string[];
  blockers: string[];
  lastUpdated: Date;
}

export interface TaskContext {
  // Work context
  energyLevel: 'high' | 'medium' | 'low';
  focusLevel: 'deep' | 'shallow' | 'interrupted';
  environment: 'office' | 'home' | 'coffee-shop' | 'library' | 'outdoor';
  
  // Time context
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  
  // Mood context
  mood: 'energized' | 'focused' | 'relaxed' | 'stressed' | 'tired' | 'excited';
  motivation: 'high' | 'medium' | 'low';
  stressLevel: 'low' | 'medium' | 'high';
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedDuration: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  tags: string[];
  steps: string[];
  prerequisites: string[];
  isPublic: boolean;
  usageCount: number;
  rating: number;
  createdBy: string;
}

export interface Task extends UserOwnedDocument {
  // Basic Information
  title: string;
  description: string;
  goalId?: string; // linked goal
  category: string;
  
  // Status & Progress
  status: TaskStatus;
  priority: TaskPriority;
  progress: TaskProgress;
  
  // Timeline
  dueDate?: Date;
  startDate?: Date;
  completedAt?: Date;
  archivedAt?: Date;
  
  // Time Management
  timeTracking: TaskTimeTracking;
  estimatedStartDate?: Date;
  estimatedEndDate?: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  
  // Dependencies & Relationships
  dependencies: TaskDependency[];
  subtasks: string[]; // task IDs
  parentTaskId?: string;
  relatedTasks: string[]; // task IDs
  
  // Context & Environment
  context: TaskContext;
  location?: string;
  requiredResources: string[];
  notes: string;
  
  // AI & Personalization
  aiInsights: {
    suggestedDuration: number; // minutes
    optimalTimeOfDay: string[];
    energyRequirement: 'low' | 'medium' | 'high';
    focusRequirement: 'low' | 'medium' | 'high';
    difficultyAssessment: 'easier-than-expected' | 'as-expected' | 'harder-than-expected';
    completionPrediction: {
      estimatedCompletion: Date;
      confidence: number; // 0-100
      factors: string[];
    };
    productivityTips: string[];
    motivationSuggestions: string[];
  };
  
  // Collaboration
  assignedTo: string[]; // user IDs
  reviewedBy?: string; // user ID
  approvedBy?: string; // user ID
  collaborators: string[]; // user IDs
  comments: {
    id: string;
    userId: string;
    message: string;
    timestamp: Date;
    isPrivate: boolean;
    attachments?: {
      id: string;
      name: string;
      url: string;
      type: string;
    }[];
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
    type: 'start' | 'due' | 'custom';
    message: string;
    triggerTime: Date;
    isActive: boolean;
    sentAt?: Date;
  }[];
  
  // Quality & Review
  quality: {
    selfRating?: number; // 1-10
    peerRating?: number; // 1-10
    supervisorRating?: number; // 1-10
    feedback: string[];
    improvements: string[];
  };
  
  // Learning & Reflection
  learnings: {
    whatWentWell: string[];
    whatCouldBeImproved: string[];
    keyInsights: string[];
    nextTimeActions: string[];
  };
  
  // Integration
  externalId?: string; // for syncing with external tools
  source: 'manual' | 'template' | 'ai-suggested' | 'imported' | 'email' | 'calendar';
  
  // Metadata
  visibility: 'private' | 'shared' | 'public';
  searchable: boolean;
  featured: boolean;
  tags: string[];
}

// Create task data interface
export interface CreateTaskData {
  title: string;
  description: string;
  goalId?: string;
  category: string;
  tags?: string[];
  dueDate?: Date;
  priority?: TaskPriority;
  estimatedDuration?: number;
  assignedTo?: string[];
  dependencies?: Omit<TaskDependency, 'id'>[];
  subtasks?: string[];
  parentTaskId?: string;
}

// Update task data interface
export interface UpdateTaskData {
  title?: string;
  description?: string;
  goalId?: string;
  category?: string;
  tags?: string[];
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
  estimatedDuration?: number;
  assignedTo?: string[];
  dependencies?: TaskDependency[];
  subtasks?: string[];
  parentTaskId?: string;
  notes?: string;
}

// Task search and filter interface
export interface TaskSearchFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: string;
  tags?: string[];
  goalId?: string;
  assignedTo?: string;
  dueDate?: {
    before?: Date;
    after?: Date;
    overdue?: boolean;
  };
  estimatedDuration?: {
    min?: number;
    max?: number;
  };
  createdAfter?: Date;
  createdBefore?: Date;
}

// Task analytics interface
export interface TaskAnalytics {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  metrics: {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    averageCompletionTime: number; // minutes
    successRate: number; // percentage
    averageProgress: number; // percentage
    totalTimeSpent: number; // minutes
    averageTasksPerDay: number;
  };
  trends: {
    taskCreationRate: number;
    completionRate: number;
    productivityTrend: 'improving' | 'declining' | 'stable';
    categoryDistribution: { [category: string]: number };
    priorityDistribution: { [priority: string]: number };
  };
  insights: {
    mostProductiveTimeOfDay: string;
    mostProductiveDayOfWeek: string;
    bestPerformingCategory: string;
    optimalTaskDuration: number; // minutes
    commonBlockers: string[];
    productivityPatterns: string[];
  };
}

// Task template interface
export interface CreateTaskTemplateData {
  name: string;
  description: string;
  category: string;
  estimatedDuration: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  tags: string[];
  steps: string[];
  prerequisites: string[];
  isPublic: boolean;
}

// Time tracking interface
export interface TimeEntryData {
  taskId: string;
  startTime: Date;
  endTime: Date;
  description?: string;
  isBreak: boolean;
}

// Task batch operations interface
export interface TaskBatchOperation {
  taskIds: string[];
  operation: 'update-status' | 'update-priority' | 'assign-to' | 'add-tags' | 'remove-tags' | 'archive' | 'delete';
  data: any;
}
