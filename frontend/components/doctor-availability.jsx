import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const doctors = [
  {
    id: 1,
    name: "Dr. Lady Gaga",
    specialty: "Dermatologist",
    status: "Available",
    location: "Main Clinic",
    nextAvailable: "Now",
    initials: "LG",
  },
  {
    id: 2,
    name: "Dr. Ariana Grande",
    specialty: "Dermatologist",
    status: "Available",
    location: "East Wing",
    nextAvailable: "2:30 PM",
    initials: "AG",
  },
  {
    id: 3,
    name: "Dr. Beyonce Knowles",
    specialty: "Dermatologist",
    status: "Available",
    location: "Children's Ward",
    nextAvailable: "3:15 PM",
    initials: "BK",
  },
];


export default function DoctorAvailability() {
  // Filter only available doctors
  const availableDoctors = doctors.filter((doctor) => doctor.status === "Available");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {availableDoctors.map((doctor) => (
        <div
          key={doctor.id}
          className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:border-green-100 transition-colors"
        >
          <div className="p-4 text-center">
            <Avatar className="h-20 w-20 mx-auto mb-3">
              {/* Let AvatarImage handle the DiceBear URL generation */}
              <AvatarImage name={doctor.name} alt={doctor.name} />
              <AvatarFallback className="bg-green-100 text-green-700 text-xl">
                {doctor.initials}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-medium text-lg">{doctor.name}</h3>
            <p className="text-gray-500 text-sm">{doctor.specialty}</p>

            <div className="mt-3 flex justify-center">
              <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                {doctor.status}
              </Badge>
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {doctor.location}
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                Next available: {doctor.nextAvailable}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                Profile
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}