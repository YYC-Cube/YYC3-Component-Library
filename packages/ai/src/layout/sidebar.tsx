"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandCard } from "@yyc3/ui-enterprise/brand-card";
import { BrandLogo } from "@yyc3/ui-enterprise/brand-logo";
import { type ModuleType, moduleConfigs } from "@/types/modules";
import { ensureDefaultProject } from "@yyc3/lib/default-project";

interface SidebarProps {
  activeModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
  collapsed?: boolean;
}

export default function Sidebar({
  activeModule,
  onModuleChange,
  collapsed = false,
}: SidebarProps) {
  const router = useRouter();
  const [loadingModule, setLoadingModule] = useState<ModuleType | null>(null);
  const [animateIcon, setAnimateIcon] = useState<ModuleType | null>(null);
  return (
    <div className={`h-full bg-white/90 backdrop-blur-md border-r border-gray-200/50 shadow-xl transition-all duration-300`}>
      {/* Logo区域 */}
      <div 
        className={`border-b border-gray-200/50 bg-gradient-to-br from-cloud-blue-50 to-mint-green/10 flex justify-center transition-all duration-300 ${
          collapsed ? 'p-5' : 'p-6'
        }`}
      >
        <div
          className={`overflow-hidden transition-all duration-300 ${
            collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
          }`}
        >
          <BrandLogo
            context="sidebar"
            interactive={true}
            className="flex justify-center"
          />
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="p-4 space-y-2">
        {moduleConfigs.map((module, index) => (
          <div
            key={module.id}
            className={`transform transition-all duration-300 delay-${index * 100}ms ${
              index > 0 ? 'translate-x-0 opacity-100' : ''
            }`}
            style={index > 0 ? { transitionDelay: `${index * 0.1}s` } : {}}
          >
            <BrandCard
              variant={activeModule === module.id ? "glass" : "default"}
              hover={true}
              className={`cursor-pointer transition-all duration-300 ${
                activeModule === module.id
                  ? `border-l-4 border-cloud-blue-500 bg-gradient-to-r from-cloud-blue-50 to-transparent shadow-glow`
                  : "hover:bg-gray-50"
              } ${
                loadingModule === module.id ? "opacity-60 pointer-events-none" : ""
              }`}
              onClick={async () => {
                if (loadingModule) return;
                setLoadingModule(module.id);
                setAnimateIcon(module.id);
                onModuleChange(module.id); // 只切换模块，不跳转路由
                
                // 模拟图标动画效果
                setTimeout(() => {
                  setAnimateIcon(null);
                }, 600);
                
                setTimeout(() => {
                  setLoadingModule(null);
                }, 800);
              }}
              data-testid={`module-nav-${module.id}`}
            >
              <div className="p-3">
                <div className="flex items-center space-x-3">
                  <span
                    className={`text-2xl flex justify-center flex-1 transition-transform duration-200 ${
                      animateIcon === module.id ? 'transform rotate-3' : ''
                    }`}
                  >
                    {module.icon}
                  </span>
                  <div
                    className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                      collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                    }`}
                  >
                    <h3
                      className={`font-medium transition-colors ${
                        activeModule === module.id
                          ? "text-cloud-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      {module.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {module.description}
                    </p>
                  </div>
                </div>
              </div>
            </BrandCard>
          </div>
        ))}
      </nav>

      {/* 默认项目快捷入口 */}
      <div
        className={`px-4 transition-all duration-300 delay-300ms ${
          collapsed ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <BrandCard
          variant="default"
          hover
          className="cursor-pointer hover:bg-gray-50"
          onClick={async () => {
            await ensureDefaultProject("E2E Demo");
            if (typeof window !== "undefined") {
              const raw = window.location.hash || "";
              const params = new URLSearchParams(raw.startsWith("#") ? raw.slice(1) : raw);
              if (!params.has("project")) {
                params.set("project", "E2E Demo");
                window.location.hash = params.toString();
              }
            }
          }}
          data-testid="sidebar-select-default-project"
        >
          <div className="p-3">
            <h3 className="text-sm font-medium text-gray-700">选择默认项目</h3>
            <p className="text-xs text-gray-500 mt-1">快速注入 dev / staging / prod 环境</p>
          </div>
        </BrandCard>
      </div>

      {/* 底部信息 */}
      <div
        className={`absolute bottom-4 left-4 right-4 overflow-hidden transition-all duration-300 ${collapsed ? 'opacity-0 h-0' : 'opacity-100 h-auto'}`}
      >
        <div
          className={`transition-all duration-500 delay-800ms transform ${collapsed ? 'translate-y-5 opacity-0' : 'translate-y-0 opacity-100'}`}
        >
          <BrandCard variant="glass" className="text-center">
            <div className="p-3">
              <p className="text-xs text-gray-600 font-medium">
                言枢象限·语启未来
              </p>
              <div className="mt-2 flex justify-center space-x-1">
                {[1, 2, 3].map((dot, index) => (
                  <div
                    key={dot}
                    className="w-1.5 h-1.5 bg-cloud-blue-400 rounded-full animate-pulse"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-center space-x-1">
                {[1, 2, 3].map((dot) => (
                  <div
                    key={dot}
                    className="w-1.5 h-1.5 bg-cloud-blue-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: dot * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </BrandCard>
        </div>
      </div>
    </div>
  );
}
