import { db } from '../config/firebase';
import { Goal, CreateGoalData, UpdateGoalData, GoalSearchFilters, GoalStatus } from '../models';

export class GoalService {
  async createGoal(userId: string, data: CreateGoalData): Promise<Goal> {
    try {
      const goalId = `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const goal: Goal = {
        id: goalId,
        userId,
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastModifiedAt: new Date(),
        title: data.title,
        description: data.description,
        category: data.category,
        tags: data.tags || [],
        status: GoalStatus.ACTIVE,
        progress: {
          currentValue: 0,
          targetValue: 100,
          unit: 'percentage',
          percentage: 0,
          trend: 'stable',
          lastUpdated: new Date()
        },
        metrics: {
          estimatedDuration: 30,
          actualDuration: undefined,
          timeSpent: 0,
          averageTimePerDay: 0,
          milestonesCompleted: 0,
          totalMilestones: 0,
          tasksCompleted: 0,
          totalTasks: 0,
          qualityScore: undefined,
          satisfactionScore: undefined,
          difficultyLevel: 'medium',
          streakDays: 0,
          longestStreak: 0,
          missedDays: 0,
          consistencyRate: 0
        },
        startDate: data.startDate,
        dueDate: data.dueDate,
        completedAt: undefined,
        archivedAt: undefined,
        milestones: [],
        estimatedEffort: data.estimatedEffort || 8,
        priority: data.priority || 'medium',
        motivation: {
          why: data.motivation?.why || 'To achieve success',
          benefits: data.motivation?.benefits || ['Growth', 'Success'],
          obstacles: data.motivation?.obstacles || ['Time constraints'],
          strategies: data.motivation?.strategies || ['Break into smaller tasks']
        },
        aiInsights: {
          suggestedMilestones: ['Set initial target', 'Track progress weekly'],
          recommendedTasks: ['Define success metrics', 'Create action plan'],
          optimalSchedule: ['Review daily', 'Update weekly'],
          motivationTips: ['Focus on the why', 'Celebrate progress'],
          progressPredictions: {
            estimatedCompletion: data.dueDate,
            confidence: 75,
            factors: ['Clear goal', 'Realistic timeline']
          }
        },
        isPublic: data.isPublic || false,
        sharedWith: [],
        collaborators: [],
        comments: [],
        attachments: [],
        reminders: [],
        reflections: [],
        externalId: undefined,
        source: 'manual',
        visibility: 'private',
        searchable: true,
        featured: false
      };

      await db.collection('goals').doc(goalId).set(goal as any);
      return goal;
    } catch (error: any) {
      throw new Error(`Failed to create goal: ${error.message}`);
    }
  }

  async getGoals(userId: string, filters?: GoalSearchFilters): Promise<Goal[]> {
    try {
      let query = db.collection('goals').where('userId', '==', userId);

      if (filters?.status) {
        query = query.where('status', '==', filters.status);
      }
      if (filters?.category) {
        query = query.where('category', '==', filters.category);
      }
      if (filters?.priority) {
        query = query.where('priority', '==', filters.priority);
      }

      const snapshot = await query.orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => doc.data() as Goal);
    } catch (error: any) {
      throw new Error(`Failed to get goals: ${error.message}`);
    }
  }

  async getGoalById(goalId: string, userId: string): Promise<Goal | null> {
    try {
      const goalDoc = await db.collection('goals').doc(goalId).get();
      
      if (!goalDoc.exists) {
        return null;
      }

      const goal = goalDoc.data() as Goal;
      if (goal.userId !== userId) {
        throw new Error('Access denied to goal');
      }

      return goal;
    } catch (error: any) {
      throw new Error(`Failed to get goal: ${error.message}`);
    }
  }

  async updateGoal(goalId: string, userId: string, data: UpdateGoalData): Promise<Goal> {
    try {
      const goalRef = db.collection('goals').doc(goalId);
      const goalDoc = await goalRef.get();

      if (!goalDoc.exists) {
        throw new Error('Goal not found');
      }

      const goal = goalDoc.data() as Goal;
      if (goal.userId !== userId) {
        throw new Error('Access denied');
      }

      const updateData: any = {
        ...data,
        updatedAt: new Date(),
        lastModifiedAt: new Date()
      };

      await goalRef.update(updateData);
      
      const updatedDoc = await goalRef.get();
      return updatedDoc.data() as Goal;
    } catch (error: any) {
      throw new Error(`Failed to update goal: ${error.message}`);
    }
  }

  async deleteGoal(goalId: string, userId: string): Promise<void> {
    try {
      const goalRef = db.collection('goals').doc(goalId);
      const goalDoc = await goalRef.get();

      if (!goalDoc.exists) {
        throw new Error('Goal not found');
      }

      const goal = goalDoc.data() as Goal;
      if (goal.userId !== userId) {
        throw new Error('Access denied');
      }

      await goalRef.delete();
    } catch (error: any) {
      throw new Error(`Failed to delete goal: ${error.message}`);
    }
  }

  async getGoalsByCategory(category: string, userId: string): Promise<Goal[]> {
    try {
      const snapshot = await db
        .collection('goals')
        .where('userId', '==', userId)
        .where('category', '==', category)
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => doc.data() as Goal);
    } catch (error: any) {
      throw new Error(`Failed to get goals by category: ${error.message}`);
    }
  }

  async getActiveGoals(userId: string): Promise<Goal[]> {
    try {
      const snapshot = await db
        .collection('goals')
        .where('userId', '==', userId)
        .where('status', '==', GoalStatus.ACTIVE)
        .orderBy('dueDate', 'asc')
        .get();
      
      return snapshot.docs.map(doc => doc.data() as Goal);
    } catch (error: any) {
      throw new Error(`Failed to get active goals: ${error.message}`);
    }
  }

  async updateGoalProgress(goalId: string, userId: string, progress: number): Promise<Goal> {
    try {
      const goalRef = db.collection('goals').doc(goalId);
      const goalDoc = await goalRef.get();

      if (!goalDoc.exists) {
        throw new Error('Goal not found');
      }

      const goal = goalDoc.data() as Goal;
      if (goal.userId !== userId) {
        throw new Error('Access denied');
      }

      const updateData: any = {
        'progress.percentage': progress,
        'progress.currentValue': progress,
        'progress.lastUpdated': new Date(),
        updatedAt: new Date(),
        lastModifiedAt: new Date()
      };

      if (progress >= 100) {
        updateData['status'] = GoalStatus.COMPLETED;
        updateData['completedAt'] = new Date();
      }

      await goalRef.update(updateData);
      
      const updatedDoc = await goalRef.get();
      return updatedDoc.data() as Goal;
    } catch (error: any) {
      throw new Error(`Failed to update goal progress: ${error.message}`);
    }
  }
}

export const goalService = new GoalService();
export default goalService;
