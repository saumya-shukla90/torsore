import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { placeholderProducts } from "@/data/placeholderProducts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Grid3X3, LayoutGrid, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type SortOption = "featured" | "newest" | "price-low" | "price-high" | "rating";

export default function Shop() {
  const [filters, setFilters] = useState({
    categories: [] as string[],
    colors: [] as string[],
    sizes: [] as string[],
    priceRange: [0, 10000] as [number, number],
  });
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...placeholderProducts];

    // Filter by category
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }

    // Filter by color
    if (filters.colors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((color) => {
          const colorMap: Record<string, string> = {
            "#FFFFFF": "White",
            "#FFFFF0": "Ivory",
            "#F7E7CE": "Champagne",
            "#FFB6C1": "Blush",
            "#D4AF37": "Gold",
            "#C0C0C0": "Silver",
            "#1E3A5F": "Navy",
            "#000000": "Black",
            "#DC143C": "Red",
            "#800020": "Burgundy",
          };
          return filters.colors.includes(colorMap[color] || "");
        })
      );
    }

    // Filter by size
    if (filters.sizes.length > 0) {
      result = result.filter((p) => p.sizes.some((s) => filters.sizes.includes(s)));
    }

    // Filter by price
    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case "newest":
        result = result.filter((p) => p.isNew).concat(result.filter((p) => !p.isNew));
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [filters, sortBy]);

  const clearFilters = () => {
    setFilters({
      categories: [],
      colors: [],
      sizes: [],
      priceRange: [0, 10000],
    });
  };

  const activeFilterCount =
    filters.categories.length +
    filters.colors.length +
    filters.sizes.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 ? 1 : 0);

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="relative h-64 md:h-80 bg-secondary overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=600&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-secondary/60" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div>
            <motion.h1
              className="font-serif text-4xl md:text-5xl text-white mb-4 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Collection
            </motion.h1>
            <motion.p
              className="text-white/80 text-lg max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Discover exquisite dresses for life's most precious moments
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              <p className="text-muted-foreground">
                Showing <span className="text-foreground font-medium">{filteredProducts.length}</span> products
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content Grid */}
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                onClearFilters={clearFilters}
              />
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              <ProductGrid products={filteredProducts} />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 w-full max-w-sm bg-background z-50 lg:hidden overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-xl">Filters</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <FilterSidebar
                  filters={filters}
                  onFilterChange={setFilters}
                  onClearFilters={clearFilters}
                />
                <div className="mt-8">
                  <Button
                    className="w-full"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    Show {filteredProducts.length} Products
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Layout>
  );
}
