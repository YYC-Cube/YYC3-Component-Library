// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）· @yyc3/lib 日期时间工具
// 源：/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-8/yyc3-reusable-components/packages/utils/src/date.ts
// ============================================================

/** 按当前时刻返回问候语（YYC³ 家族文案） */
export function getGreeting(): { text: string; emoji: string } {
  const h = new Date().getHours();
  if (h < 6) return { text: '夜深了，注意休息', emoji: 'night' };
  if (h < 9) return { text: '早安，新的一天开始了', emoji: 'dawn' };
  if (h < 12) return { text: '上午好，精力充沛', emoji: 'morning' };
  if (h < 14) return { text: '中午好，记得午休', emoji: 'noon' };
  if (h < 18) return { text: '下午好，继续加油', emoji: 'afternoon' };
  if (h < 21) return { text: '傍晚好，辛苦了', emoji: 'evening' };
  return { text: '晚上好，放松身心', emoji: 'night' };
}

/** 整点关爱播报：按小时轮换成员 */
export function getHourlyCare<T extends { id: string; careMessage: string }>(
  members: T[],
): { member: T; message: string } {
  const h = new Date().getHours();
  const idx = h % members.length;
  const m = members[idx];
  return { member: m, message: m.careMessage };
}

/** 格式化日期（YYYY/MM/DD/HH/mm/ss 占位替换） */
export function formatDate(date: Date | number, format: string = 'YYYY-MM-DD'): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/** 相对时间描述（"刚刚 / N分钟前 / N小时前 / N天前 / 日期"） */
export function getRelativeTime(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (seconds < 60) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return formatDate(d, 'YYYY-MM-DD');
}

/** 是否今天 */
export function isToday(date: Date | number): boolean {
  const d = typeof date === 'number' ? new Date(date) : date;
  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

/** 是否七日内（本周口径） */
export function isThisWeek(date: Date | number): boolean {
  const d = typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const days = Math.abs(diff / (1000 * 60 * 60 * 24));
  return days <= 7;
}
