import { Router } from 'express';
import { noteController } from '../controllers/noteController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateNoteData:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         title:
 *           type: string
 *           description: Note title
 *         content:
 *           type: object
 *           required:
 *             - text
 *           properties:
 *             text:
 *               type: string
 *               description: Note text content
 *             html:
 *               type: string
 *               description: HTML formatted content
 *             markdown:
 *               type: string
 *               description: Markdown formatted content
 *             sections:
 *               type: array
 *               items:
 *                 type: object
 *               description: Note sections
 *             images:
 *               type: array
 *               items:
 *                 type: string
 *               description: Image URLs
 *             codeBlocks:
 *               type: array
 *               items:
 *                 type: object
 *               description: Code blocks
 *             tables:
 *               type: array
 *               items:
 *                 type: object
 *               description: Data tables
 *             lists:
 *               type: array
 *               items:
 *                 type: object
 *               description: Lists
 *         category:
 *           type: string
 *           description: Note category
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Note tags
 *         type:
 *           type: string
 *           enum: [personal, work, meeting, idea, reminder]
 *           description: Note type
 *         linkedGoals:
 *           type: array
 *           items:
 *             type: string
 *           description: Associated goal IDs
 *         linkedTasks:
 *           type: array
 *           items:
 *             type: string
 *           description: Associated task IDs
 *         isPublic:
 *           type: boolean
 *           description: Whether the note is public
 *         sharedWith:
 *           type: array
 *           items:
 *             type: string
 *           description: User IDs to share with
 *         metadata:
 *           type: object
 *           properties:
 *             subcategory:
 *               type: string
 *             context:
 *               type: object
 *               properties:
 *                 project:
 *                   type: string
 *                 client:
 *                   type: string
 *                 meeting:
 *                   type: string
 *                 location:
 *                   type: string
 *                 mood:
 *                   type: string
 *                 energy:
 *                   type: string
 *     
 *     UpdateNoteData:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         content:
 *           type: object
 *         category:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         type:
 *           type: string
 *         linkedGoals:
 *           type: array
 *           items:
 *             type: string
 *         linkedTasks:
 *           type: array
 *           items:
 *             type: string
 *         isPublic:
 *           type: boolean
 *         sharedWith:
 *           type: array
 *           items:
 *             type: string
 *     
 *     Note:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         title:
 *           type: string
 *         content:
 *           type: object
 *         metadata:
 *           type: object
 *         ai:
 *           type: object
 *         collaboration:
 *           type: object
 *         formatting:
 *           type: object
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         isDeleted:
 *           type: boolean
 */

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNoteData'
 *     responses:
 *       201:
 *         description: Note created successfully
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
 *                   $ref: '#/components/schemas/Note'
 *       400:
 *         description: Bad request - missing required fields
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, noteController.createNote);

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes for the authenticated user
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by note category
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [personal, work, meeting, idea, reminder]
 *         description: Filter by note type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by note status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *         description: Filter by note priority
 *     responses:
 *       200:
 *         description: Notes retrieved successfully
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
 *                     $ref: '#/components/schemas/Note'
 *                 count:
 *                   type: integer
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateToken, noteController.getNotes);

/**
 * @swagger
 * /api/notes/{noteId}:
 *   get:
 *     summary: Get a specific note by ID
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note retrieved successfully
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
 *                   $ref: '#/components/schemas/Note'
 *       400:
 *         description: Bad request - missing note ID
 *       401:
 *         description: Unauthorized - user not authenticated
 *       404:
 *         description: Note not found
 *       500:
 *         description: Internal server error
 */
router.get('/:noteId', authenticateToken, noteController.getNoteById);

/**
 * @swagger
 * /api/notes/{noteId}:
 *   put:
 *     summary: Update a specific note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNoteData'
 *     responses:
 *       200:
 *         description: Note updated successfully
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
 *                   $ref: '#/components/schemas/Note'
 *       400:
 *         description: Bad request - missing note ID or invalid data
 *       401:
 *         description: Unauthorized - user not authenticated
 *       404:
 *         description: Note not found
 *       500:
 *         description: Internal server error
 */
router.put('/:noteId', authenticateToken, noteController.updateNote);

/**
 * @swagger
 * /api/notes/{noteId}:
 *   delete:
 *     summary: Delete a specific note (soft delete)
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note deleted successfully
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
 *         description: Bad request - missing note ID
 *       401:
 *         description: Unauthorized - user not authenticated
 *       404:
 *         description: Note not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:noteId', authenticateToken, noteController.deleteNote);

/**
 * @swagger
 * /api/notes/category/{category}:
 *   get:
 *     summary: Get all notes by category
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Note category
 *     responses:
 *       200:
 *         description: Notes by category retrieved successfully
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
 *                     $ref: '#/components/schemas/Note'
 *                 count:
 *                   type: integer
 *       400:
 *         description: Bad request - missing category
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/category/:category', authenticateToken, noteController.getNotesByCategory);

/**
 * @swagger
 * /api/notes/type/{type}:
 *   get:
 *     summary: Get all notes by type
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [personal, work, meeting, idea, reminder]
 *         description: Note type
 *     responses:
 *       200:
 *         description: Notes by type retrieved successfully
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
 *                     $ref: '#/components/schemas/Note'
 *                 count:
 *                   type: integer
 *       400:
 *         description: Bad request - missing type
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/type/:type', authenticateToken, noteController.getNotesByType);

/**
 * @swagger
 * /api/notes/search:
 *   get:
 *     summary: Search notes by query
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Notes search completed successfully
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
 *                     $ref: '#/components/schemas/Note'
 *                 count:
 *                   type: integer
 *                 query:
 *                   type: string
 *       400:
 *         description: Bad request - missing search query
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/search', authenticateToken, noteController.searchNotes);

/**
 * @swagger
 * /api/notes/goal/{goalId}:
 *   get:
 *     summary: Get all notes for a specific goal
 *     tags: [Notes]
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
 *         description: Notes by goal retrieved successfully
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
 *                     $ref: '#/components/schemas/Note'
 *                 count:
 *                   type: integer
 *       400:
 *         description: Bad request - missing goal ID
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/goal/:goalId', authenticateToken, noteController.getNotesByGoal);

/**
 * @swagger
 * /api/notes/task/{taskId}:
 *   get:
 *     summary: Get all notes for a specific task
 *     tags: [Notes]
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
 *         description: Notes by task retrieved successfully
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
 *                     $ref: '#/components/schemas/Note'
 *                 count:
 *                   type: integer
 *       400:
 *         description: Bad request - missing task ID
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/task/:taskId', authenticateToken, noteController.getNotesByTask);

export default router;

