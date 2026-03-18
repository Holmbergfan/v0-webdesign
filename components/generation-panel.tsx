"use client"

import { useState, useEffect, useCallback } from "react"
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
  MessageSquare,
  Loader2,
  Film
} from "lucide-react"

// ── Types matching the backend catalog exactly ──────────────────────────

type GenerationType = "t2v" | "i2v" | "ti2v" | "t2i" | "t2t"

type PresetId =
  | "wan-2-2-t2v-cinematic"
  | "wan-2-2-i2v-animate"
  | "wan-2-2-ti2v-directed"
  | "wan-2-2-ti2v-turbo"
  | "comfyui-realistic-photo"
  | "comfyui-realistic-pony"
  | "comfyui-timeless"
  | "comfyui-big-love"
  | "salvage-listing-writer"
  | "reuse-ideas-generator"
  | "dr34ml4y-missionary"
  | "dr34ml4y-blowjob"
  | "dr34ml4y-double-bj"
  | "dr34ml4y-cowgirl"
  | "dr34ml4y-doggy"

interface PresetConfig {
  id: PresetId
  name: string
  shortName: string
  description: string
  modelFamily: string
  workflow: string
  generationType: GenerationType
  needsImage: boolean
  needsPrompt: boolean
  isVideo: boolean
  defaults: {
    prompt?: string
    duration?: number
    fps?: number
    steps?: number
    guidanceScale?: number
    strength?: number
  }
  maxSteps?: number
}

// ── Generation types (tabs) ─────────────────────────────────────────────

const GENERATION_TABS: { id: GenerationType; label: string; icon: any }[] = [
  { id: "t2v", label: "Text to Video", icon: Video },
  { id: "i2v", label: "Image to Video", icon: ImageIcon },
  { id: "ti2v", label: "Text+Image to Video", icon: Wand2 },
  { id: "t2i", label: "Text to Image", icon: ImageIcon },
  { id: "t2t", label: "Text Assistant", icon: MessageSquare },
]

// ── Presets — one entry per backend preset, grouped by generation type ──

const PRESETS: PresetConfig[] = [
  // ─ T2V: WAN 2.2 text-to-video ─
  {
    id: "wan-2-2-t2v-cinematic", generationType: "t2v",
    name: "WAN 2.2 Cinematic Motion", shortName: "Cinematic",
    description: "Baseline text-to-video for short cinematic clips.",
    modelFamily: "Wan 2.2", workflow: "runpod-wan-video",
    needsImage: false, needsPrompt: true, isVideo: true,
    defaults: { duration: 4, fps: 16, steps: 20, guidanceScale: 7.5 },
    maxSteps: 40,
  },

  // ─ I2V: WAN 2.2 image animator ─
  {
    id: "wan-2-2-i2v-animate", generationType: "i2v",
    name: "WAN 2.2 Image Animator", shortName: "Animate",
    description: "Animate a still image with optional motion direction.",
    modelFamily: "Wan 2.2", workflow: "runpod-wan-video",
    needsImage: true, needsPrompt: false, isVideo: true,
    defaults: { duration: 4, fps: 16, steps: 20, guidanceScale: 7.5, strength: 0.75 },
    maxSteps: 40,
  },

  // ─ TI2V: WAN 2.2 text+image-to-video (Directed & Turbo) ─
  {
    id: "wan-2-2-ti2v-directed", generationType: "ti2v",
    name: "WAN 2.2 Directed Motion", shortName: "Directed",
    description: "Use image and prompt together for more controlled video.",
    modelFamily: "Wan 2.2", workflow: "runpod-wan-video",
    needsImage: true, needsPrompt: true, isVideo: true,
    defaults: { duration: 4, fps: 16, steps: 20, guidanceScale: 7.5, strength: 0.75 },
    maxSteps: 40,
  },
  {
    id: "wan-2-2-ti2v-turbo", generationType: "ti2v",
    name: "WAN 2.2 Turbo Iteration", shortName: "Turbo",
    description: "Lower-step preset for quicker iteration and prompt testing.",
    modelFamily: "Wan 2.2", workflow: "runpod-wan-video",
    needsImage: true, needsPrompt: true, isVideo: true,
    defaults: { duration: 4, fps: 16, steps: 4, guidanceScale: 7.5, strength: 0.75 },
    maxSteps: 20,
  },

  // ─ T2I: ComfyUI image generation with different checkpoints ─
  {
    id: "comfyui-realistic-photo", generationType: "t2i",
    name: "Realistic Photo", shortName: "Realistic",
    description: "Photorealistic images using CyberRealistic SD1.5.",
    modelFamily: "SD 1.5 (CyberRealistic)", workflow: "runpod-comfyui",
    needsImage: false, needsPrompt: true, isVideo: false,
    defaults: { steps: 30, guidanceScale: 7 },
    maxSteps: 60,
  },
  {
    id: "comfyui-realistic-pony", generationType: "t2i",
    name: "Realistic Pony", shortName: "Pony",
    description: "High-detail SDXL/Pony generation. Quality tags added automatically.",
    modelFamily: "SDXL / Pony (CyberRealistic Pony v16)", workflow: "runpod-comfyui",
    needsImage: false, needsPrompt: true, isVideo: false,
    defaults: { steps: 30, guidanceScale: 7 },
    maxSteps: 60,
  },
  {
    id: "comfyui-timeless", generationType: "t2i",
    name: "TimeLess", shortName: "TimeLess",
    description: "Versatile SDXL generation using Copax TimeLess XPlus-2B.",
    modelFamily: "SDXL (Copax TimeLess)", workflow: "runpod-comfyui",
    needsImage: false, needsPrompt: true, isVideo: false,
    defaults: { steps: 30, guidanceScale: 7 },
    maxSteps: 60,
  },
  {
    id: "comfyui-big-love", generationType: "t2i",
    name: "Big Love", shortName: "Big Love",
    description: "Soft photographic SDXL using Big Love Hyper1.",
    modelFamily: "SDXL (Big Love Hyper1)", workflow: "runpod-comfyui",
    needsImage: false, needsPrompt: true, isVideo: false,
    defaults: { steps: 30, guidanceScale: 7 },
    maxSteps: 60,
  },

  // ─ T2T: Qwen text assistant ─
  {
    id: "salvage-listing-writer", generationType: "t2t",
    name: "Salvage Listing Writer", shortName: "Listings",
    description: "Turn rough notes into polished listing copy.",
    modelFamily: "Qwen 2.5 3B Instruct", workflow: "runpod-qwen-text",
    needsImage: false, needsPrompt: true, isVideo: false,
    defaults: {},
  },
  {
    id: "reuse-ideas-generator", generationType: "t2t",
    name: "Reuse Ideas Generator", shortName: "Reuse Ideas",
    description: "Generate practical second-life concepts and staging ideas.",
    modelFamily: "Qwen 2.5 3B Instruct", workflow: "runpod-qwen-text",
    needsImage: false, needsPrompt: true, isVideo: false,
    defaults: {},
  },

  // ─ Dr34mL4y scenes: LTX-2.3 + LoRA, these are ti2v under the hood
  //   but shown as their own "Scenes" section within TI2V or as a separate tab.
  //   Backend workflow: runpod-ltx-video, requires image + has built-in prompts.
  {
    id: "dr34ml4y-missionary", generationType: "ti2v",
    name: "Dr34mL4y Missionary", shortName: "Missionary",
    description: "LTX-2.3 + Dr34mL4y LoRA scene generation.",
    modelFamily: "LTX-2.3 + Dr34mL4y LoRA", workflow: "runpod-ltx-video",
    needsImage: true, needsPrompt: false, isVideo: true,
    defaults: { duration: 4, fps: 24, steps: 8, guidanceScale: 7, strength: 0.85 },
    maxSteps: 16,
  },
  {
    id: "dr34ml4y-blowjob", generationType: "ti2v",
    name: "Dr34mL4y Blowjob", shortName: "BJ",
    description: "LTX-2.3 + Dr34mL4y LoRA scene generation.",
    modelFamily: "LTX-2.3 + Dr34mL4y LoRA", workflow: "runpod-ltx-video",
    needsImage: true, needsPrompt: false, isVideo: true,
    defaults: { duration: 4, fps: 24, steps: 8, guidanceScale: 7, strength: 0.85 },
    maxSteps: 16,
  },
  {
    id: "dr34ml4y-double-bj", generationType: "ti2v",
    name: "Dr34mL4y Double BJ", shortName: "Double BJ",
    description: "LTX-2.3 + Dr34mL4y LoRA scene generation.",
    modelFamily: "LTX-2.3 + Dr34mL4y LoRA", workflow: "runpod-ltx-video",
    needsImage: true, needsPrompt: false, isVideo: true,
    defaults: { duration: 4, fps: 24, steps: 8, guidanceScale: 7, strength: 0.85 },
    maxSteps: 16,
  },
  {
    id: "dr34ml4y-cowgirl", generationType: "ti2v",
    name: "Dr34mL4y Cowgirl", shortName: "Cowgirl",
    description: "LTX-2.3 + Dr34mL4y LoRA scene generation.",
    modelFamily: "LTX-2.3 + Dr34mL4y LoRA", workflow: "runpod-ltx-video",
    needsImage: true, needsPrompt: false, isVideo: true,
    defaults: { duration: 4, fps: 24, steps: 8, guidanceScale: 7, strength: 0.85 },
    maxSteps: 16,
  },
  {
    id: "dr34ml4y-doggy", generationType: "ti2v",
    name: "Dr34mL4y Doggy", shortName: "Doggy",
    description: "LTX-2.3 + Dr34mL4y LoRA scene generation.",
    modelFamily: "LTX-2.3 + Dr34mL4y LoRA", workflow: "runpod-ltx-video",
    needsImage: true, needsPrompt: false, isVideo: true,
    defaults: { duration: 4, fps: 24, steps: 8, guidanceScale: 7, strength: 0.85 },
    maxSteps: 16,
  },
]

function getPresetsForType(type: GenerationType) {
  return PRESETS.filter((p) => p.generationType === type)
}

// ── Duration / FPS options (match backend constraints) ──────────────────

const WAN_DURATIONS = [
  { value: 2, label: "2s" },
  { value: 4, label: "4s" },
  { value: 6, label: "6s" },
]

const LTX_DURATIONS = [
  { value: 2, label: "2s" },
  { value: 4, label: "4s" },
  { value: 6, label: "6s" },
]

const WAN_FPS = [
  { value: 16, label: "16 FPS" },
  { value: 24, label: "24 FPS" },
]

const LTX_FPS = [
  { value: 16, label: "16 FPS" },
  { value: 24, label: "24 FPS" },
]

// ── Component ───────────────────────────────────────────────────────────

export function GenerationPanel() {
  const [mode, setMode] = useState<GenerationType>("t2v")
  const [selectedPreset, setSelectedPreset] = useState<PresetConfig>(PRESETS[0])
  const [prompt, setPrompt] = useState("")
  const [negativePrompt, setNegativePrompt] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [duration, setDuration] = useState(4)
  const [fps, setFps] = useState(16)
  const [steps, setSteps] = useState([20])
  const [guidance, setGuidance] = useState([7.5])
  const [strength, setStrength] = useState([0.75])
  const [seed, setSeed] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // When mode changes, pick the first preset of that type and reset controls
  useEffect(() => {
    const presets = getPresetsForType(mode)
    if (presets.length > 0) {
      const p = presets[0]
      setSelectedPreset(p)
      applyPresetDefaults(p)
    }
  }, [mode])

  function applyPresetDefaults(p: PresetConfig) {
    setDuration(p.defaults.duration ?? 4)
    setFps(p.defaults.fps ?? 16)
    setSteps([p.defaults.steps ?? 20])
    setGuidance([p.defaults.guidanceScale ?? 7.5])
    setStrength([p.defaults.strength ?? 0.75])
    setSeed("")
  }

  function selectPreset(p: PresetConfig) {
    setSelectedPreset(p)
    applyPresetDefaults(p)
  }

  const currentPresets = getPresetsForType(mode)
  const isLTX = selectedPreset.workflow === "runpod-ltx-video"
  const isWan = selectedPreset.workflow === "runpod-wan-video"
  const isComfyUI = selectedPreset.workflow === "runpod-comfyui"
  const isText = selectedPreset.workflow === "runpod-qwen-text"
  const durationOptions = isLTX ? LTX_DURATIONS : WAN_DURATIONS
  const fpsOptions = isLTX ? LTX_FPS : WAN_FPS

  // Separate WAN presets from Dr34mL4y presets in TI2V mode
  const wanPresets = currentPresets.filter((p) => p.workflow === "runpod-wan-video")
  const ltxPresets = currentPresets.filter((p) => p.workflow === "runpod-ltx-video")
  const hasMixedPresets = wanPresets.length > 0 && ltxPresets.length > 0

  // ── Submit to /api/generate ───────────────────────────────────────────

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)
    try {
      // If we have an image, upload it first to get a URL
      let imageUrl: string | undefined
      if (imageFile) {
        const formData = new FormData()
        formData.append("file", imageFile)
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
        if (!uploadRes.ok) throw new Error("Image upload failed")
        const uploadData = await uploadRes.json()
        imageUrl = uploadData.url
      }

      const body: Record<string, unknown> = {
        preset_id: selectedPreset.id,
        generation_type: selectedPreset.generationType,
        prompt: prompt || undefined,
        negative_prompt: negativePrompt || undefined,
        seed: seed || undefined,
      }

      if (imageUrl) {
        body.image_url = imageUrl
      }

      if (selectedPreset.isVideo) {
        body.duration = duration
        body.fps = fps
        body.steps = steps[0]
        body.guidance_scale = guidance[0]
        if (selectedPreset.needsImage) {
          body.strength = strength[0]
        }
      } else if (isComfyUI) {
        body.steps = steps[0]
        body.guidance_scale = guidance[0]
      }

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Generation failed")
      }

      const data = await res.json()
      console.log("Job submitted:", data)
      // TODO: redirect to queue or show toast
    } catch (err) {
      console.error("Submit error:", err)
      // TODO: show error toast
    } finally {
      setIsSubmitting(false)
    }
  }, [selectedPreset, prompt, negativePrompt, seed, duration, fps, steps, guidance, strength, imageFile, isComfyUI])

  // ── Image upload handler ──────────────────────────────────────────────

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file || !file.type.startsWith("image/")) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Mode Tabs */}
      <div className={`border-b border-border/50 bg-card/30 px-6 py-4 backdrop-blur-sm ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="inline-flex rounded-lg bg-secondary p-1">
            {GENERATION_TABS.map((tab) => (
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

          {/* Preset Selection — split into sections when TI2V has WAN + LTX */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-foreground">Preset</label>

            {hasMixedPresets ? (
              <>
                {/* WAN 2.2 section */}
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">WAN 2.2</p>
                <div className="mb-3 flex flex-wrap gap-2">
                  {wanPresets.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => selectPreset(p)}
                      className={cn(
                        "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                        selectedPreset.id === p.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      )}
                    >
                      {p.shortName}
                    </button>
                  ))}
                </div>

                {/* Dr34mL4y / LTX section */}
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Film className="inline h-3 w-3 mr-1" />
                  Dr34mL4y Scenes (LTX-2.3)
                </p>
                <div className="flex flex-wrap gap-2">
                  {ltxPresets.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => selectPreset(p)}
                      className={cn(
                        "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                        selectedPreset.id === p.id
                          ? "border-rose-500 bg-rose-500/10 text-rose-500"
                          : "border-border text-muted-foreground hover:border-rose-500/50 hover:text-foreground"
                      )}
                    >
                      {p.shortName}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-wrap gap-2">
                {currentPresets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => selectPreset(p)}
                    className={cn(
                      "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                      selectedPreset.id === p.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    {p.shortName}
                  </button>
                ))}
              </div>
            )}

            <p className="mt-2 text-xs text-muted-foreground">
              {selectedPreset.description} &middot; <span className="font-mono">{selectedPreset.modelFamily}</span>
            </p>
          </div>

          {/* Image Upload (when preset needs it) */}
          {selectedPreset.needsImage && (
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-foreground">
                {isLTX ? "Character Reference" : "Source Image"}
              </label>
              <div
                className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary/50 hover:bg-muted/50 relative overflow-hidden"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-contain" />
                ) : (
                  <>
                    <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">Drop an image here or click to browse</p>
                    <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, WEBP supported</p>
                  </>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              {imageFile && (
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{imageFile.name}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null) }}
                    className="text-destructive hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Prompt Input (when preset needs it — skip for Dr34mL4y which has built-in prompts) */}
          {(selectedPreset.needsPrompt || (!isLTX && !isText)) && (
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-foreground">
                {isText ? "Object Notes / Goal" : "Prompt"}
                {!selectedPreset.needsPrompt && (
                  <span className="ml-2 text-xs text-muted-foreground">(optional)</span>
                )}
              </label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    isText
                      ? "Vintage teak floor lamp, rewired recently, small scuffs on the base, approx 145cm tall..."
                      : mode === "t2v"
                      ? "A drone shot over snowy pine trees at sunrise, cinematic, 4K quality..."
                      : mode === "i2v"
                      ? "Gentle camera push-in with drifting fog (optional — leave blank for default motion)"
                      : mode === "ti2v" && isWan
                      ? "Slow dolly toward the subject as soft particles drift by"
                      : isComfyUI
                      ? "Portrait of a woman, soft studio lighting, f1.8, canon 85mm"
                      : "Describe what you want..."
                  }
                  className="min-h-[120px] w-full resize-none rounded-xl border border-border bg-input p-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="absolute bottom-3 right-3">
                  <span className="text-xs text-muted-foreground">{prompt.length} chars</span>
                </div>
              </div>
            </div>
          )}

          {/* Dr34mL4y info when a scene preset is selected */}
          {isLTX && (
            <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/5 p-4">
              <p className="text-sm text-foreground">
                <Film className="inline h-4 w-4 mr-1 text-rose-500" />
                <strong>{selectedPreset.name}</strong> — This preset uses a built-in optimized prompt.
                Upload a character reference image above to generate.
              </p>
            </div>
          )}

          {/* Quick Settings Row (video & image modes, not text) */}
          {!isText && (
            <div className="mb-6 flex flex-wrap items-center gap-3">
              {selectedPreset.isVideo && (
                <>
                  {/* Duration */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        {duration}s
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Duration</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {durationOptions.map((d) => (
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

                  {/* FPS */}
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
                <span>~{selectedPreset.isVideo ? "2" : "1"} credits</span>
              </div>
            </div>
          )}

          {/* Advanced Settings */}
          {showAdvanced && !isText && (
            <div className="mb-6 rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-sm font-semibold text-foreground">Advanced Settings</h3>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Negative Prompt */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-foreground">Negative Prompt</label>
                  <textarea
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder={
                      selectedPreset.isVideo
                        ? "blurry, distorted, jittery motion, warping, flicker"
                        : "blurry, deformed, watermark, ugly, bad anatomy"
                    }
                    className="min-h-[80px] w-full resize-none rounded-lg border border-border bg-input p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Steps */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Inference Steps</label>
                    <span className="text-sm text-muted-foreground">{steps[0]}</span>
                  </div>
                  <Slider
                    value={steps}
                    onValueChange={setSteps}
                    min={4}
                    max={selectedPreset.maxSteps ?? 60}
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
                    max={isComfyUI ? 15 : 20}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                {/* Strength (image-based presets) */}
                {selectedPreset.needsImage && (
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">Image Strength</label>
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
          <Button
            className="w-full gap-2 rounded-2xl bg-gradient-to-r from-primary to-accent py-6 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50"
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting || (selectedPreset.needsPrompt && !prompt.trim()) || (selectedPreset.needsImage && !imageFile)}
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
            {isSubmitting ? "Submitting..." : isText ? "Generate Text" : "Generate"}
          </Button>

          {/* Validation hint */}
          {(selectedPreset.needsPrompt && !prompt.trim()) && (
            <p className="mt-2 text-center text-xs text-muted-foreground">Enter a prompt to generate</p>
          )}
          {(selectedPreset.needsImage && !imageFile) && (
            <p className="mt-2 text-center text-xs text-muted-foreground">Upload an image to generate</p>
          )}
        </div>
      </div>
    </div>
  )
}
