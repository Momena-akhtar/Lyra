import { Router } from 'express';
import { voiceController } from '../controllers/voiceController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * /api/voice/process:
 *   post:
 *     summary: Process voice input and convert to text
 *     description: Convert voice input to text using OpenAI Whisper STT (Speech-to-Text) API
 *     tags: [Voice Processing]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - audioData
 *               - audioFormat
 *             properties:
 *               audioData:
 *                 type: string
 *                 description: Base64 encoded audio data or data URL
 *                 example: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT..."
 *               audioFormat:
 *                 type: string
 *                 enum: [wav, mp3, m4a, webm]
 *                 description: Audio file format
 *                 example: "wav"
 *               language:
 *                 type: string
 *                 description: Language code for transcription (e.g., 'en', 'es', 'fr')
 *                 example: "en"
 *               sessionId:
 *                 type: string
 *                 description: Optional session ID to group transcriptions
 *                 example: "session_1234567890_abc123def"
 *               duration:
 *                 type: number
 *                 description: Duration of audio in seconds
 *                 example: 5.2
 *     responses:
 *       200:
 *         description: Voice input processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         transcription:
 *                           $ref: '#/components/schemas/TranscriptionResult'
 *                         sessionId:
 *                           type: string
 *                           description: Session ID if provided
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/process', 
    authenticateToken, 
    voiceController.processVoiceInput);

/**
 * @swagger
 * /api/voice/session/start:
 *   post:
 *     summary: Start a new voice session
 *     description: Create a new voice session to group multiple transcriptions together
 *     tags: [Voice Sessions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Voice session started successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         session:
 *                           $ref: '#/components/schemas/VoiceSession'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/session/start', 
    authenticateToken, 
    voiceController.startVoiceSession);

/**
 * @swagger
 * /api/voice/session/{sessionId}/end:
 *   post:
 *     summary: End a voice session
 *     description: Mark a voice session as completed
 *     tags: [Voice Sessions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Voice session ID
 *         example: "session_1234567890_abc123def"
 *     responses:
 *       200:
 *         description: Voice session ended successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         session:
 *                           $ref: '#/components/schemas/VoiceSession'
 *       400:
 *         description: Bad request - missing session ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/session/:sessionId/end', 
    authenticateToken, 
    voiceController.endVoiceSession);

/**
 * @swagger
 * /api/voice/session/{sessionId}:
 *   get:
 *     summary: Get voice session by ID
 *     description: Retrieve a specific voice session with all its transcriptions
 *     tags: [Voice Sessions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Voice session ID
 *         example: "session_1234567890_abc123def"
 *     responses:
 *       200:
 *         description: Voice session retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         session:
 *                           $ref: '#/components/schemas/VoiceSession'
 *       400:
 *         description: Bad request - missing session ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Voice session not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/session/:sessionId', 
    authenticateToken, 
    voiceController.getVoiceSession);

/**
 * @swagger
 * /api/voice/sessions:
 *   get:
 *     summary: Get user's voice sessions
 *     description: Retrieve a list of the current user's voice sessions
 *     tags: [Voice Sessions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           minimum: 1
 *           maximum: 100
 *         description: Maximum number of sessions to return
 *         example: 20
 *     responses:
 *       200:
 *         description: Voice sessions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         sessions:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/VoiceSession'
 *                         total:
 *                           type: integer
 *                           description: Total number of sessions returned
 *                         limit:
 *                           type: integer
 *                           description: Maximum number of sessions requested
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/sessions', 
    authenticateToken, 
    voiceController.getUserVoiceSessions);
    
export default router;
