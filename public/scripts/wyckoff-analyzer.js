// Remove the ES module import at the top
// import { LightweightCharts } from "lightweight-charts"

// Declare LightweightCharts as a global variable
const LightweightCharts = window.LightweightCharts

document.addEventListener("DOMContentLoaded", () => {
  // Initialize UI components
  initializeTabs()
  initializeChartComponent()
  setupEventListeners()

  // Show no data message initially
  document.getElementById("no-data-message").style.display = "block"
  document.getElementById("results-content").style.display = "none"
  document.getElementById("loading-indicator").style.display = "none"
})

// Initialize tab functionality
function initializeTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabName = btn.getAttribute("data-tab")

      // Update active tab button
      tabBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      // Show selected tab content
      tabContents.forEach((content) => {
        content.classList.remove("active")
        if (content.id === `${tabName}-tab`) {
          content.classList.add("active")
        }
      })
    })
  })
}

// Set up event listeners for buttons
function setupEventListeners() {
  // Load sample data button
  const loadSampleBtn = document.getElementById("load-sample-btn")
  if (loadSampleBtn) {
    loadSampleBtn.addEventListener("click", () => {
      const stock = document.getElementById("stock-select").value
      const timeframe = document.getElementById("timeframe-select").value
      loadSampleData(stock, timeframe)
    })
  }

  // Upload button
  const uploadBtn = document.getElementById("upload-btn")
  if (uploadBtn) {
    uploadBtn.addEventListener("click", () => {
      const fileInput = document.getElementById("file-upload")
      if (fileInput.files.length > 0) {
        uploadAndProcessFile(fileInput.files[0])
      } else {
        alert("Please select a file to upload")
      }
    })
  }

  // Analyze button
  const analyzeBtn = document.getElementById("analyze-btn")
  if (analyzeBtn) {
    analyzeBtn.addEventListener("click", () => {
      analyzeCurrentData()
    })
  }

  // Confidence threshold slider
  const confidenceSlider = document.getElementById("confidence-threshold")
  const confidenceValue = document.getElementById("confidence-value")
  if (confidenceSlider && confidenceValue) {
    confidenceSlider.addEventListener("input", () => {
      confidenceValue.textContent = `${confidenceSlider.value}%`
    })
  }

  // Pattern visibility checkboxes
  const patternCheckboxes = ["show-accumulation", "show-distribution", "show-spring", "show-upthrust"]
  patternCheckboxes.forEach((id) => {
    const checkbox = document.getElementById(id)
    if (checkbox) {
      checkbox.addEventListener("change", updatePatternVisibility)
    }
  })
}

// Chart variables
let chart = null
let candlestickSeries = null
let volumeSeries = null
let patternMarkers = {
  accumulation: [],
  distribution: [],
  spring: [],
  upthrust: [],
}
let currentData = null
let detectedPatterns = []

// Initialize the chart component
function initializeChartComponent() {
  const chartContainer = document.getElementById("chart")
  if (!chartContainer || typeof LightweightCharts === "undefined") {
    console.error("Chart container not found or LightweightCharts not loaded")
    return
  }

  // Create chart
  chart = LightweightCharts.createChart(chartContainer, {
    width: chartContainer.clientWidth,
    height: 500,
    layout: {
      background: { color: "#ffffff" },
      textColor: "#333333",
    },
    grid: {
      vertLines: { color: "#f0f3fa" },
      horzLines: { color: "#f0f3fa" },
    },
    crosshair: {
      mode: LightweightCharts.CrosshairMode.Normal,
    },
    rightPriceScale: {
      borderColor: "#d1d4dc",
    },
    timeScale: {
      borderColor: "#d1d4dc",
      timeVisible: true,
    },
  })

  // Create candlestick series
  candlestickSeries = chart.addCandlestickSeries({
    upColor: "#10b981",
    downColor: "#ef4444",
    borderVisible: false,
    wickUpColor: "#10b981",
    wickDownColor: "#ef4444",
  })

  // Create volume series
  const volumePanel = chart.addHistogramSeries({
    color: "#64748b",
    priceFormat: {
      type: "volume",
    },
    priceScaleId: "volume",
    scaleMargins: {
      top: 0.8,
      bottom: 0,
    },
  })
  volumeSeries = volumePanel

  // Handle window resize
  window.addEventListener("resize", () => {
    if (chart) {
      chart.resize(chartContainer.clientWidth, 500)
    }
  })
}

// Load sample data for a given stock and timeframe
function loadSampleData(stock, timeframe) {
  document.getElementById("no-data-message").style.display = "none"
  document.getElementById("results-content").style.display = "none"
  document.getElementById("loading-indicator").style.display = "flex"

  // In a real application, this would fetch data from an API
  // For this demo, we'll generate sample data
  setTimeout(() => {
    const data = generateSampleData(stock, timeframe)
    renderChartData(data)

    document.getElementById("loading-indicator").style.display = "none"
    document.getElementById("results-content").style.display = "grid"

    // Analyze the data automatically
    analyzeCurrentData()
  }, 1000)
}

// Upload and process a file
function uploadAndProcessFile(file) {
  document.getElementById("no-data-message").style.display = "none"
  document.getElementById("results-content").style.display = "none"
  document.getElementById("loading-indicator").style.display = "flex"

  // In a real application, this would parse the file
  // For this demo, we'll simulate processing
  setTimeout(() => {
    // Generate random data as if it came from the file
    const data = generateSampleData("CUSTOM", "1D")
    renderChartData(data)

    document.getElementById("loading-indicator").style.display = "none"
    document.getElementById("results-content").style.display = "grid"

    // Analyze the data automatically
    analyzeCurrentData()
  }, 1500)
}

// Generate sample data for demonstration
function generateSampleData(symbol, timeframe) {
  const data = []
  let basePrice =
    symbol === "AAPL"
      ? 150
      : symbol === "MSFT"
        ? 300
        : symbol === "AMZN"
          ? 120
          : symbol === "GOOGL"
            ? 130
            : symbol === "TSLA"
              ? 200
              : 100

  const volatility = symbol === "TSLA" ? 0.03 : 0.015
  const daysBack = timeframe === "1D" ? 365 : timeframe === "1W" ? 156 : 52

  const msPerDay = 24 * 60 * 60 * 1000
  const msPerCandle = timeframe === "1D" ? msPerDay : timeframe === "1W" ? msPerDay * 7 : msPerDay * 30

  const endDate = new Date()
  let currentDate = new Date(endDate.getTime() - daysBack * msPerDay)

  // Add some patterns
  const patterns = []

  // Add accumulation pattern
  const accumulationStart = Math.floor(daysBack * 0.2)
  const accumulationEnd = Math.floor(daysBack * 0.3)
  patterns.push({
    type: "accumulation",
    start: accumulationStart,
    end: accumulationEnd,
    confidence: 85,
  })

  // Add distribution pattern
  const distributionStart = Math.floor(daysBack * 0.5)
  const distributionEnd = Math.floor(daysBack * 0.6)
  patterns.push({
    type: "distribution",
    start: distributionStart,
    end: distributionEnd,
    confidence: 78,
  })

  // Add spring pattern
  const springIndex = Math.floor(daysBack * 0.75)
  patterns.push({
    type: "spring",
    start: springIndex,
    end: springIndex + 3,
    confidence: 92,
  })

  // Add upthrust pattern
  const upthrustIndex = Math.floor(daysBack * 0.9)
  patterns.push({
    type: "upthrust",
    start: upthrustIndex,
    end: upthrustIndex + 3,
    confidence: 88,
  })

  // Generate price data with patterns
  for (let i = 0; i < daysBack; i++) {
    // Check if we're in a pattern period
    const inAccumulation = i >= accumulationStart && i <= accumulationEnd
    const inDistribution = i >= distributionStart && i <= distributionEnd
    const inSpring = i >= springIndex && i <= springIndex + 3
    const inUpthrust = i >= upthrustIndex && i <= upthrustIndex + 3

    let change = (Math.random() - 0.5) * volatility

    // Modify price movement based on pattern
    if (inAccumulation) {
      if (i === accumulationStart) {
        // Start of accumulation - price has been falling
        change = -0.01
      } else if (i === accumulationEnd) {
        // End of accumulation - price starts to rise
        change = 0.01
      } else {
        // During accumulation - sideways with slight upward bias
        change = (Math.random() - 0.45) * volatility * 0.7
      }
    } else if (inDistribution) {
      if (i === distributionStart) {
        // Start of distribution - price has been rising
        change = 0.01
      } else if (i === distributionEnd) {
        // End of distribution - price starts to fall
        change = -0.01
      } else {
        // During distribution - sideways with slight downward bias
        change = (Math.random() - 0.55) * volatility * 0.7
      }
    } else if (inSpring) {
      if (i === springIndex) {
        // Spring - sharp drop below support
        change = -0.03
      } else if (i === springIndex + 1) {
        // Quick reversal
        change = 0.04
      } else {
        // Follow through
        change = 0.01
      }
    } else if (inUpthrust) {
      if (i === upthrustIndex) {
        // Upthrust - sharp rise above resistance
        change = 0.03
      } else if (i === upthrustIndex + 1) {
        // Quick reversal
        change = -0.04
      } else {
        // Follow through
        change = -0.01
      }
    }

    // Apply change to base price
    basePrice = basePrice * (1 + change)

    // Calculate OHLC values
    const open = basePrice
    const high = open * (1 + Math.random() * volatility * 0.5)
    const low = open * (1 - Math.random() * volatility * 0.5)
    const close = (open + high + low) / 3 + (Math.random() - 0.5) * volatility * basePrice

    // Calculate volume
    let volume = Math.round(1000000 * (0.5 + Math.random()))

    // Adjust volume based on pattern
    if (inAccumulation && Math.random() > 0.5) {
      // Higher volume on up days during accumulation
      if (close > open) volume *= 1.5
    } else if (inDistribution && Math.random() > 0.5) {
      // Higher volume on down days during distribution
      if (close < open) volume *= 1.5
    } else if (inSpring && i === springIndex) {
      // Higher volume on spring day
      volume *= 2
    } else if (inUpthrust && i === upthrustIndex) {
      // Higher volume on upthrust day
      volume *= 2
    }

    // Add candle to data
    data.push({
      time: Math.floor(currentDate.getTime() / 1000),
      open: open,
      high: high,
      low: low,
      close: close,
      volume: volume,
    })

    // Move to next candle
    currentDate = new Date(currentDate.getTime() + msPerCandle)
  }

  return {
    symbol: symbol,
    timeframe: timeframe,
    data: data,
    patterns: patterns,
  }
}

// Render chart data
function renderChartData(data) {
  if (!chart || !candlestickSeries || !volumeSeries) return

  // Store current data
  currentData = data

  // Clear existing data
  clearPatternMarkers()

  // Set candlestick data
  candlestickSeries.setData(data.data)

  // Set volume data
  const volumeData = data.data.map((d) => ({
    time: d.time,
    value: d.volume,
    color: d.close > d.open ? "rgba(16, 185, 129, 0.5)" : "rgba(239, 68, 68, 0.5)",
  }))
  volumeSeries.setData(volumeData)

  // Fit content
  chart.timeScale().fitContent()
}

// Clear pattern markers
function clearPatternMarkers() {
  if (!candlestickSeries) return

  // Remove all markers
  candlestickSeries.setMarkers([])

  // Reset pattern markers
  patternMarkers = {
    accumulation: [],
    distribution: [],
    spring: [],
    upthrust: [],
  }

  // Clear detected patterns
  detectedPatterns = []

  // Clear pattern list
  document.getElementById("pattern-list").innerHTML = ""

  // Show no selection message
  document.querySelector(".no-selection-message").style.display = "block"
}

// Analyze current data for Wyckoff patterns
function analyzeCurrentData() {
  if (!currentData) return

  document.getElementById("loading-indicator").style.display = "flex"

  // In a real application, this would run the transformer model
  // For this demo, we'll use the patterns we generated with the sample data
  setTimeout(() => {
    // Clear existing patterns
    clearPatternMarkers()

    // Process each pattern
    currentData.patterns.forEach((pattern) => {
      const startTime = currentData.data[pattern.start].time
      const endTime = currentData.data[pattern.end].time

      // Create a pattern object
      const patternObj = {
        id: `pattern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: pattern.type,
        startTime: startTime,
        endTime: endTime,
        startIndex: pattern.start,
        endIndex: pattern.end,
        confidence: pattern.confidence,
        explanation: generatePatternExplanation(pattern.type, currentData.data.slice(pattern.start, pattern.end + 1)),
      }

      // Add to detected patterns
      detectedPatterns.push(patternObj)

      // Add to pattern markers
      patternMarkers[pattern.type].push(patternObj)
    })

    // Update pattern visibility
    updatePatternVisibility()

    // Populate pattern list
    populatePatternList()

    document.getElementById("loading-indicator").style.display = "none"
  }, 1000)
}

// Update pattern visibility based on checkboxes
function updatePatternVisibility() {
  if (!candlestickSeries) return

  const showAccumulation = document.getElementById("show-accumulation").checked
  const showDistribution = document.getElementById("show-distribution").checked
  const showSpring = document.getElementById("show-spring").checked
  const showUpthrust = document.getElementById("show-upthrust").checked

  const confidenceThreshold = Number.parseInt(document.getElementById("confidence-threshold").value)

  // Collect visible markers
  const visibleMarkers = []

  // Add accumulation markers
  if (showAccumulation) {
    patternMarkers.accumulation.forEach((pattern) => {
      if (pattern.confidence >= confidenceThreshold) {
        visibleMarkers.push({
          time: pattern.startTime,
          position: "belowBar",
          color: "rgba(16, 185, 129, 0.5)",
          shape: "square",
          text: "Accumulation Start",
        })

        visibleMarkers.push({
          time: pattern.endTime,
          position: "belowBar",
          color: "rgba(16, 185, 129, 0.5)",
          shape: "square",
          text: "Accumulation End",
        })
      }
    })
  }

  // Add distribution markers
  if (showDistribution) {
    patternMarkers.distribution.forEach((pattern) => {
      if (pattern.confidence >= confidenceThreshold) {
        visibleMarkers.push({
          time: pattern.startTime,
          position: "aboveBar",
          color: "rgba(239, 68, 68, 0.5)",
          shape: "square",
          text: "Distribution Start",
        })

        visibleMarkers.push({
          time: pattern.endTime,
          position: "aboveBar",
          color: "rgba(239, 68, 68, 0.5)",
          shape: "square",
          text: "Distribution End",
        })
      }
    })
  }

  // Add spring markers
  if (showSpring) {
    patternMarkers.spring.forEach((pattern) => {
      if (pattern.confidence >= confidenceThreshold) {
        visibleMarkers.push({
          time: pattern.startTime,
          position: "belowBar",
          color: "rgba(139, 92, 246, 0.8)",
          shape: "arrowUp",
          text: "Spring",
        })
      }
    })
  }

  // Add upthrust markers
  if (showUpthrust) {
    patternMarkers.upthrust.forEach((pattern) => {
      if (pattern.confidence >= confidenceThreshold) {
        visibleMarkers.push({
          time: pattern.startTime,
          position: "aboveBar",
          color: "rgba(245, 158, 11, 0.8)",
          shape: "arrowDown",
          text: "Upthrust",
        })
      }
    })
  }

  // Update markers on chart
  candlestickSeries.setMarkers(visibleMarkers)

  // Update pattern list
  populatePatternList()
}

// Populate the pattern list
function populatePatternList() {
  const patternList = document.getElementById("pattern-list")
  patternList.innerHTML = ""

  const confidenceThreshold = Number.parseInt(document.getElementById("confidence-threshold").value)

  // Filter patterns by visibility and confidence
  const visiblePatterns = detectedPatterns.filter((pattern) => {
    const showAccumulation = document.getElementById("show-accumulation").checked
    const showDistribution = document.getElementById("show-distribution").checked
    const showSpring = document.getElementById("show-spring").checked
    const showUpthrust = document.getElementById("show-upthrust").checked

    return (
      pattern.confidence >= confidenceThreshold &&
      ((pattern.type === "accumulation" && showAccumulation) ||
        (pattern.type === "distribution" && showDistribution) ||
        (pattern.type === "spring" && showSpring) ||
        (pattern.type === "upthrust" && showUpthrust))
    )
  })

  // Sort by time
  visiblePatterns.sort((a, b) => b.startTime - a.startTime)

  // Create pattern items
  visiblePatterns.forEach((pattern) => {
    const patternItem = document.createElement("div")
    patternItem.className = "pattern-item"
    patternItem.dataset.patternId = pattern.id

    // Format date
    const date = new Date(pattern.startTime * 1000)
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

    // Create pattern item content
    patternItem.innerHTML = `
      <div class="pattern-icon ${pattern.type}">
        ${pattern.type.charAt(0).toUpperCase()}
      </div>
      <div class="pattern-info">
        <div class="pattern-name">${capitalizeFirstLetter(pattern.type)}</div>
        <div class="pattern-date">${formattedDate}</div>
      </div>
      <div class="pattern-confidence">${pattern.confidence}%</div>
    `

    // Add click event
    patternItem.addEventListener("click", () => {
      // Remove active class from all items
      document.querySelectorAll(".pattern-item").forEach((item) => {
        item.classList.remove("active")
      })

      // Add active class to clicked item
      patternItem.classList.add("active")

      // Show pattern details
      showPatternDetails(pattern)

      // Zoom to pattern on chart
      zoomToPattern(pattern)
    })

    patternList.appendChild(patternItem)
  })

  // Show message if no patterns
  if (visiblePatterns.length === 0) {
    const noPatterns = document.createElement("div")
    noPatterns.className = "no-patterns-message"
    noPatterns.textContent = "No patterns detected with current settings"
    patternList.appendChild(noPatterns)
  }
}

// Show pattern details
function showPatternDetails(pattern) {
  const patternDetails = document.getElementById("pattern-details")

  // Hide no selection message
  document.querySelector(".no-selection-message").style.display = "none"

  // Remove any existing pattern detail content
  const existingContent = patternDetails.querySelector(".pattern-detail-content")
  if (existingContent) {
    existingContent.remove()
  }

  // Create pattern detail content
  const detailContent = document.createElement("div")
  detailContent.className = "pattern-detail-content active"

  // Get pattern color
  const patternColor =
    pattern.type === "accumulation"
      ? "#10b981"
      : pattern.type === "distribution"
        ? "#ef4444"
        : pattern.type === "spring"
          ? "#8b5cf6"
          : "#f59e0b"

  // Create pattern header
  const header = document.createElement("div")
  header.className = "pattern-header"
  header.innerHTML = `
    <div class="pattern-header-icon" style="background-color: ${patternColor}">
      ${pattern.type.charAt(0).toUpperCase()}
    </div>
    <div class="pattern-header-info">
      <h4>${capitalizeFirstLetter(pattern.type)} Pattern</h4>
      <p>Confidence: ${pattern.confidence}%</p>
    </div>
  `

  // Create pattern characteristics
  const characteristics = document.createElement("div")
  characteristics.className = "pattern-characteristics"
  characteristics.innerHTML = `
    <h5>Pattern Characteristics</h5>
    ${generateCharacteristicsHTML(pattern)}
  `

  // Create trading implications
  const implications = document.createElement("div")
  implications.className = "trading-implications"
  implications.innerHTML = `
    <h5>Trading Implications</h5>
    <div class="implication-list">
      ${generateImplicationsHTML(pattern)}
    </div>
  `

  // Add all sections to detail content
  detailContent.appendChild(header)
  detailContent.appendChild(characteristics)
  detailContent.appendChild(implications)

  // Add detail content to pattern details
  patternDetails.appendChild(detailContent)
}

// Zoom to pattern on chart
function zoomToPattern(pattern) {
  if (!chart) return

  // Get data around pattern
  const patternStartIndex = Math.max(0, pattern.startIndex - 10)
  const patternEndIndex = Math.min(currentData.data.length - 1, pattern.endIndex + 10)

  // Get time range
  const fromTime = currentData.data[patternStartIndex].time
  const toTime = currentData.data[patternEndIndex].time

  // Set visible range
  chart.timeScale().setVisibleRange({
    from: fromTime,
    to: toTime,
  })
}

// Generate pattern explanation
function generatePatternExplanation(patternType, data) {
  // Calculate some basic metrics
  const priceChange = (((data[data.length - 1].close - data[0].close) / data[0].close) * 100).toFixed(2)
  const avgVolume = data.reduce((sum, d) => sum + d.volume, 0) / data.length
  const upDays = data.filter((d) => d.close > d.open).length
  const downDays = data.filter((d) => d.close < d.open).length

  // Generate explanation based on pattern type
  switch (patternType) {
    case "accumulation":
      return {
        summary: "Accumulation phase detected with institutional buying activity.",
        volumeAnalysis: `Volume analysis shows ${upDays > downDays ? "higher volume on up days" : "decreasing volume on down days"}, indicating accumulation by smart money.`,
        priceAction: `Price action shows sideways movement (${priceChange}% net change) after a downtrend, typical of accumulation.`,
        keyLevels: "Support level established with multiple tests but no significant breakdowns.",
      }

    case "distribution":
      return {
        summary: "Distribution phase detected with institutional selling activity.",
        volumeAnalysis: `Volume analysis shows ${downDays > upDays ? "higher volume on down days" : "decreasing volume on up days"}, indicating distribution by smart money.`,
        priceAction: `Price action shows sideways movement (${priceChange}% net change) after an uptrend, typical of distribution.`,
        keyLevels: "Resistance level established with multiple tests but no significant breakouts.",
      }

    case "spring":
      return {
        summary: "Spring pattern detected - false breakdown with strong reversal.",
        volumeAnalysis: `Volume spike on the spring day (${(data[0].volume / avgVolume).toFixed(2)}x average volume) followed by sustained buying.`,
        priceAction: "Price briefly penetrated support level before quickly reversing, trapping sellers.",
        keyLevels: "Support level violated and then reclaimed, confirming the spring pattern.",
      }

    case "upthrust":
      return {
        summary: "Upthrust pattern detected - false breakout with strong reversal.",
        volumeAnalysis: `Volume spike on the upthrust day (${(data[0].volume / avgVolume).toFixed(2)}x average volume) followed by sustained selling.`,
        priceAction: "Price briefly penetrated resistance level before quickly reversing, trapping buyers.",
        keyLevels: "Resistance level violated and then lost, confirming the upthrust pattern.",
      }

    default:
      return {
        summary: "Pattern analysis not available.",
        volumeAnalysis: "Volume data not analyzed.",
        priceAction: "Price action not analyzed.",
        keyLevels: "Key levels not identified.",
      }
  }
}

// Generate characteristics HTML
function generateCharacteristicsHTML(pattern) {
  const explanation = pattern.explanation

  return `
    <div class="characteristic-item">
      <div class="characteristic-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12" y2="8"></line>
        </svg>
      </div>
      <div class="characteristic-text">
        <h5>Summary</h5>
        <p>${explanation.summary}</p>
      </div>
    </div>
    
    <div class="characteristic-item">
      <div class="characteristic-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 3v18h18"></path>
          <path d="M18 17V9"></path>
          <path d="M13 17V5"></path>
          <path d="M8 17v-3"></path>
        </svg>
      </div>
      <div class="characteristic-text">
        <h5>Volume Analysis</h5>
        <p>${explanation.volumeAnalysis}</p>
      </div>
    </div>
    
    <div class="characteristic-item">
      <div class="characteristic-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
          <polyline points="16 7 22 7 22 13"></polyline>
        </svg>
      </div>
      <div class="characteristic-text">
        <h5>Price Action</h5>
        <p>${explanation.priceAction}</p>
      </div>
    </div>
    
    <div class="characteristic-item">
      <div class="characteristic-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </div>
      <div class="characteristic-text">
        <h5>Key Levels</h5>
        <p>${explanation.keyLevels}</p>
      </div>
    </div>
  `
}

// Generate implications HTML
function generateImplicationsHTML(pattern) {
  // Generate implications based on pattern type
  switch (pattern.type) {
    case "accumulation":
      return `
        <div class="implication-item">
          <div class="implication-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div class="implication-text">
            Look for a breakout above the trading range as confirmation of accumulation completion.
          </div>
        </div>
        <div class="implication-item">
          <div class="implication-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div class="implication-text">
            Consider long positions with stops below the trading range support.
          </div>
        </div>
        <div class="implication-item">
          <div class="implication-icon warning">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div class="implication-text">
            Be cautious of false breakouts - confirm with volume expansion.
          </div>
        </div>
      `

    case "distribution":
      return `
        <div class="implication-item">
          <div class="implication-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div class="implication-text">
            Look for a breakdown below the trading range as confirmation of distribution completion.
          </div>
        </div>
        <div class="implication-item">
          <div class="implication-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div class="implication-text">
            Consider short positions with stops above the trading range resistance.
          </div>
        </div>
        <div class="implication-item">
          <div class="implication-icon warning">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div class="implication-text">
            Be cautious of false breakdowns - confirm with volume expansion.
          </div>
        </div>
      `

    case "spring":
      return `
        <div class="implication-item">
          <div class="implication-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div class="implication-text">
            Consider long positions with stops below the spring low.
          </div>
        </div>
        <div class="implication-item">
          <div class="implication-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div class="implication-text">
            Look for a secondary test that holds above the spring low as confirmation.
          </div>
        </div>
        <div class="implication-item">
          <div class="implication-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div class="implication-text">
            Expect a markup phase to follow a successful spring.
          </div>
        </div>
      `

    case "upthrust":
      return `
        <div class="implication-item">
          <div class="implication-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div class="implication-text">
            Consider short positions with stops above the upthrust high.
          </div>
        </div>
        <div class="implication-item">
          <div class="implication-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div class="implication-text">
            Look for a secondary test that fails below the upthrust high as confirmation.
          </div>
        </div>
        <div class="implication-item">
          <div class="implication-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div class="implication-text">
            Expect a markdown phase to follow a successful upthrust.
          </div>
        </div>
      `

    default:
      return `
        <div class="implication-item">
          <div class="implication-icon warning">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div class="implication-text">
            No specific trading implications available for this pattern.
          </div>
        </div>
      `
  }
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
