"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Code, Terminal, BookOpen, Github, Zap, Cpu, Database, Cloud,
  Key, Shield, Monitor, Globe, ArrowRight, Star, Download, Copy,
  Check, ExternalLink, PlayCircle, FileText, Search, Filter,
  Brain, Bot, Network, Settings, Lightbulb, Target, Users, Award,
  Activity, TrendingUp, Eye, Calendar, MessageSquare, Clock
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface DeveloperPortalPageProps {
  navigate: (page: string) => void;
}

const codeExamples = [
  {
    id: "text-analysis",
    title: "Text Sentiment Analysis",
    description: "Analyze sentiment in text using our AI API",
    language: "Python",
    code: `import requests

api_key = "your_api_key_here"
base_url = "https://api.delibix.com/v1"

def analyze_sentiment(text):
    headers = {"Authorization": f"Bearer {api_key}"}
    payload = {"text": text, "language": "id"}
    
    response = requests.post(f"{base_url}/analyze/sentiment", 
                           headers=headers, json=payload)
    return response.json()

result = analyze_sentiment("Saya sangat senang!")
print(f"Sentiment: {result['sentiment']}")`,
    category: "Text Analysis",
    complexity: "beginner" as const,
    tags: ["sentiment", "nlp"]
  },
  {
    id: "image-classification",
    title: "Image Classification",
    description: "Classify images using computer vision",
    language: "JavaScript",
    code: `const DelibixAI = require('@delibix/ai-sdk');

const client = new DelibixAI({
  apiKey: process.env.DELIBIX_API_KEY
});

async function classifyImage(imageUrl) {
  const result = await client.vision.classify({
    image: imageUrl,
    model: 'general-v3'
  });
  
  return result.predictions;
}

classifyImage('https://example.com/image.jpg')
  .then(predictions => console.log(predictions));`,
    category: "Computer Vision",
    complexity: "intermediate" as const,
    tags: ["image", "classification"]
  }
];

const sdkResources = [
  {
    name: "Python SDK",
    description: "Comprehensive Python library",
    language: "Python",
    version: "v2.1.0",
    icon: Code,
    downloadUrl: "https://pypi.org/project/delibix-ai/",
    documentation: "/docs/python-sdk",
    examples: 45
  },
  {
    name: "JavaScript SDK",
    description: "Modern JS/TS SDK",
    language: "JavaScript",
    version: "v1.8.3",
    icon: Globe,
    downloadUrl: "https://npmjs.com/package/@delibix/ai-sdk",
    documentation: "/docs/js-sdk",
    examples: 32
  }
];

const apiEndpoints = [
  {
    method: "POST",
    endpoint: "/v1/analyze/text",
    description: "Analyze text for sentiment and entities",
    parameters: [
      { name: "text", type: "string", required: true, description: "Text to analyze" },
      { name: "language", type: "string", required: false, description: "Language code" }
    ],
    response: "{ sentiment: string, entities: array, confidence: number }",
    example: `{ "text": "Great product!", "language": "en" }`
  }
];

export function DeveloperPortalPage({ navigate }: DeveloperPortalPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-3 glass-secondary rounded-full px-6 py-3">
              <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">Developer Portal</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold">
              Build with <span className="gradient-text-blue">AI</span>
            </h1>
            
            <p className="text-xl max-w-4xl mx-auto text-foreground-muted">
              Powerful APIs and SDKs to integrate AI into your applications.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8">
              {[
                { label: "Developers", value: "10,000+" },
                { label: "API Calls", value: "50M+" },
                { label: "SDKs", value: "4" },
                { label: "Uptime", value: "99.9%" }
              ].map((stat, index) => (
                <div key={index} className="glass-heavy rounded-2xl p-6 text-center">
                  <div className="text-2xl font-bold gradient-text-blue">{stat.value}</div>
                  <div className="text-sm text-foreground-muted">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button size="lg" className="gradient-bg-blue text-white">
                Get API Key <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('documentation')}>
                <BookOpen className="w-5 h-5 mr-2" /> View Docs
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        <Tabs defaultValue="quickstart" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-12">
            <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
            <TabsTrigger value="sdks">SDKs</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
          </TabsList>

          {/* Quick Start Tab */}
          <TabsContent value="quickstart">
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="mb-4">Get Started in Minutes</h2>
                <p className="text-lg text-foreground-muted max-w-3xl mx-auto">
                  Follow these simple steps to start building with Delibix AI.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { step: 1, title: "Get API Key", description: "Sign up for free API access", icon: Key },
                  { step: 2, title: "Install SDK", description: "Choose your language and install", icon: Download },
                  { step: 3, title: "Start Building", description: "Use examples and documentation", icon: Target }
                ].map((item, index) => (
                  <Card key={item.step} className="glass p-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <item.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">{item.step}</div>
                    <h3 className="mb-3">{item.title}</h3>
                    <p className="text-foreground-muted">{item.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* SDKs Tab */}
          <TabsContent value="sdks">
            <div className="grid md:grid-cols-2 gap-8">
              {sdkResources.map((sdk, index) => (
                <Card key={index} className="glass p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <sdk.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3>{sdk.name}</h3>
                      <p className="text-sm text-foreground-muted">{sdk.version}</p>
                    </div>
                  </div>
                  <p className="text-foreground-muted mb-6">{sdk.description}</p>
                  <div className="flex gap-3">
                    <Button className="gradient-bg-blue text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Install
                    </Button>
                    <Button variant="outline">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Docs
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples">
            <div className="space-y-8">
              <div className="flex gap-4 mb-8">
                <Input
                  placeholder="Search examples..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Languages">All Languages</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="JavaScript">JavaScript</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-6">
                {codeExamples.map((example, index) => (
                  <Card key={example.id} className="glass p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="mb-2">{example.title}</h3>
                        <p className="text-foreground-muted mb-4">{example.description}</p>
                        <div className="flex gap-2">
                          <Badge variant="outline">{example.language}</Badge>
                          <Badge className={getComplexityColor(example.complexity)}>
                            {example.complexity}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyCode(example.code, example.id)}
                      >
                        {copiedCode === example.id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                      <pre className="text-sm overflow-x-auto">
                        <code>{example.code}</code>
                      </pre>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* API Reference Tab */}
          <TabsContent value="api">
            <div className="space-y-6">
              {apiEndpoints.map((endpoint, index) => (
                <Card key={index} className="glass p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {endpoint.method}
                    </Badge>
                    <code className="text-lg font-mono">{endpoint.endpoint}</code>
                  </div>
                  <p className="text-foreground-muted mb-6">{endpoint.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="mb-3">Parameters</h4>
                      <div className="space-y-2">
                        {endpoint.parameters.map((param, idx) => (
                          <div key={idx} className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                            <span className="font-mono text-sm">{param.name}</span>
                            <span className="text-sm text-foreground-muted">{param.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-3">Example Request</h4>
                      <div className="bg-slate-100 dark:bg-slate-800 rounded p-4">
                        <pre className="text-sm">
                          <code>{endpoint.example}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <Card className="glass p-8 text-center mt-20">
          <h2 className="mb-6">Ready to Build Something Amazing?</h2>
          <p className="text-lg text-foreground-muted mb-8 max-w-2xl mx-auto">
            Join thousands of developers building the next generation of AI applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gradient-bg-blue text-white">
              <Key className="w-5 h-5 mr-2" />
              Get Free API Key
            </Button>
            <Button variant="outline" size="lg">
              <Github className="w-5 h-5 mr-2" />
              View on GitHub
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}