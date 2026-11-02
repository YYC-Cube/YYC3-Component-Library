# YYC³ AI Code Designer - 首页架构设计提示词

## 🏠 首页架构设计

### 设计理念

YYC³ AI Code Designer 首页是一个智能化的AI编程交互入口，采用简洁、直观的设计理念，通过自然语言对话引导用户进入不同的开发模式。首页集成了品牌展示、智能AI聊天、项目快速访问等核心功能，为用户提供无缝的开发体验。

### 核心目标

- ✅ **自然交互**：通过自然语言对话引导用户，降低学习成本
- ✅ **智能路由**：根据用户意图自动跳转到合适的开发模式
- ✅ **快速访问**：提供最近项目的快速访问入口
- ✅ **品牌展示**：清晰展示品牌标识和核心价值
- ✅ **多模态支持**：支持图片、文件、代码等多种输入方式

---

## 🎨 品牌标识系统

### 品牌展示区域

#### 位置与布局
- **位置**：页面顶部中央区域
- **布局**：居中对齐，垂直排列
- **响应式**：移动端自适应，保持品牌完整性

#### 品牌元素

```
YYC³ Family AI
言传千行代码 | 语枢万物智能
```

#### 设计规范

1. **主标题**
   - **字体**：Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
   - **字号**：桌面端 48px，移动端 32px
   - **字重**：700 (Bold)
   - **颜色**：主色调（根据主题动态调整）
   - **字间距**：-0.02em

2. **副标题**
   - **字体**：Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
   - **字号**：桌面端 24px，移动端 18px
   - **字重**：400 (Regular)
   - **颜色**：次要文本色
   - **字间距**：0.01em
   - **行高**：1.5

3. **Logo**
   - **尺寸**：80x80px（桌面端），64x64px（移动端）
   - **格式**：SVG（推荐），支持PNG
   - **动画**：轻微浮动动画（3秒循环）
   - **位置**：主标题上方

#### 实现代码

```tsx
// src/components/homepage/BrandHeader.tsx
import React from 'react';
import { Logo } from '@/components/branding/Logo';
import { useBranding } from '@/hooks/useBranding';

export const BrandHeader: React.FC = () => {
  const { branding } = useBranding();
  const { slogan } = branding;

  return (
    <div className="brand-header">
      <div className="brand-header__logo">
        <Logo size="lg" />
      </div>
      <h1 className="brand-header__title">
        YYC³ Family AI
      </h1>
      <p className="brand-header__subtitle">
        {slogan.primary.zh}
      </p>
    </div>
  );
};
```

```css
/* src/components/homepage/BrandHeader.css */
.brand-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px 40px;
  text-align: center;
}

.brand-header__logo {
  margin-bottom: 24px;
  animation: logoFloat 3s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.brand-header__title {
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
  font-size: 48px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 16px 0;
  color: var(--color-primary);
}

.brand-header__subtitle {
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
  font-size: 24px;
  font-weight: 400;
  letter-spacing: 0.01em;
  line-height: 1.5;
  margin: 0;
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .brand-header {
    padding: 40px 20px 30px;
  }

  .brand-header__title {
    font-size: 32px;
  }

  .brand-header__subtitle {
    font-size: 18px;
  }
}
```

---

## 💬 核心交互组件

### 智能编程 AI 聊天框

#### 组件定位
- **位置**：品牌标识下方，页面中央区域
- **宽度**：桌面端最大宽度 800px，移动端 100%
- **高度**：自适应内容，最小高度 500px
- **样式**：采用液态玻璃设计风格

#### 功能特性矩阵

### 1. 图标功能栏

#### 布局结构

```
右上角：个人信息，设置
左侧：多功能菜单图标
```

#### 图标功能表

| 图标 | 功能 | 支持格式 | 交互方式 | 触发位置 |
|------|------|---------|---------|---------|
| **[+]** | 展开多功能菜单 | - | 点击展开 | 聊天框左上角 |
| 📤 | 图片上传 | PNG, JPG, GIF, SVG | 拖拽/选择 | 菜单展开后 |
| 📁 | 文件导入 | 多文件支持 | 拖拽/选择 | 菜单展开后 |
| 🔗 | GitHub 链接 | 仓库 URL | 粘贴/输入 | 菜单展开后 |
| 🎨 | Figma 文件 | .fig 文件 | 拖拽/选择 | 菜单展开后 |
| 💻 | 代码片段 | 多语言代码 | 粘贴/输入 | 菜单展开后 |
| 📋 | 剪贴板 | 任意内容 | Ctrl+V | 全局快捷键 |
| 👤 | 个人信息 | - | 点击 | 右上角 |
| ⚙️ | 设置 | - | 点击 | 右上角 |

#### 实现代码

```tsx
// src/components/homepage/ChatToolbar.tsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface ChatToolbarProps {
  onImageUpload: (file: File) => void;
  onFileImport: (files: File[]) => void;
  onGitHubLink: (url: string) => void;
  onFigmaFile: (file: File) => void;
  onCodeSnippet: (code: string) => void;
}

export const ChatToolbar: React.FC<ChatToolbarProps> = ({
  onImageUpload,
  onFileImport,
  onGitHubLink,
  onFigmaFile,
  onCodeSnippet,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [githubUrl, setGitHubUrl] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const figmaInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
    setMenuOpen(false);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFileImport(files);
    }
    setMenuOpen(false);
  };

  const handleGitHubSubmit = () => {
    if (githubUrl) {
      onGitHubLink(githubUrl);
      setGitHubUrl('');
      setMenuOpen(false);
    }
  };

  const handleFigmaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFigmaFile(file);
    }
    setMenuOpen(false);
  };

  const handleCodeSubmit = () => {
    if (codeSnippet) {
      onCodeSnippet(codeSnippet);
      setCodeSnippet('');
      setMenuOpen(false);
    }
  };

  return (
    <div className="chat-toolbar">
      {/* 左侧多功能菜单 */}
      <div className="chat-toolbar__left">
        <button
          className="chat-toolbar__menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="展开多功能菜单"
        >
          <span className="chat-toolbar__menu-icon">+</span>
        </button>

        {/* 下拉菜单 */}
        {menuOpen && (
          <div className="chat-toolbar__dropdown">
            <div className="chat-toolbar__dropdown-item">
              <label className="chat-toolbar__dropdown-label">
                <span className="chat-toolbar__dropdown-icon">📤</span>
                <span>上传图片</span>
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/png,image/jpeg,image/gif,image/svg+xml"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <div className="chat-toolbar__dropdown-item">
              <label className="chat-toolbar__dropdown-label">
                <span className="chat-toolbar__dropdown-icon">📁</span>
                <span>导入文件</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  onChange={handleFileImport}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <div className="chat-toolbar__dropdown-item">
              <div className="chat-toolbar__dropdown-content">
                <span className="chat-toolbar__dropdown-icon">🔗</span>
                <span>GitHub 链接</span>
                <input
                  type="text"
                  placeholder="粘贴仓库 URL"
                  value={githubUrl}
                  onChange={(e) => setGitHubUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGitHubSubmit()}
                />
                <button onClick={handleGitHubSubmit}>导入</button>
              </div>
            </div>

            <div className="chat-toolbar__dropdown-item">
              <label className="chat-toolbar__dropdown-label">
                <span className="chat-toolbar__dropdown-icon">🎨</span>
                <span>Figma 文件</span>
                <input
                  type="file"
                  ref={figmaInputRef}
                  accept=".fig"
                  onChange={handleFigmaUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <div className="chat-toolbar__dropdown-item">
              <div className="chat-toolbar__dropdown-content">
                <span className="chat-toolbar__dropdown-icon">💻</span>
                <span>代码片段</span>
                <textarea
                  placeholder="粘贴代码..."
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                />
                <button onClick={handleCodeSubmit}>提交</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 右侧个人信息和设置 */}
      <div className="chat-toolbar__right">
        <button
          className="chat-toolbar__icon-button"
          onClick={() => navigate('/profile')}
          aria-label="个人信息"
        >
          👤
        </button>
        <button
          className="chat-toolbar__icon-button"
          onClick={() => navigate('/settings')}
          aria-label="设置"
        >
          ⚙️
        </button>
      </div>
    </div>
  );
};
```

```css
/* src/components/homepage/ChatToolbar.css */
.chat-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
}

.chat-toolbar__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-toolbar__menu-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
  font-size: 24px;
  font-weight: 300;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-toolbar__menu-button:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

.chat-toolbar__dropdown {
  position: absolute;
  top: 60px;
  left: 16px;
  width: 320px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-border);
  z-index: 1000;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-toolbar__dropdown-item {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
}

.chat-toolbar__dropdown-item:last-child {
  border-bottom: none;
}

.chat-toolbar__dropdown-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.chat-toolbar__dropdown-label:hover {
  background: rgba(0, 0, 0, 0.05);
}

.chat-toolbar__dropdown-icon {
  font-size: 20px;
}

.chat-toolbar__dropdown-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
}

.chat-toolbar__dropdown-content input,
.chat-toolbar__dropdown-content textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.5);
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  resize: vertical;
}

.chat-toolbar__dropdown-content textarea {
  min-height: 80px;
}

.chat-toolbar__dropdown-content button {
  align-self: flex-end;
  padding: 8px 16px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s ease;
}

.chat-toolbar__dropdown-content button:hover {
  background: var(--color-primary-dark);
}

.chat-toolbar__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-toolbar__icon-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-toolbar__icon-button:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}
```

### 2. 智能聊天交互区

#### 功能特性

#### A. 自然语言输入

**特性描述：**
- 支持中英文混合输入
- 智能语义理解
- 上下文记忆保持
- 多轮对话支持

**实现要点：**
```tsx
// src/components/homepage/ChatInput.tsx
import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "输入您的需求，AI 将为您生成代码...",
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动调整高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
      // 重置高度
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-input">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="chat-input__textarea"
      />
      <button
        onClick={handleSubmit}
        disabled={!input.trim() || disabled}
        className="chat-input__send-button"
      >
        发送
      </button>
    </div>
  );
};
```

#### B. 实时 AI 响应机制

**特性描述：**
- 流式代码生成
- 实时语法检查
- 智能补全建议
- 代码格式化

**实现要点：**
```tsx
// src/components/homepage/ChatResponse.tsx
import React, { useState, useEffect } from 'react';

interface ChatResponseProps {
  content: string;
  isStreaming?: boolean;
  onComplete?: () => void;
}

export const ChatResponse: React.FC<ChatResponseProps> = ({
  content,
  isStreaming = false,
  onComplete,
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // 流式显示效果
  useEffect(() => {
    if (isStreaming && currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent(content.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 10); // 每10ms显示一个字符

      return () => clearTimeout(timer);
    } else if (!isStreaming && currentIndex >= content.length) {
      onComplete?.();
    }
  }, [isStreaming, currentIndex, content, onComplete]);

  // 代码块语法高亮
  const renderContent = (text: string) => {
    // 检测代码块
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = text.split(codeBlockRegex);

    return parts.map((part, index) => {
      if (index % 3 === 2) {
        // 代码内容
        const language = parts[index - 1] || 'text';
        return (
          <pre key={index} className={`code-block language-${language}`}>
            <code>{part}</code>
          </pre>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="chat-response">
      {isStreaming && <div className="chat-response__typing-indicator">AI 正在思考...</div>}
      <div className="chat-response__content">
        {renderContent(displayedContent)}
      </div>
    </div>
  );
};
```

#### C. 多模态输入支持

**特性描述：**
- 拖拽图片上传
- 快捷键操作
- 屏幕截图
- 文件拖放

**实现要点：**
```tsx
// src/components/homepage/ChatDropZone.tsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ChatDropZoneProps {
  onDrop: (files: File[]) => void;
  children: React.ReactNode;
}

export const ChatDropZone: React.FC<ChatDropZoneProps> = ({ onDrop, children }) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDropCallback = useCallback((acceptedFiles: File[]) => {
    setIsDragging(false);
    onDrop(acceptedFiles);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    noClick: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`chat-drop-zone ${isDragActive || isDragging ? 'chat-drop-zone--active' : ''}`}
    >
      <input {...getInputProps()} />
      {children}
      {isDragActive && (
        <div className="chat-drop-zone__overlay">
          <div className="chat-drop-zone__message">
            <span className="chat-drop-zone__icon">📁</span>
            <p>释放文件以导入</p>
          </div>
        </div>
      )}
    </div>
  );
};
```

#### D. 富文本展示

**特性描述：**
- 代码块语法高亮
- Markdown 格式支持
- 交互式代码预览

**实现要点：**
```tsx
// src/components/homepage/MarkdownRenderer.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      className="markdown-content"
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';

          return !inline && language ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={language}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
```

---

## 🧠 智能路由决策系统

### 系统架构

智能路由决策系统是首页的核心逻辑引擎，负责分析用户输入，识别用户意图，并自动导航到最合适的开发模式。

### A. 多联式布局设计器

#### 触发条件
- **时机**：分析用户首次交流信息的语义和意图
- **场景**：用户首次进入系统或开始新对话

#### 判断标准

**关键词检测：**
```
设计相关关键词：
- "设计"、"布局"、"界面"、"UI"、"UX"、"页面"
- "layout"、"design"、"interface"、"page"、"screen"

功能需求关键词：
- "创建"、"生成"、"制作"、"开发"、"构建"
- "create"、"generate"、"build"、"develop"、"make"
```

**意图识别：**
```typescript
// src/utils/intentAnalyzer.ts
interface IntentAnalysisResult {
  shouldNavigateToLayoutDesigner: boolean;
  confidence: number;
  detectedKeywords: string[];
  userContext: string;
}

export const analyzeIntent = (message: string): IntentAnalysisResult => {
  const designKeywords = ['设计', '布局', '界面', 'UI', 'UX', '页面', 'layout', 'design', 'interface', 'page', 'screen'];
  const createKeywords = ['创建', '生成', '制作', '开发', '构建', 'create', 'generate', 'build', 'develop', 'make'];

  const lowerMessage = message.toLowerCase();
  const detectedKeywords: string[] = [];

  // 检测设计关键词
  designKeywords.forEach(keyword => {
    if (lowerMessage.includes(keyword.toLowerCase())) {
      detectedKeywords.push(keyword);
    }
  });

  // 检测创建关键词
  createKeywords.forEach(keyword => {
    if (lowerMessage.includes(keyword.toLowerCase())) {
      detectedKeywords.push(keyword);
    }
  });

  // 计算置信度
  const confidence = Math.min(detectedKeywords.length * 0.3, 1.0);

  // 判断是否应该导航到布局设计器
  const shouldNavigateToLayoutDesigner = confidence >= 0.6;

  return {
    shouldNavigateToLayoutDesigner,
    confidence,
    detectedKeywords,
    userContext: message,
  };
};
```

#### 跳转动作

```tsx
// src/components/homepage/IntelligentRouter.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeIntent } from '@/utils/intentAnalyzer';

interface IntelligentRouterProps {
  userMessage: string;
  isFirstMessage: boolean;
}

export const IntelligentRouter: React.FC<IntelligentRouterProps> = ({
  userMessage,
  isFirstMessage,
}) => {
  const navigate = useNavigate();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (isFirstMessage && !hasNavigated && userMessage.trim()) {
      const analysis = analyzeIntent(userMessage);

      if (analysis.shouldNavigateToLayoutDesigner) {
        // 携带用户需求上下文
        const context = encodeURIComponent(analysis.userContext);
        navigate(`/layout-designer?context=${context}`);
        setHasNavigated(true);
      }
    }
  }, [isFirstMessage, userMessage, hasNavigated, navigate]);

  return null; // 这是一个纯逻辑组件，不渲染任何内容
};
```

#### 参数传递

```typescript
// 路由参数定义
interface LayoutDesignerParams {
  context: string;  // 用户需求上下文
  keywords: string[];  // 检测到的关键词
  confidence: number;  // 置信度
}

// 接收参数
const LayoutDesigner: React.FC = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const context = params.get('context') || '';
  const keywords = params.get('keywords')?.split(',') || [];
  const confidence = parseFloat(params.get('confidence') || '0');

  // 使用参数初始化布局设计器
  useEffect(() => {
    if (context) {
      // 根据用户上下文预填充布局设计器
      initializeDesigner(context, keywords, confidence);
    }
  }, [context, keywords, confidence]);

  // ...
};
```

### B. 智能 AI 交互工作台

#### 触发条件
- **时机**：持续监控用户交流沟通内容
- **场景**：用户进行深度编程对话

#### 判断标准

**深度编程需求检测：**
```typescript
// src/utils/programmingDepthAnalyzer.ts
interface ProgrammingDepthAnalysis {
  shouldNavigateToWorkbench: boolean;
  depth: 'shallow' | 'medium' | 'deep';
  detectedTopics: string[];
  requiresFullScreen: boolean;
}

export const analyzeProgrammingDepth = (
  conversationHistory: Message[]
): ProgrammingDepthAnalysis => {
  const deepProgrammingTopics = [
    '算法', '数据结构', '优化', '性能', '并发', '异步',
    'algorithm', 'data structure', 'optimization', 'performance', 'concurrency', 'async',
  ];

  const aiAssistanceTopics = [
    'AI', '机器学习', '深度学习', '模型', '训练',
    'machine learning', 'deep learning', 'model', 'training',
  ];

  const codeComplexityIndicators = [
    '类', '接口', '继承', '多态', '泛型', '装饰器',
    'class', 'interface', 'inheritance', 'polymorphism', 'generic', 'decorator',
  ];

  const detectedTopics: string[] = [];
  let depthScore = 0;

  // 分析对话历史
  conversationHistory.forEach(message => {
    const lowerContent = message.content.toLowerCase();

    // 检测深度编程话题
    deepProgrammingTopics.forEach(topic => {
      if (lowerContent.includes(topic.toLowerCase())) {
        detectedTopics.push(topic);
        depthScore += 2;
      }
    });

    // 检测AI辅助话题
    aiAssistanceTopics.forEach(topic => {
      if (lowerContent.includes(topic.toLowerCase())) {
        detectedTopics.push(topic);
        depthScore += 3;
      }
    });

    // 检测代码复杂度指标
    codeComplexityIndicators.forEach(indicator => {
      if (lowerContent.includes(indicator.toLowerCase())) {
        detectedTopics.push(indicator);
        depthScore += 1;
      }
    });
  });

  // 判断深度
  let depth: 'shallow' | 'medium' | 'deep' = 'shallow';
  if (depthScore >= 10) {
    depth = 'deep';
  } else if (depthScore >= 5) {
    depth = 'medium';
  }

  // 判断是否需要全屏交互模式
  const requiresFullScreen = depth === 'deep' || depthScore >= 8;

  return {
    shouldNavigateToWorkbench: requiresFullScreen,
    depth,
    detectedTopics,
    requiresFullScreen,
  };
};
```

#### 跳转动作

```tsx
// src/components/homepage/WorkbenchRouter.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeProgrammingDepth } from '@/utils/programmingDepthAnalyzer';

interface WorkbenchRouterProps {
  conversationHistory: Message[];
}

export const WorkbenchRouter: React.FC<WorkbenchRouterProps> = ({
  conversationHistory,
}) => {
  const navigate = useNavigate();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (!hasNavigated && conversationHistory.length > 3) {
      const analysis = analyzeProgrammingDepth(conversationHistory);

      if (analysis.shouldNavigateToWorkbench) {
        // 携带对话上下文
        const context = encodeURIComponent(JSON.stringify(conversationHistory));
        navigate(`/ai-workbench?context=${context}&depth=${analysis.depth}`);
        setHasNavigated(true);
      }
    }
  }, [conversationHistory, hasNavigated, navigate]);

  return null;
};
```

#### 状态保持

```typescript
// 对话上下文管理
interface ConversationContext {
  messages: Message[];
  metadata: {
    startTime: number;
    lastActivity: number;
    topic: string;
    depth: 'shallow' | 'medium' | 'deep';
  };
}

// src/stores/conversationStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConversationStore {
  currentContext: ConversationContext | null;
  updateContext: (context: ConversationContext) => void;
  clearContext: () => void;
}

export const useConversationStore = create<ConversationStore>()(
  persist(
    (set) => ({
      currentContext: null,
      updateContext: (context) => set({ currentContext: context }),
      clearContext: () => set({ currentContext: null }),
    }),
    {
      name: 'yyc3-conversation',
    }
  )
);

// 在跳转时保存上下文
const saveAndNavigate = (context: ConversationContext) => {
  updateContext(context);
  navigate('/ai-workbench');
};
```

### 路由决策流程图

```
用户输入
    ↓
意图分析器
    ↓
    ├─ 首次消息？
    │   ├─ 是 → 检测设计/创建关键词
    │   │   ├─ 置信度 ≥ 0.6？
    │   │   │   ├─ 是 → 导航至多联式布局设计器
    │   │   │   └─ 否 → 继续聊天
    │   │   └─ 传递用户上下文
    │   └─ 否 → 继续监控
    ↓
    ├─ 对话深度分析
    │   ├─ 消息数 > 3？
    │   │   ├─ 是 → 分析编程深度
    │   │   │   ├─ 深度 = deep？
    │   │   │   │   ├─ 是 → 导航至AI交互工作台
    │   │   │   │   └─ 否 → 继续监控
    │   │   │   └─ 保存对话上下文
    │   │   └─ 否 → 继续监控
    │   └─ 维持对话状态
    ↓
    继续聊天
```

---

## 📁 项目快速访问系统

### 最近项目卡片预览

#### 布局位置
- **位置**：聊天框下方
- **布局方式**：横向滚动区域
- **响应式**：移动端垂直堆叠，桌面端横向滚动

#### 展示形式

**卡片式预览布局：**
```tsx
// src/components/homepage/RecentProjects.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  thumbnail?: string;
  updatedAt: string;
  status: 'active' | 'archived' | 'draft';
}

export const RecentProjects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // 从本地存储或API加载最近项目
    loadRecentProjects();
  }, []);

  const loadRecentProjects = async () => {
    // 实现项目加载逻辑
    const loadedProjects = await fetchRecentProjects();
    setProjects(loadedProjects);
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const handleProjectContextMenu = (
    e: React.MouseEvent,
    project: Project
  ) => {
    e.preventDefault();
    // 显示右键菜单
    showContextMenu(e, project);
  };

  const showContextMenu = (e: React.MouseEvent, project: Project) => {
    // 实现右键菜单逻辑
    const menuItems = [
      { label: '打开', action: () => handleProjectClick(project.id) },
      { label: '重命名', action: () => renameProject(project.id) },
      { label: '删除', action: () => deleteProject(project.id) },
    ];

    // 显示菜单
  };

  return (
    <div className="recent-projects">
      <h3 className="recent-projects__title">最近项目</h3>
      <div className="recent-projects__scroll-container">
        {projects.map((project) => (
          <div
            key={project.id}
            className="project-card"
            onClick={() => handleProjectClick(project.id)}
            onContextMenu={(e) => handleProjectContextMenu(e, project)}
            draggable
            onDragStart={(e) => handleDragStart(e, project.id)}
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, project.id)}
          >
            {project.thumbnail && (
              <div className="project-card__thumbnail">
                <img src={project.thumbnail} alt={project.name} />
              </div>
            )}
            <div className="project-card__info">
              <h4 className="project-card__name">{project.name}</h4>
              <p className="project-card__meta">
                {formatDate(project.updatedAt)}
              </p>
              <span className={`project-card__status project-card__status--${project.status}`}>
                {getStatusText(project.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 辅助函数
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins} 分钟前`;
  if (diffHours < 24) return `${diffHours} 小时前`;
  return `${diffDays} 天前`;
};

const getStatusText = (status: string): string => {
  const statusMap = {
    active: '进行中',
    archived: '已归档',
    draft: '草稿',
  };
  return statusMap[status] || status;
};
```

**项目元数据展示：**
```css
/* src/components/homepage/RecentProjects.css */
.recent-projects {
  margin-top: 40px;
  padding: 20px;
}

.recent-projects__title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--color-text-primary);
}

.recent-projects__scroll-container {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 10px 0;
  scroll-behavior: smooth;
}

.recent-projects__scroll-container::-webkit-scrollbar {
  height: 8px;
}

.recent-projects__scroll-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.recent-projects__scroll-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.recent-projects__scroll-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.project-card {
  flex: 0 0 280px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px) saturate(180%);
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.12);
}

.project-card__thumbnail {
  width: 100%;
  height: 160px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
  background: rgba(0, 0, 0, 0.2);
}

.project-card__thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card:hover .project-card__thumbnail img {
  transform: scale(1.05);
}

.project-card__info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.project-card__name {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-card__meta {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

.project-card__status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  align-self: flex-start;
}

.project-card__status--active {
  background: rgba(0, 255, 135, 0.2);
  color: #00ff87;
}

.project-card__status--archived {
  background: rgba(255, 159, 64, 0.2);
  color: #ff9f40;
}

.project-card__status--draft {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
}

@media (max-width: 768px) {
  .recent-projects__scroll-container {
    flex-direction: column;
    overflow-x: visible;
  }

  .project-card {
    flex: 0 0 auto;
    width: 100%;
  }
}
```

#### 交互方式

**1. 点击卡片直接进入对应项目**
```typescript
const handleProjectClick = (projectId: string) => {
  navigate(`/project/${projectId}`);
};
```

**2. 右键菜单**
```tsx
const handleContextMenu = (e: React.MouseEvent, project: Project) => {
  e.preventDefault();

  const menuItems = [
    {
      label: '打开',
      icon: '📂',
      action: () => handleProjectClick(project.id),
    },
    {
      label: '重命名',
      icon: '✏️',
      action: () => handleRename(project.id),
    },
    {
      label: '删除',
      icon: '🗑️',
      action: () => handleDelete(project.id),
      danger: true,
    },
  ];

  // 显示右键菜单
  showContextMenu(e.clientX, e.clientY, menuItems);
};
```

**3. 拖拽排序功能**
```tsx
const handleDragStart = (e: React.DragEvent, projectId: string) => {
  e.dataTransfer.setData('text/plain', projectId);
  e.dataTransfer.effectAllowed = 'move';
};

const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
};

const handleDrop = async (e: React.DragEvent, targetProjectId: string) => {
  e.preventDefault();
  const draggedProjectId = e.dataTransfer.getData('text/plain');

  if (draggedProjectId !== targetProjectId) {
    // 重新排序项目
    await reorderProjects(draggedProjectId, targetProjectId);
  }
};
```

#### 功能价值

**1. 快速访问历史项目**
- 一键打开最近使用的项目
- 无需重复搜索或导航
- 提高工作效率

**2. 无缝继续开发工作**
- 保存项目状态和上下文
- 快速恢复工作进度
- 减少重复操作

**3. 项目状态可视化**
- 清晰展示项目状态
- 识别活跃项目和归档项目
- 便于项目管理

---

## 🎯 整体页面布局

### 页面结构

```
┌─────────────────────────────────────────────────────────┐
│                    品牌标识系统                     │
│              YYC³ Family AI                        │
│         言传千行代码 | 语枢万物智能                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│              ┌─────────────────────────┐                │
│              │   智能编程 AI 聊天框  │                │
│              │                         │                │
│              │  [+  👤  ⚙️]         │                │
│              │                         │                │
│              │  ┌─────────────────┐  │                │
│              │  │                 │  │                │
│              │  │  聊天消息区域   │  │                │
│              │  │                 │  │                │
│              │  │                 │  │                │
│              │  └─────────────────┘  │                │
│              │                         │                │
│              │  ┌─────────────────┐  │                │
│              │  │ 输入框 [发送]   │  │                │
│              │  └─────────────────┘  │                │
│              └─────────────────────────┘                │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                   最近项目卡片预览                     │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐        │
│  │ 项目1 │  │ 项目2 │  │ 项目3 │  │ 项目4 │        │
│  └──────┘  └──────┘  └──────┘  └──────┘        │
└─────────────────────────────────────────────────────────┘
```

### 响应式设计

**桌面端（≥ 1024px）：**
- 品牌标识：居中，完整展示
- 聊天框：最大宽度 800px，居中
- 项目卡片：横向滚动，每行显示 3-4 个

**平板端（768px - 1023px）：**
- 品牌标识：居中，适当缩小
- 聊天框：宽度 90%，居中
- 项目卡片：横向滚动，每行显示 2-3 个

**移动端（< 768px）：**
- 品牌标识：居中，进一步缩小
- 聊天框：宽度 100%，全屏
- 项目卡片：垂直堆叠，单列显示

---

## 🚀 实现优先级

### P0 - 核心功能（必须实现）

1. ✅ 品牌标识系统
   - Logo 展示
   - 标语显示
   - 响应式布局

2. ✅ 智能编程 AI 聊天框
   - 基础聊天界面
   - 消息输入和发送
   - 消息展示

3. ✅ 图标功能栏
   - 多功能菜单展开
   - 基础图标功能

4. ✅ 智能路由决策系统
   - 意图分析
   - 自动跳转逻辑

### P1 - 重要功能（优先实现）

1. ⚠️ 多模态输入支持
   - 文件拖放
   - 图片上传
   - 剪贴板支持

2. ⚠️ 项目快速访问系统
   - 最近项目展示
   - 项目卡片交互
   - 拖拽排序

3. ⚠️ 实时 AI 响应机制
   - 流式响应
   - 代码高亮
   - Markdown 支持

### P2 - 增强功能（后续实现）

1. 📋 右键菜单
   - 项目操作菜单
   - 自定义菜单项

2. 📊 项目状态可视化
   - 状态指示器
   - 进度展示

3. 🎨 高级交互效果
   - 动画优化
   - 过渡效果
   - 微交互

---

## 📝 开发注意事项

### 1. 性能优化

- 使用虚拟滚动处理大量项目卡片
- 实现消息懒加载
- 优化图片加载和缓存

### 2. 可访问性

- 确保键盘导航支持
- 提供适当的 ARIA 标签
- 支持屏幕阅读器

### 3. 错误处理

- 优雅处理文件上传失败
- 提供友好的错误提示
- 实现重试机制

### 4. 状态管理

- 使用 Zustand 管理全局状态
- 实现状态持久化
- 保持对话上下文

### 5. 测试覆盖

- 单元测试核心组件
- 集成测试路由逻辑
- E2E 测试用户流程