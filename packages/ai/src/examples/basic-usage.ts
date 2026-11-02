import { ContractManager } from '../core/ContractManager.js';
import { AIDecisionEngine } from '../ai/AIDecisionEngine.js';
import { ExecutionEngine } from '../automation/ExecutionEngine.js';
import {
  PartyRole,
  ContractCategory,
  TermType,
  ConditionType,
  LogicalOperator,
  DecisionType,
  DecisionTrigger,
  ExecutionType,
  ContractTerm,
  DecisionOption,
  ImpactLevel,
  RiskLevel
} from '../types/index.js';

/**
 * 基本使用示例
 */
async function basicUsageExample() {
  console.log('=== 智能协同合约基本使用示例 ===\n');

  // 1. 初始化核心组件
  const contractManager = new ContractManager();
  const aiDecisionEngine = new AIDecisionEngine();
  const executionEngine = new ExecutionEngine();

  // 2. 创建合约
  console.log('1. 创建服务协议合约...');
  const contract = await contractManager.createContract(
    '软件开发服务协议',
    '为甲公司提供定制化软件开发服务',
    ContractCategory.SERVICE_AGREEMENT,
    'party_a_id',
    PartyRole.PRIMARY,
    {
      totalValue: 100000,
      currency: 'CNY',
      jurisdiction: 'CN',
      tags: ['软件开发', '定制服务']
    }
  );

  console.log(`合约创建成功: ${contract.id}`);
  console.log(`合约名称: ${contract.name}`);
  console.log(`合约状态: ${contract.status}\n`);

  // 3. 添加协作方
  console.log('2. 添加协作方...');
  await contractManager.addPartyToContract(
    contract.id,
    {
      id: 'party_b_id',
      name: '乙科技公司',
      role: PartyRole.SECONDARY,
      address: 'tech-company@example.com',
      reputation: 85
    },
    'party_a_id'
  );

  await contractManager.addPartyToContract(
    contract.id,
    {
      id: 'arbitrator_id',
      name: '中立方仲裁',
      role: PartyRole.ARBITRATOR,
      address: 'arbitrator@example.com',
      reputation: 95
    },
    'party_a_id'
  );

  const updatedContract = contractManager.getContract(contract.id);
  console.log(`协作方数量: ${updatedContract.parties.length}`);
  console.log(`协作方: ${updatedContract.parties.map(p => p.name).join(', ')}\n`);

  // 4. 添加条款
  console.log('3. 添加合约条款...');

  // 项目交付条款
  const deliveryTerm: Omit<ContractTerm, 'id' | 'createdAt' | 'updatedAt'> = {
    title: '项目第一阶段交付',
    description: '完成核心功能模块开发和测试',
    type: TermType.DELIVERABLE,
    conditions: [
      {
        id: 'cond_1',
        description: '在截止日期前完成开发',
        type: ConditionType.DEADLINE,
        parameters: { deadline: '2024-03-01T23:59:59Z' },
        operator: LogicalOperator.AND,
        expectedOutcome: true,
        verified: false
      },
      {
        id: 'cond_2',
        description: '通过质量检查',
        type: ConditionType.APPROVAL,
        parameters: { requiredApprovals: 2 },
        operator: LogicalOperator.AND,
        expectedOutcome: true,
        verified: false
      }
    ],
    value: {
      deliverables: ['用户管理模块', '数据分析模块', 'API接口'],
      qualityStandards: ['代码覆盖率>80%', '性能响应<2s']
    },
    priority: 8,
    status: 'pending'
  };

  await contractManager.addTermToContract(contract.id, deliveryTerm, 'party_a_id');

  // 付款条款
  const paymentTerm: Omit<ContractTerm, 'id' | 'createdAt' | 'updatedAt'> = {
    title: '首期付款',
    description: '项目启动后支付30%款项',
    type: TermType.PAYMENT,
    conditions: [
      {
        id: 'cond_3',
        description: '项目正式启动',
        type: ConditionType.MILESTONE,
        parameters: { milestoneId: 'project_start' },
        operator: LogicalOperator.AND,
        expectedOutcome: true,
        verified: false
      }
    ],
    value: {
      amount: 30000,
      currency: 'CNY',
      percentage: 30,
      paymentMethod: 'bank_transfer'
    },
    priority: 7,
    status: 'pending'
  };

  await contractManager.addTermToContract(contract.id, paymentTerm, 'party_a_id');

  const contractWithTerms = contractManager.getContract(contract.id);
  console.log(`条款数量: ${contractWithTerms.terms.length}`);
  console.log(`条款类型: ${contractWithTerms.terms.map(t => t.type).join(', ')}\n`);

  // 5. 签署合约
  console.log('4. 签署合约...');
  await contractManager.signContract(
    contract.id,
    'party_a_id',
    'signature_a_hash_12345'
  );

  await contractManager.signContract(
    contract.id,
    'party_b_id',
    'signature_b_hash_67890'
  );

  const signedContract = contractManager.getContract(contract.id);
  console.log(`合约状态: ${signedContract.status}`);
  console.log(`签署方数量: ${signedContract.parties.filter(p => p.signature).length}\n`);

  // 6. 启动自动化监控
  console.log('5. 启动自动化监控...');
  executionEngine.startMonitoring(signedContract);

  // 7. 创建AI辅助决策
  console.log('6. 创建AI辅助决策...');

  const decisionOptions: DecisionOption[] = [
    {
      id: 'option_1',
      title: '继续按原计划执行',
      description: '维持当前项目计划和截止时间',
      consequences: [
        {
          type: 'financial',
          description: '可能产生延期费用',
          impact: ImpactLevel.LOW,
          probability: 0.3,
          affectedParties: ['party_a_id', 'party_b_id']
        }
      ],
      probability: 0.7,
      impact: ImpactLevel.MODERATE,
      action: async () => {
        console.log('执行方案1: 继续按原计划执行');
      }
    },
    {
      id: 'option_2',
      title: '调整项目时间表',
      description: '延长截止时间，重新安排资源',
      consequences: [
        {
          type: 'financial',
          description: '增加项目成本15%',
          impact: ImpactLevel.MODERATE,
          probability: 1.0,
          affectedParties: ['party_a_id']
        }
      ],
      probability: 0.9,
      impact: ImpactLevel.HIGH,
      action: async () => {
        console.log('执行方案2: 调整项目时间表');
      }
    }
  ];

  const decision = await aiDecisionEngine.createDecision(
    DecisionType.DEADLINE_EXTENSION,
    DecisionTrigger.EXCEPTION,
    {
      contractId: contract.id,
      reason: '开发进度延迟',
      currentProgress: 0.6,
      timeRemaining: 15
    },
    decisionOptions,
    signedContract,
    'system'
  );

  console.log(`决策创建成功: ${decision.id}`);
  console.log(`AI推荐: ${decision.aiRecommendation?.recommendedOption}`);
  console.log(`置信度: ${decision.aiRecommendation?.confidence?.toFixed(2)}`);
  console.log(`决策状态: ${decision.status}\n`);

  // 8. 触发自动执行
  console.log('7. 触发自动执行...');

  // 自动支付执行
  const paymentExecution = await executionEngine.triggerExecution(
    contract.id,
    paymentTerm.id as string,
    ExecutionType.AUTOMATED_PAYMENT,
    'system',
    {
      recipient: 'party_b_id',
      amount: 30000,
      currency: 'CNY',
      paymentMethod: 'bank_transfer'
    }
  );

  console.log(`支付执行事件: ${paymentExecution.id}`);
  console.log(`执行状态: ${paymentExecution.status}`);

  // 9. 查看执行历史
  console.log('\n8. 执行历史统计:');
  const stats = executionEngine.getExecutionStats(contract.id);
  console.log(`总执行次数: ${stats.total}`);
  console.log(`成功率: ${stats.successRate.toFixed(1)}%`);
  console.log(`平均执行时间: ${stats.avgExecutionTime.toFixed(0)}ms`);

  // 10. 查看审计日志
  console.log('\n9. 审计日志:');
  const auditLogs = contractManager.getAuditLogs(contract.id);
  console.log(`总审计记录: ${auditLogs.length}`);
  auditLogs.slice(0, 3).forEach(log => {
    console.log(`- ${log.action} by ${log.actor} at ${log.timestamp.toLocaleString()}`);
  });

  // 11. 获取决策历史
  console.log('\n10. AI决策历史:');
  const decisions = aiDecisionEngine.getDecisionHistory(contract.id);
  console.log(`决策总数: ${decisions.length}`);
  decisions.forEach(decision => {
    console.log(`- ${decision.type}: ${decision.status} at ${decision.createdAt.toLocaleString()}`);
  });

  // 清理
  setTimeout(() => {
    executionEngine.stopMonitoring(contract.id);
    console.log('\n=== 示例执行完成 ===');
  }, 5000);
}

/**
 * 高级功能示例
 */
async function advancedFeaturesExample() {
  console.log('\n=== 高级功能示例 ===\n');

  const contractManager = new ContractManager();
  const aiDecisionEngine = new AIDecisionEngine();
  const executionEngine = new ExecutionEngine();

  // 创建复杂的供应链合约
  const contract = await contractManager.createContract(
    '智能供应链协同协议',
    '基于AI的供应链多方协同管理协议',
    ContractCategory.JOINT_VENTURE,
    'manufacturer_id',
    PartyRole.PRIMARY,
    {
      totalValue: 500000,
      currency: 'CNY',
      tags: ['供应链', '智能制造', '多方协同']
    }
  );

  // 添加多方协作
  const parties = [
    { id: 'supplier_id', name: '原材料供应商', role: PartyRole.SECONDARY, reputation: 88 },
    { id: 'logistics_id', name: '物流服务商', role: PartyRole.SECONDARY, reputation: 82 },
    { id: 'retailer_id', name: '零售商', role: PartyRole.SECONDARY, reputation: 90 },
    { id: 'quality_id', name: '质检机构', role: PartyRole.ARBITRATOR, reputation: 95 }
  ];

  for (const party of parties) {
    await contractManager.addPartyToContract(
      contract.id,
      { ...party, address: `${party.id}@example.com` },
      'manufacturer_id'
    );
  }

  // 添加复杂的供应链条款
  const supplyChainTerms = [
    {
      title: '原材料供应',
      type: TermType.DELIVERABLE,
      conditions: [
        {
          type: ConditionType.THRESHOLD,
          parameters: { metric: 'quality_score', threshold: 95, operator: 'greater_than' },
          expectedOutcome: true
        },
        {
          type: ConditionType.DEADLINE,
          parameters: { deadline: '2024-02-15T00:00:00Z' },
          expectedOutcome: true
        }
      ],
      value: { materials: ['钢材', '电子元件', '包装材料'], quantity: 1000 },
      priority: 9
    },
    {
      title: '物流配送',
      type: TermType.TIMELINE,
      conditions: [
        {
          type: ConditionType.AUTOMATED,
          parameters: {
            checkType: 'external_api',
            apiUrl: 'https://api.logistics.com/tracking/12345',
            expectedResponse: { status: 'delivered' }
          },
          expectedOutcome: true
        }
      ],
      value: { deliveryTime: 48, routes: ['A-B-C'], temperatureControl: true },
      priority: 8
    }
  ];

  for (const termData of supplyChainTerms) {
    await contractManager.addTermToContract(contract.id, {
      ...termData,
      description: `${termData.title}相关条款`,
      conditions: termData.conditions.map((cond, index) => ({
        id: `supply_${termData.title}_${index}`,
        description: `${termData.title}条件${index + 1}`,
        type: cond.type,
        parameters: cond.parameters,
        operator: LogicalOperator.AND,
        expectedOutcome: cond.expectedOutcome,
        verified: false
      })),
      status: 'pending'
    }, 'manufacturer_id');
  }

  // 签署所有方
  const allPartyIds = ['manufacturer_id', ...parties.map(p => p.id)];
  for (const partyId of allPartyIds) {
    await contractManager.signContract(
      contract.id,
      partyId,
      `signature_${partyId}_hash`
    );
  }

  console.log(`供应链合约创建完成，包含 ${allPartyIds.length} 个协作方`);

  // 注册webhook回调
  executionEngine.registerWebhookCallback(
    ExecutionType.AUTOMATED_PAYMENT,
    (event) => {
      console.log(`💰 支付回调: ${event.id} - ${event.status}`);
    }
  );

  executionEngine.registerWebhookCallback(
    ExecutionType.DOCUMENT_VERIFICATION,
    (event) => {
      console.log(`📋 验证回调: ${event.id} - ${event.status}`);
    }
  );

  // 启动监控
  executionEngine.startMonitoring(contract);

  console.log('高级功能示例执行完成');
}

// 运行示例
if (import.meta.main) {
  await basicUsageExample();
  await advancedFeaturesExample();
}

export { basicUsageExample, advancedFeaturesExample };