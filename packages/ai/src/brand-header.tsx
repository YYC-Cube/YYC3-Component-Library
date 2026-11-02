import Image from "next/image"

interface BrandHeaderProps {
  showSubtitle?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function BrandHeader({ showSubtitle = true, size = "md", className = "" }: BrandHeaderProps) {
  const logoSizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  }

  const titleSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  }

  const subtitleSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Image
            src="/images/yanyu-logo.png"
            alt="YanYu Smart Cloud³ Logo"
            width={size === "lg" ? 64 : size === "md" ? 40 : 32}
            height={size === "lg" ? 64 : size === "md" ? 40 : 32}
            className={`${logoSizes[size]} object-contain`}
            priority
          />
        </div>
        <div className="flex flex-col">
          {/* 单行显示应用名称，调整字体大小 */}
          <h1
            className={`font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap ${titleSizes[size]}`}
          >
            YanYu Smart Cloud³ Learning Platform
          </h1>
        </div>
      </div>

      {showSubtitle && (
        <div className="text-center space-y-1">
          <p className={`text-gray-700 font-medium ${subtitleSizes[size]}`}>言枢象限·语启未来</p>
          <p className={`text-gray-500 italic ${subtitleSizes[size]}`}>YanShu Quadrant · YuQi Future</p>
        </div>
      )}
    </div>
  )
}
