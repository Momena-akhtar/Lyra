import { SoftDeleteDocument } from './index';

export interface NoteContent {
  // Rich text content
  text: string;
  html?: string;
  markdown?: string;
  
  // Structured content
  sections: {
    id: string;
    title: string;
    content: string;
    order: number;
    type: 'text' | 'list' | 'code' | 'image' | 'table' | 'quote';
  }[];
  
  // Media content
  images: {
    id: string;
    url: string;
    alt: string;
    caption?: string;
    position: { x: number; y: number };
  }[];
  
  // Code blocks
  codeBlocks: {
    id: string;
    language: string;
    code: string;
    description?: string;
    isExecutable: boolean;
  }[];
  
  // Tables
  tables: {
    id: string;
    headers: string[];
    rows: string[][];
    caption?: string;
  }[];
  
  // Lists
  lists: {
    id: string;
    type: 'bullet' | 'numbered' | 'checklist' | 'timeline';
    items: {
      id: string;
      text: string;
      isCompleted?: boolean;
      dueDate?: Date;
      priority?: 'low' | 'medium' | 'high';
    }[];
  }[];
}

export interface NoteMetadata {
  // Categorization
  category: string;
  subcategory?: string;
  tags: string[];
  keywords: string[];
  
  // Classification
  type: 'personal' | 'work' | 'study' | 'idea' | 'journal' | 'meeting' | 'research' | 'creative';
  status: 'draft' | 'published' | 'archived' | 'deleted';
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Relationships
  relatedNotes: string[]; // note IDs
  linkedGoals: string[]; // goal IDs
  linkedTasks: string[]; // task IDs
  externalLinks: {
    url: string;
    title: string;
    description?: string;
    type: 'article' | 'video' | 'document' | 'website';
  }[];
  
  // Context
  context: {
    project?: string;
    client?: string;
    meeting?: string;
    location?: string;
    mood?: 'inspired' | 'focused' | 'creative' | 'analytical' | 'reflective';
    energy?: 'high' | 'medium' | 'low';
  };
}

export interface NoteAI {
  // AI Analysis
  summary: string;
  keyPoints: string[];
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
  topics: string[];
  entities: {
    name: string;
    type: 'person' | 'organization' | 'location' | 'date' | 'concept';
    confidence: number;
  }[];
  
  // AI Suggestions
  suggestedTags: string[];
  relatedTopics: string[];
  improvementSuggestions: string[];
  followUpActions: string[];
  
  // AI Generation
  generatedContent: {
    summary?: string;
    title?: string;
    tags?: string[];
    relatedNotes?: string[];
    actionItems?: string[];
  };
  
  // Learning & Adaptation
  userPreferences: {
    writingStyle: 'formal' | 'casual' | 'technical' | 'creative';
    preferredTopics: string[];
    commonPatterns: string[];
  };
}

export interface NoteCollaboration {
  // Sharing
  isPublic: boolean;
  sharedWith: string[]; // user IDs
  permissions: {
    view: boolean;
    edit: boolean;
    comment: boolean;
    share: boolean;
  };
  
  // Collaboration
  collaborators: string[]; // user IDs
  comments: {
    id: string;
    userId: string;
    message: string;
    timestamp: Date;
    isResolved: boolean;
    replies: {
      id: string;
      userId: string;
      message: string;
      timestamp: Date;
    }[];
  }[];
  
  // Version Control
  versions: {
    id: string;
    version: number;
    content: NoteContent;
    changes: string[];
    createdBy: string;
    timestamp: Date;
  }[];
  
  // Activity
  activity: {
    id: string;
    userId: string;
    action: 'created' | 'edited' | 'shared' | 'commented' | 'viewed';
    timestamp: Date;
    details?: string;
  }[];
}

export interface NoteTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  content: Partial<NoteContent>;
  metadata: Partial<NoteMetadata>;
  isPublic: boolean;
  usageCount: number;
  rating: number;
  createdBy: string;
  tags: string[];
}

export interface Note extends SoftDeleteDocument {
  // Basic Information
  title: string;
  content: NoteContent;
  metadata: NoteMetadata;
  
  // AI Features
  ai: NoteAI;
  
  // Collaboration
  collaboration: NoteCollaboration;
  
  // Formatting & Style
  formatting: {
    theme: 'default' | 'dark' | 'minimal' | 'creative' | 'professional';
    font: string;
    fontSize: number;
    lineHeight: number;
    colorScheme: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
    };
  };
  
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
  
  // Reminders & Notifications
  reminders: {
    id: string;
    type: 'review' | 'follow-up' | 'deadline' | 'custom';
    message: string;
    triggerTime: Date;
    isActive: boolean;
    sentAt?: Date;
  }[];
  
  // Analytics & Insights
  analytics: {
    viewCount: number;
    editCount: number;
    shareCount: number;
    commentCount: number;
    lastViewed: Date;
    averageViewTime: number; // seconds
    engagementScore: number; // 0-100
  };
  
  // Integration
  externalId?: string; // for syncing with external tools
  source: 'manual' | 'template' | 'ai-generated' | 'imported' | 'email' | 'web-clip';
  
  // Search & Discovery
  searchable: boolean;
  featured: boolean;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

// Create note data interface
export interface CreateNoteData {
  title: string;
  content: Partial<NoteContent>;
  metadata?: Partial<NoteMetadata>;
  isPublic?: boolean;
  sharedWith?: string[];
  category?: string;
  tags?: string[];
  type?: Note['metadata']['type'];
  linkedGoals?: string[];
  linkedTasks?: string[];
}

// Update note data interface
export interface UpdateNoteData {
  title?: string;
  content?: Partial<NoteContent>;
  metadata?: Partial<NoteMetadata>;
  isPublic?: boolean;
  sharedWith?: string[];
  category?: string;
  tags?: string[];
  type?: Note['metadata']['type'];
  linkedGoals?: string[];
  linkedTasks?: string[];
}

// Note search and filter interface
export interface NoteSearchFilters {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
  type?: Note['metadata']['type'];
  status?: Note['metadata']['status'];
  priority?: Note['metadata']['priority'];
  isPublic?: boolean;
  sharedWith?: string;
  linkedGoals?: string[];
  linkedTasks?: string[];
  createdAfter?: Date;
  createdBefore?: Date;
  lastModifiedAfter?: Date;
  lastModifiedBefore?: Date;
}

// Note analytics interface
export interface NoteAnalytics {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  metrics: {
    totalNotes: number;
    publishedNotes: number;
    draftNotes: number;
    archivedNotes: number;
    totalViews: number;
    totalEdits: number;
    totalShares: number;
    averageEngagement: number;
  };
  trends: {
    noteCreationRate: number;
    publicationRate: number;
    engagementTrend: 'improving' | 'declining' | 'stable';
    categoryDistribution: { [category: string]: number };
    typeDistribution: { [type: string]: number };
  };
  insights: {
    mostPopularCategory: string;
    mostEngagingNotes: string[];
    optimalPublishingTime: string;
    commonTags: string[];
    contentPerformance: {
      bestPerformingType: string;
      averageViewTime: number;
      engagementFactors: string[];
    };
  };
}

// Note template interface
export interface CreateNoteTemplateData {
  name: string;
  description: string;
  category: string;
  content: Partial<NoteContent>;
  metadata: Partial<NoteMetadata>;
  isPublic: boolean;
  tags: string[];
}

// Note import interface
export interface NoteImportData {
  title: string;
  content: string;
  format: 'markdown' | 'html' | 'plain-text' | 'rich-text';
  source: string;
  metadata?: Partial<NoteMetadata>;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

// Note export interface
export interface NoteExportOptions {
  format: 'markdown' | 'html' | 'pdf' | 'docx' | 'plain-text';
  includeMetadata: boolean;
  includeAttachments: boolean;
  includeAI: boolean;
  includeCollaboration: boolean;
}
