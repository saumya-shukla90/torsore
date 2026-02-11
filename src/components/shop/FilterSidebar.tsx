import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface FilterSidebarProps {
  filters: {
    categories: string[];
    colors: string[];
    sizes: string[];
    priceRange: [number, number];
  };
  onFilterChange: (filters: FilterSidebarProps["filters"]) => void;
  onClearFilters: () => void;
}

const CATEGORIES = [
  "Wedding Dresses",
  "Bridal Gowns",
  "Party Dresses",
  "Evening Gowns",
  "Festival Wear",
  "Cocktail Dresses",
];

const COLORS = [
  { name: "White", value: "#FFFFFF" },
  { name: "Ivory", value: "#FFFFF0" },
  { name: "Champagne", value: "#F7E7CE" },
  { name: "Blush", value: "#FFB6C1" },
  { name: "Gold", value: "#D4AF37" },
  { name: "Silver", value: "#C0C0C0" },
  { name: "Navy", value: "#1E3A5F" },
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#DC143C" },
  { name: "Burgundy", value: "#800020" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Custom"];

export function FilterSidebar({ filters, onFilterChange, onClearFilters }: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    color: true,
    size: true,
  });

  const toggleCategory = (category: string) => {
    const updated = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFilterChange({ ...filters, categories: updated });
  };

  const toggleColor = (color: string) => {
    const updated = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onFilterChange({ ...filters, colors: updated });
  };

  const toggleSize = (size: string) => {
    const updated = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ ...filters, sizes: updated });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.colors.length > 0 ||
    filters.sizes.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 10000;

  return (
    <aside className="w-full lg:w-72 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-foreground">Filters</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-muted-foreground">
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <Collapsible
        open={openSections.category}
        onOpenChange={(open) => setOpenSections({ ...openSections, category: open })}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b border-border">
          <span className="font-medium text-foreground">Category</span>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform ${
              openSections.category ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-3">
          {CATEGORIES.map((category) => (
            <label key={category} className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={filters.categories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {category}
              </span>
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Price Filter */}
      <Collapsible
        open={openSections.price}
        onOpenChange={(open) => setOpenSections({ ...openSections, price: open })}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b border-border">
          <span className="font-medium text-foreground">Price Range</span>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform ${
              openSections.price ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-6 px-2">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) =>
              onFilterChange({ ...filters, priceRange: value as [number, number] })
            }
            min={0}
            max={10000}
            step={100}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">${filters.priceRange[0].toLocaleString()}</span>
            <span className="text-muted-foreground">${filters.priceRange[1].toLocaleString()}</span>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Color Filter */}
      <Collapsible
        open={openSections.color}
        onOpenChange={(open) => setOpenSections({ ...openSections, color: open })}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b border-border">
          <span className="font-medium text-foreground">Color</span>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform ${
              openSections.color ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <div className="flex flex-wrap gap-2">
            {COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => toggleColor(color.name)}
                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                  filters.colors.includes(color.name)
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
          {filters.colors.length > 0 && (
            <p className="text-xs text-muted-foreground mt-3">
              Selected: {filters.colors.join(", ")}
            </p>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Size Filter */}
      <Collapsible
        open={openSections.size}
        onOpenChange={(open) => setOpenSections({ ...openSections, size: open })}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b border-border">
          <span className="font-medium text-foreground">Size</span>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform ${
              openSections.size ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <div className="flex flex-wrap gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-4 py-2 text-sm rounded-md border transition-all ${
                  filters.sizes.includes(size)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </aside>
  );
}
