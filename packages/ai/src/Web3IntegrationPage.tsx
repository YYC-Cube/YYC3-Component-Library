"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Globe, 
  Shield, 
  Coins, 
  Network, 
  Database, 
  Users,
  TrendingUp,
  BarChart3,
  Target,
  Brain,
  Zap,
  Lock,
  Settings,
  Layers,
  Award,
  CheckCircle2,
  ArrowRight,
  Star,
  Clock,
  DollarSign,
  Activity,
  Lightbulb,
  Rocket,
  MessageSquare,
  Calendar,
  FileText,
  Download,
  Play,
  Code
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";

interface Web3IntegrationPageProps {
  navigate: (page: string) => void;
}

export function Web3IntegrationPage({ navigate }: Web3IntegrationPageProps) {
  const [selectedSolutionId, setSelectedSolutionId] = useState("defi-integration");

  const web3Solutions = [
    {
      id: "defi-integration",
      title: "DeFi Integration",
      description: "Decentralized finance solutions for modern businesses",
      icon: Coins,
      applications: [
        "Automated payments",
        "Yield farming strategies",
        "Liquidity pool management",
        "Cross-chain swaps",
        "Staking protocols",
        "Lending platforms"
      ],
      technologies: ["Smart contracts", "AMMs", "Yield protocols", "Cross-chain bridges"],
      maturity: "Production Ready",
      complexity: "High",
      roi: "200-400%",
      timeline: "12-20 weeks"
    },
    {
      id: "nft-marketplace",
      title: "NFT Marketplace",
      description: "Custom NFT platforms and digital asset management",
      icon: Award,
      applications: [
        "Digital asset creation",
        "Marketplace development",
        "Royalty management",
        "Metadata storage",
        "Community features",
        "Analytics dashboard"
      ],
      technologies: ["ERC-721", "IPFS", "Marketplace contracts", "Layer 2 scaling"],
      maturity: "Production Ready",
      complexity: "Medium",
      roi: "150-300%",
      timeline: "8-16 weeks"
    },
    {
      id: "dao-governance",
      title: "DAO Governance",
      description: "Decentralized autonomous organization frameworks",
      icon: Users,
      applications: [
        "Voting mechanisms",
        "Proposal systems",
        "Treasury management",
        "Member onboarding",
        "Governance tokens",
        "Delegation systems"
      ],
      technologies: ["Governance contracts", "Multi-sig wallets", "Snapshot", "Aragon"],
      maturity: "Emerging",
      complexity: "High",
      roi: "180-350%",
      timeline: "16-24 weeks"
    },
    {
      id: "tokenization",
      title: "Asset Tokenization",
      description: "Real-world asset tokenization and management",
      icon: Database,
      applications: [
        "Real estate tokens",
        "Commodity tokenization",
        "Securities digitization",
        "Fractional ownership",
        "Compliance automation",
        "Trading platforms"
      ],
      technologies: ["Security tokens", "Compliance protocols", "Oracle networks", "Legal frameworks"],
      maturity: "Developing",
      complexity: "Very High",
      roi: "300-500%",
      timeline: "20-32 weeks"
    }
  ];

  const web3Architecture = [
    {
      layer: "Frontend Layer",
      description: "User interfaces and Web3 wallet integration",
      components: [
        "React/Vue.js apps",
        "Wallet connectors",
        "dApp browsers",
        "Mobile wallets",
        "Web3 libraries",
        "UI components"
      ],
      technologies: ["Web3.js", "Ethers.js", "WalletConnect", "MetaMask", "Rainbow Kit"]
    },
    {
      layer: "Application Layer",
      description: "Business logic and smart contract interactions",
      components: [
        "Smart contracts",
        "Business logic",
        "API gateways",
        "State management",
        "Event listeners",
        "Transaction management"
      ],
      technologies: ["Solidity", "Hardhat", "OpenZeppelin", "Chainlink", "The Graph"]
    },
    {
      layer: "Protocol Layer",
      description: "Blockchain protocols and consensus mechanisms",
      components: [
        "Consensus algorithms",
        "Virtual machines",
        "Transaction pools",
        "Block validation",
        "Network nodes",
        "P2P networking"
      ],
      technologies: ["Ethereum", "Polygon", "Arbitrum", "Optimism", "Avalanche"]
    },
    {
      layer: "Infrastructure Layer",
      description: "Node infrastructure and network connectivity",
      components: [
        "RPC nodes",
        "IPFS storage",
        "Indexing services",
        "Oracle networks",
        "Bridge protocols",
        "Monitoring tools"
      ],
      technologies: ["Infura", "Alchemy", "IPFS", "Chainlink", "Gelato", "Tenderly"]
    }
  ];

  const implementationPhases = [
    {
      phase: "Strategy & Planning",
      duration: "3-4 weeks",
      activities: [
        "Web3 strategy development",
        "Blockchain selection",
        "Tokenomics design",
        "Compliance assessment",
        "Technical architecture",
        "Risk evaluation"
      ],
      deliverables: [
        "Web3 strategy document",
        "Technical architecture",
        "Tokenomics model",
        "Compliance framework"
      ]
    },
    {
      phase: "Smart Contract Development",
      duration: "6-10 weeks",
      activities: [
        "Contract development",
        "Security auditing",
        "Testing protocols",
        "Gas optimization",
        "Deployment scripts",
        "Verification processes"
      ],
      deliverables: [
        "Audited smart contracts",
        "Test suites",
        "Deployment documentation",
        "Security reports"
      ]
    },
    {
      phase: "Frontend Integration",
      duration: "4-8 weeks",
      activities: [
        "Web3 integration",
        "Wallet connectivity",
        "User interface",
        "Transaction flows",
        "Error handling",
        "Performance optimization"
      ],
      deliverables: [
        "Web3 application",
        "Wallet integrations",
        "User documentation",
        "Testing reports"
      ]
    },
    {
      phase: "Launch & Governance",
      duration: "2-4 weeks",
      activities: [
        "Mainnet deployment",
        "Governance setup",
        "Community onboarding",
        "Monitoring implementation",
        "Support systems",
        "Continuous optimization"
      ],
      deliverables: [
        "Live Web3 platform",
        "Governance framework",
        "Community guidelines",
        "Monitoring dashboards"
      ]
    }
  ];

  const web3Metrics = [
    { label: "TVL Managed", value: "$2.5B+", icon: DollarSign },
    { label: "Smart Contracts", value: "500+", icon: Code },
    { label: "Security Audits", value: "100%", icon: Shield },
    { label: "Gas Optimization", value: "60%", icon: Zap },
    { label: "Uptime", value: "99.9%", icon: Activity },
    { label: "Transactions", value: "10M+", icon: TrendingUp }
  ];

  const useCases = [
    {
      title: "DeFi Yield Platform",
      industry: "Financial Services",
      challenge: "Traditional banking yields below inflation rates",
      solution: "Automated DeFi yield farming with risk management",
      results: ["15-25% annual yields", "Automated rebalancing", "Risk-adjusted returns"],
      timeline: "16 weeks",
      client: "Digital Asset Manager"
    },
    {
      title: "NFT Art Marketplace",
      industry: "Creative Arts",
      challenge: "Artists need direct monetization without intermediaries",
      solution: "Custom NFT marketplace with creator royalties",
      results: ["Zero platform fees", "Automated royalties", "Creator community"],
      timeline: "12 weeks",
      client: "Digital Art Collective"
    },
    {
      title: "Real Estate Tokenization",
      industry: "Real Estate",
      challenge: "Illiquid real estate investments with high barriers",
      solution: "Fractional ownership through security tokens",
      results: ["24/7 trading", "Fractional ownership", "Global accessibility"],
      timeline: "24 weeks",
      client: "Property Investment Fund"
    }
  ];

  const selectedSolutionData = web3Solutions.find(sol => sol.id === selectedSolutionId);

  const getMaturityColor = (maturity: string) => {
    switch (maturity) {
      case "Production Ready": return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "Emerging": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      case "Developing": return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-800";
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Very High": return "text-red-600 bg-red-100 dark:bg-red-900/30";
      case "High": return "text-orange-600 bg-orange-100 dark:bg-orange-900/30";
      case "Medium": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      case "Low": return "text-green-600 bg-green-100 dark:bg-green-900/30";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950/20 dark:via-background dark:to-blue-950/20 prevent-overflow-x">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-blue-50/30 to-purple-100/40 dark:from-purple-950/20 dark:via-blue-950/10 dark:to-purple-900/20" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,69,244,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,69,244,0.03)_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(rgba(139,69,244,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,69,244,0.05)_1px,transparent_1px)]" />
          
          {/* Web3 themed floating elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/30 dark:bg-purple-600/20 rounded-full blur-xl float" />
          <div className="absolute top-32 right-20 w-24 h-24 bg-blue-300/40 dark:bg-blue-500/30 rounded-full blur-lg float-delayed" />
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-purple-400/35 dark:bg-purple-400/25 rounded-full blur-md float-delayed-2" />
          
          {/* Blockchain visualization */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5">
            <div className="relative w-64 h-64">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-8 h-6 bg-purple-400 rounded animate-pulse"
                  style={{
                    top: `${20 + (i % 3) * 25}%`,
                    left: `${20 + Math.floor(i / 3) * 30}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: '3s'
                  }}
                />
              ))}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-20 bg-blue-500 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-12"
            >
              {/* Icon */}
              <div className="flex justify-center mb-8">
                <div className="glass p-4 rounded-2xl glow-blue-light dust-container">
                  <Globe className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                  <div className="dust-particle dust-particle-blue dust-particle-1"></div>
                  <div className="dust-particle dust-particle-light dust-particle-2"></div>
                  <div className="dust-particle dust-particle-white dust-particle-3"></div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="gradient-text-blue">Web3</span>{' '}
                <span className="text-purple-600">Integration</span>{' '}
                <span className="gradient-text-blue-light">Solutions</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-foreground-muted max-w-4xl mx-auto mb-8 leading-relaxed">
                Transform your business with blockchain technology, smart contracts, and decentralized applications. Build the future of digital commerce and finance.
              </p>

              {/* Technology Badges */}
              <div className="flex justify-center flex-wrap gap-4 mb-8">
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-4 py-2">
                  <Code className="w-4 h-4 mr-2" />
                  Smart Contracts
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-4 py-2">
                  <Coins className="w-4 h-4 mr-2" />
                  DeFi Solutions
                </Badge>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-4 py-2">
                  <Award className="w-4 h-4 mr-2" />
                  NFT Platforms
                </Badge>
                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 px-4 py-2">
                  <Users className="w-4 h-4 mr-2" />
                  DAO Governance
                </Badge>
              </div>

              {/* Success Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto mb-8">
                {web3Metrics.map((metric, index) => {
                  const Icon = metric.icon;
                  return (
                    <div key={index} className="glass-blue-light p-4 rounded-xl text-center">
                      <Icon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-purple-600">{metric.value}</div>
                      <div className="text-xs text-foreground-muted">{metric.label}</div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                onClick={() => navigate('demo-request')}
                size="lg"
                className="gradient-bg-blue text-white hover:gradient-bg-blue-light transition-all duration-300 px-8 py-6 text-lg button-hover"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Web3 Project
              </Button>
              
              <Button
                onClick={() => navigate('contact')}
                variant="outline"
                size="lg"
                className="glass-blue-light border-blue-200 dark:border-blue-700 hover:glass-blue transition-all duration-300 px-8 py-6 text-lg button-hover"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Web3 Consultation
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs defaultValue="solutions" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass">
            <TabsTrigger value="solutions">Web3 Solutions</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
            <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
          </TabsList>

          <TabsContent value="solutions" className="space-y-8 mt-8">
            {/* Web3 Solutions */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-600" />
                  Blockchain & Web3 Solutions
                </CardTitle>
                <CardDescription>
                  Comprehensive decentralized solutions for modern businesses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {web3Solutions.map((solution, index) => {
                    const Icon = solution.icon;
                    const isSelected = solution.id === selectedSolutionId;
                    
                    return (
                      <motion.div
                        key={solution.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`cursor-pointer ${isSelected ? 'ring-2 ring-purple-500' : ''}`}
                        onClick={() => setSelectedSolutionId(solution.id)}
                      >
                        <Card className={`glass h-full card-hover ${isSelected ? 'bg-purple-50/50 dark:bg-purple-950/30' : ''}`}>
                          <CardContent className="p-6 text-center">
                            <div className="flex justify-center mb-4">
                              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                <Icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                              </div>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{solution.title}</h3>
                            <p className="text-sm text-foreground-muted mb-4">{solution.description}</p>
                            <div className="space-y-2">
                              <Badge className={getMaturityColor(solution.maturity)}>
                                {solution.maturity}
                              </Badge>
                              <div className="text-xs text-foreground-muted">
                                ROI: {solution.roi}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Selected Solution Details */}
                {selectedSolutionData && (
                  <Card className="glass bg-purple-50/50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-700">
                    <CardHeader>
                      <CardTitle className="text-purple-700 dark:text-purple-300">
                        {selectedSolutionData.title} - Implementation Details
                      </CardTitle>
                      <CardDescription>
                        Applications, technologies, and development approach
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold">Key Applications:</h4>
                          <div className="space-y-2">
                            {selectedSolutionData.applications.map((app, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span className="text-sm">{app}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-semibold">Technologies:</h4>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {selectedSolutionData.technologies.map((tech, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          <div className="pt-4 border-t border-purple-200 dark:border-purple-700">
                            <div className="text-sm font-medium mb-1">Complexity Level:</div>
                            <Badge className={getComplexityColor(selectedSolutionData.complexity)}>
                              {selectedSolutionData.complexity}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-semibold">Project Details:</h4>
                          <div className="space-y-3">
                            <div className="glass-blue-light p-3 rounded-lg">
                              <div className="text-sm font-medium">Expected ROI:</div>
                              <div className="text-lg font-bold text-purple-600">{selectedSolutionData.roi}</div>
                            </div>
                            <div className="glass-blue-light p-3 rounded-lg">
                              <div className="text-sm font-medium">Timeline:</div>
                              <div className="text-lg font-bold text-blue-600">{selectedSolutionData.timeline}</div>
                            </div>
                          </div>
                          <Button className="w-full" onClick={() => navigate('demo-request')}>
                            <Play className="w-4 h-4 mr-2" />
                            Request Demo
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="architecture" className="space-y-6 mt-8">
            {/* Web3 Architecture */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-6 h-6 text-purple-600" />
                  Web3 Technology Stack
                </CardTitle>
                <CardDescription>
                  Four-layer architecture for decentralized applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {web3Architecture.map((layer, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      {/* Architecture connector */}
                      {index < web3Architecture.length - 1 && (
                        <div className="absolute left-6 top-16 w-0.5 h-24 bg-purple-200 dark:bg-purple-700" />
                      )}
                      
                      <div className="flex items-start gap-6">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex-shrink-0">
                          <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                        </div>
                        
                        <div className="flex-grow">
                          <h3 className="text-xl font-semibold mb-2">{layer.layer}</h3>
                          <p className="text-foreground-muted mb-4">{layer.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium mb-3">Components:</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {layer.components.map((component, compIndex) => (
                                  <div key={compIndex} className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                                    <span>{component}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-3">Technologies:</h4>
                              <div className="flex flex-wrap gap-2">
                                {layer.technologies.map((tech, techIndex) => (
                                  <Badge key={techIndex} variant="outline" className="text-xs">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Networks */}
            <Card className="glass w-full">
              <CardHeader>
                <CardTitle>Supported Blockchain Networks</CardTitle>
                <CardDescription>Multi-chain deployment capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 glass-blue-light rounded-lg">
                    <Network className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Ethereum Ecosystem</h3>
                    <p className="text-sm text-foreground-muted mb-4">Layer 1 and Layer 2 solutions</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      <Badge variant="outline" className="text-xs">Ethereum</Badge>
                      <Badge variant="outline" className="text-xs">Polygon</Badge>
                      <Badge variant="outline" className="text-xs">Arbitrum</Badge>
                    </div>
                  </div>
                  
                  <div className="text-center p-6 glass-blue-light rounded-lg">
                    <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Enterprise Chains</h3>
                    <p className="text-sm text-foreground-muted mb-4">High-performance business networks</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      <Badge variant="outline" className="text-xs">Avalanche</Badge>
                      <Badge variant="outline" className="text-xs">BSC</Badge>
                      <Badge variant="outline" className="text-xs">Solana</Badge>
                    </div>
                  </div>
                  
                  <div className="text-center p-6 glass-blue-light rounded-lg">
                    <Lock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Private Networks</h3>
                    <p className="text-sm text-foreground-muted mb-4">Custom enterprise blockchains</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      <Badge variant="outline" className="text-xs">Hyperledger</Badge>
                      <Badge variant="outline" className="text-xs">Quorum</Badge>
                      <Badge variant="outline" className="text-xs">Besu</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="implementation" className="space-y-6 mt-8">
            {/* Implementation Process */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-6 h-6 text-purple-600" />
                  Web3 Implementation Process
                </CardTitle>
                <CardDescription>
                  Structured approach to blockchain development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {implementationPhases.map((phase, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      {/* Timeline connector */}
                      {index < implementationPhases.length - 1 && (
                        <div className="absolute left-6 top-16 w-0.5 h-32 bg-purple-200 dark:bg-purple-700" />
                      )}
                      
                      <div className="flex items-start gap-6">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex-shrink-0">
                          <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{phase.phase}</h3>
                            <Badge variant="outline">{phase.duration}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div>
                              <h4 className="font-medium mb-3">Key Activities:</h4>
                              <div className="space-y-2">
                                {phase.activities.map((activity, actIndex) => (
                                  <div key={actIndex} className="flex items-center gap-2 text-sm">
                                    <ArrowRight className="w-3 h-3 text-purple-600" />
                                    <span>{activity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-3">Deliverables:</h4>
                              <div className="space-y-2">
                                {phase.deliverables.map((deliverable, delIndex) => (
                                  <div key={delIndex} className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                                    <span>{deliverable}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="case-studies" className="space-y-6 mt-8">
            {/* Case Studies */}
            <div className="space-y-6">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-heavy">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-grow">
                          <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-foreground-muted mb-4">
                            <span>🏢 {useCase.industry}</span>
                            <span>⏱️ {useCase.timeline}</span>
                            <span>👤 {useCase.client}</span>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Challenge:</h4>
                              <p className="text-foreground-muted">{useCase.challenge}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Solution:</h4>
                              <p className="text-foreground-muted">{useCase.solution}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Results:</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {useCase.results.map((result, resultIndex) => (
                                  <div key={resultIndex} className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg text-center">
                                    <div className="text-purple-600 dark:text-purple-400 font-semibold">{result}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* CTA for More Case Studies */}
            <Card className="glass text-center">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Ready to Enter Web3?</h3>
                <p className="text-foreground-muted mb-6">
                  Join the decentralized revolution with blockchain solutions that transform how you do business.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate('success-stories')}>
                    <FileText className="w-4 h-4 mr-2" />
                    More Case Studies
                  </Button>
                  <Button variant="outline" onClick={() => navigate('demo-request')}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Final CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <Card className="glass w-full bg-gradient-to-r from-purple-50/50 via-blue-50/50 to-purple-50/50 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-purple-950/30">
            <CardContent className="p-12">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Build the Decentralized Future
                </h2>
                <p className="text-lg text-foreground-muted mb-8">
                  Transform your business with blockchain technology, smart contracts, and Web3 innovation. Join the decentralized economy today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => navigate('demo-request')}
                    size="lg"
                    className="gradient-bg-blue text-white hover:gradient-bg-blue-light transition-all duration-300 px-8 py-4"
                  >
                    <Globe className="w-5 h-5 mr-2" />
                    Launch Web3 Project
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('contact')}
                    size="lg"
                    className="px-8 py-4"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Blockchain Consultation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}