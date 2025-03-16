"use client"

import { useEffect, useRef } from "react"

export default function FloatingBubbles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Bubble properties
    const bubbleCount = 30
    const bubbles = []

    // Bubble colors - shades of green, blue, and yellow
    const colors = [
      "rgba(144, 238, 144, 0.4)", // light green
      "rgba(0, 128, 0, 0.3)", // green
      "rgba(173, 255, 47, 0.4)", // greenyellow
      "rgba(135, 206, 250, 0.3)", // lightskyblue
      "rgba(173, 216, 230, 0.4)", // lightblue
      "rgba(255, 255, 224, 0.3)", // lightyellow
      "rgba(240, 230, 140, 0.3)", // khaki
    ]

  
    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 50 + 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
      })
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      bubbles.forEach((bubble) => {
        // Move bubble
        bubble.x += bubble.speedX
        bubble.y += bubble.speedY

        // Bounce off walls
        if (bubble.x - bubble.radius < 0 || bubble.x + bubble.radius > canvas.width) {
          bubble.speedX = -bubble.speedX
        }

        if (bubble.y - bubble.radius < 0 || bubble.y + bubble.radius > canvas.height) {
          bubble.speedY = -bubble.speedY
        }

        // Draw bubble
        ctx.beginPath()
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2)
        ctx.fillStyle = bubble.color
        ctx.fill()
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
        ctx.stroke()
        ctx.closePath()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" style={{ pointerEvents: "none" }} />
}

