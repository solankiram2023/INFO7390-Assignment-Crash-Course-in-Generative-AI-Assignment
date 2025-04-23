"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { SendIcon, BookOpenIcon, BarChart3Icon, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { WyckoffChart } from "./wyckoff-chart"
import { WyckoffExplanation } from "./wyckoff-explanation"

// Types for our chat messages
type MessageType = {
  id: string
  content: string
  sender: "user" | "assistant"
  chartExample?: string
}

// Preset questions about Wyckoff methodology
const PRESET_QUESTIONS = [
  "What is Wyckoff methodology?",
  "Explain accumulation phase",
  "Explain distribution phase",
  "What is a spring pattern?",
  "What is an upthrust?",
  "How to identify a Wyckoff range?",
  "Explain the Wyckoff schematic #1",
  "How to use volume in Wyckoff analysis?",
  "What is the Wyckoff law of effort vs result?",
  "How to spot institutional activity in charts?",
]

// Sample responses with chart examples
const SAMPLE_RESPONSES: Record<string, { text: string; chartExample?: string }> = {
  "What is Wyckoff methodology?": {
    text: "The Wyckoff methodology is a technical analysis approach developed by Richard Wyckoff in the early 20th century. It's based on the premise that price movements are driven by supply and demand, which can be analyzed through price and volume relationships.\n\nWyckoff developed three fundamental laws: the law of supply and demand, the law of cause and effect, and the law of effort vs result. The methodology helps traders identify the intentions of large institutional investors (referred to as 'composite operators') and align their trades with these market professionals.\n\nWyckoff's approach includes analyzing market cycles through four phases: accumulation, markup, distribution, and markdown.",
    chartExample: "wyckoff-overview",
  },
  "Explain accumulation phase": {
    text: "The accumulation phase in Wyckoff methodology represents a period where 'smart money' or institutional investors are actively buying an asset from retail traders, typically at the end of a downtrend.\n\nKey characteristics include:\n\n1. Decreased volume during the downtrend\n2. Sideways price movement with narrowing price ranges\n3. Higher volume on up days, lower volume on down days\n4. Support level that holds despite tests\n5. Presence of 'springs' (false breakdowns) that trap sellers\n\nThis phase typically occurs after a significant price decline and before a new uptrend begins. The composite operator (institutional investors) aims to accumulate positions without driving prices higher too quickly.",
    chartExample: "accumulation",
  },
  "Explain distribution phase": {
    text: "The distribution phase in Wyckoff methodology represents a period where 'smart money' or institutional investors are actively selling an asset to retail traders, typically at the end of an uptrend.\n\nKey characteristics include:\n\n1. Decreased momentum during the final part of the uptrend\n2. Sideways price movement with narrowing price ranges\n3. Higher volume on down days, lower volume on down days\n4. Resistance level that holds despite tests\n5. Presence of 'upthrusts' (false breakouts) that trap buyers\n\nThis phase typically occurs after a significant price advance and before a new downtrend begins. The composite operator (institutional investors) aims to distribute positions without driving prices lower too quickly.",
    chartExample: "distribution",
  },
  "What is a spring pattern?": {
    text: "A spring in Wyckoff methodology is a specific price action pattern that occurs typically during an accumulation phase. It's characterized by a brief price movement below a support level (often the lower boundary of a trading range), followed by a quick reversal back into the range.\n\nKey characteristics of a spring include:\n\n1. A break below established support that appears to be the start of a downtrend\n2. Relatively low volume during the break (showing lack of selling pressure)\n3. A quick and decisive reversal back above the support level\n4. Often followed by increasing volume and stronger price action\n\nThe spring serves to 'shake out' weak holders and trigger stop losses before the actual markup phase begins. It's one of the most reliable signals in Wyckoff analysis for potential reversal of trend from down to up.",
    chartExample: "spring",
  },
  "What is an upthrust?": {
    text: "An upthrust in Wyckoff methodology is a specific price action pattern that occurs typically during a distribution phase. It's characterized by a brief price movement above a resistance level (often the upper boundary of a trading range), followed by a quick reversal back into the range.\n\nKey characteristics of an upthrust include:\n\n1. A break above established resistance that appears to be the start of an uptrend\n2. Often occurs on increased volume initially (showing supply coming in)\n3. A quick and decisive reversal back below the resistance level\n4. Typically followed by declining prices and sometimes increased volume on the decline\n\nThe upthrust serves to 'trap' buyers who chase the breakout and build positions for institutional investors to sell into. It's one of the most reliable signals in Wyckoff analysis for potential reversal of trend from up to down.",
    chartExample: "upthrust",
  },
  "How to identify a Wyckoff range?": {
    text: "A Wyckoff trading range is a period of sideways price movement that occurs after a trend and before a new trend in the opposite direction. Identifying a Wyckoff range involves looking for these key elements:\n\n1. Preliminary support/resistance: A significant reversal point indicating potential exhaustion of the previous trend\n\n2. Buying/selling climax: A high-volume, wide-range price movement marking potential trend exhaustion\n\n3. An automatic rally/reaction: A counter-trend move after the climax\n\n4. Secondary test: A retest of the climax extreme with lower volume\n\n5. Range boundaries: Clear support and resistance levels forming a channel\n\n6. Tests of support/resistance: Multiple tests of range boundaries\n\n7. Declining volume and volatility: As the range matures\n\n8. Signs of absorption: Where buying meets selling with diminishing price movement\n\nWyckoff ranges typically form either accumulation (after downtrends) or distribution (after uptrends) structures.",
    chartExample: "wyckoff-range",
  },
  default: {
    text: "I'm your Wyckoff Trading Assistant, trained to help you understand and apply Wyckoff methodology to market analysis. I can explain concepts like accumulation, distribution, springs, upthrusts, and how to identify potential trading opportunities using Wyckoff principles.\n\nFeel free to ask specific questions about Wyckoff methodology or choose from the suggested questions on the right side of the screen.",
  },
}

export default function WyckoffAssistant() {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "1",
      content:
        "Welcome to the Wyckoff Trading Assistant! Ask me anything about Wyckoff methodology, market structure, or technical analysis based on Wyckoff principles.",
      sender: "assistant",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [activeChart, setActiveChart] = useState<string | undefined>(undefined)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Add a state to track if the library is loaded
  const [libraryLoaded, setLibraryLoaded] = useState(false)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle library load event
  const handleLibraryLoad = () => {
    console.log("Lightweight Charts library loaded")
    setLibraryLoaded(true)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!inputValue.trim()) return

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI thinking
    setTimeout(
      () => {
        respondToMessage(inputValue)
      },
      1000 + Math.random() * 1000,
    )
  }

  const handlePresetQuestion = (question: string) => {
    setInputValue(question)

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: question,
      sender: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    // Simulate AI thinking
    setTimeout(
      () => {
        respondToMessage(question)
      },
      1000 + Math.random() * 1000,
    )
  }

  const respondToMessage = (message: string) => {
    // Get response from our samples or default
    const response = SAMPLE_RESPONSES[message] || SAMPLE_RESPONSES["default"]

    const assistantMessage: MessageType = {
      id: Date.now().toString(),
      content: response.text,
      sender: "assistant",
      chartExample: response.chartExample,
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsTyping(false)

    // Set active chart if available
    if (response.chartExample) {
      setActiveChart(response.chartExample)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="bg-indigo-700 text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3Icon className="h-7 w-7" />
            <h1 className="text-xl font-semibold">Wyckoff Trading Assistant</h1>
          </div>
          <div className="text-xs sm:text-sm opacity-80">Powered by Wyckoff Methodology</div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 flex flex-col md:flex-row gap-4 overflow-hidden">
        <Card className="flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="px-4 pt-4 border-b">
              <h2 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                <BookOpenIcon className="h-4 w-4" />
                <span>Chat Assistant</span>
              </h2>
            </div>

            <div className="flex-1 flex flex-col px-1 overflow-hidden mt-0 pt-4">
              <ScrollArea className="flex-1 px-3 mb-4">
                <div className="flex flex-col space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.sender === "user"
                            ? "bg-indigo-600 text-white"
                            : "bg-white border border-slate-200 text-slate-800"
                        }`}
                      >
                        {message.content.split("\n\n").map((paragraph, i) => (
                          <p key={i} className={i > 0 ? "mt-3" : ""}>
                            {paragraph}
                          </p>
                        ))}

                        {message.chartExample && (
                          <button
                            className="mt-2 text-xs font-medium underline"
                            onClick={() => {
                              setActiveChart(message.chartExample)
                            }}
                          >
                            View chart example
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-800">
                        <div className="flex space-x-1 items-center h-6">
                          <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-3 border-t bg-white">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about Wyckoff methodology..."
                    className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Button type="submit" disabled={isTyping || !inputValue.trim()}>
                    <SendIcon className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </Card>

        {activeChart && (
          <Card className="mt-4 flex-1 flex flex-col overflow-hidden">
            <div className="px-4 pt-4 border-b">
              <h2 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                <BarChart3Icon className="h-4 w-4" />
                <span>Chart Example</span>
              </h2>
            </div>
            <div className="flex-1 overflow-hidden p-4">
              <WyckoffChart chartType={activeChart} />
            </div>
            <div className="p-4 border-t bg-white">
              <WyckoffExplanation chartType={activeChart} />
            </div>
          </Card>
        )}

        <div className="w-full md:w-72 lg:w-80 flex flex-col gap-4">
          <Card className="flex flex-col overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <BookOpenIcon className="h-4 w-4" />
                Common Questions
              </h2>
            </div>
            <CardContent className="p-3">
              <ScrollArea className="h-[300px] md:h-[400px] lg:h-[500px] pr-3">
                <div className="flex flex-col space-y-2">
                  {PRESET_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      className="text-left px-3 py-2 rounded-md hover:bg-slate-100 transition-colors text-sm border border-slate-200 hover:border-slate-300"
                      onClick={() => handlePresetQuestion(question)}
                      disabled={isTyping}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <div className="bg-slate-100 px-4 py-3 border-b">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <Info className="h-4 w-4" />
                About Wyckoff
              </h2>
            </div>
            <CardContent className="p-4 text-sm text-slate-600">
              <p>
                Richard Wyckoff (1873-1934) was a pioneering technical analyst who developed a methodology for
                understanding and navigating financial markets based on the operations of large institutional investors.
              </p>
              <p className="mt-2">
                His approach focuses on identifying market cycles, price-volume relationships, and the interpretation of
                chart patterns to determine the direction of future price movements.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
