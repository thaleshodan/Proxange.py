interface DigitalIdentityLogoProps {
    className?: string
    size?: number
  }
  
  export function DigitalIdentityLogo({ className = "", size = 32 }: DigitalIdentityLogoProps) {
    return (
      <div className={`relative ${className}`} style={{ width: size, height: size }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-500"
        >
          {/* Binary circle with mask */}
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
          <path d="M8 7v1m0 3v1m0 3v1m4-9v1m0 3v1m0 3v1m4-9v1m0 3v1m0 3v1" strokeWidth="1" />
          <path d="M12 8c-2.5 0-4 1.5-4 4s1.5 4 4 4 4-1.5 4-4-1.5-4-4-4z" fill="currentColor" opacity="0.5" />
          <path d="M9 12h6" strokeWidth="2" />
          <path d="M12 9v6" strokeWidth="2" />
        </svg>
      </div>
    )
  }
  
  
