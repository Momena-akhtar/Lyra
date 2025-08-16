import { auth, db } from '../config/firebase';
import { UserRecord, DecodedIdToken } from 'firebase-admin/auth';
import { DocumentData, DocumentReference } from 'firebase-admin/firestore';

export interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt: Date;
  lastSignInAt: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
  displayName?: string;
}

export interface UpdateUserData {
  displayName?: string;
  photoURL?: string;
}

export class AuthService {
  /**
   * Create a new user with email and password
   */
  async createUser(userData: CreateUserData): Promise<AuthUser> {
    try {
      const userRecord = await auth.createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName,
        emailVerified: false
      });

      // Create user document in Firestore
      await this.createUserDocument(userRecord);

      return this.formatUserRecord(userRecord);
    } catch (error: any) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  /**
   * Sign in user with email and password
   */
  async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    try {
      // Get user by email first
      const user = await this.getUserByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify password with Firebase Auth
      const userRecord = await auth.getUserByEmail(email);
      
      // Note: Firebase Admin SDK doesn't support password verification
      // In a real implementation, you'd need to implement password hashing/verification
      // For now, we'll return the user if they exist
      // TODO: Implement proper password verification
      
      return this.formatUserRecord(userRecord);
    } catch (error: any) {
      throw new Error(`Failed to sign in: ${error.message}`);
    }
  }

  /**
   * Get user by UID
   */
  async getUserByUid(uid: string): Promise<AuthUser | null> {
    try {
      const userRecord = await auth.getUser(uid);
      return this.formatUserRecord(userRecord);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        return null;
      }
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<AuthUser | null> {
    try {
      const userRecord = await auth.getUserByEmail(email);
      return this.formatUserRecord(userRecord);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        return null;
      }
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  /**
   * Update user profile
   */
  async updateUser(uid: string, userData: UpdateUserData): Promise<AuthUser> {
    try {
      const updateData: any = {};
      if (userData.displayName !== undefined) updateData.displayName = userData.displayName;
      if (userData.photoURL !== undefined) updateData.photoURL = userData.photoURL;

      const userRecord = await auth.updateUser(uid, updateData);

      // Update user document in Firestore
      await this.updateUserDocument(uid, userData);

      return this.formatUserRecord(userRecord);
    } catch (error: any) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  /**
   * Delete user
   */
  async deleteUser(uid: string): Promise<void> {
    try {
      await auth.deleteUser(uid);
      
      // Delete user document from Firestore
      await this.deleteUserDocument(uid);
    } catch (error: any) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  /**
   * Verify Firebase ID token
   */
  async verifyIdToken(idToken: string): Promise<DecodedIdToken> {
    try {
      return await auth.verifyIdToken(idToken);
    } catch (error: any) {
      throw new Error(`Invalid ID token: ${error.message}`);
    }
  }

  /**
   * Create custom token for client
   */
  async createCustomToken(uid: string, additionalClaims?: object): Promise<string> {
    try {
      return await auth.createCustomToken(uid, additionalClaims);
    } catch (error: any) {
      throw new Error(`Failed to create custom token: ${error.message}`);
    }
  }

  /**
   * Revoke refresh tokens for user
   */
  async revokeRefreshTokens(uid: string): Promise<void> {
    try {
      await auth.revokeRefreshTokens(uid);
    } catch (error: any) {
      throw new Error(`Failed to revoke refresh tokens: ${error.message}`);
    }
  }

  /**
   * List users (with pagination)
   */
  async listUsers(maxResults: number = 1000, nextPageToken?: string): Promise<{ users: AuthUser[], nextPageToken?: string }> {
    try {
      const listUsersResult = await auth.listUsers(maxResults, nextPageToken);
      
      const users = listUsersResult.users.map(user => this.formatUserRecord(user));
      
      return {
        users,
        nextPageToken: listUsersResult.pageToken
      };
    } catch (error: any) {
      throw new Error(`Failed to list users: ${error.message}`);
    }
  }

  /**
   * Create user document in Firestore
   */
  private async createUserDocument(userRecord: UserRecord): Promise<void> {
    try {
      const userData = {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName || null,
        photoURL: userRecord.photoURL || null,
        emailVerified: userRecord.emailVerified,
        createdAt: new Date(userRecord.metadata.creationTime),
        lastSignInAt: new Date(userRecord.metadata.lastSignInTime),
        updatedAt: new Date()
      };

      await db.collection('users').doc(userRecord.uid).set(userData);
    } catch (error: any) {
      console.error('Failed to create user document:', error);
      // Don't throw here as the user was created successfully in Auth
    }
  }

  /**
   * Update user document in Firestore
   */
  private async updateUserDocument(uid: string, userData: UpdateUserData): Promise<void> {
    try {
      const updateData: any = {
        updatedAt: new Date()
      };
      
      if (userData.displayName !== undefined) updateData.displayName = userData.displayName;
      if (userData.photoURL !== undefined) updateData.photoURL = userData.photoURL;

      await db.collection('users').doc(uid).update(updateData);
    } catch (error: any) {
      console.error('Failed to update user document:', error);
      // Don't throw here as the user was updated successfully in Auth
    }
  }

  /**
   * Delete user document from Firestore
   */
  private async deleteUserDocument(uid: string): Promise<void> {
    try {
      await db.collection('users').doc(uid).delete();
    } catch (error: any) {
      console.error('Failed to delete user document:', error);
      // Don't throw here as the user was deleted successfully in Auth
    }
  }

  /**
   * Format UserRecord to AuthUser interface
   */
  private formatUserRecord(userRecord: UserRecord): AuthUser {
    return {
      uid: userRecord.uid,
      email: userRecord.email!,
      displayName: userRecord.displayName || undefined,
      photoURL: userRecord.photoURL || undefined,
      emailVerified: userRecord.emailVerified,
      createdAt: new Date(userRecord.metadata.creationTime),
      lastSignInAt: new Date(userRecord.metadata.lastSignInTime)
    };
  }
}

export const authService = new AuthService();
export default authService;
