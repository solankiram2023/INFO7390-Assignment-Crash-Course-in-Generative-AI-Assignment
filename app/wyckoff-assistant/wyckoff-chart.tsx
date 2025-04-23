"use client"

import { useEffect, useRef, useState } from "react"

interface WyckoffChartProps {
  chartType: string
}

interface ChartConfig {
  data: any[]
  annotations?: AnnotationConfig[]
  timeRange?: {
    from: number
    to: number
  }
}

interface AnnotationConfig {
  position: "above" | "below"
  time: number
  text: string
  color: string
  shape?: string
}

export function WyckoffChart({ chartType }: WyckoffChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Update the script loading to use a more reliable version of the library

  // Load the Lightweight Charts library directly in the component
  useEffect(() => {
    // Check if the script is already loaded
    if (typeof window !== "undefined" && window.LightweightCharts) {
      setScriptLoaded(true)
      setLoading(false)
      return
    }

    // Create script element
    const script = document.createElement("script")
    script.src = "https://unpkg.com/lightweight-charts@3.8.0/dist/lightweight-charts.standalone.production.js"
    script.async = true
    script.onload = () => {
      console.log("Lightweight Charts library loaded successfully")
      setScriptLoaded(true)
      setLoading(false)
    }
    script.onerror = () => {
      console.error("Failed to load Lightweight Charts library")
      setError("Failed to load chart library. Please refresh the page and try again.")
      setLoading(false)
    }

    // Add script to document
    document.body.appendChild(script)

    // Cleanup
    return () => {
      // Only remove the script if we added it
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  // Update the chart initialization code to properly handle the LightweightCharts library

  // Initialize chart after script is loaded
  useEffect(() => {
    if (!scriptLoaded || !chartContainerRef.current || typeof window === "undefined") return

    // Clean up any existing chart
    if (chartRef.current) {
      chartRef.current.remove()
      chartRef.current = null
    }

    try {
      // Check if LightweightCharts is available
      if (typeof window.LightweightCharts === "undefined") {
        throw new Error("LightweightCharts library not found even though script was loaded")
      }

      console.log("Creating chart with LightweightCharts:", window.LightweightCharts)

      // Create chart using the global LightweightCharts object
      const chart = window.LightweightCharts.createChart(chartContainerRef.current, {
        layout: {
          background: { type: "solid", color: "#FFFFFF" },
          textColor: "#333333",
        },
        grid: {
          vertLines: { color: "#F0F3FA" },
          horzLines: { color: "#F0F3FA" },
        },
        width: chartContainerRef.current.clientWidth,
        height: 400,
      })

      chartRef.current = chart

      // Add price scale padding
      chart.priceScale("right").applyOptions({
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      })

      // Get chart configuration based on chart type
      const chartConfig = getChartConfig(chartType)

      // Create candlestick series - using the correct API based on the library version
      const candlestickSeries = chart.addCandlestickSeries
        ? chart.addCandlestickSeries({
            upColor: "#4CAF50",
            downColor: "#F44336",
            borderVisible: false,
            wickUpColor: "#4CAF50",
            wickDownColor: "#F44336",
          })
        : // Fallback for newer versions of the library
          chart.addSeries("candlestick", {
            upColor: "#4CAF50",
            downColor: "#F44336",
            borderVisible: false,
            wickUpColor: "#4CAF50",
            wickDownColor: "#F44336",
          })

      // Add data
      candlestickSeries.setData(chartConfig.data)

      // Add volume histogram - using the correct API based on the library version
      const volumeSeries = chart.addHistogramSeries
        ? chart.addHistogramSeries({
            color: "#26a69a",
            priceFormat: {
              type: "volume",
            },
            priceScaleId: "volume",
            scaleMargins: {
              top: 0.8,
              bottom: 0,
            },
          })
        : // Fallback for newer versions of the library
          chart.addSeries("histogram", {
            color: "#26a69a",
            priceFormat: {
              type: "volume",
            },
            priceScaleId: "volume",
            scaleMargins: {
              top: 0.8,
              bottom: 0,
            },
          })

      // Add volume data
      volumeSeries.setData(
        chartConfig.data.map((item) => ({
          time: item.time,
          value: item.volume || 0,
          color: item.close > item.open ? "rgba(76, 175, 80, 0.5)" : "rgba(244, 67, 54, 0.5)",
        })),
      )

      // Add annotations if available
      if (chartConfig.annotations && chartConfig.annotations.length > 0) {
        candlestickSeries.setMarkers(
          chartConfig.annotations.map((annotation) => ({
            time: annotation.time,
            position: annotation.position,
            color: annotation.color,
            shape: annotation.shape || "circle",
            text: annotation.text,
          })),
        )
      }

      // Set visible range if specified
      if (chartConfig.timeRange) {
        chart.timeScale().setVisibleRange(chartConfig.timeRange)
      }

      // Fit content
      chart.timeScale().fitContent()

      // Handle resize
      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
          })
        }
      }

      window.addEventListener("resize", handleResize)

      return () => {
        window.removeEventListener("resize", handleResize)
        if (chartRef.current) {
          chartRef.current.remove()
          chartRef.current = null
        }
      }
    } catch (err: any) {
      console.error("Error setting up chart:", err)
      setError(err.message || "Failed to create chart")
    }
  }, [chartType, scriptLoaded])

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="font-medium text-lg text-slate-800 mb-3">{getChartTitle(chartType)}</h3>
      <div
        ref={chartContainerRef}
        className="flex-1 min-h-[400px] bg-white border border-slate-200 rounded-lg relative"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-600">Loading chart library...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="text-center p-6 max-w-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-500 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-red-600 mb-2">Chart Error</h3>
              <p className="text-slate-700 mb-4">{error}</p>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Add this TypeScript declaration to make TypeScript happy with the global LightweightCharts object
declare global {
  interface Window {
    LightweightCharts: any
  }
}

function getChartTitle(chartType: string): string {
  switch (chartType) {
    case "wyckoff-overview":
      return "Wyckoff Market Cycle Overview"
    case "accumulation":
      return "Wyckoff Accumulation Phase Example"
    case "distribution":
      return "Wyckoff Distribution Phase Example"
    case "spring":
      return "Wyckoff Spring Pattern Example"
    case "upthrust":
      return "Wyckoff Upthrust Pattern Example"
    case "wyckoff-range":
      return "Wyckoff Trading Range Example"
    default:
      return "Wyckoff Chart Example"
  }
}

// The rest of the code (getChartConfig and all the data generation functions) remains the same
function getChartConfig(chartType: string): ChartConfig {
  switch (chartType) {
    case "accumulation":
      return generateAccumulationPhaseData()
    case "distribution":
      return generateDistributionPhaseData()
    case "spring":
      return generateSpringPatternData()
    case "upthrust":
      return generateUpthrustPatternData()
    case "wyckoff-range":
      return generateWyckoffRangeData()
    case "wyckoff-overview":
    default:
      return generateWyckoffOverviewData()
  }
}

// Update the generateWyckoffOverviewData function to create more distinct and visible market cycles

function generateWyckoffOverviewData(): ChartConfig {
  const baseData = []
  let price = 100
  const numBars = 200

  // Generate four phases: markdown, accumulation, markup, distribution
  for (let i = 0; i < numBars; i++) {
    let change = 0
    let volumeMultiplier = 1

    // Phase 1: Markdown (bars 0-49)
    if (i < 50) {
      // More pronounced downtrend
      change = -0.5 + Math.random() * 0.2
      volumeMultiplier = 1.2 + Math.random() * 0.8

      // Accelerating downtrend near the end
      if (i > 40) {
        change = -0.7 + Math.random() * 0.3
        volumeMultiplier = 1.5 + Math.random() * 1.0
      }
    }
    // Phase 2: Accumulation (bars 50-99)
    else if (i < 100) {
      // Sideways movement with slight volatility
      change = -0.2 + Math.random() * 0.4
      volumeMultiplier = 0.7 + Math.random() * 0.6

      // Add spring pattern in the middle of accumulation
      if (i === 75) {
        change = -1.0 + Math.random() * 0.3
        volumeMultiplier = 2.0 + Math.random() * 0.5
      } else if (i === 76) {
        change = 1.2 + Math.random() * 0.3
        volumeMultiplier = 2.2 + Math.random() * 0.5
      }
    }
    // Phase 3: Markup (bars 100-149)
    else if (i < 150) {
      // Strong uptrend
      change = 0.5 + Math.random() * 0.3
      volumeMultiplier = 1.5 + Math.random() * 0.8

      // Accelerating uptrend
      if (i > 130) {
        change = 0.7 + Math.random() * 0.4
        volumeMultiplier = 1.8 + Math.random() * 1.0
      }
    }
    // Phase 4: Distribution (bars 150-199)
    else {
      // Sideways movement with slight volatility
      change = -0.3 + Math.random() * 0.6
      volumeMultiplier = 0.8 + Math.random() * 0.7

      // Add upthrust in the middle of distribution
      if (i === 175) {
        change = 1.0 + Math.random() * 0.3
        volumeMultiplier = 2.0 + Math.random() * 0.5
      } else if (i === 176) {
        change = -1.2 + Math.random() * 0.3
        volumeMultiplier = 2.2 + Math.random() * 0.5
      }
    }

    // Apply change to price (scaled down to make changes more gradual)
    price = Math.max(price * (1 + change / 100), 50)

    // Calculate OHLC values with more realistic ranges
    const open = price * (1 - Math.random() * 0.01)
    const high = price * (1 + Math.random() * 0.015)
    const low = price * (1 - Math.random() * 0.015)
    const close = price

    baseData.push({
      time: i,
      open: open,
      high: high,
      low: low,
      close: close,
      volume: Math.round(1000 * volumeMultiplier),
    })
  }

  return {
    data: baseData,
    annotations: [
      { position: "below", time: 25, text: "Markdown", color: "#F44336" },
      { position: "below", time: 75, text: "Accumulation", color: "#2196F3" },
      { position: "above", time: 125, text: "Markup", color: "#4CAF50" },
      { position: "above", time: 175, text: "Distribution", color: "#FF9800" },
    ],
    // Set a specific time range to focus on the important parts of the chart
    timeRange: {
      from: 0,
      to: 199,
    },
  }
}

// Generate sample data for accumulation phase
function generateAccumulationPhaseData(): ChartConfig {
  const baseData = []
  let price = 150
  const numBars = 80

  // Prior downtrend (bars 0-19)
  for (let i = 0; i < 20; i++) {
    price = price * (1 - (0.01 + Math.random() * 0.01))

    baseData.push({
      time: i,
      open: price * (1 + Math.random() * 0.01),
      high: price * (1 + Math.random() * 0.015),
      low: price * (1 - Math.random() * 0.01),
      close: price,
      volume: Math.round(1000 * (1 + Math.random() * 0.5)),
    })
  }

  // Selling climax (bars 20-21)
  price = price * 0.92
  baseData.push({
    time: 20,
    open: price * 1.03,
    high: price * 1.03,
    low: price * 0.97,
    close: price,
    volume: Math.round(1000 * 3),
  })

  // Automatic rally (bars 22-25)
  for (let i = 22; i < 26; i++) {
    price = price * (1 + (0.01 + Math.random() * 0.01))

    baseData.push({
      time: i,
      open: price * (1 - Math.random() * 0.01),
      high: price * (1 + Math.random() * 0.01),
      low: price * (1 - Math.random() * 0.01),
      close: price,
      volume: Math.round(1000 * (1 + Math.random() * 0.5)),
    })
  }

  // Secondary test (bars 26-28)
  for (let i = 26; i < 29; i++) {
    price = price * (1 - (0.005 + Math.random() * 0.01))

    baseData.push({
      time: i,
      open: price * (1 + Math.random() * 0.01),
      high: price * (1 + Math.random() * 0.01),
      low: price * (1 - Math.random() * 0.015),
      close: price,
      volume: Math.round(1000 * (0.7 + Math.random() * 0.5)),
    })
  }

  // Accumulation (bars 29-59)
  const supportPrice = price * 0.98
  const resistancePrice = price * 1.06

  for (let i = 29; i < 60; i++) {
    // Spring at bar 45
    if (i === 45) {
      price = supportPrice * 0.97
      baseData.push({
        time: i,
        open: price * 1.02,
        high: price * 1.02,
        low: price,
        close: price * 1.01,
        volume: Math.round(1000 * 2.5),
      })
      continue
    }

    // Recovery after spring
    if (i > 45 && i < 50) {
      price = price * (1 + (0.01 + Math.random() * 0.01))
      baseData.push({
        time: i,
        open: price * (1 - Math.random() * 0.01),
        high: price * (1 + Math.random() * 0.01),
        low: price * (1 - Math.random() * 0.01),
        close: price,
        volume: Math.round(1000 * (1.5 + Math.random() * 0.5)),
      })
      continue
    }

    // Sign of strength at bar 56
    if (i === 56) {
      price = resistancePrice * 1.02
      baseData.push({
        time: i,
        open: price * 0.98,
        high: price,
        low: price * 0.98,
        close: price,
        volume: Math.round(1000 * 2),
      })
      continue
    }

    // Last point of support at bar 58
    if (i === 58) {
      price = price * 0.98
      baseData.push({
        time: i,
        open: price * 1.01,
        high: price * 1.01,
        low: price,
        close: price * 1.01,
        volume: Math.round(1000 * 1.3),
      })
      continue
    }

    // Regular accumulation bars
    const isNearSupport = Math.random() > 0.7
    const isNearResistance = Math.random() > 0.7

    if (isNearSupport) {
      price = supportPrice * (1 + Math.random() * 0.02)
    } else if (isNearResistance) {
      price = resistancePrice * (1 - Math.random() * 0.02)
    } else {
      price = supportPrice + Math.random() * (resistancePrice - supportPrice)
    }

    baseData.push({
      time: i,
      open: price * (1 + (Math.random() - 0.5) * 0.01),
      high: price * (1 + Math.random() * 0.01),
      low: price * (1 - Math.random() * 0.01),
      close: price * (1 + (Math.random() - 0.5) * 0.01),
      volume: Math.round(1000 * (0.7 + Math.random() * 0.6)),
    })
  }

  // Markup beginning (bars 60-79)
  for (let i = 60; i < 80; i++) {
    price = price * (1 + (0.005 + Math.random() * 0.01))

    baseData.push({
      time: i,
      open: price * (1 - Math.random() * 0.01),
      high: price * (1 + Math.random() * 0.01),
      low: price * (1 - Math.random() * 0.01),
      close: price,
      volume: Math.round(1000 * (1.2 + Math.random() * 0.8)),
    })
  }

  return {
    data: baseData,
    annotations: [
      { position: "above", time: 10, text: "Downtrend", color: "#F44336" },
      { position: "below", time: 20, text: "Selling Climax", color: "#F44336", shape: "square" },
      { position: "above", time: 23, text: "Automatic Rally", color: "#2196F3" },
      { position: "below", time: 27, text: "Secondary Test", color: "#FF9800" },
      { position: "below", time: 45, text: "Spring", color: "#4CAF50", shape: "arrowUp" },
      { position: "above", time: 56, text: "Sign of Strength", color: "#4CAF50" },
      { position: "below", time: 58, text: "Last Point of Support", color: "#2196F3" },
      { position: "above", time: 70, text: "Markup", color: "#4CAF50" },
    ],
    timeRange: {
      from: 0,
      to: 79,
    },
  }
}

// Generate sample data for distribution phase
function generateDistributionPhaseData(): ChartConfig {
  const baseData = []
  let price = 100
  const numBars = 80

  // Prior uptrend (bars 0-19)
  for (let i = 0; i < 20; i++) {
    price = price * (1 + (0.01 + Math.random() * 0.01))

    baseData.push({
      time: i,
      open: price * (1 - Math.random() * 0.01),
      high: price * (1 + Math.random() * 0.01),
      low: price * (1 - Math.random() * 0.01),
      close: price,
      volume: Math.round(1000 * (1 + Math.random() * 0.5)),
    })
  }

  // Buying climax (bars 20-21)
  price = price * 1.08
  baseData.push({
    time: 20,
    open: price * 0.97,
    high: price,
    low: price * 0.97,
    close: price,
    volume: Math.round(1000 * 3),
  })

  // Automatic reaction (bars 22-25)
  for (let i = 22; i < 26; i++) {
    price = price * (1 - (0.01 + Math.random() * 0.01))

    baseData.push({
      time: i,
      open: price * (1 + Math.random() * 0.01),
      high: price * (1 + Math.random() * 0.01),
      low: price * (1 - Math.random() * 0.01),
      close: price,
      volume: Math.round(1000 * (1 + Math.random() * 0.5)),
    })
  }

  // Secondary test (bars 26-28)
  for (let i = 26; i < 29; i++) {
    price = price * (1 + (0.005 + Math.random() * 0.01))

    baseData.push({
      time: i,
      open: price * (1 - Math.random() * 0.01),
      high: price * (1 + Math.random() * 0.015),
      low: price * (1 - Math.random() * 0.01),
      close: price,
      volume: Math.round(1000 * (0.7 + Math.random() * 0.5)),
    })
  }

  // Distribution (bars 29-59)
  const supportPrice = price * 0.94
  const resistancePrice = price * 1.02

  for (let i = 29; i < 60; i++) {
    // Upthrust at bar 45
    if (i === 45) {
      price = resistancePrice * 1.03
      baseData.push({
        time: i,
        open: price * 0.98,
        high: price,
        low: price * 0.98,
        close: price * 0.99,
        volume: Math.round(1000 * 2.5),
      })
      continue
    }

    // Decline after upthrust
    if (i > 45 && i < 50) {
      price = price * (1 - (0.01 + Math.random() * 0.01))
      baseData.push({
        time: i,
        open: price * (1 + Math.random() * 0.01),
        high: price * (1 + Math.random() * 0.01),
        low: price * (1 - Math.random() * 0.01),
        close: price,
        volume: Math.round(1000 * (1.5 + Math.random() * 0.5)),
      })
      continue
    }

    // Sign of weakness at bar 56
    if (i === 56) {
      price = supportPrice * 0.98
      baseData.push({
        time: i,
        open: price * 1.02,
        high: price * 1.02,
        low: price,
        close: price,
        volume: Math.round(1000 * 2),
      })
      continue
    }

    // Last point of supply at bar 58
    if (i === 58) {
      price = price * 1.02
      baseData.push({
        time: i,
        open: price * 0.99,
        high: price,
        low: price * 0.99,
        close: price * 0.99,
        volume: Math.round(1000 * 1.3),
      })
      continue
    }

    // Regular distribution bars
    const isNearSupport = Math.random() > 0.7
    const isNearResistance = Math.random() > 0.7

    if (isNearSupport) {
      price = supportPrice * (1 + Math.random() * 0.02)
    } else if (isNearResistance) {
      price = resistancePrice * (1 - Math.random() * 0.02)
    } else {
      price = supportPrice + Math.random() * (resistancePrice - supportPrice)
    }

    baseData.push({
      time: i,
      open: price * (1 + (Math.random() - 0.5) * 0.01),
      high: price * (1 + Math.random() * 0.01),
      low: price * (1 - Math.random() * 0.01),
      close: price * (1 + (Math.random() - 0.5) * 0.01),
      volume: Math.round(1000 * (0.7 + Math.random() * 0.6)),
    })
  }

  // Markdown beginning (bars 60-79)
  for (let i = 60; i < 80; i++) {
    price = price * (1 - (0.005 + Math.random() * 0.01))

    baseData.push({
      time: i,
      open: price * (1 + Math.random() * 0.01),
      high: price * (1 + Math.random() * 0.01),
      low: price * (1 - Math.random() * 0.01),
      close: price,
      volume: Math.round(1000 * (1.2 + Math.random() * 0.8)),
    })
  }

  return {
    data: baseData,
    annotations: [
      { position: "above", time: 10, text: "Uptrend", color: "#4CAF50" },
      { position: "above", time: 20, text: "Buying Climax", color: "#4CAF50", shape: "square" },
      { position: "below", time: 23, text: "Automatic Reaction", color: "#F44336" },
      { position: "above", time: 27, text: "Secondary Test", color: "#FF9800" },
      { position: "above", time: 45, text: "Upthrust", color: "#F44336", shape: "arrowDown" },
      { position: "below", time: 56, text: "Sign of Weakness", color: "#F44336" },
      { position: "above", time: 58, text: "Last Point of Supply", color: "#FF9800" },
      { position: "below", time: 70, text: "Markdown", color: "#F44336" },
    ],
    timeRange: {
      from: 0,
      to: 79,
    },
  }
}

// Generate sample data for spring pattern
function generateSpringPatternData(): ChartConfig {
  const baseData = []
  let price = 120
  const numBars = 60

  // Bars leading to the trading range (0-9)
  for (let i = 0; i < 10; i++) {
    price = price * (1 - (0.005 + Math.random() * 0.005))

    baseData.push({
      time: i,
      open: price * (1 + Math.random() * 0.01),
      high: price * (1 + Math.random() * 0.015),
      low: price * (1 - Math.random() * 0.01),
      close: price,
      volume: Math.round(1000 * (1 + Math.random() * 0.5)),
    })
  }

  // Trading range (10-39)
  const supportPrice = price * 0.98
  const resistancePrice = price * 1.04

  for (let i = 10; i < 40; i++) {
    // Spring at bar 30
    if (i === 30) {
      price = supportPrice * 0.96
      baseData.push({
        time: i,
        open: supportPrice * 1.005,
        high: supportPrice * 1.005,
        low: price,
        close: supportPrice * 1.01,
        volume: Math.round(1000 * 2.5),
      })
      continue
    }

    // Bars after spring
    if (i > 30 && i < 35) {
      price = price * (1 + (0.008 + Math.random() * 0.005))

      baseData.push({
        time: i,
        open: price * (1 - Math.random() * 0.01),
        high: price * (1 + Math.random() * 0.01),
        low: price * (1 - Math.random() * 0.005),
        close: price,
        volume: Math.round(1000 * (1.2 + Math.random() * 0.5)),
      })
      continue
    }

    // Test of the spring
    if (i === 38) {
      price = supportPrice * 1.01
      baseData.push({
        time: i,
        open: price * 1.01,
        high: price * 1.01,
        low: price * 0.99,
        close: price * 1.02,
        volume: Math.round(1000 * 1.5),
      })
      continue
    }

    // Regular trading range bars
    const isNearSupport = Math.random() > 0.7
    const isNearResistance = Math.random() > 0.7

    if (isNearSupport) {
      price = supportPrice * (1 + Math.random() * 0.01)
    } else if (isNearResistance) {
      price = resistancePrice * (1 - Math.random() * 0.01)
    } else {
      price = supportPrice + Math.random() * (resistancePrice - supportPrice)
    }

    baseData.push({
      time: i,
      open: price * (1 + (Math.random() - 0.5) * 0.01),
      high: Math.max(price * (1 + Math.random() * 0.01), price * (1 + (Math.random() - 0.5) * 0.01)),
      low: Math.min(price * (1 - Math.random() * 0.01), price * (1 + (Math.random() - 0.5) * 0.01)),
      close: price * (1 + (Math.random() - 0.5) * 0.01),
      volume: Math.round(1000 * (0.7 + Math.random() * 0.6)),
    })
  }

  // Markup after successful test (40-59)
  for (let i = 40; i < 60; i++) {
    price = price * (1 + (0.005 + Math.random() * 0.005))

    baseData.push({
      time: i,
      open: price * (1 - Math.random() * 0.01),
      high: price * (1 + Math.random() * 0.01),
      low: price * (1 - Math.random() * 0.01),
      close: price,
      volume: Math.round(1000 * (1 + Math.random() * 0.7)),
    })
  }

  return {
    data: baseData,
    annotations: [
      { position: "below", time: 15, text: "Trading Range", color: "#2196F3" },
      { position: "below", time: 30, text: "Spring", color: "#4CAF50", shape: "arrowUp" },
      { position: "below", time: 38, text: "Secondary Test", color: "#2196F3" },
      { position: "above", time: 50, text: "Markup Phase", color: "#4CAF50" },
    ],
    timeRange: {
      from: 5,
      to: 59,
    },
  }
}

// Generate sample data for upthrust pattern
function generateUpthrustPatternData(): ChartConfig {
  const baseData = []
  let price = 120
  const numBars = 60

  // Bars leading to the trading range (0-9)
  for (let i = 0; i < 10; i++) {
    price = price * (1 + (0.005 + Math.random() * 0.005))

    baseData.push({
      time: i,
      open: price * (1 - Math.random() * 0.01),
      high: price * (1 + Math.random() * 0.01),
      low: price * (1 - Math.random() * 0.01),
      close: price,
      volume: Math.round(1000 * (1 + Math.random() * 0.5)),
    })
  }

  // Trading range (10-39)
  const supportPrice = price * 0.96
  const resistancePrice = price * 1.02

  for (let i = 10; i < 40; i++) {
    // Upthrust at bar 30
    if (i === 30) {
      price = resistancePrice * 1.04
      baseData.push({
        time: i,
        open: resistancePrice * 0.995,
        high: price,
        low: resistancePrice * 0.995,
        close: resistancePrice * 0.99,
        volume: Math.round(1000 * 2.5),
      })
      continue
    }

    // Bars after upthrust
    if (i > 30 && i < 35) {
      price = price * (1 - (0.008 + Math.random() * 0.005))
      baseData.push({
        time: i,
        open: price * (1 + Math.random() * 0.01),
        high: price * (1 + Math.random() * 0.005),
        low: price * (1 - Math.random() * 0.01),
        close: price,
        volume: Math.round(1000 * (1.2 + Math.random() * 0.5)),
      })
      continue
    }

    // Test of the upthrust
    if (i === 38) {
      price = resistancePrice * 0.99
      baseData.push({
        time: i,
        open: price * 0.99,
        high: price * 1.01,
        low: price * 0.99,
        close: price * 0.98,
        volume: Math.round(1000 * 1.5),
      })
      continue
    }

    // Regular trading range bars
    const isNearSupport = Math.random() > 0.7
    const isNearResistance = Math.random() > 0.7

    if (isNearSupport) {
      price = supportPrice * (1 + Math.random() * 0.01)
    } else if (isNearResistance) {
      price = resistancePrice * (1 - Math.random() * 0.01)
    } else {
      price = supportPrice + Math.random() * (resistancePrice - supportPrice)
    }

    baseData.push({
      time: i,
      open: price * (1 + (Math.random() - 0.5) * 0.01),
      high: Math.max(price * (1 + Math.random() * 0.01), price * (1 + (Math.random() - 0.5) * 0.01)),
      low: Math.min(price * (1 - Math.random() * 0.01), price * (1 + (Math.random() - 0.5) * 0.01)),
      close: price * (1 + (Math.random() - 0.5) * 0.01),
      volume: Math.round(1000 * (0.7 + Math.random() * 0.6)),
    })
  }

  // Markdown after successful test (40-59)
  for (let i = 40; i < 60; i++) {
    price = price * (1 - (0.005 + Math.random() * 0.005))

    baseData.push({
      time: i,
      open: price * (1 + Math.random() * 0.01),
      high: price * (1 + Math.random() * 0.01),
      low: price * (1 - Math.random() * 0.01),
      close: price,
      volume: Math.round(1000 * (1 + Math.random() * 0.7)),
    })
  }

  return {
    data: baseData,
    annotations: [
      { position: "above", time: 15, text: "Trading Range", color: "#2196F3" },
      { position: "above", time: 30, text: "Upthrust", color: "#F44336", shape: "arrowDown" },
      { position: "above", time: 38, text: "Secondary Test", color: "#FF9800" },
      { position: "below", time: 50, text: "Markdown Phase", color: "#F44336" },
    ],
    timeRange: {
      from: 5,
      to: 59,
    },
  }
}

// Generate sample data for Wyckoff trading range
function generateWyckoffRangeData(): ChartConfig {
  const baseData = []
  let price = 100
  const numBars = 80

  // Prior trend (bars 0-19)
  for (let i = 0; i < 20; i++) {
    price = price * (1 - (0.01 + Math.random() * 0.005))

    baseData.push({
      time: i,
      open: price * (1 + Math.random() * 0.01),
      high: price * (1 + Math.random() * 0.015),
      low: price * (1 - Math.random() * 0.01),
      close: price,
      volume: Math.round(1000 * (1 + Math.random() * 0.5)),
    })
  }

  // Preliminary support (bar 20)
  price = price * 1.03
  baseData.push({
    time: 20,
    open: price * 0.97,
    high: price,
    low: price * 0.97,
    close: price,
    volume: Math.round(1000 * 1.7),
  })

  // Selling climax (bar 25)
  price = price * 0.94
  baseData.push({
    time: 25,
    open: price * 1.04,
    high: price * 1.04,
    low: price,
    close: price * 1.01,
    volume: Math.round(1000 * 3),
  })

  // Automatic rally (bars 26-30)
  for (let i = 26; i < 31; i++) {
    price = price * (1 + (0.01 + Math.random() * 0.005))

    baseData.push({
      time: i,
      open: price * (1 - Math.random() * 0.01),
      high: price * (1 + Math.random() * 0.01),
      low: price * (1 - Math.random() * 0.01),
      close: price,
      volume: Math.round(1000 * (1.2 + Math.random() * 0.5)),
    })
  }

  // Secondary test (bars 31-35)
  for (let i = 31; i < 36; i++) {
    price = price * (1 - (0.005 + Math.random() * 0.005))

    baseData.push({
      time: i,
      open: price * (1 + Math.random() * 0.01),
      high: price * (1 + Math.random() * 0.01),
      low: price * (1 - Math.random() * 0.015),
      close: price,
      volume: Math.round(1000 * (0.8 + Math.random() * 0.4)),
    })
  }

  // Trading range (bars 36-69)
  const supportPrice = price * 0.97
  const resistancePrice = price * 1.06

  for (let i = 36; i < 70; i++) {
    // Spring at bar 50
    if (i === 50) {
      price = supportPrice * 0.96
      baseData.push({
        time: i,
        open: supportPrice * 1.005,
        high: supportPrice * 1.005,
        low: price,
        close: supportPrice * 1.01,
        volume: Math.round(1000 * 2.2),
      })
      continue
    }

    // Test of spring at bar 55
    if (i === 55) {
      price = supportPrice * 1.01
      baseData.push({
        time: i,
        open: price * 0.99,
        high: price * 1.02,
        low: price * 0.99,
        close: price * 1.02,
        volume: Math.round(1000 * 1.6),
      })
      continue
    }

    // Sign of strength at bar 60
    if (i === 60) {
      price = price * 1.04
      baseData.push({
        time: i,
        open: price * 0.98,
        high: price,
        low: price * 0.98,
        close: price,
        volume: Math.round(1000 * 2.1),
      })
      continue
    }

    // Last point of support at bar 65
    if (i === 65) {
      price = price * 0.99
      baseData.push({
        time: i,
        open: price * 1.01,
        high: price * 1.01,
        low: price * 0.99,
        close: price * 1.01,
        volume: Math.round(1000 * 1.4),
      })
      continue
    }

    // Regular trading range bars
    const isNearSupport = Math.random() > 0.7
    const isNearResistance = Math.random() > 0.7

    if (isNearSupport) {
      price = supportPrice * (1 + Math.random() * 0.02)
    } else if (isNearResistance) {
      price = resistancePrice * (1 - Math.random() * 0.02)
    } else {
      price = supportPrice + Math.random() * (resistancePrice - supportPrice)
    }

    baseData.push({
      time: i,
      open: price * (1 + (Math.random() - 0.5) * 0.01),
      high: price * (1 + Math.random() * 0.01),
      low: price * (1 - Math.random() * 0.01),
      close: price * (1 + (Math.random() - 0.5) * 0.01),
      volume: Math.round(1000 * (0.7 + Math.random() * 0.6)),
    })
  }

  // Markup beginning (bars 70-79)
  for (let i = 70; i < 80; i++) {
    price = price * (1 + (0.01 + Math.random() * 0.005))

    baseData.push({
      time: i,
      open: price * (1 - Math.random() * 0.01),
      high: price * (1 + Math.random() * 0.01),
      low: price * (1 - Math.random() * 0.01),
      close: price,
      volume: Math.round(1000 * (1.3 + Math.random() * 0.7)),
    })
  }

  return {
    data: baseData,
    annotations: [
      { position: "below", time: 20, text: "PS", color: "#FF9800" },
      { position: "below", time: 25, text: "SC", color: "#F44336", shape: "square" },
      { position: "above", time: 28, text: "AR", color: "#2196F3" },
      { position: "below", time: 33, text: "ST", color: "#FF9800" },
      { position: "below", time: 50, text: "Spring", color: "#4CAF50", shape: "arrowUp" },
      { position: "below", time: 55, text: "Test", color: "#2196F3" },
      { position: "above", time: 60, text: "SOS", color: "#4CAF50" },
      { position: "below", time: 65, text: "LPS", color: "#2196F3" },
      { position: "above", time: 75, text: "Markup", color: "#4CAF50" },
    ],
    timeRange: {
      from: 10,
      to: 79,
    },
  }
}
