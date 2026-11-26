// src/CyberpunkWidget.tsx
import {
  useState,
  useRef,
  useCallback,
  useEffect,
  memo
} from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_THEME_COLOR = "#00f0ff";
var CyberpunkWidget = memo(function CyberpunkWidget2({
  tabs,
  defaultActiveTab,
  title = "YYC\xB3",
  subtitle = "\u667A\u80FD\u52A9\u624B",
  defaultWidth = 420,
  defaultHeight = 620,
  minWidth = 320,
  maxWidth = 800,
  minHeight = 400,
  maxHeight = 900,
  onSwitchMode,
  themeColor = DEFAULT_THEME_COLOR,
  showQuickActions = true,
  quickActions,
  className = ""
}) {
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState(
    defaultActiveTab ?? tabs[0]?.id ?? ""
  );
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: defaultWidth, h: defaultHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 });
  const resizeRef = useRef({ startX: 0, startY: 0, startW: 0, startH: 0 });
  const widgetRef = useRef(null);
  useEffect(() => {
    setPosition({
      x: window.innerWidth - defaultWidth - 24,
      y: window.innerHeight - defaultHeight - 24
    });
  }, [defaultWidth, defaultHeight]);
  const onDragStart = useCallback(
    (e) => {
      if (maximized) return;
      setIsDragging(true);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startPosX: position.x,
        startPosY: position.y
      };
    },
    [position, maximized]
  );
  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - size.w, dragRef.current.startPosX + dx)),
        y: Math.max(0, Math.min(window.innerHeight - size.h, dragRef.current.startPosY + dy))
      });
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging, size]);
  const onResizeStart = useCallback(
    (e) => {
      e.stopPropagation();
      if (maximized) return;
      setIsResizing(true);
      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startW: size.w,
        startH: size.h
      };
    },
    [size, maximized]
  );
  useEffect(() => {
    if (!isResizing) return;
    const onMove = (e) => {
      const dw = e.clientX - resizeRef.current.startX;
      const dh = e.clientY - resizeRef.current.startY;
      setSize({
        w: Math.max(minWidth, Math.min(maxWidth, resizeRef.current.startW + dw)),
        h: Math.max(minHeight, Math.min(maxHeight, resizeRef.current.startH + dh))
      });
    };
    const onUp = () => setIsResizing(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isResizing, minWidth, maxWidth, minHeight, maxHeight]);
  const toggleMaximize = () => {
    setMaximized((prev) => !prev);
  };
  const activeTabConfig = tabs.find((t) => t.id === activeTab);
  if (minimized) {
    return /* @__PURE__ */ jsxs("div", { className: "fixed z-[10000]", style: { bottom: 24, right: 24 }, children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setMinimized(false),
          className: "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 group",
          style: {
            background: `linear-gradient(135deg, ${themeColor}, #00d4ff)`,
            boxShadow: `0 0 20px ${themeColor}80, 0 0 40px ${themeColor}50`,
            animation: "neon-pulse 2s ease-in-out infinite"
          },
          "aria-label": "\u5C55\u5F00\u7A97\u53E3",
          children: /* @__PURE__ */ jsx(
            "svg",
            {
              className: "w-6 h-6 text-white group-hover:animate-spin",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M4 6h16M4 12h16M4 18h16"
                }
              )
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 rounded-full pointer-events-none",
          style: {
            border: `2px solid ${themeColor}50`,
            animation: "neon-pulse 2s ease-in-out infinite"
          }
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: widgetRef,
      className: `fixed z-[10000] flex flex-col ${className}`,
      role: "dialog",
      "aria-label": title,
      style: {
        width: maximized ? "100vw" : size.w,
        height: maximized ? "100vh" : size.h,
        left: maximized ? 0 : position.x,
        top: maximized ? 0 : position.y,
        borderRadius: maximized ? 0 : 20,
        background: "rgba(10,10,10,0.78)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: maximized ? "none" : `2px solid ${themeColor}60`,
        boxShadow: maximized ? "none" : `0 20px 60px rgba(0,0,0,0.6), 0 0 25px ${themeColor}66, 0 0 50px ${themeColor}30`,
        transition: isDragging || isResizing ? "none" : "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        willChange: "transform, opacity"
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0 pointer-events-none",
            style: {
              borderRadius: maximized ? 0 : 20,
              background: `linear-gradient(135deg, ${themeColor}12 0%, transparent 50%), linear-gradient(225deg, #00d4ff12 0%, transparent 50%)`
            }
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0 pointer-events-none",
            style: {
              borderRadius: maximized ? 0 : 20,
              backgroundImage: `linear-gradient(${themeColor}08 1px, transparent 1px), linear-gradient(90deg, ${themeColor}08 1px, transparent 1px)`,
              backgroundSize: "18px 18px"
            }
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "relative z-20 flex items-center justify-between px-4 py-3 shrink-0 select-none",
            style: {
              cursor: maximized ? "default" : "grab",
              borderBottom: `1px solid ${themeColor}25`,
              background: "rgba(0,0,0,0.3)",
              borderRadius: maximized ? "0" : "20px 20px 0 0"
            },
            onMouseDown: onDragStart,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "w-7 h-7 rounded-lg flex items-center justify-center",
                    style: {
                      background: `linear-gradient(135deg, ${themeColor}, #00d4ff)`,
                      boxShadow: `0 0 10px ${themeColor}80`
                    },
                    children: /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) })
                  }
                ),
                /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(
                  "span",
                  {
                    className: "text-sm text-white/90 tracking-wider",
                    style: { textShadow: `0 0 8px ${themeColor}80` },
                    children: [
                      title,
                      " ",
                      /* @__PURE__ */ jsx("span", { style: { color: "#00d4ff", textShadow: "0 0 6px rgba(0,212,255,0.5)" }, children: subtitle })
                    ]
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                onSwitchMode && /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: onSwitchMode,
                    className: "p-1.5 rounded-lg transition-all duration-300 hover:bg-white/10 group",
                    title: "\u72EC\u7ACB\u5E94\u7528\u6A21\u5F0F",
                    "aria-label": "\u5207\u6362\u5230\u72EC\u7ACB\u6A21\u5F0F",
                    children: /* @__PURE__ */ jsx(
                      "svg",
                      {
                        className: "w-3.5 h-3.5 text-white/30 group-hover:text-[#00d4ff]",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 19l-7-7m0 0l7-7m-7 7h18" })
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setMinimized(true),
                    className: "p-1.5 rounded-lg transition-all duration-300 hover:bg-white/10 group",
                    "aria-label": "\u6700\u5C0F\u5316",
                    children: /* @__PURE__ */ jsx(
                      "svg",
                      {
                        className: "w-3.5 h-3.5 text-white/30 group-hover:text-[#00ffcc]",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 12H4" })
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: toggleMaximize,
                    className: "p-1.5 rounded-lg transition-all duration-300 hover:bg-white/10 group",
                    "aria-label": maximized ? "\u8FD8\u539F" : "\u6700\u5927\u5316",
                    children: maximized ? /* @__PURE__ */ jsx(
                      "svg",
                      {
                        className: "w-3.5 h-3.5 text-white/30 group-hover:text-[#00ffc8]",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" })
                      }
                    ) : /* @__PURE__ */ jsx(
                      "svg",
                      {
                        className: "w-3.5 h-3.5 text-white/30 group-hover:text-[#00ffc8]",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" })
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setMinimized(true),
                    className: "p-1.5 rounded-lg transition-all duration-300 hover:bg-[#005f7320] group",
                    "aria-label": "\u5173\u95ED",
                    children: /* @__PURE__ */ jsx(
                      "svg",
                      {
                        className: "w-3.5 h-3.5 text-white/30 group-hover:text-[#005f73]",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" })
                      }
                    )
                  }
                )
              ] })
            ]
          }
        ),
        tabs.length > 1 && /* @__PURE__ */ jsx(
          "div",
          {
            className: "relative z-20 flex items-center gap-1 px-3 py-2 shrink-0",
            style: { borderBottom: `1px solid ${themeColor}15`, background: "rgba(0,0,0,0.15)" },
            children: tabs.map((tab) => {
              const active = activeTab === tab.id;
              const IconComponent = typeof tab.icon === "string" ? null : tab.icon;
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setActiveTab(tab.id),
                  className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-300",
                  style: {
                    background: active ? `${tab.color}15` : "transparent",
                    color: active ? tab.color : "rgba(255,255,255,0.35)",
                    border: active ? `1px solid ${tab.color}30` : "1px solid transparent",
                    boxShadow: active ? `0 0 8px ${tab.color}20` : "none"
                  },
                  children: [
                    IconComponent ? /* @__PURE__ */ jsx(IconComponent, { className: "w-3.5 h-3.5" }) : typeof tab.icon === "string" && /* @__PURE__ */ jsx("span", { className: "text-sm", children: tab.icon }),
                    /* @__PURE__ */ jsx("span", { children: tab.label })
                  ]
                },
                tab.id
              );
            })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "relative z-20 flex-1 overflow-hidden", children: activeTabConfig?.content }),
        showQuickActions && quickActions && quickActions.length > 0 && /* @__PURE__ */ jsx(
          "div",
          {
            className: "relative z-20 flex items-center justify-around px-4 py-2 shrink-0",
            style: {
              borderTop: `1px solid ${themeColor}18`,
              background: "rgba(0,0,0,0.2)",
              borderRadius: maximized ? "0" : "0 0 20px 20px"
            },
            children: quickActions.map((action, i) => {
              const IconComponent = typeof action.icon === "function" ? action.icon : null;
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: action.onClick,
                  className: "flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all duration-300 hover:bg-white/5 group",
                  children: [
                    IconComponent ? /* @__PURE__ */ jsx(IconComponent, { className: "w-3.5 h-3.5 text-white/25 group-hover:text-[#00f0ff] transition-colors" }) : typeof action.icon === "string" && /* @__PURE__ */ jsx("span", { className: "text-sm", children: action.icon }),
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] text-white/20 group-hover:text-white/50 transition-colors", children: action.label })
                  ]
                },
                i
              );
            })
          }
        ),
        !maximized && /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute bottom-0 right-0 w-6 h-6 cursor-se-resize z-30 flex items-center justify-center",
            onMouseDown: onResizeStart,
            style: { borderRadius: "0 0 20px 0" },
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                className: "w-3 h-3 text-white/10 rotate-[-45deg]",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 8h16M4 16h16" })
              }
            )
          }
        )
      ]
    }
  );
});

// src/GlitchText.tsx
import { useState as useState2, useEffect as useEffect2, useRef as useRef2, useCallback as useCallback2, memo as memo2 } from "react";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var GlitchText = memo2(function GlitchText2({
  children,
  color = "#00f0ff",
  className = "",
  style,
  inline = true,
  interval = [3e3, 8e3],
  intensity = 1,
  as: Tag = "span",
  enabled = true
}) {
  const [isGlitching, setIsGlitching] = useState2(false);
  const [isHovering, setIsHovering] = useState2(false);
  const timerRef = useRef2(void 0);
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const shouldAnimate = enabled && !prefersReducedMotion;
  useEffect2(() => {
    if (!shouldAnimate || !interval) return;
    const scheduleGlitch = () => {
      const [min, max] = interval;
      const delay = min + Math.random() * (max - min);
      timerRef.current = setTimeout(() => {
        setIsGlitching(true);
        setTimeout(() => {
          setIsGlitching(false);
          scheduleGlitch();
        }, 150 + Math.random() * 250);
      }, delay);
    };
    scheduleGlitch();
    return () => clearTimeout(timerRef.current);
  }, [shouldAnimate, interval]);
  const handleMouseEnter = useCallback2(() => {
    if (shouldAnimate) setIsHovering(true);
  }, [shouldAnimate]);
  const handleMouseLeave = useCallback2(() => {
    setIsHovering(false);
  }, []);
  const active = shouldAnimate && (isGlitching || isHovering);
  const hoverActive = shouldAnimate && isHovering;
  const px = Math.round(3 * intensity);
  return /* @__PURE__ */ jsxs2(
    Tag,
    {
      className: `${inline ? "inline-block" : "block"} relative ${className}`,
      style: {
        ...style,
        color,
        willChange: active ? "transform, clip-path" : "auto",
        animation: active ? `glitch-skew ${hoverActive ? "0.3s" : "0.5s"} ease-in-out` : void 0
      },
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      "aria-label": children,
      children: [
        /* @__PURE__ */ jsx2(
          "span",
          {
            className: "relative z-10",
            style: {
              animation: active ? `glitch-color-shift ${hoverActive ? "0.15s" : "0.3s"} ease-in-out` : void 0
            },
            children
          }
        ),
        active && /* @__PURE__ */ jsx2(
          "span",
          {
            className: "absolute inset-0 z-0 pointer-events-none",
            style: {
              color: "#00d4ff",
              opacity: 0.7 * intensity,
              animation: hoverActive ? "glitch-text-hover 0.4s steps(2, start) infinite" : "glitch-text-1 0.4s steps(2, start)",
              textShadow: `${px}px 0 #00d4ff`
            },
            "aria-hidden": "true",
            children
          }
        ),
        active && /* @__PURE__ */ jsx2(
          "span",
          {
            className: "absolute inset-0 z-0 pointer-events-none",
            style: {
              color: "#00d4ff",
              opacity: 0.5 * intensity,
              animation: hoverActive ? "glitch-text-hover 0.35s steps(2, start) 0.05s infinite" : "glitch-text-2 0.35s steps(2, start)",
              textShadow: `${-px}px 0 #00d4ff`
            },
            "aria-hidden": "true",
            children
          }
        )
      ]
    }
  );
});

// src/NeonCard.tsx
import { memo as memo3, useRef as useRef3, useEffect as useEffect3, useState as useState3 } from "react";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var LIQUID_COLOR_MAP = {
  "#00f0ff": "#00ff87",
  "#00d4ff": "#06b6d4",
  "#00ffcc": "#22d3ee",
  "#00ffc8": "#00ffaa",
  "#41ffdd": "#34d399",
  "#008b9d": "#0891b2"
};
var NeonCard = memo3(function NeonCard2({
  children,
  color = "#00f0ff",
  className = "",
  hoverable = true,
  onClick,
  noReveal = false,
  ariaLabel,
  themeMode = "cyberpunk",
  style
}) {
  const cardRef = useRef3(null);
  const [revealed, setRevealed] = useState3(noReveal);
  const isLiquid = themeMode === "liquidGlass";
  const effectiveColor = isLiquid ? LIQUID_COLOR_MAP[color] || color : color;
  useEffect3(() => {
    if (noReveal || revealed) return;
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [noReveal, revealed]);
  const getThemeStyles = () => {
    const baseStyles = {
      transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      willChange: hoverable ? "transform, box-shadow" : "auto",
      opacity: revealed ? 1 : 0,
      transform: revealed ? "translateY(0) scale(1)" : "translateY(24px) scale(0.96)"
    };
    if (isLiquid) {
      return {
        ...baseStyles,
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderTop: "1px solid rgba(255,255,255,0.18)",
        borderLeft: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.08)",
        borderRadius: "20px"
      };
    }
    return {
      ...baseStyles,
      background: "rgba(10,10,10,0.75)",
      backdropFilter: "blur(20px) saturate(180%)",
      borderColor: `${effectiveColor}33`,
      border: `1px solid ${effectiveColor}33`,
      boxShadow: `0 0 10px ${effectiveColor}33, inset 0 0 15px ${effectiveColor}0d`
    };
  };
  const handleMouseEnter = (e) => {
    if (hoverable) {
      const target = e.currentTarget;
      if (isLiquid) {
        target.style.background = "rgba(255,255,255,0.10)";
        target.style.boxShadow = "0 16px 40px rgba(0,0,0,0.12), 0 0 30px rgba(0,255,135,0.1), inset 0 1px 0 rgba(255,255,255,0.12)";
      } else {
        target.style.borderColor = `${effectiveColor}80`;
        target.style.boxShadow = `0 0 20px ${effectiveColor}66, 0 0 40px ${effectiveColor}33, inset 0 0 20px ${effectiveColor}1a`;
      }
    }
  };
  const handleMouseLeave = (e) => {
    if (hoverable) {
      const target = e.currentTarget;
      if (isLiquid) {
        target.style.background = "rgba(255,255,255,0.06)";
        target.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.08)";
      } else {
        target.style.borderColor = `${effectiveColor}33`;
        target.style.boxShadow = `0 0 10px ${effectiveColor}33, inset 0 0 15px ${effectiveColor}0d`;
      }
    }
  };
  return /* @__PURE__ */ jsxs3(
    "div",
    {
      ref: cardRef,
      onClick,
      role: onClick ? "button" : void 0,
      tabIndex: onClick ? 0 : void 0,
      "aria-label": ariaLabel,
      "data-neon-card": "",
      onKeyDown: onClick ? (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      } : void 0,
      className: `
        relative overflow-hidden rounded-2xl p-5
        transition-all duration-400
        ${hoverable ? "cursor-pointer hover:-translate-y-2 hover:scale-[1.02]" : ""}
        ${className}
      `,
      style: { ...getThemeStyles(), ...style },
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      children: [
        /* @__PURE__ */ jsx3(
          "div",
          {
            className: "absolute top-0 left-0 w-1/2 h-full pointer-events-none opacity-0 hover:opacity-100",
            style: {
              background: isLiquid ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" : "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
              animation: "shimmer-move 3s ease-in-out infinite"
            }
          }
        ),
        !isLiquid && /* @__PURE__ */ jsx3(
          "div",
          {
            className: "absolute inset-0 pointer-events-none opacity-30",
            style: {
              backgroundImage: `linear-gradient(${effectiveColor}0f 1px, transparent 1px), linear-gradient(90deg, ${effectiveColor}0f 1px, transparent 1px)`,
              backgroundSize: "20px 20px"
            }
          }
        ),
        /* @__PURE__ */ jsx3("div", { className: "relative z-10", children })
      ]
    }
  );
});

// src/ParticleCanvas.tsx
import { useEffect as useEffect4, useRef as useRef4, useCallback as useCallback3, memo as memo4 } from "react";
import { jsx as jsx4 } from "react/jsx-runtime";
var DEFAULT_COLORS = [
  "#00f0ff",
  // primary cyan
  "#00d4ff",
  // secondary blue-cyan
  "#00ffcc",
  // accent cyan-green
  "#00ffc8",
  // success cyan
  "#41ffdd"
  // highlight cyan
];
var DEFAULT_CONFIG = {
  enabled: true,
  neonIntensity: 80,
  colors: DEFAULT_COLORS,
  connectionDistance: 120,
  particleCountFactor: 35e-6,
  maxParticles: 60,
  minParticles: 15,
  opacity: 0.6,
  mouseInteractionRange: 150
};
var ParticleCanvas = memo4(function ParticleCanvas2({
  config: userConfig,
  className = "",
  style,
  enableMouseInteraction = true,
  autoResize = true
}) {
  const config = { ...DEFAULT_CONFIG, ...userConfig };
  const canvasRef = useRef4(null);
  const particlesRef = useRef4([]);
  const animFrameRef = useRef4(0);
  const mouseRef = useRef4({ x: -1e3, y: -1e3 });
  const createParticles = useCallback3(
    (width, height) => {
      const area = width * height;
      const count = Math.max(
        config.minParticles,
        Math.min(config.maxParticles, Math.floor(area * config.particleCountFactor))
      );
      return Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 1 + Math.random() * 2,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        alpha: 0.15 + Math.random() * 0.35,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02
      }));
    },
    [config]
  );
  useEffect4(() => {
    const canvas = canvasRef.current;
    if (!canvas || !config.enabled) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particlesRef.current = createParticles(width, height);
    };
    resize();
    if (autoResize) {
      window.addEventListener("resize", resize);
    }
    let handleMouse = null;
    let handleMouseLeave = null;
    if (enableMouseInteraction) {
      handleMouse = (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      };
      handleMouseLeave = () => {
        mouseRef.current = { x: -1e3, y: -1e3 };
      };
      canvas.addEventListener("mousemove", handleMouse);
      canvas.addEventListener("mouseleave", handleMouseLeave);
    }
    const neonScale = config.neonIntensity / 100;
    const animate = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.pulsePhase += p.pulseSpeed;
        const pulse = 0.6 + 0.4 * Math.sin(p.pulsePhase);
        if (enableMouseInteraction) {
          const mdx = mouse.x - p.x;
          const mdy = mouse.y - p.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < config.mouseInteractionRange && mDist > 1) {
            p.vx += mdx / mDist * 0.02;
            p.vy += mdy / mDist * 0.02;
          }
        }
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
        const alpha = p.alpha * pulse * neonScale;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha * 0.15;
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < config.connectionDistance) {
            const lineAlpha = (1 - dist / config.connectionDistance) * 0.15 * neonScale;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = a.color;
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      if (enableMouseInteraction && mouse.x > 0 && mouse.y > 0) {
        for (const p of particles) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const lineAlpha = (1 - dist / 180) * 0.25 * neonScale;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      if (autoResize) {
        window.removeEventListener("resize", resize);
      }
      if (handleMouse) {
        canvas.removeEventListener("mousemove", handleMouse);
      }
      if (handleMouseLeave) {
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [
    config,
    createParticles,
    enableMouseInteraction,
    autoResize
  ]);
  if (!config.enabled) return null;
  return /* @__PURE__ */ jsx4(
    "canvas",
    {
      ref: canvasRef,
      className: `particle-canvas absolute inset-0 pointer-events-auto z-0 ${className}`,
      style: { opacity: config.opacity, ...style },
      "aria-hidden": "true"
    }
  );
});

// src/ParticleEmitter.tsx
import { useRef as useRef5, useEffect as useEffect5, memo as memo5 } from "react";
import { jsx as jsx5 } from "react/jsx-runtime";
var ParticleEmitter = memo5(function ParticleEmitter2({
  position,
  speed,
  color,
  active,
  maxParticles = 100,
  particleLife = 20,
  className = "",
  style
}) {
  const canvasRef = useRef5(null);
  useEffect5(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particles = [];
    let animationFrame;
    const initParticles = () => {
      particles = [];
      const count = Math.min(maxParticles, Math.max(10, Math.floor(speed * 10)));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: position.x,
          y: position.y,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * speed * 2,
          speedY: (Math.random() - 0.5) * speed,
          color: `rgba(${color.r}, ${color.g}, ${color.b}, ${Math.random() * 0.5 + 0.3})`,
          life: Math.random() * particleLife + 10
        });
      }
    };
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        p.x += p.speedX;
        p.y += p.speedY;
        p.life--;
        if (p.life <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }
      if (particles.length > 0) {
        animationFrame = requestAnimationFrame(drawParticles);
      }
    };
    initParticles();
    drawParticles();
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [active, position, speed, color, maxParticles, particleLife]);
  return /* @__PURE__ */ jsx5(
    "canvas",
    {
      ref: canvasRef,
      className: `particle-emitter ${className}`,
      style: {
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 100,
        width: "100%",
        height: "100%",
        ...style
      },
      "aria-hidden": "true"
    }
  );
});

// src/3DEffects.tsx
import React3, { useState as useState4 } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
function TiltCard({
  children,
  className = "",
  maxTilt = 10,
  scale = 1.05,
  speed = 400
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: speed, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: speed, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-maxTilt, maxTilt]);
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  return /* @__PURE__ */ jsx6(
    motion.div,
    {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      style: {
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      },
      whileHover: { scale },
      transition: { duration: 0.3 },
      className: `perspective-1000 ${className}`,
      children: /* @__PURE__ */ jsx6("div", { style: { transform: "translateZ(50px)" }, children })
    }
  );
}
function FlipCard({
  front,
  back,
  className = "",
  flipOnHover = false,
  flipDirection = "horizontal"
}) {
  const [isFlipped, setIsFlipped] = useState4(false);
  const handleClick = () => {
    if (!flipOnHover) {
      setIsFlipped(!isFlipped);
    }
  };
  const handleHover = () => {
    if (flipOnHover) {
      setIsFlipped(true);
    }
  };
  const handleHoverEnd = () => {
    if (flipOnHover) {
      setIsFlipped(false);
    }
  };
  const rotateAxis = flipDirection === "horizontal" ? "rotateY" : "rotateX";
  return /* @__PURE__ */ jsxs4(
    "div",
    {
      className: `relative perspective-1000 ${className}`,
      onClick: handleClick,
      onMouseEnter: handleHover,
      onMouseLeave: handleHoverEnd,
      style: { transformStyle: "preserve-3d" },
      children: [
        /* @__PURE__ */ jsx6(
          motion.div,
          {
            className: "absolute inset-0",
            initial: false,
            animate: {
              [rotateAxis]: isFlipped ? 180 : 0
            },
            transition: { duration: 0.6, ease: [0.175, 0.885, 0.32, 1.275] },
            style: {
              backfaceVisibility: "hidden",
              transformStyle: "preserve-3d"
            },
            children: front
          }
        ),
        /* @__PURE__ */ jsx6(
          motion.div,
          {
            className: "absolute inset-0",
            initial: false,
            animate: {
              [rotateAxis]: isFlipped ? 0 : -180
            },
            transition: { duration: 0.6, ease: [0.175, 0.885, 0.32, 1.275] },
            style: {
              backfaceVisibility: "hidden",
              transformStyle: "preserve-3d",
              transform: `${rotateAxis}(180deg)`
            },
            children: back
          }
        )
      ]
    }
  );
}
function StackedCards({
  cards,
  className = "",
  spacing = 20
}) {
  return /* @__PURE__ */ jsx6("div", { className: `relative perspective-1000 ${className}`, children: cards.map((card, index) => /* @__PURE__ */ jsx6(
    motion.div,
    {
      className: "absolute inset-0",
      initial: {
        rotateX: -10,
        y: index * spacing,
        z: -index * 50,
        scale: 1 - index * 0.05
      },
      whileHover: {
        rotateX: 0,
        y: index * (spacing * 1.5),
        z: index * 50,
        scale: 1
      },
      transition: { duration: 0.3 },
      style: {
        transformStyle: "preserve-3d",
        zIndex: cards.length - index
      },
      children: card
    },
    index
  )) });
}
function PerspectiveContainer({
  children,
  className = "",
  perspective = 1e3
}) {
  return /* @__PURE__ */ jsx6(
    "div",
    {
      className,
      style: {
        perspective: `${perspective}px`,
        transformStyle: "preserve-3d"
      },
      children
    }
  );
}
function RotatingShowcase({
  items,
  className = "",
  autoRotate = true,
  rotationSpeed = 20
  // 秒
}) {
  const [rotation, setRotation] = useState4(0);
  const angleStep = 360 / items.length;
  React3.useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setRotation((prev) => prev + angleStep);
    }, rotationSpeed * 1e3);
    return () => clearInterval(interval);
  }, [autoRotate, angleStep, rotationSpeed]);
  return /* @__PURE__ */ jsx6("div", { className: `relative perspective-1000 h-96 ${className}`, children: /* @__PURE__ */ jsx6(
    motion.div,
    {
      className: "absolute inset-0",
      animate: { rotateY: rotation },
      transition: { duration: 1, ease: "easeInOut" },
      style: { transformStyle: "preserve-3d" },
      children: items.map((item, index) => {
        const angle = angleStep * index;
        const radius = 300;
        return /* @__PURE__ */ jsx6(
          motion.div,
          {
            className: "absolute top-1/2 left-1/2",
            style: {
              transform: `
                  translateX(-50%) 
                  translateY(-50%)
                  rotateY(${angle}deg) 
                  translateZ(${radius}px)
                `,
              transformStyle: "preserve-3d"
            },
            children: item
          },
          index
        );
      })
    }
  ) });
}
function FloatingCard({
  children,
  className = "",
  floatRange = 20,
  duration = 3
}) {
  return /* @__PURE__ */ jsx6(
    motion.div,
    {
      className,
      animate: {
        y: [0, -floatRange, 0],
        rotateX: [0, 5, 0],
        rotateY: [0, 5, 0]
      },
      transition: {
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      },
      style: { transformStyle: "preserve-3d" },
      children
    }
  );
}
function GlassRefractionCard({
  children,
  className = ""
}) {
  const [mousePosition, setMousePosition] = useState4({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 100;
    const y = (e.clientY - rect.top) / rect.height * 100;
    setMousePosition({ x, y });
  };
  return /* @__PURE__ */ jsxs4(
    motion.div,
    {
      className: `relative overflow-hidden glass-card rounded-2xl ${className}`,
      onMouseMove: handleMouseMove,
      whileHover: { scale: 1.02 },
      transition: { duration: 0.3 },
      children: [
        /* @__PURE__ */ jsx6(
          "div",
          {
            className: "absolute inset-0 opacity-30 pointer-events-none",
            style: {
              background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 255, 135, 0.3), transparent 50%)`,
              transition: "background 0.3s ease"
            }
          }
        ),
        /* @__PURE__ */ jsx6("div", { className: "relative z-10", children })
      ]
    }
  );
}
function BookPage({ pages, className = "" }) {
  const [currentPage, setCurrentPage] = useState4(0);
  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  return /* @__PURE__ */ jsxs4("div", { className: `relative perspective-2000 ${className}`, children: [
    /* @__PURE__ */ jsx6("div", { className: "relative h-96 w-full", children: pages.map((page, index) => {
      const isVisible = index === currentPage;
      const isPrevious = index < currentPage;
      return /* @__PURE__ */ jsx6(
        motion.div,
        {
          className: "absolute inset-0 glass-card rounded-xl p-6",
          initial: false,
          animate: {
            rotateY: isPrevious ? -180 : 0,
            opacity: isVisible ? 1 : 0,
            zIndex: isVisible ? 10 : index
          },
          transition: { duration: 0.8, ease: "easeInOut" },
          style: {
            transformStyle: "preserve-3d",
            transformOrigin: "left center"
          },
          children: page
        },
        index
      );
    }) }),
    /* @__PURE__ */ jsxs4("div", { className: "flex gap-4 justify-center mt-6", children: [
      /* @__PURE__ */ jsx6(
        "button",
        {
          onClick: prevPage,
          disabled: currentPage === 0,
          className: "px-4 py-2 glass-button rounded-lg disabled:opacity-50",
          children: "\u4E0A\u4E00\u9875"
        }
      ),
      /* @__PURE__ */ jsxs4("span", { className: "flex items-center text-gray-400", children: [
        currentPage + 1,
        " / ",
        pages.length
      ] }),
      /* @__PURE__ */ jsx6(
        "button",
        {
          onClick: nextPage,
          disabled: currentPage === pages.length - 1,
          className: "px-4 py-2 glass-button rounded-lg disabled:opacity-50",
          children: "\u4E0B\u4E00\u9875"
        }
      )
    ] })
  ] });
}

// src/MicroInteractions.tsx
import { motion as motion2, useAnimation } from "motion/react";
import React4, { useRef as useRef6, useState as useState5 } from "react";
import { Fragment, jsx as jsx7, jsxs as jsxs5 } from "react/jsx-runtime";
function RippleButton({
  children,
  onClick,
  className = "",
  variant = "primary"
}) {
  const [ripples, setRipples] = useState5([]);
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };
    setRipples([...ripples, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
    onClick?.();
  };
  const variantStyles = {
    primary: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
    secondary: "bg-white/10 text-white border border-white/20",
    ghost: "bg-transparent text-white hover:bg-white/5"
  };
  return /* @__PURE__ */ jsxs5(
    motion2.button,
    {
      whileTap: { scale: 0.95 },
      onClick: handleClick,
      className: `relative overflow-hidden px-6 py-3 rounded-xl font-medium transition-all ${variantStyles[variant]} ${className}`,
      children: [
        /* @__PURE__ */ jsx7("span", { className: "relative z-10", children }),
        ripples.map((ripple) => /* @__PURE__ */ jsx7(
          motion2.span,
          {
            className: "absolute rounded-full bg-white",
            style: {
              left: ripple.x,
              top: ripple.y
            },
            initial: { width: 0, height: 0, opacity: 0.5 },
            animate: { width: 300, height: 300, opacity: 0 },
            transition: { duration: 0.6, ease: "easeOut" },
            onAnimationComplete: () => {
              setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
            }
          },
          ripple.id
        ))
      ]
    }
  );
}
function PulseButton({
  children,
  onClick,
  className = "",
  pulseColor = "rgba(59, 130, 246, 0.5)"
}) {
  return /* @__PURE__ */ jsxs5(
    motion2.button,
    {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      onClick,
      className: `relative px-6 py-3 rounded-xl font-medium ${className}`,
      children: [
        /* @__PURE__ */ jsx7(
          motion2.div,
          {
            className: "absolute inset-0 rounded-xl",
            style: { backgroundColor: pulseColor },
            animate: {
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5]
            },
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }
        ),
        /* @__PURE__ */ jsx7("span", { className: "relative z-10", children })
      ]
    }
  );
}
function MagneticButton({
  children,
  onClick,
  className = "",
  strength = 0.3
}) {
  const [position, setPosition] = useState5({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setPosition({ x, y });
  };
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };
  return /* @__PURE__ */ jsx7(
    motion2.button,
    {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      onClick,
      animate: position,
      transition: { type: "spring", stiffness: 300, damping: 20 },
      whileTap: { scale: 0.95 },
      className: `px-6 py-3 rounded-xl font-medium ${className}`,
      children
    }
  );
}
function AnimatedInput({ label, icon, className = "", ...props }) {
  const [isFocused, setIsFocused] = useState5(false);
  const [hasValue, setHasValue] = useState5(false);
  return /* @__PURE__ */ jsxs5("div", { className: "relative", children: [
    icon && /* @__PURE__ */ jsx7(
      motion2.div,
      {
        className: "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400",
        animate: {
          color: isFocused ? "#00ff87" : "#9ca3af",
          scale: isFocused ? 1.1 : 1
        },
        transition: { duration: 0.2 },
        children: icon
      }
    ),
    /* @__PURE__ */ jsx7(
      motion2.input,
      {
        ...props,
        onFocus: (e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        },
        onBlur: (e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        },
        onChange: (e) => {
          setHasValue(e.target.value.length > 0);
          props.onChange?.(e);
        },
        className: `w-full ${icon ? "pl-12" : "pl-4"} pr-4 py-3 glass-input rounded-xl text-white ${className}`,
        animate: {
          borderColor: isFocused ? "#00ff87" : "rgba(255, 255, 255, 0.1)",
          boxShadow: isFocused ? "0 0 0 3px rgba(0, 255, 135, 0.1), 0 0 20px rgba(0, 255, 135, 0.2)" : "none"
        },
        transition: { duration: 0.2 }
      }
    ),
    label && /* @__PURE__ */ jsx7(
      motion2.label,
      {
        className: "absolute left-4 pointer-events-none text-gray-400",
        animate: {
          top: isFocused || hasValue ? "0.5rem" : "50%",
          translateY: isFocused || hasValue ? 0 : "-50%",
          fontSize: isFocused || hasValue ? "0.75rem" : "1rem",
          color: isFocused ? "#00ff87" : "#9ca3af"
        },
        transition: { duration: 0.2 },
        children: label
      }
    ),
    /* @__PURE__ */ jsx7(
      motion2.div,
      {
        className: "absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500",
        initial: { width: "0%" },
        animate: { width: isFocused ? "100%" : "0%" },
        transition: { duration: 0.3 }
      }
    )
  ] });
}
function AnimatedSwitch({
  checked,
  onChange,
  label,
  className = ""
}) {
  return /* @__PURE__ */ jsxs5("label", { className: `flex items-center gap-3 cursor-pointer ${className}`, children: [
    /* @__PURE__ */ jsxs5("div", { className: "relative", children: [
      /* @__PURE__ */ jsx7(
        motion2.div,
        {
          className: "w-14 h-8 rounded-full",
          animate: {
            backgroundColor: checked ? "#00ff87" : "rgba(255, 255, 255, 0.1)"
          },
          transition: { duration: 0.3 }
        }
      ),
      /* @__PURE__ */ jsx7(
        motion2.div,
        {
          className: "absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg",
          animate: {
            x: checked ? 24 : 0
          },
          transition: { type: "spring", stiffness: 500, damping: 30 }
        }
      )
    ] }),
    label && /* @__PURE__ */ jsx7("span", { className: "text-white", children: label }),
    /* @__PURE__ */ jsx7(
      "input",
      {
        type: "checkbox",
        checked,
        onChange: (e) => onChange(e.target.checked),
        className: "hidden"
      }
    )
  ] });
}
function LoadingButton({
  children,
  loading,
  onClick,
  className = ""
}) {
  return /* @__PURE__ */ jsxs5(
    motion2.button,
    {
      whileHover: !loading ? { scale: 1.05 } : {},
      whileTap: !loading ? { scale: 0.95 } : {},
      onClick: !loading ? onClick : void 0,
      disabled: loading,
      className: `relative px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-blue-500 to-cyan-500 text-white overflow-hidden ${className}`,
      children: [
        loading && /* @__PURE__ */ jsx7(
          motion2.div,
          {
            className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent",
            animate: { x: ["-100%", "100%"] },
            transition: { duration: 1, repeat: Infinity, ease: "linear" }
          }
        ),
        /* @__PURE__ */ jsx7("span", { className: `relative z-10 ${loading ? "opacity-70" : ""}`, children: loading ? /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx7(
            motion2.div,
            {
              className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full",
              animate: { rotate: 360 },
              transition: { duration: 1, repeat: Infinity, ease: "linear" }
            }
          ),
          "\u52A0\u8F7D\u4E2D..."
        ] }) : children })
      ]
    }
  );
}
function AnimatedCounter({
  value,
  duration = 1,
  className = "",
  prefix = "",
  suffix = ""
}) {
  const [displayValue, setDisplayValue] = useState5(0);
  const displayRef = useRef6(0);
  React4.useEffect(() => {
    const startValue = displayRef.current;
    const endValue = value;
    const startTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1e3), 1);
      const currentValue = Math.floor(startValue + (endValue - startValue) * progress);
      displayRef.current = currentValue;
      setDisplayValue(currentValue);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }, [value, duration]);
  return /* @__PURE__ */ jsxs5(
    motion2.span,
    {
      className,
      initial: { scale: 0.8 },
      animate: { scale: 1 },
      transition: { type: "spring", stiffness: 500, damping: 30 },
      children: [
        prefix,
        displayValue.toLocaleString(),
        suffix
      ]
    }
  );
}
function AnimatedCheckbox({
  checked,
  onChange,
  label,
  className = ""
}) {
  return /* @__PURE__ */ jsxs5("label", { className: `flex items-center gap-3 cursor-pointer ${className}`, children: [
    /* @__PURE__ */ jsxs5("div", { className: "relative", children: [
      /* @__PURE__ */ jsx7(
        motion2.div,
        {
          className: "w-6 h-6 rounded border-2",
          animate: {
            borderColor: checked ? "#00ff87" : "rgba(255, 255, 255, 0.2)",
            backgroundColor: checked ? "#00ff87" : "transparent"
          },
          transition: { duration: 0.2 }
        }
      ),
      checked && /* @__PURE__ */ jsx7(
        motion2.svg,
        {
          className: "absolute inset-0 w-6 h-6 text-white",
          viewBox: "0 0 24 24",
          fill: "none",
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration: 0.3 },
          children: /* @__PURE__ */ jsx7(
            motion2.path,
            {
              d: "M5 13l4 4L19 7",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          )
        }
      )
    ] }),
    label && /* @__PURE__ */ jsx7("span", { className: "text-white", children: label }),
    /* @__PURE__ */ jsx7(
      "input",
      {
        type: "checkbox",
        checked,
        onChange: (e) => onChange(e.target.checked),
        className: "hidden"
      }
    )
  ] });
}
function LikeButton({ className = "" }) {
  const [liked, setLiked] = useState5(false);
  const controls = useAnimation();
  const handleClick = async () => {
    setLiked(!liked);
    if (!liked) {
      await controls.start({
        scale: [1, 1.3, 1],
        rotate: [0, -10, 10, 0],
        transition: { duration: 0.4 }
      });
    }
  };
  return /* @__PURE__ */ jsxs5(
    motion2.button,
    {
      onClick: handleClick,
      animate: controls,
      className: `relative ${className}`,
      children: [
        /* @__PURE__ */ jsx7(
          motion2.svg,
          {
            className: "w-8 h-8",
            viewBox: "0 0 24 24",
            fill: liked ? "#ef4444" : "none",
            animate: {
              fill: liked ? "#ef4444" : "none",
              stroke: liked ? "#ef4444" : "#fff"
            },
            transition: { duration: 0.2 },
            children: /* @__PURE__ */ jsx7(
              "path",
              {
                d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }
            )
          }
        ),
        liked && /* @__PURE__ */ jsx7(Fragment, { children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx7(
          motion2.div,
          {
            className: "absolute w-2 h-2 bg-red-500 rounded-full",
            style: {
              top: "50%",
              left: "50%"
            },
            initial: { scale: 0, x: 0, y: 0 },
            animate: {
              scale: [0, 1, 0],
              x: Math.cos(i / 6 * Math.PI * 2) * 30,
              y: Math.sin(i / 6 * Math.PI * 2) * 30
            },
            transition: { duration: 0.6, ease: "easeOut" }
          },
          i
        )) })
      ]
    }
  );
}

// src/ParallaxScroll.tsx
import { useRef as useRef7 } from "react";
import { motion as motion3, useScroll, useTransform as useTransform2, useSpring as useSpring2 } from "motion/react";
import { jsx as jsx8, jsxs as jsxs6 } from "react/jsx-runtime";
function Parallax({ children, speed = 0.5, className = "" }) {
  const ref = useRef7(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform2(scrollYProgress, [0, 1], [0, speed * 100]);
  return /* @__PURE__ */ jsx8("div", { ref, className, children: /* @__PURE__ */ jsx8(motion3.div, { style: { y }, children }) });
}
function ParallaxLayer({ children, speed, className = "", zIndex = 0 }) {
  const { scrollY } = useScroll();
  const y = useTransform2(scrollY, [0, 1e3], [0, speed * 100]);
  return /* @__PURE__ */ jsx8(
    motion3.div,
    {
      style: { y, zIndex },
      className: `absolute inset-0 ${className}`,
      children
    }
  );
}
function ParallaxBackground({ layers, className = "" }) {
  return /* @__PURE__ */ jsx8("div", { className: `relative overflow-hidden ${className}`, children: layers.map((layer, index) => /* @__PURE__ */ jsx8(
    ParallaxLayer,
    {
      speed: layer.speed,
      className: layer.className,
      zIndex: index,
      children: layer.content
    },
    index
  )) });
}
function SmoothParallax({ children, className = "" }) {
  const ref = useRef7(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const smoothProgress = useSpring2(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 1e-3
  });
  const y = useTransform2(smoothProgress, [0, 1], [100, -100]);
  const opacity = useTransform2(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform2(smoothProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  return /* @__PURE__ */ jsx8("div", { ref, className, children: /* @__PURE__ */ jsx8(motion3.div, { style: { y, opacity, scale }, children }) });
}
function ParallaxText({ text, className = "", speed = 0.5 }) {
  const ref = useRef7(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform2(scrollYProgress, [0, 1], [0, speed * 200]);
  const opacity = useTransform2(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  return /* @__PURE__ */ jsx8("div", { ref, className, children: /* @__PURE__ */ jsx8(motion3.div, { style: { y, opacity }, className: "text-4xl font-bold", children: text }) });
}
function ParallaxImage({
  src,
  alt,
  speed = 0.5,
  className = "",
  scale = true
}) {
  const ref = useRef7(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform2(scrollYProgress, [0, 1], [0, speed * 100]);
  const scaleValue = scale ? useTransform2(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.2]) : 1;
  return /* @__PURE__ */ jsx8("div", { ref, className: `overflow-hidden ${className}`, children: /* @__PURE__ */ jsx8(
    motion3.img,
    {
      src,
      alt,
      style: { y, scale: scaleValue },
      className: "w-full h-full object-cover"
    }
  ) });
}
function ParallaxStackCard({ children, index, scrollYProgress }) {
  const y = useTransform2(scrollYProgress, [0, 1], [0, -50 * (index + 1)]);
  const scale = useTransform2(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const opacity = useTransform2(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  return /* @__PURE__ */ jsx8(motion3.div, { style: { y, scale, opacity }, className: "glass-card rounded-2xl p-6", children });
}
function ParallaxStack({ cards, className = "" }) {
  const ref = useRef7(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  return /* @__PURE__ */ jsx8("div", { ref, className: `space-y-8 ${className}`, children: cards.map((card, index) => /* @__PURE__ */ jsx8(ParallaxStackCard, { index, scrollYProgress, children: card }, index)) });
}
function ParallaxReveal({
  children,
  direction = "up",
  className = ""
}) {
  const ref = useRef7(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const directionMap = {
    left: { x: [-100, 0], y: [0, 0] },
    right: { x: [100, 0], y: [0, 0] },
    up: { x: [0, 0], y: [100, 0] },
    down: { x: [0, 0], y: [-100, 0] }
  };
  const x = useTransform2(scrollYProgress, [0, 1], directionMap[direction].x);
  const y = useTransform2(scrollYProgress, [0, 1], directionMap[direction].y);
  const opacity = useTransform2(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  return /* @__PURE__ */ jsx8("div", { ref, className, children: /* @__PURE__ */ jsx8(motion3.div, { style: { x, y, opacity }, children }) });
}
function ScrollProgress({ className = "" }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring2(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 1e-3
  });
  return /* @__PURE__ */ jsx8(
    motion3.div,
    {
      className: `fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 origin-left z-50 ${className}`,
      style: { scaleX }
    }
  );
}
function ScrollTrigger({
  children,
  animation = "fade",
  threshold = 0.1,
  className = ""
}) {
  const ref = useRef7(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const animations = {
    fade: {
      opacity: useTransform2(scrollYProgress, [0, threshold], [0, 1])
    },
    "slide-up": {
      y: useTransform2(scrollYProgress, [0, threshold], [100, 0]),
      opacity: useTransform2(scrollYProgress, [0, threshold], [0, 1])
    },
    "slide-down": {
      y: useTransform2(scrollYProgress, [0, threshold], [-100, 0]),
      opacity: useTransform2(scrollYProgress, [0, threshold], [0, 1])
    },
    scale: {
      scale: useTransform2(scrollYProgress, [0, threshold], [0.8, 1]),
      opacity: useTransform2(scrollYProgress, [0, threshold], [0, 1])
    },
    rotate: {
      rotate: useTransform2(scrollYProgress, [0, threshold], [-10, 0]),
      opacity: useTransform2(scrollYProgress, [0, threshold], [0, 1])
    }
  };
  return /* @__PURE__ */ jsx8("div", { ref, className, children: /* @__PURE__ */ jsx8(motion3.div, { style: animations[animation], children }) });
}
function Parallax3DCard({ children, className = "" }) {
  const ref = useRef7(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const rotateX = useTransform2(scrollYProgress, [0, 0.5, 1], [15, 0, -15]);
  const y = useTransform2(scrollYProgress, [0, 1], [100, -100]);
  return /* @__PURE__ */ jsx8("div", { ref, className: `perspective-1000 ${className}`, children: /* @__PURE__ */ jsx8(
    motion3.div,
    {
      style: {
        rotateX,
        y,
        transformStyle: "preserve-3d"
      },
      children
    }
  ) });
}
function InfiniteScroll({
  children,
  speed = 1,
  direction = "horizontal",
  className = ""
}) {
  const { scrollY } = useScroll();
  const x = direction === "horizontal" ? useTransform2(scrollY, [0, 1e3], [0, -speed * 100]) : 0;
  const y = direction === "vertical" ? useTransform2(scrollY, [0, 1e3], [0, -speed * 100]) : 0;
  return /* @__PURE__ */ jsx8("div", { className: `overflow-hidden ${className}`, children: /* @__PURE__ */ jsxs6(
    motion3.div,
    {
      style: { x, y },
      className: "flex gap-4",
      children: [
        children,
        children,
        " "
      ]
    }
  ) });
}
export {
  AnimatedCheckbox,
  AnimatedCounter,
  AnimatedInput,
  AnimatedSwitch,
  BookPage,
  CyberpunkWidget,
  FlipCard,
  FloatingCard,
  GlassRefractionCard,
  GlitchText,
  InfiniteScroll,
  LikeButton,
  LoadingButton,
  MagneticButton,
  NeonCard,
  Parallax,
  Parallax3DCard,
  ParallaxBackground,
  ParallaxImage,
  ParallaxReveal,
  ParallaxStack,
  ParallaxText,
  ParticleCanvas,
  ParticleEmitter,
  PerspectiveContainer,
  PulseButton,
  RippleButton,
  RotatingShowcase,
  ScrollProgress,
  ScrollTrigger,
  SmoothParallax,
  StackedCards,
  TiltCard
};
//# sourceMappingURL=index.js.map