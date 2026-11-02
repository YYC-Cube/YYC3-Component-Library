import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

SyntaxHighlighter.registerLanguage('javascript', js);

const apiCode1 = `// Initialize CloudNexus Color Engine
const colorEngine = new CloudNexusColorEngine();

// Generate Palette from Logo & Background
const colorPalette = colorEngine.generatePalette({
  logoElement: document.getElementById('logo'),
  backgroundImage: document.getElementById('background'),
  style: 'tech' // options: tech, nature, business
});

// Apply generated scheme
colorEngine.applyColorScheme(element, colorPalette.primary);`;

const apiCode2 = `// Initialize Interaction Hub
const interactionHub = new CloudNexusInteractionHub();

// Register Multi-modal Interaction
interactionHub.registerInteraction({
  type: 'gesture',
  pattern: 'pinch', // e.g., Pinch to Zoom/Nav
  action: () => navigateByCloudNexus('gesture')
});

interactionHub.registerInteraction({
  type: 'voice',
  command: 'Summon Cloud Nexus',
  action: () => navigateByCloudNexus('voice')
});`;

const apiCode3 = `// Initialize 3D Page Flip Engine
const pageFlipEngine = new CloudNexusPageFlip({
  container: document.getElementById('pages'),
  backgroundImage: '/path/to/background.jpg',
  mode: '3D' // 3D, narrative, element
});

// Set Triggers
pageFlipEngine.setTriggers([
  {
    type: 'gesture',
    pattern: 'swipe',
    action: 'flipNext'
  }
]);`;

const apiCode4 = `// Low Code Platform Initialization
const lowCodePlatform = new DeepStackLowCode({
  container: document.getElementById('canvas'),
  logo: '/path/to/logo.png'
});

// Natural Language Generation
lowCodePlatform.generateFromPrompt('Generate Q1 Sales Bar Chart highlighting YoY growth');`;

const CodeBlock = ({ title, code }: { title: string, code: string }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="glass-panel rounded-xl overflow-hidden border border-white/10 my-6">
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
        <span className="text-sm font-mono text-gray-400">{title}</span>
        <button onClick={handleCopy} className="text-gray-500 hover:text-white transition-colors">
          <Copy size={16} />
        </button>
      </div>
      <div className="p-0">
        <SyntaxHighlighter 
          language="javascript" 
          style={atomOneDark}
          customStyle={{ background: 'transparent', padding: '1.5rem', margin: 0, fontSize: '0.9rem' }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export const ApiReference = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 className="text-2xl font-bold text-white mb-4">核心 API</h3>
        <p className="text-gray-400 mb-6">
          核心库提供对云枢色彩和交互处理引擎的直接访问。
        </p>
        <CodeBlock title="CloudNexusColorEngine (色彩引擎)" code={apiCode1} />
        <CodeBlock title="CloudNexusInteractionHub (交互中台)" code={apiCode2} />
        <CodeBlock title="CloudNexusPageFlip (翻页引擎)" code={apiCode3} />
      </div>
      <div className="space-y-6">
         <h3 className="text-2xl font-bold text-white mb-4">DeepStack 组件与低代码</h3>
         <p className="text-gray-400">
            预构建的 React 组件和低代码平台 SDK。
         </p>
         <CodeBlock title="组件使用" code={`import { CloudNexusButton, DataCard, CloudNexusChart } from 'deepstack-components';

// Button auto-adapts to background contrast
<CloudNexusButton 
  onClick={handleClick}
  variant="primary" 
/>

// Cloud Nexus Chart
<CloudNexusChart 
  type="bar" 
  data={chartData}
  colorScheme="primary" 
  animation="energyFlow" 
/>`} />
         <CodeBlock title="DeepStackLowCode SDK" code={apiCode4} />
      </div>
    </div>
  );
};
