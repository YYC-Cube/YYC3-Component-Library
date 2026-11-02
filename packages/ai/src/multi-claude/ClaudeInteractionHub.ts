import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { ClaudeSessionManager, ClaudeSession, SessionStatus } from './ClaudeSessionManager.js';
import { ClaudePersonaManager, ClaudePersona } from './ClaudePersonaManager.js';
import { ClaudeCoordinator } from './ClaudeCoordinator.js';

/**
 * Claude交互中心 - 管理用户与多个Claude的交互
 */
export class ClaudeInteractionHub extends EventEmitter {
  private interactionSessions: Map<string, UserInteractionSession> = new Map();
  private activeConversation: string | null = null;
  private messageHistory: InteractionMessage[] = [];
  private sessionManager: ClaudeSessionManager;
  private personaManager: ClaudePersonaManager;
  private coordinator: ClaudeCoordinator;

  constructor(personaManager?: ClaudePersonaManager) {
    super();
    this.sessionManager = new ClaudeSessionManager();
    this.personaManager = personaManager || new ClaudePersonaManager();
    this.coordinator = new ClaudeCoordinator();
    this.setupEventHandlers();
  }

  /**
   * 创建多Claude交互会话
   */
  async createInteractionSession(
    userId: string,
    claudePersonas: string[],
    interactionMode: InteractionMode = InteractionMode.COLLABORATIVE
  ): Promise<UserInteractionSession> {
    const sessionId = uuidv4();
    const personas = claudePersonas.map(personaId =>
      this.personaManager.getPersona(personaId)
    ).filter(Boolean) as ClaudePersona[];

    if (personas.length === 0) {
      throw new Error('无效的Claude拟人化身份');
    }

    const session: UserInteractionSession = {
      id: sessionId,
      userId,
      personas,
      mode: interactionMode,
      status: SessionStatus.ACTIVE,
      createdAt: new Date(),
      lastActivity: new Date(),
      currentTopic: null,
      conversationHistory: [],
      claudeSessions: new Map(),
      sharedContext: new Map(),
      participantRoles: this.assignParticipantRoles(personas)
    };

    this.interactionSessions.set(sessionId, session);
    this.activeConversation = sessionId;

    // 为每个Claude创建会话
    for (const persona of personas) {
      const claudeSession = this.sessionManager.createSession(
        persona.nickname,
        this.mapPersonaRole(persona.role),
        persona.personality.expertise
      );

      session.claudeSessions.set(persona.id, claudeSession.id);
    }

    console.log(`🤝 创建多Claude交互会话: ${sessionId}`);
    console.log(`👥 参与Claude: ${personas.map(p => p.nickname).join(', ')}`);

    this.emit('sessionCreated', session);
    return session;
  }

  /**
   * 发送消息给Claude团队
   */
  async sendMessage(
    userId: string,
    content: string,
    messageOptions: MessageOptions = {}
  ): Promise<ClaudeResponse[]> {
    const session = this.getActiveSession(userId);
    if (!session) {
      throw new Error('没有活跃的交互会话');
    }

    const userMessage: InteractionMessage = {
      id: uuidv4(),
      type: MessageType.USER,
      sender: userId,
      content,
      timestamp: new Date(),
      metadata: messageOptions
    };

    session.conversationHistory.push(userMessage);
    session.lastActivity = new Date();
    this.messageHistory.push(userMessage);

    // 根据交互模式处理消息
    const responses = await this.processMessage(session, userMessage);

    // 记录Claude回复
    for (const response of responses) {
      const claudeMessage: InteractionMessage = {
        id: uuidv4(),
        type: MessageType.CLAUDE,
        sender: response.claudeId,
        content: response.content,
        timestamp: new Date(),
        metadata: {
          persona: response.persona,
          confidence: response.confidence,
          processingTime: response.processingTime
        }
      };

      session.conversationHistory.push(claudeMessage);
      this.messageHistory.push(claudeMessage);
    }

    this.emit('messageProcessed', { userMessage, responses });
    return responses;
  }

  /**
   * 处理消息的核心逻辑
   */
  private async processMessage(
    session: UserInteractionSession,
    message: InteractionMessage
  ): Promise<ClaudeResponse[]> {
    switch (session.mode) {
      case InteractionMode.COLLABORATIVE:
        return this.processCollaborativeMessage(session, message);
      case InteractionMode.COMPETITIVE:
        return this.processCompetitiveMessage(session, message);
      case InteractionMode.SEQUENTIAL:
        return this.processSequentialMessage(session, message);
      case InteractionMode.SPECIALIST:
        return this.processSpecialistMessage(session, message);
      default:
        return this.processCollaborativeMessage(session, message);
    }
  }

  /**
   * 协作模式 - 多Claude协同讨论
   */
  private async processCollaborativeMessage(
    session: UserInteractionSession,
    message: InteractionMessage
  ): Promise<ClaudeResponse[]> {
    const responses: ClaudeResponse[] = [];
    const personas = Array.from(session.participantRoles.keys());

    // 并行获取所有Claude的初步意见
    const initialResponses = await Promise.all(
      personas.map(persona =>
        this.getClaudeResponse(persona, message.content, {
          context: Array.from(session.sharedContext.entries()),
          previousMessages: session.conversationHistory.slice(-5),
          role: session.participantRoles.get(persona)
        })
      )
    );

    responses.push(...initialResponses);

    // 如果有不同意见，进行协作讨论
    if (this.hasDisagreements(initialResponses)) {
      const discussionResponses = await this.facilitateDiscussion(
        session,
        message,
        initialResponses
      );
      responses.push(...discussionResponses);
    }

    // 生成综合回复
    const summary = await this.generateCollaborativeSummary(session, initialResponses);
    if (summary) {
      responses.push(summary);
    }

    return responses;
  }

  /**
   * 竞争模式 - 多Claude竞争最佳答案
   */
  private async processCompetitiveMessage(
    session: UserInteractionSession,
    message: InteractionMessage
  ): Promise<ClaudeResponse[]> {
    const personas = Array.from(session.participantRoles.keys());

    // 所有Claude提供解决方案
    const solutions = await Promise.all(
      personas.map(persona =>
        this.getClaudeResponse(persona, message.content, {
          context: Array.from(session.sharedContext.entries()),
          competitive: true,
          previousMessages: session.conversationHistory.slice(-3)
        })
      )
    );

    // 评估和排序解决方案
    const evaluatedSolutions = await this.evaluateSolutions(solutions, message.content);

    // 返回最佳解决方案
    return evaluatedSolutions.slice(0, 3);
  }

  /**
   * 顺序模式 - 按专业顺序依次处理
   */
  private async processSequentialMessage(
    session: UserInteractionSession,
    message: InteractionMessage
  ): Promise<ClaudeResponse[]> {
    const responses: ClaudeResponse[] = [];
    const personas = this.getOrderedPersonas(session);

    for (let i = 0; i < personas.length; i++) {
      const persona = personas[i];
      const previousContext = responses.map(r => r.content);

      const response = await this.getClaudeResponse(persona.id, message.content, {
        context: Array.from(session.sharedContext.entries()),
        previousResponses: previousContext,
        position: i + 1,
        totalParticipants: personas.length
      });

      responses.push(response);

      // 更新共享上下文
      session.sharedContext.set(`${persona.id}_response`, response.content);
    }

    return responses;
  }

  /**
   * 专家模式 - 根据问题类型选择最合适的Claude
   */
  private async processSpecialistMessage(
    session: UserInteractionSession,
    message: InteractionMessage
  ): Promise<ClaudeResponse[]> {
    // 分析问题类型
    const questionType = this.analyzeQuestionType(message.content);
    const bestPersona = this.selectBestPersona(session.personas, questionType);

    const response = await this.getClaudeResponse(bestPersona.id, message.content, {
      context: Array.from(session.sharedContext.entries()),
      specialistMode: true,
      previousMessages: session.conversationHistory.slice(-5)
    });

    // 如果需要，可以添加其他Claude的补充意见
    const supplements = await this.getSupplementaryResponses(
      session,
      response,
      bestPersona.id
    );

    return [response, ...supplements];
  }

  /**
   * 获取单个Claude的回复
   */
  private async getClaudeResponse(
    personaId: string,
    content: string,
    options: any = {}
  ): Promise<ClaudeResponse> {
    const persona = this.personaManager.getPersona(personaId);
    if (!persona) {
      throw new Error(`拟人化身份 ${personaId} 不存在`);
    }

    const startTime = Date.now();

    // 模拟Claude思考和回复过程
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));

    const processingTime = Date.now() - startTime;

    // 生成拟人化回复
    const responseContent = this.generatePersonaResponse(persona, content, options);

    return {
      claudeId: personaId,
      persona: persona,
      content: responseContent,
      confidence: 0.85 + Math.random() * 0.14,
      processingTime,
      timestamp: new Date(),
      metadata: options
    };
  }

  /**
   * 生成拟人化回复内容
   */
  private generatePersonaResponse(
    persona: ClaudePersona,
    content: string,
    options: any
  ): string {
    const greetings = this.getGreetingByPersona(persona);
    const responseStyle = this.getResponseStyle(persona);

    let response = greetings;

    // 根据拟人化特征生成回复
    switch (persona.personality.communicationStyle) {
      case '正式但温和':
        response += `\n根据我的分析，${this.generateFormalResponse(content)}`;
        break;
      case '精确、专业':
        response += `\n经过专业分析，${this.generateTechnicalResponse(content)}`;
        break;
      case '活泼、形象':
        response += `\n让我用一个有趣的方式来解释：${this.generateCreativeResponse(content)}`;
        break;
      case '详尽、有条理':
        response += `\n让我详细说明：\n1. ${this.generateDetailedResponse(content)}`;
        break;
      case '数据驱动':
        response += `\n基于数据分析，${this.generateDataDrivenResponse(content)}`;
        break;
      default:
        response += `\n${this.generateDefaultResponse(content)}`;
    }

    response += `\n\n——${persona.nickname}`;

    return response;
  }

  /**
   * 主持Claude之间的讨论
   */
  private async facilitateDiscussion(
    session: UserInteractionSession,
    userMessage: InteractionMessage,
    initialResponses: ClaudeResponse[]
  ): Promise<ClaudeResponse[]> {
    const discussionResponses: ClaudeResponse[] = [];

    // 识别分歧点
    const disagreements = this.identifyDisagreements(initialResponses);

    for (const disagreement of disagreements) {
      // 让相关Claude就分歧点进行讨论
      const participants = disagreement.involvedPersonas;

      for (const participantId of participants) {
        const discussionResponse = await this.getClaudeResponse(
          participantId,
          `关于"${disagreement.topic}"的不同看法，我想补充：`,
          {
            discussionMode: true,
            disagreementPoint: disagreement,
            otherOpinions: disagreement.opinions
          }
        );

        discussionResponses.push(discussionResponse);
      }
    }

    return discussionResponses;
  }

  /**
   * 生成协作总结
   */
  private async generateCollaborativeSummary(
    session: UserInteractionSession,
    responses: ClaudeResponse[]
  ): Promise<ClaudeResponse | null> {
    if (responses.length <= 1) return null;

    // 选择领导者角色进行总结
    const leaderPersona = session.personas.find(p =>
      session.participantRoles.get(p.id) === 'leader'
    );

    if (!leaderPersona) return null;

    const summary = await this.getClaudeResponse(
      leaderPersona.id,
      '基于以上讨论，我来为大家总结一下：',
      {
        summarization: true,
        sourceResponses: responses.map(r => r.content)
      }
    );

    return summary;
  }

  /**
   * 评估解决方案质量
   */
  private async evaluateSolutions(
    solutions: ClaudeResponse[],
    originalQuestion: string
  ): Promise<ClaudeResponse[]> {
    // 简化的评估逻辑
    return solutions.sort((a, b) => {
      const scoreA = this.calculateSolutionScore(a, originalQuestion);
      const scoreB = this.calculateSolutionScore(b, originalQuestion);
      return scoreB - scoreA;
    });
  }

  /**
   * 计算解决方案评分
   */
  private calculateSolutionScore(solution: ClaudeResponse, question: string): number {
    let score = solution.confidence * 100;

    // 根据回复长度调整
    const length = solution.content.length;
    if (length < 100) score -= 20;
    else if (length > 500) score -= 10;

    // 根据拟人化角色调整
    if (solution.persona.role === 'technical_expert') score += 10;
    if (solution.persona.role === 'team_leader') score += 5;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * 设置事件处理器
   */
  private setupEventHandlers(): void {
    this.on('sessionCreated', (session) => {
      console.log(`🎉 交互会话创建: ${session.id}`);
    });

    this.on('messageProcessed', (data) => {
      const { userMessage, responses } = data;
      console.log(`💬 用户消息: ${userMessage.content.substring(0, 50)}...`);
      console.log(`🤖 Claude回复: ${responses.length} 个`);
    });
  }

  // 辅助方法
  private mapPersonaRole(role: string): any {
    const roleMap: Record<string, any> = {
      'team_leader': 'primary',
      'technical_expert': 'specialist',
      'creative_designer': 'specialist',
      'quality_guardian': 'arbitrator',
      'data_analyst': 'specialist'
    };
    return roleMap[role] || 'secondary';
  }

  private assignParticipantRoles(personas: ClaudePersona[]): Map<string, string> {
    const roles = new Map<string, string>();

    for (const persona of personas) {
      switch (persona.role) {
        case 'team_leader':
          roles.set(persona.id, 'leader');
          break;
        case 'technical_expert':
          roles.set(persona.id, 'expert');
          break;
        case 'creative_designer':
          roles.set(persona.id, 'creative');
          break;
        case 'quality_guardian':
          roles.set(persona.id, 'reviewer');
          break;
        default:
          roles.set(persona.id, 'participant');
      }
    }

    return roles;
  }

  private hasDisagreements(responses: ClaudeResponse[]): boolean {
    // 简化的分歧检测
    const keywords = ['不同意', '我认为', '相反', '但是', '然而'];
    return responses.some(r =>
      keywords.some(keyword => r.content.includes(keyword))
    );
  }

  private identifyDisagreements(responses: ClaudeResponse[]): any[] {
    // 简化的分歧识别
    return [{
      topic: '方案选择',
      involvedPersonas: responses.slice(0, 2).map(r => r.claudeId),
      opinions: responses.slice(0, 2).map(r => r.content)
    }];
  }

  private getOrderedPersonas(session: UserInteractionSession): ClaudePersona[] {
    // 按专业角色排序
    const order = ['team_leader', 'technical_expert', 'creative_designer', 'quality_guardian'];
    return session.personas.sort((a, b) =>
      order.indexOf(a.role) - order.indexOf(b.role)
    );
  }

  private analyzeQuestionType(content: string): string {
    if (content.includes('技术') || content.includes('开发')) return 'technical';
    if (content.includes('设计') || content.includes('创意')) return 'creative';
    if (content.includes('数据') || content.includes('分析')) return 'analytical';
    if (content.includes('质量') || content.includes('测试')) return 'quality';
    return 'general';
  }

  private selectBestPersona(personas: ClaudePersona[], questionType: string): ClaudePersona {
    const personaMap: Record<string, string> = {
      'technical': 'technical_expert',
      'creative': 'creative_designer',
      'analytical': 'data_analyst',
      'quality': 'quality_guardian'
    };

    const targetRole = personaMap[questionType] || 'team_leader';
    return personas.find(p => p.role === targetRole) || personas[0];
  }

  private async getSupplementaryResponses(
    session: UserInteractionSession,
    mainResponse: ClaudeResponse,
    excludePersonaId: string
  ): Promise<ClaudeResponse[]> {
    // 其他Claude提供补充意见
    const otherPersonas = session.personas.filter(p => p.id !== excludePersonaId);

    const supplements = await Promise.all(
      otherPersonas.slice(0, 2).map(persona =>
        this.getClaudeResponse(persona.id, `我对${mainResponse.persona.nickname}的观点有一些补充：`, {
          supplementary: true,
          mainResponse: mainResponse.content
        })
      )
    );

    return supplements;
  }

  private getActiveSession(userId: string): UserInteractionSession | null {
    if (this.activeConversation) {
      return this.interactionSessions.get(this.activeConversation);
    }

    // 查找用户最近的会话
    const userSessions = Array.from(this.interactionSessions.values())
      .filter(s => s.userId === userId && s.status === SessionStatus.ACTIVE)
      .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());

    return userSessions[0] || null;
  }

  // 拟人化回复生成方法
  private getGreetingByPersona(persona: ClaudePersona): string {
    return persona.behavior.greetingStyle;
  }

  private getResponseStyle(persona: ClaudePersona): string {
    return persona.behavior.responseStyle;
  }

  private generateFormalResponse(content: string): string {
    return `针对您的问题，我建议采用结构化的分析方法来处理。`;
  }

  private generateTechnicalResponse(content: string): string {
    return `从技术角度分析，这个问题的解决方案需要考虑多个技术层面。`;
  }

  private generateCreativeResponse(content: string): string {
    return `让我们跳出思维定式，用创新的视角来看待这个问题！`;
  }

  private generateDetailedResponse(content: string): string {
    return `我将从以下几个维度来详细阐述这个问题的重要性和解决方法。`;
  }

  private generateDataDrivenResponse(content: string): string {
    return `根据相关数据分析，我们可以得出以下结论和建议。`;
  }

  private generateDefaultResponse(content: string): string {
    return `关于这个问题，我认为可以从以下几个方面来考虑。`;
  }

  /**
   * 获取会话历史
   */
  getSessionHistory(sessionId?: string): InteractionMessage[] {
    if (sessionId) {
      const session = this.interactionSessions.get(sessionId);
      return session ? session.conversationHistory : [];
    }
    return this.messageHistory;
  }

  /**
   * 获取活跃会话
   */
  getActiveSessions(): UserInteractionSession[] {
    return Array.from(this.interactionSessions.values())
      .filter(s => s.status === SessionStatus.ACTIVE);
  }

  /**
   * 结束交互会话
   */
  async endSession(sessionId: string): Promise<void> {
    const session = this.interactionSessions.get(sessionId);
    if (session) {
      session.status = SessionStatus.COMPLETED;
      session.endedAt = new Date();

      if (this.activeConversation === sessionId) {
        this.activeConversation = null;
      }

      this.emit('sessionEnded', session);
    }
  }
}

// 类型定义
export enum InteractionMode {
  COLLABORATIVE = 'collaborative',  // 协作模式
  COMPETITIVE = 'competitive',      // 竞争模式
  SEQUENTIAL = 'sequential',        // 顺序模式
  SPECIALIST = 'specialist'         // 专家模式
}

export enum MessageType {
  USER = 'user',
  CLAUDE = 'claude',
  SYSTEM = 'system'
}

export interface UserInteractionSession {
  id: string;
  userId: string;
  personas: ClaudePersona[];
  mode: InteractionMode;
  status: SessionStatus;
  createdAt: Date;
  lastActivity: Date;
  endedAt?: Date;
  currentTopic: string | null;
  conversationHistory: InteractionMessage[];
  claudeSessions: Map<string, string>;
  sharedContext: Map<string, any>;
  participantRoles: Map<string, string>;
}

export interface InteractionMessage {
  id: string;
  type: MessageType;
  sender: string;
  content: string;
  timestamp: Date;
  metadata?: any;
}

export interface MessageOptions {
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  context?: Map<string, any>;
  attachments?: any[];
}

export interface ClaudeResponse {
  claudeId: string;
  persona: ClaudePersona;
  content: string;
  confidence: number;
  processingTime: number;
  timestamp: Date;
  metadata?: any;
}