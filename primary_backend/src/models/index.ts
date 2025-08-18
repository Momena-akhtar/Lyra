// Export all models
export * from './userModel';
export * from './goalModel';
export * from './taskModel';
export * from './noteModel';
export * from './integrationModel';
export * from './conversationModel';
export * from './voiceModel';

// Common types used across models
export interface BaseDocument {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimestampedDocument extends BaseDocument {
  lastModifiedAt: Date;
}

export interface UserOwnedDocument extends TimestampedDocument {
  userId: string;
  createdBy: string;
}

export interface SoftDeleteDocument extends UserOwnedDocument {
  deletedAt?: Date;
  isDeleted: boolean;
}

// Status enums
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
  ARCHIVED = 'archived'
}

export enum TaskPriority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  URGENT = 4
}

export enum GoalStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  PAUSED = 'paused',
  CANCELLED = 'cancelled'
}

export enum AuthProvider {
  GOOGLE = 'google',
  LOCAL = 'local',
}

export enum IntegrationProvider {
  GOOGLE = 'google',
  SLACK = 'slack',
  TRELLO = 'trello',
  NOTION = 'notion',
  ZAPIER = 'zapier',
  CALENDAR = 'calendar',
  EMAIL = 'email'
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto',
  CUSTOM = 'custom'
}

export enum NotificationType {
  EMAIL = 'email',
  PUSH = 'push',
  SMS = 'sms',
  IN_APP = 'in_app'
}
