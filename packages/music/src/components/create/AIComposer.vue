<template>
  <div class="ai-composer">
    <div class="composer-header">
      <h3>AI音乐创作</h3>
      <p>输入你的想法，让AI为你创作独特的音乐作品</p>
    </div>

    <div class="composer-content">
      <div class="input-section">
        <div class="form-group">
          <label>音乐描述</label>
          <textarea 
            v-model="description" 
            placeholder="描述你想要的音乐风格、情绪、场景等，例如：欢快的钢琴独奏，适合轻松的咖啡馆背景音乐"
            rows="4"
          ></textarea>
          <div class="char-count">{{ description.length }}/500</div>
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label>音乐风格</label>
            <Select 
              :options="musicStyles" 
              v-model="style" 
              placeholder="选择音乐风格"
            />
          </div>
          <div class="form-group half">
            <label>时长 (秒)</label>
            <Input 
              type="number" 
              v-model="duration" 
              min="10" 
              max="120" 
              placeholder="10-120"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label>主乐器</label>
            <Select 
              :options="instruments" 
              v-model="mainInstrument" 
              placeholder="选择主乐器"
            />
          </div>
          <div class="form-group half">
            <label>情绪</label>
            <Select 
              :options="emotions" 
              v-model="emotion" 
              placeholder="选择音乐情绪"
            />
          </div>
        </div>

        <div class="form-group">
          <label>参考曲目</label>
          <div class="reference-input">
            <Input 
              v-model="referenceUrl" 
              placeholder="输入参考曲目的URL（可选）"
            />
            <Button @click="handleAddReference" type="default">添加</Button>
          </div>
          <div v-if="references.length > 0" class="reference-list">
            <div v-for="(ref, index) in references" :key="index" class="reference-item">
              <span>{{ ref }}</span>
              <Button @click="handleRemoveReference(index)" type="text" size="small">移除</Button>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>高级选项</label>
          <div class="advanced-options">
            <div class="option-item">
              <label class="checkbox-label">
                <input type="checkbox" v-model="isVocal"> 包含人声
              </label>
            </div>
            <div class="option-item">
              <label class="checkbox-label">
                <input type="checkbox" v-model="isLooping"> 可循环播放
              </label>
            </div>
            <div class="option-item">
              <label>复杂度</label>
              <input type="range" min="1" max="5" v-model="complexity">
              <span>{{ complexityText[complexity - 1] }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-header">
          <h4>预览结果</h4>
          <Button 
            :disabled="!isGenerating && (!generatedMusic || !generatedMusic.url)" 
            @click="handleRegenerate" 
            type="default" 
            size="small"
          >
            重新生成
          </Button>
        </div>

        <div v-if="isGenerating" class="generating">
          <div class="generating-spinner"></div>
          <div class="generating-text">
            <p>AI正在创作音乐...</p>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: generationProgress + '%' }"></div>
            </div>
            <p class="progress-text">{{ generationStatus }}</p>
          </div>
        </div>

        <div v-else-if="generatedMusic && generatedMusic.url" class="music-player">
          <div class="music-info">
            <img :src="generatedMusic.cover" :alt="generatedMusic.title" class="music-cover">
            <div class="music-details">
              <h5>{{ generatedMusic.title }}</h5>
              <p>{{ generatedMusic.description }}</p>
              <div class="music-meta">
                <span>{{ formatTime(generatedMusic.duration) }}</span>
                <span>{{ generatedMusic.style }}</span>
              </div>
            </div>
          </div>
          <audio 
            :src="generatedMusic.url" 
            controls 
            class="audio-player"
          >
            您的浏览器不支持音频播放
          </audio>
          <div class="music-actions">
            <Button @click="handleSave" type="primary">保存</Button>
            <Button @click="handleDownload" type="default">下载</Button>
            <Button @click="handleShare" type="default">分享</Button>
          </div>
        </div>

        <div v-else class="empty-preview">
          <div class="empty-icon"></div>
          <p>还没有生成的音乐</p>
          <p>填写上方表单，点击"生成音乐"按钮开始创作</p>
        </div>
      </div>
    </div>

    <div class="composer-footer">
      <Button 
        :disabled="!canGenerate || isGenerating" 
        @click="handleGenerate" 
        type="primary" 
        size="large"
      >
        {{ isGenerating ? '创作中...' : '生成音乐' }}
      </Button>
    </div>
  </div>
</template>

<script>
import Button from '../ui/Button.vue';
import Input from '../ui/Input.vue';
import Select from '../ui/Select.vue';

export default {
  name: 'AIComposer',
  components: {
    Button,
    Input,
    Select
  },
  data() {
    return {
      description: '',
      style: '',
      duration: 30,
      mainInstrument: '',
      emotion: '',
      referenceUrl: '',
      references: [],
      isVocal: false,
      isLooping: true,
      complexity: 3,
      isGenerating: false,
      generationProgress: 0,
      generationStatus: '',
      generatedMusic: null,
      
      musicStyles: [
        { label: '流行', value: 'pop' },
        { label: '摇滚', value: 'rock' },
        { label: '爵士', value: 'jazz' },
        { label: '古典', value: 'classical' },
        { label: '电子', value: 'electronic' },
        { label: '嘻哈', value: 'hiphop' },
        { label: '民谣', value: 'folk' },
        { label: 'R&B', value: 'rnb' },
        { label: '世界音乐', value: 'world' },
        { label: '电影配乐', value: 'cinematic' }
      ],
      
      instruments: [
        { label: '钢琴', value: 'piano' },
        { label: '吉他', value: 'guitar' },
        { label: '小提琴', value: 'violin' },
        { label: '大提琴', value: 'cello' },
        { label: '鼓', value: 'drums' },
        { label: '贝斯', value: 'bass' },
        { label: '萨克斯', value: 'saxophone' },
        { label: '电子键盘', value: 'keyboard' },
        { label: '合成器', value: 'synth' },
        { label: '人声', value: 'vocals' }
      ],
      
      emotions: [
        { label: '快乐', value: 'happy' },
        { label: '悲伤', value: 'sad' },
        { label: '激动', value: 'excited' },
        { label: '平静', value: 'calm' },
        { label: '神秘', value: 'mysterious' },
        { label: '浪漫', value: 'romantic' },
        { label: '勇敢', value: 'brave' },
        { label: '怀旧', value: 'nostalgic' },
        { label: '紧张', value: 'tense' },
        { label: '希望', value: 'hopeful' }
      ],
      
      complexityText: ['简单', '较简单', '中等', '较复杂', '复杂']
    };
  },
  computed: {
    canGenerate() {
      return this.description.trim().length > 0;
    }
  },
  methods: {
    handleAddReference() {
      if (this.referenceUrl.trim() && !this.references.includes(this.referenceUrl.trim())) {
        this.references.push(this.referenceUrl.trim());
        this.referenceUrl = '';
      }
    },
    handleRemoveReference(index) {
      this.references.splice(index, 1);
    },
    handleGenerate() {
      if (!this.canGenerate || this.isGenerating) return;
      
      this.isGenerating = true;
      this.generationProgress = 0;
      this.generationStatus = '正在分析您的需求...';
      
      // 模拟AI生成过程
      this.simulateGeneration();
    },
    handleRegenerate() {
      this.handleGenerate();
    },
    simulateGeneration() {
      const steps = [
        { progress: 15, status: '正在分析音乐风格...' },
        { progress: 30, status: '正在构建旋律框架...' },
        { progress: 50, status: '正在编曲和配器...' },
        { progress: 70, status: '正在混音处理...' },
        { progress: 90, status: '正在优化细节...' },
        { progress: 100, status: '生成完成！' }
      ];
      
      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          this.generationProgress = steps[currentStep].progress;
          this.generationStatus = steps[currentStep].status;
          currentStep++;
        } else {
          clearInterval(interval);
          
          // 模拟生成结果
          setTimeout(() => {
            this.isGenerating = false;
            this.generatedMusic = {
              id: `music_${Date.now()}`,
              title: this.generateMusicTitle(),
              description: this.description,
              style: this.musicStyles.find(s => s.value === this.style)?.label || '未知风格',
              duration: this.duration,
              url: 'https://example.com/music.mp3', // 模拟URL
              cover: 'https://via.placeholder.com/300',
              createdAt: new Date().toISOString()
            };
          }, 500);
        }
      }, 1500);
    },
    generateMusicTitle() {
      const titles = [
        '梦幻旋律',
        '城市节拍',
        '自然之声',
        '心灵之旅',
        '未来回响',
        '记忆碎片',
        '星辰大海',
        '雨后阳光',
        '风中呢喃',
        '暗夜流光'
      ];
      return titles[Math.floor(Math.random() * titles.length)];
    },
    handleSave() {
      if (this.generatedMusic) {
        // 保存音乐到用户库
        console.log('保存音乐:', this.generatedMusic);
        // 这里应该是API调用
      }
    },
    handleDownload() {
      if (this.generatedMusic && this.generatedMusic.url) {
        // 模拟下载
        console.log('下载音乐:', this.generatedMusic.url);
        // 实际应用中可以创建一个下载链接
      }
    },
    handleShare() {
      if (this.generatedMusic) {
        // 分享功能
        console.log('分享音乐:', this.generatedMusic);
        // 这里应该是API调用
      }
    },
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
  }
};
</script>

<style scoped>
.ai-composer {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.composer-header {
  text-align: center;
  margin-bottom: 32px;
}

.composer-header h3 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.composer-header p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.composer-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.input-section {
  padding: 20px;
  background-color: #fafafa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.form-group.half {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.form-group textarea,
.form-group input[type="text"],
.form-group input[type="number"] {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  color: #303133;
  outline: none;
  transition: border-color 0.3s ease;
}

.form-group textarea:focus,
.form-group input[type="text"]:focus,
.form-group input[type="number"]:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.reference-input {
  display: flex;
  gap: 8px;
}

.reference-input input {
  flex: 1;
}

.reference-list {
  margin-top: 12px;
}

.reference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #606266;
}

.advanced-options {
  background-color: #fff;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.option-item:last-child {
  margin-bottom: 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #303133;
}

.option-item input[type="range"] {
  flex: 1;
  margin: 0 12px;
}

.preview-section {
  padding: 20px;
  background-color: #fafafa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.preview-header h4 {
  margin: 0;
  color: #303133;
  font-size: 16px;
  font-weight: 500;
}

.generating {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}

.generating-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #409eff;
  border-radius: 50%;
  margin-bottom: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.generating-text {
  text-align: center;
  color: #606266;
}

.progress-bar {
  width: 200px;
  height: 8px;
  background-color: #e4e7ed;
  border-radius: 4px;
  margin: 16px auto;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #409eff;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #909399;
}

.music-player {
  text-align: center;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.music-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
}

.music-cover {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
}

.music-details {
  text-align: left;
}

.music-details h5 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.music-details p {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #606266;
  max-width: 300px;
}

.music-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #909399;
}

.audio-player {
  width: 100%;
  margin-bottom: 20px;
}

.music-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.empty-preview {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23dcdfe6' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
}

.empty-preview p {
  margin: 8px 0;
}

.composer-footer {
  text-align: center;
}

@media (max-width: 768px) {
  .composer-content {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .form-group.half {
    margin-bottom: 20px;
  }
}
</style>