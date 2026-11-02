import { ClaudeInteractionHub, InteractionMode } from '../multi-claude/ClaudeInteractionHub.js';

/**
 * 用户与多Claude交互示例
 */
async function userMultiClaudeInteractionExample() {
  console.log('💬 === 用户与多Claude交互演示 === 💬\n');

  // 1. 创建拟人化身份
  console.log('🎭 创建Claude拟人化身份...');
  const { ClaudePersonaManager } = await import('../multi-claude/ClaudePersonaManager.js');
  const personaManager = new ClaudePersonaManager();

  // 2. 创建交互中心并传入personaManager
  console.log('\n🤝 初始化Claude交互中心...');
  const interactionHub = new ClaudeInteractionHub(personaManager);

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
    return persona;
  });

  // 3. 选择参与讨论的Claude团队
  console.log('\n👥 选择Claude团队成员...');
  const claudeTeam = personas.map(p => p.id);

  // 3. 创建交互会话
  console.log('\n🤝 创建多Claude交互会话...');
  const session = await interactionHub.createInteractionSession(
    'user_001',
    claudeTeam,
    InteractionMode.COLLABORATIVE
  );

  console.log(`✅ 会话创建成功: ${session.id}`);
  console.log(`🎯 交互模式: ${session.mode}`);
  console.log(`👥 参与Claude: ${session.personas.map(p => p.nickname).join(', ')}`);

  // 4. 模拟用户提问 - 不同类型的问题

  console.log('\n📝 === 开始交互演示 ===\n');

  // 问题1: 技术决策问题
  console.log('❓ 用户提问1: 技术选型决策');
  const responses1 = await interactionHub.sendMessage(
    'user_001',
    '我们正在开发一个AI智能助手应用，需要在以下技术方案中选择：\n' +
    '1. 使用GPT-4 API + 前端框架\n' +
    '2. 使用开源大模型 + 自建后端\n' +
    '3. 混合方案\n\n' +
    '请各位专家分析各自的优缺点并给出建议。'
  );

  console.log('\n🤖 Claude团队回复:');
  responses1.forEach((response, index) => {
    console.log(`\n${index + 1}. ${response.persona.nickname} ${response.persona.avatar}`);
    console.log(`   置信度: ${(response.confidence * 100).toFixed(1)}%`);
    console.log(`   处理时间: ${response.processingTime}ms`);
    console.log(`   回复: ${response.content.substring(0, 100)}...`);
  });

  // 等待一下再问下一个问题
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 问题2: 创意设计问题
  console.log('\n❓ 用户提问2: 用户体验设计');
  const responses2 = await interactionHub.sendMessage(
    'user_001',
    '我们希望AI助手能给用户带来温暖和信任感，\n' +
    '在界面设计和交互体验上有什么建议吗？\n' +
    '如何让AI更像贴心的助手而不是冷冰冰的工具？'
  );

  console.log('\n🤖 Claude团队回复:');
  responses2.forEach((response, index) => {
    console.log(`\n${index + 1}. ${response.persona.nickname} ${response.persona.avatar}`);
    console.log(`   回复: ${response.content.substring(0, 100)}...`);
  });

  await new Promise(resolve => setTimeout(resolve, 1000));

  // 问题3: 项目管理问题
  console.log('\n❓ 用户提问3: 项目风险管理');
  const responses3 = await interactionHub.sendMessage(
    'user_001',
    '项目进度有些延期，作为项目管理者，\n' +
    '我应该如何平衡质量和时间？\n' +
    '是应该加班赶进度，还是适当调整交付目标？'
  );

  console.log('\n🤖 Claude团队回复:');
  responses3.forEach((response, index) => {
    console.log(`\n${index + 1}. ${response.persona.nickname} ${response.persona.avatar}`);
    console.log(`   回复: ${response.content.substring(0, 100)}...`);
  });

  // 5. 切换交互模式演示
  console.log('\n🔄 === 切换到专家模式 ===\n');

  // 使用已有的拟人化身份，而不是创建新的
  const expertPersonas = personas.filter(p =>
    p.role === 'technical_expert' || p.role === 'creative_designer'
  );

  const specialistSession = await interactionHub.createInteractionSession(
    'user_001',
    expertPersonas.map(p => p.id), // 只选择技术专家和创意专家
    InteractionMode.SPECIALIST
  );

  console.log('❓ 专家模式提问: 技术架构设计');
  const specialistResponses = await interactionHub.sendMessage(
    'user_001',
    '我们需要设计一个支持百万用户的AI助手架构，\n' +
    '请重点从技术可行性和创新性角度给出建议。'
  );

  console.log('\n🤖 专家回复:');
  specialistResponses.forEach((response, index) => {
    console.log(`\n${index + 1}. ${response.persona.nickname} ${response.persona.avatar}`);
    console.log(`   专长领域: ${response.persona.personality.expertise.join(', ')}`);
    console.log(`   回复: ${response.content.substring(0, 100)}...`);
  });

  // 6. 竞争模式演示
  console.log('\n🏆 === 切换到竞争模式 ===\n');

  // 使用已有的拟人化身份
  const competitivePersonas = personas.filter(p =>
    ['technical_expert', 'creative_designer', 'data_analyst'].includes(p.role)
  );

  const competitiveSession = await interactionHub.createInteractionSession(
    'user_001',
    competitivePersonas.map(p => p.id),
    InteractionMode.COMPETITIVE
  );

  console.log('❓ 竞争模式提问: 创新方案设计');
  const competitiveResponses = await interactionHub.sendMessage(
    'user_001',
    '请设计一个创新的AI助手功能，\n' +
    '要求既实用又有趣，能够吸引用户长期使用。\n' +
    '将评选出最佳创意方案！'
  );

  console.log('\n🏆 竞争方案排名:');
  competitiveResponses.forEach((response, index) => {
    console.log(`\n🥇 第${index + 1}名: ${response.persona.nickname} ${response.persona.avatar}`);
    console.log(`   创新评分: ${(response.confidence * 100).toFixed(1)}%`);
    console.log(`   方案: ${response.content.substring(0, 150)}...`);
  });

  // 7. 显示交互统计
  console.log('\n📊 === 交互统计报告 ===\n');

  const allSessions = interactionHub.getActiveSessions();
  const totalMessages = interactionHub.getSessionHistory();

  console.log(`📈 交互统计:`);
  console.log(`• 总会话数: ${allSessions.length}`);
  console.log(`• 总消息数: ${totalMessages.length}`);
  console.log(`• 用户消息: ${totalMessages.filter(m => m.type === 'user').length}`);
  console.log(`• Claude回复: ${totalMessages.filter(m => m.type === 'claude').length}`);

  // 按Claude统计回复
  const claudeStats = totalMessages
    .filter(m => m.type === 'claude')
    .reduce((stats, message) => {
      const personaId = message.metadata?.persona?.id;
      if (personaId) {
        stats[personaId] = (stats[personaId] || 0) + 1;
      }
      return stats;
    }, {} as Record<string, number>);

  console.log('\n👥 Claude参与统计:');
  Object.entries(claudeStats).forEach(([personaId, count]) => {
    const session = allSessions[0];
    const persona = session?.personas.find(p => p.id === personaId);
    if (persona) {
      console.log(`• ${persona.nickname} ${persona.avatar}: ${count} 次回复`);
    }
  });

  // 8. 显示交互历史摘要
  console.log('\n📜 交互历史摘要:');
  totalMessages.slice(-5).forEach((message, index) => {
    const type = message.type === 'user' ? '👤 用户' : '🤖 Claude';
    const sender = message.type === 'user'
      ? '用户'
      : message.metadata?.persona?.nickname || 'Unknown';
    const preview = message.content.substring(0, 60) + '...';

    console.log(`${index + 1}. ${type} (${sender}): ${preview}`);
  });

  // 9. 结束会话
  console.log('\n🏁 结束交互会话...');
  await interactionHub.endSession(session.id);
  await interactionHub.endSession(specialistSession.id);
  await interactionHub.endSession(competitiveSession.id);

  console.log('✅ 所有会话已结束');

  // 10. 导出交互数据
  console.log('\n💾 导出交互数据...');
  const exportData = {
    sessions: allSessions.map(s => ({
      id: s.id,
      userId: s.userId,
      mode: s.mode,
      participantCount: s.personas.length,
      messageCount: s.conversationHistory.length,
      duration: s.endedAt
        ? s.endedAt.getTime() - s.createdAt.getTime()
        : Date.now() - s.createdAt.getTime()
    })),
    totalMessages: totalMessages.length,
    activeClaudes: Object.keys(claudeStats).length,
    exportedAt: new Date()
  };

  console.log('📁 交互数据导出完成:');
  console.log(JSON.stringify(exportData, null, 2));

  console.log('\n🎉 === 用户与多Claude交互演示完成 === 🎉');
}

/**
 * 实时交互演示
 */
async function realTimeInteractionDemo() {
  console.log('\n🔄 === 实时交互演示 === 🔄\n');

  // 先创建拟人化身份
  const { ClaudePersonaManager } = await import('../multi-claude/ClaudePersonaManager.js');
  const personaManager = new ClaudePersonaManager();

  const zhangLaoshi = personaManager.createPersona('leader_zhang');
  const creativeWang = personaManager.createPersona('creative_wang');

  const interactionHub = new ClaudeInteractionHub(personaManager);

  // 创建简化的交互会话
  const session = await interactionHub.createInteractionSession(
    'demo_user',
    [zhangLaoshi.id, creativeWang.id],
    InteractionMode.COLLABORATIVE
  );

  // 监听事件
  interactionHub.on('sessionCreated', (session) => {
    console.log(`🎉 会话创建: ${session.id}`);
  });

  interactionHub.on('messageProcessed', (data) => {
    console.log(`💬 消息处理完成: ${data.responses.length} 个回复`);
  });

  // 模拟实时对话
  const questions = [
    '如何提高团队协作效率？',
    '有什么创新的管理方法吗？',
    '如何平衡工作和生活？'
  ];

  for (let i = 0; i < questions.length; i++) {
    console.log(`\n--- 第 ${i + 1} 轮对话 ---`);
    console.log(`👤 用户: ${questions[i]}`);

    const responses = await interactionHub.sendMessage('demo_user', questions[i]);

    responses.forEach((response) => {
      console.log(`🤖 ${response.persona.nickname}: ${response.content.substring(0, 80)}...`);
    });

    // 模拟思考时间
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  await interactionHub.endSession(session.id);
  console.log('\n✅ 实时交互演示完成');
}

// 运行演示
if (import.meta.main) {
  await userMultiClaudeInteractionExample();
  await realTimeInteractionDemo();
}

export { userMultiClaudeInteractionExample, realTimeInteractionDemo };