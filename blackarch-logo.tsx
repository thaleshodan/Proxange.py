import Image from "next/image"

interface BlackArchLogoProps {
  className?: string
  size?: number
}

export function BlackArchLogo({ className = "", size = 32 }: BlackArchLogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src="/images/blackarch-logo.png"
        alt="BlackArch Logo"
        width={size}
        height={size}
        className="object-contain"
      />
    </div>
  )
}

