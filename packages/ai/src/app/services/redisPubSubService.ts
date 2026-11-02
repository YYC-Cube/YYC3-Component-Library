/**
 * @file redisPubSubService.ts
 * @description Redis Pub/Sub 长连接服务 — 基于 Tauri 事件系统实现实时消息推送
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-19
 * @updated 2026-03-19
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags redis, pubsub, tauri-event, streaming, realtime
 */

/* ─── 类型定义 ─── */

export interface RedisPubSubEvent {
  /** 事件类型: connected | message | subscribe | unsubscribe | disconnected | error */
  type: string;
  /** 频道名 */
  channel?: string;
  /** 消息数据 (仅 type="message" 时有值) */
  data?: string | null;
  /** 订阅 ID */
  subId: string;
  /** 时间戳 (ms) */
  timestamp?: number;
  /** 错误消息 (仅 type="error" 时有值) */
  message?: string;
  /** 频道列表 (仅 type="connected" 时有值) */
  channels?: string[];
}

export type PubSubEventHandler = (event: RedisPubSubEvent) => void;

/** 订阅连接配置 */
export interface PubSubConnectOptions {
  host?: string;
  port?: number;
  password?: string;
  channels: string[];
  /** 消息回调 */
  onMessage?: (channel: string, data: string) => void;
  /** 连接建立回调 */
  onConnected?: (channels: string[]) => void;
  /** 连接断开回调 */
  onDisconnected?: () => void;
  /** 错误回调 */
  onError?: (message: string) => void;
}

/* ─── 环境检测 ─── */
const isTauri = (): boolean => {
  return typeof window !== "undefined" && "__TAURI__" in window;
};

/* ─── 服务实现 ─── */

class RedisPubSubServiceImpl {
  /** 活跃订阅: subId -> unlisten函数 */
  private subscriptions: Map<string, () => void> = new Map();
  /** 事件处理器: subId -> handlers */
  private handlers: Map<string, Set<PubSubEventHandler>> = new Map();
  /** 模拟订阅的定时器 (非 Tauri 环境) */
  private mockTimers: Map<string, ReturnType<typeof setInterval>> = new Map();

  /**
   * 订阅 Redis 频道 — 建立长连接，通过回调接收实时消息
   *
   * @returns 订阅 ID（用于后续取消订阅）
   */
  async subscribe(options: PubSubConnectOptions): Promise<string> {
    if (isTauri()) {
      return this.subscribeViaTauri(options);
    }
    return this.subscribeViaMock(options);
  }

  /**
   * 取消订阅 — 断开长连接
   */
  async unsubscribe(subId: string): Promise<void> {
    // 清理事件监听
    const unlisten = this.subscriptions.get(subId);
    if (unlisten) {
      unlisten();
      this.subscriptions.delete(subId);
    }

    // 清理处理器
    this.handlers.delete(subId);

    // 清理模拟定时器
    const timer = this.mockTimers.get(subId);
    if (timer) {
      clearInterval(timer);
      this.mockTimers.delete(subId);
    }
  }

  /**
   * 向频道发布消息
   */
  async publish(channel: string, message: string, opts?: { host?: string; port?: number; password?: string }): Promise<number> {
    if (isTauri()) {
      const { invoke } = await import("@tauri-apps/api/core");
      const result = await invoke<{ intValue: number | null }>("db_redis_publish", {
        channel,
        message,
        host: opts?.host,
        port: opts?.port,
        password: opts?.password,
      });
      return result.intValue ?? 0;
    }
    // 模拟: 返回接收者数量
    console.log(`[RedisPubSub Mock] PUBLISH ${channel}: ${message}`);
    return 1;
  }

  /**
   * 获取所有活跃订阅的 ID 列表
   */
  getActiveSubscriptions(): string[] {
    return Array.from(this.subscriptions.keys());
  }

  /**
   * 销毁所有订阅
   */
  async destroyAll(): Promise<void> {
    const ids = Array.from(this.subscriptions.keys());
    await Promise.all(ids.map((id) => this.unsubscribe(id)));
  }

  /* ─── Tauri 真实实现 ─── */
  private async subscribeViaTauri(options: PubSubConnectOptions): Promise<string> {
    const { invoke } = await import("@tauri-apps/api/core");
    const { listen } = await import("@tauri-apps/api/event");

    // 调用 Rust 命令启动后台订阅线程
    const subId = await invoke<string>("db_redis_subscribe_stream", {
      host: options.host,
      port: options.port,
      password: options.password,
      channels: options.channels,
    });

    // 监听 Tauri 事件
    const unlisten = await listen<RedisPubSubEvent>(
      `redis-pubsub-${subId}`,
      (event) => {
        const payload = event.payload;
        this.dispatchEvent(subId, payload, options);
      }
    );

    this.subscriptions.set(subId, unlisten);
    return subId;
  }

  /* ─── 浏览器模拟实现 ─── */
  private async subscribeViaMock(options: PubSubConnectOptions): Promise<string> {
    const subId = `mock-sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    // 模拟连接建立
    setTimeout(() => {
      this.dispatchEvent(subId, {
        type: "connected",
        channels: options.channels,
        subId,
        timestamp: Date.now(),
      }, options);
    }, 100);

    // 模拟订阅确认
    options.channels.forEach((ch, i) => {
      setTimeout(() => {
        this.dispatchEvent(subId, {
          type: "subscribe",
          channel: ch,
          subId,
          timestamp: Date.now(),
        }, options);
      }, 150 + i * 50);
    });

    // 模拟定期消息（每 5 秒一条）
    const timer = setInterval(() => {
      const ch = options.channels[Math.floor(Math.random() * options.channels.length)];
      const mockMessages = [
        `{"event":"update","data":{"id":${Math.floor(Math.random() * 1000)},"status":"active"}}`,
        `{"event":"notification","message":"新任务已创建"}`,
        `{"event":"heartbeat","timestamp":${Date.now()}}`,
        `{"event":"sync","changes":["file_modified","config_updated"]}`,
      ];
      const msg = mockMessages[Math.floor(Math.random() * mockMessages.length)];

      this.dispatchEvent(subId, {
        type: "message",
        channel: ch,
        data: msg,
        subId,
        timestamp: Date.now(),
      }, options);
    }, 5000);

    this.mockTimers.set(subId, timer);

    // 注册一个空的 unlisten
    this.subscriptions.set(subId, () => {});

    return subId;
  }

  /* ─── 事件分发 ─── */
  private dispatchEvent(subId: string, event: RedisPubSubEvent, options: PubSubConnectOptions): void {
    // 调用对应的回调
    switch (event.type) {
      case "connected":
        options.onConnected?.(event.channels || []);
        break;
      case "message":
        if (event.channel && event.data) {
          options.onMessage?.(event.channel, event.data);
        }
        break;
      case "disconnected":
        options.onDisconnected?.();
        break;
      case "error":
        options.onError?.(event.message || "未知错误");
        break;
    }

    // 调用通用处理器
    const handlers = this.handlers.get(subId);
    if (handlers) {
      handlers.forEach((handler) => handler(event));
    }
  }
}

export const redisPubSubService = new RedisPubSubServiceImpl();
