// YYC³ · message-storage 内存桩（测试专用：jsdom 无 IndexedDB）
// 保持与 MessageStorageService 相同的公开 API 面
export interface StoredMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export class MessageStorageStub {
  private static instance: MessageStorageStub | undefined;
  private store: StoredMessage[] = [];

  static getInstance(): MessageStorageStub {
    if (!MessageStorageStub.instance) {
      MessageStorageStub.instance = new MessageStorageStub();
    }
    return MessageStorageStub.instance;
  }

  async initialize(): Promise<void> {}

  async addMessage(message: StoredMessage): Promise<void> {
    this.store.push(message);
  }

  async addMessages(messages: StoredMessage[]): Promise<void> {
    this.store.push(...messages);
  }

  async updateMessage(messageId: string, updates: Partial<StoredMessage>): Promise<void> {
    const msg = this.store.find((m) => m.id === messageId);
    if (msg) Object.assign(msg, updates);
  }

  async deleteMessage(messageId: string): Promise<void> {
    this.store = this.store.filter((m) => m.id !== messageId);
  }

  async clearMessages(): Promise<void> {
    this.store = [];
  }

  async getMessage(messageId: string): Promise<StoredMessage | null> {
    return this.store.find((m) => m.id === messageId) ?? null;
  }

  async getMessages(options: {
    offset?: number;
    limit?: number;
    role?: StoredMessage['role'];
    startTime?: number;
    endTime?: number;
  }): Promise<{ messages: StoredMessage[]; total: number; hasMore: boolean }> {
    let list = [...this.store].sort((a, b) => b.timestamp - a.timestamp);
    if (options.role) list = list.filter((m) => m.role === options.role);
    if (options.startTime) list = list.filter((m) => m.timestamp >= options.startTime!);
    if (options.endTime) list = list.filter((m) => m.timestamp <= options.endTime!);
    const total = list.length;
    const offset = options.offset ?? 0;
    const limit = options.limit ?? 50;
    const messages = list.slice(offset, offset + limit);
    return { messages, total, hasMore: offset + limit < total };
  }

  async searchMessages(keyword: string, limit = 50): Promise<StoredMessage[]> {
    return this.store.filter((m) => m.content.includes(keyword)).slice(0, limit);
  }

  async getMessagesByTimeRange(
    startTime: number,
    endTime: number,
    limit = 100
  ): Promise<StoredMessage[]> {
    return this.store.filter((m) => m.timestamp >= startTime && m.timestamp <= endTime).slice(0, limit);
  }

  async getMessageCount(): Promise<number> {
    return this.store.length;
  }

  async getLastSyncTime(): Promise<number> {
    return 0;
  }

  async updateLastSyncTime(_timestamp: number): Promise<void> {}

  async exportMessages(): Promise<string> {
    return JSON.stringify(this.store);
  }

  async importMessages(_json: string): Promise<number> {
    return 0;
  }
}
