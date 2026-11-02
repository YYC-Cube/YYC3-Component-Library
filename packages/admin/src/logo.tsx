import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  className?: string
  size?: "small" | "medium" | "large"
}

export function Logo({ className, size = "medium" }: LogoProps) {
  const sizes = {
    small: { width: 32, height: 32 },
    medium: { width: 40, height: 40 },
    large: { width: 60, height: 60 },
  }

  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Image
          src="/images/logo.png"
          alt="言语智能"
          width={sizes[size].width}
          height={sizes[size].height}
          className="object-contain"
        />
      </div>
      <span className="font-semibold text-white">『言语』云享e中心</span>
    </Link>
  )
}
