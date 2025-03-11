"use client"

import { Badge } from "@/components/ui/badge"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, ThumbsUp, MessageSquare } from "lucide-react"

// Mock data - in a real app, this would come from your backend
const sentimentData = {
  "P-1024": {
    overallSentiment: "Positive",
    score: 78,
    recentTrend: "Improving",
    keyInsights: [
      {
        type: "positive",
        text: "Patient expresses satisfaction with current treatment plan",
      },
      {
        type: "positive",
        text: "Regularly engages with WhatsApp check-ins",
      },
      {
        type: "neutral",
        text: "Occasionally mentions mild anxiety about asthma symptoms",
      },
      {
        type: "concern",
        text: "Expressed frustration about medication side effects",
      },
    ],
    recentMessages: [
      {
        date: "2023-10-18",
        message: "I've been feeling much better since my last appointment. The new inhaler is working well.",
        sentiment: "Positive",
      },
      {
        date: "2023-10-12",
        message: "My blood pressure reading today was 130/82. Is that okay?",
        sentiment: "Neutral",
      },
      {
        date: "2023-10-05",
        message:
          "I'm a bit worried about the side effects of the new medication. I've been feeling tired in the afternoons.",
        sentiment: "Concern",
      },
    ],
    recommendations: [
      "Acknowledge patient's positive progress with asthma management",
      "Address medication side effects at next appointment",
      "Continue to encourage regular WhatsApp check-ins",
      "Consider scheduling a follow-up sooner if side effects persist",
    ],
  },
  "P-1025": {
    overallSentiment: "Neutral",
    score: 62,
    recentTrend: "Stable",
    keyInsights: [
      {
        type: "positive",
        text: "Consistently reports following dietary recommendations",
      },
      {
        type: "neutral",
        text: "Moderate engagement with WhatsApp check-ins",
      },
      {
        type: "concern",
        text: "Expresses difficulty maintaining exercise routine",
      },
    ],
    recentMessages: [
      {
        date: "2023-10-14",
        message: "My blood sugar readings have been stable this week.",
        sentiment: "Neutral",
      },
      {
        date: "2023-10-07",
        message: "I've been following the diet plan, but finding it hard to exercise regularly with my work schedule.",
        sentiment: "Concern",
      },
    ],
    recommendations: [
      "Discuss flexible exercise options that fit patient's schedule",
      "Reinforce importance of regular glucose monitoring",
      "Provide positive reinforcement for dietary compliance",
    ],
  },
}

export default function PatientSentimentAnalysis({ patientId }) {
  const sentimentGaugeRef = useRef(null)

  const data = sentimentData[patientId]

  if (!data) {
    return <div className="text-center py-8 text-gray-500">No sentiment analysis data available for this patient.</div>
  }

  useEffect(() => {
    // Draw sentiment gauge
    const drawSentimentGauge = () => {
      const canvas = sentimentGaugeRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      const centerX = canvas.width / 2
      const centerY = canvas.height - 30
      const radius = Math.min(centerX, centerY) - 10

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw gauge background
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, Math.PI, 0)
      ctx.lineWidth = 20
      ctx.strokeStyle = "#f1f5f9" // slate-100
      ctx.stroke()

      // Calculate score angle (0 to 100 maps to PI to 0)
      const scoreAngle = Math.PI - (data.score / 100) * Math.PI

      // Draw score arc
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, Math.PI, scoreAngle)

      // Create gradient based on score
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
      gradient.addColorStop(0, "#ef4444") // red-500
      gradient.addColorStop(0.5, "#eab308") // yellow-500
      gradient.addColorStop(1, "#22c55e") // green-500

      ctx.lineWidth = 20
      ctx.strokeStyle = gradient
      ctx.stroke()

      // Draw score text
      ctx.fillStyle = "#334155" // slate-700
      ctx.font = "bold 24px Arial"
      ctx.textAlign = "center"
      ctx.fillText(`${data.score}`, centerX, centerY - 20)

      ctx.fillStyle = "#64748b" // slate-500
      ctx.font = "14px Arial"
      ctx.fillText("Sentiment Score", centerX, centerY + 10)

      // Draw trend indicator
      const trendY = centerY + 40
      ctx.fillStyle = "#64748b" // slate-500
      ctx.font = "14px Arial"
      ctx.fillText("Trend:", centerX - 30, trendY)

      ctx.fillStyle =
        data.recentTrend === "Improving"
          ? "#22c55e"
          : // green-500
            data.recentTrend === "Declining"
            ? "#ef4444"
            : // red-500
              "#64748b" // slate-500

      ctx.font = "bold 14px Arial"
      ctx.fillText(data.recentTrend, centerX + 30, trendY)
    }

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const canvas = sentimentGaugeRef.current
      if (!canvas) return

      const container = canvas.parentElement
      canvas.width = container.clientWidth
      canvas.height = 200
    }

    setCanvasDimensions()
    drawSentimentGauge()

    // Redraw on window resize
    const handleResize = () => {
      setCanvasDimensions()
      drawSentimentGauge()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [data])

  return (
    <Tabs defaultValue="overview">
      <TabsList className="mb-4">
        <TabsTrigger value="overview" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
          Overview
        </TabsTrigger>
        <TabsTrigger value="messages" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
          Recent Messages
        </TabsTrigger>
        <TabsTrigger
          value="recommendations"
          className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
        >
          Recommendations
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Sentiment Score</h3>
              <div className="w-full">
                <canvas ref={sentimentGaugeRef}></canvas>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Key Insights</h3>
              <div className="space-y-4">
                {data.keyInsights.map((insight, index) => (
                  <div key={index} className="flex items-start">
                    <div
                      className={`
                      flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mr-2
                      ${
                        insight.type === "positive"
                          ? "bg-green-100"
                          : insight.type === "concern"
                            ? "bg-red-100"
                            : "bg-gray-100"
                      }
                    `}
                    >
                      {insight.type === "positive" && <ThumbsUp className="h-3 w-3 text-green-600" />}
                      {insight.type === "concern" && <AlertTriangle className="h-3 w-3 text-red-600" />}
                      {insight.type === "neutral" && <div className="h-3 w-3 rounded-full bg-gray-400"></div>}
                    </div>
                    <p className="text-gray-700">{insight.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="messages">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Recent WhatsApp Messages</h3>
            <div className="space-y-4">
              {data.recentMessages.map((message, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">{message.date}</span>
                    <Badge
                      variant="outline"
                      className={
                        message.sentiment === "Positive"
                          ? "border-green-200 text-green-700 bg-green-50"
                          : message.sentiment === "Neutral"
                            ? "border-gray-200 text-gray-700 bg-gray-50"
                            : "border-red-200 text-red-700 bg-red-50"
                      }
                    >
                      {message.sentiment}
                    </Badge>
                  </div>
                  <div className="flex items-start">
                    <MessageSquare className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    <p className="text-gray-700">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="recommendations">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Suggested Approach</h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                Based on sentiment analysis from WhatsApp check-ins and appointment feedback, consider the following
                recommendations for optimizing patient experience:
              </p>

              <ul className="space-y-2">
                {data.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <p className="text-gray-700">{recommendation}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
                <h4 className="font-medium text-green-800 mb-2">Communication Tips</h4>
                <p className="text-green-700 text-sm">
                  When interacting with this patient, emphasize positive progress, acknowledge concerns about medication
                  side effects, and maintain a supportive tone. The patient responds well to detailed explanations and
                  appreciates when their adherence to treatment plans is recognized.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

