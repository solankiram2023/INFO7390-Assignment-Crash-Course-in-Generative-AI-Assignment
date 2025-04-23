import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WyckoffPatternVisualizer } from "@/components/wyckoff-pattern-visualizer"
import { TradingAssistantChat } from "@/components/trading-assistant-chat"
import { MarketDataUploader } from "@/components/market-data-uploader"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                  Wyckoff Trading Assistant
                </h1>
                <p className="max-w-[600px] text-white/90 md:text-xl">
                  Leverage the power of transformer models fine-tuned on Wyckoff methodology to make informed trading
                  decisions.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild className="bg-white text-blue-600 hover:bg-white/90">
                  <Link href="/wyckoff-assistant">Get Started</Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href="/wyckoff-analyzer">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <Image
                src="/wyckoff-accumulation-distribution.png"
                alt="Wyckoff Trading Chart"
                width={500}
                height={400}
                className="rounded-lg shadow-xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900">
                Powered by AI, Guided by Wyckoff
              </h2>
              <p className="max-w-[900px] text-slate-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our transformer-based model combines modern AI with time-tested Wyckoff methodology principles to help
                you analyze market conditions and make better trading decisions.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Wyckoff AI Assistant</CardTitle>
                <CardDescription>Ask questions about Wyckoff methodology and get expert answers</CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src="/financial-ai-dashboard.png"
                  alt="AI Assistant"
                  width={300}
                  height={200}
                  className="rounded-lg w-full"
                />
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/wyckoff-assistant">Try Assistant</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pattern Recognition</CardTitle>
                <CardDescription>Identify accumulation, distribution, and other key Wyckoff patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src="/wyckoff-accumulation-example.png"
                  alt="Pattern Recognition"
                  width={300}
                  height={200}
                  className="rounded-lg w-full"
                />
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/wyckoff-analyzer">Analyze Chart</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Trading Strategy</CardTitle>
                <CardDescription>Get AI-powered trading suggestions based on Wyckoff principles</CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src="/trading-strategy-dashboard.png"
                  alt="Trading Strategy"
                  width={300}
                  height={200}
                  className="rounded-lg w-full"
                />
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/wyckoff-assistant">Try Assistant</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-100">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900">
                Interactive Demo
              </h2>
              <p className="max-w-[900px] text-slate-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Experience the power of our Wyckoff Trading Assistant with this interactive demo.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <Tabs defaultValue="visualizer" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="visualizer">Pattern Visualizer</TabsTrigger>
                <TabsTrigger value="assistant">Trading Assistant</TabsTrigger>
                <TabsTrigger value="upload">Upload Data</TabsTrigger>
              </TabsList>
              <TabsContent value="visualizer" className="p-4 bg-white rounded-lg shadow mt-4">
                <WyckoffPatternVisualizer />
              </TabsContent>
              <TabsContent value="assistant" className="p-4 bg-white rounded-lg shadow mt-4">
                <TradingAssistantChat />
              </TabsContent>
              <TabsContent value="upload" className="p-4 bg-white rounded-lg shadow mt-4">
                <MarketDataUploader />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900">
                How It Works
              </h2>
              <p className="max-w-[900px] text-slate-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our system combines transformer-based AI with reinforcement learning to apply Wyckoff methodology to
                modern markets.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-900">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold">Data Collection</h3>
              <p className="text-sm text-slate-600">
                Historical market data is collected and preprocessed for training.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-900">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold">Model Fine-Tuning</h3>
              <p className="text-sm text-slate-600">
                Transformer models are fine-tuned on Wyckoff patterns and principles.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-900">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold">Pattern Recognition</h3>
              <p className="text-sm text-slate-600">
                The model identifies key Wyckoff patterns in real-time market data.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-900">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bold">Trading Insights</h3>
              <p className="text-sm text-slate-600">
                Actionable trading insights are generated based on identified patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-slate-900 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-lg font-medium">Wyckoff Trading Assistant</h3>
            <p className="mt-2 text-sm text-slate-400">Combining AI with time-tested trading principles.</p>
          </div>
          <div className="mt-8 border-t border-slate-800 pt-6 text-center text-sm text-slate-400">
            <p>© 2024 Wyckoff Trading Assistant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
