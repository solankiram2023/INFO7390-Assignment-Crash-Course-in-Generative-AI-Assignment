"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, Bot, User, Info, ArrowRight } from "lucide-react"

// Sample predefined questions
const predefinedQuestions = [
  "What is the Wyckoff methodology?",
  "Explain accumulation and distribution phases",
  "How do I identify a spring pattern?",
  "What is the significance of volume in Wyckoff analysis?",
  "How can I use Wyckoff for day trading?",
  "What are the four phases of a market cycle according to Wyckoff?",
  "How do I identify manipulation in the markets?",
  "What is the law of effort vs result?",
]

// Sample responses for demonstration
const sampleResponses: Record<string, string> = {
  "What is the Wyckoff methodology?":
    "The Wyckoff methodology is a technical analysis approach developed by Richard Wyckoff in the early 20th century. It's based on the premise that price movements are driven by supply and demand, which can be analyzed through price and volume relationships. Wyckoff developed a comprehensive approach to market analysis, including his three laws: the law of supply and demand, the law of cause and effect, and the law of effort vs. result.",

  "Explain accumulation and distribution phases":
    "Accumulation is a phase where institutional investors (smart money) are buying an asset from retail traders, typically at the end of a downtrend. It's characterized by sideways price movement with decreasing volume on down days and increasing volume on up days.\n\nDistribution is the opposite - a phase where smart money is selling to retail traders, typically at the end of an uptrend. It shows sideways price movement with increasing volume on down days and decreasing volume on up days. Both phases typically show a trading range before a significant price movement.",

  "How do I identify a spring pattern?":
    "A spring is a price movement that briefly penetrates a support level (often the lower boundary of an accumulation range) before quickly reversing. It's designed to shake out weak holders and trigger stop losses before the actual markup phase begins. To identify a spring:\n\n1. Look for a trading range after a downtrend (potential accumulation)\n2. Watch for a quick move below support with relatively low volume\n3. Look for a rapid reversal back into the trading range\n4. Confirm with increased volume on the reversal\n5. Watch for higher lows following the spring\n\nA successful spring is often followed by a test of the spring low that holds above it, confirming the reversal.",

  default:
    "I'm your Wyckoff Trading Assistant, trained on Wyckoff methodology principles and market analysis techniques. I can help you understand market structures, identify patterns like accumulation and distribution, and apply Wyckoff principles to your trading. What would you like to know about Wyckoff methodology or technical analysis?",
}

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
}

export function TradingAssistantChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your Wyckoff Trading Assistant. I can help you understand Wyckoff methodology and apply it to market analysis. What would you like to know?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responseContent = sampleResponses[input.trim()] || sampleResponses["default"]

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000)
  }

  const handleQuestionClick = (question: string) => {
    setInput(question)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: question,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responseContent = sampleResponses[question] || sampleResponses["default"]

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
      <div className="md:col-span-2 flex flex-col h-full">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>Wyckoff Trading Assistant</CardTitle>
            <CardDescription>Ask questions about Wyckoff methodology and trading strategies</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-[400px] pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <Avatar className={message.sender === "user" ? "bg-blue-100" : "bg-slate-100"}>
                        <AvatarFallback>
                          {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg p-3 text-sm ${
                          message.sender === "user" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-900"
                        }`}
                      >
                        {message.content.split("\n\n").map((paragraph, i) => (
                          <p key={i} className={i > 0 ? "mt-2" : ""}>
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2 max-w-[80%]">
                      <Avatar className="bg-slate-100">
                        <AvatarFallback>
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg p-3 text-sm bg-slate-100 text-slate-900">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="h-2 w-2 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="h-2 w-2 rounded-full bg-slate-300 animate-bounce"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <form
              className="flex w-full items-center space-x-2"
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
            >
              <Input
                placeholder="Type your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>

      <div className="h-full">
        <Tabs defaultValue="questions">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="h-[540px]">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-sm">Suggested Questions</CardTitle>
                <CardDescription>Click on any question to ask the assistant</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {predefinedQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => handleQuestionClick(question)}
                      >
                        <span className="truncate">{question}</span>
                        <ArrowRight className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="h-[540px]">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-sm">About Wyckoff Methodology</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Richard Wyckoff</h4>
                        <p className="text-slate-600 mt-1">
                          Richard Wyckoff (1873-1934) was a stock market investor, educator, and founder of the Magazine
                          of Wall Street. He developed a methodology based on the analysis of supply and demand in
                          financial markets through the study of price, volume, and time.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Three Laws</h4>
                        <p className="text-slate-600 mt-1">
                          Wyckoff's methodology is based on three fundamental laws: the law of supply and demand, the
                          law of cause and effect, and the law of effort vs. result. These laws help traders understand
                          market dynamics and make informed decisions.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Market Cycles</h4>
                        <p className="text-slate-600 mt-1">
                          According to Wyckoff, markets move in four phases: accumulation, markup, distribution, and
                          markdown. Understanding these phases helps traders identify optimal entry and exit points.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Composite Man</h4>
                        <p className="text-slate-600 mt-1">
                          Wyckoff introduced the concept of the "Composite Man" - a representation of the collective
                          actions of large institutional investors who manipulate markets to their advantage.
                          Understanding the Composite Man's intentions is key to successful trading.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Price and Volume</h4>
                        <p className="text-slate-600 mt-1">
                          Wyckoff emphasized the importance of analyzing price movements in relation to volume.
                          Divergences between price and volume often signal potential reversals or continuations of
                          trends.
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
