import { ClaudeSessionManager, ClaudeRole, SessionStatus, ClaudeSession } from './ClaudeSessionManager.js';

/**
 * Claude协作协调器 - 管理多个Claude实例之间的协作
 */
export class ClaudeCoordinator {
  private sessionManager: ClaudeSessionManager;
  private taskQueue: CoordinatorTask[] = [];
  private collaborationRules: CollaborationRule[] = [];

  constructor() {
    this.sessionManager = new ClaudeSessionManager();
    this.initializeDefaultRules();
  }

  /**
   * 初始化默认协作规则
   */
  private initializeDefaultRules(): void {
    this.collaborationRules = [
      {
        id: 'load_balancing',
        name: '负载均衡规则',
        description: '将任务分配给负载最低的Claude实例',
        condition: (task, sessions) => sessions.length > 1,
        priority: 1,
        enabled: true
      },
      {
        id: 'specialist_routing',
        name: '专家路由规则',
        description: '将专业任务分配给对应领域的专家Claude',
        condition: (task, sessions) => task.category && sessions.some(s => s.capabilities.includes(task.category)),
        priority: 2,
        enabled: true
      },
      {
        id: 'decision_consensus',
        name: '决策共识规则',
        description: '重要决策需要多个Claude实例达成共识',
        condition: (task, sessions) => task.type === 'critical_decision',
        priority: 3,
        enabled: true
      },
      {
        id: 'failover_handling',
        name: '故障转移规则',
        description: '当Claude实例不可用时，自动转移任务',
        condition: (task, sessions) => true, // 总是启用
        priority: 4,
        enabled: true
      }
    ];
  }

  /**
   * 注册Claude实例
   */
  registerClaude(
    claudeName: string,
    role: ClaudeRole,
    capabilities: string[] = [],
    metadata: Record<string, any> = {}
  ): string {
    const session = this.sessionManager.createSession(claudeName, role, capabilities, metadata);
    console.log(`🤝 Claude实例注册成功: ${claudeName} (${session.id})`);
    return session.id;
  }

  /**
   * 分配任务给合适的Claude
   */
  async assignTask(
    taskData: Omit<CoordinatorTask, 'id' | 'createdAt' | 'status'>,
    requesterId?: string
  ): Promise<TaskAssignment> {
    const task: CoordinatorTask = {
      id: this.generateTaskId(),
      ...taskData,
      createdAt: new Date(),
      status: 'pending'
    };

    // 查找合适的Claude实例
    const assignedSession = await this.findBestClaudeForTask(task);

    if (!assignedSession) {
      task.status = 'failed';
      task.error = '没有可用的Claude实例';
      return {
        taskId: task.id,
        sessionId: null,
        status: 'failed',
        message: '没有可用的Claude实例',
        assignedAt: new Date()
      };
    }

    // 分配任务
    this.sessionManager.addCurrentTask(assignedSession.id, {
      id: task.id,
      type: task.type,
      description: task.description,
      priority: task.priority
    });

    this.sessionManager.addActiveContract(assignedSession.id, task.contractId);

    task.status = 'assigned';
    task.assignedTo = assignedSession.id;
    task.assignedAt = new Date();

    // 添加到任务队列
    this.taskQueue.push(task);

    const assignment: TaskAssignment = {
      taskId: task.id,
      sessionId: assignedSession.id,
      claudeName: assignedSession.claudeName,
      role: assignedSession.role,
      status: 'assigned',
      message: `任务已分配给 ${assignedSession.claudeName}`,
      assignedAt: task.assignedAt
    };

    console.log(`📋 任务分配: ${task.description} -> ${assignedSession.claudeName}`);
    return assignment;
  }

  /**
   * 查找最适合处理任务的Claude实例
   */
  private async findBestClaudeForTask(task: CoordinatorTask): Promise<ClaudeSession | null> {
    const activeSessions = this.sessionManager.getActiveSessions()
      .filter(session => session.status === SessionStatus.ACTIVE);

    if (activeSessions.length === 0) {
      return null;
    }

    // 应用协作规则
    for (const rule of this.collaborationRules.filter(r => r.enabled)) {
      const result = await this.applyCollaborationRule(rule, task, activeSessions);
      if (result) {
        return result;
      }
    }

    // 默认负载均衡
    return this.selectByLoadBalancing(activeSessions);
  }

  /**
   * 应用协作规则
   */
  private async applyCollaborationRule(
    rule: CollaborationRule,
    task: CoordinatorTask,
    sessions: ClaudeSession[]
  ): Promise<ClaudeSession | null> {
    if (!rule.condition(task, sessions)) {
      return null;
    }

    switch (rule.id) {
      case 'specialist_routing':
        return this.selectBySpecialist(sessions, task.category);
      case 'decision_consensus':
        return await this.selectForConsensus(sessions, task);
      case 'load_balancing':
        return this.selectByLoadBalancing(sessions);
      default:
        return null;
    }
  }

  /**
   * 按专业能力选择Claude
   */
  private selectBySpecialist(
    sessions: ClaudeSession[],
    category?: string
  ): ClaudeSession | null {
    if (!category) {
      return null;
    }

    const specialists = sessions.filter(session =>
      session.capabilities.includes(category) ||
      session.capabilities.includes('expert')
    );

    return specialists.length > 0 ? specialists[0] : null;
  }

  /**
   * 为共识选择多个Claude
   */
  private async selectForConsensus(
    sessions: ClaudeSession,
    task: CoordinatorTask
  ): Promise<ClaudeSession | null> {
    // 对于重要决策，选择多个专家Claude
    const experts = sessions.filter(session =>
      session.role === ClaudeRole.SPECIALIST ||
      session.capabilities.includes('decision_making')
    );

    if (experts.length >= 2) {
      // 选择第一个专家作为主要处理者
      const primaryExpert = experts[0];

      // 标记需要其他专家参与
      task.requiresConsensus = true;
      task.consensusParticipants = experts.map(e => e.id);

      return primaryExpert;
    }

    return sessions[0]; // 如果没有足够专家，使用第一个可用的
  }

  /**
   * 按负载均衡选择Claude
   */
  private selectByLoadBalancing(sessions: ClaudeSession[]): ClaudeSession | null {
    // 按当前任务数量排序，选择任务最少的
    const sortedSessions = sessions.sort((a, b) =>
      a.currentTasks.length - b.currentTasks.length
    );

    return sortedSessions[0] || null;
  }

  /**
   * 完成任务
   */
  async completeTask(
    taskId: string,
    result: any,
    sessionId: string,
    success: boolean = true
  ): Promise<void> {
    const task = this.taskQueue.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`任务 ${taskId} 不存在`);
    }

    const session = this.sessionManager.getSession(sessionId);
    if (!session) {
      throw new Error(`Claude会话 ${sessionId} 不存在`);
    }

    // 更新任务状态
    task.status = success ? 'completed' : 'failed';
    task.completedAt = new Date();
    task.result = result;

    // 更新会话任务
    this.sessionManager.completeTask(sessionId, taskId, result);
    this.sessionManager.removeActiveContract(sessionId, task.contractId);

    // 如果需要共识，收集其他专家的意见
    if (task.requiresConsensus && task.consensusParticipants) {
      await this.processConsensus(task, result);
    }

    console.log(`✅ 任务完成: ${task.description} by ${session.claudeName}`);
  }

  /**
   * 处理共识决策
   */
  private async processConsensus(
    task: CoordinatorTask,
    initialResult: any
  ): Promise<void> {
    console.log(`🤔 处理共识决策: ${task.id}`);

    // 这里可以实现复杂的共识逻辑
    // 例如：投票、多数决、权重计算等

    const consensusResult = {
      initialResult,
      consensus: 'agreed', // 或 'disagreed'
      consensusScore: 0.95,
      participantCount: task.consensusParticipants?.length || 0
    };

    task.consensusResult = consensusResult;
  }

  /**
   * 获取当前任务状态
   */
  getTaskStatus(taskId: string): CoordinatorTask | undefined {
    return this.taskQueue.find(t => t.id === taskId);
  }

  /**
   * 获取所有任务
   */
  getAllTasks(status?: TaskStatus): CoordinatorTask[] {
    let tasks = this.taskQueue;
    if (status) {
      tasks = tasks.filter(t => t.status === status);
    }
    return tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * 获取Claude实例状态
   */
  getClaudeStatus(sessionId?: string): any {
    if (sessionId) {
      const session = this.sessionManager.getSession(sessionId);
      const metrics = this.sessionManager.getSessionMetrics(sessionId);
      return { session, metrics };
    }

    const activeSessions = this.sessionManager.getActiveSessions();
    return {
      totalSessions: activeSessions.length,
      sessions: activeSessions.map(session => ({
        id: session.id,
        name: session.claudeName,
        role: session.role,
        status: session.status,
        activeContracts: session.activeContracts.length,
        currentTasks: session.currentTasks.length,
        lastActive: session.lastActive
      })),
      metrics: this.sessionManager.getAllMetrics()
    };
  }

  /**
   * 处理Claude实例故障
   */
  async handleClaudeFailure(sessionId: string, error: string): Promise<void> {
    const session = this.sessionManager.getSession(sessionId);
    if (!session) {
      return;
    }

    console.log(`🚨 Claude实例故障: ${session.claudeName} - ${error}`);

    // 标记会话为暂停状态
    this.sessionManager.updateSessionStatus(
      sessionId,
      SessionStatus.SUSPENDED,
      error
    );

    // 重新分配该实例的所有任务
    const affectedTasks = this.taskQueue.filter(t => t.assignedTo === sessionId && t.status === 'assigned');

    for (const task of affectedTasks) {
      console.log(`🔄 重新分配任务: ${task.description}`);

      // 重置任务状态
      task.status = 'pending';
      task.assignedTo = undefined;
      task.assignedAt = undefined;

      // 重新分配
      await this.assignTask({
        type: task.type,
        description: task.description,
        priority: task.priority,
        contractId: task.contractId,
        category: task.category,
        data: task.data,
        requesterId: task.requesterId
      });
    }
  }

  /**
   * 更新协作规则
   */
  updateCollaborationRule(ruleId: string, updates: Partial<CollaborationRule>): void {
    const rule = this.collaborationRules.find(r => r.id === ruleId);
    if (rule) {
      Object.assign(rule, updates);
      console.log(`📝 协作规则更新: ${rule.name}`);
    }
  }

  /**
   * 获取协作统计
   */
  getCollaborationStats(): CollaborationStats {
    const activeSessions = this.sessionManager.getActiveSessions();
    const allTasks = this.getAllTasks();

    const tasksByStatus = allTasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<TaskStatus, number>);

    const tasksByType = allTasks.reduce((acc, task) => {
      acc[task.type] = (acc[task.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalClaudeInstances: activeSessions.length,
      claudeByRole: activeSessions.reduce((acc, session) => {
        acc[session.role] = (acc[session.role] || 0) + 1;
        return acc;
      }, {} as Record<ClaudeRole, number>),
      totalTasks: allTasks.length,
      tasksByStatus,
      tasksByType,
      averageResponseTime: this.calculateAverageResponseTime(),
      consensusDecisions: allTasks.filter(t => t.requiresConsensus).length,
      activeRules: this.collaborationRules.filter(r => r.enabled).length
    };
  }

  /**
   * 计算平均响应时间
   */
  private calculateAverageResponseTime(): number {
    const completedTasks = this.getAllTasks('completed');
    if (completedTasks.length === 0) {
      return 0;
    }

    const totalTime = completedTasks.reduce((sum, task) => {
      if (task.completedAt && task.assignedAt) {
        return sum + (task.completedAt.getTime() - task.assignedAt.getTime());
      }
      return sum;
    }, 0);

    return totalTime / completedTasks.length;
  }

  /**
   * 生成协作报告
   */
  generateCollaborationReport(): CollaborationReport {
    const stats = this.getCollaborationStats();
    const claudeStatus = this.getClaudeStatus();
    const sessionReport = this.sessionManager.generateSessionReport();

    return {
      stats,
      claudeStatus,
      sessionReport,
      recommendations: this.generateRecommendations(stats),
      generatedAt: new Date()
    };
  }

  /**
   * 生成推荐建议
   */
  private generateRecommendations(stats: CollaborationStats): string[] {
    const recommendations = [];

    if (stats.totalClaudeInstances < 3) {
      recommendations.push('建议增加更多Claude实例以提高系统韧性');
    }

    if (stats.tasksByStatus.failed > stats.totalTasks * 0.1) {
      recommendations.push('失败率较高，建议检查Claude实例配置');
    }

    if (stats.consensusDecisions > stats.totalTasks * 0.3) {
      recommendations.push('共识决策比例较高，可能影响效率，建议优化决策流程');
    }

    if (stats.averageResponseTime > 30000) { // 30秒
      recommendations.push('平均响应时间较长，建议优化任务分配或增加实例');
    }

    return recommendations;
  }

  /**
   * 生成任务ID
   */
  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 清理过期任务
   */
  cleanupExpiredTasks(maxAgeHours: number = 24): void {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - maxAgeHours);

    const initialCount = this.taskQueue.length;
    this.taskQueue = this.taskQueue.filter(task =>
      task.createdAt > cutoffTime || ['assigned', 'running'].includes(task.status)
    );

    const cleanedCount = initialCount - this.taskQueue.length;
    if (cleanedCount > 0) {
      console.log(`🧹 清理了 ${cleanedCount} 个过期任务`);
    }
  }

  /**
   * 导出协作数据
   */
  exportCollaborationData(): string {
    return JSON.stringify({
      tasks: this.taskQueue,
      rules: this.collaborationRules,
      sessions: this.sessionManager.exportSessionData(),
      exportedAt: new Date()
    }, null, 2);
  }
}

// 类型定义
export interface CoordinatorTask {
  id: string;
  type: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  contractId: string;
  category?: string;
  data?: any;
  requesterId?: string;
  createdAt: Date;
  status: TaskStatus;
  assignedTo?: string;
  assignedAt?: Date;
  completedAt?: Date;
  result?: any;
  error?: string;
  requiresConsensus?: boolean;
  consensusParticipants?: string[];
  consensusResult?: any;
}

export type TaskStatus = 'pending' | 'assigned' | 'running' | 'completed' | 'failed';

export interface TaskAssignment {
  taskId: string;
  sessionId: string | null;
  claudeName?: string;
  role?: ClaudeRole;
  status: string;
  message: string;
  assignedAt: Date;
}

export interface CollaborationRule {
  id: string;
  name: string;
  description: string;
  condition: (task: CoordinatorTask, sessions: ClaudeSession[]) => boolean;
  priority: number;
  enabled: boolean;
}

export interface CollaborationStats {
  totalClaudeInstances: number;
  claudeByRole: Record<ClaudeRole, number>;
  totalTasks: number;
  tasksByStatus: Record<TaskStatus, number>;
  tasksByType: Record<string, number>;
  averageResponseTime: number;
  consensusDecisions: number;
  activeRules: number;
}

export interface CollaborationReport {
  stats: CollaborationStats;
  claudeStatus: any;
  sessionReport: any;
  recommendations: string[];
  generatedAt: Date;
}