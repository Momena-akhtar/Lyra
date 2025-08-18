import { db } from '../config/firebase';
import { Task, CreateTaskData, UpdateTaskData, TaskSearchFilters, TaskStatus, TaskPriority } from '../models';

export class TaskService {
  async createTask(userId: string, data: CreateTaskData): Promise<Task> {
    try {
      const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const task: Task = {
        id: taskId,
        userId,
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastModifiedAt: new Date(),
        title: data.title,
        description: data.description,
        goalId: data.goalId,
        category: data.category,
        tags: data.tags || [],
        status: TaskStatus.TODO,
        priority: data.priority || TaskPriority.MEDIUM,
        progress: {
          currentStep: 0,
          totalSteps: 1,
          percentage: 0,
          completedSteps: [],
          remainingSteps: ['Complete task'],
          blockers: [],
          lastUpdated: new Date()
        },
        timeTracking: {
          estimatedDuration: data.estimatedDuration || 30,
          actualDuration: 0,
          timeEntries: [],
          totalTimeSpent: 0,
          averageSessionLength: 0,
          lastWorkedOn: new Date()
        },
        dependencies: [],
        subtasks: [],
        parentTaskId: data.parentTaskId,
        relatedTasks: [],
        context: {
          energyLevel: 'medium',
          focusLevel: 'shallow',
          environment: 'office',
          timeOfDay: 'morning',
          dayOfWeek: 'monday',
          season: 'spring',
          mood: 'focused',
          motivation: 'medium',
          stressLevel: 'low'
        },
        location: undefined,
        requiredResources: [],
        notes: '',
        aiInsights: {
          suggestedDuration: data.estimatedDuration || 30,
          optimalTimeOfDay: ['morning'],
          energyRequirement: 'medium',
          focusRequirement: 'medium',
          difficultyAssessment: 'as-expected',
          completionPrediction: {
            estimatedCompletion: new Date(Date.now() + (data.estimatedDuration || 30) * 60000),
            confidence: 80,
            factors: ['Clear requirements', 'Available time']
          },
          productivityTips: ['Break into smaller steps', 'Set specific deadline'],
          motivationSuggestions: ['Focus on the outcome', 'Celebrate small wins']
        },
        assignedTo: data.assignedTo || [userId],
        reviewedBy: undefined,
        approvedBy: undefined,
        collaborators: [],
        comments: [],
        attachments: [],
        reminders: [],
        quality: {
          selfRating: undefined,
          peerRating: undefined,
          supervisorRating: undefined,
          feedback: [],
          improvements: []
        },
        learnings: {
          whatWentWell: [],
          whatCouldBeImproved: [],
          keyInsights: [],
          nextTimeActions: []
        },
        externalId: undefined,
        source: 'manual',
        visibility: 'private',
        searchable: true,
        featured: false
      };

      await db.collection('tasks').doc(taskId).set(task as any);
      return task;
    } catch (error: any) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
  }

  async getTasks(userId: string, filters?: TaskSearchFilters): Promise<Task[]> {
    try {
      let query = db.collection('tasks').where('userId', '==', userId);

      if (filters?.status) {
        query = query.where('status', '==', filters.status);
      }
      if (filters?.priority) {
        query = query.where('priority', '==', filters.priority);
      }
      if (filters?.category) {
        query = query.where('category', '==', filters.category);
      }
      if (filters?.goalId) {
        query = query.where('goalId', '==', filters.goalId);
      }

      const snapshot = await query.orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => doc.data() as Task);
    } catch (error: any) {
      throw new Error(`Failed to get tasks: ${error.message}`);
    }
  }

  async getTaskById(taskId: string, userId: string): Promise<Task | null> {
    try {
      const taskDoc = await db.collection('tasks').doc(taskId).get();
      
      if (!taskDoc.exists) {
        return null;
      }

      const task = taskDoc.data() as Task;
      if (task.userId !== userId) {
        throw new Error('Access denied to task');
      }

      return task;
    } catch (error: any) {
      throw new Error(`Failed to get task: ${error.message}`);
    }
  }

  async updateTask(taskId: string, userId: string, data: UpdateTaskData): Promise<Task> {
    try {
      const taskRef = db.collection('tasks').doc(taskId);
      const taskDoc = await taskRef.get();

      if (!taskDoc.exists) {
        throw new Error('Task not found');
      }

      const task = taskDoc.data() as Task;
      if (task.userId !== userId) {
        throw new Error('Access denied');
      }

      const updateData: any = {
        ...data,
        updatedAt: new Date(),
        lastModifiedAt: new Date()
      };

      await taskRef.update(updateData);
      
      const updatedDoc = await taskRef.get();
      return updatedDoc.data() as Task;
    } catch (error: any) {
      throw new Error(`Failed to update task: ${error.message}`);
    }
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    try {
      const taskRef = db.collection('tasks').doc(taskId);
      const taskDoc = await taskRef.get();

      if (!taskDoc.exists) {
        throw new Error('Task not found');
      }

      const task = taskDoc.data() as Task;
      if (task.userId !== userId) {
        throw new Error('Access denied');
      }

      await taskRef.delete();
    } catch (error: any) {
      throw new Error(`Failed to delete task: ${error.message}`);
    }
  }

  async getTasksByGoal(goalId: string, userId: string): Promise<Task[]> {
    try {
      const snapshot = await db
        .collection('tasks')
        .where('userId', '==', userId)
        .where('goalId', '==', goalId)
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => doc.data() as Task);
    } catch (error: any) {
      throw new Error(`Failed to get tasks by goal: ${error.message}`);
    }
  }

  async getTasksByPriority(priority: TaskPriority, userId: string): Promise<Task[]> {
    try {
      const snapshot = await db
        .collection('tasks')
        .where('userId', '==', userId)
        .where('priority', '==', priority)
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => doc.data() as Task);
    } catch (error: any) {
      throw new Error(`Failed to get tasks by priority: ${error.message}`);
    }
  }

  async getOverdueTasks(userId: string): Promise<Task[]> {
    try {
      const now = new Date();
      const snapshot = await db
        .collection('tasks')
        .where('userId', '==', userId)
        .where('dueDate', '<', now)
        .where('status', '!=', TaskStatus.DONE)
        .orderBy('dueDate', 'asc')
        .get();
      
      return snapshot.docs.map(doc => doc.data() as Task);
    } catch (error: any) {
      throw new Error(`Failed to get overdue tasks: ${error.message}`);
    }
  }
}

export const taskService = new TaskService();
export default taskService;
