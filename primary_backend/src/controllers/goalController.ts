import { Request, Response } from 'express';
import { goalService } from '../services/goalService';
import { CreateGoalData, UpdateGoalData, GoalSearchFilters } from '../models';

export class GoalController {
  async createGoal(req: Request, res: Response): Promise<void> {
    try {
      const uid = (req as any).user?.uid;
      if (!uid) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const goalData: CreateGoalData = req.body;
      
      // Validate required fields
      if (!goalData.title) {
        res.status(400).json({
          success: false,
          message: 'Goal title is required'
        });
        return;
      }

      const goal = await goalService.createGoal(uid, goalData);
      
      res.status(201).json({
        success: true,
        message: 'Goal created successfully',
        data: goal
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to create goal',
        error: error.message
      });
    }
  }

  async getGoals(req: Request, res: Response): Promise<void> {
    try {
      const uid = (req as any).user?.uid;
      if (!uid) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const filters: GoalSearchFilters = {
        status: req.query.status as any,
        category: req.query.category as string,
        priority: req.query.priority as string
      };

      const goals = await goalService.getGoals(uid, filters);
      
      res.status(200).json({
        success: true,
        message: 'Goals retrieved successfully',
        data: goals,
        count: goals.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve goals',
        error: error.message
      });
    }
  }

  async getGoalById(req: Request, res: Response): Promise<void> {
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

      const goal = await goalService.getGoalById(goalId, uid);
      
      if (!goal) {
        res.status(404).json({
          success: false,
          message: 'Goal not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Goal retrieved successfully',
        data: goal
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve goal',
        error: error.message
      });
    }
  }

  async updateGoal(req: Request, res: Response): Promise<void> {
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

      const updateData: UpdateGoalData = req.body;
      const updatedGoal = await goalService.updateGoal(goalId, uid, updateData);
      
      res.status(200).json({
        success: true,
        message: 'Goal updated successfully',
        data: updatedGoal
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update goal',
        error: error.message
      });
    }
  }

  async deleteGoal(req: Request, res: Response): Promise<void> {
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

      await goalService.deleteGoal(goalId, uid);
      
      res.status(200).json({
        success: true,
        message: 'Goal deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete goal',
        error: error.message
      });
    }
  }

  async getGoalsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const uid = (req as any).user?.uid;
      if (!uid) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { category } = req.params;
      if (!category) {
        res.status(400).json({
          success: false,
          message: 'Category is required'
        });
        return;
      }

      const goals = await goalService.getGoalsByCategory(category, uid);
      
      res.status(200).json({
        success: true,
        message: 'Goals by category retrieved successfully',
        data: goals,
        count: goals.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve goals by category',
        error: error.message
      });
    }
  }

  async getActiveGoals(req: Request, res: Response): Promise<void> {
    try {
      const uid = (req as any).user?.uid;
      if (!uid) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const goals = await goalService.getActiveGoals(uid);
      
      res.status(200).json({
        success: true,
        message: 'Active goals retrieved successfully',
        data: goals,
        count: goals.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve active goals',
        error: error.message
      });
    }
  }

  async updateGoalProgress(req: Request, res: Response): Promise<void> {
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

      const { progress } = req.body;
      if (typeof progress !== 'number' || progress < 0 || progress > 100) {
        res.status(400).json({
          success: false,
          message: 'Progress must be a number between 0 and 100'
        });
        return;
      }

      const updatedGoal = await goalService.updateGoalProgress(goalId, uid, progress);
      
      res.status(200).json({
        success: true,
        message: 'Goal progress updated successfully',
        data: updatedGoal
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update goal progress',
        error: error.message
      });
    }
  }
}

export const goalController = new GoalController();
export default goalController;

