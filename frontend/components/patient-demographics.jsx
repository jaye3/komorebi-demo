"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function PatientDemographics() {
  // 📌 Updated Age Distribution Data (Specific to Dermatology)
  const ageData = {
    labels: ["0-18", "19-35", "36-50", "51-65", "65+"],
    datasets: [
      {
        label: "Number of Patients",
        data: [10, 35, 22, 18, 8],
        backgroundColor: ["#a3e635", "#65a30d", "#4d7c0f", "#3f6212", "#365314"],
      },
    ],
  };

  // 📌 Updated Gender Distribution Data
  const genderData = {
    labels: ["Female", "Male", "Other"],
    datasets: [
      {
        data: [60, 35, 5],
        backgroundColor: ["#60a5fa", "#facc15", "#ef4444"],
      },
    ],
  };

  // 📌 New Dermatological Conditions Data
  const conditionsData = {
    labels: ["Eczema", "Acne", "Psoriasis", "Rosacea", "Vitiligo", "Melasma", "Skin Cancer"],
    datasets: [
      {
        label: "Number of Patients",
        data: [20, 30, 12, 9, 6, 7, 4],
        backgroundColor: "#0ea5e9",
      },
    ],
  };

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

      {/* 📊 Charts Section */}
      <TabsContent value="charts" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Age Distribution */}
          {/* Age Distribution */}
<Card>
  <CardContent className="p-6">
    <h3 className="text-lg font-semibold text-green-700 mb-4">Age Distribution</h3>
    <Pie data={{
        labels: ["0-18", "19-35", "36-50", "51-65", "65+"],
        datasets: [
          {
            data: [10, 35, 22, 18, 8], // Adjusted values
            backgroundColor: ["#a3e635", "#65a30d", "#4d7c0f", "#3f6212", "#365314"],
          },
        ],
      }} 
      options={{ responsive: true }} 
    />
  </CardContent>
</Card>



          {/* Gender Distribution */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-green-700 mb-4">Gender Distribution</h3>
              <Pie data={genderData} options={{ responsive: true }} />
            </CardContent>
          </Card>

          {/* Dermatological Conditions Distribution */}
          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-green-700 mb-4">Common Dermatological Conditions</h3>
              <Bar
                data={conditionsData}
                options={{
                  responsive: true,
                  indexAxis: "y",
                  plugins: { legend: { display: false } },
                }}
              />
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* 📌 Statistics Section */}
      <TabsContent value="stats">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-green-700 mb-4">Patient Demographic Insights</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Most Common Age Group:</strong> 19-35 years old</li>
              <li><strong>Gender Majority:</strong> Female patients (60%)</li>
              <li><strong>Most Prevalent Condition:</strong> Acne (30 patients)</li>
              <li><strong>Less Common Conditions:</strong> Vitiligo (6), Skin Cancer (4)</li>
              <li><strong>Other Observations:</strong> Younger patients (19-35) mostly report acne and eczema</li>
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}



