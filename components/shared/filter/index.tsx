import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const bedroomOptions = [
  { value: "any", label: "Any bedrooms" },
  { value: "1", label: "1 bedroom" },
  { value: "2", label: "2 bedrooms" },
  { value: "3", label: "3 bedrooms" },
  { value: "4", label: "4 bedrooms" },
];

const bathroomOptions = [
  { value: "any", label: "Any bathrooms" },
  { value: "1", label: "1 bathroom" },
  { value: "2", label: "2 bathrooms" },
  { value: "3", label: "3 bathrooms" },
  { value: "4", label: "4 bathrooms" },
];

interface ApartmentFilterProps {
  fetch: (filter: any) => Promise<void>;
}

export default function ApartmentFilter({ fetch }: ApartmentFilterProps) {
  const [bedroom, setBedroom] = useState("");
  const [bathroom, setBathroom] = useState("");
  const [customBedroom, setCustomBedroom] = useState("");

  const handleFilterApply = async () => {
    await fetch({
      bedroom: bedroom === "custom" ? customBedroom : bedroom,
      bathroom,
    });
  };

  const handleClearFilters = () => {
    setBedroom("");
    setBathroom("");
    setCustomBedroom("");
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-wrap sm:flex-row items-center rounded-lg bg-background">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Select
          value={bedroom}
          onValueChange={(value) => {
            setBedroom(value);
            if (value !== "custom") setCustomBedroom("");
          }}
        >
          <SelectTrigger id="bedrooms" className="w-full sm:w-[200px]">
            <SelectValue placeholder="Any bedrooms" />
          </SelectTrigger>
          <SelectContent>
            {bedroomOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        {bedroom === "custom" && (
          <Input
            type="number"
            placeholder="Enter bedrooms"
            value={customBedroom}
            onChange={(e) => setCustomBedroom(e.target.value)}
            className="w-[100px]"
          />
        )}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Select
          value={bathroom}
          onValueChange={(value) => {
            setBathroom(value);
          }}
        >
          <SelectTrigger id="bathrooms" className="w-full sm:w-[200px]">
            <SelectValue placeholder="Any bathrooms" />
          </SelectTrigger>
          <SelectContent>
            {bathroomOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 w-full sm:w-auto justify-end sm:justify-start">
        <Button onClick={handleFilterApply} className="w-full sm:w-auto">
          Apply
        </Button>
        <Button
          variant="outline"
          onClick={handleClearFilters}
          className="w-full sm:w-auto"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
