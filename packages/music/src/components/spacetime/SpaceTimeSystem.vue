<template>
  <div class="space-time-system">
    <!-- 顶部导航 -->
    <div class="header">
      <h1>时空喊话系统</h1>
      <div class="nav-buttons">
        <button @click="activeTab = 'send'" :class="{ active: activeTab === 'send' }">发送消息</button>
        <button @click="activeTab = 'received'" :class="{ active: activeTab === 'received' }">收到的消息</button>
        <button @click="activeTab = 'capsules'" :class="{ active: activeTab === 'capsules' }">时空胶囊</button>
        <button @click="activeTab = 'walls'" :class="{ active: activeTab === 'walls' }">消息墙</button>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="content">
      <!-- 发送消息面板 -->
      <div v-if="activeTab === 'send'" class="send-message-panel">
        <div class="message-type-selector">
          <label>
            <input type="radio" value="text" v-model="messageType" /> 文字消息
          </label>
          <label>
            <input type="radio" value="voice" v-model="messageType" /> 语音消息
          </label>
        </div>

        <!-- 文字消息输入 -->
        <div v-if="messageType === 'text'" class="text-input-container">
          <textarea v-model="textMessage" placeholder="输入你的时空喊话..." rows="5"></textarea>
        </div>

        <!-- 语音消息输入 -->
        <div v-else-if="messageType === 'voice'" class="voice-input-container">
          <div class="recording-controls">
            <button @click="toggleRecording" :disabled="isRecording">
              {{ isRecording ? '停止录音' : '开始录音' }}
            </button>
            <span v-if="isRecording" class="recording-indicator">录音中...</span>
          </div>
          <div v-if="audioPreviewUrl" class="audio-preview">
            <audio :src="audioPreviewUrl" controls></audio>
          </div>
          <div v-if="audioWaveform.length > 0" class="audio-waveform">
            <div
              v-for="(value, index) in audioWaveform"
              :key="index"
              class="waveform-bar"
              :style="{ height: value + '%' }"
            ></div>
          </div>
        </div>

        <!-- 时空条件设置 -->
        <div class="space-time-conditions">
          <h3>时空条件</h3>
          <div class="condition-group">
            <label>触发类型：</label>
            <select v-model="triggerType">
              <option value="immediate">立即发送</option>
              <option value="time">定时发送</option>
              <option value="location">定位触发</option>
              <option value="both">时间和位置双重触发</option>
            </select>
          </div>

          <div v-if="triggerType === 'time' || triggerType === 'both'" class="condition-group">
            <label>触发时间：</label>
            <input type="datetime-local" v-model="triggerTime" />
          </div>

          <div v-if="triggerType === 'location' || triggerType === 'both'" class="condition-group">
            <label>触发位置：</label>
            <div class="location-input">
              <input type="text" v-model="locationName" placeholder="位置名称" />
              <input type="number" v-model.number="latitude" placeholder="纬度" step="0.000001" />
              <input type="number" v-model.number="longitude" placeholder="经度" step="0.000001" />
              <input type="number" v-model.number="radius" placeholder="触发半径(米)" min="1" />
            </div>
            <button @click="getCurrentLocation" class="location-button">获取当前位置</button>
          </div>

          <div v-if="triggerType === 'location' || triggerType === 'both'" class="condition-group">
            <label>可见范围：</label>
            <select v-model="visibilityRange">
              <option value="public">公开</option>
              <option value="friends">仅好友可见</option>
              <option value="private">私密(仅指定用户可见)</option>
            </select>
            <div v-if="visibilityRange === 'private'" class="private-users">
              <input type="text" v-model="privateUserIds" placeholder="输入用户ID，用逗号分隔" />
            </div>
          </div>
        </div>

        <!-- 发送按钮 -->
        <div class="action-buttons">
          <button @click="sendMessage" :disabled="!canSendMessage" class="primary-button">
            发送消息
          </button>
          <button @click="clearForm" class="secondary-button">
            清空
          </button>
        </div>
      </div>

      <!-- 收到的消息面板 -->
      <div v-else-if="activeTab === 'received'" class="received-messages-panel">
        <div class="message-filters">
          <select v-model="messageFilter">
            <option value="all">全部消息</option>
            <option value="unread">未读消息</option>
            <option value="text">文字消息</option>
            <option value="voice">语音消息</option>
            <option value="expired">已过期</option>
          </select>
        </div>

        <div class="messages-list">
          <div v-if="filteredMessages.length === 0" class="empty-state">
            暂无消息
          </div>
          <div
            v-for="message in filteredMessages"
            :key="message.id"
            class="message-item"
            :class="{ unread: !message.isRead }"
          >
            <div class="message-header">
              <span class="sender">{{ message.senderName || '匿名用户' }}</span>
              <span class="timestamp">{{ formatDate(message.timestamp) }}</span>
              <span v-if="!message.isRead" class="unread-indicator">●</span>
            </div>
            
            <div class="message-content">
              <template v-if="message.content.type === 'text'">
                <p>{{ message.content.text }}</p>
              </template>
              <template v-else-if="message.content.type === 'voice'">
                <audio :src="getAudioUrl(message.content.audioUrl)" controls></audio>
                <div v-if="message.content.transcript" class="voice-transcript">
                  {{ message.content.transcript }}
                </div>
              </template>
            </div>

            <div v-if="message.location" class="message-location">
              <i class="location-icon"></i>
              <span>{{ message.location.name }} ({{ message.location.latitude.toFixed(6) }}, {{ message.location.longitude.toFixed(6) }})</span>
            </div>

            <div class="message-actions">
              <button @click="markAsRead(message.id)" v-if="!message.isRead">标记为已读</button>
              <button @click="replyToMessage(message)" :disabled="message.isExpired">回复</button>
              <button @click="deleteMessage(message.id)">删除</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 时空胶囊面板 -->
      <div v-else-if="activeTab === 'capsules'" class="space-time-capsules-panel">
        <div class="capsules-list">
          <div v-if="spaceTimeCapsules.length === 0" class="empty-state">
            暂无时空胶囊
          </div>
          <div v-for="capsule in spaceTimeCapsules" :key="capsule.id" class="capsule-item">
            <div class="capsule-header">
              <h3>{{ capsule.name || '时空胶囊' }}</h3>
              <span class="status">{{ capsule.isOpened ? '已开启' : '未开启' }}</span>
            </div>
            
            <div class="capsule-details">
              <div class="creation-info">
                <span>创建于: {{ formatDate(capsule.creationTime) }}</span>
                <span>创建者: {{ capsule.creatorName || '匿名用户' }}</span>
              </div>
              
              <div class="trigger-info">
                <div v-if="capsule.triggerTime">
                  <label>触发时间:</label>
                  <span>{{ formatDate(capsule.triggerTime) }}</span>
                </div>
                
                <div v-if="capsule.triggerLocation">
                  <label>触发位置:</label>
                  <span>{{ capsule.triggerLocation.name }} ({{ capsule.triggerLocation.latitude.toFixed(6) }}, {{ capsule.triggerLocation.longitude.toFixed(6) }})</span>
                </div>
              </div>
            </div>

            <div class="capsule-messages" v-if="capsule.isOpened">
              <h4>胶囊中的消息 ({{ capsule.messages.length }})</h4>
              <div v-for="msg in capsule.messages" :key="msg.id" class="capsule-message">
                <div v-if="msg.content.type === 'text'">
                  {{ msg.content.text }}
                </div>
                <div v-else-if="msg.content.type === 'voice'">
                  <audio :src="getAudioUrl(msg.content.audioUrl)" controls></audio>
                </div>
              </div>
            </div>

            <div class="capsule-actions">
              <button
                @click="openCapsule(capsule.id)"
                :disabled="capsule.isOpened || !canOpenCapsule(capsule)"
              >
                {{ capsule.isOpened ? '已开启' : (canOpenCapsule(capsule) ? '开启胶囊' : '未到开启条件') }}
              </button>
              <button @click="deleteCapsule(capsule.id)" v-if="capsule.creatorId === currentUserId">
                删除胶囊
              </button>
            </div>
          </div>
        </div>

        <!-- 创建胶囊按钮 -->
        <button @click="showCreateCapsuleModal = true" class="create-capsule-button">
          创建时空胶囊
        </button>

        <!-- 创建胶囊模态框 -->
        <div v-if="showCreateCapsuleModal" class="modal-overlay" @click="showCreateCapsuleModal = false">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h2>创建时空胶囊</h2>
              <button @click="showCreateCapsuleModal = false" class="close-button">×</button>
            </div>
            
            <div class="modal-body">
              <div class="form-group">
                <label>胶囊名称：</label>
                <input type="text" v-model="newCapsuleName" placeholder="为你的胶囊命名" />
              </div>
              
              <div class="form-group">
                <label>触发类型：</label>
                <select v-model="newCapsuleTriggerType">
                  <option value="time">定时开启</option>
                  <option value="location">定位开启</option>
                  <option value="both">时间和位置双重开启</option>
                </select>
              </div>
              
              <div v-if="newCapsuleTriggerType === 'time' || newCapsuleTriggerType === 'both'" class="form-group">
                <label>开启时间：</label>
                <input type="datetime-local" v-model="newCapsuleTriggerTime" />
              </div>
              
              <div v-if="newCapsuleTriggerType === 'location' || newCapsuleTriggerType === 'both'" class="form-group">
                <label>开启位置：</label>
                <div class="location-input">
                  <input type="text" v-model="newCapsuleLocationName" placeholder="位置名称" />
                  <input type="number" v-model.number="newCapsuleLatitude" placeholder="纬度" step="0.000001" />
                  <input type="number" v-model.number="newCapsuleLongitude" placeholder="经度" step="0.000001" />
                  <input type="number" v-model.number="newCapsuleRadius" placeholder="触发半径(米)" min="1" />
                </div>
                <button @click="getCurrentLocationForCapsule" class="location-button">获取当前位置</button>
              </div>
              
              <div class="form-group">
                <label>胶囊消息：</label>
                <textarea v-model="newCapsuleMessage" placeholder="输入胶囊中的消息..." rows="3"></textarea>
              </div>
              
              <div class="form-group">
                <label>可开启人数：</label>
                <input type="number" v-model.number="newCapsuleMaxOpens" min="1" placeholder="默认无限制" />
                <small>留空表示无限制</small>
              </div>
            </div>
            
            <div class="modal-footer">
              <button @click="createCapsule" class="primary-button">创建</button>
              <button @click="showCreateCapsuleModal = false" class="secondary-button">取消</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 消息墙面板 -->
      <div v-else-if="activeTab === 'walls'" class="message-walls-panel">
        <div class="walls-list">
          <div v-if="messageWalls.length === 0" class="empty-state">
            暂无消息墙
          </div>
          <div v-for="wall in messageWalls" :key="wall.id" class="wall-item">
            <div class="wall-header">
              <h3>{{ wall.name }}</h3>
              <span class="message-count">{{ wall.messages.length }} 条消息</span>
            </div>
            
            <div class="wall-details">
              <div class="creation-info">
                <span>创建于: {{ formatDate(wall.creationTime) }}</span>
                <span>创建者: {{ wall.creatorName || '匿名用户' }}</span>
              </div>
              
              <div class="wall-description">
                {{ wall.description || '暂无描述' }}
              </div>
            </div>

            <div class="wall-actions">
              <button @click="viewWall(wall.id)">查看消息墙</button>
              <button @click="addMessageToWall(wall.id)" v-if="wall.isActive">添加消息</button>
              <button @click="deleteWall(wall.id)" v-if="wall.creatorId === currentUserId">
                删除消息墙
              </button>
            </div>
          </div>
        </div>

        <!-- 创建消息墙按钮 -->
        <button @click="showCreateWallModal = true" class="create-wall-button">
          创建消息墙
        </button>

        <!-- 创建消息墙模态框 -->
        <div v-if="showCreateWallModal" class="modal-overlay" @click="showCreateWallModal = false">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h2>创建消息墙</h2>
              <button @click="showCreateWallModal = false" class="close-button">×</button>
            </div>
            
            <div class="modal-body">
              <div class="form-group">
                <label>消息墙名称：</label>
                <input type="text" v-model="newWallName" placeholder="为你的消息墙命名" />
              </div>
              
              <div class="form-group">
                <label>描述：</label>
                <textarea v-model="newWallDescription" placeholder="描述你的消息墙..." rows="3"></textarea>
              </div>
              
              <div class="form-group">
                <label>位置：</label>
                <div class="location-input">
                  <input type="text" v-model="newWallLocationName" placeholder="位置名称" />
                  <input type="number" v-model.number="newWallLatitude" placeholder="纬度" step="0.000001" />
                  <input type="number" v-model.number="newWallLongitude" placeholder="经度" step="0.000001" />
                  <input type="number" v-model.number="newWallRadius" placeholder="覆盖半径(米)" min="1" />
                </div>
                <button @click="getCurrentLocationForWall" class="location-button">获取当前位置</button>
              </div>
              
              <div class="form-group">
                <label>访问权限：</label>
                <select v-model="newWallAccessType">
                  <option value="public">公开</option>
                  <option value="private">私有</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>是否启用：</label>
                <input type="checkbox" v-model="newWallIsActive" />
              </div>
            </div>
            
            <div class="modal-footer">
              <button @click="createWall" class="primary-button">创建</button>
              <button @click="showCreateWallModal = false" class="secondary-button">取消</button>
            </div>
          </div>
        </div>

        <!-- 消息墙详情模态框 -->
        <div v-if="showWallDetailModal" class="modal-overlay" @click="showWallDetailModal = false">
          <div class="modal-content wall-detail-modal" @click.stop>
            <div class="modal-header">
              <h2>{{ selectedWall?.name }}</h2>
              <button @click="showWallDetailModal = false" class="close-button">×</button>
            </div>
            
            <div class="modal-body">
              <div class="wall-detail-info">
                <p>{{ selectedWall?.description }}</p>
                <p><strong>创建时间：</strong>{{ formatDate(selectedWall?.creationTime || '') }}</p>
                <p><strong>创建者：</strong>{{ selectedWall?.creatorName }}</p>
                <p v-if="selectedWall?.location">
                  <strong>位置：</strong>{{ selectedWall.location.name }} ({{ selectedWall.location.latitude.toFixed(6) }}, {{ selectedWall.location.longitude.toFixed(6) }})
                </p>
              </div>
              
              <div class="wall-messages">
                <h3>消息列表 ({{ wallMessagesInDetail.length }})</h3>
                <div v-if="wallMessagesInDetail.length === 0" class="empty-state">
                  暂无消息
                </div>
                <div v-for="msg in wallMessagesInDetail" :key="msg.id" class="wall-message">
                  <div class="message-header">
                    <span class="sender">{{ msg.senderName || '匿名用户' }}</span>
                    <span class="timestamp">{{ formatDate(msg.timestamp) }}</span>
                  </div>
                  
                  <div class="message-content">
                    <template v-if="msg.content.type === 'text'">
                      <p>{{ msg.content.text }}</p>
                    </template>
                    <template v-else-if="msg.content.type === 'voice'">
                      <audio :src="getAudioUrl(msg.content.audioUrl)" controls></audio>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 添加消息到消息墙模态框 -->
        <div v-if="showAddMessageToWallModal" class="modal-overlay" @click="showAddMessageToWallModal = false">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h2>添加消息到消息墙</h2>
              <button @click="showAddMessageToWallModal = false" class="close-button">×</button>
            </div>
            
            <div class="modal-body">
              <div class="form-group">
                <label>选择消息墙：</label>
                <select v-model="selectedWallIdForMessage">
                  <option v-for="wall in messageWalls" :key="wall.id" :value="wall.id">
                    {{ wall.name }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label>消息类型：</label>
                <label>
                  <input type="radio" value="text" v-model="wallMessageType" />
                  文字消息
                </label>
                <label>
                  <input type="radio" value="voice" v-model="wallMessageType" />
                  语音消息
                </label>
              </div>
              
              <div v-if="wallMessageType === 'text'" class="form-group">
                <label>消息内容：</label>
                <textarea v-model="wallTextMessage" placeholder="输入消息内容..." rows="3"></textarea>
              </div>
              
              <div v-else-if="wallMessageType === 'voice'" class="form-group">
                <label>语音消息：</label>
                <div class="recording-controls">
                  <button @click="toggleWallRecording" :disabled="isWallRecording">
                    {{ isWallRecording ? '停止录音' : '开始录音' }}
                  </button>
                  <span v-if="isWallRecording" class="recording-indicator">录音中...</span>
                </div>
                <div v-if="wallAudioPreviewUrl" class="audio-preview">
                  <audio :src="wallAudioPreviewUrl" controls></audio>
                </div>
              </div>
              
              <div class="form-group">
                <label>
                  <input type="checkbox" v-model="wallMessageAnonymous" />
                  匿名发送
                </label>
              </div>
            </div>
            
            <div class="modal-footer">
              <button @click="submitMessageToWall" class="primary-button">发送</button>
              <button @click="showAddMessageToWallModal = false" class="secondary-button">取消</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { spaceTimeService } from '@/services/spaceTimeService';
import { webRTCService } from '@/services/WebRTCService';
import type {
  SpaceTimeMessage,
  MessageContent,
  SpaceTimeCapsule,
  MessageWall,
  Location
} from '@/types/spacetime';

// 状态管理
const activeTab = ref<'send' | 'received' | 'capsules' | 'walls'>('send');
const currentUserId = ref('user_123'); // 实际应用中应该从认证系统获取

// 发送消息相关状态
const messageType = ref<'text' | 'voice'>('text');
const textMessage = ref('');
const isRecording = ref(false);
const audioPreviewUrl = ref('');
const audioWaveform = ref<number[]>([]);
const recordedAudioBlob = ref<Blob | null>(null);
const triggerType = ref<'immediate' | 'time' | 'location' | 'both'>('immediate');
const triggerTime = ref('');
const locationName = ref('');
const latitude = ref<number | null>(null);
const longitude = ref<number | null>(null);
const radius = ref<number>(100);
const visibilityRange = ref<'public' | 'friends' | 'private'>('public');
const privateUserIds = ref('');

// 收到的消息相关状态
const receivedMessages = ref<SpaceTimeMessage[]>([]);
const messageFilter = ref<'all' | 'unread' | 'text' | 'voice' | 'expired'>('all');

// 时空胶囊相关状态
const spaceTimeCapsules = ref<SpaceTimeCapsule[]>([]);
const showCreateCapsuleModal = ref(false);
const newCapsuleName = ref('');
const newCapsuleTriggerType = ref<'time' | 'location' | 'both'>('time');
const newCapsuleTriggerTime = ref('');
const newCapsuleLocationName = ref('');
const newCapsuleLatitude = ref<number | null>(null);
const newCapsuleLongitude = ref<number | null>(null);
const newCapsuleRadius = ref<number>(100);
const newCapsuleMessage = ref('');
const newCapsuleMaxOpens = ref<number | null>(null);

// 消息墙相关状态
const messageWalls = ref<MessageWall[]>([]);
const showCreateWallModal = ref(false);
const newWallName = ref('');
const newWallDescription = ref('');
const newWallLocationName = ref('');
const newWallLatitude = ref<number | null>(null);
const newWallLongitude = ref<number | null>(null);
const newWallRadius = ref<number>(100);
const newWallAccessType = ref<'public' | 'private'>('public');
const newWallIsActive = ref(true);
const showWallDetailModal = ref(false);
const selectedWall = ref<MessageWall | null>(null);
const wallMessagesInDetail = ref<SpaceTimeMessage[]>([]);
const showAddMessageToWallModal = ref(false);
const selectedWallIdForMessage = ref('');
const wallMessageType = ref<'text' | 'voice'>('text');
const wallTextMessage = ref('');
const isWallRecording = ref(false);
const wallAudioPreviewUrl = ref('');
const wallAudioBlob = ref<Blob | null>(null);
const wallMessageAnonymous = ref(false);

// 计算属性
const canSendMessage = computed(() => {
  if (messageType.value === 'text' && !textMessage.value.trim()) {
    return false;
  }
  if (messageType.value === 'voice' && !recordedAudioBlob.value) {
    return false;
  }
  
  if (triggerType.value === 'location' || triggerType.value === 'both') {
    if (!latitude.value || !longitude.value || !radius.value) {
      return false;
    }
  }
  
  if (triggerType.value === 'time' || triggerType.value === 'both') {
    if (!triggerTime.value) {
      return false;
    }
  }
  
  return true;
});

const filteredMessages = computed(() => {
  return receivedMessages.value.filter(message => {
    if (messageFilter.value === 'all') return true;
    if (messageFilter.value === 'unread' && message.isRead) return false;
    if (messageFilter.value === 'text' && message.content.type !== 'text') return false;
    if (messageFilter.value === 'voice' && message.content.type !== 'voice') return false;
    if (messageFilter.value === 'expired' && !message.isExpired) return false;
    return true;
  });
});

// 生命周期
onMounted(() => {
  loadReceivedMessages();
  loadSpaceTimeCapsules();
  loadMessageWalls();
});

// 方法
async function loadReceivedMessages() {
  try {
    const messages = await spaceTimeService.getUserMessages(currentUserId.value);
    receivedMessages.value = messages;
  } catch (error) {
    console.error('Failed to load received messages:', error);
  }
}

async function loadSpaceTimeCapsules() {
  try {
    const capsules = await spaceTimeService.getUserCapsules(currentUserId.value);
    spaceTimeCapsules.value = capsules;
  } catch (error) {
    console.error('Failed to load space-time capsules:', error);
  }
}

async function loadMessageWalls() {
  try {
    const walls = await spaceTimeService.getMessageWalls(currentUserId.value);
    messageWalls.value = walls;
  } catch (error) {
    console.error('Failed to load message walls:', error);
  }
}

async function toggleRecording() {
  if (isRecording.value) {
    // 停止录音
    try {
      const { audioBlob, waveform } = await webRTCService.stopRecording();
      recordedAudioBlob.value = audioBlob;
      audioWaveform.value = waveform;
      
      // 创建预览URL
      if (audioPreviewUrl.value) {
        URL.revokeObjectURL(audioPreviewUrl.value);
      }
      audioPreviewUrl.value = URL.createObjectURL(audioBlob);
      
      isRecording.value = false;
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  } else {
    // 开始录音
    try {
      await webRTCService.startRecording();
      isRecording.value = true;
      recordedAudioBlob.value = null;
      if (audioPreviewUrl.value) {
        URL.revokeObjectURL(audioPreviewUrl.value);
        audioPreviewUrl.value = '';
      }
      audioWaveform.value = [];
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  }
}

async function toggleWallRecording() {
  if (isWallRecording.value) {
    // 停止录音
    try {
      const { audioBlob } = await webRTCService.stopRecording();
      wallAudioBlob.value = audioBlob;
      
      // 创建预览URL
      if (wallAudioPreviewUrl.value) {
        URL.revokeObjectURL(wallAudioPreviewUrl.value);
      }
      wallAudioPreviewUrl.value = URL.createObjectURL(audioBlob);
      
      isWallRecording.value = false;
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  } else {
    // 开始录音
    try {
      await webRTCService.startRecording();
      isWallRecording.value = true;
      wallAudioBlob.value = null;
      if (wallAudioPreviewUrl.value) {
        URL.revokeObjectURL(wallAudioPreviewUrl.value);
        wallAudioPreviewUrl.value = '';
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  }
}

async function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude.value = position.coords.latitude;
        longitude.value = position.coords.longitude;
        locationName.value = '当前位置';
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('无法获取当前位置，请手动输入');
      }
    );
  } else {
    alert('浏览器不支持地理定位');
  }
}

async function getCurrentLocationForCapsule() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        newCapsuleLatitude.value = position.coords.latitude;
        newCapsuleLongitude.value = position.coords.longitude;
        newCapsuleLocationName.value = '当前位置';
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('无法获取当前位置，请手动输入');
      }
    );
  } else {
    alert('浏览器不支持地理定位');
  }
}

async function getCurrentLocationForWall() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        newWallLatitude.value = position.coords.latitude;
        newWallLongitude.value = position.coords.longitude;
        newWallLocationName.value = '当前位置';
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('无法获取当前位置，请手动输入');
      }
    );
  } else {
    alert('浏览器不支持地理定位');
  }
}

async function sendMessage() {
  try {
    let content: MessageContent;
    
    if (messageType.value === 'text') {
      content = {
        type: 'text',
        data: {
          text: textMessage.value
        }
      };
    } else {
      // 语音消息
      if (!recordedAudioBlob.value) {
        throw new Error('No audio recorded');
      }
      
      // 上传音频文件
      const audioUrl = await spaceTimeService.uploadAudio(recordedAudioBlob.value);
      
      // 生成波形数据（简化版）
      const waveform = audioWaveform.value.length > 0 
        ? audioWaveform.value 
        : Array.from({ length: 50 }, () => Math.floor(Math.random() * 100));
      
      // 语音转文字（简化版）
      const transcript = await spaceTimeService.convertVoiceToText();
      
      content = {
        type: 'voice',
        data: {
          audioUrl,
          waveform,
          duration: 0, // 实际应用中应计算音频时长
          transcript
        }
      };
    }
    
    // 构建位置对象
    let location: Location | undefined;
    if (triggerType.value === 'location' || triggerType.value === 'both') {
      location = {
        name: locationName.value,
        latitude: latitude.value!,
        longitude: longitude.value!,
        radius: radius.value
      };
    }
    
    // 构建消息对象
    const message: SpaceTimeMessage = {
      senderId: currentUserId.value,
      senderName: '当前用户', // 实际应用中应从用户信息获取
      content,
      timestamp: new Date().toISOString(),
      // 修复Ref类型赋值问题，使用.value
      triggerType: triggerType.value,
      triggerTime: triggerType.value === 'time' || triggerType.value === 'both' ? triggerTime.value : undefined,
      location,
      // 修复Ref类型赋值问题，使用.value
      visibilityRange: visibilityRange.value,
      privateUserIds: visibilityRange.value === 'private' ? privateUserIds.value.split(',').map(id => id.trim()) : undefined,
      isRead: false,
      isExpired: false
    };
    
    // 发送消息
    await spaceTimeService.sendMessage(message);
    
    // 清空表单
    clearForm();
    
    // 显示成功提示
    alert('消息发送成功！');
  } catch (error) {
    console.error('Failed to send message:', error);
    alert('发送失败，请重试');
  }
}

function clearForm() {
  messageType.value = 'text';
  textMessage.value = '';
  isRecording.value = false;
  if (audioPreviewUrl.value) {
    URL.revokeObjectURL(audioPreviewUrl.value);
    audioPreviewUrl.value = '';
  }
  recordedAudioBlob.value = null;
  audioWaveform.value = [];
  triggerType.value = 'immediate';
  triggerTime.value = '';
  locationName.value = '';
  latitude.value = null;
  longitude.value = null;
  radius.value = 100;
  visibilityRange.value = 'public';
  privateUserIds.value = '';
}

async function markAsRead(messageId: string) {
  try {
    await spaceTimeService.markMessageAsRead(messageId);
    const message = receivedMessages.value.find(m => m.id === messageId);
    if (message) {
      message.isRead = true;
    }
  } catch (error) {
    console.error('Failed to mark message as read:', error);
  }
}

async function replyToMessage(message: SpaceTimeMessage) {
  try {
    // 简化的回复逻辑，实际应用中应该打开回复对话框
    activeTab.value = 'send';
    messageType.value = 'text';
    textMessage.value = `回复 @${message.senderName || '匿名用户'}: `;
  } catch (error) {
    console.error('Failed to reply to message:', error);
  }
}

async function deleteMessage(messageId: string) {
  try {
    await spaceTimeService.deleteMessage(messageId);
    receivedMessages.value = receivedMessages.value.filter(m => m.id !== messageId);
  } catch (error) {
    console.error('Failed to delete message:', error);
  }
}

async function createCapsule() {
  try {
    // 构建位置对象
    let location: Location | undefined;
    if (newCapsuleTriggerType.value === 'location' || newCapsuleTriggerType.value === 'both') {
      location = {
        name: newCapsuleLocationName.value,
        latitude: newCapsuleLatitude.value!,
        longitude: newCapsuleLongitude.value!,
        radius: newCapsuleRadius.value
      };
    }
    
    // 创建胶囊
    const capsule = await spaceTimeService.createCapsule({
      name: newCapsuleName.value,
      creatorId: currentUserId.value,
      creatorName: '当前用户', // 实际应用中应从用户信息获取
      messages: [
        {
          senderId: currentUserId.value,
          senderName: '当前用户',
          content: {
            type: 'text',
            data: {
              text: newCapsuleMessage.value
            }
          },
          timestamp: new Date().toISOString(),
          isRead: false,
          isExpired: false
        }
      ],
      creationTime: new Date().toISOString(),
      triggerType: newCapsuleTriggerType.value,
      triggerTime: newCapsuleTriggerType.value === 'time' || newCapsuleTriggerType.value === 'both' ? newCapsuleTriggerTime.value : undefined,
      triggerLocation: location,
      isOpened: false,
      maxOpens: newCapsuleMaxOpens.value || undefined
    });
    
    // 添加到列表
    spaceTimeCapsules.value.push(capsule);
    
    // 关闭模态框
    showCreateCapsuleModal.value = false;
    
    // 清空表单
    clearCapsuleForm();
    
    // 显示成功提示
    alert('时空胶囊创建成功！');
  } catch (error) {
    console.error('Failed to create capsule:', error);
    alert('创建失败，请重试');
  }
}

function clearCapsuleForm() {
  newCapsuleName.value = '';
  newCapsuleTriggerType.value = 'time';
  newCapsuleTriggerTime.value = '';
  newCapsuleLocationName.value = '';
  newCapsuleLatitude.value = null;
  newCapsuleLongitude.value = null;
  newCapsuleRadius.value = 100;
  newCapsuleMessage.value = '';
  newCapsuleMaxOpens.value = null;
}

function canOpenCapsule(capsule: SpaceTimeCapsule): boolean {
  // 简化的开启条件检查，实际应用中应该更复杂
  if (capsule.isOpened) return false;
  
  // 检查时间条件
  if (capsule.triggerTime) {
    const now = new Date();
    const triggerTime = new Date(capsule.triggerTime);
    if (now < triggerTime) {
      return false;
    }
  }
  
  // 检查位置条件
  if (capsule.triggerLocation) {
    // 实际应用中应该检查用户当前位置是否在触发范围内
    // 这里简化处理，假设用户位置符合条件
  }
  
  // 检查最大开启次数
  if (capsule.maxOpens && capsule.opensCount && capsule.opensCount >= capsule.maxOpens) {
    return false;
  }
  
  return true;
}

async function openCapsule(capsuleId: string) {
  try {
    await spaceTimeService.openCapsule(capsuleId);
    
    // 更新本地状态
    const capsule = spaceTimeCapsules.value.find(c => c.id === capsuleId);
    if (capsule) {
      capsule.isOpened = true;
      capsule.opensCount = (capsule.opensCount || 0) + 1;
    }
    
    // 显示成功提示
    alert('时空胶囊已开启！');
  } catch (error) {
    console.error('Failed to open capsule:', error);
    alert('开启失败，请重试');
  }
}

async function deleteCapsule(capsuleId: string) {
  try {
    await spaceTimeService.deleteCapsule(capsuleId);
    spaceTimeCapsules.value = spaceTimeCapsules.value.filter(c => c.id !== capsuleId);
  } catch (error) {
    console.error('Failed to delete capsule:', error);
  }
}

async function createWall() {
  try {
    // 构建位置对象
    let location: Location | undefined;
    if (newWallLatitude.value && newWallLongitude.value) {
      location = {
        name: newWallLocationName.value,
        latitude: newWallLatitude.value,
        longitude: newWallLongitude.value,
        radius: newWallRadius.value
      };
    }
    
    // 创建消息墙
    const wall = await spaceTimeService.createMessageWall({
      name: newWallName.value,
      description: newWallDescription.value,
      creatorId: currentUserId.value,
      creatorName: '当前用户', // 实际应用中应从用户信息获取
      messages: [],
      creationTime: new Date().toISOString(),
      location,
      accessType: newWallAccessType.value,
      isActive: newWallIsActive.value
    });
    
    // 添加到列表
    messageWalls.value.push(wall);
    
    // 关闭模态框
    showCreateWallModal.value = false;
    
    // 清空表单
    clearWallForm();
    
    // 显示成功提示
    alert('消息墙创建成功！');
  } catch (error) {
    console.error('Failed to create wall:', error);
    alert('创建失败，请重试');
  }
}

function clearWallForm() {
  newWallName.value = '';
  newWallDescription.value = '';
  newWallLocationName.value = '';
  newWallLatitude.value = null;
  newWallLongitude.value = null;
  newWallRadius.value = 100;
  newWallAccessType.value = 'public';
  newWallIsActive.value = true;
}

async function viewWall(wallId: string) {
  try {
    const wall = messageWalls.value.find(w => w.id === wallId);
    if (wall) {
      selectedWall.value = wall;
      
      // 获取消息墙的消息
      const messages = await spaceTimeService.getWallMessages(wallId);
      wallMessagesInDetail.value = messages;
      
      // 打开详情模态框
      showWallDetailModal.value = true;
    }
  } catch (error) {
    console.error('Failed to view wall:', error);
  }
}

function addMessageToWall(wallId: string) {
  selectedWallIdForMessage.value = wallId;
  showAddMessageToWallModal.value = true;
}

async function submitMessageToWall() {
  try {
    let content: MessageContent;
    
    if (wallMessageType.value === 'text') {
      content = {
        type: 'text',
        data: {
          text: wallTextMessage.value
        }
      };
    } else {
      // 语音消息
      if (!wallAudioBlob.value) {
        throw new Error('No audio recorded');
      }
      
      // 上传音频文件
      const audioUrl = await spaceTimeService.uploadAudio(wallAudioBlob.value);
      
      // 语音转文字（简化版）
      const transcript = await spaceTimeService.convertVoiceToText();
      
      content = {
        type: 'voice',
        data: {
          audioUrl,
          waveform: [], // 简化版
          duration: 0, // 简化版
          transcript
        }
      };
    }
    
    // 构建消息对象
    const message: Omit<SpaceTimeMessage, 'id'> = {
      senderId: currentUserId.value,
      // 修复可能的undefined问题
      senderName: wallMessageAnonymous.value ? '' : '当前用户',
      content,
      timestamp: new Date().toISOString(),
      triggerType: 'immediate',
      isRead: false,
      isExpired: false
    };
    
    // 添加消息到消息墙
    await spaceTimeService.addMessageToWall(selectedWallIdForMessage.value, message);
    
    // 更新本地状态
    const wall = messageWalls.value.find(w => w.id === selectedWallIdForMessage.value);
    if (wall) {
      if (!wall.messages) {
        wall.messages = [];
      }
      wall.messages.push(message as SpaceTimeMessage);
    }
    
    // 关闭模态框
    showAddMessageToWallModal.value = false;
    
    // 清空表单
    clearWallMessageForm();
    
    // 显示成功提示
    alert('消息已添加到消息墙！');
  } catch (error) {
    console.error('Failed to submit message to wall:', error);
    alert('添加失败，请重试');
  }
}

function clearWallMessageForm() {
  wallMessageType.value = 'text';
  wallTextMessage.value = '';
  isWallRecording.value = false;
  if (wallAudioPreviewUrl.value) {
    URL.revokeObjectURL(wallAudioPreviewUrl.value);
    wallAudioPreviewUrl.value = '';
  }
  wallAudioBlob.value = null;
  wallMessageAnonymous.value = false;
}

async function deleteWall(wallId: string) {
  try {
    await spaceTimeService.deleteMessageWall(wallId);
    messageWalls.value = messageWalls.value.filter(w => w.id !== wallId);
  } catch (error) {
    console.error('Failed to delete wall:', error);
  }
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN');
}

function getAudioUrl(url: string): string {
  // 实际应用中应该处理音频URL，这里简化处理
  return url;
}
</script>

<style scoped lang="scss">
.space-time-system {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

.header {
  margin-bottom: 30px;
  text-align: center;
}

.header h1 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 28px;
}

.nav-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.nav-buttons button {
  padding: 10px 20px;
  border: 2px solid #3498db;
  background-color: white;
  color: #3498db;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.nav-buttons button:hover {
  background-color: #3498db;
  color: white;
}

.nav-buttons button.active {
  background-color: #3498db;
  color: white;
}

.content {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 发送消息面板 */
.send-message-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message-type-selector {
  display: flex;
  gap: 20px;
  align-items: center;
}

.message-type-selector label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.text-input-container textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  resize: vertical;
  min-height: 100px;
}

.voice-input-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.recording-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.recording-controls button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  background-color: #e74c3c;
  color: white;
  transition: background-color 0.3s ease;
}

.recording-controls button:hover:not(:disabled) {
  background-color: #c0392b;
}

.recording-controls button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.recording-indicator {
  color: #e74c3c;
  font-weight: bold;
}

.audio-preview audio {
  width: 100%;
  margin-top: 10px;
}

.audio-waveform {
  display: flex;
  gap: 2px;
  align-items: flex-end;
  height: 50px;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 6px;
}

.waveform-bar {
  flex: 1;
  background-color: #3498db;
  border-radius: 2px;
  transition: height 0.1s ease;
}

.space-time-conditions {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.space-time-conditions h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #2c3e50;
}

.condition-group {
  margin-bottom: 15px;
}

.condition-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.condition-group select,
.condition-group input[type="text"],
.condition-group input[type="number"],
.condition-group input[type="datetime-local"] {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.location-input {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 10px;
}

.location-button {
  padding: 8px 16px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.location-button:hover {
  background-color: #27ae60;
}

.private-users {
  margin-top: 10px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.primary-button {
  padding: 12px 24px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.primary-button:hover:not(:disabled) {
  background-color: #2980b9;
}

.primary-button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.secondary-button {
  padding: 12px 24px;
  background-color: #95a5a6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.secondary-button:hover {
  background-color: #7f8c8d;
}

/* 收到的消息面板 */
.received-messages-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message-filters {
  display: flex;
  justify-content: flex-end;
}

.message-filters select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message-item {
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fafafa;
  transition: box-shadow 0.3s ease;
}

.message-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message-item.unread {
  border-left: 4px solid #3498db;
  background-color: #f0f7ff;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
}

.sender {
  font-weight: bold;
  color: #2c3e50;
}

.timestamp {
  color: #95a5a6;
  font-size: 12px;
}

.unread-indicator {
  color: #3498db;
  font-size: 16px;
}

.message-content {
  margin-bottom: 10px;
}

.message-content p {
  margin: 0;
  line-height: 1.6;
  color: #333;
}

.voice-transcript {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
}

.message-location {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.location-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%233498db"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>');
  background-repeat: no-repeat;
  background-size: contain;
}

.message-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.message-actions button {
  padding: 5px 10px;
  background-color: #ecf0f1;
  color: #34495e;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s ease;
}

.message-actions button:hover:not(:disabled) {
  background-color: #bdc3c7;
}

.message-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 时空胶囊面板 */
.space-time-capsules-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.capsules-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.capsule-item {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: white;
  position: relative;
  overflow: hidden;
}

.capsule-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #3498db, #9b59b6);
}

.capsule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.capsule-header h3 {
  margin: 0;
  color: #2c3e50;
}

.capsule-header .status {
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}

.capsule-header .status:contains('已开启') {
  background-color: #d5f4e6;
  color: #27ae60;
}

.capsule-header .status:contains('未开启') {
  background-color: #f8c471;
  color: #f39c12;
}

.capsule-details {
  margin-bottom: 15px;
  font-size: 14px;
  color: #555;
}

.creation-info,
.trigger-info {
  margin-bottom: 10px;
}

.creation-info span,
.trigger-info span {
  display: block;
  margin-bottom: 5px;
}

.trigger-info label {
  font-weight: bold;
  color: #34495e;
}

.capsule-messages {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.capsule-messages h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 14px;
}

.capsule-message {
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.capsule-message:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.capsule-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.capsule-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.capsule-actions button:contains('开启胶囊') {
  background-color: #3498db;
  color: white;
}

.capsule-actions button:contains('开启胶囊'):hover:not(:disabled) {
  background-color: #2980b9;
}

.capsule-actions button:contains('已开启') {
  background-color: #95a5a6;
  color: white;
  cursor: not-allowed;
}

.capsule-actions button:contains('未到开启条件') {
  background-color: #f39c12;
  color: white;
  cursor: not-allowed;
}

.capsule-actions button:contains('删除胶囊') {
  background-color: #e74c3c;
  color: white;
}

.capsule-actions button:contains('删除胶囊'):hover {
  background-color: #c0392b;
}

.create-capsule-button {
  padding: 12px 24px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  align-self: center;
  margin-top: 20px;
}

.create-capsule-button:hover {
  background-color: #27ae60;
}

/* 消息墙面板 */
.message-walls-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.walls-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.wall-item {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: white;
  transition: box-shadow 0.3s ease;
}

.wall-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.wall-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.wall-header h3 {
  margin: 0;
  color: #2c3e50;
}

.message-count {
  padding: 5px 10px;
  background-color: #3498db;
  color: white;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}

.wall-details {
  margin-bottom: 15px;
  font-size: 14px;
  color: #555;
}

.wall-description {
  margin-top: 10px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 6px;
  line-height: 1.5;
}

.wall-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.wall-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.wall-actions button:contains('查看消息墙') {
  background-color: #3498db;
  color: white;
}

.wall-actions button:contains('查看消息墙'):hover {
  background-color: #2980b9;
}

.wall-actions button:contains('添加消息') {
  background-color: #2ecc71;
  color: white;
}

.wall-actions button:contains('添加消息'):hover:not(:disabled) {
  background-color: #27ae60;
}

.wall-actions button:contains('添加消息'):disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.wall-actions button:contains('删除消息墙') {
  background-color: #e74c3c;
  color: white;
}

.wall-actions button:contains('删除消息墙'):hover {
  background-color: #c0392b;
}

.create-wall-button {
  padding: 12px 24px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  align-self: center;
  margin-top: 20px;
}

.create-wall-button:hover {
  background-color: #27ae60;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 10px;
  padding: 0;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.wall-detail-modal {
  max-width: 800px;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #95a5a6;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.close-button:hover {
  background-color: #f5f5f5;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #2c3e50;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group input[type="datetime-local"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3498db;
}

.form-group small {
  color: #95a5a6;
  font-size: 12px;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 墙详情模态框样式 */
.wall-detail-info {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.wall-detail-info p {
  margin: 5px 0;
  color: #555;
}

.wall-messages {
  margin-top: 20px;
}

.wall-messages h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #2c3e50;
}

.wall-message {
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 6px;
  margin-bottom: 10px;
  background-color: #fafafa;
}

.wall-message:last-child {
  margin-bottom: 0;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 40px;
  color: #95a5a6;
}

.empty-state::before {
  content: "💬";
  font-size: 48px;
  display: block;
  margin-bottom: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .space-time-system {
    padding: 10px;
  }
  
  .header h1 {
    font-size: 24px;
  }
  
  .nav-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .nav-buttons button {
    width: 100%;
    max-width: 300px;
  }
  
  .location-input {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .message-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .message-actions,
  .capsule-actions,
  .wall-actions {
    flex-wrap: wrap;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-item,
.capsule-item,
.wall-item {
  animation: fadeIn 0.3s ease;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 工具提示样式 */
[title] {
  cursor: help;
}

/* 打印样式 */
@media print {
  .header,
  .nav-buttons,
  .action-buttons,
  .message-actions,
  .capsule-actions,
  .wall-actions {
    display: none;
  }
  
  .space-time-system {
    padding: 0;
  }
  
  .content {
    box-shadow: none;
  }
}
</style>
