import { v4 as uuidv4 } from 'uuid';

/**
 * Claude会话管理器 - 用于区分多个Claude实例
 */
export class ClaudeSessionManager {
  private sessions: Map<string, ClaudeSession> = new Map();
  private sessionMetrics: Map<string, SessionMetrics> = new Map();

  /**
   * 创建新会话
   */
  createSession(
    claudeName: string,
    role: ClaudeRole,
    capabilities: string[] = [],
    metadata: Record<string, any> = {}
  ): ClaudeSession {
    const sessionId = uuidv4();
    const now = new Date();

    const session: ClaudeSession = {
      id: sessionId,
      claudeName,
      role,
      capabilities,
      status: SessionStatus.ACTIVE,
      metadata,
      createdAt: now,
      lastActive: now,
      messageCount: 0,
      activeContracts: [],
      currentTasks: []
    };

    this.sessions.set(sessionId, session);
    this.sessionMetrics.set(sessionId, {
      totalMessages: 0,
      totalDecisions: 0,
      totalExecutions: 0,
      averageResponseTime: 0,
      accuracy: 1.0,
      collaborationScore: 0
    });

    console.log(`🤖 Claude会话创建: ${claudeName} (${sessionId}) - 角色: ${role}`);
    return session;
  }

  /**
   * 获取会话
   */
  getSession(sessionId: string): ClaudeSession | undefined {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActive = new Date();
    }
    return session;
  }

  /**
   * 按名称获取会话
   */
  getSessionByName(claudeName: string): ClaudeSession | undefined {
    for (const session of this.sessions.values()) {
      if (session.claudeName === claudeName) {
        session.lastActive = new Date();
        return session;
      }
    }
    return undefined;
  }

  /**
   * 获取所有活跃会话
   */
  getActiveSessions(): ClaudeSession[] {
    return Array.from(this.sessions.values())
      .filter(session => session.status === SessionStatus.ACTIVE)
      .sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime());
  }

  /**
   * 按角色获取会话
   */
  getSessionsByRole(role: ClaudeRole): ClaudeSession[] {
    return Array.from(this.sessions.values())
      .filter(session => session.role === role)
      .sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime());
  }

  /**
   * 更新会话状态
   */
  updateSessionStatus(
    sessionId: string,
    status: SessionStatus,
    reason?: string
  ): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.status = status;
      session.lastActive = new Date();
      if (reason) {
        session.metadata.statusReason = reason;
      }
      console.log(`🔄 会话状态更新: ${session.claudeName} -> ${status}`);
    }
  }

  /**
   * 添加活动合约
   */
  addActiveContract(sessionId: string, contractId: string): void {
    const session = this.sessions.get(sessionId);
    if (session && !session.activeContracts.includes(contractId)) {
      session.activeContracts.push(contractId);
      session.lastActive = new Date();
    }
  }

  /**
   * 移除活动合约
   */
  removeActiveContract(sessionId: string, contractId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.activeContracts = session.activeContracts.filter(id => id !== contractId);
      session.lastActive = new Date();
    }
  }

  /**
   * 添加当前任务
   */
  addCurrentTask(sessionId: string, task: SessionTask): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.currentTasks.push({
        ...task,
        sessionId,
        assignedAt: new Date()
      });
      session.lastActive = new Date();
    }
  }

  /**
   * 完成任务
   */
  completeTask(sessionId: string, taskId: string, result: any): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      const taskIndex = session.currentTasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        const task = session.currentTasks[taskIndex];
        task.completedAt = new Date();
        task.result = result;
        session.currentTasks.splice(taskIndex, 1);
        session.lastActive = new Date();

        // 更新会话指标
        this.updateSessionMetrics(sessionId, task.type, true);
      }
    }
  }

  /**
   * 记录消息
   */
  recordMessage(sessionId: string, message: SessionMessage): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.messageCount++;
      session.lastActive = new Date();

      // 更新指标
      const metrics = this.sessionMetrics.get(sessionId);
      if (metrics) {
        metrics.totalMessages++;
      }
    }
  }

  /**
   * 获取会话指标
   */
  getSessionMetrics(sessionId: string): SessionMetrics | undefined {
    return this.sessionMetrics.get(sessionId);
  }

  /**
   * 获取所有指标
   */
  getAllMetrics(): Record<string, SessionMetrics> {
    return Object.fromEntries(this.sessionMetrics);
  }

  /**
   * 更新会话指标
   */
  private updateSessionMetrics(
    sessionId: string,
    taskType: string,
    success: boolean
  ): void {
    const metrics = this.sessionMetrics.get(sessionId);
    if (metrics) {
      switch (taskType) {
        case 'decision':
          metrics.totalDecisions++;
          if (success) {
            metrics.accuracy = (metrics.accuracy * 0.9 + 1.0 * 0.1); // 简化的准确率更新
          }
          break;
        case 'execution':
          metrics.totalExecutions++;
          break;
      }
    }
  }

  /**
   * 清理非活跃会话
   */
  cleanupInactiveSessions(maxInactiveHours: number = 24): void {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - maxInactiveHours);

    let cleanedCount = 0;
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.lastActive < cutoffTime && session.status !== SessionStatus.BUSY) {
        this.sessions.delete(sessionId);
        this.sessionMetrics.delete(sessionId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 清理了 ${cleanedCount} 个非活跃会话`);
    }
  }

  /**
   * 生成会话报告
   */
  generateSessionReport(sessionId?: string): SessionReport {
    if (sessionId) {
      const session = this.sessions.get(sessionId);
      const metrics = this.sessionMetrics.get(sessionId);

      if (!session || !metrics) {
        throw new Error(`会话 ${sessionId} 不存在`);
      }

      return {
        session,
        metrics,
        generatedAt: new Date(),
        recommendations: this.generateRecommendations(session, metrics)
      };
    }

    // 生成所有会话的综合报告
    const allSessions = Array.from(this.sessions.values());
    const allMetrics = Object.fromEntries(this.sessionMetrics);

    return {
      session: {
        id: 'all',
        claudeName: 'All Sessions',
        role: ClaudeRole.COORDINATOR,
        capabilities: [],
        status: SessionStatus.ACTIVE,
        metadata: {},
        createdAt: new Date(),
        lastActive: new Date(),
        messageCount: allSessions.reduce((sum, s) => sum + s.messageCount, 0),
        activeContracts: [],
        currentTasks: []
      } as ClaudeSession,
      metrics: {
        totalMessages: Object.values(allMetrics).reduce((sum, m) => sum + m.totalMessages, 0),
        totalDecisions: Object.values(allMetrics).reduce((sum, m) => sum + m.totalDecisions, 0),
        totalExecutions: Object.values(allMetrics).reduce((sum, m) => sum + m.totalExecutions, 0),
        averageResponseTime: Object.values(allMetrics).reduce((sum, m) => sum + m.averageResponseTime, 0) / Object.keys(allMetrics).length,
        accuracy: Object.values(allMetrics).reduce((sum, m) => sum + m.accuracy, 0) / Object.keys(allMetrics).length,
        collaborationScore: Object.values(allMetrics).reduce((sum, m) => sum + m.collaborationScore, 0) / Object.keys(allMetrics).length
      },
      generatedAt: new Date(),
      recommendations: this.generateGlobalRecommendations(allSessions, allMetrics)
    };
  }

  /**
   * 生成推荐建议
   */
  private generateRecommendations(session: ClaudeSession, metrics: SessionMetrics): string[] {
    const recommendations = [];

    if (metrics.accuracy < 0.8) {
      recommendations.push('建议增加决策审核频率');
    }

    if (metrics.totalMessages > 1000) {
      recommendations.push('考虑将高负载任务分配给其他Claude实例');
    }

    if (session.currentTasks.length > 5) {
      recommendations.push('当前任务队列过长，建议优化任务分配');
    }

    if (session.activeContracts.length > 20) {
      recommendations.push('管理的合约数量较多，建议启用自动化规则');
    }

    return recommendations;
  }

  /**
   * 生成全局推荐建议
   */
  private generateGlobalRecommendations(
    sessions: ClaudeSession[],
    metrics: Record<string, SessionMetrics>
  ): string[] {
    const recommendations = [];
    const totalSessions = sessions.length;
    const activeSessions = sessions.filter(s => s.status === SessionStatus.ACTIVE).length;

    if (activeSessions / totalSessions < 0.5) {
      recommendations.push('活跃会话比例较低，建议检查会话状态');
    }

    const avgAccuracy = Object.values(metrics).reduce((sum, m) => sum + m.accuracy, 0) / Object.keys(metrics).length;
    if (avgAccuracy < 0.85) {
      recommendations.push('整体决策准确率有待提升，建议优化AI模型参数');
    }

    const busySessions = sessions.filter(s => s.status === SessionStatus.BUSY).length;
    if (busySessions > totalSessions * 0.7) {
      recommendations.push('系统负载较高，建议增加Claude实例或优化任务分配');
    }

    return recommendations;
  }

  /**
   * 导出会话数据
   */
  exportSessionData(sessionId?: string): string {
    const data = sessionId
      ? {
          session: this.sessions.get(sessionId),
          metrics: this.sessionMetrics.get(sessionId),
          exportedAt: new Date()
        }
      : {
          sessions: Object.fromEntries(this.sessions),
          metrics: Object.fromEntries(this.sessionMetrics),
          exportedAt: new Date()
        };

    return JSON.stringify(data, null, 2);
  }

  /**
   * 导入会话数据
   */
  importSessionData(data: string): void {
    try {
      const imported = JSON.parse(data);

      if (imported.session && imported.metrics) {
        // 单个会话导入
        this.sessions.set(imported.session.id, imported.session);
        this.sessionMetrics.set(imported.session.id, imported.metrics);
      } else if (imported.sessions && imported.metrics) {
        // 批量会话导入
        Object.entries(imported.sessions).forEach(([id, session]) => {
          this.sessions.set(id, session as ClaudeSession);
        });
        Object.entries(imported.metrics).forEach(([id, metrics]) => {
          this.sessionMetrics.set(id, metrics as SessionMetrics);
        });
      }

      console.log('✅ 会话数据导入成功');
    } catch (error) {
      console.error('❌ 会话数据导入失败:', error);
      throw new Error(`导入失败: ${error}`);
    }
  }
}

// 类型定义
export enum ClaudeRole {
  PRIMARY = 'primary',           // 主要Claude - 负责核心决策
  SPECIALIST = 'specialist',     // 专家Claude - 专门领域
  COORDINATOR = 'coordinator',   // 协调Claude - 协调多Claude工作
  MONITOR = 'monitor',           // 监控Claude - 监控系统状态
  ASSISTANT = 'assistant'        // 助理Claude - 辅助任务
}

export enum SessionStatus {
  ACTIVE = 'active',             // 活跃状态
  BUSY = 'busy',                 // 忙碌状态
  IDLE = 'idle',                 // 空闲状态
  SUSPENDED = 'suspended',       // 暂停状态
  TERMINATED = 'terminated'      // 终止状态
}

export interface ClaudeSession {
  id: string;
  claudeName: string;
  role: ClaudeRole;
  capabilities: string[];
  status: SessionStatus;
  metadata: Record<string, any>;
  createdAt: Date;
  lastActive: Date;
  messageCount: number;
  activeContracts: string[];
  currentTasks: SessionTask[];
}

export interface SessionTask {
  id: string;
  type: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedAt?: Date;
  completedAt?: Date;
  result?: any;
  sessionId?: string;
}

export interface SessionMessage {
  id: string;
  type: 'user' | 'claude' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface SessionMetrics {
  totalMessages: number;
  totalDecisions: number;
  totalExecutions: number;
  averageResponseTime: number;
  accuracy: number;
  collaborationScore: number;
}

export interface SessionReport {
  session: ClaudeSession;
  metrics: SessionMetrics;
  generatedAt: Date;
  recommendations: string[];
}