  interface HackerLogoProps {
    className?: string
    size?: number
  }
  
  export function HackerLogo({ className = "", size = 32 }: HackerLogoProps) {
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
          {/* Hooded figure */}
          <path
            d="M12 3C9 3 6.5 4 5 7c-1.5 3-1 6-1 8 0 2 1 3 2 4 1 1 3 2 6 2s5-1 6-2c1-1 2-2 2-4 0-2 .5-5-1-8-1.5-3-4-4-7-4z"
            fill="currentColor"
          />
          <path d="M8 14c1 1 2 1.5 4 1.5s3-.5 4-1.5" />
          <path d="M9 11.5c.5.5 1.5.5 2 0" />
          <path d="M13 11.5c.5.5 1.5.5 2 0" />
          <path d="M12 17v4" />
          <path d="M8 21h8" />
          <path d="M2 9h4" />
          <path d="M18 9h4" />
        </svg>
      </div>
    )
  }
  
  
