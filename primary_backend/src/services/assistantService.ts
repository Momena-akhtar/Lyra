import { taskService } from './taskService';
import { goalService } from './goalService';
import { noteService } from './noteService';
import { ConversationAction, CreateTaskData, CreateGoalData, CreateNoteData } from '../models';

export interface AssistantResponse {
  text: string;
  actions: ConversationAction[];
  suggestions: string[];
  confidence: number;
}

export interface VoiceCommand {
  intent: string;
  entities: {
    type: string;
    value: any;
    confidence: number;
  }[];
  confidence: number;
}

export class AssistantService {
  /**
   * Main method to process voice input and generate intelligent response
   */
  async processVoiceInput(userId: string, transcription: string, context?: any): Promise<AssistantResponse> {
    try {
      // Analyze the voice input
      const command = this.analyzeVoiceCommand(transcription);
      
      // Generate response and actions
      const response = await this.generateResponse(userId, command, context);
      
      return response;
    } catch (error: any) {
      throw new Error(`Failed to process voice input: ${error.message}`);
    }
  }

  /**
   * Analyze voice input to understand intent and extract entities
   */
  private analyzeVoiceCommand(transcription: string): VoiceCommand {
    const lowerText = transcription.toLowerCase();
    
    // Intent detection
    let intent = 'general';
    let entities: any[] = [];
    let confidence = 0.8;

    // Task creation
    if (lowerText.includes('create task') || lowerText.includes('add task') || lowerText.includes('new task')) {
      intent = 'create_task';
      confidence = 0.9;
      
      // Extract task details
      const taskMatch = lowerText.match(/(?:create|add|new)\s+task\s+(?:to\s+)?(.+)/);
      if (taskMatch) {
        entities.push({
          type: 'task_title',
          value: taskMatch[1].trim(),
          confidence: 0.9
        });
      }
    }

    // Goal setting
    else if (lowerText.includes('set goal') || lowerText.includes('create goal') || lowerText.includes('new goal')) {
      intent = 'create_goal';
      confidence = 0.9;
      
      const goalMatch = lowerText.match(/(?:set|create|new)\s+goal\s+(?:to\s+)?(.+)/);
      if (goalMatch) {
        entities.push({
          type: 'goal_title',
          value: goalMatch[1].trim(),
          confidence: 0.9
        });
      }
    }

    // Note taking
    else if (lowerText.includes('take note') || lowerText.includes('create note') || lowerText.includes('remember')) {
      intent = 'create_note';
      confidence = 0.9;
      
      const noteMatch = lowerText.match(/(?:take|create)\s+note\s+(?:about\s+)?(.+)/);
      if (noteMatch) {
        entities.push({
          type: 'note_content',
          value: noteMatch[1].trim(),
          confidence: 0.9
        });
      }
    }

    // Priority checking
    else if (lowerText.includes('priority') || lowerText.includes('focus') || lowerText.includes('important')) {
      intent = 'check_priorities';
      confidence = 0.8;
    }

    // Progress checking
    else if (lowerText.includes('progress') || lowerText.includes('how am i doing') || lowerText.includes('status')) {
      intent = 'check_progress';
      confidence = 0.8;
    }

    // Task completion
    else if (lowerText.includes('complete') || lowerText.includes('done') || lowerText.includes('finished')) {
      intent = 'complete_task';
      confidence = 0.8;
      
      const taskMatch = lowerText.match(/(?:complete|done|finished)\s+(.+)/);
      if (taskMatch) {
        entities.push({
          type: 'task_title',
          value: taskMatch[1].trim(),
          confidence: 0.8
        });
      }
    }

    // Goal progress update
    else if (lowerText.includes('update goal') || lowerText.includes('goal progress')) {
      intent = 'update_goal_progress';
      confidence = 0.8;
      
      const progressMatch = lowerText.match(/(?:update|set)\s+goal\s+(.+?)\s+(?:to|at)\s+(\d+)%/);
      if (progressMatch) {
        entities.push({
          type: 'goal_title',
          value: progressMatch[1].trim(),
          confidence: 0.8
        });
        entities.push({
          type: 'progress_value',
          value: parseInt(progressMatch[2]),
          confidence: 0.9
        });
      }
    }

    return { intent, entities, confidence };
  }

  /**
   * Generate intelligent response and actions based on command
   */
  private async generateResponse(userId: string, command: VoiceCommand, context?: any): Promise<AssistantResponse> {
    const actions: ConversationAction[] = [];
    let responseText = '';
    let suggestions: string[] = [];
    let confidence = command.confidence;

    try {
      switch (command.intent) {
        case 'create_task':
          const taskTitle = command.entities.find(e => e.type === 'task_title')?.value || 'New task';
          const taskData: CreateTaskData = {
            title: taskTitle,
            description: `Task created via voice command`,
            category: 'general',
            tags: ['voice-created'],
            priority: 2
          };
          
          const task = await taskService.createTask(userId, taskData);
          
          actions.push({
            id: `action_${Date.now()}`,
            type: 'task-created',
            description: `Created task: ${taskTitle}`,
            timestamp: new Date(),
            status: 'completed',
            details: {
              entityType: 'task',
              entityId: task.id,
              data: task,
              metadata: { source: 'voice-command' }
            },
            executedAt: new Date(),
            executedBy: 'ai-assistant',
            result: task,
            followUpRequired: false
          });

          responseText = `I've created a task: "${taskTitle}". What else would you like me to help you with?`;
          suggestions = ['Set a deadline', 'Add more details', 'Create another task'];
          break;

        case 'create_goal':
          const goalTitle1 = command.entities.find(e => e.type === 'goal_title')?.value || 'New goal';
          const goalData: CreateGoalData = {
            title: goalTitle1,
            description: `Goal set via voice command`,
            category: 'personal',
            tags: ['voice-created'],
            startDate: new Date(),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
          };
          
          const goal = await goalService.createGoal(userId, goalData);
          
          actions.push({
            id: `action_${Date.now()}`,
            type: 'goal-set',
            description: `Set goal: ${goalTitle1}`,
            timestamp: new Date(),
            status: 'completed',
            details: {
              entityType: 'goal',
              entityId: goal.id,
              data: goal,
              metadata: { source: 'voice-command' }
            },
            executedAt: new Date(),
            executedBy: 'ai-assistant',
            result: goal,
            followUpRequired: false
          });

          responseText = `Great! I've set a goal: "${goalTitle1}". This will help you stay focused. What's your next step?`;
          suggestions = ['Break it into smaller tasks', 'Set milestones', 'Track progress'];
          break;

        case 'create_note':
          const noteContent = command.entities.find(e => e.type === 'note_content')?.value || 'Important information';
          const noteData: CreateNoteData = {
            title: `Note: ${noteContent.substring(0, 50)}...`,
            content: { text: noteContent },
            category: 'general',
            tags: ['voice-created']
          };
          
          const note = await noteService.createNote(userId, noteData);
          
          actions.push({
            id: `action_${Date.now()}`,
            type: 'note-created',
            description: `Created note: ${noteContent.substring(0, 30)}...`,
            timestamp: new Date(),
            status: 'completed',
            details: {
              entityType: 'note',
              entityId: note.id,
              data: note,
              metadata: { source: 'voice-command' }
            },
            executedAt: new Date(),
            executedBy: 'ai-assistant',
            result: note,
            followUpRequired: false
          });

          responseText = `I've saved that note for you. Is there anything else you'd like me to remember?`;
          suggestions = ['Add more details', 'Create a task from this', 'Set a reminder'];
          break;

        case 'complete_task':
          const taskToComplete = command.entities.find(e => e.type === 'task_title')?.value;
          if (taskToComplete) {
            // Find and complete the task
            const tasks = await taskService.getTasks(userId);
            const matchingTask = tasks.find(t => 
              t.title.toLowerCase().includes(taskToComplete.toLowerCase())
            );
            
            if (matchingTask) {
              await taskService.updateTask(matchingTask.id, userId, { status: 'done' as any });
              
              actions.push({
                id: `action_${Date.now()}`,
                type: 'custom',
                description: `Completed task: ${matchingTask.title}`,
                timestamp: new Date(),
                status: 'completed',
                details: {
                  entityType: 'task',
                  entityId: matchingTask.id,
                  data: matchingTask,
                  metadata: { source: 'voice-command' }
                },
                executedAt: new Date(),
                executedBy: 'ai-assistant',
                result: { status: 'completed' },
                followUpRequired: false
              });

              responseText = `Great job! I've marked "${matchingTask.title}" as completed. What's next on your list?`;
              suggestions = ['Check your progress', 'Create a new task', 'Review your goals'];
            } else {
              responseText = `I couldn't find a task matching "${taskToComplete}". Could you be more specific?`;
              suggestions = ['List all tasks', 'Create a new task', 'Check task names'];
            }
          }
          break;

        case 'update_goal_progress':
          const goalTitle2 = command.entities.find(e => e.type === 'goal_title')?.value;
          const progressValue = command.entities.find(e => e.type === 'progress_value')?.value;
          
          if (goalTitle2 && progressValue) {
            const goals = await goalService.getGoals(userId);
            const matchingGoal = goals.find(g => 
              g.title.toLowerCase().includes(goalTitle2.toLowerCase())
            );
            
            if (matchingGoal) {
              await goalService.updateGoalProgress(matchingGoal.id, userId, progressValue);
              
              actions.push({
                id: `action_${Date.now()}`,
                type: 'custom',
                description: `Updated goal progress: ${matchingGoal.title} to ${progressValue}%`,
                timestamp: new Date(),
                status: 'completed',
                details: {
                  entityType: 'goal',
                  entityId: matchingGoal.id,
                  data: matchingGoal,
                  metadata: { source: 'voice-command', progress: progressValue }
                },
                executedAt: new Date(),
                executedBy: 'ai-assistant',
                result: { progress: progressValue },
                followUpRequired: false
              });

              responseText = `Perfect! I've updated "${matchingGoal.title}" to ${progressValue}% progress. Keep up the great work!`;
              suggestions = ['Check other goals', 'Create related tasks', 'Set next milestone'];
            } else {
              responseText = `I couldn't find a goal matching "${goalTitle2}". Could you be more specific?`;
              suggestions = ['List all goals', 'Create a new goal', 'Check goal names'];
            }
          }
          break;

        case 'check_priorities':
          const tasks = await taskService.getTasks(userId, { priority: 3 });
          const goals = await goalService.getGoals(userId, { status: 'active' as any });
          
          responseText = `You have ${tasks.length} high-priority tasks and ${goals.length} active goals. Would you like me to list them?`;
          suggestions = ['Show high-priority tasks', 'Review goals', 'Create new priority'];
          break;

        case 'check_progress':
          const allTasks = await taskService.getTasks(userId);
          const completedTasks = allTasks.filter(t => t.status === 'done');
          const progress = Math.round((completedTasks.length / allTasks.length) * 100) || 0;
          
          responseText = `You've completed ${completedTasks.length} out of ${allTasks.length} tasks. That's ${progress}% progress! Keep going!`;
          suggestions = ['Review completed tasks', 'Set new goals', 'Plan next steps'];
          break;

        default:
          responseText = `I heard: "${command.intent}". How can I help you today?`;
          suggestions = ['Create a task', 'Set a goal', 'Take a note', 'Check priorities'];
          confidence = 0.6;
      }
    } catch (error: any) {
      responseText = `I encountered an issue: ${error.message}. Let me try a different approach.`;
      suggestions = ['Try again', 'Rephrase your request', 'Check your connection'];
      confidence = 0.3;
    }

    return {
      text: responseText,
      actions,
      suggestions,
      confidence
    };
  }

  /**
   * Get user's current priorities and suggestions
   */
  async getUserInsights(userId: string): Promise<{
    priorities: string[];
    suggestions: string[];
    progress: number;
  }> {
    try {
      const tasks = await taskService.getTasks(userId);
      const goals = await goalService.getGoals(userId);
      const notes = await noteService.getNotes(userId);

      const highPriorityTasks = tasks.filter(t => t.priority >= 3);
      const activeGoals = goals.filter(g => g.status === 'active');
      const recentNotes = notes.slice(0, 5);

      const priorities = [
        `You have ${highPriorityTasks.length} high-priority tasks`,
        `You're working on ${activeGoals.length} active goals`,
        `You've taken ${recentNotes.length} recent notes`
      ];

      const suggestions = [
        'Focus on high-priority tasks first',
        'Review your goals weekly',
        'Take notes during important conversations'
      ];

      const progress = Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) || 0;

      return { priorities, suggestions, progress };
    } catch (error: any) {
      throw new Error(`Failed to get user insights: ${error.message}`);
    }
  }

  /**
   * Get user's daily summary
   */
  async getDailySummary(userId: string): Promise<{
    tasksCompleted: number;
    tasksCreated: number;
    goalsProgress: number;
    notesTaken: number;
    recommendations: string[];
  }> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tasks = await taskService.getTasks(userId);
      const goals = await goalService.getGoals(userId);
      const notes = await noteService.getNotes(userId);

      const tasksCompleted = tasks.filter(t => 
        t.status === 'done' && t.updatedAt >= today
      ).length;

      const tasksCreated = tasks.filter(t => 
        t.createdAt >= today
      ).length;

      const goalsProgress = goals.filter(g => 
        g.status === 'active' && g.progress.lastUpdated >= today
      ).length;

      const notesTaken = notes.filter(n => 
        n.createdAt >= today
      ).length;

      const recommendations = [
        'Review your completed tasks',
        'Plan tomorrow\'s priorities',
        'Update goal progress',
        'Reflect on your achievements'
      ];

      return {
        tasksCompleted,
        tasksCreated,
        goalsProgress,
        notesTaken,
        recommendations
      };
    } catch (error: any) {
      throw new Error(`Failed to get daily summary: ${error.message}`);
    }
  }
}

export const assistantService = new AssistantService();
export default assistantService;
