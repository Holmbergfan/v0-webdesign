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
  Check,
  Type,
  Wand2,
  House,
  MessageSquare
} from "lucide-react"

type GenerationMode = "t2v" | "i2v" | "ti2v" | "t2i" | "i2i" | "t2t"

interface Preset {
  id: string
  name: string
  shortName: string
  description: string
  modelFamily: string
}

interface GenerationTypeConfig {
  id: GenerationMode
  label: string
  icon: any
  presets: Preset[]
}

const generationTypes: GenerationTypeConfig[] = [
  {
    id: "t2v",
    label: "Text to Video",
    icon: Video,
    presets: [
      { id: "wan-2-2-t2v-cinematic", name: "WAN 2.2 Cinematic Motion", shortName: "Cinematic", description: "Baseline text-to-video for short cinematic clips", modelFamily: "Wan 2.2" },
    ]
  },
  {
    id: "i2v",
    label: "Image to Video",
    icon: ImageIcon,
    presets: [
      { id: "wan-2-2-i2v-animate", name: "WAN 2.2 Image Animator", shortName: "Animate", description: "Animate a still image with optional motion direction", modelFamily: "Wan 2.2" },
    ]
  },
  {
    id: "ti2v",
    label: "Text + Image to Video",
    icon: Wand2,
    presets: [
      { id: "wan-2-2-ti2v-directed", name: "WAN 2.2 Directed Motion", shortName: "Directed", description: "Image and prompt together for more controlled video", modelFamily: "Wan 2.2" },
      { id: "wan-2-2-ti2v-turbo", name: "WAN 2.2 Turbo Iteration", shortName: "Turbo", description: "Lower-step preset for quicker iteration", modelFamily: "Wan 2.2" },
      { id: "dr34ml4y-missionary", name: "Dr34mL4y Missionary", shortName: "Missionary", description: "LTX-2.3 + Dr34mL4y LoRA scene", modelFamily: "LTX-2.3 + Dr34mL4y LoRA" },
      { id: "dr34ml4y-blowjob", name: "Dr34mL4y Blowjob", shortName: "BJ", description: "LTX-2.3 + Dr34mL4y LoRA scene", modelFamily: "LTX-2.3 + Dr34mL4y LoRA" },
      { id: "dr34ml4y-double-bj", name: "Dr34mL4y Double BJ", shortName: "Double", description: "LTX-2.3 + Dr34mL4y LoRA scene", modelFamily: "LTX-2.3 + Dr34mL4y LoRA" },
      { id: "dr34ml4y-cowgirl", name: "Dr34mL4y Cowgirl", shortName: "Cowgirl", description: "LTX-2.3 + Dr34mL4y LoRA scene", modelFamily: "LTX-2.3 + Dr34mL4y LoRA" },
      { id: "dr34ml4y-doggy", name: "Dr34mL4y Doggy", shortName: "Doggy", description: "LTX-2.3 + Dr34mL4y LoRA scene", modelFamily: "LTX-2.3 + Dr34mL4y LoRA" },
    ]
  },
  {
    id: "t2i",
    label: "Text to Image",
    icon: ImageIcon,
    presets: [
      { id: "comfyui-realistic-photo", name: "Realistic Photo", shortName: "Realistic", description: "CyberRealistic SD1.5 photorealism", modelFamily: "SD 1.5" },
      { id: "comfyui-realistic-pony", name: "Realistic Pony", shortName: "Pony", description: "CyberRealistic Pony v16 high-detail SDXL", modelFamily: "SDXL / Pony" },
      { id: "comfyui-timeless", name: "TimeLess", shortName: "TimeLess", description: "Copax TimeLess XPlus-2B versatile SDXL", modelFamily: "SDXL" },
      { id: "comfyui-big-love", name: "Big Love", shortName: "Big Love", description: "Big Love Hyper1 soft photographic SDXL", modelFamily: "SDXL" },
    ]
  },
  {
    id: "i2i",
    label: "Salvage Reuse",
    icon: House,
    presets: [
      { id: "reclaimed-furniture-staging", name: "Reclaimed Furniture Staging", shortName: "Furniture", description: "Extract and stage furniture in new interiors", modelFamily: "Grounding DINO + SAM + SDXL/FLUX" },
      { id: "architectural-salvage-placement", name: "Architectural Salvage Placement", shortName: "Architectural", description: "Place salvaged items in new architectural settings", modelFamily: "Grounding DINO + SAM + SD1.5/SDXL" },
      { id: "interior-design-concept", name: "Interior Design Concept", shortName: "Interior", description: "Transform a room photo into a furnished concept", modelFamily: "Custom Interior Pipeline" },
    ]
  },
  {
    id: "t2t",
    label: "Text Assistant",
    icon: MessageSquare,
    presets: [
      { id: "salvage-listing-writer", name: "Salvage Listing Writer", shortName: "Listings", description: "Turn rough notes into polished listing copy", modelFamily: "Qwen 2.5 3B Instruct" },
      { id: "reuse-ideas-generator", name: "Reuse Ideas Generator", shortName: "Reuse Ideas", description: "Generate practical second-life concepts", modelFamily: "Qwen 2.5 3B Instruct" },
    ]
  },
]

const salvageModelOptions = [
  { id: "copax-timeless-sdxl", name: "Copax TimeLess XIV", family: "SDXL" },
  { id: "big-love-sdxl", name: "Big Love Photo5", family: "SDXL" },
  { id: "cyberrealistic-sd15-inpainting", name: "CyberRealistic Inpainting", family: "SD1.5" },
  { id: "cyberrealistic-pony", name: "CyberRealistic Pony v16", family: "Pony" },
  { id: "fluxed-up-flux", name: "Fluxed Up 7.1 FP16", family: "FLUX" },
  { id: "gonzalomo-v7-photo-xl", name: "GonzaLomo v7 Photo XL", family: "SDXL" },
  { id: "gonzalomo-v6-photo-xl-non-dmd", name: "GonzaLomo v6 Photo XL Non-DMD", family: "SDXL" },
  { id: "gonzalomo-v2-pony-dmd", name: "GonzaLomo v2 Pony DMD", family: "Pony" },
  { id: "gonzalomo-v3-flux-d-aio", name: "GonzaLomo v3 Flux D AIO", family: "FLUX" },
  { id: "mop-v61-dmd", name: "MoP v6.1 DMD", family: "SDXL" },
  { id: "mop-mix-epic-realism-pure", name: "MoP Mix Epic Realism Pure", family: "SDXL" },
  { id: "mop-mix-omnia", name: "MoP Mix Omnia", family: "SDXL" },
]

const durations = [
  { value: "2s", label: "2 seconds" },
  { value: "4s", label: "4 seconds" },
  { value: "6s", label: "6 seconds" },
]

const fpsOptions = [
  { value: 16, label: "16 FPS" },
  { value: 24, label: "24 FPS" },
]

const resolutions = [
  { value: "480p", label: "480p (854x480)" },
  { value: "720p", label: "720p (1280x720)" },
  { value: "1080p", label: "1080p (1920x1080)" },
]

export function GenerationPanel() {
  const [mode, setMode] = useState<GenerationMode>("t2v")
  const [selectedPreset, setSelectedPreset] = useState(generationTypes[0].presets[0])
  const [selectedSalvageModel, setSelectedSalvageModel] = useState(salvageModelOptions[0])
  const [prompt, setPrompt] = useState("")
  const [negativePrompt, setNegativePrompt] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [duration, setDuration] = useState("4s")
  const [fps, setFps] = useState(16)
  const [resolution, setResolution] = useState("720p")
  const [steps, setSteps] = useState([20])
  const [guidance, setGuidance] = useState([7.5])
  const [strength, setStrength] = useState([0.75])
  const [seed, setSeed] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentType = generationTypes.find(t => t.id === mode) || generationTypes[0]
  const isVideoMode = mode === "t2v" || mode === "i2v" || mode === "ti2v"
  const isTextMode = mode === "t2t"
  const isSalvageMode = mode === "i2i"
  const needsImage = mode === "i2v" || mode === "ti2v" || mode === "i2i"

  // When mode changes, select the first preset for that mode
  useEffect(() => {
    const type = generationTypes.find(t => t.id === mode)
    if (type && type.presets.length > 0) {
      setSelectedPreset(type.presets[0])
    }
  }, [mode])

  return (
    <div className="flex h-full flex-col">
      {/* Mode Tabs */}
      <div className={`border-b border-border/50 bg-card/30 px-6 py-4 backdrop-blur-sm ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="inline-flex rounded-lg bg-secondary p-1">
            {generationTypes.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMode(tab.id)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all whitespace-nowrap",
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
          {/* Preset Selection */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-foreground">Preset</label>
            <div className="flex flex-wrap gap-2">
              {currentType.presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset)}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                    selectedPreset.id === preset.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  )}
                >
                  {preset.shortName}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {selectedPreset.description} &middot; {selectedPreset.modelFamily}
            </p>
          </div>

          {/* Salvage Model Selector (only for i2i mode) */}
          {isSalvageMode && selectedPreset.id !== "interior-design-concept" && (
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-foreground">Staging Model</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      {selectedSalvageModel.name}
                      <span className="text-xs text-muted-foreground">({selectedSalvageModel.family})</span>
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 max-h-80 overflow-y-auto">
                  <DropdownMenuLabel>Staging Checkpoint</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {salvageModelOptions.map((model) => (
                    <DropdownMenuItem
                      key={model.id}
                      onClick={() => setSelectedSalvageModel(model)}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <p className="font-medium">{model.name}</p>
                        <p className="text-xs text-muted-foreground">{model.family}</p>
                      </div>
                      {selectedSalvageModel.id === model.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Image Upload for modes that need it */}
          {needsImage && (
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-foreground">
                {isSalvageMode ? "Salvage Photo" : "Source Image"}
              </label>
              <div className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary/50 hover:bg-muted/50">
                <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Drop an image here or click to browse</p>
                <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, WEBP supported</p>
              </div>
            </div>
          )}

          {/* Prompt Input */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-foreground">
              {isTextMode ? "Object Notes / Goal" : isSalvageMode ? "Placement Notes" : "Prompt"}
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  isTextMode
                    ? "Vintage teak floor lamp, rewired recently, small scuffs on the base, approx 145cm tall..."
                    : isSalvageMode
                    ? "Keep the object authentic and slightly worn, but stage it in a calm Nordic living room."
                    : isVideoMode
                    ? "A drone shot over snowy pine trees at sunrise, cinematic, 4K quality..."
                    : "Portrait of a woman, soft studio lighting, f1.8, canon 85mm"
                }
                className="min-h-[120px] w-full resize-none rounded-xl border border-border bg-input p-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{prompt.length} chars</span>
              </div>
            </div>
          </div>

          {/* Quick Settings Row (not for text mode) */}
          {!isTextMode && (
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

              {!isSalvageMode && (
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
              )}

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
                <span>~{isVideoMode ? "2" : "1"} credits</span>
              </div>
            </div>
          )}

          {/* Advanced Settings */}
          {showAdvanced && !isTextMode && (
            <div className="mb-6 rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-sm font-semibold text-foreground">Advanced Settings</h3>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Negative Prompt */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-foreground">Negative Prompt</label>
                  <textarea
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder={isSalvageMode ? "duplicate object, warped proportions, floating furniture" : "blurry, distorted, jittery motion"}
                    className="min-h-[80px] w-full resize-none rounded-lg border border-border bg-input p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Inference Steps */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">
                      {isSalvageMode ? "Staging Steps" : "Inference Steps"}
                    </label>
                    <span className="text-sm text-muted-foreground">{steps[0]}</span>
                  </div>
                  <Slider
                    value={steps}
                    onValueChange={setSteps}
                    min={4}
                    max={60}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Guidance Scale */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">
                      {isSalvageMode ? "Prompt Guidance" : "Guidance Scale"}
                    </label>
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

                {/* Strength (for image-based modes) */}
                {(needsImage || isSalvageMode) && (
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">
                        {isSalvageMode ? "Reuse Fidelity" : "Image Strength"}
                      </label>
                      <span className="text-sm text-muted-foreground">{strength[0]}</span>
                    </div>
                    <Slider
                      value={strength}
                      onValueChange={setStrength}
                      min={0.3}
                      max={1}
                      step={0.05}
                      className="w-full"
                    />
                  </div>
                )}

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
            {isTextMode ? "Generate Text" : "Generate"}
          </Button>
        </div>
      </div>
    </div>
  )
}
