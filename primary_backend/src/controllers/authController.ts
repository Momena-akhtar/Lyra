import { Request, Response } from 'express';
import { authService, CreateUserData, UpdateUserData } from '../services/authService';

export class AuthController {
  /**
   * Register a new user with email and password
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, displayName }: CreateUserData = req.body;

      // Validation
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
        return;
      }

      // Check if user already exists
      const existingUser = await authService.getUserByEmail(email);
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
        return;
      }

      // Create user
      const user = await authService.createUser({
        email,
        password,
        displayName
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt
          }
        }
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create user',
        error: error.message
      });
    }
  }

  /**
   * Login user with email and password
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
        return;
      }

      // Attempt to sign in user
      const user = await authService.signInWithEmail(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
            lastSignInAt: user.lastSignInAt
          }
        }
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        error: error.message
      });
    }
  }

  /**
   * Handle Google authentication (client sends ID token)
   */
  async googleAuth(req: Request, res: Response): Promise<void> {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        res.status(400).json({
          success: false,
          message: 'Google ID token is required'
        });
        return;
      }

      // Verify the Google ID token
      const decodedToken = await authService.verifyIdToken(idToken);
      
      // Check if user exists
      let user = await authService.getUserByUid(decodedToken.uid);
      
      if (!user) {
        // User doesn't exist, create them
        // Note: For Google auth, the user is already created in Firebase Auth
        // We just need to sync with our Firestore
        user = await authService.getUserByUid(decodedToken.uid);
        
        if (!user) {
          res.status(500).json({
            success: false,
            message: 'Failed to create user account'
          });
          return;
        }
      }

      // Create custom token for client
      const customToken = await authService.createCustomToken(decodedToken.uid);

      res.json({
        success: true,
        message: 'Google authentication successful',
        data: {
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
            lastSignInAt: user.lastSignInAt
          },
          customToken
        }
      });
    } catch (error: any) {
      console.error('Google auth error:', error);
      res.status(500).json({
        success: false,
        message: 'Google authentication failed',
        error: error.message
      });
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const uid = req.uid!;
      const user = await authService.getUserByUid(uid);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        data: { user }
      });
    } catch (error: any) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user profile',
        error: error.message
      });
    }
  }

  /**
   * Update current user profile
   */
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const uid = req.uid!;
      const updateData: UpdateUserData = req.body;

      // Validation
      if (updateData.displayName !== undefined && typeof updateData.displayName !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Display name must be a string'
        });
        return;
      }

      if (updateData.photoURL !== undefined && typeof updateData.photoURL !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Photo URL must be a string'
        });
        return;
      }

      const updatedUser = await authService.updateUser(uid, updateData);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: updatedUser }
      });
    } catch (error: any) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: error.message
      });
    }
  }

  /**
   * Get user by UID (admin or own profile)
   */
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { uid } = req.params;
      const currentUid = req.uid!;

      // Users can only access their own profile unless they have admin claims
      if (uid !== currentUid && !req.user?.admin) {
        res.status(403).json({
          success: false,
          message: 'Access denied'
        });
        return;
      }

      const user = await authService.getUserByUid(uid);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        data: { user }
      });
    } catch (error: any) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user',
        error: error.message
      });
    }
  }

  /**
   * Delete user account
   */
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { uid } = req.params;
      
      await authService.deleteUser(uid);

      res.json({
        success: true,
        message: 'User account deleted successfully'
      });
    } catch (error: any) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete user account',
        error: error.message
      });
    }
  }

  /**
   * Verify Firebase ID token
   */
  async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        res.status(400).json({
          success: false,
          message: 'ID token is required'
        });
        return;
      }

      const decodedToken = await authService.verifyIdToken(idToken);

      res.json({
        success: true,
        message: 'Token is valid',
        data: {
          uid: decodedToken.uid,
          email: decodedToken.email,
          emailVerified: decodedToken.email_verified,
          customClaims: decodedToken
        }
      });
    } catch (error: any) {
      console.error('Token verification error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid token',
        error: error.message
      });
    }
  }

  /**
   * Revoke all refresh tokens for current user
   */
  async revokeTokens(req: Request, res: Response): Promise<void> {
    try {
      const uid = req.uid!;
      
      await authService.revokeRefreshTokens(uid);

      res.json({
        success: true,
        message: 'All refresh tokens revoked successfully'
      });
    } catch (error: any) {
      console.error('Revoke tokens error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to revoke tokens',
        error: error.message
      });
    }
  }

  /**
   * List all users (admin only)
   */
  async listUsers(req: Request, res: Response): Promise<void> {
    try {
      // Check if user has admin claim
      if (!req.user?.admin) {
        res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
        return;
      }

      const { maxResults = 100, nextPageToken } = req.query;
      const result = await authService.listUsers(
        parseInt(maxResults as string),
        nextPageToken as string
      );

      res.json({
        success: true,
        data: {
          users: result.users,
          nextPageToken: result.nextPageToken,
          total: result.users.length
        }
      });
    } catch (error: any) {
      console.error('List users error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to list users',
        error: error.message
      });
    }
  }
}

export const authController = new AuthController();
export default authController;
