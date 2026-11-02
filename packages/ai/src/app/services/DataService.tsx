/**
 * ══════════════════════════════════════════════════════════════════
 * YYC³ AI 智能教育中心 — 数据持久化服务层
 * ══════════════════════════════════════════════════════════════════
 *
 * 架构设计：三层抽象
 *   Controller (组件) → Service (业务逻辑) → Repository (存储适配器)
 *
 * 当前适配器：localStorage（原型阶段）
 * 生产就绪适配器：PostgreSQL / MySQL / Supabase
 *
 * ──────────────────────────────────────────────────────────────────
 * PostgreSQL DDL 架构（生产环境）
 * ──────────────────────────────────────────────────────────────────
 *
 * ```sql
 * -- 用户表
 * CREATE TABLE users (
 *   id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   username      VARCHAR(64) UNIQUE NOT NULL,
 *   email         VARCHAR(256) UNIQUE NOT NULL,
 *   display_name  VARCHAR(128),
 *   avatar_url    TEXT,
 *   role          VARCHAR(20) DEFAULT 'learner',  -- learner | instructor | admin
 *   theme_pref    VARCHAR(10) DEFAULT 'dark',     -- dark | light
 *   language_pref VARCHAR(5) DEFAULT 'zh',        -- zh | en
 *   created_at    TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at    TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * -- 课程表
 * CREATE TABLE courses (
 *   id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   slug          VARCHAR(128) UNIQUE NOT NULL,
 *   title_zh      VARCHAR(256) NOT NULL,
 *   title_en      VARCHAR(256) NOT NULL,
 *   subtitle_zh   TEXT,
 *   subtitle_en   TEXT,
 *   icon_name     VARCHAR(64),
 *   color_from    VARCHAR(32),
 *   color_to      VARCHAR(32),
 *   bg_glow       VARCHAR(64),
 *   image_url     TEXT,
 *   duration_zh   VARCHAR(32),
 *   duration_en   VARCHAR(32),
 *   category_zh   VARCHAR(64),
 *   category_en   VARCHAR(64),
 *   sort_order    INTEGER DEFAULT 0,
 *   is_published  BOOLEAN DEFAULT FALSE,
 *   created_at    TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at    TIMESTAMPTZ DEFAULT NOW()
 * );
 * CREATE INDEX idx_courses_category ON courses(category_zh, category_en);
 * CREATE INDEX idx_courses_published ON courses(is_published, sort_order);
 *
 * -- 课程模块表
 * CREATE TABLE course_modules (
 *   id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   course_id     UUID REFERENCES courses(id) ON DELETE CASCADE,
 *   title_zh      VARCHAR(256) NOT NULL,
 *   title_en      VARCHAR(256) NOT NULL,
 *   sort_order    INTEGER DEFAULT 0,
 *   duration_min  INTEGER DEFAULT 0,
 *   created_at    TIMESTAMPTZ DEFAULT NOW()
 * );
 * CREATE INDEX idx_modules_course ON course_modules(course_id, sort_order);
 *
 * -- 学习路径表
 * CREATE TABLE learning_paths (
 *   id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   slug          VARCHAR(128) UNIQUE NOT NULL,
 *   title_zh      VARCHAR(256) NOT NULL,
 *   title_en      VARCHAR(256) NOT NULL,
 *   description_zh TEXT,
 *   description_en TEXT,
 *   sort_order    INTEGER DEFAULT 0,
 *   created_at    TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * -- 路径节点表
 * CREATE TABLE path_nodes (
 *   id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   path_id       UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
 *   title_zh      VARCHAR(256) NOT NULL,
 *   title_en      VARCHAR(256) NOT NULL,
 *   description_zh TEXT,
 *   description_en TEXT,
 *   duration_zh   VARCHAR(32),
 *   duration_en   VARCHAR(32),
 *   sort_order    INTEGER DEFAULT 0,
 *   created_at    TIMESTAMPTZ DEFAULT NOW()
 * );
 * CREATE INDEX idx_nodes_path ON path_nodes(path_id, sort_order);
 *
 * -- 节点技能表
 * CREATE TABLE node_skills (
 *   id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   node_id       UUID REFERENCES path_nodes(id) ON DELETE CASCADE,
 *   skill_zh      VARCHAR(128) NOT NULL,
 *   skill_en      VARCHAR(128) NOT NULL,
 *   sort_order    INTEGER DEFAULT 0
 * );
 *
 * -- 用户课程注册表
 * CREATE TABLE enrollments (
 *   id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
 *   course_id     UUID REFERENCES courses(id) ON DELETE CASCADE,
 *   status        VARCHAR(20) DEFAULT 'enrolled',  -- enrolled | in_progress | completed | dropped
 *   progress      DECIMAL(5,2) DEFAULT 0,          -- 0.00 ~ 100.00
 *   started_at    TIMESTAMPTZ,
 *   completed_at  TIMESTAMPTZ,
 *   created_at    TIMESTAMPTZ DEFAULT NOW(),
 *   UNIQUE(user_id, course_id)
 * );
 * CREATE INDEX idx_enrollments_user ON enrollments(user_id, status);
 * CREATE INDEX idx_enrollments_course ON enrollments(course_id);
 *
 * -- 学习进度表（细粒度）
 * CREATE TABLE progress_records (
 *   id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
 *   node_id       UUID REFERENCES path_nodes(id) ON DELETE CASCADE,
 *   status        VARCHAR(20) DEFAULT 'locked',  -- locked | in_progress | completed
 *   progress      DECIMAL(5,2) DEFAULT 0,
 *   updated_at    TIMESTAMPTZ DEFAULT NOW(),
 *   UNIQUE(user_id, node_id)
 * );
 * CREATE INDEX idx_progress_user ON progress_records(user_id);
 *
 * -- 课程评分表
 * CREATE TABLE ratings (
 *   id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
 *   course_id     UUID REFERENCES courses(id) ON DELETE CASCADE,
 *   score         DECIMAL(2,1) CHECK (score >= 1 AND score <= 5),
 *   comment       TEXT,
 *   created_at    TIMESTAMPTZ DEFAULT NOW(),
 *   UNIQUE(user_id, course_id)
 * );
 * CREATE INDEX idx_ratings_course ON ratings(course_id);
 *
 * -- 搜索日志表（大数据分析用）
 * CREATE TABLE search_logs (
 *   id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
 *   query         VARCHAR(512) NOT NULL,
 *   results_count INTEGER DEFAULT 0,
 *   category      VARCHAR(64),
 *   clicked_id    UUID,   -- 用户点击的结果 ID
 *   session_id    VARCHAR(64),
 *   created_at    TIMESTAMPTZ DEFAULT NOW()
 * );
 * CREATE INDEX idx_search_logs_query ON search_logs(query);
 * CREATE INDEX idx_search_logs_time ON search_logs(created_at);
 *
 * -- 用户行为分析表
 * CREATE TABLE analytics_events (
 *   id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
 *   event_type    VARCHAR(64) NOT NULL,  -- page_view | course_click | theme_toggle | search | gesture
 *   event_data    JSONB,
 *   session_id    VARCHAR(64),
 *   page_section  VARCHAR(64),
 *   created_at    TIMESTAMPTZ DEFAULT NOW()
 * );
 * CREATE INDEX idx_analytics_type ON analytics_events(event_type, created_at);
 * CREATE INDEX idx_analytics_user ON analytics_events(user_id, created_at);
 *
 * -- 统计视图
 * CREATE VIEW course_stats AS
 * SELECT
 *   c.id,
 *   c.title_zh,
 *   c.title_en,
 *   COUNT(DISTINCT e.user_id) as student_count,
 *   AVG(r.score) as avg_rating,
 *   AVG(e.progress) as avg_progress,
 *   COUNT(DISTINCT CASE WHEN e.status = 'completed' THEN e.user_id END) as completed_count
 * FROM courses c
 * LEFT JOIN enrollments e ON c.id = e.course_id
 * LEFT JOIN ratings r ON c.id = r.course_id
 * GROUP BY c.id, c.title_zh, c.title_en;
 *
 * -- 热门搜索视图
 * CREATE VIEW trending_searches AS
 * SELECT
 *   query,
 *   COUNT(*) as search_count,
 *   AVG(results_count) as avg_results,
 *   MAX(created_at) as last_searched
 * FROM search_logs
 * WHERE created_at > NOW() - INTERVAL '7 days'
 * GROUP BY query
 * ORDER BY search_count DESC
 * LIMIT 20;
 * ```
 *
 * ──────────────────────────────────────────────────────────────────
 * MySQL DDL 等效架构（可选）
 * ──────────────────────────────────────────────────────────────────
 *
 * ```sql
 * -- MySQL 版本差异点：
 * -- 1. UUID 使用 CHAR(36) + UUID() 函数
 * -- 2. TIMESTAMPTZ → TIMESTAMP
 * -- 3. JSONB → JSON
 * -- 4. gen_random_uuid() → UUID()
 * -- 5. DECIMAL 相同
 * -- 其余表结构完全一致
 * ```
 */

/* ═══════════════════════════════════════════════════════════════ */
/*  TypeScript 实体定义                                           */
/* ═══════════════════════════════════════════════════════════════ */

export interface UserEntity {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  role: 'learner' | 'instructor' | 'admin';
  themePref: 'dark' | 'light';
  languagePref: 'zh' | 'en';
  createdAt: string;
  updatedAt: string;
}

export interface CourseEntity {
  id: string;
  slug: string;
  titleZh: string;
  titleEn: string;
  subtitleZh: string;
  subtitleEn: string;
  iconName: string;
  colorFrom: string;
  colorTo: string;
  bgGlow: string;
  imageUrl: string;
  durationZh: string;
  durationEn: string;
  categoryZh: string;
  categoryEn: string;
  sortOrder: number;
  isPublished: boolean;
  modules: CourseModuleEntity[];
}

export interface CourseModuleEntity {
  id: string;
  courseId: string;
  titleZh: string;
  titleEn: string;
  sortOrder: number;
  durationMin: number;
}

export interface EnrollmentEntity {
  id: string;
  userId: string;
  courseId: string;
  status: 'enrolled' | 'in_progress' | 'completed' | 'dropped';
  progress: number;
  startedAt: string | null;
  completedAt: string | null;
}

export interface ProgressRecordEntity {
  id: string;
  userId: string;
  nodeId: string;
  status: 'locked' | 'in_progress' | 'completed';
  progress: number;
  updatedAt: string;
}

export interface SearchLogEntity {
  id: string;
  userId: string | null;
  query: string;
  resultsCount: number;
  category: string | null;
  clickedId: string | null;
  sessionId: string;
  createdAt: string;
}

export interface AnalyticsEventEntity {
  id: string;
  userId: string | null;
  eventType: string;
  eventData: Record<string, unknown>;
  sessionId: string;
  pageSection: string;
  createdAt: string;
}

/* ═══════════════════════════════════════════════════════════════ */
/*  Repository 接口 — 存储适配器抽象                                */
/* ═══════════════════════════════════════════════════════════════ */

export interface DataRepository {
  /** 用户偏好 */
  getUserPreferences(): UserPreferences;
  saveUserPreferences(prefs: Partial<UserPreferences>): void;

  /** 搜索日志 */
  logSearch(entry: Omit<SearchLogEntity, 'id' | 'createdAt'>): void;
  getRecentSearches(limit?: number): string[];
  getTrendingSearches(): string[];

  /** 学习进度 */
  getProgress(): Map<string, number>;
  saveProgress(nodeId: string, progress: number): void;

  /** 分析事件 */
  trackEvent(event: Omit<AnalyticsEventEntity, 'id' | 'createdAt'>): void;

  /** 收藏 */
  getFavorites(): string[];
  toggleFavorite(courseId: string): boolean;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  language: 'zh' | 'en';
  lastVisitedSection: string;
  onboardingComplete: boolean;
}

/* ═══════════════════════════════════════════════════════════════ */
/*  localStorage 适配器实现（原型阶段）                              */
/* ═══════════════════════════════════════════════════════════════ */

const STORAGE_PREFIX = 'yyc3_';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getSessionId(): string {
  let sid = sessionStorage.getItem(`${STORAGE_PREFIX}session_id`);
  if (!sid) {
    sid = generateId();
    sessionStorage.setItem(`${STORAGE_PREFIX}session_id`, sid);
  }
  return sid;
}

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* noop */
  }
  return fallback;
}

function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
  } catch {
    /* noop — quota exceeded 等 */
  }
}

class LocalStorageRepository implements DataRepository {
  getUserPreferences(): UserPreferences {
    return safeGet<UserPreferences>('user_prefs', {
      theme: 'dark',
      language: 'zh',
      lastVisitedSection: 'hero',
      onboardingComplete: false,
    });
  }

  saveUserPreferences(prefs: Partial<UserPreferences>): void {
    const current = this.getUserPreferences();
    safeSet('user_prefs', { ...current, ...prefs });
  }

  logSearch(entry: Omit<SearchLogEntity, 'id' | 'createdAt'>): void {
    const logs = safeGet<SearchLogEntity[]>('search_logs', []);
    logs.push({
      ...entry,
      id: generateId(),
      createdAt: new Date().toISOString(),
    });
    /** 只保留最近 200 条 */
    if (logs.length > 200) logs.splice(0, logs.length - 200);
    safeSet('search_logs', logs);
  }

  getRecentSearches(limit: number = 5): string[] {
    const logs = safeGet<SearchLogEntity[]>('search_logs', []);
    const unique = [...new Set(logs.map((l) => l.query).reverse())];
    return unique.slice(0, limit);
  }

  getTrendingSearches(): string[] {
    const logs = safeGet<SearchLogEntity[]>('search_logs', []);
    const counts: Record<string, number> = {};
    logs.forEach((l) => {
      counts[l.query] = (counts[l.query] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([q]) => q);
  }

  getProgress(): Map<string, number> {
    const data = safeGet<Record<string, number>>('progress', {});
    return new Map(Object.entries(data));
  }

  saveProgress(nodeId: string, progress: number): void {
    const data = safeGet<Record<string, number>>('progress', {});
    data[nodeId] = progress;
    safeSet('progress', data);
  }

  trackEvent(event: Omit<AnalyticsEventEntity, 'id' | 'createdAt'>): void {
    const events = safeGet<AnalyticsEventEntity[]>('analytics', []);
    events.push({
      ...event,
      id: generateId(),
      createdAt: new Date().toISOString(),
    });
    /** 只保留最近 500 条 */
    if (events.length > 500) events.splice(0, events.length - 500);
    safeSet('analytics', events);
  }

  getFavorites(): string[] {
    return safeGet<string[]>('favorites', []);
  }

  toggleFavorite(courseId: string): boolean {
    const favs = this.getFavorites();
    const index = favs.indexOf(courseId);
    if (index >= 0) {
      favs.splice(index, 1);
      safeSet('favorites', favs);
      return false;
    } else {
      favs.push(courseId);
      safeSet('favorites', favs);
      return true;
    }
  }
}

/* ═══════════════════════════════════════════════════════════════ */
/*  导出单例 — 组件通过此实例访问数据                                 */
/* ═══════════════════════════════════════════════════════════════ */

/**
 * 数据服务单例
 *
 * 使用方式：
 * ```tsx
 * import { dataService } from '../services/DataService';
 *
 * // 追踪事件
 * dataService.trackEvent({ eventType: 'page_view', ... });
 *
 * // 保存偏好
 * dataService.saveUserPreferences({ theme: 'light' });
 * ```
 *
 * 生产环境替换：
 * 将 LocalStorageRepository 替换为 SupabaseRepository 或
 * PostgreSQLRepository，接口完全兼容。
 */
export const dataService: DataRepository = new LocalStorageRepository();

/**
 * 获取当前会话 ID
 */
export { getSessionId };
