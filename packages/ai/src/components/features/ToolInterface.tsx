/**
 * @file 工具使用界面组件
 * @description 为用户提供与AI工具交互的核心界面
 * @component ToolInterface
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */
import { useState, useRef, useEffect } from 'react';
import { Tool } from '@/types';
import Button from '@/components/Button';

interface ToolInterfaceProps {
  tool: Tool;
  onClose: () => void;
}

/**
 * 工具使用界面组件
 * 提供参数输入、结果展示和操作控制功能
 */
export const ToolInterface: React.FC<ToolInterfaceProps> = ({ tool, onClose }) => {
  const [inputParams, setInputParams] = useState<Record<string, string>>({});
  const [output, setOutput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ input: Record<string, string>; output: string }>>([]);
  
  const outputRef = useRef<HTMLDivElement>(null);

  // 初始化输入参数
  useEffect(() => {
    // 根据工具类型初始化不同的参数结构
    const initialParams: Record<string, string> = {};
    
    // 根据工具类型设置默认参数
    switch (tool.category) {
      case '文本生成':
        initialParams.prompt = '';
        initialParams.maxLength = '1000';
        break;
      case '图像识别':
        initialParams.imageUrl = '';
        break;
      case '数据分析':
        initialParams.dataSource = '';
        initialParams.analysisType = 'summary';
        break;
      case '语音处理':
        initialParams.audioUrl = '';
        break;
      default:
        initialParams.input = '';
    }
    
    setInputParams(initialParams);
    setOutput('');
    setError(null);
  }, [tool]);

  // 处理输入变化
  const handleInputChange = (key: string, value: string) => {
    setInputParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 模拟处理请求
  const processRequest = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 根据工具类型生成模拟结果
      let result = '';
      
      switch (tool.category) {
        case '文本生成':
          result = `这是基于提示 "${inputParams.prompt || '默认提示'}" 生成的AI文本内容。\n\nAI已经完成了您的文本生成请求，内容长度约为${inputParams.maxLength || 1000}字符。\n\n可以通过调整参数获得更符合您需求的结果。`;
          break;
        case '图像识别':
          result = '图像识别结果：\n- 主要物体：人类、笔记本电脑\n- 场景：办公室\n- 置信度：98.5%\n\nAI成功识别出图像中的主要元素和场景信息。';
          break;
        case '数据分析':
          result = '数据分析报告：\n- 数据量：1000条记录\n- 平均值：42.5\n- 中位数：40\n- 趋势：上升\n\n分析完成，数据显示明显的上升趋势。';
          break;
        case '语音处理':
          result = '语音转文字结果：\n"您好，这是一段测试语音。语音识别技术正在不断进步，准确率已经达到很高水平。"\n\n识别准确率：99.2%';
          break;
        default:
          result = `AI工具处理结果：\n输入参数：${JSON.stringify(inputParams, null, 2)}\n\n这是${tool.name}的模拟处理结果。在实际环境中，这里将显示真实的AI处理输出。`;
      }
      
      setOutput(result);
      
      // 添加到历史记录
      setHistory(prev => [
        { input: { ...inputParams }, output: result },
        ...prev.slice(0, 9) // 保持最近10条记录
      ]);
      
      // 自动滚动到底部
      setTimeout(() => {
        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
      }, 100);
      
    } catch (err) {
      setError('处理请求时出错，请稍后重试');
      console.error('工具处理失败:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // 清除所有内容
  const handleClear = () => {
    setInputParams(prev => {
      const newParams = { ...prev };
      Object.keys(newParams).forEach(key => {
        newParams[key] = '';
      });
      return newParams;
    });
    setOutput('');
    setError(null);
  };

  // 从历史记录加载
  const loadFromHistory = (item: typeof history[0]) => {
    setInputParams(item.input);
    setOutput(item.output);
  };

  // 渲染输入参数表单
  const renderInputForm = () => {
    return (
      <div className="space-y-4">
        {tool.category === '文本生成' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                提示文本
              </label>
              <textarea
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                rows={4}
                value={inputParams.prompt || ''}
                onChange={(e) => handleInputChange('prompt', e.target.value)}
                placeholder="请输入提示文本..."
                disabled={isProcessing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                最大生成长度
              </label>
              <input
                type="number"
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={inputParams.maxLength || 1000}
                onChange={(e) => handleInputChange('maxLength', e.target.value)}
                min="100"
                max="5000"
                disabled={isProcessing}
              />
            </div>
          </>
        )}
        
        {tool.category === '图像识别' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              图像URL
            </label>
            <input
              type="text"
              className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={inputParams.imageUrl || ''}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              placeholder="请输入图像URL..."
              disabled={isProcessing}
            />
          </div>
        )}
        
        {tool.category === '数据分析' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                数据源
              </label>
              <input
                type="text"
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={inputParams.dataSource || ''}
                onChange={(e) => handleInputChange('dataSource', e.target.value)}
                placeholder="请输入数据源..."
                disabled={isProcessing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                分析类型
              </label>
              <select
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={inputParams.analysisType || 'summary'}
                onChange={(e) => handleInputChange('analysisType', e.target.value)}
                disabled={isProcessing}
              >
                <option value="summary">摘要</option>
                <option value="detailed">详细分析</option>
                <option value="trend">趋势分析</option>
                <option value="prediction">预测分析</option>
              </select>
            </div>
          </>
        )}
        
        {tool.category === '语音处理' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              音频URL
            </label>
            <input
              type="text"
              className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={inputParams.audioUrl || ''}
              onChange={(e) => handleInputChange('audioUrl', e.target.value)}
              placeholder="请输入音频URL..."
              disabled={isProcessing}
            />
          </div>
        )}
        
        {!['文本生成', '图像识别', '数据分析', '语音处理'].includes(tool.category) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              输入内容
            </label>
            <textarea
              className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              rows={4}
              value={inputParams.input || ''}
              onChange={(e) => handleInputChange('input', e.target.value)}
              placeholder="请输入内容..."
              disabled={isProcessing}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* 工具头部 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-md flex items-center justify-center text-primary text-xl">
            {tool.icon || 'AI'}
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {tool.name}
          </h2>
        </div>
        <Button variant="secondary" size="sm" onClick={onClose}>
          关闭
        </Button>
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 左侧：输入区域 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              参数设置
            </h3>
            {renderInputForm()}
            
            <div className="flex gap-3 mt-6">
              <Button 
                onClick={processRequest}
                loading={isProcessing}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? '处理中...' : '开始处理'}
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleClear}
                disabled={isProcessing}
              >
                清除
              </Button>
            </div>
          </div>
          
          {/* 历史记录 */}
          {history.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                历史记录
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {history.map((item, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-3 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm text-gray-700 dark:text-gray-300"
                    onClick={() => loadFromHistory(item)}
                  >
                    <div className="font-medium">请求 {index + 1}</div>
                    <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {Object.values(item.input).join(', ')}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 右侧：输出区域 */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 min-h-[500px] flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              处理结果
            </h3>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-md mb-4">
                {error}
              </div>
            )}
            
            <div 
              ref={outputRef}
              className="flex-1 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white overflow-auto"
              style={{ minHeight: '300px' }}
            >
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                  <p>AI正在处理您的请求，请稍候...</p>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap break-words">
                  {output || '请在左侧输入参数并点击"开始处理"'}
                </pre>
              )}
            </div>
            
            {output && (
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="secondary" size="sm">
                  复制结果
                </Button>
                <Button size="sm" onClick={processRequest} disabled={isProcessing}>
                  重新生成
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};