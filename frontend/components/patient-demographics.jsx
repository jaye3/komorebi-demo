"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PatientDemographics() {
  const ageChartRef = useRef(null);
  const genderChartRef = useRef(null);

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
  };

  const genderData = {
    labels: ["Female", "Male", "Other"],
    datasets: [
      {
        data: [48, 45, 7],
        backgroundColor: [
          "rgba(173, 216, 230, 0.7)",
          "rgba(144, 238, 144, 0.7)",
          "rgba(240, 230, 140, 0.7)",
        ],
        borderColor: "rgba(255, 255, 255, 0.8)",
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    const drawPieChart = (canvas, data, title) => {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const total = data.datasets[0].data.reduce((acc, val) => acc + val, 0);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 10;
      let startAngle = 0;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw title
      ctx.fillStyle = "#333";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText(title, centerX, 10);

      // Draw pie slices
      data.datasets[0].data.forEach((value, i) => {
        const sliceAngle = (2 * Math.PI * value) / total;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();

        ctx.fillStyle = data.datasets[0].backgroundColor[i];
        ctx.fill();

        ctx.strokeStyle = data.datasets[0].borderColor;
        ctx.lineWidth = data.datasets[0].borderWidth;
        ctx.stroke();

        // Draw label inside pie slices
        const middleAngle = startAngle + sliceAngle / 2;
        const labelRadius = radius * 0.7;
        const labelX = centerX + labelRadius * Math.cos(middleAngle);
        const labelY = centerY + labelRadius * Math.sin(middleAngle);

        ctx.fillStyle = "#fff";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${Math.round((value / total) * 100)}%`, labelX, labelY);

        startAngle += sliceAngle;
      });
    };

    const setCanvasDimensions = (canvas) => {
      if (!canvas) return;
      const container = canvas.parentElement;
      canvas.width = Math.min(container.clientWidth * 0.9, 300);
      canvas.height = canvas.width;
    };

    // Initialize charts
    setCanvasDimensions(ageChartRef.current);
    setCanvasDimensions(genderChartRef.current);

    drawPieChart(ageChartRef.current, ageData, "Age Distribution");
    drawPieChart(genderChartRef.current, genderData, "Gender Distribution");

    // Redraw on window resize
    const handleResize = () => {
      setCanvasDimensions(ageChartRef.current);
      setCanvasDimensions(genderChartRef.current);

      drawPieChart(ageChartRef.current, ageData, "Age Distribution");
      drawPieChart(genderChartRef.current, genderData, "Gender Distribution");
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
        <Card className="w-full max-w-[400px]">
  <CardContent className="p-4 flex flex-col items-center">
    <canvas ref={ageChartRef} className="max-w-full max-h-[250px] md:max-h-[300px]"></canvas>
    <div className="mt-4 text-sm text-gray-600 flex flex-wrap gap-2 justify-center">
      {ageData.labels.map((label, i) => (
        <li key={i} className="flex items-center gap-2">
          <span className="w-3 h-3 block rounded" style={{ backgroundColor: ageData.datasets[0].backgroundColor[i] }}></span>
          {label} ({ageData.datasets[0].data[i]})
        </li>
      ))}
    </div>
  </CardContent>
</Card>

<Card className="w-full max-w-[400px]">
  <CardContent className="p-4 flex flex-col items-center">
    <canvas ref={genderChartRef} className="max-w-full max-h-[250px] md:max-h-[300px]"></canvas>
    <div className="mt-4 text-sm text-gray-600 flex flex-wrap gap-2 justify-center">
      {genderData.labels.map((label, i) => (
        <li key={i} className="flex items-center gap-2">
          <span className="w-3 h-3 block rounded" style={{ backgroundColor: genderData.datasets[0].backgroundColor[i] }}></span>
          {label} ({genderData.datasets[0].data[i]})
        </li>
      ))}
    </div>
  </CardContent>
</Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}


