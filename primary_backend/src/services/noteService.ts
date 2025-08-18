import { db } from '../config/firebase';
import { Note, CreateNoteData, UpdateNoteData, NoteSearchFilters } from '../models';

export class NoteService {
  async createNote(userId: string, data: CreateNoteData): Promise<Note> {
    try {
      const noteId = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const note: Note = {
        id: noteId,
        userId,
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastModifiedAt: new Date(),
        deletedAt: undefined,
        isDeleted: false,
        title: data.title,
        content: {
          text: data.content.text || '',
          html: data.content.html,
          markdown: data.content.markdown,
          sections: data.content.sections || [],
          images: data.content.images || [],
          codeBlocks: data.content.codeBlocks || [],
          tables: data.content.tables || [],
          lists: data.content.lists || []
        },
        metadata: {
          category: data.category || 'general',
          subcategory: data.metadata?.subcategory,
          tags: data.tags || [],
          keywords: [],
          type: data.type || 'personal',
          status: 'draft',
          priority: 'medium',
          relatedNotes: [],
          linkedGoals: data.linkedGoals || [],
          linkedTasks: data.linkedTasks || [],
          externalLinks: [],
          context: {
            project: data.metadata?.context?.project,
            client: data.metadata?.context?.client,
            meeting: data.metadata?.context?.meeting,
            location: data.metadata?.context?.location,
            mood: data.metadata?.context?.mood || 'focused',
            energy: data.metadata?.context?.energy || 'medium'
          }
        },
        ai: {
          summary: '',
          keyPoints: [],
          sentiment: 'neutral',
          topics: [],
          entities: [],
          suggestedTags: [],
          relatedTopics: [],
          improvementSuggestions: [],
          followUpActions: [],
          generatedContent: {},
          userPreferences: {
            writingStyle: 'casual',
            preferredTopics: [],
            commonPatterns: []
          }
        },
        collaboration: {
          isPublic: data.isPublic || false,
          sharedWith: data.sharedWith || [],
          permissions: {
            view: true,
            edit: true,
            comment: true,
            share: true
          },
          collaborators: [],
          comments: [],
          versions: [],
          activity: []
        },
        formatting: {
          theme: 'default',
          font: 'Arial',
          fontSize: 14,
          lineHeight: 1.5,
          colorScheme: {
            primary: '#007acc',
            secondary: '#6c757d',
            accent: '#28a745',
            background: '#ffffff'
          }
        },
        attachments: [],
        reminders: [],
        analytics: {
          viewCount: 0,
          editCount: 0,
          shareCount: 0,
          commentCount: 0,
          lastViewed: new Date(),
          averageViewTime: 0,
          engagementScore: 0
        },
        externalId: undefined,
        source: 'manual',
        searchable: true,
        featured: false,
        seo: {
          title: data.title,
          description: data.content.text?.substring(0, 160) || '',
          keywords: data.tags || []
        }
      };

      await db.collection('notes').doc(noteId).set(note as any);
      return note;
    } catch (error: any) {
      throw new Error(`Failed to create note: ${error.message}`);
    }
  }

  async getNotes(userId: string, filters?: NoteSearchFilters): Promise<Note[]> {
    try {
      let query = db.collection('notes').where('userId', '==', userId).where('isDeleted', '==', false);

      if (filters?.category) {
        query = query.where('metadata.category', '==', filters.category);
      }
      if (filters?.type) {
        query = query.where('metadata.type', '==', filters.type);
      }
      if (filters?.status) {
        query = query.where('metadata.status', '==', filters.status);
      }
      if (filters?.priority) {
        query = query.where('metadata.priority', '==', filters.priority);
      }

      const snapshot = await query.orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => doc.data() as Note);
    } catch (error: any) {
      throw new Error(`Failed to get notes: ${error.message}`);
    }
  }

  async getNoteById(noteId: string, userId: string): Promise<Note | null> {
    try {
      const noteDoc = await db.collection('notes').doc(noteId).get();
      
      if (!noteDoc.exists) {
        return null;
      }

      const note = noteDoc.data() as Note;
      if (note.userId !== userId) {
        throw new Error('Access denied to note');
      }

      if (note.isDeleted) {
        return null;
      }

      return note;
    } catch (error: any) {
      throw new Error(`Failed to get note: ${error.message}`);
    }
  }

  async updateNote(noteId: string, userId: string, data: UpdateNoteData): Promise<Note> {
    try {
      const noteRef = db.collection('notes').doc(noteId);
      const noteDoc = await noteRef.get();

      if (!noteDoc.exists) {
        throw new Error('Note not found');
      }

      const note = noteDoc.data() as Note;
      if (note.userId !== userId) {
        throw new Error('Access denied');
      }

      if (note.isDeleted) {
        throw new Error('Cannot update deleted note');
      }

      const updateData: any = {
        ...data,
        updatedAt: new Date(),
        lastModifiedAt: new Date()
      };

      await noteRef.update(updateData);
      
      const updatedDoc = await noteRef.get();
      return updatedDoc.data() as Note;
    } catch (error: any) {
      throw new Error(`Failed to update note: ${error.message}`);
    }
  }

  async deleteNote(noteId: string, userId: string): Promise<void> {
    try {
      const noteRef = db.collection('notes').doc(noteId);
      const noteDoc = await noteRef.get();

      if (!noteDoc.exists) {
        throw new Error('Note not found');
      }

      const note = noteDoc.data() as Note;
      if (note.userId !== userId) {
        throw new Error('Access denied');
      }

      // Soft delete
      await noteRef.update({
        isDeleted: true,
        deletedAt: new Date(),
        updatedAt: new Date(),
        lastModifiedAt: new Date()
      });
    } catch (error: any) {
      throw new Error(`Failed to delete note: ${error.message}`);
    }
  }

  async getNotesByCategory(category: string, userId: string): Promise<Note[]> {
    try {
      const snapshot = await db
        .collection('notes')
        .where('userId', '==', userId)
        .where('metadata.category', '==', category)
        .where('isDeleted', '==', false)
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => doc.data() as Note);
    } catch (error: any) {
      throw new Error(`Failed to get notes by category: ${error.message}`);
    }
  }

  async getNotesByType(type: string, userId: string): Promise<Note[]> {
    try {
      const snapshot = await db
        .collection('notes')
        .where('userId', '==', userId)
        .where('metadata.type', '==', type)
        .where('isDeleted', '==', false)
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => doc.data() as Note);
    } catch (error: any) {
      throw new Error(`Failed to get notes by type: ${error.message}`);
    }
  }

  async searchNotes(query: string, userId: string): Promise<Note[]> {
    try {
      // Simple text search - in production you might want to use Algolia or similar
      const notes = await this.getNotes(userId);
      
      const searchTerm = query.toLowerCase();
      return notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.text.toLowerCase().includes(searchTerm) ||
        note.metadata.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    } catch (error: any) {
      throw new Error(`Failed to search notes: ${error.message}`);
    }
  }

  async getNotesByGoal(goalId: string, userId: string): Promise<Note[]> {
    try {
      const notes = await this.getNotes(userId);
      return notes.filter(note => 
        note.metadata.linkedGoals.includes(goalId)
      );
    } catch (error: any) {
      throw new Error(`Failed to get notes by goal: ${error.message}`);
    }
  }

  async getNotesByTask(taskId: string, userId: string): Promise<Note[]> {
    try {
      const notes = await this.getNotes(userId);
      return notes.filter(note => 
        note.metadata.linkedTasks.includes(taskId)
      );
    } catch (error: any) {
      throw new Error(`Failed to get notes by task: ${error.message}`);
    }
  }
}

export const noteService = new NoteService();
export default noteService;

