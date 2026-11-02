import { v4 as uuidv4 } from 'uuid';

/**
 * Claude拟人化昵称和角色管理器
 * 为每个Claude实例分配独特的拟人化特征
 */
export class ClaudePersonaManager {
  private personas: Map<string, ClaudePersona> = new Map();
  private personaTemplates: PersonaTemplate[] = [];

  constructor() {
    this.initializePersonaTemplates();
  }

  /**
   * 初始化拟人化模板
   */
  private initializePersonaTemplates(): void {
    this.personaTemplates = [
      {
        id: 'leader_zhang',
        name: '张老师',
        nickname: '张老师',
        role: 'team_leader',
        description: '经验丰富的项目领导者，擅长协调和决策',
        avatar: '👨‍🏫',
        personality: {
          traits: ['稳重', '可靠', '果断', '亲和'],
          communicationStyle: '正式但温和',
          decisionStyle: '数据驱动',
          expertise: ['项目管理', '团队协调', '战略规划']
        },
        behavior: {
          greetingStyle: '大家好，我是张老师',
          responseStyle: '条理清晰，重点突出',
          problemSolving: '系统化分析',
          collaboration: '善于倾听和整合意见'
        },
        preferences: {
          workStyle: '结构化',
          communication: '文字为主，会议为辅',
          decisionSpeed: '中等偏快'
        }
      },
      {
        id: 'expert_li',
        name: '李博士',
        nickname: '李博士',
        role: 'technical_expert',
        description: '技术专家，精通AI和算法',
        avatar: '👨‍🔬',
        personality: {
          traits: ['严谨', '专业', '创新', '细致'],
          communicationStyle: '精确、专业',
          decisionStyle: '基于深度分析',
          expertise: ['人工智能', '算法设计', '系统架构']
        },
        behavior: {
          greetingStyle: '我是李博士，很高兴为大家提供技术支持',
          responseStyle: '详实、专业',
          problemSolving: '深度技术分析',
          collaboration: '提供专业建议和技术指导'
        },
        preferences: {
          workStyle: '研究型',
          communication: '技术文档为主',
          decisionSpeed: '谨慎深思熟虑'
        }
      },
      {
        id: 'creative_wang',
        name: '小王',
        nickname: '创意王',
        role: 'creative_designer',
        description: '富有创意的设计师，擅长用户体验和创新思维',
        avatar: '🎨',
        personality: {
          traits: ['创意', '热情', '灵活', '乐观'],
          communicationStyle: '活泼、形象',
          decisionStyle: '直觉和灵感',
          expertise: ['用户体验', '创意设计', '创新思维']
        },
        behavior: {
          greetingStyle: '嗨！我是创意王，让我们一起创造精彩！',
          responseStyle: '生动有趣，图文并茂',
          problemSolving: '创新解决方案',
          collaboration: '激发团队创意'
        },
        preferences: {
          workStyle: '自由灵活',
          communication: '视觉化、故事化',
          decisionSpeed: '快速直觉'
        }
      },
      {
        id: 'guardian_chen',
        name: '陈师傅',
        nickname: '守护者陈',
        role: 'quality_guardian',
        description: '质量控制专家，确保每个细节都完美',
        avatar: '🔍',
        personality: {
          traits: ['细心', '负责', '严格', '公正'],
          communicationStyle: '详尽、有条理',
          decisionStyle: '基于标准和规范',
          expertise: ['质量管理', '测试', '流程优化']
        },
        behavior: {
          greetingStyle: '我是陈师傅，质量是我的第一原则',
          responseStyle: '全面细致',
          problemSolving: '流程化、标准化',
          collaboration: '严格把关，提供建设性反馈'
        },
        preferences: {
          workStyle: '规范化',
          communication: '详细报告和清单',
          decisionSpeed: '稳中求准'
        }
      },
      {
        id: 'analyst_zhao',
        name: '赵分析师',
        nickname: '数据赵',
        role: 'data_analyst',
        description: '数据分析专家，用数据说话',
        avatar: '📊',
        personality: {
          traits: ['理性', '客观', '精确', '好奇'],
          communicationStyle: '数据驱动',
          decisionStyle: '基于数据证据',
          expertise: ['数据分析', '统计学', '商业智能']
        },
        behavior: {
          greetingStyle: '我是赵分析师，让我们用数据找到答案',
          responseStyle: '有数据支撑',
          problemSolving: '量化分析',
          collaboration: '提供数据洞察和建议'
        },
        preferences: {
          workStyle: '数据驱动',
          communication: '图表和报告',
          decisionSpeed: '基于分析结果'
        }
      },
      {
        id: 'mentor_liu',
        name: '刘导师',
        nickname: '导师刘',
        role: 'mentor_coach',
        description: '经验丰富的导师，善于指导和培养',
        avatar: '🧙‍♂️',
        personality: {
          traits: ['智慧', '耐心', '启发', '关怀'],
          communicationStyle: '启发式、循循善诱',
          decisionStyle: '基于经验和智慧',
          expertise: ['团队指导', '技能培训', '职业发展']
        },
        behavior: {
          greetingStyle: '我是刘导师，让我们一起成长进步',
          responseStyle: '启发思考',
          problemSolving: '引导式解决',
          collaboration: '指导和支持团队成员'
        },
        preferences: {
          workStyle: '教练式',
          communication: '对话和讨论',
          decisionSpeed: '深思熟虑'
        }
      },
      {
        id: 'connector_sun',
        name: '小孙',
        nickname: '连接者',
        role: 'communication_bridge',
        description: '沟通桥梁，促进团队协作',
        avatar: '🤝',
        personality: {
          traits: ['外向', '友善', '协调', '包容'],
          communicationStyle: '亲和、易理解',
          decisionStyle: '考虑各方需求',
          expertise: ['沟通协调', '团队建设', '冲突解决']
        },
        behavior: {
          greetingStyle: '大家好！我是小孙，让我们保持良好沟通！',
          responseStyle: '简洁明了',
          problemSolving: '协调各方',
          collaboration: '促进团队合作'
        },
        preferences: {
          workStyle: '协作导向',
          communication: '面对面交流',
          decisionSpeed: '快速响应'
        }
      },
      {
        id: 'innovator_wu',
        name: '吴教授',
        nickname: '创新吴',
        role: 'innovation_catalyst',
        description: '创新催化剂，推动变革和突破',
        avatar: '💡',
        personality: {
          traits: ['前瞻', '冒险', '突破', '挑战'],
          communicationStyle: '富有激情',
          decisionStyle: '勇于尝试',
          expertise: ['创新管理', '变革领导', '战略洞察']
        },
        behavior: {
          greetingStyle: '我是吴教授，让我们一起突破极限！',
          responseStyle: '富有启发性',
          problemSolving: '创新思维',
          collaboration: '推动创新和变革'
        },
        preferences: {
          workStyle: '创新驱动',
          communication: '愿景和故事',
          decisionSpeed: '果断前卫'
        }
      }
    ];
  }

  /**
   * 创建拟人化身份
   */
  createPersona(
    templateId: string,
    customizations?: Partial<ClaudePersona>
  ): ClaudePersona {
    const template = this.personaTemplates.find(t => t.id === templateId);
    if (!template) {
      throw new Error(`拟人化模板 ${templateId} 不存在`);
    }

    const persona: ClaudePersona = {
      id: uuidv4(),
      templateId,
      name: template.name,
      nickname: template.nickname,
      role: template.role,
      description: template.description,
      avatar: template.avatar,
      personality: template.personality,
      behavior: template.behavior,
      preferences: template.preferences,
      createdAt: new Date(),
      lastUsed: new Date(),
      usageCount: 0,
      customizations: customizations || {}
    };

    this.personas.set(persona.id, persona);
    console.log(`🎭 拟人化身份创建: ${persona.nickname} (${persona.name})`);
    return persona;
  }

  /**
   * 获取拟人化身份
   */
  getPersona(personaId: string): ClaudePersona | undefined {
    const persona = this.personas.get(personaId);
    if (persona) {
      persona.lastUsed = new Date();
      persona.usageCount++;
    }
    return persona;
  }

  /**
   * 按角色获取拟人化身份
   */
  getPersonasByRole(role: string): ClaudePersona[] {
    return Array.from(this.personas.values())
      .filter(persona => persona.role === role)
      .sort((a, b) => b.usageCount - a.usageCount);
  }

  /**
   * 获取所有可用的拟人化模板
   */
  getAvailableTemplates(): PersonaTemplate[] {
    return [...this.personaTemplates];
  }

  /**
   * 为任务推荐最适合的拟人化身份
   */
  recommendPersona(
    taskType: string,
    taskComplexity: 'low' | 'medium' | 'high' = 'medium',
    teamSize: number = 1
  ): ClaudePersona[] {
    const recommendations: ClaudePersona[] = [];

    // 根据任务类型推荐
    switch (taskType) {
      case 'project_management':
      case 'coordination':
        recommendations.push(...this.getPersonasByRole('team_leader'));
        break;

      case 'technical_analysis':
      case 'algorithm_design':
        recommendations.push(...this.getPersonasByRole('technical_expert'));
        break;

      case 'creative_design':
      case 'user_experience':
        recommendations.push(...this.getPersonasByRole('creative_designer'));
        break;

      case 'quality_control':
      case 'testing':
        recommendations.push(...this.getPersonasByRole('quality_guardian'));
        break;

      case 'data_analysis':
      case 'reporting':
        recommendations.push(...this.getPersonasByRole('data_analyst'));
        break;

      case 'training':
      case 'mentoring':
        recommendations.push(...this.getPersonasByRole('mentor_coach'));
        break;

      case 'communication':
      case 'collaboration':
        recommendations.push(...this.getPersonasByRole('communication_bridge'));
        break;

      case 'innovation':
      case 'strategy':
        recommendations.push(...this.getPersonasByRole('innovation_catalyst'));
        break;

      default:
        // 通用推荐
        recommendations.push(...this.getPersonasByRole('team_leader'));
        recommendations.push(...this.getPersonasByRole('technical_expert'));
    }

    // 根据团队大小调整推荐
    if (teamSize > 3) {
      recommendations.push(...this.getPersonasByRole('communication_bridge'));
    }

    if (taskComplexity === 'high') {
      recommendations.push(...this.getPersonasByRole('quality_guardian'));
    }

    // 去重并按使用频率排序
    return [...new Map(recommendations.map(p => [p.id, p])).values()]
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 3); // 最多推荐3个
  }

  /**
   * 生成拟人化问候语
   */
  generateGreeting(persona: ClaudePersona, context?: string): string {
    let greeting = persona.behavior.greetingStyle;

    if (context) {
      greeting += `\n关于${context}，我很乐意帮助大家。`;
    }

    // 根据使用频率调整问候语
    if (persona.usageCount > 10) {
      greeting += `\n很高兴再次和大家合作！`;
    }

    return greeting;
  }

  /**
   * 生成拟人化回复
   */
  generateResponse(
    persona: ClaudePersona,
    query: string,
    response: string
  ): string {
    let personalizedResponse = '';

    // 添加拟人化前缀
    if (persona.usageCount === 1) {
      personalizedResponse += `${persona.behavior.greetingStyle}\n\n`;
    }

    // 根据个性调整回复风格
    switch (persona.personality.communicationStyle) {
      case '正式但温和':
        personalizedResponse += `根据我的分析，${response}`;
        break;
      case '精确、专业':
        personalizedResponse += `经过专业分析，${response}`;
        break;
      case '活泼、形象':
        personalizedResponse += `让我用一个有趣的方式来解释：${response}`;
        break;
      case '详尽、有条理':
        personalizedResponse += `让我详细说明：\n1. ${response}`;
        break;
      case '数据驱动':
        personalizedResponse += `基于数据分析，${response}`;
        break;
      case '启发式、循循善诱':
        personalizedResponse += `让我们思考一下这个问题：${response}`;
        break;
      case '亲和、易理解':
        personalizedResponse += `简单来说，${response}`;
        break;
      case '富有激情':
        personalizedResponse += `我非常激动地告诉大家：${response}！`;
        break;
      default:
        personalizedResponse += response;
    }

    // 添加拟人化签名
    personalizedResponse += `\n\n——${persona.nickname}`;

    return personalizedResponse;
  }

  /**
   * 更新拟人化特征
   */
  updatePersona(
    personaId: string,
    updates: Partial<ClaudePersona>
  ): void {
    const persona = this.personas.get(personaId);
    if (persona) {
      Object.assign(persona, updates);
      persona.customizations = { ...persona.customizations, ...updates };
      console.log(`🔄 拟人化身份更新: ${persona.nickname}`);
    }
  }

  /**
   * 获取使用统计
   */
  getUsageStats(): PersonaUsageStats {
    const personas = Array.from(this.personas.values());
    const totalUsage = personas.reduce((sum, p) => sum + p.usageCount, 0);

    const usageByRole = personas.reduce((acc, persona) => {
      acc[persona.role] = (acc[persona.role] || 0) + persona.usageCount;
      return acc;
    }, {} as Record<string, number>);

    const mostUsed = personas.reduce((max, persona) =>
      persona.usageCount > max.usageCount ? persona : max
    , personas[0] || null);

    const recentlyUsed = personas
      .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime())
      .slice(0, 5);

    return {
      totalPersonas: personas.length,
      totalUsage,
      usageByRole,
      mostUsed,
      recentlyUsed,
      averageUsage: personas.length > 0 ? totalUsage / personas.length : 0
    };
  }

  /**
   * 生成拟人化团队配置
   */
  generateTeamConfiguration(teamSize: number = 4): TeamConfiguration {
    const requiredRoles = ['team_leader', 'technical_expert', 'creative_designer', 'quality_guardian'];

    if (teamSize > 4) {
      requiredRoles.push('communication_bridge');
    }
    if (teamSize > 5) {
      requiredRoles.push('data_analyst');
    }

    const teamMembers: ClaudePersona[] = [];

    for (const role of requiredRoles.slice(0, teamSize)) {
      const availablePersonas = this.getPersonasByRole(role);
      if (availablePersonas.length > 0) {
        teamMembers.push(availablePersonas[0]);
      } else {
        // 创建新的拟人化身份
        const template = this.personaTemplates.find(t => t.role === role);
        if (template) {
          teamMembers.push(this.createPersona(template.id));
        }
      }
    }

    return {
      teamId: uuidv4(),
      teamName: `智能团队_${new Date().toISOString().slice(0, 10)}`,
      members: teamMembers,
      createdAt: new Date(),
      teamDynamics: this.analyzeTeamDynamics(teamMembers)
    };
  }

  /**
   * 分析团队动态
   */
  private analyzeTeamDynamics(members: ClaudePersona[]): TeamDynamics {
    const traits = members.flatMap(m => m.personality.traits);
    const expertise = members.flatMap(m => m.personality.expertise);

    const traitFrequency = traits.reduce((acc, trait) => {
      acc[trait] = (acc[trait] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const expertiseCoverage = [...new Set(expertise)].length;

    return {
      diversityScore: Object.keys(traitFrequency).length,
      expertiseCoverage,
      collaborationStyle: this.determineCollaborationStyle(members),
      potentialConflicts: this.identifyPotentialConflicts(members),
      strengths: this.identifyTeamStrengths(members)
    };
  }

  /**
   * 确定团队协作风格
   */
  private determineCollaborationStyle(members: ClaudePersona[]): string {
    const communicationStyles = members.map(m => m.personality.communicationStyle);

    if (communicationStyles.includes('活泼、形象')) {
      return '创意协作型';
    } else if (communicationStyles.includes('精确、专业')) {
      return '专业严谨型';
    } else if (communicationStyles.includes('亲和、易理解')) {
      return '沟通协调型';
    } else {
      return '平衡发展型';
    }
  }

  /**
   * 识别潜在冲突
   */
  private identifyPotentialConflicts(members: ClaudePersona[]): string[] {
    const conflicts = [];

    const decisionStyles = members.map(m => m.personality.decisionStyle);
    if (decisionStyles.includes('果断') && decisionStyles.includes('谨慎深思熟虑')) {
      conflicts.push('决策速度差异可能需要协调');
    }

    const workStyles = members.map(m => m.preferences.workStyle);
    if (workStyles.includes('自由灵活') && workStyles.includes('规范化')) {
      conflicts.push('工作方式差异需要平衡');
    }

    return conflicts;
  }

  /**
   * 识别团队优势
   */
  private identifyTeamStrengths(members: ClaudePersona[]): string[] {
    const strengths = [];

    const allExpertise = members.flatMap(m => m.personality.expertise);
    if (allExpertise.includes('项目管理') && allExpertise.includes('技术专家')) {
      strengths.push('管理和技术并重');
    }

    if (allExpertise.includes('创意设计') && allExpertise.includes('质量管理')) {
      strengths.push('创新和质量兼顾');
    }

    return strengths;
  }

  /**
   * 导出拟人化配置
   */
  exportPersonaData(): string {
    const data = {
      personas: Object.fromEntries(this.personas),
      templates: this.personaTemplates,
      usageStats: this.getUsageStats(),
      exportedAt: new Date()
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * 导入拟人化配置
   */
  importPersonaData(data: string): void {
    try {
      const imported = JSON.parse(data);

      if (imported.personas) {
        Object.entries(imported.personas).forEach(([id, persona]) => {
          this.personas.set(id, persona as ClaudePersona);
        });
      }

      if (imported.templates) {
        this.personaTemplates = imported.templates;
      }

      console.log('✅ 拟人化配置导入成功');
    } catch (error) {
      console.error('❌ 拟人化配置导入失败:', error);
      throw new Error(`导入失败: ${error}`);
    }
  }
}

// 类型定义
export interface ClaudePersona {
  id: string;
  templateId: string;
  name: string;
  nickname: string;
  role: string;
  description: string;
  avatar: string;
  personality: {
    traits: string[];
    communicationStyle: string;
    decisionStyle: string;
    expertise: string[];
  };
  behavior: {
    greetingStyle: string;
    responseStyle: string;
    problemSolving: string;
    collaboration: string;
  };
  preferences: {
    workStyle: string;
    communication: string;
    decisionSpeed: string;
  };
  createdAt: Date;
  lastUsed: Date;
  usageCount: number;
  customizations: Partial<ClaudePersona>;
}

export interface PersonaTemplate {
  id: string;
  name: string;
  nickname: string;
  role: string;
  description: string;
  avatar: string;
  personality: ClaudePersona['personality'];
  behavior: ClaudePersona['behavior'];
  preferences: ClaudePersona['preferences'];
}

export interface PersonaUsageStats {
  totalPersonas: number;
  totalUsage: number;
  usageByRole: Record<string, number>;
  mostUsed: ClaudePersona | null;
  recentlyUsed: ClaudePersona[];
  averageUsage: number;
}

export interface TeamConfiguration {
  teamId: string;
  teamName: string;
  members: ClaudePersona[];
  createdAt: Date;
  teamDynamics: TeamDynamics;
}

export interface TeamDynamics {
  diversityScore: number;
  expertiseCoverage: number;
  collaborationStyle: string;
  potentialConflicts: string[];
  strengths: string[];
}