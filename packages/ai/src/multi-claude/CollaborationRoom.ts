import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

/**
 * 协作房间管理器
 * 支持多人协作房间创建、邀请链接生成、实时状态同步
 */
export class CollaborationRoom extends EventEmitter {
  private rooms: Map<string, Room> = new Map();
  private roomMembers: Map<string, Map<string, RoomMember>> = new Map();
  private inviteLinks: Map<string, InviteLink> = new Map();

  constructor() {
    super();
    this.setupEventHandlers();
  }

  /**
   * 创建新的协作房间
   */
  async createRoom(creator: RoomMember, options: RoomOptions = {}): Promise<Room> {
    const roomId = uuidv4();
    const room: Room = {
      id: roomId,
      name: options.name || `${creator.name}的协作房间`,
      description: options.description || '',
      creatorId: creator.id,
      createdAt: new Date(),
      settings: {
        maxParticipants: options.maxParticipants || 10,
        isPublic: options.isPublic ?? false,
        requireApproval: options.requireApproval ?? false,
        allowRecording: options.allowRecording ?? true,
        password: options.password || null,
        ...options.settings
      },
      status: 'active',
      participants: new Map([[creator.id, creator]]),
      aiTeam: options.aiTeam || this.createDefaultAITeam(),
      metadata: options.metadata || {}
    };

    this.rooms.set(roomId, room);
    this.roomMembers.set(roomId, new Map([[creator.id, creator]]));

    // 将创建者设为管理员
    creator.role = 'admin';
    creator.joinedAt = new Date();
    creator.isActive = true;

    this.emit('roomCreated', room);
    console.log(`🏠 房间创建成功: ${room.name} (${roomId})`);

    return room;
  }

  /**
   * 通过邀请链接加入房间
   */
  async joinRoomByInvite(inviteCode: string, member: RoomMember): Promise<JoinRoomResult> {
    const inviteLink = this.inviteLinks.get(inviteCode);
    if (!inviteLink) {
      throw new Error('无效的邀请链接');
    }

    if (inviteLink.expiresAt && new Date() > inviteLink.expiresAt) {
      throw new Error('邀请链接已过期');
    }

    if (inviteLink.usageLimit && inviteLink.usageCount >= inviteLink.usageLimit) {
      throw new Error('邀请链接使用次数已达上限');
    }

    const room = this.rooms.get(inviteLink.roomId);
    if (!room) {
      throw new Error('房间不存在');
    }

    return this.joinRoom(room.id, member);
  }

  /**
   * 直接加入房间
   */
  async joinRoom(roomId: string, member: RoomMember): Promise<JoinRoomResult> {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error('房间不存在');
    }

    // 检查房间状态
    if (room.status !== 'active') {
      throw new Error('房间未激活');
    }

    // 检查参与者数量限制
    if (room.participants.size >= room.settings.maxParticipants) {
      throw new Error('房间人数已达上限');
    }

    // 检查是否已在房间中
    if (room.participants.has(member.id)) {
      return {
        success: true,
        room,
        member: room.participants.get(member.id)!,
        message: '已在房间中'
      };
    }

    // 设置成员默认值
    member.role = member.role || 'participant';
    member.joinedAt = new Date();
    member.isActive = true;
    member.status = 'online';

    // 添加到房间
    room.participants.set(member.id, member);
    this.roomMembers.get(roomId)!.set(member.id, member);

    // 更新邀请链接使用次数
    this.updateInviteLinkUsage(roomId);

    this.emit('memberJoined', { room, member });
    console.log(`👤 ${member.name} 加入房间: ${room.name}`);

    return {
      success: true,
      room,
      member,
      message: '成功加入房间'
    };
  }

  /**
   * 离开房间
   */
  async leaveRoom(roomId: string, memberId: string): Promise<void> {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error('房间不存在');
    }

    const member = room.participants.get(memberId);
    if (!member) {
      return; // 不在房间中，无需操作
    }

    member.isActive = false;
    member.status = 'offline';
    member.leftAt = new Date();

    room.participants.delete(memberId);
    this.roomMembers.get(roomId)?.delete(memberId);

    // 如果房间创建者离开，转移管理员权限
    if (memberId === room.creatorId && room.participants.size > 0) {
      const nextAdmin = Array.from(room.participants.values())[0];
      nextAdmin.role = 'admin';
      room.creatorId = nextAdmin.id;
      room.participants.set(nextAdmin.id, nextAdmin);
    }

    this.emit('memberLeft', { room, member });
    console.log(`👋 ${member.name} 离开房间: ${room.name}`);

    // 如果房间没有成员了，关闭房间
    if (room.participants.size === 0) {
      this.closeRoom(roomId);
    }
  }

  /**
   * 生成邀请链接
   */
  generateInviteLink(roomId: string, options: InviteOptions = {}): InviteLink {
    const inviteCode = this.generateInviteCode();
    const inviteLink: InviteLink = {
      code: inviteCode,
      roomId,
      url: `${this.getBaseUrl()}/room/${inviteCode}`,
      createdAt: new Date(),
      createdBy: options.createdBy,
      expiresAt: options.expiresAt,
      usageLimit: options.usageLimit,
      usageCount: 0,
      permissions: options.permissions || ['read', 'write'],
      metadata: options.metadata || {}
    };

    this.inviteLinks.set(inviteCode, inviteLink);
    console.log(`🔗 生成邀请链接: ${inviteLink.url}`);

    return inviteLink;
  }

  /**
   * 获取房间信息
   */
  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  /**
   * 获取房间所有成员
   */
  getRoomMembers(roomId: string): RoomMember[] {
    const members = this.roomMembers.get(roomId);
    return members ? Array.from(members.values()) : [];
  }

  /**
   * 获取用户加入的所有房间
   */
  getUserRooms(userId: string): Room[] {
    const userRooms: Room[] = [];
    for (const room of this.rooms.values()) {
      if (room.participants.has(userId)) {
        userRooms.push(room);
      }
    }
    return userRooms;
  }

  /**
   * 更新成员状态
   */
  updateMemberStatus(roomId: string, memberId: string, status: MemberStatus): void {
    const member = this.roomMembers.get(roomId)?.get(memberId);
    if (member) {
      member.status = status;
      member.lastActive = new Date();
      this.emit('memberStatusChanged', { roomId, memberId, status });
    }
  }

  /**
   * 广播消息到房间
   */
  broadcastToRoom(roomId: string, message: any, excludeMemberId?: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    for (const [memberId, member] of room.participants) {
      if (memberId !== excludeMemberId && member.isActive) {
        this.emit('messageToMember', { memberId, message });
      }
    }
  }

  /**
   * 关闭房间
   */
  private closeRoom(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.status = 'closed';
      room.closedAt = new Date();

      // 通知所有成员房间关闭
      this.broadcastToRoom(roomId, { type: 'roomClosed', room });

      // 清理资源
      this.rooms.delete(roomId);
      this.roomMembers.delete(roomId);

      this.emit('roomClosed', room);
      console.log(`🔒 房间已关闭: ${room.name}`);
    }
  }

  /**
   * 创建默认AI团队
   */
  private createDefaultAITeam(): AITeam {
    return {
      leader: {
        id: 'zhang',
        name: '张老师',
        role: 'team_leader',
        avatar: '👨‍🏫',
        status: 'online',
        expertise: ['项目管理', '团队协作', '风险控制']
      },
      members: [
        {
          id: 'li',
          name: '李博士',
          role: 'technical_expert',
          avatar: '👩‍🔬',
          status: 'online',
          expertise: ['技术架构', '代码质量', '系统设计']
        },
        {
          id: 'wang',
          name: '创意王',
          role: 'creative_designer',
          avatar: '🎨',
          status: 'online',
          expertise: ['创意设计', '用户体验', '产品设计']
        },
        {
          id: 'chen',
          name: '陈师傅',
          role: 'quality_guardian',
          avatar: '🔧',
          status: 'online',
          expertise: ['质量管控', '测试管理', '流程优化']
        },
        {
          id: 'zhao',
          name: '数据赵',
          role: 'data_analyst',
          avatar: '📊',
          status: 'online',
          expertise: ['数据分析', '业务洞察', '决策支持']
        }
      ],
      mode: 'collaborative',
      isActive: true
    };
  }

  /**
   * 生成邀请码
   */
  private generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * 获取基础URL
   */
  private getBaseUrl(): string {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return process.env.BASE_URL || 'http://localhost:3002';
  }

  /**
   * 更新邀请链接使用次数
   */
  private updateInviteLinkUsage(roomId: string): void {
    for (const [code, link] of this.inviteLinks) {
      if (link.roomId === roomId && !link.expiresAt || new Date() < link.expiresAt) {
        link.usageCount++;
        break;
      }
    }
  }

  /**
   * 设置事件处理器
   */
  private setupEventHandlers(): void {
    // 定期清理过期的邀请链接
    setInterval(() => {
      const now = new Date();
      for (const [code, link] of this.inviteLinks) {
        if (link.expiresAt && now > link.expiresAt) {
          this.inviteLinks.delete(code);
        }
      }
    }, 60000); // 每分钟清理一次
  }
}

// 类型定义
export interface Room {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  createdAt: Date;
  closedAt?: Date;
  settings: RoomSettings;
  status: 'active' | 'paused' | 'closed';
  participants: Map<string, RoomMember>;
  aiTeam: AITeam;
  metadata: Record<string, any>;
}

export interface RoomSettings {
  maxParticipants: number;
  isPublic: boolean;
  requireApproval: boolean;
  allowRecording: boolean;
  password?: string;
  [key: string]: any;
}

export interface RoomMember {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role: 'admin' | 'moderator' | 'participant';
  status: MemberStatus;
  isActive: boolean;
  joinedAt: Date;
  leftAt?: Date;
  lastActive: Date;
  permissions: string[];
  metadata: Record<string, any>;
}

export type MemberStatus = 'online' | 'offline' | 'away' | 'busy';

export interface AITeam {
  leader: {
    id: string;
    name: string;
    role: string;
    avatar: string;
    status: string;
    expertise: string[];
  };
  members: Array<{
    id: string;
    name: string;
    role: string;
    avatar: string;
    status: string;
    expertise: string[];
  }>;
  mode: string;
  isActive: boolean;
}

export interface InviteLink {
  code: string;
  roomId: string;
  url: string;
  createdAt: Date;
  createdBy?: string;
  expiresAt?: Date;
  usageLimit?: number;
  usageCount: number;
  permissions: string[];
  metadata: Record<string, any>;
}

export interface RoomOptions {
  name?: string;
  description?: string;
  maxParticipants?: number;
  isPublic?: boolean;
  requireApproval?: boolean;
  allowRecording?: boolean;
  password?: string;
  aiTeam?: AITeam;
  settings?: Partial<RoomSettings>;
  metadata?: Record<string, any>;
}

export interface InviteOptions {
  createdBy?: string;
  expiresAt?: Date;
  usageLimit?: number;
  permissions?: string[];
  metadata?: Record<string, any>;
}

export interface JoinRoomResult {
  success: boolean;
  room?: Room;
  member?: RoomMember;
  message: string;
  error?: string;
}