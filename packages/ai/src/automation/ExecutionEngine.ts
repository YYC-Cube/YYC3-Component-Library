import { v4 as uuidv4 } from 'uuid';
import {
  ExecutionEvent,
  ExecutionType,
  ExecutionStatus,
  SmartContract,
  ContractTerm,
  Condition,
  TermType,
  ContractStatus,
  Notification,
  NotificationType,
  Priority
} from '../types/index.js';

export class ExecutionEngine {
  private executionQueue: ExecutionEvent[] = [];
  private executionHistory: ExecutionEvent[] = [];
  private monitoringIntervals: Map<string, NodeJS.Timeout> = new Map();
  private webhookCallbacks: Map<string, (event: ExecutionEvent) => void> = new Map();

  /**
   * 启动自动化监控
   */
  startMonitoring(contract: SmartContract): void {
    const intervalId = setInterval(
      () => this.monitorContract(contract),
      60000 // 每分钟检查一次
    );

    this.monitoringIntervals.set(contract.id, intervalId);
    console.log(`开始监控合约 ${contract.id}`);
  }

  /**
   * 停止自动化监控
   */
  stopMonitoring(contractId: string): void {
    const intervalId = this.monitoringIntervals.get(contractId);
    if (intervalId) {
      clearInterval(intervalId);
      this.monitoringIntervals.delete(contractId);
      console.log(`停止监控合约 ${contractId}`);
    }
  }

  /**
   * 监控合约状态
   */
  private async monitorContract(contract: SmartContract): Promise<void> {
    try {
      // 检查每个条款的条件
      for (const term of contract.terms) {
        if (term.status === 'active') {
          await this.checkTermConditions(contract, term);
        }
      }

      // 处理执行队列
      await this.processExecutionQueue();

      // 检查即将到期的截止时间
      await this.checkUpcomingDeadlines(contract);

    } catch (error) {
      console.error(`监控合约 ${contract.id} 时出错:`, error);
    }
  }

  /**
   * 检查条款条件
   */
  private async checkTermConditions(contract: SmartContract, term: ContractTerm): Promise<void> {
    for (const condition of term.conditions) {
      if (!condition.verified) {
        const isMet = await this.evaluateCondition(condition, contract);

        if (isMet) {
          await this.createExecutionEvent({
            contractId: contract.id,
            termId: term.id,
            type: ExecutionType.DOCUMENT_VERIFICATION,
            status: ExecutionStatus.PENDING,
            executor: 'system',
            input: { conditionId: condition.id, verified: true },
            metadata: { verificationType: 'automated' }
          });

          condition.verified = true;
          condition.actualOutcome = isMet;
          condition.verifiedBy = 'system';
          condition.verifiedAt = new Date();
        }
      }
    }
  }

  /**
   * 评估条件
   */
  private async evaluateCondition(
    condition: Condition,
    contract: SmartContract
  ): Promise<boolean> {
    switch (condition.type) {
      case 'deadline':
        return this.evaluateDeadlineCondition(condition);
      case 'threshold':
        return this.evaluateThresholdCondition(condition, contract);
      case 'milestone':
        return this.evaluateMilestoneCondition(condition, contract);
      case 'automated':
        return this.evaluateAutomatedCondition(condition, contract);
      default:
        return false;
    }
  }

  /**
   * 评估截止时间条件
   */
  private evaluateDeadlineCondition(condition: Condition): boolean {
    const deadline = new Date(condition.parameters.deadline);
    const now = new Date();

    if (condition.operator === 'and') {
      return now >= deadline;
    }

    return false;
  }

  /**
   * 评估阈值条件
   */
  private evaluateThresholdCondition(condition: Condition, contract: SmartContract): boolean {
    const { metric, threshold, operator } = condition.parameters;

    let currentValue = this.getMetricValue(metric, contract);

    switch (operator) {
      case 'greater_than':
        return currentValue > threshold;
      case 'less_than':
        return currentValue < threshold;
      case 'equal_to':
        return currentValue === threshold;
      case 'greater_than_or_equal':
        return currentValue >= threshold;
      case 'less_than_or_equal':
        return currentValue <= threshold;
      default:
        return false;
    }
  }

  /**
   * 评估里程碑条件
   */
  private evaluateMilestoneCondition(condition: Condition, contract: SmartContract): boolean {
    const { milestoneId } = condition.parameters;

    // 检查依赖的里程碑是否已完成
    const dependentTerm = contract.terms.find(t => t.id === milestoneId);

    return dependentTerm?.status === 'completed' || false;
  }

  /**
   * 评估自动条件
   */
  private evaluateAutomatedCondition(condition: Condition, contract: SmartContract): boolean {
    const { checkType, parameters } = condition.parameters;

    switch (checkType) {
      case 'party_activity':
        return this.checkPartyActivity(contract, parameters.partyId, parameters.daysThreshold);
      case 'document_upload':
        return this.checkDocumentUpload(parameters.documentId);
      case 'external_api':
        return this.checkExternalAPI(parameters.apiUrl, parameters.expectedResponse);
      default:
        return false;
    }
  }

  /**
   * 获取指标值
   */
  private getMetricValue(metric: string, contract: SmartContract): number {
    switch (metric) {
      case 'completion_rate':
        const completed = contract.terms.filter(t => t.status === 'completed').length;
        return contract.terms.length > 0 ? completed / contract.terms.length : 0;
      case 'average_reputation':
        const totalRep = contract.parties.reduce((sum, p) => sum + p.reputation, 0);
        return contract.parties.length > 0 ? totalRep / contract.parties.length : 0;
      case 'dispute_rate':
        const disputed = contract.terms.filter(t => t.status === 'disputed').length;
        return contract.terms.length > 0 ? disputed / contract.terms.length : 0;
      default:
        return 0;
    }
  }

  /**
   * 检查协作方活跃度
   */
  private checkPartyActivity(contract: SmartContract, partyId: string, daysThreshold: number): boolean {
    const party = contract.parties.find(p => p.id === partyId);
    if (!party) return false;

    const daysSinceLastActive = (new Date().getTime() - party.lastActive.getTime()) / (1000 * 60 * 60 * 24);

    return daysSinceLastActive <= daysThreshold;
  }

  /**
   * 检查文档上传
   */
  private checkDocumentUpload(documentId: string): boolean {
    // 在实际应用中，这里应该检查文档存储系统
    // 简化处理，返回false
    return false;
  }

  /**
   * 检查外部API
   */
  private async checkExternalAPI(apiUrl: string, expectedResponse: any): Promise<boolean> {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      // 简化的响应检查
      return JSON.stringify(data) === JSON.stringify(expectedResponse);
    } catch (error) {
      console.error('检查外部API失败:', error);
      return false;
    }
  }

  /**
   * 检查即将到期的截止时间
   */
  private async checkUpcomingDeadlines(contract: SmartContract): Promise<void> {
    const now = new Date();
    const warningThreshold = 7 * 24 * 60 * 60 * 1000; // 7天

    for (const term of contract.terms) {
      if (term.type === 'timeline' && term.status === 'active') {
        const deadline = new Date(term.value.deadline);
        const timeUntilDeadline = deadline.getTime() - now.getTime();

        // 如果在7天内到期，发送提醒
        if (timeUntilDeadline > 0 && timeUntilDeadline <= warningThreshold) {
          await this.createNotification({
            contractId: contract.id,
            recipientId: contract.parties[0].id, // 发送给主要协作方
            type: NotificationType.DEADLINE_APPROACHING,
            title: '截止时间即将到期',
            message: `条款 "${term.title}" 将在 ${Math.ceil(timeUntilDeadline / (24 * 60 * 60 * 1000))} 天后到期`,
            data: { termId: term.id, deadline: term.value.deadline },
            priority: Priority.HIGH
          });
        }

        // 如果已经过期，自动标记为失败
        if (timeUntilDeadline <= 0) {
          await this.createExecutionEvent({
            contractId: contract.id,
            termId: term.id,
            type: ExecutionType.NOTIFICATION,
            status: ExecutionStatus.PENDING,
            executor: 'system',
            input: { action: 'mark_failed', reason: 'deadline_expired' },
            metadata: { expiredAt: new Date() }
          });
        }
      }
    }
  }

  /**
   * 创建执行事件
   */
  async createExecutionEvent(eventData: Omit<ExecutionEvent, 'id' | 'startedAt'>): Promise<ExecutionEvent> {
    const event: ExecutionEvent = {
      id: uuidv4(),
      ...eventData,
      startedAt: new Date()
    };

    this.executionQueue.push(event);
    return event;
  }

  /**
   * 处理执行队列
   */
  private async processExecutionQueue(): Promise<void> {
    const eventsToProcess = this.executionQueue.splice(0, 10); // 每次最多处理10个事件

    for (const event of eventsToProcess) {
      await this.executeEvent(event);
    }
  }

  /**
   * 执行事件
   */
  private async executeEvent(event: ExecutionEvent): Promise<void> {
    try {
      event.status = ExecutionStatus.RUNNING;

      switch (event.type) {
        case ExecutionType.AUTOMATED_PAYMENT:
          await this.executeAutomatedPayment(event);
          break;
        case ExecutionType.DIGITAL_SIGNATURE:
          await this.executeDigitalSignature(event);
          break;
        case ExecutionType.DOCUMENT_VERIFICATION:
          await this.executeDocumentVerification(event);
          break;
        case ExecutionType.NOTIFICATION:
          await this.executeNotification(event);
          break;
        case ExecutionType.API_CALL:
          await this.executeAPICall(event);
          break;
        case ExecutionType.SMART_CONTRACT_UPDATE:
          await this.executeSmartContractUpdate(event);
          break;
        default:
          throw new Error(`未知的执行类型: ${event.type}`);
      }

      event.status = ExecutionStatus.COMPLETED;
      event.completedAt = new Date();

      // 触发webhook回调
      this.triggerWebhookCallbacks(event);

    } catch (error) {
      event.status = ExecutionStatus.FAILED;
      event.error = error instanceof Error ? error.message : String(error);
      event.completedAt = new Date();

      console.error(`执行事件 ${event.id} 失败:`, error);
    }

    this.executionHistory.push(event);
  }

  /**
   * 执行自动支付
   */
  private async executeAutomatedPayment(event: ExecutionEvent): Promise<void> {
    const { recipient, amount, currency, paymentMethod } = event.input;

    // 在实际应用中，这里应该集成支付网关
    console.log(`执行自动支付: ${amount} ${currency} 给 ${recipient}`);

    // 模拟支付处理时间
    await new Promise(resolve => setTimeout(resolve, 2000));

    event.output = {
      transactionId: uuidv4(),
      status: 'completed',
      timestamp: new Date()
    };
  }

  /**
   * 执行数字签名
   */
  private async executeDigitalSignature(event: ExecutionEvent): Promise<void> {
    const { documentId, signerId, signatureData } = event.input;

    // 在实际应用中，这里应该使用数字签名库
    console.log(`执行数字签名: 文档 ${documentId} 由 ${signerId} 签署`);

    event.output = {
      signatureHash: uuidv4(),
      signedAt: new Date(),
      verified: true
    };
  }

  /**
   * 执行文档验证
   */
  private async executeDocumentVerification(event: ExecutionEvent): Promise<void> {
    const { conditionId, verified } = event.input;

    console.log(`执行文档验证: 条件 ${conditionId} 验证结果: ${verified}`);

    event.output = {
      conditionId,
      verified,
      verifiedAt: new Date(),
      verifiedBy: 'system'
    };
  }

  /**
   * 执行通知
   */
  private async executeNotification(event: ExecutionEvent): Promise<void> {
    const { action, reason } = event.input;

    console.log(`执行通知操作: ${action}, 原因: ${reason}`);

    event.output = {
      action,
      reason,
      executedAt: new Date(),
      success: true
    };
  }

  /**
   * 执行API调用
   */
  private async executeAPICall(event: ExecutionEvent): Promise<void> {
    const { url, method, headers, body } = event.input;

    console.log(`执行API调用: ${method} ${url}`);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(body)
      });

      const responseData = await response.json();

      event.output = {
        statusCode: response.status,
        data: responseData,
        timestamp: new Date()
      };

    } catch (error) {
      throw new Error(`API调用失败: ${error}`);
    }
  }

  /**
   * 执行智能合约更新
   */
  private async executeSmartContractUpdate(event: ExecutionEvent): Promise<void> {
    const { contractId, updates } = event.input;

    console.log(`执行智能合约更新: ${contractId}`, updates);

    event.output = {
      contractId,
      updates,
      updatedAt: new Date(),
      version: 'updated'
    };
  }

  /**
   * 创建通知
   */
  private async createNotification(notificationData: Omit<Notification, 'id' | 'read' | 'createdAt'>): Promise<Notification> {
    const notification: Notification = {
      id: uuidv4(),
      ...notificationData,
      read: false,
      createdAt: new Date()
    };

    // 在实际应用中，这里应该将通知发送给用户
    console.log(`创建通知: ${notification.title} -> ${notification.recipientId}`);

    return notification;
  }

  /**
   * 注册webhook回调
   */
  registerWebhookCallback(eventType: ExecutionType, callback: (event: ExecutionEvent) => void): string {
    const callbackId = uuidv4();
    this.webhookCallbacks.set(callbackId, callback);
    return callbackId;
  }

  /**
   * 取消注册webhook回调
   */
  unregisterWebhookCallback(callbackId: string): void {
    this.webhookCallbacks.delete(callbackId);
  }

  /**
   * 触发webhook回调
   */
  private triggerWebhookCallbacks(event: ExecutionEvent): void {
    for (const [id, callback] of this.webhookCallbacks) {
      try {
        callback(event);
      } catch (error) {
        console.error(`Webhook回调 ${id} 执行失败:`, error);
      }
    }
  }

  /**
   * 手动触发执行
   */
  async triggerExecution(
    contractId: string,
    termId: string,
    type: ExecutionType,
    executor: string,
    input: any
  ): Promise<ExecutionEvent> {
    const event = await this.createExecutionEvent({
      contractId,
      termId,
      type,
      status: ExecutionStatus.PENDING,
      executor,
      input
    });

    await this.executeEvent(event);
    return event;
  }

  /**
   * 获取执行历史
   */
  getExecutionHistory(contractId?: string, termId?: string, status?: ExecutionStatus): ExecutionEvent[] {
    let events = this.executionHistory;

    if (contractId) {
      events = events.filter(e => e.contractId === contractId);
    }

    if (termId) {
      events = events.filter(e => e.termId === termId);
    }

    if (status) {
      events = events.filter(e => e.status === status);
    }

    return events.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
  }

  /**
   * 获取执行统计
   */
  getExecutionStats(contractId?: string): any {
    const events = contractId
      ? this.executionHistory.filter(e => e.contractId === contractId)
      : this.executionHistory;

    const total = events.length;
    const completed = events.filter(e => e.status === ExecutionStatus.COMPLETED).length;
    const failed = events.filter(e => e.status === ExecutionStatus.FAILED).length;
    const pending = events.filter(e => e.status === ExecutionStatus.PENDING).length;
    const running = events.filter(e => e.status === ExecutionStatus.RUNNING).length;

    const avgExecutionTime = this.calculateAverageExecutionTime(events);

    return {
      total,
      completed,
      failed,
      pending,
      running,
      successRate: total > 0 ? (completed / total) * 100 : 0,
      avgExecutionTime,
      queueLength: this.executionQueue.length,
      monitoredContracts: this.monitoringIntervals.size
    };
  }

  /**
   * 计算平均执行时间
   */
  private calculateAverageExecutionTime(events: ExecutionEvent[]): number {
    const completedEvents = events.filter(e =>
      e.status === ExecutionStatus.COMPLETED && e.completedAt
    );

    if (completedEvents.length === 0) return 0;

    const totalTime = completedEvents.reduce(
      (sum, event) => sum + (event.completedAt!.getTime() - event.startedAt.getTime()),
      0
    );

    return totalTime / completedEvents.length;
  }

  /**
   * 清理执行历史
   */
  cleanupExecutionHistory(olderThanDays: number = 30): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    this.executionHistory = this.executionHistory.filter(
      event => event.startedAt > cutoffDate
    );

    console.log(`清理了 ${olderThanDays} 天前的执行历史记录`);
  }

  /**
   * 导出执行数据
   */
  exportExecutionData(contractId?: string): string {
    const events = this.getExecutionHistory(contractId);
    const stats = this.getExecutionStats(contractId);

    return JSON.stringify({
      events,
      stats,
      exportedAt: new Date(),
      version: '1.0.0'
    }, null, 2);
  }
}