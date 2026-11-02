<template>
  <div class="playlist-creator">
    <div class="creator-header">
      <h3>创建播放列表</h3>
      <p>整理你的音乐，创建专属于你的播放列表</p>
    </div>

    <div class="creator-content">
      <div class="playlist-form">
        <div class="form-group">
          <label>播放列表名称</label>
          <Input 
            v-model="playlistName" 
            placeholder="输入播放列表名称"
            maxlength="30"
          />
          <div class="char-count">{{ playlistName.length }}/30</div>
        </div>

        <div class="form-group">
          <label>播放列表描述</label>
          <textarea 
            v-model="playlistDescription" 
            placeholder="描述这个播放列表的主题或风格（可选）"
            rows="3"
            maxlength="200"
          ></textarea>
          <div class="char-count">{{ playlistDescription.length }}/200</div>
        </div>

        <div class="form-group">
          <label>封面图片</label>
          <div class="cover-upload">
            <div class="cover-preview" :style="{ backgroundImage: `url(${coverImageUrl})` }">
              <div v-if="!coverImageUrl" class="cover-placeholder">
                <div class="cover-icon"></div>
                <span>上传封面</span>
              </div>
            </div>
            <input 
              type="file" 
              ref="coverInput" 
              accept="image/*" 
              @change="handleCoverUpload"
              style="display: none"
            >
            <Button @click="$refs.coverInput.click()" type="default" size="small">选择图片</Button>
            <Button 
              v-if="coverImageUrl" 
              @click="handleRemoveCover" 
              type="text" 
              size="small"
            >
              移除
            </Button>
          </div>
          <div class="cover-hint">建议尺寸：300x300px，支持JPG、PNG格式</div>
        </div>

        <div class="form-group">
          <label>播放列表类型</label>
          <div class="playlist-type-options">
            <label class="type-option">
              <input type="radio" name="playlistType" value="public" v-model="playlistType">
              <span class="type-label">公开</span>
              <span class="type-desc">所有人可见</span>
            </label>
            <label class="type-option">
              <input type="radio" name="playlistType" value="private" v-model="playlistType">
              <span class="type-label">私密</span>
              <span class="type-desc">仅自己可见</span>
            </label>
            <label class="type-option">
              <input type="radio" name="playlistType" value="shared" v-model="playlistType">
              <span class="type-label">共享</span>
              <span class="type-desc">通过链接分享</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label>添加音乐</label>
          <div class="add-music-section">
            <div class="search-bar">
              <Input 
                v-model="searchKeyword" 
                placeholder="搜索歌曲、歌手或专辑"
                suffix-icon="search"
                @keyup.enter="handleSearch"
              />
              <Button @click="handleSearch" type="default" size="small">搜索</Button>
            </div>

            <div v-if="searchResults.length > 0" class="search-results">
              <div class="results-header">
                <h4>搜索结果 ({{ searchResults.length }})</h4>
                <Button @click="clearSearch" type="text" size="small">清空</Button>
              </div>
              <div class="results-list">
                <div 
                  v-for="song in searchResults" 
                  :key="song.id" 
                  class="song-item"
                >
                  <div class="song-info">
                    <img :src="song.cover" :alt="song.title" class="song-cover">
                    <div class="song-details">
                      <span class="song-title">{{ song.title }}</span>
                      <span class="song-artist">{{ song.artist }}</span>
                    </div>
                    <span class="song-duration">{{ formatTime(song.duration) }}</span>
                  </div>
                  <Button 
                    @click="handleAddSong(song)" 
                    type="text" 
                    size="small"
                    :disabled="isSongAdded(song.id)"
                  >
                    {{ isSongAdded(song.id) ? '已添加' : '添加' }}
                  </Button>
                </div>
              </div>
            </div>

            <div v-if="selectedSongs.length > 0" class="selected-songs">
              <div class="selected-header">
                <h4>已选择的歌曲 ({{ selectedSongs.length }})</h4>
                <Button @click="clearSelectedSongs" type="text" size="small" :disabled="selectedSongs.length === 0">
                  清空选择
                </Button>
              </div>
              <div class="selected-list">
                <div 
                  v-for="(song, index) in selectedSongs" 
                  :key="song.id + index" 
                  class="selected-song-item"
                >
                  <div class="song-index">{{ index + 1 }}</div>
                  <div class="song-info">
                    <img :src="song.cover" :alt="song.title" class="song-cover">
                    <div class="song-details">
                      <span class="song-title">{{ song.title }}</span>
                      <span class="song-artist">{{ song.artist }}</span>
                    </div>
                  </div>
                  <div class="song-actions">
                    <Button 
                      @click="handleMoveSong(index, 'up')" 
                      type="text" 
                      size="small" 
                      :disabled="index === 0"
                    >
                      ↑
                    </Button>
                    <Button 
                      @click="handleMoveSong(index, 'down')" 
                      type="text" 
                      size="small" 
                      :disabled="index === selectedSongs.length - 1"
                    >
                      ↓
                    </Button>
                    <Button 
                      @click="handleRemoveSong(index)" 
                      type="text" 
                      size="small"
                    >
                      移除
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="playlist-preview">
        <div class="preview-header">
          <h4>播放列表预览</h4>
        </div>
        <div class="preview-content">
          <div class="playlist-card">
            <div class="playlist-cover" :style="{ backgroundImage: `url(${coverImageUrl || 'https://via.placeholder.com/300'})` }"></div>
            <div class="playlist-info">
              <h5>{{ playlistName || '未命名播放列表' }}</h5>
              <p>{{ playlistDescription || '暂无描述' }}</p>
              <div class="playlist-meta">
                <span>{{ playlistTypeText }}</span>
                <span>{{ selectedSongs.length }} 首歌曲</span>
                <span>{{ totalDurationText }}</span>
              </div>
            </div>
          </div>

          <div v-if="selectedSongs.length > 0" class="playlist-songs-preview">
            <h5>歌曲列表</h5>
            <div class="songs-preview-list">
              <div 
                v-for="(song, index) in previewSongs" 
                :key="song.id + index" 
                class="song-preview-item"
              >
                <span class="song-index">{{ index + 1 }}</span>
                <span class="song-title">{{ song.title }}</span>
                <span class="song-artist">{{ song.artist }}</span>
              </div>
              <div v-if="selectedSongs.length > 5" class="more-songs">
                还有 {{ selectedSongs.length - 5 }} 首歌曲...
              </div>
            </div>
          </div>

          <div v-else class="empty-playlist">
            <div class="empty-icon"></div>
            <p>播放列表中还没有添加歌曲</p>
            <p>使用上方搜索功能添加音乐</p>
          </div>
        </div>
      </div>
    </div>

    <div class="creator-footer">
      <Button @click="handleCancel" type="default">取消</Button>
      <Button 
        :disabled="!canSave" 
        @click="handleSave" 
        type="primary" 
        size="large"
      >
        创建播放列表
      </Button>
    </div>
  </div>
</template>

<script>
import Button from '../ui/Button.vue';
import Input from '../ui/Input.vue';

export default {
  name: 'PlaylistCreator',
  components: {
    Button,
    Input
  },
  data() {
    return {
      playlistName: '',
      playlistDescription: '',
      coverImageUrl: '',
      playlistType: 'public',
      searchKeyword: '',
      searchResults: [],
      selectedSongs: [],
      // 模拟搜索结果数据
      mockSongs: [
        {
          id: '1',
          title: '夜曲',
          artist: '周杰伦',
          album: '十一月的萧邦',
          cover: 'https://via.placeholder.com/80',
          duration: 230
        },
        {
          id: '2',
          title: '晴天',
          artist: '周杰伦',
          album: '叶惠美',
          cover: 'https://via.placeholder.com/80',
          duration: 260
        },
        {
          id: '3',
          title: '告白气球',
          artist: '周杰伦',
          album: '周杰伦的床边故事',
          cover: 'https://via.placeholder.com/80',
          duration: 235
        },
        {
          id: '4',
          title: '演员',
          artist: '薛之谦',
          album: '绅士',
          cover: 'https://via.placeholder.com/80',
          duration: 233
        },
        {
          id: '5',
          title: '起风了',
          artist: '买辣椒也用券',
          album: '起风了',
          cover: 'https://via.placeholder.com/80',
          duration: 310
        }
      ]
    };
  },
  computed: {
    canSave() {
      return this.playlistName.trim().length > 0 && this.selectedSongs.length > 0;
    },
    playlistTypeText() {
      const typeMap = {
        'public': '公开',
        'private': '私密',
        'shared': '共享'
      };
      return typeMap[this.playlistType] || '公开';
    },
    totalDuration() {
      return this.selectedSongs.reduce((total, song) => total + song.duration, 0);
    },
    totalDurationText() {
      return this.formatTime(this.totalDuration);
    },
    previewSongs() {
      return this.selectedSongs.slice(0, 5);
    }
  },
  methods: {
    handleCoverUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.coverImageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    handleRemoveCover() {
      this.coverImageUrl = '';
      this.$refs.coverInput.value = '';
    },
    handleSearch() {
      if (!this.searchKeyword.trim()) {
        this.searchResults = [];
        return;
      }
      
      // 模拟搜索功能
      const keyword = this.searchKeyword.toLowerCase();
      this.searchResults = this.mockSongs.filter(song => 
        song.title.toLowerCase().includes(keyword) ||
        song.artist.toLowerCase().includes(keyword) ||
        song.album.toLowerCase().includes(keyword)
      );
    },
    clearSearch() {
      this.searchKeyword = '';
      this.searchResults = [];
    },
    isSongAdded(songId) {
      return this.selectedSongs.some(song => song.id === songId);
    },
    handleAddSong(song) {
      if (!this.isSongAdded(song.id)) {
        // 深拷贝防止修改原数据
        this.selectedSongs.push({ ...song });
      }
    },
    handleRemoveSong(index) {
      this.selectedSongs.splice(index, 1);
    },
    handleMoveSong(index, direction) {
      if (direction === 'up' && index > 0) {
        const temp = this.selectedSongs[index - 1];
        this.selectedSongs[index - 1] = this.selectedSongs[index];
        this.selectedSongs[index] = temp;
      } else if (direction === 'down' && index < this.selectedSongs.length - 1) {
        const temp = this.selectedSongs[index + 1];
        this.selectedSongs[index + 1] = this.selectedSongs[index];
        this.selectedSongs[index] = temp;
      }
    },
    clearSelectedSongs() {
      this.selectedSongs = [];
    },
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      
      if (mins >= 60) {
        const hours = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        return `${hours}:${remainingMins < 10 ? '0' : ''}${remainingMins}:${secs < 10 ? '0' : ''}${secs}`;
      }
      
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    },
    handleSave() {
      if (!this.canSave) return;
      
      const playlistData = {
        name: this.playlistName,
        description: this.playlistDescription,
        coverImage: this.coverImageUrl,
        type: this.playlistType,
        songs: this.selectedSongs,
        totalDuration: this.totalDuration,
        createdAt: new Date().toISOString()
      };
      
      console.log('保存播放列表:', playlistData);
      // 这里应该是API调用
      
      // 模拟保存成功
      this.$emit('save', playlistData);
      this.handleCancel();
    },
    handleCancel() {
      // 重置表单
      this.playlistName = '';
      this.playlistDescription = '';
      this.coverImageUrl = '';
      this.playlistType = 'public';
      this.searchKeyword = '';
      this.searchResults = [];
      this.selectedSongs = [];
      this.$refs.coverInput.value = '';
      
      // 触发取消事件
      this.$emit('cancel');
    }
  }
};
</script>

<style scoped>
.playlist-creator {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.creator-header {
  text-align: center;
  margin-bottom: 32px;
}

.creator-header h3 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.creator-header p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.creator-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
  margin-bottom: 32px;
}

.playlist-form {
  padding: 20px;
  background-color: #fafafa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.form-group input[type="text"],
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  color: #303133;
  outline: none;
  transition: border-color 0.3s ease;
}

.form-group input[type="text"]:focus,
.form-group textarea:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.cover-upload {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.cover-preview {
  width: 120px;
  height: 120px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  border: 2px dashed #dcdfe6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.cover-placeholder {
  text-align: center;
  color: #909399;
}

.cover-icon {
  width: 32px;
  height: 32px;
  margin: 0 auto 8px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23dcdfe6' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'%3E%3C/path%3E%3Cpolyline points='7 10 12 15 17 10'%3E%3C/polyline%3E%3Cline x1='12' y1='15' x2='12' y2='3'%3E%3C/line%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
}

.cover-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.playlist-type-options {
  display: flex;
  gap: 24px;
}

.type-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 16px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  transition: all 0.3s ease;
  flex: 1;
}

.type-option:hover {
  border-color: #409eff;
}

.type-option input[type="radio"] {
  margin-bottom: 8px;
}

.type-label {
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.type-desc {
  font-size: 12px;
  color: #909399;
}

.search-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.search-bar input {
  flex: 1;
}

.search-results,
.selected-songs {
  margin-bottom: 20px;
}

.results-header,
.selected-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.results-header h4,
.selected-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.results-list,
.selected-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
}

.song-item,
.selected-song-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.song-item:hover,
.selected-song-item:hover {
  background-color: #f5f7fa;
}

.song-item:last-child,
.selected-song-item:last-child {
  border-bottom: none;
}

.song-index {
  width: 20px;
  text-align: center;
  font-size: 12px;
  color: #909399;
  margin-right: 12px;
}

.song-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.song-cover {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 12px;
}

.song-details {
  flex: 1;
  min-width: 0;
}

.song-title {
  display: block;
  font-size: 14px;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  display: block;
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-duration {
  font-size: 12px;
  color: #909399;
  margin-right: 12px;
}

.song-actions {
  display: flex;
  gap: 8px;
}

.playlist-preview {
  padding: 20px;
  background-color: #fafafa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.preview-header h4 {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.playlist-card {
  text-align: center;
  margin-bottom: 24px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.playlist-cover {
  width: 200px;
  height: 200px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin: 0 auto 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.playlist-info h5 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.playlist-info p {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}

.playlist-meta {
  display: flex;
  justify-content: center;
  gap: 16px;
  font-size: 12px;
  color: #909399;
}

.playlist-songs-preview h5 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.songs-preview-list {
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
}

.song-preview-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.song-preview-item:last-child {
  border-bottom: none;
}

.more-songs {
  padding: 12px;
  text-align: center;
  font-size: 12px;
  color: #909399;
  background-color: #f5f7fa;
}

.empty-playlist {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23dcdfe6' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z'%3E%3C/path%3E%3Ccircle cx='12' cy='10' r='3'%3E%3C/circle%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
}

.empty-playlist p {
  margin: 8px 0;
}

.creator-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 768px) {
  .creator-content {
    grid-template-columns: 1fr;
  }
  
  .playlist-type-options {
    flex-direction: column;
    gap: 12px;
  }
  
  .cover-upload {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .creator-footer {
    justify-content: center;
  }
}
</style>