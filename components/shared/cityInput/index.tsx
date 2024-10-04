import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";

interface CityInputProps {
  onSelect: (city: string) => void;
  clasName?: string;
}

const CityInput: React.FC<CityInputProps> = ({ onSelect, clasName }) => {
  const [query, setQuery] = useState<string>("");
  const [cities, setCities] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isInputActive, setIsInputActive] = useState<boolean>(false);

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      if (query.length > 1) {
        fetchCities();
      } else {
        setCities([]);
        setShowDropdown(false);
      }
    }, 1000);

    setDebounceTimeout(timeout);

    return () => {
      clearTimeout(timeout);
    };
  }, [query]);

  const fetchCities = async () => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=10`
      );
      setCities(res.data);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities([]);
    }
  };

  const handleSelectCity = (city: any) => {
    const cityName = city.display_name;
    setQuery(cityName);
    setShowDropdown(false);
    onSelect(cityName);
  };

  const handleBlur = () => {
    // Delay the hiding of the dropdown to allow click event to complete
    setTimeout(() => {
      setIsInputActive(false);
      setShowDropdown(false); // Hide the dropdown after blur
    }, 200); // Short delay
  };

  return (
    <div className="relative w-full">
      <Input
        id="city"
        name="city"
        className={clasName}
        onChange={(e) => {
          setQuery(e.target.value);
          onSelect(e.target.value);
        }}
        onFocus={() => setIsInputActive(true)}
        onBlur={handleBlur}
        value={query}
        placeholder="City"
        required
      />
      {isInputActive && showDropdown && cities.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md max-h-60 overflow-auto mt-1 shadow-lg">
          {cities.map((city) => (
            <li
              key={city.place_id}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectCity(city)}
            >
              {city.display_name}{" "}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CityInput;
