"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function WyckoffAnalyzer() {
  useEffect(() => {
    // Load the HTML page in an iframe
    const iframe = document.getElementById("wyckoff-analyzer-iframe") as HTMLIFrameElement
    if (iframe) {
      iframe.src = "/wyckoff-analyzer.html"
    }
  }, [])

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Wyckoff Pattern Analyzer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This tool helps you identify and analyze Wyckoff patterns in financial markets. Use the interactive analyzer
            below to explore patterns like accumulation, distribution, springs, and upthrusts.
          </p>
          <Button asChild>
            <a href="/wyckoff-assistant" className="no-underline">
              Try the Wyckoff AI Assistant
            </a>
          </Button>
        </CardContent>
      </Card>

      <div className="w-full h-[800px] border border-slate-200 rounded-lg overflow-hidden">
        <iframe id="wyckoff-analyzer-iframe" className="w-full h-full" title="Wyckoff Pattern Analyzer"></iframe>
      </div>
    </div>
  )
}
