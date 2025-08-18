import { db } from '../config/firebase';
import { DocumentData } from 'firebase-admin/firestore';

export interface VoiceInput {
  uid: string;
  audioData: string; // Base64 encoded audio data
  audioFormat: 'wav' | 'mp3' | 'm4a' | 'webm';
  timestamp: Date;
  duration?: number; // Duration in seconds
  language?: string; // Language code (e.g., 'en', 'es', 'fr')
}

export interface TranscriptionResult {
  text: string;
  confidence: number;
  language: string;
  duration: number;
  timestamp: Date;
}

export interface VoiceSession {
  sessionId: string;
  uid: string;
  startTime: Date;
  endTime?: Date;
  transcriptions: TranscriptionResult[];
  totalDuration: number;
  status: 'active' | 'completed' | 'cancelled';
}

export interface ProcessVoiceRequest {
  audioData: string;
  audioFormat: 'wav' | 'mp3' | 'm4a' | 'webm';
  language?: string;
  sessionId?: string;
  duration?: number;
}

export class VoiceService {
  private openaiApiKey: string;
  private openaiBaseUrl: string;

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
    this.openaiBaseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    
    if (!this.openaiApiKey) {
      console.warn('OpenAI API key not found. Voice transcription will not work.');
    }
  }

  /**
   * Process voice input and convert to text using OpenAI Whisper
   */
  async processVoiceInput(uid: string, request: ProcessVoiceRequest): Promise<TranscriptionResult> {
    try {
      if (!this.openaiApiKey) {
        throw new Error('OpenAI API key not configured');
      }

      // Validate audio format
      if (!this.isValidAudioFormat(request.audioFormat)) {
        throw new Error(`Unsupported audio format: ${request.audioFormat}`);
      }

      // Convert base64 to buffer
      const audioBuffer = Buffer.from(request.audioData, 'base64');

      // Call OpenAI Whisper API
      const transcription = await this.callWhisperAPI(audioBuffer, request.audioFormat, request.language);

      // Create transcription result
      const result: TranscriptionResult = {
        text: transcription.text,
        confidence: transcription.confidence || 0.8,
        language: transcription.language || request.language || 'en',
        duration: request.duration || 0,
        timestamp: new Date()
      };

      // Save transcription to database
      await this.saveTranscription(uid, result, request.sessionId);

      return result;
    } catch (error: any) {
      throw new Error(`Failed to process voice input: ${error.message}`);
    }
  }

  /**
   * Call OpenAI Whisper API for transcription
   */
  private async callWhisperAPI(
    audioBuffer: Buffer, 
    format: string, 
    language?: string
  ): Promise<{ text: string; confidence?: number; language?: string }> {
    try {
      const formData = new FormData();
      formData.append('file', new Blob([audioBuffer]), `audio.${format}`);
      formData.append('model', 'whisper-1');
      
      if (language) {
        formData.append('language', language);
      }

      const response = await fetch(`${this.openaiBaseUrl}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json() as any;
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json() as any;
      
      return {
        text: data.text,
        language: data.language,
        confidence: 0.9 // Whisper doesn't provide confidence scores
      };
    } catch (error: any) {
      throw new Error(`Whisper API call failed: ${error.message}`);
    }
  }

  /**
   * Start a new voice session
   */
  async startVoiceSession(uid: string): Promise<VoiceSession> {
    try {
      const sessionId = this.generateSessionId();
      const session: VoiceSession = {
        sessionId,
        uid,
        startTime: new Date(),
        transcriptions: [],
        totalDuration: 0,
        status: 'active'
      };

      // Save session to database
      await db.collection('voice_sessions').doc(sessionId).set(session as any);

      return session;
    } catch (error: any) {
      throw new Error(`Failed to start voice session: ${error.message}`);
    }
  }

  /**
   * End a voice session
   */
  async endVoiceSession(sessionId: string, uid: string): Promise<VoiceSession> {
    try {
      const sessionRef = db.collection('voice_sessions').doc(sessionId);
      const sessionDoc = await sessionRef.get();

      if (!sessionDoc.exists) {
        throw new Error('Voice session not found');
      }

      const session = sessionDoc.data() as VoiceSession;
      
      if (session.uid !== uid) {
        throw new Error('Access denied to voice session');
      }

      const updatedSession: VoiceSession = {
        ...session,
        endTime: new Date(),
        status: 'completed'
      };

      await sessionRef.update(updatedSession as any);

      return updatedSession;
    } catch (error: any) {
      throw new Error(`Failed to end voice session: ${error.message}`);
    }
  }

  /**
   * Get voice session by ID
   */
  async getVoiceSession(sessionId: string, uid: string): Promise<VoiceSession | null> {
    try {
      const sessionDoc = await db.collection('voice_sessions').doc(sessionId).get();
      
      if (!sessionDoc.exists) {
        return null;
      }

      const session = sessionDoc.data() as VoiceSession;
      
      if (session.uid !== uid) {
        throw new Error('Access denied to voice session');
      }

      return session;
    } catch (error: any) {
      throw new Error(`Failed to get voice session: ${error.message}`);
    }
  }

  /**
   * Get user's voice sessions
   */
  async getUserVoiceSessions(uid: string, limit: number = 20): Promise<VoiceSession[]> {
    try {
      const sessionsSnapshot = await db
        .collection('voice_sessions')
        .where('uid', '==', uid)
        .orderBy('startTime', 'desc')
        .limit(limit)
        .get();

      return sessionsSnapshot.docs.map(doc => doc.data() as VoiceSession);
    } catch (error: any) {
      throw new Error(`Failed to get user voice sessions: ${error.message}`);
    }
  }

  /**
   * Save transcription to database
   */
  private async saveTranscription(
    uid: string, 
    transcription: TranscriptionResult, 
    sessionId?: string
  ): Promise<void> {
    try {
      const transcriptionData = {
        uid,
        sessionId,
        text: transcription.text,
        confidence: transcription.confidence,
        language: transcription.language,
        duration: transcription.duration,
        timestamp: transcription.timestamp
      };

      await db.collection('transcriptions').add(transcriptionData);

      // Update session if sessionId is provided
      if (sessionId) {
        const { FieldValue } = require('firebase-admin/firestore');
        await db.collection('voice_sessions').doc(sessionId).update({
          transcriptions: FieldValue.arrayUnion(transcription),
          totalDuration: FieldValue.increment(transcription.duration)
        });
      }
    } catch (error: any) {
      console.error('Failed to save transcription:', error);
      // Don't throw here as the transcription was successful
    }
  }

  /**
   * Validate audio format
   */
  private isValidAudioFormat(format: string): boolean {
    const validFormats = ['wav', 'mp3', 'm4a', 'webm'];
    return validFormats.includes(format.toLowerCase());
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const voiceService = new VoiceService();
export default voiceService;
