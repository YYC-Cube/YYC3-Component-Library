import { IntelligentCollaborationContract } from '../index.js';

/**
 * 多Claude协作使用示例
 */
async function multiClaudeExample() {
  console.log('=== 多Claude协作示例 ===\n');

  // 1. 启用多Claude模式的合约系统
  const icc = new IntelligentCollaborationContract(undefined, true); // 启用多Claude
  await icc.start();

  // 2. 获取Claude协调器
  const coordinator = await icc.getClaudeCoordinator();

  // 3. 注册不同角色的Claude实例
  console.log('🤖 注册Claude实例...');

  const primaryClaude = coordinator.registerClaude(
    'Claude-Primary',
    'primary' as any,
    ['contract_management', 'decision_making', 'coordination'],
    { description: '主要Claude，负责核心决策和协调' }
  );

  const riskSpecialist = coordinator.registerClaude(
    'Claude-RiskExpert',
    'specialist' as any,
    ['risk_assessment', 'financial_analysis', 'compliance'],
    { description: '风险评估专家Claude' }
  );

  const qualitySpecialist = coordinator.registerClaude(
    'Claude-QualityExpert',
    'specialist' as any,
    ['quality_control', 'testing', 'documentation'],
    { description: '质量控制专家Claude' }
  );

  const monitorClaude = coordinator.registerClaude(
    'Claude-Monitor',
    'monitor' as any,
    ['monitoring', 'alerting', 'reporting'],
    { description: '监控和报告Claude' }
  );

  console.log(`✅ 已注册 ${4} 个Claude实例`);

  // 4. 创建合约
  console.log('\n📋 创建复杂合约...');
  const contractManager = icc.getContractManager();

  const contract = await contractManager.createContract(
    '多方研发合作协议',
    '涉及多方协作的复杂研发项目',
    'joint_venture' as any,
    'company_a_id',
    'primary' as any,
    {
      totalValue: 1000000,
      currency: 'CNY',
      tags: ['研发', 'AI', '多方协作'],
      complexity: 'high'
    }
  );

  // 添加协作方
  await contractManager.addPartyToContract(contract.id, {
    id: 'company_b_id',
    name: '科技研发公司B',
    role: 'secondary' as any,
    address: 'tech-b@example.com',
    reputation: 88
  }, 'company_a_id');

  await contractManager.addPartyToContract(contract.id, {
    id: 'quality_org_id',
    name: '第三方质检机构',
    role: 'arbitrator' as any,
    address: 'quality@example.com',
    reputation: 95
  }, 'company_a_id');

  console.log(`合约创建成功: ${contract.id}`);

  // 5. 分配不同类型的任务给合适的Claude

  // 风险评估任务 - 分配给风险专家
  console.log('\n⚠️ 分配风险评估任务...');
  const riskTask = await coordinator.assignTask({
    type: 'risk_assessment',
    description: '对合作协议进行全面风险评估',
    priority: 'high',
    contractId: contract.id,
    category: 'risk_assessment',
    data: {
      contractValue: 1000000,
      parties: 3,
      complexity: 'high',
      duration: '12个月'
    }
  });

  console.log(`✅ 风险评估任务已分配: ${riskTask.claudeName}`);

  // 质量控制任务 - 分配给质量专家
  console.log('\n🔍 分配质量控制任务...');
  const qualityTask = await coordinator.assignTask({
    type: 'quality_control',
    description: '制定质量标准和验收流程',
    priority: 'medium',
    contractId: contract.id,
    category: 'quality_control',
    data: {
      projectType: 'software_development',
      standards: ['ISO9001', 'CMMI'],
      deliverables: ['源代码', '文档', '测试报告']
    }
  });

  console.log(`✅ 质量控制任务已分配: ${qualityTask.claudeName}`);

  // 监控设置任务 - 分配给监控Claude
  console.log('\n📊 分配监控设置任务...');
  const monitorTask = await coordinator.assignTask({
    type: 'monitoring_setup',
    description: '设置项目监控和报告系统',
    priority: 'medium',
    contractId: contract.id,
    category: 'monitoring',
    data: {
      metrics: ['progress', 'quality', 'budget', 'timeline'],
      frequency: 'daily',
      alerts: true
    }
  });

  console.log(`✅ 监控设置任务已分配: ${monitorTask.claudeName}`);

  // 重要决策任务 - 需要共识
  console.log('\n🤔 分配重要决策任务...');
  const decisionTask = await coordinator.assignTask({
    type: 'critical_decision',
    description: '确定项目里程碑和付款节点',
    priority: 'urgent',
    contractId: contract.id,
    category: 'decision_making',
    data: {
      totalBudget: 1000000,
      expectedDuration: 12,
      milestones: 6
    }
  });

  console.log(`✅ 重要决策任务已分配: ${decisionTask.claudeName} (需要共识)`);

  // 6. 模拟任务完成
  console.log('\n⏳ 模拟任务执行和完成...');

  // 模拟风险评估完成
  setTimeout(async () => {
    await coordinator.completeTask(
      riskTask.taskId,
      {
        riskLevel: 'medium',
        riskFactors: ['技术风险', '市场风险', '合规风险'],
        recommendations: ['增加技术评审', '设置应急资金', '定期合规检查'],
        confidence: 0.85
      },
      riskTask.sessionId!,
      true
    );
    console.log('✅ 风险评估任务完成');
  }, 2000);

  // 模拟质量控制完成
  setTimeout(async () => {
    await coordinator.completeTask(
      qualityTask.taskId,
      {
        qualityStandards: ['代码覆盖率>80%', '文档完整度>90%', '用户满意度>85%'],
        testingProcess: ['单元测试', '集成测试', '用户验收测试'],
        acceptanceCriteria: 15,
        confidence: 0.92
      },
      qualityTask.sessionId!,
      true
    );
    console.log('✅ 质量控制任务完成');
  }, 3000);

  // 模拟监控设置完成
  setTimeout(async () => {
    await coordinator.completeTask(
      monitorTask.taskId,
      {
        monitoringDashboard: 'configured',
        alertRules: ['进度延迟', '预算超支', '质量下降'],
        reportSchedule: 'weekly',
        metrics: 12,
        confidence: 0.88
      },
      monitorTask.sessionId!,
      true
    );
    console.log('✅ 监控设置任务完成');
  }, 4000);

  // 模拟重要决策完成（需要共识）
  setTimeout(async () => {
    await coordinator.completeTask(
      decisionTask.taskId,
      {
        milestones: [
          { phase: '需求分析', payment: 15, duration: 2 },
          { phase: '设计开发', payment: 35, duration: 4 },
          { phase: '测试验收', payment: 25, duration: 3 },
          { phase: '部署上线', payment: 25, duration: 3 }
        ],
        consensusScore: 0.91,
        participants: 3,
        confidence: 0.87
      },
      decisionTask.sessionId!,
      true
    );
    console.log('✅ 重要决策任务完成（含共识）');
  }, 5000);

  // 7. 监控系统状态
  console.log('\n📈 Claude实例状态监控...');

  const statusInterval = setInterval(() => {
    const claudeStatus = coordinator.getClaudeStatus();
    console.log('Claude实例状态:', {
      总实例数: claudeStatus.totalSessions,
      活跃实例: claudeStatus.sessions.filter((s: any) => s.status === 'active').length,
      总任务数: claudeStatus.sessions.reduce((sum: number, s: any) => sum + s.currentTasks, 0)
    });
  }, 1000);

  // 8. 生成协作报告
  setTimeout(async () => {
    console.log('\n📊 生成协作报告...');
    const collaborationReport = coordinator.generateCollaborationReport();

    console.log('协作统计:');
    console.log(`- 总Claude实例: ${collaborationReport.stats.totalClaudeInstances}`);
    console.log(`- 总任务数: ${collaborationReport.stats.totalTasks}`);
    console.log(`- 完成任务: ${collaborationReport.stats.tasksByStatus.completed}`);
    console.log(`- 平均响应时间: ${(collaborationReport.stats.averageResponseTime / 1000).toFixed(2)}秒`);
    console.log(`- 共识决策数: ${collaborationReport.stats.consensusDecisions}`);

    if (collaborationReport.recommendations.length > 0) {
      console.log('\n💡 系统建议:');
      collaborationReport.recommendations.forEach((rec: string, index: number) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }

    clearInterval(statusInterval);

    // 9. 导出数据
    console.log('\n💾 导出协作数据...');
    const exportData = coordinator.exportCollaborationData();
    console.log('数据导出完成，大小:', exportData.length, '字符');

  }, 6000);

  // 10. 模拟故障处理
  setTimeout(async () => {
    console.log('\n🚨 模拟Claude实例故障...');

    // 模拟风险专家Claude故障
    await coordinator.handleClaudeFailure(
      riskSpecialist,
      '连接超时'
    );

    console.log('故障处理完成，任务已重新分配');

    // 查看故障后的状态
    const finalStatus = coordinator.getClaudeStatus();
    console.log('故障后状态:', finalStatus.sessions.map((s: any) => ({
      name: s.name,
      status: s.status,
      tasks: s.currentTasks
    })));

  }, 7000);
}

/**
 * 多Claude工作流示例
 */
async function multiClaudeWorkflowExample() {
  console.log('\n=== 多Claude工作流示例 ===\n');

  const icc = new IntelligentCollaborationContract(undefined, true);
  await icc.start();

  const coordinator = await icc.getClaudeCoordinator();

  // 注册专业Claude团队
  const teamMembers = [
    { name: 'Claude-PM', role: 'primary' as any, skills: ['project_management', 'coordination'] },
    { name: 'Claude-Dev', role: 'specialist' as any, skills: ['development', 'coding'] },
    { name: 'Claude-QA', role: 'specialist' as any, skills: ['testing', 'quality_assurance'] },
    { name: 'Claude-Architect', role: 'specialist' as any, skills: ['architecture', 'design'] },
    { name: 'Claude-Ops', role: 'monitor' as any, skills: ['deployment', 'monitoring'] }
  ];

  const sessionIds = teamMembers.map(member =>
    coordinator.registerClaude(member.name, member.role, member.skills)
  );

  console.log(`👥 开发团队组建完成: ${sessionIds.length} 个成员`);

  // 创建复杂项目工作流
  const contractManager = icc.getContractManager();
  const project = await contractManager.createContract(
    'AI产品开发项目',
    '从设计到部署的完整AI产品开发',
    'service_agreement' as any,
    'client_id',
    'primary' as any
  );

  console.log(`🚀 项目启动: ${project.id}`);

  // 工作流任务序列
  const workflow = [
    {
      name: '需求分析',
      category: 'analysis',
      assignee: 'Claude-PM',
      dependencies: []
    },
    {
      name: '系统设计',
      category: 'design',
      assignee: 'Claude-Architect',
      dependencies: ['需求分析']
    },
    {
      name: '开发实现',
      category: 'development',
      assignee: 'Claude-Dev',
      dependencies: ['系统设计']
    },
    {
      name: '质量测试',
      category: 'testing',
      assignee: 'Claude-QA',
      dependencies: ['开发实现']
    },
    {
      name: '部署监控',
      category: 'deployment',
      assignee: 'Claude-Ops',
      dependencies: ['质量测试']
    }
  ];

  // 执行工作流
  console.log('\n🔄 开始工作流执行...');

  for (let i = 0; i < workflow.length; i++) {
    const step = workflow[i];

    // 等待依赖完成（简化处理）
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`📝 执行步骤: ${step.name} -> ${step.assignee}`);

    const task = await coordinator.assignTask({
      type: 'workflow_step',
      description: `执行${step.name}`,
      priority: 'high',
      contractId: project.id,
      category: step.category,
      data: {
        workflowStep: i + 1,
        totalSteps: workflow.length,
        dependencies: step.dependencies
      }
    });

    // 模拟任务执行
    setTimeout(() => {
      coordinator.completeTask(
        task.taskId,
        {
          stepCompleted: step.name,
          output: `${step.name}完成`,
          nextSteps: workflow.slice(i + 1).map(s => s.name),
          quality: 'excellent'
        },
        task.sessionId!,
        true
      );
      console.log(`✅ ${step.name} 完成`);
    }, (i + 1) * 800);
  }

  // 等待工作流完成
  setTimeout(() => {
    console.log('\n🎉 工作流执行完成！');

    const finalStats = coordinator.getCollaborationStats();
    console.log('最终统计:', {
      总任务: finalStats.totalTasks,
      完成任务: finalStats.tasksByStatus.completed,
      成功率: ((finalStats.tasksByStatus.completed / finalStats.totalTasks) * 100).toFixed(1) + '%',
      平均响应时间: (finalStats.averageResponseTime / 1000).toFixed(2) + '秒'
    });
  }, 6000);
}

// 运行示例
if (import.meta.main) {
  await multiClaudeExample();
  await multiClaudeWorkflowExample();
}

export { multiClaudeExample, multiClaudeWorkflowExample };