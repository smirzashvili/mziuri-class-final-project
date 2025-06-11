"use client"

import { useEffect, useRef, useState } from "react"

interface CanvasEffectsProps {
  width?: number
  height?: number
  particleCount?: number
  colors?: string[]
  className?: string
}

export function CanvasEffects({
  width = 800,
  height = 600,
  particleCount = 50,
  colors = ["#37AF91", "#FFC0CB", "#FFD700", "#FF69B4", "#87CEEB"],
  className = "",
}: CanvasEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [particles, setParticles] = useState<Particle[]>([])

  class Particle {
    x: number
    y: number
    vx: number
    vy: number
    radius: number
    color: string
    alpha: number
    life: number
    maxLife: number

    constructor(x: number, y: number) {
      this.x = x
      this.y = y
      this.vx = (Math.random() - 0.5) * 4
      this.vy = (Math.random() - 0.5) * 4
      this.radius = Math.random() * 8 + 2
      this.color = colors[Math.floor(Math.random() * colors.length)]
      this.alpha = 1
      this.life = 0
      this.maxLife = Math.random() * 100 + 50
    }

    update() {
      this.x += this.vx
      this.y += this.vy
      this.life++

      // Fade out over time
      this.alpha = 1 - this.life / this.maxLife

      // Add some gravity
      this.vy += 0.02

      // Add some wind resistance
      this.vx *= 0.99
      this.vy *= 0.99

      // Shrink over time
      this.radius *= 0.995
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.save()
      ctx.globalAlpha = this.alpha
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.fill()

      // Add glow effect
      ctx.shadowColor = this.color
      ctx.shadowBlur = 10
      ctx.fill()
      ctx.restore()
    }

    isDead() {
      return this.life >= this.maxLife || this.radius < 0.5
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = width
    canvas.height = height

    // Initialize particles
    const initialParticles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      initialParticles.push(new Particle(Math.random() * width, Math.random() * height))
    }
    setParticles(initialParticles)

    const animate = () => {
      // Clear canvas with fade effect
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
      ctx.fillRect(0, 0, width, height)

      setParticles((prevParticles) => {
        const updatedParticles = prevParticles.filter((particle) => {
          particle.update()
          particle.draw(ctx)
          return !particle.isDead()
        })

        // Add new particles occasionally
        if (Math.random() < 0.1 && updatedParticles.length < particleCount) {
          updatedParticles.push(new Particle(Math.random() * width, Math.random() * height))
        }

        return updatedParticles
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [width, height, particleCount, colors])

  return <canvas ref={canvasRef} className={`absolute inset-0 pointer-events-none ${className}`} />
}

// Heart particles canvas effect
export function HeartParticlesCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const hearts: HeartParticle[] = []

    class HeartParticle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      alpha: number
      color: string
      rotation: number
      rotationSpeed: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = canvas.height + 50
        this.vx = (Math.random() - 0.5) * 2
        this.vy = -Math.random() * 3 - 1
        this.size = Math.random() * 20 + 10
        this.alpha = Math.random() * 0.5 + 0.3
        this.color = Math.random() > 0.5 ? "#FF69B4" : "#FFC0CB"
        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() - 0.5) * 0.1
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        this.rotation += this.rotationSpeed
        this.alpha -= 0.005

        // Add some floating motion
        this.vx += (Math.random() - 0.5) * 0.1
        this.vy += (Math.random() - 0.5) * 0.1

        // Limit velocity
        this.vx = Math.max(-2, Math.min(2, this.vx))
        this.vy = Math.max(-4, Math.min(1, this.vy))
      }

      draw() {
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        ctx.scale(this.size / 20, this.size / 20)

        // Draw heart shape
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.moveTo(0, 3)
        ctx.bezierCurveTo(-5, -2, -15, -2, -15, 8)
        ctx.bezierCurveTo(-15, 15, 0, 25, 0, 25)
        ctx.bezierCurveTo(0, 25, 15, 15, 15, 8)
        ctx.bezierCurveTo(15, -2, 5, -2, 0, 3)
        ctx.fill()

        // Add glow
        ctx.shadowColor = this.color
        ctx.shadowBlur = 10
        ctx.fill()

        ctx.restore()
      }

      isDead() {
        return this.alpha <= 0 || this.y < -50
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Add new hearts
      if (Math.random() < 0.1) {
        hearts.push(new HeartParticle())
      }

      // Update and draw hearts
      for (let i = hearts.length - 1; i >= 0; i--) {
        const heart = hearts[i]
        heart.update()
        heart.draw()

        if (heart.isDead()) {
          hearts.splice(i, 1)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className={`fixed inset-0 pointer-events-none z-0 ${className}`} />
}

// Sparkle effect canvas
export function SparkleCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const sparkles: Sparkle[] = []

    class Sparkle {
      x: number
      y: number
      size: number
      alpha: number
      decay: number
      color: string

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.size = Math.random() * 4 + 1
        this.alpha = 1
        this.decay = Math.random() * 0.02 + 0.01
        this.color = `hsl(${Math.random() * 60 + 40}, 100%, 70%)`
      }

      update() {
        this.alpha -= this.decay
        this.size *= 0.99
      }

      draw() {
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.fillStyle = this.color
        ctx.shadowColor = this.color
        ctx.shadowBlur = 5

        // Draw sparkle as a star
        const spikes = 4
        const outerRadius = this.size
        const innerRadius = this.size / 2

        ctx.beginPath()
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius
          const angle = (i * Math.PI) / spikes
          const x = this.x + Math.cos(angle) * radius
          const y = this.y + Math.sin(angle) * radius
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }

      isDead() {
        return this.alpha <= 0
      }
    }

    const addSparkle = (x: number, y: number) => {
      for (let i = 0; i < 3; i++) {
        sparkles.push(new Sparkle(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20))
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Random sparkles
      if (Math.random() < 0.1) {
        addSparkle(Math.random() * canvas.width, Math.random() * canvas.height)
      }

      // Update and draw sparkles
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const sparkle = sparkles[i]
        sparkle.update()
        sparkle.draw()

        if (sparkle.isDead()) {
          sparkles.splice(i, 1)
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    // Add sparkles on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (Math.random() < 0.3) {
        addSparkle(x, y)
      }
    }

    canvas.addEventListener("mousemove", handleMouseMove)

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return <canvas ref={canvasRef} className={`absolute inset-0 pointer-events-none ${className}`} />
}
