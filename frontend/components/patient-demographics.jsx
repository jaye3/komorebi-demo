"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PatientDemographics() {
  const ageChartRef = useRef(null)
  const genderChartRef = useRef(null)

  // Mock data - in a real app, this would come from your backend
  const ageData = {
    labels: ["0-18", "19-35", "36-50", "51-65", "65+"],
    datasets: [
      {
        data: [15, 30, 25, 20, 10],
        backgroundColor: [
          "rgba(144, 238, 144, 0.7)",
          "rgba(152, 251, 152, 0.7)",
          "rgba(143, 188, 143, 0.7)",
          "rgba(85, 107, 47, 0.7)",
          "rgba(34, 139, 34, 0.7)",
        ],
        borderColor: "rgba(255, 255, 255, 0.8)",
        borderWidth: 1,
      },
    ],
  }

  const genderData = {
    labels: ["Female", "Male", "Other"],
    datasets: [
      {
        data: [48, 45, 7],
        backgroundColor: ["rgba(173, 216, 230, 0.7)", "rgba(144, 238, 144, 0.7)", "rgba(240, 230, 140, 0.7)"],
        borderColor: "rgba(255, 255, 255, 0.8)",
        borderWidth: 1,
      },
    ],
  }

  useEffect(() => {
    // This would use a charting library like Chart.js in a real app
    // For this example, we'll create a simple visualization

    const drawPieChart = (canvas, data, title) => {
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      const total = data.datasets[0].data.reduce((acc, val) => acc + val, 0)
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(centerX, centerY) - 10

      let startAngle = 0

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw title
      ctx.fillStyle = "#333"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText(title, centerX, 20)

      // Draw pie slices
      data.datasets[0].data.forEach((value, i) => {
        const sliceAngle = (2 * Math.PI * value) / total

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
        ctx.closePath()

        ctx.fillStyle = data.datasets[0].backgroundColor[i]
        ctx.fill()

        ctx.strokeStyle = data.datasets[0].borderColor
        ctx.lineWidth = data.datasets[0].borderWidth
        ctx.stroke()

        // Draw label
        const middleAngle = startAngle + sliceAngle / 2
        const labelRadius = radius * 0.7
        const labelX = centerX + labelRadius * Math.cos(middleAngle)
        const labelY = centerY + labelRadius * Math.sin(middleAngle)

        ctx.fillStyle = "#fff"
        ctx.font = "bold 12px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`${Math.round((value / total) * 100)}%`, labelX, labelY)

        startAngle += sliceAngle
      })

      // Draw legend
      const legendX = 10
      let legendY = canvas.height - data.labels.length * 20 - 10

      data.labels.forEach((label, i) => {
        const rectSize = 15

        ctx.fillStyle = data.datasets[0].backgroundColor[i]
        ctx.fillRect(legendX, legendY, rectSize, rectSize)

        ctx.strokeStyle = data.datasets[0].borderColor
        ctx.lineWidth = data.datasets[0].borderWidth
        ctx.strokeRect(legendX, legendY, rectSize, rectSize)

        ctx.fillStyle = "#333"
        ctx.font = "12px Arial"
        ctx.textAlign = "left"
        ctx.textBaseline = "middle"
        ctx.fillText(`${label} (${data.datasets[0].data[i]})`, legendX + rectSize + 5, legendY + rectSize / 2)

        legendY += 20
      })
    }

    // Set canvas dimensions
    const setCanvasDimensions = (canvas) => {
      if (!canvas) return
      const container = canvas.parentElement
      canvas.width = container.clientWidth
      canvas.height = 300
    }

    // Initialize charts
    setCanvasDimensions(ageChartRef.current)
    setCanvasDimensions(genderChartRef.current)

    drawPieChart(ageChartRef.current, ageData, "Age Distribution")
    drawPieChart(genderChartRef.current, genderData, "Gender Distribution")

    // Redraw on window resize
    const handleResize = () => {
      setCanvasDimensions(ageChartRef.current)
      setCanvasDimensions(genderChartRef.current)

      drawPieChart(ageChartRef.current, ageData, "Age Distribution")
      drawPieChart(genderChartRef.current, genderData, "Gender Distribution")
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <Tabs defaultValue="charts">
      <TabsList className="mb-4">
        <TabsTrigger value="charts" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
          Charts
        </TabsTrigger>
        <TabsTrigger value="stats" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
          Statistics
        </TabsTrigger>
      </TabsList>

      <TabsContent value="charts" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <canvas ref={ageChartRef}></canvas>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <canvas ref={genderChartRef}></canvas>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="stats">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Registered Patients</h3>
                <p className="text-2xl font-bold text-green-700">1,248</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Average Age</h3>
                  <p className="text-xl font-bold text-green-700">42.5 years</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">New Patients (This Month)</h3>
                  <p className="text-xl font-bold text-green-700">78</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Recurring Patients</h3>
                  <p className="text-xl font-bold text-green-700">68%</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Top Conditions</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Hypertension</span>
                    <span className="font-medium">24%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Diabetes</span>
                    <span className="font-medium">18%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Asthma</span>
                    <span className="font-medium">12%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Arthritis</span>
                    <span className="font-medium">9%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Anxiety/Depression</span>
                    <span className="font-medium">8%</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

