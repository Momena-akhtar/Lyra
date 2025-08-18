import { Router } from 'express';
import { goalController } from '../controllers/goalController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateGoalData:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: Goal title
 *         description:
 *           type: string
 *           description: Goal description
 *         category:
 *           type: string
 *           description: Goal category
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Goal tags
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Goal start date
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: Goal due date
 *         estimatedEffort:
 *           type: integer
 *           description: Estimated effort in hours
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           description: Goal priority
 *         motivation:
 *           type: object
 *           properties:
 *             why:
 *               type: string
 *             benefits:
 *               type: array
 *               items:
 *                 type: string
 *             obstacles:
 *               type: array
 *               items:
 *                 type: string
 *             strategies:
 *               type: array
 *               items:
 *                 type: string
 *         isPublic:
 *           type: boolean
 *           description: Whether the goal is public
 *     
 *     UpdateGoalData:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, completed, archived, paused]
 *         category:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         dueDate:
 *           type: string
 *           format: date-time
 *         estimatedEffort:
 *           type: integer
 *         priority:
 *           type: string
 *         motivation:
 *           type: object
 *         isPublic:
 *           type: boolean
 *     
 *     Goal:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *         category:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         startDate:
 *           type: string
 *           format: date-time
 *         dueDate:
 *           type: string
 *           format: date-time
 *         progress:
 *           type: object
 *         metrics:
 *           type: object
 *         aiInsights:
 *           type: object
 */

/**
 * @swagger
 * /api/goals:
 *   post:
 *     summary: Create a new goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGoalData'
 *     responses:
 *       201:
 *         description: Goal created successfully
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
 *                   $ref: '#/components/schemas/Goal'
 *       400:
 *         description: Bad request - missing required fields
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, goalController.createGoal);

/**
 * @swagger
 * /api/goals:
 *   get:
 *     summary: Get all goals for the authenticated user
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, archived, paused]
 *         description: Filter by goal status
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by goal category
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter by goal priority
 *     responses:
 *       200:
 *         description: Goals retrieved successfully
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Goal'
 *                 count:
 *                   type: integer
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateToken, goalController.getGoals);

/**
 * @swagger
 * /api/goals/{goalId}:
 *   get:
 *     summary: Get a specific goal by ID
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: goalId
 *         required: true
 *         schema:
 *           type: string
 *         description: Goal ID
 *     responses:
 *       200:
 *         description: Goal retrieved successfully
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
 *                   $ref: '#/components/schemas/Goal'
 *       400:
 *         description: Bad request - missing goal ID
 *       401:
 *         description: Unauthorized - user not authenticated
 *       404:
 *         description: Goal not found
 *       500:
 *         description: Internal server error
 */
router.get('/:goalId', authenticateToken, goalController.getGoalById);

/**
 * @swagger
 * /api/goals/{goalId}:
 *   put:
 *     summary: Update a specific goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: goalId
 *         required: true
 *         schema:
 *           type: string
 *         description: Goal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateGoalData'
 *     responses:
 *       200:
 *         description: Goal updated successfully
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
 *                   $ref: '#/components/schemas/Goal'
 *       400:
 *         description: Bad request - missing goal ID or invalid data
 *       401:
 *         description: Unauthorized - user not authenticated
 *       404:
 *         description: Goal not found
 *       500:
 *         description: Internal server error
 */
router.put('/:goalId', authenticateToken, goalController.updateGoal);

/**
 * @swagger
 * /api/goals/{goalId}:
 *   delete:
 *     summary: Delete a specific goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: goalId
 *         required: true
 *         schema:
 *           type: string
 *         description: Goal ID
 *     responses:
 *       200:
 *         description: Goal deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - missing goal ID
 *       401:
 *         description: Unauthorized - user not authenticated
 *       404:
 *         description: Goal not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:goalId', authenticateToken, goalController.deleteGoal);

/**
 * @swagger
 * /api/goals/category/{category}:
 *   get:
 *     summary: Get all goals by category
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Goal category
 *     responses:
 *       200:
 *         description: Goals by category retrieved successfully
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Goal'
 *                 count:
 *                   type: integer
 *       400:
 *         description: Bad request - missing category
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/category/:category', authenticateToken, goalController.getGoalsByCategory);

/**
 * @swagger
 * /api/goals/active:
 *   get:
 *     summary: Get all active goals for the authenticated user
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active goals retrieved successfully
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Goal'
 *                 count:
 *                   type: integer
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/active', authenticateToken, goalController.getActiveGoals);

/**
 * @swagger
 * /api/goals/{goalId}/progress:
 *   put:
 *     summary: Update goal progress
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: goalId
 *         required: true
 *         schema:
 *           type: string
 *         description: Goal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - progress
 *             properties:
 *               progress:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Progress percentage (0-100)
 *     responses:
 *       200:
 *         description: Goal progress updated successfully
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
 *                   $ref: '#/components/schemas/Goal'
 *       400:
 *         description: Bad request - invalid progress value
 *       401:
 *         description: Unauthorized - user not authenticated
 *       404:
 *         description: Goal not found
 *       500:
 *         description: Internal server error
 */
router.put('/:goalId/progress', authenticateToken, goalController.updateGoalProgress);

export default router;

