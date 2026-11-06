// 自愈登记（T2/T3 批次）：@react-three/fiber v8 仅增强旧版全局 JSX 命名空间，
// 在 @types/react 19 + jsx: react-jsx 下 JSX 走 React.JSX，需桥接扩展，
// 否则 three 内建元素（group/mesh/primitive/ambientLight 等）不被识别。
import type { ThreeElements } from "@react-three/fiber"

declare module "react" {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
