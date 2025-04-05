interface AnonymousLogoProps {
    className?: string
    size?: number
  }
  
  export function AnonymousLogo({ className = "", size = 32 }: AnonymousLogoProps) {
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
          {/* Stylized Anonymous mask */}
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
          <path
            d="M12 6c-1.5 0-3 .5-4 2-1 1.5-1 3-1 4 0 1 0 2 1 3 1 1 2.5 1.5 4 1.5s3-.5 4-1.5c1-1 1-2 1-3 0-1 0-2.5-1-4-1-1.5-2.5-2-4-2z"
            fill="currentColor"
          />
          <path d="M9 11c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" fill="white" />
          <path d="M15 11c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" fill="white" />
          <path d="M9 15c1 1 3 1 6 0" />
          <path d="M8 9c-1.5 0-2 .5-2 1" />
          <path d="M16 9c1.5 0 2 .5 2 1" />
        </svg>
      </div>
    )
  }
  
  
