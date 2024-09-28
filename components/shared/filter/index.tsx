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
];

interface ApartmentFilterProps {
  fetch: (filter: any) => Promise<void>;
}

export default function ApartmentFilter({ fetch }: ApartmentFilterProps) {
  const [bedroom, setBedroom] = useState("");
  const [bathroom, setBathroom] = useState("");
  const [customBedroom, setCustomBedroom] = useState("");
  const [customBathroom, setCustomBathroom] = useState("");

  const handleFilterApply = async () => {
    await fetch({
      bedroom: bedroom === "custom" ? customBedroom : bedroom,
      bathroom: bathroom === "custom" ? customBathroom : bathroom,
    });
  };

  const handleClearFilters = () => {
    setBedroom("");
    setBathroom("");
    setCustomBedroom("");
    setCustomBathroom("");
  };

  return (
    <div className="flex flex-wrap gap-4 items-center p-4 rounded-lg bg-background">
      <div className=" flex items-center gap-2">
        <Select
          value={bedroom}
          onValueChange={(value) => {
            setBedroom(value);
            if (value !== "custom") setCustomBedroom("");
          }}
        >
          <SelectTrigger id="bedrooms" className="w-[200px]">
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

      <div className=" flex items-center gap-2">
        <Select
          value={bathroom}
          onValueChange={(value) => {
            setBathroom(value);
            if (value !== "custom") setCustomBathroom("");
          }}
        >
          <SelectTrigger id="bathrooms" className="w-[200px]">
            <SelectValue placeholder="Any bathrooms" />
          </SelectTrigger>
          <SelectContent>
            {bathroomOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        {bathroom === "custom" && (
          <Input
            type="number"
            placeholder="Enter bathrooms"
            value={customBathroom}
            onChange={(e) => setCustomBathroom(e.target.value)}
            className="w-[100px]"
          />
        )}
      </div>
      <Button onClick={handleFilterApply}>Apply</Button>
      <Button variant="outline" onClick={handleClearFilters}>
        Clear Filters
      </Button>
    </div>
  );
}
