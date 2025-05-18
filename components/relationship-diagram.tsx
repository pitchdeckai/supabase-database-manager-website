"use client"

import { useEffect, useRef } from "react"
import type { TableRelationship } from "@/lib/types"

interface RelationshipDiagramProps {
  relationships: TableRelationship[]
  tables: string[]
}

export function RelationshipDiagram({ relationships, tables }: RelationshipDiagramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to match container
    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate table positions in a circle
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) * 0.7

    const tablePositions: Record<string, { x: number; y: number }> = {}

    tables.forEach((table, index) => {
      const angle = (index / tables.length) * Math.PI * 2
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      tablePositions[table] = { x, y }
    })

    // Draw tables
    Object.entries(tablePositions).forEach(([tableName, position]) => {
      // Draw table node
      ctx.beginPath()
      ctx.fillStyle = "#f1f5f9" // slate-100
      ctx.strokeStyle = "#94a3b8" // slate-400
      ctx.lineWidth = 2
      ctx.arc(position.x, position.y, 40, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      // Draw table name
      ctx.fillStyle = "#0f172a" // slate-900
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(tableName, position.x, position.y)
    })

    // Draw relationships
    relationships.forEach((rel) => {
      const sourcePos = tablePositions[rel.table_name]
      const targetPos = tablePositions[rel.foreign_table]

      if (!sourcePos || !targetPos) return

      // Calculate direction vectors
      const dx = targetPos.x - sourcePos.x
      const dy = targetPos.y - sourcePos.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Normalize direction vectors
      const nx = dx / distance
      const ny = dy / distance

      // Calculate start and end points (outside the circles)
      const startX = sourcePos.x + nx * 40
      const startY = sourcePos.y + ny * 40
      const endX = targetPos.x - nx * 40
      const endY = targetPos.y - ny * 40

      // Draw line
      ctx.beginPath()
      ctx.strokeStyle = "#3b82f6" // blue-500
      ctx.lineWidth = 2
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.stroke()

      // Draw arrow
      const arrowSize = 10
      const angle = Math.atan2(endY - startY, endX - startX)

      ctx.beginPath()
      ctx.fillStyle = "#3b82f6" // blue-500
      ctx.moveTo(endX, endY)
      ctx.lineTo(endX - arrowSize * Math.cos(angle - Math.PI / 6), endY - arrowSize * Math.sin(angle - Math.PI / 6))
      ctx.lineTo(endX - arrowSize * Math.cos(angle + Math.PI / 6), endY - arrowSize * Math.sin(angle + Math.PI / 6))
      ctx.closePath()
      ctx.fill()
    })

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [relationships, tables])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />
}
