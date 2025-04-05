"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import {
  AlertCircle,
  CheckCircle,
  Globe,
  RefreshCw,
  Server,
  Activity,
  Clock,
  Settings,
  EyeOff,
  Lock,
  Wifi,
  Terminal,
  Network,
  Zap,
  UserX,
  ShieldAlert,
  Fingerprint,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { NetworkMap } from "@/components/network-map"
import { MatrixBackground } from "@/components/matrix-background"
import { AnonymousLogo } from "@/components/anonymous-logo"

// Mock data - in a real app, this would come from the Python backend
const mockProxies = {
  tor: [{ name: "Local Tor", url: "socks5h://127.0.0.1:9050", status: "active" }],
  http: [
    { name: "HTTP Proxy 1", url: "http://example-proxy.com:8080", status: "inactive" },
    { name: "HTTP Proxy 2", url: "http://example-proxy2.com:8080", status: "active" },
  ],
  socks: [
    { name: "SOCKS Proxy 1", url: "socks5://example-socks.com:1080", status: "inactive" },
    { name: "SOCKS Proxy 2", url: "socks5://example-socks2.com:1080", status: "active" },
  ],
}

const mockCurrentIP = {
  ip: "123.45.67.89",
  proxy: "Local Tor",
  response_time: 0.82,
  timestamp: "2023-06-15T12:34:56",
  geolocation: {
    country: "Netherlands",
    region: "North Holland",
    city: "Amsterdam",
    org: "Tor Exit Node",
    timezone: "Europe/Amsterdam",
  },
  success: true,
}

export default function Home() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [currentIP, setCurrentIP] = useState(mockCurrentIP)
  const [proxies, setProxies] = useState(mockProxies)
  const [isRotating, setIsRotating] = useState(false)
  const [rotationInterval, setRotationInterval] = useState(60)
  const [selectedProxyType, setSelectedProxyType] = useState("random")
  const [newProxyUrl, setNewProxyUrl] = useState("")
  const [newProxyName, setNewProxyName] = useState("")
  const [newProxyType, setNewProxyType] = useState("http")
  const [progress, setProgress] = useState(0)
  const [lastRotation, setLastRotation] = useState<Date | null>(null)
  const [anonymityScore, setAnonymityScore] = useState(85)
  const [showTerminal, setShowTerminal] = useState(false)
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "> NiedProxy v2.0 initialized",
    "> Checking available proxies...",
    "> Tor circuit established",
    "> System ready",
  ])
  const terminalRef = useRef<HTMLDivElement>(null)

  // Simulate IP rotation
  useEffect(() => {
    if (!isRotating) return

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          rotateIP()
          return 0
        }
        return prev + 100 / rotationInterval
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRotating, rotationInterval])

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalOutput])

  const addTerminalLine = (line: string) => {
    setTerminalOutput((prev) => [...prev, `> ${line}`])
  }

  const rotateIP = () => {
    // Simulate IP rotation - in a real app, this would call the Python backend
    const countries = ["Netherlands", "Germany", "Sweden", "Switzerland", "Romania"]
    const cities = ["Amsterdam", "Berlin", "Stockholm", "Zurich", "Bucharest"]
    const randomIP = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    const randomCountryIndex = Math.floor(Math.random() * countries.length)

    setCurrentIP({
      ...currentIP,
      ip: randomIP,
      timestamp: new Date().toISOString(),
      response_time: Math.random() * 2,
      geolocation: {
        ...currentIP.geolocation,
        country: countries[randomCountryIndex],
        city: cities[randomCountryIndex],
      },
    })

    setLastRotation(new Date())

    // Add to terminal output
    addTerminalLine(`IP rotated to ${randomIP} (${countries[randomCountryIndex]})`)

    toast({
      title: "IP Rotated",
      description: `New IP: ${randomIP}`,
    })
  }

  const toggleRotation = () => {
    if (!isRotating) {
      rotateIP() // Rotate immediately when starting
      setProgress(0)
      addTerminalLine("Automatic IP rotation activated")
    } else {
      addTerminalLine("Automatic IP rotation deactivated")
    }
    setIsRotating(!isRotating)
  }

  const addProxy = () => {
    if (!newProxyUrl || !newProxyName) {
      toast({
        title: "Error",
        description: "Please provide both name and URL for the new proxy",
        variant: "destructive",
      })
      return
    }

    setProxies({
      ...proxies,
      [newProxyType]: [
        ...proxies[newProxyType as keyof typeof proxies],
        { name: newProxyName, url: newProxyUrl, status: "inactive" },
      ],
    })

    addTerminalLine(`Added new ${newProxyType} proxy: ${newProxyName}`)

    toast({
      title: "Proxy Added",
      description: `Added ${newProxyName} to ${newProxyType.toUpperCase()} proxies`,
    })

    setNewProxyUrl("")
    setNewProxyName("")
  }

  const testAllProxies = () => {
    toast({
      title: "Testing Proxies",
      description: "Testing all proxies for connectivity...",
    })

    addTerminalLine("Testing all proxy connections...")

    // In a real app, this would call the Python backend
    setTimeout(() => {
      addTerminalLine("All proxies tested. 4/5 operational.")
      toast({
        title: "Test Complete",
        description: "All proxies tested successfully",
      })
    }, 2000)
  }

  const toggleTerminal = () => {
    setShowTerminal(!showTerminal)
    if (!showTerminal) {
      addTerminalLine("Terminal activated")
    }
  }

  return (
    <main className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      {/* Matrix-like background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <MatrixBackground />
      </div>

      {/* Header */}
      <header className="border-b border-green-900/50 bg-black/80 backdrop-blur-sm p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AnonymousLogo size={32} className="mr-2" />
            <h1 className="text-2xl font-mono font-bold text-green-400 flex items-center">
              <span className="text-white">Nied</span>Proxy
              <span className="ml-2 text-xs bg-green-900/50 px-2 py-1 rounded-md">v2.0</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              variant="outline"
              className={`bg-black/80 border-green-500 ${isRotating ? "text-green-400" : "text-gray-500"}`}
            >
              {isRotating ? "ACTIVE" : "IDLE"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="border-green-500 text-green-400 hover:bg-green-900/30 hover:text-white font-mono"
              onClick={rotateIP}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              ROTATE
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-green-500 text-green-400 hover:bg-green-900/30 hover:text-white font-mono"
              onClick={toggleTerminal}
            >
              <Terminal className="mr-2 h-4 w-4" />
              TERMINAL
            </Button>
          </div>
        </div>
      </header>

      {/* Terminal Overlay */}
      {showTerminal && (
        <div className="fixed inset-0 bg-black/90 z-20 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-2 border-b border-green-900/50 pb-2">
            <h2 className="text-green-400 font-mono">NiedProxy Terminal</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTerminal}
              className="text-green-400 hover:text-white hover:bg-green-900/30"
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
          <div
            ref={terminalRef}
            className="flex-1 font-mono text-sm overflow-auto bg-black/80 p-4 rounded-md border border-green-900/50"
          >
            {terminalOutput.map((line, i) => (
              <div key={i} className="mb-1">
                <span className="text-green-500">{line}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex">
            <Input
              className="flex-1 bg-black border-green-900/50 text-green-400 font-mono"
              placeholder="Enter command..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const command = e.currentTarget.value
                  addTerminalLine(command)

                  // Simple command handling
                  if (command.toLowerCase() === "help") {
                    addTerminalLine("Available commands: rotate, status, clear, exit")
                  } else if (command.toLowerCase() === "rotate") {
                    rotateIP()
                  } else if (command.toLowerCase() === "status") {
                    addTerminalLine(`Current IP: ${currentIP.ip}`)
                    addTerminalLine(`Location: ${currentIP.geolocation.city}, ${currentIP.geolocation.country}`)
                    addTerminalLine(`Proxy: ${currentIP.proxy}`)
                    addTerminalLine(`Auto-rotation: ${isRotating ? "Enabled" : "Disabled"}`)
                  } else if (command.toLowerCase() === "clear") {
                    setTerminalOutput([])
                  } else if (command.toLowerCase() === "exit") {
                    setShowTerminal(false)
                  } else {
                    addTerminalLine('Unknown command. Type "help" for available commands.')
                  }

                  e.currentTarget.value = ""
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-black/50 backdrop-blur-sm border border-green-900/50">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-green-900/30 data-[state=active]:text-white font-mono"
            >
              DASHBOARD
            </TabsTrigger>
            <TabsTrigger
              value="proxies"
              className="data-[state=active]:bg-green-900/30 data-[state=active]:text-white font-mono"
            >
              PROXIES
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-green-900/30 data-[state=active]:text-white font-mono"
            >
              SETTINGS
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-4">
                {/* Current IP Card */}
                <Card className="bg-black/50 backdrop-blur-sm border-green-900/50 overflow-hidden relative">
                  <div className="absolute inset-0 pointer-events-none opacity-5">
                    <NetworkMap />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white font-mono flex items-center">
                      <Globe className="h-5 w-5 text-green-500 mr-2" />
                      CURRENT IDENTITY
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Your current external IP address and location
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">IP Address:</span>
                        <span className="text-2xl font-mono text-green-400">{currentIP.ip}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Location:</span>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-green-500" />
                          <span className="text-white font-mono">
                            {currentIP.geolocation.city}, {currentIP.geolocation.country}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Proxy:</span>
                        <span className="text-white font-mono">{currentIP.proxy}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Response Time:</span>
                        <span className="text-white font-mono">{currentIP.response_time.toFixed(2)}s</span>
                      </div>
                      {lastRotation && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Last Rotation:</span>
                          <span className="text-white font-mono">{lastRotation.toLocaleTimeString()}</span>
                        </div>
                      )}

                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-400">Anonymity Score:</span>
                          <span
                            className={`font-mono ${anonymityScore > 80 ? "text-green-400" : anonymityScore > 50 ? "text-yellow-400" : "text-red-400"}`}
                          >
                            {anonymityScore}/100
                          </span>
                        </div>
                        <Progress
                          value={anonymityScore}
                          className="h-2 bg-green-900/30"
                          indicatorClassName={`${anonymityScore > 80 ? "bg-green-500" : anonymityScore > 50 ? "bg-yellow-500" : "bg-red-500"}`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-black/50 backdrop-blur-sm border-green-900/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white font-mono flex items-center text-sm">
                        <Activity className="h-4 w-4 text-green-500 mr-2" />
                        ACTIVE PROXIES
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-400 font-mono">
                        {
                          Object.values(proxies)
                            .flat()
                            .filter((p) => p.status === "active").length
                        }
                      </div>
                      <p className="text-gray-400 text-sm">
                        Out of {Object.values(proxies).flat().length} total proxies
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/50 backdrop-blur-sm border-green-900/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white font-mono flex items-center text-sm">
                        <Clock className="h-4 w-4 text-green-500 mr-2" />
                        UPTIME
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-400 font-mono">24h 12m</div>
                      <p className="text-gray-400 text-sm">Since last restart</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/50 backdrop-blur-sm border-green-900/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white font-mono flex items-center text-sm">
                        <RefreshCw className="h-4 w-4 text-green-500 mr-2" />
                        ROTATIONS
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-400 font-mono">42</div>
                      <p className="text-gray-400 text-sm">IP rotations today</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Security Status */}
                <Card className="bg-black/50 backdrop-blur-sm border-green-900/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white font-mono flex items-center">
                      <AnonymousLogo size={20} className="mr-2" />
                      SECURITY STATUS
                    </CardTitle>
                    <CardDescription className="text-gray-400">Current security and anonymity measures</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 rounded-md border border-green-900/50 bg-black/30">
                          <div className="flex items-center gap-2">
                            <Fingerprint className="h-5 w-5 text-green-500" />
                            <span className="text-white font-mono">Fingerprint Protection</span>
                          </div>
                          <Badge variant="outline" className="border-green-500 text-green-400 font-mono">
                            ACTIVE
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-md border border-green-900/50 bg-black/30">
                          <div className="flex items-center gap-2">
                            <UserX className="h-5 w-5 text-green-500" />
                            <span className="text-white font-mono">Identity Masking</span>
                          </div>
                          <Badge variant="outline" className="border-green-500 text-green-400 font-mono">
                            ACTIVE
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-md border border-green-900/50 bg-black/30">
                          <div className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-green-500" />
                            <span className="text-white font-mono">DNS Encryption</span>
                          </div>
                          <Badge variant="outline" className="border-green-500 text-green-400 font-mono">
                            ACTIVE
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-md border border-green-900/50 bg-black/30">
                          <div className="flex items-center gap-2">
                            <Wifi className="h-5 w-5 text-yellow-500" />
                            <span className="text-white font-mono">WebRTC Protection</span>
                          </div>
                          <Badge variant="outline" className="border-yellow-500 text-yellow-400 font-mono">
                            PARTIAL
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Rotation Control Card */}
                <Card className="bg-black/50 backdrop-blur-sm border-green-900/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white font-mono flex items-center">
                      <Zap className="h-5 w-5 text-green-500 mr-2" />
                      IP ROTATION
                    </CardTitle>
                    <CardDescription className="text-gray-400">Control automatic IP rotation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <Label htmlFor="rotation-toggle" className="text-white font-mono">
                            AUTO ROTATION
                          </Label>
                          <span className="text-xs text-gray-400">Automatically rotate IP address</span>
                        </div>
                        <Switch
                          id="rotation-toggle"
                          checked={isRotating}
                          onCheckedChange={toggleRotation}
                          className="data-[state=checked]:bg-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="interval-slider" className="text-white font-mono">
                            INTERVAL: {rotationInterval}s
                          </Label>
                        </div>
                        <Slider
                          id="interval-slider"
                          min={10}
                          max={300}
                          step={10}
                          value={[rotationInterval]}
                          onValueChange={(value) => setRotationInterval(value[0])}
                          className="[&>span]:bg-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-white font-mono">PROXY TYPE</Label>
                        </div>
                        <Select value={selectedProxyType} onValueChange={setSelectedProxyType}>
                          <SelectTrigger className="bg-black border-green-900/50 text-white font-mono">
                            <SelectValue placeholder="Select proxy type" />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-green-900/50 text-white">
                            <SelectItem value="random">RANDOM</SelectItem>
                            <SelectItem value="tor">TOR</SelectItem>
                            <SelectItem value="http">HTTP</SelectItem>
                            <SelectItem value="socks">SOCKS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {isRotating && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-white font-mono">NEXT ROTATION:</Label>
                            <span className="text-sm text-gray-400 font-mono">
                              {Math.ceil((rotationInterval * (100 - progress)) / 100)}s
                            </span>
                          </div>
                          <Progress value={progress} className="h-2 bg-green-900/30">
                            <div className="h-full bg-green-500 transition-all" />
                          </Progress>
                        </div>
                      )}

                      <Button
                        onClick={rotateIP}
                        className="w-full bg-green-900/50 hover:bg-green-900/80 text-white border border-green-500/50 font-mono mt-2"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        FORCE ROTATION
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-black/50 backdrop-blur-sm border-green-900/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white font-mono flex items-center">
                      <Zap className="h-5 w-5 text-green-500 mr-2" />
                      QUICK ACTIONS
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start border-green-900/50 text-white hover:bg-green-900/30 font-mono"
                        onClick={() => {
                          addTerminalLine("Testing all proxies...")
                          testAllProxies()
                        }}
                      >
                        <Network className="mr-2 h-4 w-4 text-green-500" />
                        TEST ALL PROXIES
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start border-green-900/50 text-white hover:bg-green-900/30 font-mono"
                        onClick={() => {
                          addTerminalLine("Checking for IP leaks...")
                          setTimeout(() => {
                            addTerminalLine("No IP leaks detected")
                            toast({
                              title: "Security Check",
                              description: "No IP leaks detected",
                            })
                          }, 1500)
                        }}
                      >
                        <ShieldAlert className="mr-2 h-4 w-4 text-green-500" />
                        CHECK FOR LEAKS
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start border-green-900/50 text-white hover:bg-green-900/30 font-mono"
                        onClick={() => {
                          addTerminalLine("Clearing all logs and history...")
                          setTimeout(() => {
                            addTerminalLine("All logs and history cleared")
                            toast({
                              title: "Privacy",
                              description: "All logs and history cleared",
                            })
                          }, 1000)
                        }}
                      >
                        <EyeOff className="mr-2 h-4 w-4 text-green-500" />
                        CLEAR ALL LOGS
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Connection Log */}
                <Card className="bg-black/50 backdrop-blur-sm border-green-900/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white font-mono flex items-center">
                      <Terminal className="h-5 w-5 text-green-500 mr-2" />
                      CONNECTION LOG
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] overflow-auto font-mono text-xs bg-black/80 p-2 rounded border border-green-900/50">
                      {terminalOutput.slice(-8).map((line, i) => (
                        <div key={i} className="mb-1">
                          <span className="text-green-500">{line}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Proxies Tab */}
          <TabsContent value="proxies" className="mt-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Add New Proxy */}
              <Card className="bg-black/50 backdrop-blur-sm border-green-900/50">
                <CardHeader>
                  <CardTitle className="text-white font-mono flex items-center">
                    <Server className="h-5 w-5 text-green-500 mr-2" />
                    ADD NEW PROXY
                  </CardTitle>
                  <CardDescription className="text-gray-400">Add a new proxy server to your arsenal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="proxy-type" className="text-white font-mono">
                        TYPE
                      </Label>
                      <Select value={newProxyType} onValueChange={setNewProxyType}>
                        <SelectTrigger id="proxy-type" className="bg-black border-green-900/50 text-white font-mono">
                          <SelectValue placeholder="Proxy Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-green-900/50 text-white">
                          <SelectItem value="tor">TOR</SelectItem>
                          <SelectItem value="http">HTTP</SelectItem>
                          <SelectItem value="socks">SOCKS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="proxy-name" className="text-white font-mono">
                        NAME
                      </Label>
                      <Input
                        id="proxy-name"
                        placeholder="PROXY-01"
                        value={newProxyName}
                        onChange={(e) => setNewProxyName(e.target.value)}
                        className="bg-black border-green-900/50 text-white font-mono"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="proxy-url" className="text-white font-mono">
                        URL
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="proxy-url"
                          placeholder="socks5://example.com:1080"
                          value={newProxyUrl}
                          onChange={(e) => setNewProxyUrl(e.target.value)}
                          className="flex-1 bg-black border-green-900/50 text-white font-mono"
                        />
                        <Button
                          onClick={addProxy}
                          className="bg-green-900/50 hover:bg-green-900/80 text-white border border-green-500/50 font-mono"
                        >
                          ADD
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Proxy Lists */}
              {Object.entries(proxies).map(([type, proxyList]) => (
                <Card key={type} className="bg-black/50 backdrop-blur-sm border-green-900/50">
                  <CardHeader>
                    <CardTitle className="text-white font-mono flex items-center">
                      <Network className="h-5 w-5 text-green-500 mr-2" />
                      {type.toUpperCase()} PROXIES
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {proxyList.length} {type} proxies configured
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {proxyList.map((proxy, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-md border border-green-900/50 bg-black/30"
                        >
                          <div className="flex items-center gap-3">
                            {proxy.status === "active" ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-yellow-500" />
                            )}
                            <div>
                              <div className="font-medium text-white font-mono">{proxy.name}</div>
                              <div className="text-xs text-gray-400 font-mono">{proxy.url}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`font-mono ${
                                proxy.status === "active"
                                  ? "border-green-500 text-green-400"
                                  : "border-yellow-500 text-yellow-400"
                              }`}
                            >
                              {proxy.status === "active" ? "ACTIVE" : "INACTIVE"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white hover:bg-green-900/30 font-mono"
                            >
                              TEST
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex justify-end mt-4">
                <Button
                  onClick={testAllProxies}
                  className="bg-green-900/50 hover:bg-green-900/80 text-white border border-green-500/50 font-mono"
                >
                  TEST ALL PROXIES
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-4">
            <Card className="bg-black/50 backdrop-blur-sm border-green-900/50">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <Settings className="h-5 w-5 text-green-500 mr-2" />
                  SYSTEM SETTINGS
                </CardTitle>
                <CardDescription className="text-gray-400">Configure NiedProxy settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-white font-mono">GENERAL SETTINGS</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-start" className="text-white font-mono">
                            AUTO-START ON BOOT
                          </Label>
                          <p className="text-xs text-gray-400">Start NiedProxy when your system boots</p>
                        </div>
                        <Switch id="auto-start" className="data-[state=checked]:bg-green-500" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="notifications" className="text-white font-mono">
                            ENABLE NOTIFICATIONS
                          </Label>
                          <p className="text-xs text-gray-400">Show notifications when IP changes</p>
                        </div>
                        <Switch id="notifications" defaultChecked className="data-[state=checked]:bg-green-500" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="logging" className="text-white font-mono">
                            ENABLE LOGGING
                          </Label>
                          <p className="text-xs text-gray-400">Log all proxy activities</p>
                        </div>
                        <Switch id="logging" defaultChecked className="data-[state=checked]:bg-green-500" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-white font-mono">ADVANCED SETTINGS</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="timeout" className="text-white font-mono">
                          REQUEST TIMEOUT
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            id="timeout"
                            type="number"
                            defaultValue="10"
                            min="1"
                            max="60"
                            className="bg-black border-green-900/50 text-white font-mono w-24"
                          />
                          <span className="text-gray-400 font-mono">SECONDS</span>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="retries" className="text-white font-mono">
                          MAX RETRIES
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            id="retries"
                            type="number"
                            defaultValue="3"
                            min="1"
                            max="10"
                            className="bg-black border-green-900/50 text-white font-mono w-24"
                          />
                          <span className="text-gray-400 font-mono">ATTEMPTS</span>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="test-url" className="text-white font-mono">
                          IP TEST URL
                        </Label>
                        <Input
                          id="test-url"
                          defaultValue="https://httpbin.org/ip"
                          className="bg-black border-green-900/50 text-white font-mono mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-white font-mono">SECURITY SETTINGS</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="dns-leak" className="text-white font-mono">
                            DNS LEAK PROTECTION
                          </Label>
                          <p className="text-xs text-gray-400">Prevent DNS requests from leaking outside the proxy</p>
                        </div>
                        <Switch id="dns-leak" defaultChecked className="data-[state=checked]:bg-green-500" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="webrtc" className="text-white font-mono">
                            WEBRTC PROTECTION
                          </Label>
                          <p className="text-xs text-gray-400">Block WebRTC from revealing your real IP</p>
                        </div>
                        <Switch id="webrtc" defaultChecked className="data-[state=checked]:bg-green-500" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="fingerprint" className="text-white font-mono">
                            FINGERPRINT RANDOMIZATION
                          </Label>
                          <p className="text-xs text-gray-400">Randomize browser fingerprint to avoid tracking</p>
                        </div>
                        <Switch id="fingerprint" defaultChecked className="data-[state=checked]:bg-green-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end mt-4">
              <Button className="bg-green-900/50 hover:bg-green-900/80 text-white border border-green-500/50 font-mono">
                SAVE SETTINGS
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

