import { Router } from 'express';
import { authController } from '../controllers/authController';
import { 
  authenticateToken, 
  requireOwnership,
  authRateLimit 
} from '../middleware/authMiddleware';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user with email and password
 * @access  Public
 * @body    { email: string, password: string, displayName?: string }
 */
router.post('/register', authRateLimit(3, 15 * 60 * 1000), authController.register);

/**
 * @route   POST /api/auth/google
 * @desc    Handle Google authentication (client sends ID token)
 * @access  Public
 * @body    { idToken: string }
 */
router.post('/google', authRateLimit(5, 15 * 60 * 1000), authController.googleAuth);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.get('/profile', authenticateToken, authController.getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current user profile
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @body    { displayName?: string, photoURL?: string }
 */
router.put('/profile', authenticateToken, authController.updateProfile);

/**
 * @route   GET /api/auth/users/:uid
 * @desc    Get user by UID (admin or own profile)
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @param   uid - User ID
 */
router.get('/users/:uid', authenticateToken, authController.getUserById);

/**
 * @route   DELETE /api/auth/users/:uid
 * @desc    Delete user account (own account only)
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @param   uid - User ID
 */
router.delete('/users/:uid', authenticateToken, requireOwnership, authController.deleteUser);

/**
 * @route   POST /api/auth/verify-token
 * @desc    Verify Firebase ID token
 * @access  Public
 * @body    { idToken: string }
 */
router.post('/verify-token', authController.verifyToken);

/**
 * @route   POST /api/auth/revoke-tokens
 * @desc    Revoke all tokens for current user
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.post('/revoke-tokens', authenticateToken, authController.revokeTokens);

/**
 * @route   GET /api/auth/users
 * @desc    List all users (admin only)
 * @access  Private (admin only)
 * @header  Authorization: Bearer <token>
 * @query   maxResults?: number, nextPageToken?: string
 */
router.get('/users', authenticateToken, authController.listUsers);

export default router;