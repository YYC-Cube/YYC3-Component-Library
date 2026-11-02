import { IntelligentCollaborationContract } from '../index.js';
import { ClaudePersonaManager } from '../multi-claude/ClaudePersonaManager.js';

/**
 * 完整的多Claude智能协作演示
 */
async function completeMultiClaudeDemo() {
  console.log('🎭 === 智能协同合约系统 - 多Claude完整演示 === 🎭\n');

  // 1. 初始化系统并启用多Claude协作
  console.log('🚀 初始化智能协作系统...');
  const icc = new IntelligentCollaborationContract(undefined, true);
  await icc.start();

  // 2. 设置拟人化管理器
  console.log('\n👥 配置拟人化团队...');
  const personaManager = new ClaudePersonaManager();

  // 创建专业团队
  const teamMembers = [
    { template: 'leader_zhang', nickname: '张老师' },
    { template: 'expert_li', nickname: '李博士' },
    { template: 'creative_wang', nickname: '创意王' },
    { template: 'guardian_chen', nickname: '陈师傅' },
    { template: 'analyst_zhao', nickname: '数据赵' }
  ];

  const personas = teamMembers.map(member => {
    const persona = personaManager.createPersona(member.template);
    console.log(`  🎭 ${member.nickname}: ${persona.description} ${persona.avatar}`);
    return { ...member, persona };
  });

  // 3. 注册Claude实例到协调器
  console.log('\n🤝 注册Claude协作团队...');
  const coordinator = await icc.getClaudeCoordinator();

  const registeredClaudes = personas.map(member => {
    const sessionId = coordinator.registerClaude(
      member.nickname,
      member.persona.role as any,
      member.persona.personality.expertise,
      { personaId: member.persona.id }
    );
    console.log(`  ✅ ${member.nickname} 已注册 (${sessionId})`);
    return { ...member, sessionId };
  });

  // 4. 创建复杂项目合约
  console.log('\n📋 创建智能产品开发合约...');
  const contractManager = icc.getContractManager();

  const contract = await contractManager.createContract(
    'AI智能助手研发项目',
    '开发具备多模态交互能力的智能助手系统',
    'joint_venture' as any,
    'client_tech_company',
    'primary' as any,
    {
      totalValue: 2000000,
      currency: 'CNY',
      tags: ['AI', '软件开发', '多方协作'],
      complexity: 'very_high',
      duration: '18个月'
    }
  );

  // 添加多个协作方
  const partners = [
    { id: 'ai_research_lab', name: 'AI研究实验室', role: 'secondary' as any, reputation: 92 },
    { id: 'design_studio', name: '创意设计工作室', role: 'secondary' as any, reputation: 88 },
    { id: 'quality_institute', name: '质量认证机构', role: 'arbitrator' as any, reputation: 96 }
  ];

  for (const partner of partners) {
    await contractManager.addPartyToContract(contract.id, {
      ...partner,
      address: `${partner.id}@example.com`
    }, 'client_tech_company');
  }

  console.log(`  📄 合约创建成功: ${contract.id}`);
  console.log(`  👥 协作方数量: ${1 + partners.length}`);

  // 5. 项目工作流任务分配
  console.log('\n🔄 开始项目工作流任务分配...');

  const projectWorkflow = [
    {
      phase: '项目规划',
      tasks: [
        {
          name: '需求分析和项目规划',
          type: 'project_planning',
          category: 'project_management',
          priority: 'urgent',
          expert: '张老师',
          description: '制定详细的项目计划和需求规格'
        },
        {
          name: '技术架构设计',
          type: 'architecture_design',
          category: 'technical_analysis',
          priority: 'high',
          expert: '李博士',
          description: '设计AI系统的技术架构'
        },
        {
          name: '用户体验设计',
          type: 'ux_design',
          category: 'creative_design',
          priority: 'high',
          expert: '创意王',
          description: '设计用户交互界面和体验流程'
        }
      ]
    },
    {
      phase: '开发实施',
      tasks: [
        {
          name: '核心AI模块开发',
          type: 'ai_development',
          category: 'technical_analysis',
          priority: 'urgent',
          expert: '李博士',
          description: '开发AI核心算法和模型'
        },
        {
          name: '界面设计和实现',
          type: 'ui_implementation',
          category: 'creative_design',
          priority: 'high',
          expert: '创意王',
          description: '实现用户界面设计'
        }
      ]
    },
    {
      phase: '质量保证',
      tasks: [
        {
          name: '系统性能测试',
          type: 'performance_testing',
          category: 'quality_control',
          priority: 'high',
          expert: '陈师傅',
          description: '全面测试系统性能和稳定性'
        },
        {
          name: '用户体验测试',
          type: 'ux_testing',
          category: 'quality_control',
          priority: 'medium',
          expert: '陈师傅',
          description: '测试用户体验和易用性'
        }
      ]
    },
    {
      phase: '数据分析',
      tasks: [
        {
          name: '项目数据分析',
          type: 'project_analytics',
          category: 'data_analysis',
          priority: 'medium',
          expert: '数据赵',
          description: '分析项目数据和绩效指标'
        },
        {
          name: '质量指标评估',
          type: 'quality_metrics',
          category: 'data_analysis',
          priority: 'medium',
          expert: '数据赵',
          description: '评估质量指标和改进建议'
        }
      ]
    }
  ];

  // 依次分配和执行工作流
  let taskIndex = 0;
  for (const phase of projectWorkflow) {
    console.log(`\n📅 ${phase.phase}阶段:`);

    for (const task of phase.tasks) {
      const assignedClaude = registeredClaudes.find(c => c.nickname === task.expert);

      if (assignedClaude) {
        // 分配任务
        const taskAssignment = await coordinator.assignTask({
          type: task.type,
          description: task.description,
          priority: task.priority as any,
          contractId: contract.id,
          category: task.category,
          data: {
            phase: phase.phase,
            workflowPosition: ++taskIndex,
            totalTasks: projectWorkflow.reduce((sum, p) => sum + p.tasks.length, 0),
            dependencies: []
          }
        });

        console.log(`  📝 ${task.name}`);
        console.log(`     👤 执行者: ${task.expert} ${assignedClaude.persona.avatar}`);
        console.log(`     🎯 任务ID: ${taskAssignment.taskId}`);

        // 模拟任务执行和完成
        setTimeout(() => {
          const mockResult = {
            taskName: task.name,
            completedAt: new Date(),
            quality: Math.random() > 0.2 ? 'excellent' : 'good',
            deliverables: generateMockDeliverables(task.type),
            nextSteps: getNextPhaseTasks(phase.phase, projectWorkflow),
            confidence: 0.85 + Math.random() * 0.14
          };

          coordinator.completeTask(
            taskAssignment.taskId,
            mockResult,
            taskAssignment.sessionId!,
            true
          );

          console.log(`     ✅ 完成: ${task.name} (${mockResult.quality})`);
        }, taskIndex * 800);
      }
    }
  }

  // 6. 实时监控和状态报告
  console.log('\n📊 启动实时监控...');

  const monitoringInterval = setInterval(() => {
    const claudeStatus = coordinator.getClaudeStatus();
    const stats = coordinator.getCollaborationStats();

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`⏰ ${new Date().toLocaleTimeString()} - 实时状态报告`);
    console.log(`🤖 Claude实例: ${claudeStatus.totalSessions} 个活跃`);
    console.log(`📋 进行中任务: ${claudeStatus.sessions.reduce((sum: number, s: any) => sum + s.currentTasks, 0)} 个`);
    console.log(`📈 完成任务: ${stats.tasksByStatus.completed || 0} 个`);
    console.log(`⚡ 平均响应时间: ${(stats.averageResponseTime / 1000).toFixed(2)}秒`);

    // 显示各Claude工作状态
    claudeStatus.sessions.forEach((claude: any) => {
      const persona = personas.find(p => p.nickname === claude.name);
      const status = claude.currentTasks > 0 ? '🟡 工作中' : '🟢 空闲';
      console.log(`  ${claude.name} ${persona?.persona.avatar || ''} ${status} (${claude.currentTasks} 任务)`);
    });
  }, 2000);

  // 7. 模拟故障和自动恢复
  setTimeout(async () => {
    console.log('\n🚨 模拟Claude实例故障...');
    const liBoshiSession = registeredClaudes.find(c => c.nickname === '李博士');

    if (liBoshiSession) {
      await coordinator.handleClaudeFailure(
        liBoshiSession.sessionId,
        '网络连接超时'
      );

      console.log('🔄 系统自动故障恢复完成');
      console.log('📋 受影响任务已重新分配');
    }
  }, 10000);

  // 8. 生成最终报告
  setTimeout(async () => {
    clearInterval(monitoringInterval);

    console.log('\n📊 === 项目完成总结报告 === 📊');

    // 协作统计
    const finalStats = coordinator.getCollaborationStats();
    console.log('\n🤖 Claude协作统计:');
    console.log(`  • 参与Claude实例: ${finalStats.totalClaudeInstances}`);
    console.log(`  • 总任务数量: ${finalStats.totalTasks}`);
    console.log(`  • 完成任务数量: ${finalStats.tasksByStatus.completed || 0}`);
    console.log(`  • 任务成功率: ${finalStats.totalTasks > 0 ? ((finalStats.tasksByStatus.completed || 0) / finalStats.totalTasks * 100).toFixed(1) : 0}%`);
    console.log(`  • 平均响应时间: ${(finalStats.averageResponseTime / 1000).toFixed(2)}秒`);
    console.log(`  • 共识决策数量: ${finalStats.consensusDecisions}`);

    // 拟人化使用统计
    const usageStats = personaManager.getUsageStats();
    console.log('\n👥 拟人化团队表现:');
    personas.forEach(member => {
      const usage = usageStats.usageByRole[member.persona.role] || 0;
      const performance = usage > 0 ? '🌟🌟🌟🌟🌟' : '🌟🌟🌟';
      console.log(`  • ${member.nickname} ${member.persona.avatar}: ${performance} (${usage} 次任务)`);
    });

    // 生成协作报告
    const collaborationReport = coordinator.generateCollaborationReport();
    if (collaborationReport.recommendations.length > 0) {
      console.log('\n💡 系统优化建议:');
      collaborationReport.recommendations.forEach((rec: string, index: number) => {
        console.log(`  ${index + 1}. ${rec}`);
      });
    }

    // 团队动态分析
    const teamConfig = personaManager.generateTeamConfiguration(personas.length);
    console.log('\n🎭 团队动态分析:');
    console.log(`  • 团队多样性得分: ${teamConfig.teamDynamics.diversityScore}/10`);
    console.log(`  • 专业能力覆盖: ${teamConfig.teamDynamics.expertiseCoverage} 个领域`);
    console.log(`  • 协作风格: ${teamConfig.teamDynamics.collaborationStyle}`);
    console.log(`  • 团队优势: ${teamConfig.teamDynamics.strengths.join(', ')}`);

    console.log('\n🎉 === 智能协同合约系统演示完成 === 🎉');

    // 导出完整数据
    console.log('\n💾 导出项目数据...');
    const exportData = {
      contract: contractManager.exportContract(contract.id),
      collaboration: coordinator.exportCollaborationData(),
      personas: personaManager.exportPersonaData(),
      completedAt: new Date()
    };

    console.log(`📁 数据导出完成，总大小: ${JSON.stringify(exportData).length} 字符`);

  }, 12000);

  // 等待所有任务完成
  await new Promise(resolve => setTimeout(resolve, 15000));
}

// 辅助函数：生成模拟交付物
function generateMockDeliverables(taskType: string): string[] {
  const deliverablesMap: Record<string, string[]> = {
    'project_planning': ['项目计划书', '需求规格说明书', '里程碑计划'],
    'architecture_design': ['系统架构图', '技术选型报告', '接口设计文档'],
    'ux_design': ['UI设计稿', '交互原型', '用户体验报告'],
    'ai_development': ['算法模型', 'API接口', '训练数据集'],
    'ui_implementation': ['前端代码', '样式表', '组件库'],
    'performance_testing': ['测试报告', '性能指标', '优化建议'],
    'ux_testing': ['用户测试报告', '可用性分析', '改进建议'],
    'project_analytics': ['数据分析报告', 'KPI指标', '趋势图表'],
    'quality_metrics': ['质量评估报告', '改进计划', '验收标准']
  };

  return deliverablesMap[taskType] || ['交付物文档', '工作成果'];
}

// 辅助函数：获取下一阶段任务
function getNextPhaseTasks(currentPhase: string, workflow: any[]): string[] {
  const phases = workflow.map(w => w.phase);
  const currentIndex = phases.indexOf(currentPhase);

  if (currentIndex < phases.length - 1) {
    const nextPhase = workflow[currentIndex + 1];
    return nextPhase.tasks.map((t: any) => t.name);
  }

  return ['项目完成', '交付验收'];
}

// 运行完整演示
if (import.meta.main) {
  await completeMultiClaudeDemo();
}

export { completeMultiClaudeDemo };