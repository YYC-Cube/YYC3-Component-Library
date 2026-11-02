<template>
  <div class="space-time-call">
    <!-- 标签页导航 -->
    <div class="tabs">
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'create' }"
        @click="activeTab = 'create'"
      >
        创建消息
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'nearby' }"
        @click="activeTab = 'nearby'"
      >
        附近消息
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'wall' }"
        @click="activeTab = 'wall'"
      >
        留言墙
      </button>
    </div>

    <!-- 创建消息标签页 -->
    <div v-if="activeTab === 'create'" class="create-message">
      <div class="form-group">
        <label>消息类型</label>
        <div class="type-selector">
          <button 
            class="type-button" 
            :class="{ active: messageType === 'text' }"
            @click="messageType = 'text'"
          >
            文字
          </button>
          <button 
            class="type-button" 
            :class="{ active: messageType === 'voice' }"
            @click="messageType = 'voice'"
          >
            语音
          </button>
          <button 
            class="type-button" 
            :class="{ active: messageType === 'image' }"
            @click="messageType = 'image'"
          >
            图片
          </button>
        </div>
      </div>

      <!-- 文字消息输入 -->
      <div v-if="messageType === 'text'" class="form-group">
        <label for="text-content">消息内容</label>
        <textarea 
          id="text-content"
          v-model="messageContent"
          placeholder="输入你的时空留言..."
          rows="4"
        ></textarea>
      </div>

      <!-- 语音消息录制 -->
      <div v-if="messageType === 'voice'" class="form-group">
        <label>语音录制</label>
        <div class="voice-recorder">
          <button 
            class="record-button"
            :class="{ recording: isRecording }"
            :disabled="isRecording"
            @click="startRecording"
          >
            {{ isRecording ? '录制中...' : '开始录制' }}
          </button>
          <button 
            v-if="isRecording" 
            class="stop-button"
            @click="stopRecording"
          >
            停止录制
          </button>
          <div v-if="recordingDuration > 0" class="recording-duration">
            录制时长: {{ formatTime(recordingDuration) }}
          </div>
          <audio v-if="voicePreviewUrl" :src="voicePreviewUrl" controls class="voice-preview"></audio>
        </div>
      </div>

      <!-- 图片消息上传 -->
      <div v-if="messageType === 'image'" class="form-group">
        <label>图片上传</label>
        <div class="image-uploader">
          <input 
            type="file" 
            accept="image/*"
            @change="handleImageUpload"
            style="display: none;"
            ref="imageInput"
          />
          <button class="upload-button" @click="$refs.imageInput.click()">
            选择图片
          </button>
          <div v-if="imagePreviewUrl" class="image-preview">
            <img :src="imagePreviewUrl" alt="预览" />
            <button class="remove-image" @click="removeImage">移除</button>
          </div>
        </div>
      </div>

      <!-- 触发条件 -->
      <div class="form-group">
        <label>触发条件</label>
        <div class="trigger-selector">
          <button 
            class="trigger-button" 
            :class="{ active: triggerType === 'time' }"
            @click="triggerType = 'time'"
          >
            时间触发
          </button>
          <button 
            class="trigger-button" 
            :class="{ active: triggerType === 'location' }"
            @click="triggerType = 'location'"
          >
            位置触发
          </button>
          <button 
            class="trigger-button" 
            :class="{ active: triggerType === 'event' }"
            @click="triggerType = 'event'"
          >
            事件触发
          </button>
        </div>
      </div>

      <!-- 时间触发设置 -->
      <div v-if="triggerType === 'time'" class="form-group">
        <label for="trigger-time">触发时间</label>
        <input 
          type="datetime-local" 
          id="trigger-time"
          v-model="triggerTime"
          :min="formatDateTimeLocal(new Date())"
        />
      </div>

      <!-- 位置触发设置 -->
      <div v-if="triggerType === 'location'" class="form-group">
        <label>触发位置</label>
        <div class="location-input">
          <input 
            type="text" 
            placeholder="纬度" 
            v-model="triggerLatitude"
          />
          <input 
            type="text" 
            placeholder="经度" 
            v-model="triggerLongitude"
          />
          <button class="get-location" @click="getCurrentLocation">
            获取当前位置
          </button>
        </div>
        <input 
          type="number" 
          placeholder="触发半径(米)" 
          v-model="triggerRadius"
          min="1"
          max="10000"
        />
      </div>

      <!-- 事件触发设置 -->
      <div v-if="triggerType === 'event'" class="form-group">
        <label for="trigger-event">触发事件</label>
        <select id="trigger-event" v-model="triggerEvent">
          <option value="song_play">歌曲播放</option>
          <option value="song_like">歌曲点赞</option>
          <option value="comment_post">评论发布</option>
          <option value="user_follow">关注用户</option>
        </select>
      </div>

      <!-- 可见性设置 -->
      <div class="form-group">
        <label>可见性</label>
        <div class="visibility-selector">
          <button 
            class="visibility-button" 
            :class="{ active: visibility === 'public' }"
            @click="visibility = 'public'"
          >
            公开
          </button>
          <button 
            class="visibility-button" 
            :class="{ active: visibility === 'friends' }"
            @click="visibility = 'friends'"
          >
            好友可见
          </button>
          <button 
            class="visibility-button" 
            :class="{ active: visibility === 'private' }"
            @click="visibility = 'private'"
          >
            私密
          </button>
        </div>
      </div>

      <!-- 提交按钮 -->
      <button 
        class="submit-button" 
        :disabled="!canSubmit || isSubmitting"
        @click="submitMessage"
      >
        {{ isSubmitting ? '提交中...' : '发送时空消息' }}
      </button>

      <!-- 提交成功提示 -->
      <div v-if="submitSuccess" class="success-message">
        时空消息发送成功！
      </div>
    </div>

    <!-- 附近消息标签页 -->
    <div v-if="activeTab === 'nearby'" class="nearby-messages">
      <div class="nearby-header">
        <h3>附近的时空消息</h3>
        <button class="refresh-button" @click="refreshNearbyMessages">
          刷新
        </button>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoadingNearby" class="loading">
        加载中...
      </div>

      <!-- 空状态 -->
      <div v-else-if="nearbyMessages.length === 0" class="empty-state">
        附近没有时空消息，快来发布第一条吧！
      </div>

      <!-- 消息列表 -->
      <div v-else class="message-list">
        <div 
          v-for="message in nearbyMessages" 
          :key="message.id"
          class="message-item"
        >
          <div class="message-user">
            {{ message.user.name }} | {{ formatDistance(message.distance) }}
          </div>
          <div class="message-content">
            <div v-if="message.type === 'text'">
              {{ message.content }}
            </div>
            <div v-else-if="message.type === 'voice'">
              <audio :src="message.attachment" controls></audio>
            </div>
            <div v-else-if="message.type === 'image'">
              <img 
                :src="message.attachment" 
                alt="消息图片" 
                class="message-image"
                @click="previewImage(message.attachment)"
              />
            </div>
          </div>
          <div class="message-time">
            {{ formatTimeAgo(message.createdAt) }}
          </div>
          <div class="message-actions">
            <button 
              class="action-button like"
              @click="likeMessage(message.id)"
            >
              点赞 ({{ message.likes || 0 }})
            </button>
            <button 
              class="action-button reply"
              @click="replyToMessage(message.id, message.user.name)"
            >
              回复
            </button>
            <button 
              class="action-button share"
              @click="shareMessage(message.id)"
            >
              分享
            </button>
          </div>
          <!-- 回复列表 -->
          <div v-if="message.replies && message.replies.length > 0" class="replies">
            <div 
              v-for="reply in message.replies" 
              :key="reply.id"
              class="reply-item"
            >
              <span class="reply-user">{{ reply.user.name }}:</span>
              <span class="reply-content">{{ reply.content }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <button 
        v-if="hasMoreNearbyMessages" 
        class="load-more"
        @click="loadMoreNearbyMessages"
      >
        加载更多
      </button>
    </div>

    <!-- 留言墙标签页 -->
    <div v-if="activeTab === 'wall'" class="message-walls">
      <div class="wall-header">
        <h3>留言墙</h3>
        <button class="create-wall-button" @click="showCreateWallModal = true">
          创建留言墙
        </button>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoadingWalls" class="loading">
        加载中...
      </div>

      <!-- 空状态 -->
      <div v-else-if="messageWalls.length === 0" class="empty-state">
        还没有留言墙，快来创建一个吧！
      </div>

      <!-- 留言墙列表 -->
      <div v-else class="wall-list">
        <div 
          v-for="wall in messageWalls" 
          :key="wall.id"
          class="wall-item"
          @click="viewWall(wall.id)"
        >
          <h4>{{ wall.title }}</h4>
          <p>{{ wall.description }}</p>
          <div class="wall-stats">
            <span>留言数: {{ wall.postCount || 0 }}</span>
            <span v-if="wall.distance">距离: {{ formatDistance(wall.distance) }}</span>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <button 
        v-if="hasMoreWalls" 
        class="load-more"
        @click="loadMoreWalls"
      >
        加载更多
      </button>
    </div>

    <!-- 留言墙详情模态框 -->
    <div v-if="showWallModal" class="modal-overlay" @click="closeWallModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedWall?.title || '留言墙' }}</h3>
          <button class="close-button" @click="closeWallModal">×</button>
        </div>
        <div class="modal-body">
          <div v-if="isLoadingWallContent" class="loading">
            加载中...
          </div>
          <div v-else>
            <p>{{ selectedWall?.description || '' }}</p>
            
            <!-- 留言表单 -->
            <div class="post-form">
              <textarea 
                v-model="wallPostContent"
                placeholder="写下你的留言..."
                rows="3"
              ></textarea>
              <button 
                class="post-button"
                :disabled="!wallPostContent.trim() || isSubmittingPost"
                @click="postToWall"
              >
                {{ isSubmittingPost ? '发布中...' : '发布留言' }}
              </button>
            </div>

            <!-- 留言列表 -->
            <div v-if="wallPosts && wallPosts.length > 0" class="post-list">
              <div 
                v-for="post in wallPosts" 
                :key="post.id"
                class="post-item"
              >
                <div class="post-user">
                  {{ post.user.name }}
                </div>
                <div class="post-content">
                  {{ post.content }}
                </div>
                <div class="post-time">
                  {{ formatTimeAgo(post.createdAt) }}
                </div>
                <div class="post-actions">
                  <button 
                    class="action-button like"
                    @click="likePost(post.id)"
                  >
                    点赞 ({{ post.likes || 0 }})
                  </button>
                  <button 
                    class="action-button reply"
                    @click="replyToPost(post.id, post.user.name)"
                  >
                    回复
                  </button>
                </div>
                <!-- 留言回复 -->
                <div v-if="post.replies && post.replies.length > 0" class="post-replies">
                  <div 
                    v-for="reply in post.replies" 
                    :key="reply.id"
                    class="post-reply-item"
                  >
                    <span class="reply-user">{{ reply.user.name }}:</span>
                    <span class="reply-content">{{ reply.content }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 加载更多留言 -->
            <button 
              v-if="hasMoreWallPosts" 
              class="load-more"
              @click="loadMoreWallPosts"
            >
              加载更多留言
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建留言墙模态框 -->
    <div v-if="showCreateWallModal" class="modal-overlay" @click="showCreateWallModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>创建留言墙</h3>
          <button class="close-button" @click="showCreateWallModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="wall-title">标题</label>
            <input 
              type="text" 
              id="wall-title"
              v-model="newWallTitle"
              placeholder="输入留言墙标题"
            />
          </div>
          <div class="form-group">
            <label for="wall-description">描述</label>
            <textarea 
              id="wall-description"
              v-model="newWallDescription"
              placeholder="输入留言墙描述"
              rows="3"
            ></textarea>
          </div>
          <div class="form-group">
            <label>位置</label>
            <div class="location-input">
              <input 
                type="text" 
                placeholder="纬度" 
                v-model="newWallLatitude"
              />
              <input 
                type="text" 
                placeholder="经度" 
                v-model="newWallLongitude"
              />
              <button class="get-location" @click="getCurrentLocationForWall">
                获取当前位置
              </button>
            </div>
          </div>
          <div class="form-group">
            <label for="wall-radius">覆盖半径(米)</label>
            <input 
              type="number" 
              id="wall-radius"
              v-model="newWallRadius"
              min="1"
              max="10000"
              placeholder="默认为100米"
            />
          </div>
          <button 
            class="submit-button"
            :disabled="!canCreateWall || isCreatingWall"
            @click="createWall"
          >
            {{ isCreatingWall ? '创建中...' : '创建留言墙' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 回复模态框 -->
    <div v-if="showReplyModal" class="modal-overlay" @click="closeReplyModal">
      <div class="modal-content small" @click.stop>
        <div class="modal-header">
          <h3>回复 {{ replyTargetUser }}</h3>
          <button class="close-button" @click="closeReplyModal">×</button>
        </div>
        <div class="modal-body">
          <textarea 
            v-model="replyContent"
            placeholder="输入回复内容..."
            rows="3"
          ></textarea>
          <button 
            class="submit-button"
            :disabled="!replyContent.trim() || isSubmittingReply"
            @click="submitReply"
          >
            {{ isSubmittingReply ? '提交中...' : '发送回复' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 图片预览模态框 -->
    <div v-if="showImagePreview" class="modal-overlay" @click="showImagePreview = false">
      <div class="modal-content image-preview-modal" @click.stop>
        <button class="close-button" @click="showImagePreview = false">×</button>
        <img :src="previewImageUrl" alt="预览" class="full-image" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import spaceTimeService from '../../services/spaceTimeService';
import webSocketService from '../../services/webSocketService';

export default {
  name: 'SpaceTimeCall',
  data() {
    return {
      // 标签页状态
      activeTab: 'create',
      
      // 创建消息相关
      messageType: 'text',
      messageContent: '',
      triggerType: 'time',
      triggerTime: '',
      triggerLatitude: '',
      triggerLongitude: '',
      triggerRadius: 100,
      triggerEvent: 'song_play',
      visibility: 'public',
      isSubmitting: false,
      submitSuccess: false,
      
      // 语音录制相关
      isRecording: false,
      mediaRecorder: null,
      audioChunks: [],
      recordingStartTime: null,
      recordingDuration: 0,
      voicePreviewUrl: '',
      recordingInterval: null,
      
      // 图片上传相关
      imagePreviewUrl: '',
      selectedImage: null,
      
      // 附近消息相关
      nearbyMessages: [],
      isLoadingNearby: false,
      hasMoreNearbyMessages: true,
      nearbyPage: 1,
      
      // 留言墙相关
      messageWalls: [],
      isLoadingWalls: false,
      hasMoreWalls: true,
      wallsPage: 1,
      
      // 留言墙详情相关
      showWallModal: false,
      selectedWall: null,
      wallPosts: [],
      isLoadingWallContent: false,
      hasMoreWallPosts: true,
      wallPostsPage: 1,
      wallPostContent: '',
      isSubmittingPost: false,
      
      // 创建留言墙相关
      showCreateWallModal: false,
      newWallTitle: '',
      newWallDescription: '',
      newWallLatitude: '',
      newWallLongitude: '',
      newWallRadius: 100,
      isCreatingWall: false,
      
      // 回复相关
      showReplyModal: false,
      replyTargetId: null,
      replyTargetType: '', // 'message' 或 'post'
      replyTargetUser: '',
      replyContent: '',
      isSubmittingReply: false,
      
      // 图片预览相关
      showImagePreview: false,
      previewImageUrl: ''
    };
  },
  computed: {
    ...mapState(['user']),
    
    // 检查是否可以提交消息
    canSubmit() {
      if (this.isSubmitting) return false;
      
      // 根据消息类型检查内容
      if (this.messageType === 'text' && !this.messageContent.trim()) {
        return false;
      } else if (this.messageType === 'voice' && !this.voicePreviewUrl) {
        return false;
      } else if (this.messageType === 'image' && !this.imagePreviewUrl) {
        return false;
      }
      
      // 检查触发条件
      if (this.triggerType === 'time' && !this.triggerTime) {
        return false;
      } else if (this.triggerType === 'location') {
        if (!this.triggerLatitude || !this.triggerLongitude || !this.triggerRadius) {
          return false;
        }
      }
      
      return true;
    },
    
    // 检查是否可以创建留言墙
    canCreateWall() {
      if (this.isCreatingWall) return false;
      
      return this.newWallTitle.trim() && 
             this.newWallDescription.trim() && 
             this.newWallLatitude && 
             this.newWallLongitude;
    }
  },
  created() {
    // 初始化WebSocket连接
    this.initWebSocket();
    
    // 设置默认触发时间为当前时间
    this.triggerTime = this.formatDateTimeLocal(new Date());
    
    // 尝试获取当前位置
    this.getCurrentLocation();
  },
  mounted() {
    // 加载附近消息和留言墙
    this.loadNearbyMessages();
    this.loadMessageWalls();
  },
  beforeDestroy() {
    // 清理定时器
    if (this.recordingInterval) {
      clearInterval(this.recordingInterval);
    }
    
    // 断开WebSocket连接
    webSocketService.disconnect();
  },
  methods: {
    // 初始化WebSocket连接
    initWebSocket() {
      if (this.user && this.user.token) {
        webSocketService.connect(this.user.token)
          .then(() => {
            console.log('WebSocket连接成功');
            
            // 监听新消息通知
            webSocketService.on('new_message', (data) => {
              console.log('收到新消息:', data);
              // 如果在附近消息标签页，可以考虑自动刷新
              if (this.activeTab === 'nearby') {
                this.refreshNearbyMessages();
              }
            });
            
            // 监听消息墙更新
            webSocketService.on('wall_updated', (data) => {
              console.log('消息墙更新:', data);
              // 如果在留言墙标签页，可以考虑自动刷新
              if (this.activeTab === 'wall') {
                this.loadMessageWalls();
              }
            });
          })
          .catch(error => {
            console.error('WebSocket连接失败:', error);
          });
      }
    },
    
    // 格式化时间
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    
    // 格式化日期时间为本地时间字符串
    formatDateTimeLocal(date) {
      const d = new Date(date);
      // 减去时区偏移量，确保日期时间正确
      const offset = d.getTimezoneOffset();
      d.setMinutes(d.getMinutes() - offset);
      return d.toISOString().slice(0, 16);
    },
    
    // 格式化距离
    formatDistance(meters) {
      if (!meters) return '';
      if (meters < 1000) {
        return `${meters}m`;
      } else {
        return `${(meters / 1000).toFixed(1)}km`;
      }
    },
    
    // 格式化相对时间
    formatTimeAgo(timestamp) {
      const now = new Date();
      const date = new Date(timestamp);
      const diff = now - date;
      
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      
      if (seconds < 60) {
        return `${seconds}秒前`;
      } else if (minutes < 60) {
        return `${minutes}分钟前`;
      } else if (hours < 24) {
        return `${hours}小时前`;
      } else {
        return `${days}天前`;
      }
    },
    
    // 开始录制语音
    async startRecording() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];
        this.isRecording = true;
        this.recordingStartTime = new Date();
        this.recordingDuration = 0;
        
        // 开始计时
        this.recordingInterval = setInterval(() => {
          this.recordingDuration = Math.floor((new Date() - this.recordingStartTime) / 1000);
        }, 1000);
        
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };
        
        this.mediaRecorder.onstop = () => {
          // 停止所有音轨
          stream.getTracks().forEach(track => track.stop());
          
          // 创建音频预览
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          this.voicePreviewUrl = URL.createObjectURL(audioBlob);
          this.selectedImage = audioBlob;
        };
        
        this.mediaRecorder.start();
      } catch (error) {
        console.error('开始录音失败:', error);
        this.$toast.error('无法访问麦克风，请检查权限设置');
      }
    },
    
    // 停止录制语音
    stopRecording() {
      if (this.mediaRecorder && this.isRecording) {
        this.mediaRecorder.stop();
        this.isRecording = false;
        
        // 清除计时器
        if (this.recordingInterval) {
          clearInterval(this.recordingInterval);
          this.recordingInterval = null;
        }
      }
    },
    
    // 处理图片上传
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedImage = file;
        this.imagePreviewUrl = URL.createObjectURL(file);
      }
    },
    
    // 移除图片
    removeImage() {
      this.imagePreviewUrl = '';
      this.selectedImage = null;
      this.$refs.imageInput.value = '';
    },
    
    // 获取当前位置
    getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.triggerLatitude = position.coords.latitude.toFixed(6);
            this.triggerLongitude = position.coords.longitude.toFixed(6);
          },
          (error) => {
            console.error('获取位置失败:', error);
            this.$toast.error('无法获取当前位置，请检查权限设置');
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        );
      } else {
        this.$toast.error('浏览器不支持地理定位功能');
      }
    },
    
    // 为创建留言墙获取当前位置
    getCurrentLocationForWall() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.newWallLatitude = position.coords.latitude.toFixed(6);
            this.newWallLongitude = position.coords.longitude.toFixed(6);
          },
          (error) => {
            console.error('获取位置失败:', error);
            this.$toast.error('无法获取当前位置，请检查权限设置');
          }
        );
      } else {
        this.$toast.error('浏览器不支持地理定位功能');
      }
    },
    
    // 提交时空消息
    async submitMessage() {
      if (!this.canSubmit) return;
      
      this.isSubmitting = true;
      this.submitSuccess = false;
      
      try {
        let attachment = null;
        
        // 处理语音消息上传
        if (this.messageType === 'voice' && this.selectedImage) {
          const result = await spaceTimeService.uploadVoiceMessage(this.selectedImage);
          attachment = result.url;
        } else if (this.messageType === 'image' && this.selectedImage) {
          // 这里简化处理，实际应该上传图片到服务器
          // 暂时使用本地URL作为示例
          attachment = this.imagePreviewUrl;
        }
        
        // 构建触发条件参数
        let triggerData = {};
        if (this.triggerType === 'time') {
          triggerData = {
            type: 'time',
            time: this.triggerTime
          };
        } else if (this.triggerType === 'location') {
          triggerData = {
            type: 'location',
            latitude: parseFloat(this.triggerLatitude),
            longitude: parseFloat(this.triggerLongitude),
            radius: parseInt(this.triggerRadius)
          };
        } else if (this.triggerType === 'event') {
          triggerData = {
            type: 'event',
            event: this.triggerEvent
          };
        }
        
        // 调用服务创建消息
        const messageData = {
          type: this.messageType,
          content: this.messageType === 'text' ? this.messageContent : '',
          location: {
            latitude: parseFloat(this.triggerLatitude),
            longitude: parseFloat(this.triggerLongitude)
          },
          time: new Date().toISOString(),
          trigger: triggerData,
          visibility: this.visibility,
          attachment
        };
        
        await spaceTimeService.createSpaceTimeMessage(messageData);
        
        // 显示成功提示
        this.submitSuccess = true;
        this.$toast.success('时空消息发送成功！');
        
        // 重置表单
        this.resetForm();
        
        // 如果在附近消息标签页，刷新消息列表
        if (this.activeTab === 'nearby') {
          this.refreshNearbyMessages();
        }
      } catch (error) {
        console.error('发送消息失败:', error);
        this.$toast.error('发送失败，请重试');
      } finally {
        this.isSubmitting = false;
        
        // 3秒后隐藏成功提示
        if (this.submitSuccess) {
          setTimeout(() => {
            this.submitSuccess = false;
          }, 3000);
        }
      }
    },
    
    // 重置表单
    resetForm() {
      this.messageType = 'text';
      this.messageContent = '';
      this.triggerType = 'time';
      this.triggerTime = this.formatDateTimeLocal(new Date());
      this.visibility = 'public';
      
      // 清除语音相关
      this.voicePreviewUrl = '';
      this.recordingDuration = 0;
      
      // 清除图片相关
      this.imagePreviewUrl = '';
      this.selectedImage = null;
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = '';
      }
    },
    
    // 加载附近消息
    async loadNearbyMessages() {
      if (this.isLoadingNearby) return;
      
      this.isLoadingNearby = true;
      
      try {
        let latitude = parseFloat(this.triggerLatitude);
        let longitude = parseFloat(this.triggerLongitude);
        
        // 如果没有位置信息，尝试获取当前位置
        if (!latitude || !longitude) {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000
            });
          });
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
          this.triggerLatitude = latitude.toFixed(6);
          this.triggerLongitude = longitude.toFixed(6);
        }
        
        const messages = await spaceTimeService.getNearbyMessages({
          latitude,
          longitude,
          radius: 1000,
          page: this.nearbyPage,
          size: 10
        });
        
        // 计算每条消息的距离
        messages.forEach(message => {
          if (message.location) {
            message.distance = this.calculateDistance(
              latitude, longitude,
              message.location.latitude, message.location.longitude
            );
          }
        });
        
        // 按距离排序
        messages.sort((a, b) => a.distance - b.distance);
        
        if (this.nearbyPage === 1) {
          this.nearbyMessages = messages;
        } else {
          this.nearbyMessages = [...this.nearbyMessages, ...messages];
        }
        
        // 判断是否还有更多数据
        this.hasMoreNearbyMessages = messages.length === 10;
        
        // 增加页码
        this.nearbyPage++;
      } catch (error) {
        console.error('加载附近消息失败:', error);
        this.$toast.error('加载附近消息失败，请重试');
      } finally {
        this.isLoadingNearby = false;
      }
    },
    
    // 刷新附近消息
    refreshNearbyMessages() {
      this.nearbyPage = 1;
      this.nearbyMessages = [];
      this.hasMoreNearbyMessages = true;
      this.loadNearbyMessages();
    },
    
    // 加载更多附近消息
    loadMoreNearbyMessages() {
      if (this.hasMoreNearbyMessages && !this.isLoadingNearby) {
        this.loadNearbyMessages();
      }
    },
    
    // 加载留言墙
    async loadMessageWalls() {
      if (this.isLoadingWalls) return;
      
      this.isLoadingWalls = true;
      
      try {
        let params = {
          page: this.wallsPage,
          size: 10
        };
        
        // 如果有位置信息，添加到请求参数中
        const latitude = parseFloat(this.triggerLatitude);
        const longitude = parseFloat(this.triggerLongitude);
        if (latitude && longitude) {
          params.latitude = latitude;
          params.longitude = longitude;
        }
        
        const walls = await spaceTimeService.getMessageWalls(params);
        
        // 计算每条留言墙的距离
        if (latitude && longitude) {
          walls.forEach(wall => {
            if (wall.location) {
              wall.distance = this.calculateDistance(
                latitude, longitude,
                wall.location.latitude, wall.location.longitude
              );
            }
          });
          
          // 按距离排序
          walls.sort((a, b) => a.distance - b.distance);
        }
        
        if (this.wallsPage === 1) {
          this.messageWalls = walls;
        } else {
          this.messageWalls = [...this.messageWalls, ...walls];
        }
        
        // 判断是否还有更多数据
        this.hasMoreWalls = walls.length === 10;
        
        // 增加页码
        this.wallsPage++;
      } catch (error) {
        console.error('加载留言墙失败:', error);
        this.$toast.error('加载留言墙失败，请重试');
      } finally {
        this.isLoadingWalls = false;
      }
    },
    
    // 加载更多留言墙
    loadMoreWalls() {
      if (this.hasMoreWalls && !this.isLoadingWalls) {
        this.loadMessageWalls();
      }
    },
    
    // 创建留言墙
    async createWall() {
      if (!this.canCreateWall) return;
      
      this.isCreatingWall = true;
      
      try {
        const wallData = {
          title: this.newWallTitle,
          description: this.newWallDescription,
          location: {
            latitude: parseFloat(this.newWallLatitude),
            longitude: parseFloat(this.newWallLongitude)
          },
          radius: parseInt(this.newWallRadius) || 100
        };
        
        await spaceTimeService.createMessageWall(wallData);
        
        // 显示成功提示
        this.$toast.success('留言墙创建成功！');
        
        // 重置表单并关闭模态框
        this.resetCreateWallForm();
        this.showCreateWallModal = false;
        
        // 重新加载留言墙列表
        this.loadMessageWalls();
      } catch (error) {
        console.error('创建留言墙失败:', error);
        this.$toast.error('创建失败，请重试');
      } finally {
        this.isCreatingWall = false;
      }
    },
    
    // 重置创建留言墙表单
    resetCreateWallForm() {
      this.newWallTitle = '';
      this.newWallDescription = '';
      this.newWallLatitude = this.triggerLatitude;
      this.newWallLongitude = this.triggerLongitude;
      this.newWallRadius = 100;
    },
    
    // 查看留言墙
    async viewWall(wallId) {
      try {
        // 查找选中的留言墙
        this.selectedWall = this.messageWalls.find(wall => wall.id === wallId);
        
        // 加载留言墙内容
        this.wallPostsPage = 1;
        this.wallPosts = [];
        this.hasMoreWallPosts = true;
        await this.loadWallPosts();
        
        // 显示模态框
        this.showWallModal = true;
      } catch (error) {
        console.error('查看留言墙失败:', error);
        this.$toast.error('查看留言墙失败，请重试');
      }
    },
    
    // 关闭留言墙模态框
    closeWallModal() {
      this.showWallModal = false;
      this.selectedWall = null;
      this.wallPosts = [];
      this.wallPostContent = '';
    },
    
    // 加载留言墙内容
    async loadWallPosts() {
      if (!this.selectedWall || this.isLoadingWallContent) return;
      
      this.isLoadingWallContent = true;
      
      try {
        const posts = await spaceTimeService.getWallPosts({
          wallId: this.selectedWall.id,
          page: this.wallPostsPage,
          size: 10
        });
        
        if (this.wallPostsPage === 1) {
          this.wallPosts = posts;
        } else {
          this.wallPosts = [...this.wallPosts, ...posts];
        }
        
        // 判断是否还有更多数据
        this.hasMoreWallPosts = posts.length === 10;
        
        // 增加页码
        this.wallPostsPage++;
      } catch (error) {
        console.error('加载留言墙内容失败:', error);
        this.$toast.error('加载留言墙内容失败，请重试');
      } finally {
        this.isLoadingWallContent = false;
      }
    },
    
    // 加载更多留言墙内容
    loadMoreWallPosts() {
      if (this.hasMoreWallPosts && !this.isLoadingWallContent) {
        this.loadWallPosts();
      }
    },
    
    // 在留言墙留言
    async postToWall() {
      if (!this.wallPostContent.trim() || !this.selectedWall || this.isSubmittingPost) return;
      
      this.isSubmittingPost = true;
      
      try {
        const postData = {
          wallId: this.selectedWall.id,
          content: this.wallPostContent,
          type: 'text'
        };
        
        const newPost = await spaceTimeService.postToWall(postData);
        
        // 将新留言添加到列表顶部
        this.wallPosts.unshift(newPost);
        
        // 清空输入框
        this.wallPostContent = '';
        
        // 显示成功提示
        this.$toast.success('留言成功！');
      } catch (error) {
        console.error('留言失败:', error);
        this.$toast.error('留言失败，请重试');
      } finally {
        this.isSubmittingPost = false;
      }
    },
    
    // 点赞消息
    async likeMessage(messageId) {
      try {
        await spaceTimeService.recordFeedback({
          messageId,
          type: 'like',
          value: 1
        });
        
        // 更新本地消息的点赞数
        const message = this.nearbyMessages.find(m => m.id === messageId);
        if (message) {
          message.likes = (message.likes || 0) + 1;
        }
        
        // 显示成功提示
        this.$toast.success('点赞成功！');
      } catch (error) {
        console.error('点赞失败:', error);
        this.$toast.error('点赞失败，请重试');
      }
    },
    
    // 回复消息
    replyToMessage(messageId, userName) {
      this.replyTargetId = messageId;
      this.replyTargetType = 'message';
      this.replyTargetUser = userName;
      this.replyContent = '';
      this.showReplyModal = true;
    },
    
    // 分享消息
    shareMessage(messageId) {
      // 这里简化处理，实际应该实现分享功能
      this.$toast.info('分享功能待实现');
    },
    
    // 点赞留言
    async likePost(postId) {
      try {
        await spaceTimeService.recordFeedback({
          postId,
          type: 'like',
          value: 1
        });
        
        // 更新本地留言的点赞数
        const post = this.wallPosts.find(p => p.id === postId);
        if (post) {
          post.likes = (post.likes || 0) + 1;
        }
        
        // 显示成功提示
        this.$toast.success('点赞成功！');
      } catch (error) {
        console.error('点赞失败:', error);
        this.$toast.error('点赞失败，请重试');
      }
    },
    
    // 回复留言
    replyToPost(postId, userName) {
      this.replyTargetId = postId;
      this.replyTargetType = 'post';
      this.replyTargetUser = userName;
      this.replyContent = '';
      this.showReplyModal = true;
    },
    
    // 提交回复
    async submitReply() {
      if (!this.replyContent.trim() || !this.replyTargetId || this.isSubmittingReply) return;
      
      this.isSubmittingReply = true;
      
      try {
        let newReply;
        
        if (this.replyTargetType === 'message') {
          // 回复消息
          newReply = await spaceTimeService.replyToMessage({
            messageId: this.replyTargetId,
            content: this.replyContent,
            type: 'text'
          });
          
          // 更新本地消息的回复列表
          const message = this.nearbyMessages.find(m => m.id === this.replyTargetId);
          if (message) {
            if (!message.replies) {
              message.replies = [];
            }
            message.replies.push(newReply);
          }
        } else if (this.replyTargetType === 'post') {
          // 回复留言
          // 这里简化处理，实际应该调用相应的API
          // 暂时模拟添加回复
          newReply = {
            id: Date.now().toString(),
            user: this.user,
            content: this.replyContent,
            createdAt: new Date().toISOString()
          };
          
          // 更新本地留言的回复列表
          const post = this.wallPosts.find(p => p.id === this.replyTargetId);
          if (post) {
            if (!post.replies) {
              post.replies = [];
            }
            post.replies.push(newReply);
          }
        }
        
        // 关闭回复模态框
        this.closeReplyModal();
        
        // 显示成功提示
        this.$toast.success('回复成功！');
      } catch (error) {
        console.error('回复失败:', error);
        this.$toast.error('回复失败，请重试');
      } finally {
        this.isSubmittingReply = false;
      }
    },
    
    // 关闭回复模态框
    closeReplyModal() {
      this.showReplyModal = false;
      this.replyTargetId = null;
      this.replyTargetType = '';
      this.replyTargetUser = '';
      this.replyContent = '';
    },
    
    // 图片预览
    previewImage(imageUrl) {
      this.previewImageUrl = imageUrl;
      this.showImagePreview = true;
    },
    
    // 计算两点之间的距离（米）
    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371e3; // 地球半径（米）
      const φ1 = lat1 * Math.PI/180; // 弧度
      const φ2 = lat2 * Math.PI/180;
      const Δφ = (lat2-lat1) * Math.PI/180;
      const Δλ = (lon2-lon1) * Math.PI/180;
      
      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      
      const d = R * c; // 距离（米）
      return Math.round(d);
    },
    
    // 检查消息是否在附近
    isNearby(message) {
      if (!message.location || !this.triggerLatitude || !this.triggerLongitude) {
        return false;
      }
      
      const distance = this.calculateDistance(
        parseFloat(this.triggerLatitude),
        parseFloat(this.triggerLongitude),
        message.location.latitude,
        message.location.longitude
      );
      
      return distance <= 1000; // 1000米以内视为附近
    },
    
    // 检查留言墙是否在附近
    isNearbyWall(wall) {
      if (!wall.location || !this.triggerLatitude || !this.triggerLongitude) {
        return false;
      }
      
      const distance = this.calculateDistance(
        parseFloat(this.triggerLatitude),
        parseFloat(this.triggerLongitude),
        wall.location.latitude,
        wall.location.longitude
      );
      
      // 如果留言墙有指定半径，使用半径；否则默认100米
      const radius = wall.radius || 100;
      return distance <= radius;
    }
  }
};
</script>

<style scoped lang="scss">
.space-time-call {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  
  .tabs {
    display: flex;
    margin-bottom: 20px;
    border-bottom: 2px solid #f0f0f0;
    
    .tab-button {
      padding: 10px 20px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 16px;
      color: #666;
      border-bottom: 3px solid transparent;
      transition: all 0.3s ease;
      
      &:hover {
        color: #1890ff;
      }
      
      &.active {
        color: #1890ff;
        border-bottom-color: #1890ff;
        font-weight: 500;
      }
    }
  }
  
  .form-group {
    margin-bottom: 20px;
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }
    
    input[type="text"],
    input[type="number"],
    input[type="datetime-local"],
    textarea,
    select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.3s ease;
      
      &:focus {
        outline: none;
        border-color: #1890ff;
      }
    }
    
    textarea {
      resize: vertical;
    }
  }
  
  .type-selector,
  .trigger-selector,
  .visibility-selector {
    display: flex;
    gap: 10px;
    
    .type-button,
    .trigger-button,
    .visibility-button {
      padding: 8px 16px;
      border: 1px solid #d9d9d9;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: #1890ff;
        color: #1890ff;
      }
      
      &.active {
        background: #1890ff;
        border-color: #1890ff;
        color: white;
      }
    }
  }
  
  .voice-recorder {
    display: flex;
    flex-direction: column;
    gap: 10px;
    
    .record-button,
    .stop-button {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
      
      &.record-button {
        background: #1890ff;
        color: white;
        
        &.recording {
          background: #ff4d4f;
        }
        
        &:disabled {
          background: #d9d9d9;
          cursor: not-allowed;
        }
      }
      
      &.stop-button {
        background: #ff4d4f;
        color: white;
      }
    }
    
    .recording-duration {
      font-size: 14px;
      color: #666;
    }
    
    .voice-preview {
      margin-top: 10px;
    }
  }
  
  .image-uploader {
    display: flex;
    flex-direction: column;
    gap: 10px;
    
    .upload-button {
      padding: 10px 20px;
      border: 1px solid #d9d9d9;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: #1890ff;
        color: #1890ff;
      }
    }
    
    .image-preview {
      display: flex;
      align-items: center;
      gap: 10px;
      
      img {
        max-width: 200px;
        max-height: 200px;
        border-radius: 6px;
      }
      
      .remove-image {
        padding: 5px 10px;
        background: #ff4d4f;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
      }
    }
  }
  
  .location-input {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    
    input {
      flex: 1;
    }
    
    .get-location {
      padding: 8px 16px;
      background: #52c41a;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.3s ease;
      
      &:hover {
        background: #73d13d;
      }
    }
  }
  
  .submit-button {
    padding: 12px 32px;
    background: #1890ff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover {
      background: #40a9ff;
    }
    
    &:disabled {
      background: #d9d9d9;
      cursor: not-allowed;
    }
  }
  
  .success-message {
    margin-top: 20px;
    padding: 12px 20px;
    background: #f6ffed;
    border: 1px solid #b7eb8f;
    border-radius: 6px;
    color: #52c41a;
    font-size: 14px;
  }
  
  .nearby-header,
  .wall-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      margin: 0;
      font-size: 20px;
      color: #333;
    }
    
    .refresh-button,
    .create-wall-button {
      padding: 8px 16px;
      background: #1890ff;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
      
      &:hover {
        background: #40a9ff;
      }
    }
  }
  
  .loading,
  .empty-state {
    padding: 40px 0;
    text-align: center;
    color: #666;
    font-size: 16px;
  }
  
  .message-list,
  .wall-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    .message-item,
    .wall-item {
      padding: 16px;
      background: white;
      border: 1px solid #f0f0f0;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
      
      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }
  }
  
  .message-item {
    .message-user {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }
    
    .message-content {
      margin-bottom: 12px;
      
      .message-image {
        max-width: 100%;
        max-height: 300px;
        border-radius: 6px;
        cursor: pointer;
      }
    }
    
    .message-time {
      font-size: 12px;
      color: #999;
      margin-bottom: 12px;
    }
    
    .message-actions {
      display: flex;
      gap: 12px;
      
      .action-button {
        padding: 4px 12px;
        background: none;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        color: #666;
        transition: all 0.3s ease;
        
        &:hover {
          background: #40a9ff;
        }
        
        &:disabled {
          background: #d9d9d9;
          cursor: not-allowed;
        }
      }
    }
  }
}
</style> {
          background: #40a9ff;
        }
        
        &:disabled {
          background: #d9d9d9;
          cursor: not-allowed;
        }
      }
    }
    
    .post-list {
      .post-item {
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid #f0f0f0;
        
        &:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        
        .post-user {
          font-weight: 500;
          color: #333;
          margin-bottom: 8px;
        }
        
        .post-content {
          color: #666;
          margin-bottom: 8px;
          line-height: 1.5;
        }
        
        .post-time {
          font-size: 12px;
          color: #999;
          margin-bottom: 12px;
        }
        
        .post-actions {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
          
          .action-button {
            padding: 4px 12px;
            background: none;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            color: #666;
            transition: all 0.3s ease;
            
            &:hover {
              border-color: #1890ff;
              color: #1890ff;
            }
            
            &.like:hover {
              border-color: #ff4d4f;
              color: #ff4d4f;
            }
            
            &.reply:hover {
              border-color: #52c41a;
              color: #52c41a;
            }
          }
        }
        
        .post-replies {
          padding-left: 20px;
          
          .post-reply-item {
            display: flex;
            margin-bottom: 8px;
            font-size: 14px;
            
            .reply-user {
              font-weight: 500;
              margin-right: 8px;
              color: #333;
            }
            
            .reply-content {
              color: #666;
            }
          }
        }
      }
    }
  }
  
  .full-image {
    max-width: 100%;
    max-height: 80vh;
    border-radius: 8px;
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .space-time-call {
      padding: 10px;
    }
    
    .tabs {
      flex-wrap: wrap;
      
      .tab-button {
        padding: 8px 16px;
        font-size: 14px;
      }
    }
    
    .type-selector,
    .trigger-selector,
    .visibility-selector {
      flex-wrap: wrap;
      
      .type-button,
      .trigger-button,
      .visibility-button {
        flex: 1;
        min-width: 80px;
        padding: 6px 12px;
        font-size: 12px;
      }
    }
    
    .location-input {
      flex-direction: column;
      
      .get-location {
        width: 100%;
      }
    }
    
    .modal-content {
      width: 95%;
      margin: 20px;
    }
    
    .message-list,
    .wall-list {
      .message-item,
      .wall-item {
        padding: 12px;
      }
    }
    
    .message-item {
      .message-actions {
        flex-wrap: wrap;
        
        .action-button {
          padding: 3px 8px;
          font-size: 11px;
        }
      }
    }
  }
}
</style> {
          border-color: #1890ff;
          color: #1890ff;
        }
        
        &.like:hover {
          border-color: #ff4d4f;
          color: #ff4d4f;
        }
        
        &.reply:hover {
          border-color: #52c41a;
          color: #52c41a;
        }
        
        &.share:hover {
          border-color: #faad14;
          color: #faad14;
        }
      }
    }
    
    .replies {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #f0f0f0;
      
      .reply-item {
        display: flex;
        margin-bottom: 8px;
        
        .reply-user {
          font-weight: 500;
          margin-right: 8px;
          color: #333;
        }
        
        .reply-content {
          color: #666;
        }
      }
    }
  }
  
  .wall-item {
    cursor: pointer;
    
    h4 {
      margin: 0 0 8px 0;
      font-size: 18px;
      color: #333;
    }
    
    p {
      margin: 0 0 12px 0;
      color: #666;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .wall-stats {
      display: flex;
      gap: 20px;
      font-size: 14px;
      color: #999;
    }
  }
  
  .load-more {
    margin-top: 20px;
    padding: 10px 20px;
    width: 100%;
    background: white;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    color: #666;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #1890ff;
      color: #1890ff;
    }
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    
    &.small {
      max-width: 400px;
    }
    
    &.image-preview-modal {
      max-width: 80%;
      max-height: 90vh;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  
  .modal-header {
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      margin: 0;
      font-size: 18px;
      color: #333;
    }
    
    .close-button {
      width: 32px;
      height: 32px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 24px;
      color: #999;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: all 0.3s ease;
      
      &:hover {
        background: #f0f0f0;
        color: #666;
      }
    }
  }
  
  .modal-body {
    padding: 20px;
    overflow-y: auto;
    
    .post-form {
      margin-bottom: 20px;
      
      textarea {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #d9d9d9;
        border-radius: 6px;
        font-size: 14px;
        resize: vertical;
        margin-bottom: 12px;
        
        &:focus {
          outline: none;
          border-color: #1890ff;
        }
      }
      
      .post-button {
        padding: 8px 20px;
        background: #1890ff;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;
        
        &:hover {
          background: #40a9ff;
        }
        
        &:disabled {
          background: #d9d9d9;
          cursor: not-allowed;
        }
      }
    }
  }
}
</style>