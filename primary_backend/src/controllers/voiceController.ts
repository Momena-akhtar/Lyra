import { Request, Response } from 'express';
import { voiceService, ProcessVoiceRequest } from '../services/voiceService';

export class VoiceController {
  /**
   * Process voice input and convert to text using STT
   */
  async processVoiceInput(req: Request, res: Response): Promise<void> {
    try {
      const uid = req.uid!;
      const { audioData, audioFormat, language, sessionId, duration }: ProcessVoiceRequest = req.body;

      // Validation
      if (!audioData || !audioFormat) {
        res.status(400).json({
          success: false,
          message: 'Audio data and format are required'
        });
        return;
      }

      if (!audioData.startsWith('data:audio/') && !audioData.match(/^[A-Za-z0-9+/]*={0,2}$/)) {
        res.status(400).json({
          success: false,
          message: 'Invalid audio data format. Expected base64 encoded audio or data URL'
        });
        return;
      }

      // Process voice input
      const result = await voiceService.processVoiceInput(uid, {
        audioData,
        audioFormat,
        language,
        sessionId,
        duration
      });

      res.status(200).json({
        success: true,
        message: 'Voice input processed successfully',
        data: {
          transcription: result,
          sessionId: sessionId
        }
      });
    } catch (error: any) {
      console.error('Process voice input error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process voice input',
        error: error.message
      });
    }
  }

  /**
   * Start a new voice session
   */
  async startVoiceSession(req: Request, res: Response): Promise<void> {
    try {
      const uid = req.uid!;
      
      const session = await voiceService.startVoiceSession(uid);

      res.status(201).json({
        success: true,
        message: 'Voice session started successfully',
        data: { session }
      });
    } catch (error: any) {
      console.error('Start voice session error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start voice session',
        error: error.message
      });
    }
  }

  /**
   * End a voice session
   */
  async endVoiceSession(req: Request, res: Response): Promise<void> {
    try {
      const uid = req.uid!;
      const { sessionId } = req.params;

      if (!sessionId) {
        res.status(400).json({
          success: false,
          message: 'Session ID is required'
        });
        return;
      }

      const session = await voiceService.endVoiceSession(sessionId, uid);

      res.status(200).json({
        success: true,
        message: 'Voice session ended successfully',
        data: { session }
      });
    } catch (error: any) {
      console.error('End voice session error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to end voice session',
        error: error.message
      });
    }
  }

  /**
   * Get voice session by ID
   */
  async getVoiceSession(req: Request, res: Response): Promise<void> {
    try {
      const uid = req.uid!;
      const { sessionId } = req.params;

      if (!sessionId) {
        res.status(400).json({
          success: false,
          message: 'Session ID is required'
        });
        return;
      }

      const session = await voiceService.getVoiceSession(sessionId, uid);

      if (!session) {
        res.status(404).json({
          success: false,
          message: 'Voice session not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { session }
      });
    } catch (error: any) {
      console.error('Get voice session error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get voice session',
        error: error.message
      });
    }
  }

  /**
   * Get user's voice sessions
   */
  async getUserVoiceSessions(req: Request, res: Response): Promise<void> {
    try {
      const uid = req.uid!;
      const { limit = 20 } = req.query;

      const sessions = await voiceService.getUserVoiceSessions(uid, parseInt(limit as string));

      res.status(200).json({
        success: true,
        data: { 
          sessions,
          total: sessions.length,
          limit: parseInt(limit as string)
        }
      });
    } catch (error: any) {
      console.error('Get user voice sessions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get voice sessions',
        error: error.message
      });
    }
  }
}

export const voiceController = new VoiceController();
export default voiceController;
