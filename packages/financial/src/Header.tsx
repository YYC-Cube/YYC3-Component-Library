'use client';

import { useState } from 'react';
import { Button } from '@yyc3/ui';
import { Badge } from '@yyc3/ui';
import { Globe, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@yyc3/ui';

interface HeaderProps {
  language: 'zh' | 'en';
  onLanguageChange: (lang: 'zh' | 'en') => void;
  onLogin?: () => void;
}

export function Header({ language, onLanguageChange, onLogin }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const content = {
    zh: {
      nav: {
        home: '首页',
        products: '产品介绍',
        architecture: '技术架构',
        membership: '会员订阅',
        developers: '开发者平台',
        login: '登录',
        register: '注册'
      }
    },
    en: {
      nav: {
        home: 'Home',
        products: 'Products',
        architecture: 'Architecture',
        membership: 'Membership',
        developers: 'Developers',
        login: 'Login',
        register: 'Register'
      }
    }
  };

  const t = content[language];

  const navItems = [
    { key: 'home', label: t.nav.home, href: '#home' },
    { key: 'products', label: t.nav.products, href: '#products' },
    { key: 'architecture', label: t.nav.architecture, href: '#architecture' },
    { key: 'membership', label: t.nav.membership, href: '#membership' },
    { key: 'developers', label: t.nav.developers, href: '#developers' }
  ];

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-lg border-b border-slate-700/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            chaincoven
          </span>
          <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-400/30">
            Beta
          </Badge>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="text-slate-300 hover:text-white transition-colors duration-200 hover:glow-blue"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLanguageChange(language === 'zh' ? 'en' : 'zh')}
            className="text-slate-300 hover:text-white hover:bg-slate-800/50"
          >
            <Globe className="w-4 h-4 mr-1" />
            {language === 'zh' ? '中' : 'EN'}
          </Button>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogin}
              className="text-slate-300 hover:text-white hover:bg-slate-800/50"
            >
              {t.nav.login}
            </Button>
            <Button 
              size="sm" 
              onClick={handleLogin}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
            >
              {t.nav.register}
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-slate-900 border-slate-700">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    className="text-slate-300 hover:text-white text-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="pt-4 border-t border-slate-700 space-y-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      handleLogin();
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start text-slate-300 hover:text-white"
                  >
                    {t.nav.login}
                  </Button>
                  <Button 
                    onClick={() => {
                      handleLogin();
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  >
                    {t.nav.register}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}