"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

// Sample data for demonstration
const samplePatterns = [
  {
    id: "accumulation",
    name: "Accumulation",
    description: "A period where smart money is accumulating positions from retail traders.",
  },
  {
    id: "distribution",
    name: "Distribution",
    description: "A period where smart money is distributing positions to retail traders.",
  },
  {
    id: "spring",
    name: "Spring",
    description: "A price movement below support that quickly reverses, trapping sellers.",
  },
  {
    id: "upthrust",
    name: "Upthrust",
    description: "A price movement above resistance that quickly reverses, trapping buyers.",
  },
  { id: "secondary_test", name: "Secondary Test", description: "A retest of a previous support or resistance level." },
]

const sampleStocks = [
  { id: "aapl", name: "Apple Inc. (AAPL)", data: "sample_data_aapl" },
  { id: "msft", name: "Microsoft Corp. (MSFT)", data: "sample_data_msft" },
  { id: "amzn", name: "Amazon.com Inc. (AMZN)", data: "sample_data_amzn" },
  { id: "googl", name: "Alphabet Inc. (GOOGL)", data: "sample_data_googl" },
  { id: "tsla", name: "Tesla Inc. (TSLA)", data: "sample_data_tsla" },
]

export function WyckoffPatternVisualizer() {
  const [selectedStock, setSelectedStock] = useState("aapl")
  const [selectedPattern, setSelectedPattern] = useState("accumulation")
  const [timeframe, setTimeframe] = useState(90) // days
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Draw chart when component mounts or when selections change
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw chart background
        ctx.fillStyle = "#f8fafc"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw chart based on selected stock and pattern
        drawChart(ctx, canvas.width, canvas.height, selectedStock, selectedPattern, timeframe)
      }
    }
  }, [selectedStock, selectedPattern, timeframe])

  // Function to draw a sample chart
  const drawChart = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    stockId: string,
    patternId: string,
    days: number,
  ) => {
    // Set chart dimensions
    const margin = { top: 20, right: 30, bottom: 30, left: 40 }
    const chartWidth = width - margin.left - margin.right
    const chartHeight = height - margin.top - margin.bottom

    // Generate sample data
    const data = generateSampleData(days, patternId)

    // Draw axes
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 1

    // X-axis
    ctx.beginPath()
    ctx.moveTo(margin.left, height - margin.bottom)
    ctx.lineTo(width - margin.right, height - margin.bottom)
    ctx.stroke()

    // Y-axis
    ctx.beginPath()
    ctx.moveTo(margin.left, margin.top)
    ctx.lineTo(margin.left, height - margin.bottom)
    ctx.stroke()

    // Draw price line
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.beginPath()

    const xStep = chartWidth / (data.length - 1)

    // Find min and max values for scaling
    const minPrice = Math.min(...data.map((d) => d.price)) * 0.95
    const maxPrice = Math.max(...data.map((d) => d.price)) * 1.05
    const priceRange = maxPrice - minPrice

    // Draw price line
    data.forEach((d, i) => {
      const x = margin.left + i * xStep
      const y = margin.top + chartHeight - ((d.price - minPrice) / priceRange) * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw volume bars
    const maxVolume = Math.max(...data.map((d) => d.volume))

    data.forEach((d, i) => {
      const x = margin.left + i * xStep - 2
      const volumeHeight = (d.volume / maxVolume) * (chartHeight * 0.2)
      const y = height - margin.bottom - volumeHeight

      ctx.fillStyle = d.price > data[Math.max(0, i - 1)].price ? "#10b981" : "#ef4444"
      ctx.fillRect(x, y, 4, volumeHeight)
    })

    // Draw pattern annotations based on selected pattern
    if (patternId === "accumulation") {
      drawAccumulationPattern(ctx, data, margin, chartWidth, chartHeight, minPrice, maxPrice, priceRange)
    } else if (patternId === "distribution") {
      drawDistributionPattern(ctx, data, margin, chartWidth, chartHeight, minPrice, maxPrice, priceRange)
    } else if (patternId === "spring") {
      drawSpringPattern(ctx, data, margin, chartWidth, chartHeight, minPrice, maxPrice, priceRange)
    } else if (patternId === "upthrust") {
      drawUpthrustPattern(ctx, data, margin, chartWidth, chartHeight, minPrice, maxPrice, priceRange)
    } else if (patternId === "secondary_test") {
      drawSecondaryTestPattern(ctx, data, margin, chartWidth, chartHeight, minPrice, maxPrice, priceRange)
    }

    // Draw time labels
    ctx.fillStyle = "#64748b"
    ctx.font = "10px Arial"
    ctx.textAlign = "center"

    for (let i = 0; i < data.length; i += Math.floor(data.length / 5)) {
      const x = margin.left + i * xStep
      ctx.fillText(`Day ${i}`, x, height - margin.bottom + 15)
    }

    // Draw price labels
    ctx.textAlign = "right"
    for (let i = 0; i <= 5; i++) {
      const price = minPrice + (i / 5) * priceRange
      const y = margin.top + chartHeight - (i / 5) * chartHeight
      ctx.fillText(price.toFixed(2), margin.left - 5, y + 3)
    }
  }

  // Generate sample data based on pattern
  const generateSampleData = (days: number, patternId: string) => {
    const data = []
    let basePrice = 100
    const trend = 0

    // Different patterns have different price movements
    switch (patternId) {
      case "accumulation":
        // Downtrend, sideways, uptrend
        for (let i = 0; i < days; i++) {
          if (i < days * 0.3) {
            basePrice = basePrice * (1 - 0.005 + Math.random() * 0.003)
          } else if (i < days * 0.7) {
            basePrice = basePrice * (0.997 + Math.random() * 0.006)
          } else {
            basePrice = basePrice * (1 + 0.003 + Math.random() * 0.004)
          }

          const volume = 1000000 * (0.5 + Math.random() * 0.5)
          data.push({ price: basePrice, volume })
        }
        break

      case "distribution":
        // Uptrend, sideways, downtrend
        for (let i = 0; i < days; i++) {
          if (i < days * 0.3) {
            basePrice = basePrice * (1 + 0.005 + Math.random() * 0.003)
          } else if (i < days * 0.7) {
            basePrice = basePrice * (0.997 + Math.random() * 0.006)
          } else {
            basePrice = basePrice * (1 - 0.004 + Math.random() * 0.002)
          }

          const volume = 1000000 * (0.5 + Math.random() * 0.5)
          data.push({ price: basePrice, volume })
        }
        break

      case "spring":
        // Sideways, sharp drop, sharp recovery
        for (let i = 0; i < days; i++) {
          if (i < days * 0.7) {
            basePrice = basePrice * (0.998 + Math.random() * 0.004)
          } else if (i < days * 0.8) {
            basePrice = basePrice * (0.98 + Math.random() * 0.005)
          } else {
            basePrice = basePrice * (1.01 + Math.random() * 0.005)
          }

          const volume = 1000000 * (0.5 + Math.random() * 0.5) * (i > days * 0.7 && i < days * 0.85 ? 2 : 1)
          data.push({ price: basePrice, volume })
        }
        break

      case "upthrust":
        // Sideways, sharp rise, sharp drop
        for (let i = 0; i < days; i++) {
          if (i < days * 0.7) {
            basePrice = basePrice * (0.998 + Math.random() * 0.004)
          } else if (i < days * 0.8) {
            basePrice = basePrice * (1.02 + Math.random() * 0.005)
          } else {
            basePrice = basePrice * (0.99 + Math.random() * 0.005)
          }

          const volume = 1000000 * (0.5 + Math.random() * 0.5) * (i > days * 0.7 && i < days * 0.85 ? 2 : 1)
          data.push({ price: basePrice, volume })
        }
        break

      case "secondary_test":
        // Drop, recovery, retest
        for (let i = 0; i < days; i++) {
          if (i < days * 0.3) {
            basePrice = basePrice * (0.995 + Math.random() * 0.003)
          } else if (i < days * 0.6) {
            basePrice = basePrice * (1.005 + Math.random() * 0.003)
          } else if (i < days * 0.8) {
            basePrice = basePrice * (0.997 + Math.random() * 0.004)
          } else {
            basePrice = basePrice * (1.002 + Math.random() * 0.003)
          }

          const volume = 1000000 * (0.5 + Math.random() * 0.5) * (i > days * 0.7 && i < days * 0.8 ? 1.5 : 1)
          data.push({ price: basePrice, volume })
        }
        break

      default:
        // Default random walk
        for (let i = 0; i < days; i++) {
          basePrice = basePrice * (0.995 + Math.random() * 0.01)
          const volume = 1000000 * (0.5 + Math.random() * 0.5)
          data.push({ price: basePrice, volume })
        }
    }

    return data
  }

  // Draw annotations for different patterns
  const drawAccumulationPattern = (
    ctx: CanvasRenderingContext2D,
    data: any[],
    margin: any,
    chartWidth: number,
    chartHeight: number,
    minPrice: number,
    maxPrice: number,
    priceRange: number,
  ) => {
    const xStep = chartWidth / (data.length - 1)

    // Phase A - Downtrend ending
    const phaseAEnd = Math.floor(data.length * 0.3)
    ctx.fillStyle = "rgba(239, 68, 68, 0.1)"
    ctx.fillRect(margin.left, margin.top, phaseAEnd * xStep, chartHeight)

    // Phase B - Sideways
    const phaseBEnd = Math.floor(data.length * 0.7)
    ctx.fillStyle = "rgba(59, 130, 246, 0.1)"
    ctx.fillRect(margin.left + phaseAEnd * xStep, margin.top, (phaseBEnd - phaseAEnd) * xStep, chartHeight)

    // Phase C - Uptrend beginning
    ctx.fillStyle = "rgba(16, 185, 129, 0.1)"
    ctx.fillRect(margin.left + phaseBEnd * xStep, margin.top, chartWidth - phaseBEnd * xStep, chartHeight)

    // Add labels
    ctx.font = "12px Arial"
    ctx.fillStyle = "#000"
    ctx.textAlign = "center"

    ctx.fillText("Phase A", margin.left + (phaseAEnd * xStep) / 2, margin.top + 20)
    ctx.fillText("Phase B", margin.left + phaseAEnd * xStep + ((phaseBEnd - phaseAEnd) * xStep) / 2, margin.top + 20)
    ctx.fillText("Phase C", margin.left + phaseBEnd * xStep + (chartWidth - phaseBEnd * xStep) / 2, margin.top + 20)

    // Draw support line
    const supportY = getYPosition(
      Math.min(...data.slice(phaseAEnd, phaseBEnd).map((d) => d.price)) * 0.99,
      minPrice,
      maxPrice,
      margin,
      chartHeight,
    )
    ctx.strokeStyle = "#64748b"
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(margin.left + phaseAEnd * xStep, supportY)
    ctx.lineTo(margin.left + phaseBEnd * xStep, supportY)
    ctx.stroke()
    ctx.setLineDash([])

    // Label support
    ctx.fillStyle = "#64748b"
    ctx.textAlign = "left"
    ctx.fillText("Support", margin.left + phaseAEnd * xStep + 5, supportY - 5)
  }

  const drawDistributionPattern = (
    ctx: CanvasRenderingContext2D,
    data: any[],
    margin: any,
    chartWidth: number,
    chartHeight: number,
    minPrice: number,
    maxPrice: number,
    priceRange: number,
  ) => {
    const xStep = chartWidth / (data.length - 1)

    // Phase A - Uptrend ending
    const phaseAEnd = Math.floor(data.length * 0.3)
    ctx.fillStyle = "rgba(16, 185, 129, 0.1)"
    ctx.fillRect(margin.left, margin.top, phaseAEnd * xStep, chartHeight)

    // Phase B - Sideways
    const phaseBEnd = Math.floor(data.length * 0.7)
    ctx.fillStyle = "rgba(59, 130, 246, 0.1)"
    ctx.fillRect(margin.left + phaseAEnd * xStep, margin.top, (phaseBEnd - phaseAEnd) * xStep, chartHeight)

    // Phase C - Downtrend beginning
    ctx.fillStyle = "rgba(239, 68, 68, 0.1)"
    ctx.fillRect(margin.left + phaseBEnd * xStep, margin.top, chartWidth - phaseBEnd * xStep, chartHeight)

    // Add labels
    ctx.font = "12px Arial"
    ctx.fillStyle = "#000"
    ctx.textAlign = "center"

    ctx.fillText("Phase A", margin.left + (phaseAEnd * xStep) / 2, margin.top + 20)
    ctx.fillText("Phase B", margin.left + phaseAEnd * xStep + ((phaseBEnd - phaseAEnd) * xStep) / 2, margin.top + 20)
    ctx.fillText("Phase C", margin.left + phaseBEnd * xStep + (chartWidth - phaseBEnd * xStep) / 2, margin.top + 20)

    // Draw resistance line
    const resistanceY = getYPosition(
      Math.max(...data.slice(phaseAEnd, phaseBEnd).map((d) => d.price)) * 1.01,
      minPrice,
      maxPrice,
      margin,
      chartHeight,
    )
    ctx.strokeStyle = "#64748b"
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(margin.left + phaseAEnd * xStep, resistanceY)
    ctx.lineTo(margin.left + phaseBEnd * xStep, resistanceY)
    ctx.stroke()
    ctx.setLineDash([])

    // Label resistance
    ctx.fillStyle = "#64748b"
    ctx.textAlign = "left"
    ctx.fillText("Resistance", margin.left + phaseAEnd * xStep + 5, resistanceY - 5)
  }

  const drawSpringPattern = (
    ctx: CanvasRenderingContext2D,
    data: any[],
    margin: any,
    chartWidth: number,
    chartHeight: number,
    minPrice: number,
    maxPrice: number,
    priceRange: number,
  ) => {
    const xStep = chartWidth / (data.length - 1)

    // Find spring point (lowest point after 70% of data)
    const springStartIndex = Math.floor(data.length * 0.7)
    const springEndIndex = Math.floor(data.length * 0.8)

    let lowestIndex = springStartIndex
    for (let i = springStartIndex; i <= springEndIndex; i++) {
      if (data[i].price < data[lowestIndex].price) {
        lowestIndex = i
      }
    }

    // Draw support line
    const supportY = getYPosition(data[springStartIndex].price * 1.01, minPrice, maxPrice, margin, chartHeight)
    ctx.strokeStyle = "#64748b"
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(margin.left, supportY)
    ctx.lineTo(margin.left + chartWidth, supportY)
    ctx.stroke()
    ctx.setLineDash([])

    // Highlight spring
    ctx.fillStyle = "rgba(239, 68, 68, 0.2)"
    ctx.fillRect(
      margin.left + springStartIndex * xStep,
      margin.top,
      (springEndIndex - springStartIndex) * xStep,
      chartHeight,
    )

    // Draw arrow pointing to spring
    const springX = margin.left + lowestIndex * xStep
    const springY = getYPosition(data[lowestIndex].price, minPrice, maxPrice, margin, chartHeight)

    ctx.fillStyle = "#ef4444"
    ctx.beginPath()
    ctx.arc(springX, springY, 5, 0, Math.PI * 2)
    ctx.fill()

    // Label
    ctx.font = "12px Arial"
    ctx.fillStyle = "#ef4444"
    ctx.textAlign = "center"
    ctx.fillText("Spring", springX, springY - 10)

    ctx.fillStyle = "#64748b"
    ctx.textAlign = "left"
    ctx.fillText("Support", margin.left + 5, supportY - 5)
  }

  const drawUpthrustPattern = (
    ctx: CanvasRenderingContext2D,
    data: any[],
    margin: any,
    chartWidth: number,
    chartHeight: number,
    minPrice: number,
    maxPrice: number,
    priceRange: number,
  ) => {
    const xStep = chartWidth / (data.length - 1)

    // Find upthrust point (highest point after 70% of data)
    const upthrustStartIndex = Math.floor(data.length * 0.7)
    const upthrustEndIndex = Math.floor(data.length * 0.8)

    let highestIndex = upthrustStartIndex
    for (let i = upthrustStartIndex; i <= upthrustEndIndex; i++) {
      if (data[i].price > data[highestIndex].price) {
        highestIndex = i
      }
    }

    // Draw resistance line
    const resistanceY = getYPosition(data[upthrustStartIndex].price * 0.99, minPrice, maxPrice, margin, chartHeight)
    ctx.strokeStyle = "#64748b"
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(margin.left, resistanceY)
    ctx.lineTo(margin.left + chartWidth, resistanceY)
    ctx.stroke()
    ctx.setLineDash([])

    // Highlight upthrust
    ctx.fillStyle = "rgba(16, 185, 129, 0.2)"
    ctx.fillRect(
      margin.left + upthrustStartIndex * xStep,
      margin.top,
      (upthrustEndIndex - upthrustStartIndex) * xStep,
      chartHeight,
    )

    // Draw arrow pointing to upthrust
    const upthrustX = margin.left + highestIndex * xStep
    const upthrustY = getYPosition(data[highestIndex].price, minPrice, maxPrice, margin, chartHeight)

    ctx.fillStyle = "#10b981"
    ctx.beginPath()
    ctx.arc(upthrustX, upthrustY, 5, 0, Math.PI * 2)
    ctx.fill()

    // Label
    ctx.font = "12px Arial"
    ctx.fillStyle = "#10b981"
    ctx.textAlign = "center"
    ctx.fillText("Upthrust", upthrustX, upthrustY + 20)

    ctx.fillStyle = "#64748b"
    ctx.textAlign = "left"
    ctx.fillText("Resistance", margin.left + 5, resistanceY - 5)
  }

  const drawSecondaryTestPattern = (
    ctx: CanvasRenderingContext2D,
    data: any[],
    margin: any,
    chartWidth: number,
    chartHeight: number,
    minPrice: number,
    maxPrice: number,
    priceRange: number,
  ) => {
    const xStep = chartWidth / (data.length - 1)

    // Find initial low point
    const initialLowIndex = Math.floor(data.length * 0.3)

    // Find secondary test point
    const secondaryTestIndex = Math.floor(data.length * 0.75)

    // Draw support line
    const supportY = getYPosition(data[initialLowIndex].price, minPrice, maxPrice, margin, chartHeight)
    ctx.strokeStyle = "#64748b"
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(margin.left + initialLowIndex * xStep, supportY)
    ctx.lineTo(margin.left + chartWidth, supportY)
    ctx.stroke()
    ctx.setLineDash([])

    // Highlight points
    const initialLowX = margin.left + initialLowIndex * xStep
    const initialLowY = getYPosition(data[initialLowIndex].price, minPrice, maxPrice, margin, chartHeight)

    const secondaryTestX = margin.left + secondaryTestIndex * xStep
    const secondaryTestY = getYPosition(data[secondaryTestIndex].price, minPrice, maxPrice, margin, chartHeight)

    // Draw points
    ctx.fillStyle = "#ef4444"
    ctx.beginPath()
    ctx.arc(initialLowX, initialLowY, 5, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#3b82f6"
    ctx.beginPath()
    ctx.arc(secondaryTestX, secondaryTestY, 5, 0, Math.PI * 2)
    ctx.fill()

    // Labels
    ctx.font = "12px Arial"
    ctx.fillStyle = "#ef4444"
    ctx.textAlign = "center"
    ctx.fillText("Initial Test", initialLowX, initialLowY - 10)

    ctx.fillStyle = "#3b82f6"
    ctx.fillText("Secondary Test", secondaryTestX, secondaryTestY - 10)

    ctx.fillStyle = "#64748b"
    ctx.textAlign = "left"
    ctx.fillText("Support", margin.left + initialLowIndex * xStep + 5, supportY - 5)
  }

  // Helper function to get Y position on canvas
  const getYPosition = (price: number, minPrice: number, maxPrice: number, margin: any, chartHeight: number) => {
    return margin.top + chartHeight - ((price - minPrice) / (maxPrice - minPrice)) * chartHeight
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Select Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedStock} onValueChange={setSelectedStock}>
              <SelectTrigger>
                <SelectValue placeholder="Select a stock" />
              </SelectTrigger>
              <SelectContent>
                {sampleStocks.map((stock) => (
                  <SelectItem key={stock.id} value={stock.id}>
                    {stock.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Select Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedPattern} onValueChange={setSelectedPattern}>
              <SelectTrigger>
                <SelectValue placeholder="Select a pattern" />
              </SelectTrigger>
              <SelectContent>
                {samplePatterns.map((pattern) => (
                  <SelectItem key={pattern.id} value={pattern.id}>
                    {pattern.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Timeframe (Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Slider
                value={[timeframe]}
                min={30}
                max={365}
                step={1}
                onValueChange={(value) => setTimeframe(value[0])}
              />
              <span className="w-12 text-center font-medium">{timeframe}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {samplePatterns.find((p) => p.id === selectedPattern)?.name} Pattern
            <Badge className="ml-2">{sampleStocks.find((s) => s.id === selectedStock)?.name}</Badge>
          </CardTitle>
          <CardDescription>{samplePatterns.find((p) => p.id === selectedPattern)?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full bg-slate-50 rounded-md overflow-hidden">
            <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
          </div>
        </CardContent>
      </Card>

      <div className="bg-slate-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Pattern Characteristics</h3>
        <p className="text-sm text-slate-700">
          {selectedPattern === "accumulation" &&
            "Accumulation occurs when smart money is buying from retail traders. Look for decreasing volume during downtrends, followed by sideways movement with increased volume on up days."}
          {selectedPattern === "distribution" &&
            "Distribution occurs when smart money is selling to retail traders. Look for increasing volume during uptrends, followed by sideways movement with increased volume on down days."}
          {selectedPattern === "spring" &&
            "A spring is a price movement below support that quickly reverses, trapping sellers. It's often accompanied by lower volume and is a sign that smart money is absorbing selling pressure."}
          {selectedPattern === "upthrust" &&
            "An upthrust is a price movement above resistance that quickly reverses, trapping buyers. It's often accompanied by higher volume and is a sign that smart money is distributing shares."}
          {selectedPattern === "secondary_test" &&
            "A secondary test occurs when price revisits a previous support or resistance level with lower volume. It confirms the strength of the level and often precedes a significant move."}
        </p>
      </div>
    </div>
  )
}
