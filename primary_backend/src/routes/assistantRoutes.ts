import { Router, Request, Response } from 'express';
import { assistantService } from '../services/assistantService';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     VoiceCommandRequest:
 *       type: object
 *       required: 
 *         - transcription
 *       properties:
 *         transcription:
 *           type: string
 *           description: Voice transcription text
 *         context:
 *           type: object
 *           description: Additional context for the AI
 *     
 *     AssistantResponse:
 *       type: object
 *       properties:
 *         text:
 *           type: string
 *           description: AI response text
 *         actions:
 *           type: array
 *           items:
 *             type: object
 *           description: Actions taken by the AI
 *         suggestions:
 *           type: array
 *           items:
 *             type: string
 *           description: Suggested next steps
 *         confidence:
 *           type: number
 *           description: AI confidence level (0-1)
 *     
 *     UserInsights:
 *       type: object
 *       properties:
 *         priorities:
 *           type: array
 *           items:
 *             type: string
 *           description: User's current priorities
 *         suggestions:
 *           type: array
 *           items:
 *             type: string
 *           description: AI suggestions
 *         progress:
 *           type: number
 *           description: Overall progress percentage
 *     
 *     DailySummary:
 *       type: object
 *       properties:
 *         tasksCompleted:
 *           type: integer
 *           description: Number of tasks completed today
 *         tasksCreated:
 *           type: integer
 *           description: Number of tasks created today
 *         goalsProgress:
 *           type: integer
 *           description: Number of goals with progress updates
 *         notesTaken:
 *           type: integer
 *           description: Number of notes taken today
 *         recommendations:
 *           type: array
 *           items:
 *             type: string
 *           description: AI recommendations
 */

/**
 * @swagger
 * /api/assistant/voice:
 *   post:
 *     summary: Process voice input with AI assistant
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VoiceCommandRequest'
 *     responses:
 *       200:
 *         description: Voice processed successfully with AI response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/AssistantResponse'
 *       400:
 *         description: Bad request - missing transcription
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Internal server error
 */
router.post('/voice', authenticateToken, async (req: any, res: any) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const { transcription, context } = req.body;
    
    if (!transcription) {
      res.status(400).json({
        success: false,
        message: 'Transcription is required'
      });
      return;
    }

    const response = await assistantService.processVoiceInput(uid, transcription, context);
    
    res.status(200).json({
      success: true,
      message: 'Voice processed successfully',
      data: response
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to process voice input',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/assistant/insights:
 *   get:
 *     summary: Get user insights and AI recommendations
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User insights retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/UserInsights'
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/insights', authenticateToken, async (req: any, res: any) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const insights = await assistantService.getUserInsights(uid);
    
    res.status(200).json({
      success: true,
      message: 'User insights retrieved successfully',
      data: insights
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to get user insights',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/assistant/summary:
 *   get:
 *     summary: Get daily summary and AI recommendations
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daily summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/DailySummary'
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/summary', authenticateToken, async (req: any, res: any) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const summary = await assistantService.getDailySummary(uid);
    
    res.status(200).json({
      success: true,
      message: 'Daily summary retrieved successfully',
      data: summary
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to get daily summary',
      error: error.message
    });
  }
});

export default router;
