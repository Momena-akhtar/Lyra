import { Request, Response } from 'express';
import { noteService } from '../services/noteService';
import { CreateNoteData, UpdateNoteData, NoteSearchFilters } from '../models';

export class NoteController {
  async createNote(req: Request, res: Response): Promise<void> {
    try {
      const uid = (req as any).user?.uid;
      if (!uid) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const noteData: CreateNoteData = req.body;
      
      // Validate required fields
      if (!noteData.title || !noteData.content?.text) {
        res.status(400).json({
          success: false,
          message: 'Note title and content are required'
        });
        return;
      }

      const note = await noteService.createNote(uid, noteData);
      
      res.status(201).json({
        success: true,
        message: 'Note created successfully',
        data: note
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to create note',
        error: error.message
      });
    }
  }

  async getNotes(req: Request, res: Response): Promise<void> {
    try {
      const uid = (req as any).user?.uid;
      if (!uid) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const filters: NoteSearchFilters = {
        category: req.query.category as any,
        type: req.query.type as any,
        status: req.query.status as any,
        priority: req.query.priority as any
      };

      const notes = await noteService.getNotes(uid, filters);
      
      res.status(200).json({
        success: true,
        message: 'Notes retrieved successfully',
        data: notes,
        count: notes.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve notes',
        error: error.message
      });
    }
  }

  async getNoteById(req: Request, res: Response): Promise<void> {
    try {
      const uid = (req as any).user?.uid;
      if (!uid) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { noteId } = req.params;
      if (!noteId) {
        res.status(400).json({
          success: false,
          message: 'Note ID is required'
        });
        return;
      }

      const note = await noteService.getNoteById(noteId, uid);
      
      if (!note) {
        res.status(404).json({
          success: false,
          message: 'Note not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Note retrieved successfully',
        data: note
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve note',
        error: error.message
      });
    }
  }

  async updateNote(req: Request, res: Response): Promise<void> {
    try {
      const uid = (req as any).user?.uid;
      if (!uid) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { noteId } = req.params;
      if (!noteId) {
        res.status(400).json({
          success: false,
          message: 'Note ID is required'
        });
        return;
      }

      const updateData: UpdateNoteData = req.body;
      const updatedNote = await noteService.updateNote(noteId, uid, updateData);
      
      res.status(200).json({
        success: true,
        message: 'Note updated successfully',
        data: updatedNote
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update note',
        error: error.message
      });
    }
  }

  async deleteNote(req: Request, res: Response): Promise<void> {
    try {
      const uid = (req as any).user?.uid;
      if (!uid) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { noteId } = req.params;
      if (!noteId) {
        res.status(400).json({
          success: false,
          message: 'Note ID is required'
        });
        return;
      }

      await noteService.deleteNote(noteId, uid);
      
      res.status(200).json({
        success: true,
        message: 'Note deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete note',
        error: error.message
      });
    }
  }

  async getNotesByCategory(req: Request, res: Response): Promise<void> {
    try {
      const uid = (req as any).user?.uid;
      if (!uid) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { category } = req.params;
      if (!category) {
        res.status(400).json({
          success: false,
          message: 'Category is required'
        });
        return;
      }

      const notes = await noteService.getNotesByCategory(category, uid);
      
      res.status(200).json({
        success: true,
        message: 'Notes by category retrieved successfully',
        data: notes,
        count: notes.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve notes by category',
        error: error.message
      });
    }
  }

  async getNotesByType(req: Request, res: Response): Promise<void> {
    try {
      const uid = (req as any).user?.uid;
      if (!uid) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { type } = req.params;
      if (!type) {
        res.status(400).json({
          success: false,
          message: 'Type is required'
        });
        return;
      }

      const notes = await noteService.getNotesByType(type, uid);
      
      res.status(200).json({
        success: true,
        message: 'Notes by type retrieved successfully',
        data: notes,
        count: notes.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve notes by type',
        error: error.message
      });
    }
  }

  async searchNotes(req: Request, res: Response): Promise<void> {
    try {
      const uid = (req as any).user?.uid;
      if (!uid) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
        return;
      }

      const notes = await noteService.searchNotes(query, uid);
      
      res.status(200).json({
        success: true,
        message: 'Notes search completed successfully',
        data: notes,
        count: notes.length,
        query
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to search notes',
        error: error.message
      });
    }
  }

  async getNotesByGoal(req: Request, res: Response): Promise<void> {
    try {
      const uid = (req as any).user?.uid;
      if (!uid) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { goalId } = req.params;
      if (!goalId) {
        res.status(400).json({
          success: false,
          message: 'Goal ID is required'
        });
        return;
      }

      const notes = await noteService.getNotesByGoal(goalId, uid);
      
      res.status(200).json({
        success: true,
        message: 'Notes by goal retrieved successfully',
        data: notes,
        count: notes.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve notes by goal',
        error: error.message
      });
    }
  }

  async getNotesByTask(req: Request, res: Response): Promise<void> {
    try {
      const uid = (req as any).user?.uid;
      if (!uid) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { taskId } = req.params;
      if (!taskId) {
        res.status(400).json({
          success: false,
          message: 'Task ID is required'
        });
        return;
      }

      const notes = await noteService.getNotesByTask(taskId, uid);
      
      res.status(200).json({
        success: true,
        message: 'Notes by task retrieved successfully',
        data: notes,
        count: notes.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve notes by task',
        error: error.message
      });
    }
  }
}

export const noteController = new NoteController();
export default noteController;
