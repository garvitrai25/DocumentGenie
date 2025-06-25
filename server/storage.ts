import {
  users,
  documents,
  documentChunks,
  chatSessions,
  chatMessages,
  type User,
  type InsertUser,
  type Document,
  type InsertDocument,
  type DocumentChunk,
  type InsertDocumentChunk,
  type ChatSession,
  type InsertChatSession,
  type ChatMessage,
  type InsertChatMessage,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Document operations
  createDocument(document: InsertDocument): Promise<Document>;
  getDocumentsByUserId(userId: number): Promise<Document[]>;
  getDocumentById(id: number): Promise<Document | undefined>;
  updateDocumentStatus(id: number, status: string, extractedText?: string): Promise<void>;
  deleteDocument(id: number): Promise<void>;

  // Document chunk operations
  createDocumentChunks(chunks: InsertDocumentChunk[]): Promise<DocumentChunk[]>;
  getDocumentChunks(documentId: number): Promise<DocumentChunk[]>;

  // Chat operations
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSessionsByUserId(userId: number): Promise<ChatSession[]>;
  getChatSession(id: number): Promise<ChatSession | undefined>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(sessionId: number): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private documents: Map<number, Document> = new Map();
  private documentChunks: Map<number, DocumentChunk> = new Map();
  private chatSessions: Map<number, ChatSession> = new Map();
  private chatMessages: Map<number, ChatMessage> = new Map();
  
  private userIdCounter = 1;
  private documentIdCounter = 1;
  private chunkIdCounter = 1;
  private sessionIdCounter = 1;
  private messageIdCounter = 1;

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.firebaseUid === firebaseUid);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.userIdCounter++,
      displayName: insertUser.displayName || null,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const document: Document = {
      ...insertDocument,
      id: this.documentIdCounter++,
      extractedText: insertDocument.extractedText || null,
      processingStatus: insertDocument.processingStatus || "pending",
      uploadedAt: new Date(),
    };
    this.documents.set(document.id, document);
    return document;
  }

  async getDocumentsByUserId(userId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(doc => doc.userId === userId);
  }

  async getDocumentById(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async updateDocumentStatus(id: number, status: string, extractedText?: string): Promise<void> {
    const document = this.documents.get(id);
    if (document) {
      const updated = { ...document, processingStatus: status };
      if (extractedText) {
        updated.extractedText = extractedText;
      }
      this.documents.set(id, updated);
    }
  }

  async deleteDocument(id: number): Promise<void> {
    this.documents.delete(id);
    // Clean up related chunks
    const chunks = Array.from(this.documentChunks.values()).filter(chunk => chunk.documentId === id);
    chunks.forEach(chunk => this.documentChunks.delete(chunk.id));
  }

  async createDocumentChunks(insertChunks: InsertDocumentChunk[]): Promise<DocumentChunk[]> {
    const chunks: DocumentChunk[] = insertChunks.map(chunk => ({
      ...chunk,
      id: this.chunkIdCounter++,
    }));
    chunks.forEach(chunk => this.documentChunks.set(chunk.id, chunk));
    return chunks;
  }

  async getDocumentChunks(documentId: number): Promise<DocumentChunk[]> {
    return Array.from(this.documentChunks.values()).filter(chunk => chunk.documentId === documentId);
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const session: ChatSession = {
      ...insertSession,
      id: this.sessionIdCounter++,
      createdAt: new Date(),
    };
    this.chatSessions.set(session.id, session);
    return session;
  }

  async getChatSessionsByUserId(userId: number): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values()).filter(session => session.userId === userId);
  }

  async getChatSession(id: number): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const message: ChatMessage = {
      ...insertMessage,
      id: this.messageIdCounter++,
      timestamp: new Date(),
    };
    this.chatMessages.set(message.id, message);
    return message;
  }

  async getChatMessages(sessionId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.sessionId === sessionId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}

export const storage = new MemStorage();
