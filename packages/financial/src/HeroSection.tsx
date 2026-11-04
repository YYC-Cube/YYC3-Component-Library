'use client';

import { Button } from '@yyc3/ui';
import { Badge } from '@yyc3/ui';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

interface HeroSectionProps {
  language: 'zh' | 'en';
  onGetStarted?: () => void;
}

export function HeroSection({ language, onGetStarted }: HeroSectionProps) {
  const content = {
    zh: {
      badge: 'AI量化交易新时代',
      title: '让每个人都拥有专属的',
      titleHighlight: 'AI量化助手',
      subtitle: 'chaincoven 致力于用区块链和AI技术重塑金融量化生态，连接全球创新者、开发者和投资者，共建开放、智能、可信的金融新世界。',
      cta: '开始体验',
      learnMore: '了解更多',
      features: [
        { icon: Sparkles, title: 'AI驱动决策', desc: '智能分析，精准预测' },
        { icon: Shield, title: '安全可信', desc: '区块链技术保障' },
        { icon: Zap, title: '实时响应', desc: '毫秒级数据处理' }
      ]
    },
    en: {
      badge: 'New Era of AI Quantitative Trading',
      title: 'Empowering Everyone with',
      titleHighlight: 'AI Quantitative Agents',
      subtitle: 'chaincoven is committed to reshaping the financial quantitative ecosystem with blockchain and AI technology, connecting global innovators, developers and investors to build an open, intelligent and trustworthy financial world.',
      cta: 'Get Started',
      learnMore: 'Learn More',
      features: [
        { icon: Sparkles, title: 'AI-Driven Decisions', desc: 'Smart analysis, precise predictions' },
        { icon: Shield, title: 'Secure & Trusted', desc: 'Blockchain technology guarantee' },
        { icon: Zap, title: 'Real-time Response', desc: 'Millisecond data processing' }
      ]
    }
  };

  const t = content[language];

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Badge */}
        <Badge 
          variant="outline" 
          className="mb-6 bg-blue-500/20 text-blue-300 border-blue-400/30 px-4 py-2 text-sm animate-glow"
        >
          {t.badge}
        </Badge>

        {/* Title */}
        <h1 className="mb-6 max-w-4xl mx-auto">
          <span className="block text-4xl md:text-6xl lg:text-7xl mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
            {t.title}
          </span>
          <span className="block text-4xl md:text-6xl lg:text-7xl bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {t.titleHighlight}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
          {t.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-8 py-3 text-lg group"
          >
            {t.cta}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800/50 px-8 py-3 text-lg"
          >
            {t.learnMore}
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {t.features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:bg-slate-800/70 transition-all duration-300 group"
            >
              <feature.icon className="w-8 h-8 text-blue-400 mb-4 mx-auto group-hover:scale-110 transition-transform" />
              <h3 className="text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
      <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></div>
    </section>
  );
}