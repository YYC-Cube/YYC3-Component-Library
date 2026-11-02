interface ModerationResult {
  approved: boolean;
  reason?: string;
}

export class ContentModerator {
  // 简单的内容审核逻辑
  async moderateContent(content: string): Promise<ModerationResult> {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 简单的关键词过滤
    const prohibitedWords = ['spam', 'violence', 'hate', 'racism'];
    const lowerContent = content.toLowerCase();
    
    for (const word of prohibitedWords) {
      if (lowerContent.includes(word)) {
        return {
          approved: false,
          reason: `内容包含不适当词汇: ${word}`
        };
      }
    }
    
    // 检查内容长度
    if (content.length === 0) {
      return {
        approved: false,
        reason: '内容不能为空'
      };
    }
    
    // 检查是否有明显的广告链接
    if (lowerContent.includes('http://') || lowerContent.includes('https://')) {
      return {
        approved: false,
        reason: '内容包含链接，请联系管理员上传'
      };
    }
    
    return {
      approved: true
    };
  }
}