import { Router } from 'express';
import { taskController } from '../controllers/taskController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateTaskData:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: Task title
 *         description:
 *           type: string
 *           description: Task description
 *         goalId:
 *           type: string
 *           description: Associated goal ID
 *         category:
 *           type: string
 *           description: Task category
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Task tags
 *         priority:
 *           type: integer
 *           minimum: 1
 *           maximum: 3
 *           description: Task priority (1=low, 2=medium, 3=high)
 *         estimatedDuration:
 *           type: integer
 *           description: Estimated duration in minutes
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: Task due date
 *         parentTaskId:
 *           type: string
 *           description: Parent task ID for subtasks
 *         subtasks:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of subtask IDs
 *         dependencies:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of dependent task IDs
 *         location:
 *           type: string
 *           description: Task location
 *         assignedTo:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of assigned user IDs
 *     
 *     UpdateTaskData:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [todo, in-progress, done, blocked]
 *         priority:
 *           type: integer
 *           minimum: 1
 *           maximum: 3
 *         category:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         dueDate:
 *           type: string
 *           format: date-time
 *         estimatedDuration:
 *           type: integer
 *         notes:
 *           type: string
 *     
 *     Task:
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
 *         priority:
 *           type: integer
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
 *         dueDate:
 *           type: string
 *           format: date-time
 *         progress:
 *           type: object
 *         timeTracking:
 *           type: object
 *         aiInsights:
 *           type: object
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskData'
 *     responses:
 *       201:
 *         description: Task created successfully
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
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request - missing required fields
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, taskController.createTask);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [todo, in-progress, done, blocked]
 *         description: Filter by task status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 3
 *         description: Filter by task priority
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by task category
 *       - in: query
 *         name: goalId
 *         schema:
 *           type: string
 *         description: Filter by associated goal
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
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
 *                     $ref: '#/components/schemas/Task'
 *                 count:
 *                   type: integer
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateToken, taskController.getTasks);

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   get:
 *     summary: Get a specific task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task retrieved successfully
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
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request - missing task ID
 *       401:
 *         description: Unauthorized - user not authenticated
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.get('/:taskId', authenticateToken, taskController.getTaskById);

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   put:
 *     summary: Update a specific task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskData'
 *     responses:
 *       200:
 *         description: Task updated successfully
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
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request - missing task ID or invalid data
 *       401:
 *         description: Unauthorized - user not authenticated
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.put('/:taskId', authenticateToken, taskController.updateTask);

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   delete:
 *     summary: Delete a specific task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
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
 *         description: Bad request - missing task ID
 *       401:
 *         description: Unauthorized - user not authenticated
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:taskId', authenticateToken, taskController.deleteTask);

/**
 * @swagger
 * /api/tasks/goal/{goalId}:
 *   get:
 *     summary: Get all tasks for a specific goal
 *     tags: [Tasks]
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
 *         description: Tasks by goal retrieved successfully
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
 *                     $ref: '#/components/schemas/Task'
 *                 count:
 *                   type: integer
 *       400:
 *         description: Bad request - missing goal ID
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/goal/:goalId', authenticateToken, taskController.getTasksByGoal);

/**
 * @swagger
 * /api/tasks/priority/{priority}:
 *   get:
 *     summary: Get all tasks by priority level
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: priority
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 3
 *         description: Priority level (1=low, 2=medium, 3=high)
 *     responses:
 *       200:
 *         description: Tasks by priority retrieved successfully
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
 *                     $ref: '#/components/schemas/Task'
 *                 count:
 *                   type: integer
 *       400:
 *         description: Bad request - invalid priority level
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/priority/:priority', authenticateToken, taskController.getTasksByPriority);

/**
 * @swagger
 * /api/tasks/overdue:
 *   get:
 *     summary: Get all overdue tasks for the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overdue tasks retrieved successfully
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
 *                     $ref: '#/components/schemas/Task'
 *                 count:
 *                   type: integer
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/overdue', authenticateToken, taskController.getOverdueTasks);

export default router;

