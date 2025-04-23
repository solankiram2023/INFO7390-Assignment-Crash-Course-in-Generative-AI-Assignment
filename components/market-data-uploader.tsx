"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"

export function MarketDataUploader() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [symbol, setSymbol] = useState("")
  const [timeframe, setTimeframe] = useState("daily")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
      setUploadStatus("idle")
      setUploadProgress(0)
    }
  }

  const handleUpload = () => {
    if (!selectedFile) return

    setUploadStatus("uploading")
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploadStatus("success")
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const handleSymbolSearch = () => {
    if (!symbol) return

    setUploadStatus("uploading")
    setUploadProgress(0)

    // Simulate data fetching progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploadStatus("success")
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  return (
    <Tabs defaultValue="file" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="file">Upload File</TabsTrigger>
        <TabsTrigger value="api">Fetch from API</TabsTrigger>
      </TabsList>

      <TabsContent value="file">
        <Card>
          <CardHeader>
            <CardTitle>Upload Market Data</CardTitle>
            <CardDescription>Upload CSV or JSON files containing historical market data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="file">File</Label>
              <div className="flex items-center gap-2">
                <Input id="file" type="file" accept=".csv,.json" onChange={handleFileChange} className="flex-1" />
              </div>
              {selectedFile && (
                <p className="text-sm text-slate-500 flex items-center mt-1">
                  <FileText className="h-3 w-3 mr-1" />
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="timeframe">Timeframe</Label>
              <select
                id="timeframe"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="1min">1 Minute</option>
                <option value="5min">5 Minutes</option>
                <option value="15min">15 Minutes</option>
                <option value="30min">30 Minutes</option>
                <option value="1hour">1 Hour</option>
                <option value="4hour">4 Hours</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            {uploadStatus === "uploading" && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-slate-500 text-center">Uploading... {uploadProgress}%</p>
              </div>
            )}

            {uploadStatus === "success" && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Upload Complete</AlertTitle>
                <AlertDescription className="text-green-700">
                  Your market data has been successfully uploaded and is ready for analysis.
                </AlertDescription>
              </Alert>
            )}

            {uploadStatus === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Upload Failed</AlertTitle>
                <AlertDescription>There was an error uploading your file. Please try again.</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleUpload} disabled={!selectedFile || uploadStatus === "uploading"} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Upload Data
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="api">
        <Card>
          <CardHeader>
            <CardTitle>Fetch Market Data</CardTitle>
            <CardDescription>Retrieve historical market data from our API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                placeholder="Enter stock symbol (e.g., AAPL)"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="api-timeframe">Timeframe</Label>
              <select
                id="api-timeframe"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="1min">1 Minute</option>
                <option value="5min">5 Minutes</option>
                <option value="15min">15 Minutes</option>
                <option value="30min">30 Minutes</option>
                <option value="1hour">1 Hour</option>
                <option value="4hour">4 Hours</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="start-date">Start Date</Label>
                <Input id="start-date" type="date" />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="end-date">End Date</Label>
                <Input id="end-date" type="date" />
              </div>
            </div>

            {uploadStatus === "uploading" && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-slate-500 text-center">Fetching data... {uploadProgress}%</p>
              </div>
            )}

            {uploadStatus === "success" && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Data Retrieved</AlertTitle>
                <AlertDescription className="text-green-700">
                  Market data for {symbol.toUpperCase()} has been successfully retrieved and is ready for analysis.
                </AlertDescription>
              </Alert>
            )}

            {uploadStatus === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Fetch Failed</AlertTitle>
                <AlertDescription>
                  There was an error retrieving data. Please check the symbol and try again.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSymbolSearch} disabled={!symbol || uploadStatus === "uploading"} className="w-full">
              Fetch Data
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
