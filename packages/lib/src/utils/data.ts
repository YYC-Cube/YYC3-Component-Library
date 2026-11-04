// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）· @yyc3/lib 数据处理工具
// 源：/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-8/yyc3-reusable-components/packages/utils/src/data.ts
// ============================================================

/** 按 id 查找成员 */
export function getMember<T extends { id: string }>(id: string, members: T[]): T | undefined {
  return members.find((m) => m.id === id);
}

/** 家族数据统计摘要（平均成长/贡献等） */
export function getDataSummary<
  T extends {
    growth: number;
    contribution: number;
  },
>(
  members: T[],
  options?: {
    totalMessages?: number;
    totalActivities?: number;
    totalMemories?: number;
    totalMedals?: number;
    systemUptime?: number;
    familyAge?: number;
  },
) {
  const avgGrowth = Math.round(members.reduce((sum, m) => sum + m.growth, 0) / members.length);
  const avgContribution = Math.round(
    members.reduce((sum, m) => sum + m.contribution, 0) / members.length,
  );
  return {
    totalMessages: options?.totalMessages || 0,
    totalActivities: options?.totalActivities || 0,
    totalMemories: options?.totalMemories || 0,
    totalMedals: options?.totalMedals || 0,
    avgGrowth,
    avgContribution,
    systemUptime: options?.systemUptime || 0,
    familyAge: options?.familyAge || 0,
  };
}

/** 深度克隆（处理 Date/Array/Object） */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }
  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as T;
  }
  if (obj instanceof Object) {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/** 数组去重（可按对象 key） */
export function unique<T>(arr: T[], key?: keyof T): T[] {
  if (!key) {
    return Array.from(new Set(arr));
  }
  const seen = new Set<unknown>();
  return arr.filter((item) => {
    const k = item[key];
    if (seen.has(k)) {
      return false;
    }
    seen.add(k);
    return true;
  });
}

/** 数组分组 */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce(
    (groups, item) => {
      const k = String(item[key]);
      if (!groups[k]) {
        groups[k] = [];
      }
      groups[k].push(item);
      return groups;
    },
    {} as Record<string, T[]>,
  );
}

/** 数组分块 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
