import { v4 as uuidv4 } from 'uuid';
import {
  Decision,
  DecisionType,
  DecisionTrigger,
  DecisionOption,
  DecisionStatus,
  AIRecommendation,
  RiskAssessment,
  RiskLevel,
  RiskFactor,
  ImpactLevel,
  SmartContract,
  ContractTerm,
  Party
} from '../types/index.js';

export class AIDecisionEngine {
  private decisionHistory: Decision[] = [];
  private modelWeights: Map<string, number> = new Map();

  constructor() {
    this.initializeModelWeights();
  }

  /**
   * 初始化AI模型权重
   */
  private initializeModelWeights(): void {
    // 风险评估权重
    this.modelWeights.set('reputation_risk', 0.25);
    this.modelWeights.set('deadline_risk', 0.20);
    this.modelWeights.set('complexity_risk', 0.15);
    this.modelWeights.set('dependency_risk', 0.20);
    this.modelWeights.set('external_risk', 0.20);
  }

  /**
   * 创建决策
   */
  async createDecision(
    type: DecisionType,
    trigger: DecisionTrigger,
    context: Record<string, any>,
    options: DecisionOption[],
    contract: SmartContract,
    createdBy: string
  ): Promise<Decision> {
    const decision: Decision = {
      id: uuidv4(),
      type,
      trigger,
      context,
      options,
      status: DecisionStatus.PENDING,
      createdBy,
      createdAt: new Date()
    };

    // 生成AI推荐
    const aiRecommendation = await this.generateAIRecommendation(
      decision,
      contract
    );

    decision.aiRecommendation = aiRecommendation;

    // 如果置信度超过阈值，自动决策
    if (aiRecommendation.confidence > 0.85) {
      const recommendedOption = options.find(
        opt => opt.id === aiRecommendation.recommendedOption
      );

      if (recommendedOption) {
        decision.selectedOption = recommendedOption;
        decision.status = DecisionStatus.RESOLVED;
        decision.resolvedAt = new Date();

        // 执行自动决策
        await this.executeDecision(decision, contract);
      }
    }

    this.decisionHistory.push(decision);
    return decision;
  }

  /**
   * 生成AI推荐
   */
  private async generateAIRecommendation(
    decision: Decision,
    contract: SmartContract
  ): Promise<AIRecommendation> {
    const scoredOptions = await this.scoreOptions(decision, contract);
    const bestOption = scoredOptions[0];

    const riskAssessment = await this.assessRisk(decision, contract);
    const confidence = this.calculateConfidence(bestOption, riskAssessment);

    return {
      recommendedOption: bestOption.option.id,
      confidence,
      reasoning: await this.generateReasoning(decision, bestOption, riskAssessment),
      supportingData: bestOption.dataPoints,
      riskAssessment
    };
  }

  /**
   * 为选项评分
   */
  private async scoreOptions(
    decision: Decision,
    contract: SmartContract
  ): Promise<Array<{ option: DecisionOption; score: number; dataPoints: any[] }>> {
    const scoredOptions = [];

    for (const option of decision.options) {
      const score = await this.calculateOptionScore(option, decision, contract);
      const dataPoints = await this.gatherSupportingData(option, decision, contract);

      scoredOptions.push({
        option,
        score,
        dataPoints
      });
    }

    // 按评分排序
    return scoredOptions.sort((a, b) => b.score - a.score);
  }

  /**
   * 计算选项评分
   */
  private async calculateOptionScore(
    option: DecisionOption,
    decision: Decision,
    contract: SmartContract
  ): Promise<number> {
    let score = 0;

    // 基础评分：影响程度和概率的加权
    const impactScore = this.getImpactScore(option.impact);
    score += impactScore * 0.3;

    // 风险评分
    const riskScore = this.calculateRiskScore(option.consequences);
    score += (100 - riskScore) * 0.25; // 风险越低，评分越高

    // 历史表现评分
    const historicalScore = await this.calculateHistoricalScore(option, decision);
    score += historicalScore * 0.2;

    // 合约状态评分
    const contractScore = this.calculateContractScore(option, contract);
    score += contractScore * 0.15;

    // 协作方兼容性评分
    const partyScore = await this.calculatePartyCompatibility(option, contract);
    score += partyScore * 0.1;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * 获取影响程度评分
   */
  private getImpactScore(impact: ImpactLevel): number {
    const impactScores = {
      [ImpactLevel.MINIMAL]: 20,
      [ImpactLevel.LOW]: 40,
      [ImpactLevel.MODERATE]: 60,
      [ImpactLevel.HIGH]: 80,
      [ImpactLevel.CRITICAL]: 100
    };
    return impactScores[impact];
  }

  /**
   * 计算风险评分
   */
  private calculateRiskScore(consequences: any[]): number {
    if (!consequences || consequences.length === 0) {
      return 0;
    }

    let totalRisk = 0;
    let totalWeight = 0;

    for (const consequence of consequences) {
      const impactWeight = this.getImpactScore(consequence.impact);
      const riskScore = impactWeight * consequence.probability;
      totalRisk += riskScore;
      totalWeight += consequence.probability;
    }

    return totalWeight > 0 ? totalRisk / totalWeight : 0;
  }

  /**
   * 计算历史表现评分
   */
  private async calculateHistoricalScore(
    option: DecisionOption,
    decision: Decision
  ): Promise<number> {
    // 查找类似决策的历史记录
    const similarDecisions = this.decisionHistory.filter(
      d => d.type === decision.type && d.status === DecisionStatus.RESOLVED
    );

    if (similarDecisions.length === 0) {
      return 50; // 默认中性评分
    }

    // 分析类似选项的结果
    let successCount = 0;
    let totalCount = 0;

    for (const similarDecision of similarDecisions) {
      // 简化的相似度比较
      const similarity = this.calculateOptionSimilarity(option, similarDecision.selectedOption);

      if (similarity > 0.7) {
        totalCount++;
        // 这里可以根据实际结果判断成功与否
        successCount += 1; // 简化处理
      }
    }

    return totalCount > 0 ? (successCount / totalCount) * 100 : 50;
  }

  /**
   * 计算选项相似度
   */
  private calculateOptionSimilarity(option1: DecisionOption, option2?: DecisionOption): number {
    if (!option2) return 0;

    // 简化的相似度计算
    let similarity = 0;
    let factors = 0;

    // 标题相似度
    if (option1.title === option2.title) {
      similarity += 0.4;
    }
    factors += 0.4;

    // 影响程度相似度
    if (option1.impact === option2.impact) {
      similarity += 0.3;
    }
    factors += 0.3;

    // 后果类型相似度
    const consequences1 = option1.consequences.map(c => c.type).sort();
    const consequences2 = option2.consequences.map(c => c.type).sort();

    if (JSON.stringify(consequences1) === JSON.stringify(consequences2)) {
      similarity += 0.3;
    }
    factors += 0.3;

    return similarity;
  }

  /**
   * 计算合约状态评分
   */
  private calculateContractScore(option: DecisionOption, contract: SmartContract): number {
    let score = 50; // 基础分数

    // 根据合约完成率调整
    const completedTerms = contract.terms.filter(t => t.status === 'completed').length;
    const totalTerms = contract.terms.length;

    if (totalTerms > 0) {
      const completionRate = completedTerms / totalTerms;
      score += completionRate * 30;
    }

    // 根据争议数量调整
    const disputedTerms = contract.terms.filter(t => t.status === 'disputed').length;
    score -= disputedTerms * 10;

    // 根据协作方信誉调整
    const avgReputation = contract.parties.reduce(
      (sum, party) => sum + party.reputation, 0
    ) / contract.parties.length;

    score += (avgReputation - 50) * 0.2;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * 计算协作方兼容性评分
   */
  private async calculatePartyCompatibility(
    option: DecisionOption,
    contract: SmartContract
  ): Promise<number> {
    // 简化的兼容性评分
    let totalCompatibility = 0;
    let partyCount = 0;

    for (const party of contract.parties) {
      // 基于信誉的兼容性
      const reputationScore = party.reputation / 100;

      // 基于角色的兼容性
      const roleScore = this.calculateRoleCompatibility(option, party.role);

      // 基于活跃度的兼容性
      const activeScore = this.calculateActiveScore(party.lastActive);

      totalCompatibility += (reputationScore + roleScore + activeScore) / 3;
      partyCount++;
    }

    return partyCount > 0 ? (totalCompatibility / partyCount) * 100 : 50;
  }

  /**
   * 计算角色兼容性
   */
  private calculateRoleCompatibility(option: DecisionOption, role: string): number {
    // 根据不同角色对选项的影响程度评分
    const roleCompatibility = {
      'primary': 0.9,
      'secondary': 0.7,
      'observer': 0.5,
      'arbitrator': 0.8
    };

    return roleCompatibility[role as keyof typeof roleCompatibility] || 0.6;
  }

  /**
   * 计算活跃度评分
   */
  private calculateActiveScore(lastActive: Date): number {
    const now = new Date();
    const daysSinceLastActive = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceLastActive < 1) return 1.0;
    if (daysSinceLastActive < 7) return 0.8;
    if (daysSinceLastActive < 30) return 0.6;
    if (daysSinceLastActive < 90) return 0.4;
    return 0.2;
  }

  /**
   * 收集支持数据
   */
  private async gatherSupportingData(
    option: DecisionOption,
    decision: Decision,
    contract: SmartContract
  ): Promise<any[]> {
    const dataPoints = [];

    // 历史决策数据
    const historicalData = this.getHistoricalData(decision.type);
    if (historicalData.length > 0) {
      dataPoints.push({
        type: 'historical',
        data: historicalData,
        relevance: 0.8
      });
    }

    // 合约状态数据
    const contractData = this.getContractStateData(contract);
    dataPoints.push({
      type: 'contract_state',
      data: contractData,
      relevance: 0.9
    });

    // 协作方数据
    const partyData = this.getPartyData(contract.parties);
    dataPoints.push({
      type: 'party_data',
      data: partyData,
      relevance: 0.7
    });

    // 风险评估数据
    const riskData = await this.assessContextRisk(decision.context);
    dataPoints.push({
      type: 'risk_assessment',
      data: riskData,
      relevance: 0.85
    });

    return dataPoints;
  }

  /**
   * 获取历史数据
   */
  private getHistoricalData(decisionType: DecisionType): any[] {
    return this.decisionHistory
      .filter(d => d.type === decisionType && d.status === DecisionStatus.RESOLVED)
      .slice(-10); // 最近10个决策
  }

  /**
   * 获取合约状态数据
   */
  private getContractStateData(contract: SmartContract): any {
    return {
      completionRate: contract.terms.filter(t => t.status === 'completed').length / contract.terms.length,
      disputeCount: contract.terms.filter(t => t.status === 'disputed').length,
      partyCount: contract.parties.length,
      averageReputation: contract.parties.reduce((sum, p) => sum + p.reputation, 0) / contract.parties.length
    };
  }

  /**
   * 获取协作方数据
   */
  private getPartyData(parties: Party[]): any {
    return parties.map(party => ({
      role: party.role,
      reputation: party.reputation,
      daysSinceJoin: (new Date().getTime() - party.joinedAt.getTime()) / (1000 * 60 * 60 * 24),
      daysSinceLastActive: (new Date().getTime() - party.lastActive.getTime()) / (1000 * 60 * 60 * 24)
    }));
  }

  /**
   * 评估上下文风险
   */
  private async assessContextRisk(context: Record<string, any>): Promise<any> {
    // 简化的风险评估
    const riskFactors = [];

    // 检查时间压力
    if (context.deadline) {
      const now = new Date();
      const deadline = new Date(context.deadline);
      const daysUntilDeadline = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

      if (daysUntilDeadline < 1) {
        riskFactors.push({ type: 'time_pressure', level: RiskLevel.CRITICAL });
      } else if (daysUntilDeadline < 7) {
        riskFactors.push({ type: 'time_pressure', level: RiskLevel.HIGH });
      }
    }

    // 检查复杂度
    if (context.complexity === 'high') {
      riskFactors.push({ type: 'complexity', level: RiskLevel.HIGH });
    }

    return { riskFactors };
  }

  /**
   * 评估风险
   */
  private async assessRisk(decision: Decision, contract: SmartContract): Promise<RiskAssessment> {
    const riskFactors: RiskFactor[] = [];

    // 信誉风险
    const avgReputation = contract.parties.reduce((sum, p) => sum + p.reputation, 0) / contract.parties.length;
    if (avgReputation < 60) {
      riskFactors.push({
        type: 'reputation_risk',
        level: RiskLevel.HIGH,
        description: '协作方平均信誉较低',
        weight: 0.3
      });
    }

    // 时间风险
    const overdueTerms = contract.terms.filter(term => {
      if (term.type === 'timeline' && term.status !== 'completed') {
        const deadline = new Date(term.value.deadline);
        return deadline < new Date();
      }
      return false;
    });

    if (overdueTerms.length > 0) {
      riskFactors.push({
        type: 'timeline_risk',
        level: RiskLevel.MEDIUM,
        description: `${overdueTerms.length} 个时间条款已逾期`,
        weight: 0.25
      });
    }

    // 复杂性风险
    if (contract.terms.length > 20) {
      riskFactors.push({
        type: 'complexity_risk',
        level: RiskLevel.MEDIUM,
        description: '合约条款数量较多，管理复杂',
        weight: 0.2
      });
    }

    // 计算总体风险
    const overallRisk = this.calculateOverallRisk(riskFactors);

    // 生成缓解建议
    const mitigation = this.generateMitigationStrategies(riskFactors);

    return {
      overallRisk,
      riskFactors,
      mitigation
    };
  }

  /**
   * 计算总体风险
   */
  private calculateOverallRisk(riskFactors: RiskFactor[]): RiskLevel {
    if (riskFactors.length === 0) {
      return RiskLevel.LOW;
    }

    let totalRiskScore = 0;
    let totalWeight = 0;

    for (const factor of riskFactors) {
      const riskScore = this.getRiskLevelScore(factor.level);
      totalRiskScore += riskScore * factor.weight;
      totalWeight += factor.weight;
    }

    const averageRiskScore = totalWeight > 0 ? totalRiskScore / totalWeight : 0;

    if (averageRiskScore >= 0.8) return RiskLevel.CRITICAL;
    if (averageRiskScore >= 0.6) return RiskLevel.HIGH;
    if (averageRiskScore >= 0.4) return RiskLevel.MEDIUM;
    return RiskLevel.LOW;
  }

  /**
   * 获取风险等级评分
   */
  private getRiskLevelScore(level: RiskLevel): number {
    const scores = {
      [RiskLevel.LOW]: 0.2,
      [RiskLevel.MEDIUM]: 0.5,
      [RiskLevel.HIGH]: 0.8,
      [RiskLevel.CRITICAL]: 1.0
    };
    return scores[level];
  }

  /**
   * 生成缓解策略
   */
  private generateMitigationStrategies(riskFactors: RiskFactor[]): string[] {
    const strategies = [];

    for (const factor of riskFactors) {
      switch (factor.type) {
        case 'reputation_risk':
          strategies.push('增加额外的验证步骤');
          strategies.push('要求提供担保或保证金');
          break;
        case 'timeline_risk':
          strategies.push('重新评估时间安排');
          strategies.push('增加进度监控频率');
          break;
        case 'complexity_risk':
          strategies.push('分阶段执行');
          strategies.push('增加定期审查会议');
          break;
        default:
          strategies.push('持续监控相关指标');
      }
    }

    return [...new Set(strategies)]; // 去重
  }

  /**
   * 计算置信度
   */
  private calculateConfidence(
    bestOption: { option: DecisionOption; score: number; dataPoints: any[] },
    riskAssessment: RiskAssessment
  ): number {
    let confidence = bestOption.score / 100; // 基础置信度

    // 数据质量调整
    const dataQuality = bestOption.dataPoints.reduce(
      (sum, dp) => sum + dp.relevance, 0
    ) / bestOption.dataPoints.length;
    confidence *= dataQuality;

    // 风险调整
    const riskAdjustment = this.getRiskLevelScore(riskAssessment.overallRisk);
    confidence *= (1 - riskAdjustment * 0.3); // 风险对置信度的影响

    // 历史准确性调整（如果有历史数据）
    const historicalAccuracy = this.calculateHistoricalAccuracy();
    confidence *= (0.7 + historicalAccuracy * 0.3);

    return Math.min(1, Math.max(0, confidence));
  }

  /**
   * 计算历史准确性
   */
  private calculateHistoricalAccuracy(): number {
    // 简化的历史准确性计算
    const recentDecisions = this.decisionHistory.slice(-20);
    if (recentDecisions.length === 0) return 0.5;

    // 这里应该计算AI推荐的实际成功率
    // 简化处理，假设80%的准确性
    return 0.8;
  }

  /**
   * 生成推理说明
   */
  private async generateReasoning(
    decision: Decision,
    bestOption: { option: DecisionOption; score: number; dataPoints: any[] },
    riskAssessment: RiskAssessment
  ): Promise<string> {
    const reasons = [];

    // 基础理由
    reasons.push(`选项"${bestOption.option.title}"获得最高评分: ${bestOption.score.toFixed(1)}/100`);

    // 影响分析
    reasons.push(`该选项具有${bestOption.option.impact}程度的影响`);

    // 数据支持
    const strongDataPoints = bestOption.dataPoints.filter(dp => dp.relevance > 0.8);
    if (strongDataPoints.length > 0) {
      reasons.push(`获得${strongDataPoints.length}个强相关数据点支持`);
    }

    // 风险考虑
    if (riskAssessment.overallRisk !== RiskLevel.LOW) {
      reasons.push(`考虑到${riskAssessment.overallRisk}级别的整体风险`);
    }

    // 历史表现
    const similarDecisions = this.getHistoricalData(decision.type);
    if (similarDecisions.length > 0) {
      reasons.push(`基于${similarDecisions.length}个类似历史决策的分析`);
    }

    return reasons.join('；') + '。';
  }

  /**
   * 执行决策
   */
  private async executeDecision(decision: Decision, contract: SmartContract): Promise<void> {
    if (decision.selectedOption) {
      try {
        await decision.selectedOption.action();
        console.log(`决策 ${decision.id} 已自动执行`);
      } catch (error) {
        console.error(`自动执行决策 ${decision.id} 失败:`, error);
        // 将决策状态改为需要人工处理
        decision.status = DecisionStatus.ESCALATED;
      }
    }
  }

  /**
   * 获取决策历史
   */
  getDecisionHistory(contractId?: string, partyId?: string): Decision[] {
    let decisions = this.decisionHistory;

    if (contractId) {
      decisions = decisions.filter(d => d.context.contractId === contractId);
    }

    if (partyId) {
      decisions = decisions.filter(d => d.createdBy === partyId);
    }

    return decisions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * 更新模型权重
   */
  updateModelWeights(weights: Record<string, number>): void {
    for (const [key, weight] of Object.entries(weights)) {
      if (weight >= 0 && weight <= 1) {
        this.modelWeights.set(key, weight);
      }
    }
  }

  /**
   * 获取模型性能指标
   */
  getModelPerformance(): any {
    const recentDecisions = this.decisionHistory.slice(-50);

    return {
      totalDecisions: this.decisionHistory.length,
      recentDecisions: recentDecisions.length,
      autoDecisions: recentDecisions.filter(d => d.status === DecisionStatus.RESOLVED && !d.resolvedAt).length,
      escalatedDecisions: recentDecisions.filter(d => d.status === DecisionStatus.ESCALATED).length,
      averageConfidence: this.calculateAverageConfidence(recentDecisions),
      modelWeights: Object.fromEntries(this.modelWeights)
    };
  }

  /**
   * 计算平均置信度
   */
  private calculateAverageConfidence(decisions: Decision[]): number {
    const decisionsWithRecommendation = decisions.filter(d => d.aiRecommendation);

    if (decisionsWithRecommendation.length === 0) return 0;

    const totalConfidence = decisionsWithRecommendation.reduce(
      (sum, d) => sum + (d.aiRecommendation?.confidence || 0), 0
    );

    return totalConfidence / decisionsWithRecommendation.length;
  }
}