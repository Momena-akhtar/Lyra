import { Request, Response } from 'express';
import { taskService } from '../services/taskService';
import { CreateTaskData, UpdateTaskData, TaskSearchFilters } from '../models';

export class TaskController {
  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const uid = (req as any).user?.uid;
      if (!uid) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const taskData: CreateTaskData = req.body;
      
      // Validate required fields
      if (!taskData.title) {
        res.status(400).json({
          success: false,
          message: 'Task title is required'
        });
        return;
      }

      const task = await taskService.createTask(uid, taskData);
      
      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to create task',
        error: error.message
      });
    }
  }

  async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const uid = (req as any).user?.uid;
      if (!uid) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const filters: TaskSearchFilters = {
        status: req.query.status as any,
        priority: req.query.priority ? parseInt(req.query.priority as string) : undefined,
        category: req.query.category as string,
        goalId: req.query.goalId as string
      };

      const tasks = await taskService.getTasks(uid, filters);
      
      res.status(200).json({
        success: true,
        message: 'Tasks retrieved successfully',
        data: tasks,
        count: tasks.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve tasks',
        error: error.message
      });
    }
  }

  async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const uid = (req as any).user?.uid;
      if (!uid) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { taskId } = req.params;
      if (!taskId) {
        res.status(400).json({
          success: false,
          message: 'Task ID is required'
        });
        return;
      }

      const task = await taskService.getTaskById(taskId, uid);
      
      if (!task) {
        res.status(404).json({
          success: false,
          message: 'Task not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Task retrieved successfully',
        data: task
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve task',
        error: error.message
      });
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const uid = (req as any).user?.uid;
      if (!uid) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { taskId } = req.params;
      if (!taskId) {
        res.status(400).json({
          success: false,
          message: 'Task ID is required'
        });
        return;
      }

      const updateData: UpdateTaskData = req.body;
      const updatedTask = await taskService.updateTask(taskId, uid, updateData);
      
      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: updatedTask
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update task',
        error: error.message
      });
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const uid = (req as any).user?.uid;
      if (!uid) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { taskId } = req.params;
      if (!taskId) {
        res.status(400).json({
          success: false,
          message: 'Task ID is required'
        });
        return;
      }

      await taskService.deleteTask(taskId, uid);
      
      res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete task',
        error: error.message
      });
    }
  }

  async getTasksByGoal(req: Request, res: Response): Promise<void> {
    try {
      const uid = (req as any).user?.uid;
      if (!uid) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { goalId } = req.params;
      if (!goalId) {
        res.status(400).json({
          success: false,
          message: 'Goal ID is required'
        });
        return;
      }

      const tasks = await taskService.getTasksByGoal(goalId, uid);
      
      res.status(200).json({
        success: true,
        message: 'Tasks by goal retrieved successfully',
        data: tasks,
        count: tasks.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve tasks by goal',
        error: error.message
      });
    }
  }

  async getTasksByPriority(req: Request, res: Response): Promise<void> {
    try {
      const uid = (req as any).user?.uid;
      if (!uid) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { priority } = req.params;
      if (!priority) {
        res.status(400).json({
          success: false,
          message: 'Priority is required'
        });
        return;
      }

      const priorityNum = parseInt(priority);
      if (isNaN(priorityNum) || priorityNum < 1 || priorityNum > 3) {
        res.status(400).json({
          success: false,
          message: 'Priority must be 1, 2, or 3'
        });
        return;
      }

      const tasks = await taskService.getTasksByPriority(priorityNum, uid);
      
      res.status(200).json({
        success: true,
        message: 'Tasks by priority retrieved successfully',
        data: tasks,
        count: tasks.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve tasks by priority',
        error: error.message
      });
    }
  }

  async getOverdueTasks(req: Request, res: Response): Promise<void> {
    try {
      const uid = (req as any).user?.uid;
      if (!uid) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const tasks = await taskService.getOverdueTasks(uid);
      
      res.status(200).json({
        success: true,
        message: 'Overdue tasks retrieved successfully',
        data: tasks,
        count: tasks.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve overdue tasks',
        error: error.message
      });
    }
  }
}

export const taskController = new TaskController();
export default taskController;

