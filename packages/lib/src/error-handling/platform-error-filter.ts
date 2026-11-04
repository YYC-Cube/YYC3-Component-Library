// ============================================================
// YYC³ · @yyc3/lib 平台错误过滤器（源：UI-8 yyc3-reusable-components/packages/error-handling）
// 可配置规则匹配（name/message/source/stack 部分匹配，大小写不敏感）
// ============================================================

export interface FilterRule {
  namePattern?: string | string[];
  messagePattern?: string | string[];
  sourcePattern?: string | string[];
  stackPattern?: string | string[];
}

export interface ErrorContext {
  name: string;
  message: string;
  source?: string;
  stack?: string;
}

export class PlatformErrorFilter {
  private rules: FilterRule[];

  constructor(rules: FilterRule[] = []) {
    this.rules = rules;
  }

  addRule(rule: FilterRule): void {
    this.rules.push(rule);
  }

  clearRules(): void {
    this.rules = [];
  }

  /** 是否应过滤（忽略）该错误 */
  shouldFilter(context: ErrorContext): boolean {
    return this.rules.some((rule) => this.matchRule(rule, context));
  }

  private matchRule(rule: FilterRule, ctx: ErrorContext): boolean {
    const { name, message, source, stack } = ctx;
    if (rule.namePattern) {
      const patterns = Array.isArray(rule.namePattern) ? rule.namePattern : [rule.namePattern];
      if (patterns.some((p) => name.toLowerCase().includes(p.toLowerCase()))) return true;
    }
    if (rule.messagePattern) {
      const patterns = Array.isArray(rule.messagePattern) ? rule.messagePattern : [rule.messagePattern];
      if (patterns.some((p) => message.toLowerCase().includes(p.toLowerCase()))) return true;
    }
    if (rule.sourcePattern && source) {
      const patterns = Array.isArray(rule.sourcePattern) ? rule.sourcePattern : [rule.sourcePattern];
      if (patterns.some((p) => source.toLowerCase().includes(p.toLowerCase()))) return true;
    }
    if (rule.stackPattern && stack) {
      const patterns = Array.isArray(rule.stackPattern) ? rule.stackPattern : [rule.stackPattern];
      if (patterns.some((p) => stack.toLowerCase().includes(p.toLowerCase()))) return true;
    }
    return false;
  }
}

/** Figma 平台过滤器预设（iframe 中断/端口消息/来源域） */
export function createFigmaErrorFilter(): PlatformErrorFilter {
  return new PlatformErrorFilter([
    {
      namePattern: ['iframe', 'abort', 'iframemessage'],
      messagePattern: ['message aborted', 'message port', 'iframe'],
    },
    {
      sourcePattern: ['figma.com', 'webpack-artifacts', 'figma_app'],
    },
  ]);
}

/** 快捷判定：默认按 Figma 预设匹配 */
export function isPlatformError(name: string, message: string, source?: string, stack?: string): boolean {
  return createFigmaErrorFilter().shouldFilter({ name, message, source, stack });
}
