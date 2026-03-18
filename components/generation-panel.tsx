"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { 
  ChevronDown, 
  Sparkles, 
  Upload, 
  Settings2, 
  Zap,
  Video,
  Image as ImageIcon,
  Check
} from "lucide-react"

type GenerationMode = "t2v" | "t2i" | "i2i" | "i2v"

interface ModelFamily {
  id: string
  name: string
  description: string
  models: Model[]
}

interface Model {
  id: string
  name: string
  description: string
}

const modelFamilies: ModelFamily[] = [
  {
    id: "wan",
    name: "Wan 2.2",
    description: "High-quality video generation",
    models: [
      { id: "wan-base", name: "Wan 2.2 Base", description: "Balanced quality and speed" },
      { id: "wan-pro", name: "Wan 2.2 Pro", description: "Maximum quality output" },
      { id: "wan-fast", name: "Wan 2.2 Fast", description: "Optimized for speed" },
    ]
  },
  {
    id: "ltx",
    name: "LTX 2.3",
    description: "Cinematic video synthesis",
    models: [
      { id: "ltx-base", name: "LTX 2.3 Standard", description: "General purpose video" },
      { id: "ltx-cinema", name: "LTX Cinema", description: "Film-quality output" },
    ]
  },
  {
    id: "sd",
    name: "Stable Diffusion",
    description: "Versatile image generation",
    models: [
      { id: "sdxl", name: "SDXL 1.0", description: "High resolution images" },
      { id: "sd-turbo", name: "SD Turbo", description: "Ultra-fast generation" },
      { id: "sd-3", name: "SD 3.0", description: "Latest architecture" },
    ]
  },
  {
    id: "flux",
    name: "FLUX",
    description: "State-of-the-art image models",
    models: [
      { id: "flux-dev", name: "FLUX.1 [dev]", description: "Development model" },
      { id: "flux-schnell", name: "FLUX.1 [schnell]", description: "Fast inference" },
      { id: "flux-pro", name: "FLUX.1 [pro]", description: "Professional quality" },
    ]
  },
]

const durations = [
  { value: "2s", label: "2 seconds" },
  { value: "4s", label: "4 seconds" },
  { value: "6s", label: "6 seconds" },
  { value: "8s", label: "8 seconds" },
]

const fpsOptions = [
  { value: 16, label: "16 FPS" },
  { value: 24, label: "24 FPS" },
  { value: 30, label: "30 FPS" },
]

const resolutions = [
  { value: "720p", label: "720p (1280x720)" },
  { value: "1080p", label: "1080p (1920x1080)" },
  { value: "4k", label: "4K (3840x2160)" },
]

export function GenerationPanel() {
  const [mode, setMode] = useState<GenerationMode>("t2v")
  const [selectedFamily, setSelectedFamily] = useState(modelFamilies[0])
  const [selectedModel, setSelectedModel] = useState(modelFamilies[0].models[0])
  const [prompt, setPrompt] = useState("")
  const [negativePrompt, setNegativePrompt] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [duration, setDuration] = useState("4s")
  const [fps, setFps] = useState(24)
  const [resolution, setResolution] = useState("1080p")
  const [steps, setSteps] = useState([30])
  const [guidance, setGuidance] = useState([7.5])
  const [seed, setSeed] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isVideoMode = mode === "t2v" || mode === "i2v"

  return (
    <div className="flex h-full flex-col">
      {/* Mode Tabs */}
      <div className={`border-b border-border/50 bg-card/30 px-6 py-4 backdrop-blur-sm ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg bg-secondary p-1">
            {[
              { id: "t2v" as const, label: "Text to Video", icon: Video },
              { id: "t2i" as const, label: "Text to Image", icon: ImageIcon },
              { id: "i2i" as const, label: "Image to Image", icon: ImageIcon },
              { id: "i2v" as const, label: "Image to Video", icon: Video },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMode(tab.id)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
                  mode === tab.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className={`mx-auto max-w-4xl ${mounted ? 'animate-slide-up animate-delay-100' : 'opacity-0'}`}>
          {/* Model Selection */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-foreground">Model Family</label>
            <div className="flex flex-wrap gap-2">
              {modelFamilies.map((family) => (
                <button
                  key={family.id}
                  onClick={() => {
                    setSelectedFamily(family)
                    setSelectedModel(family.models[0])
                  }}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                    selectedFamily.id === family.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  )}
                >
                  {family.name}
                </button>
              ))}
            </div>
          </div>

          {/* Model Variant Dropdown */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-foreground">Model Variant</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    {selectedModel.name}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80">
                <DropdownMenuLabel>{selectedFamily.name} Models</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {selectedFamily.models.map((model) => (
                  <DropdownMenuItem
                    key={model.id}
                    onClick={() => setSelectedModel(model)}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <p className="font-medium">{model.name}</p>
                      <p className="text-xs text-muted-foreground">{model.description}</p>
                    </div>
                    {selectedModel.id === model.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Image Upload for I2I/I2V modes */}
          {(mode === "i2i" || mode === "i2v") && (
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-foreground">Reference Image</label>
              <div className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary/50 hover:bg-muted/50">
                <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Drop an image here or click to browse</p>
                <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, WEBP supported</p>
              </div>
            </div>
          )}

          {/* Prompt Input */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-foreground">Prompt</label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={isVideoMode 
                  ? "A drone shot over snowy pine trees at sunrise, cinematic, 4K quality..." 
                  : "A futuristic cityscape at sunset, neon lights reflecting on wet streets..."}
                className="min-h-[120px] w-full resize-none rounded-xl border border-border bg-input p-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{prompt.length} chars</span>
              </div>
            </div>
          </div>

          {/* Quick Settings Row */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            {isVideoMode && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      {duration}
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Duration</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {durations.map((d) => (
                      <DropdownMenuItem
                        key={d.value}
                        onClick={() => setDuration(d.value)}
                        className="flex items-center justify-between"
                      >
                        {d.label}
                        {duration === d.value && <Check className="h-4 w-4 text-primary" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      {fps} FPS
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Frame Rate</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {fpsOptions.map((f) => (
                      <DropdownMenuItem
                        key={f.value}
                        onClick={() => setFps(f.value)}
                        className="flex items-center justify-between"
                      >
                        {f.label}
                        {fps === f.value && <Check className="h-4 w-4 text-primary" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  {resolution}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Resolution</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {resolutions.map((r) => (
                  <DropdownMenuItem
                    key={r.value}
                    onClick={() => setResolution(r.value)}
                    className="flex items-center justify-between"
                  >
                    {r.label}
                    {resolution === r.value && <Check className="h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant={showAdvanced ? "secondary" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Settings2 className="h-4 w-4" />
              Advanced
            </Button>

            <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
              <span>~2 credits</span>
            </div>
          </div>

          {/* Advanced Settings */}
          {showAdvanced && (
            <div className="mb-6 rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-sm font-semibold text-foreground">Advanced Settings</h3>
              
              <div className="grid gap-6 md:grid-cols-2">
                {/* Negative Prompt */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-foreground">Negative Prompt</label>
                  <textarea
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="Things to avoid..."
                    className="min-h-[80px] w-full resize-none rounded-lg border border-border bg-input p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Inference Steps */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Inference Steps</label>
                    <span className="text-sm text-muted-foreground">{steps[0]}</span>
                  </div>
                  <Slider
                    value={steps}
                    onValueChange={setSteps}
                    min={10}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Guidance Scale */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Guidance Scale</label>
                    <span className="text-sm text-muted-foreground">{guidance[0]}</span>
                  </div>
                  <Slider
                    value={guidance}
                    onValueChange={setGuidance}
                    min={1}
                    max={20}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                {/* Seed */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Seed</label>
                  <input
                    type="text"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    placeholder="Random"
                    className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <Button className="w-full gap-2 rounded-2xl bg-gradient-to-r from-primary to-accent py-6 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30" size="lg">
            <Sparkles className="h-5 w-5" />
            Generate
          </Button>
        </div>
      </div>
    </div>
  )
}
