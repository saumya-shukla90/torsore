import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { placeholderProducts } from "@/data/placeholderProducts";
import { Product } from "@/components/shop/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { Sparkles, Plus, Save, ShoppingCart } from "lucide-react";

type OutfitSlot = "top" | "bottom" | "dupatta" | "outer";

type SavedLook = {
  id: string;
  name: string;
  selections: Partial<Record<OutfitSlot, Product>>;
};

const SAVED_LOOKS_KEY = "torsore-saved-looks";

export default function CustomOutfit() {
  const { addItem } = useCart();
  const [selected, setSelected] = useState<Partial<Record<OutfitSlot, Product>>>({});
  const [savedLooks, setSavedLooks] = useState<SavedLook[]>(() => {
    const raw = localStorage.getItem(SAVED_LOOKS_KEY);
    return raw ? JSON.parse(raw) : [];
  });
  const [saveName, setSaveName] = useState("");

  const [searchText, setSearchText] = useState("");
  const [filterOccasion, setFilterOccasion] = useState<string>("Any");
  const [filterColor, setFilterColor] = useState<string>("Any");
  const [filterPrice, setFilterPrice] = useState<string>("Any");
  const [filterFabric, setFilterFabric] = useState<string>("Any");

  useEffect(() => {
    localStorage.setItem(SAVED_LOOKS_KEY, JSON.stringify(savedLooks));
  }, [savedLooks]);

  const productsBySlot: Record<OutfitSlot, Product[]> = useMemo(() => {
    const byCat = (cats: string[]) =>
      placeholderProducts.filter((p) => cats.some((c) => p.category.toLowerCase().includes(c.toLowerCase())));
    return {
      top: byCat(["bridal", "wedding", "evening", "cocktail", "party", "festival"]),
      bottom: byCat(["festival", "party"]), // demo grouping – using available data
      dupatta: byCat(["festival", "party"]),
      outer: byCat(["evening", "cocktail"]),
    };
  }, []);

  const colorCompatScore = (a?: Product, b?: Product) => {
    if (!a || !b) return 0;
    const aColors = a.colors || [];
    const bColors = b.colors || [];
    return aColors.some((c) => bColors.includes(c)) ? 2 : 1;
  };

  const colorNameMap: Record<string, string> = {
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
    "#228B22": "Green",
  };

  const fabricOf = (p: Product): string => {
    const c = p.category.toLowerCase();
    if (c.includes("bridal") || c.includes("wedding")) return "Silk";
    if (c.includes("evening")) return "Satin";
    if (c.includes("cocktail")) return "Velvet";
    if (c.includes("party")) return "Sequins";
    if (c.includes("festival")) return "Chiffon";
    return "Mixed";
  };

  const filteredProducts = useMemo(() => {
    return placeholderProducts
      .filter((p) =>
        searchText.trim().length === 0
          ? true
          : p.name.toLowerCase().includes(searchText.toLowerCase())
      )
      .filter((p) =>
        filterOccasion === "Any" ? true : p.category.toLowerCase().includes(filterOccasion.toLowerCase())
      )
      .filter((p) => {
        if (filterColor === "Any") return true;
        const names = (p.colors || []).map((hex) => colorNameMap[hex] || hex);
        return names.includes(filterColor);
      })
      .filter((p) => {
        switch (filterPrice) {
          case "Under 800":
            return p.price < 800;
          case "800–1500":
            return p.price >= 800 && p.price <= 1500;
          case "1500+":
            return p.price > 1500;
          default:
            return true;
        }
      })
      .filter((p) => (filterFabric === "Any" ? true : fabricOf(p) === filterFabric));
  }, [searchText, filterOccasion, filterColor, filterPrice, filterFabric]);

  const aiSuggestions: Product[] = useMemo(() => {
    const basis = Object.values(selected).filter(Boolean) as Product[];
    if (basis.length === 0) {
      return placeholderProducts
        .slice()
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 8);
    }
    const avgPrice =
      basis.reduce((sum, p) => sum + (p.price || 0), 0) / Math.max(1, basis.length);
    const scoreFor = (p: Product) => {
      const colorScore = basis.reduce((s, b) => s + colorCompatScore(p, b), 0);
      const categoryScore = basis.reduce(
        (s, b) =>
          s +
          (p.category.split(" ")[0].toLowerCase() ===
          b.category.split(" ")[0].toLowerCase()
            ? 1
            : 0),
        0
      );
      const priceGap = Math.abs((p.price || 0) - avgPrice);
      const priceScore = Math.max(0, 2 - priceGap / 800);
      const ratingScore = p.rating ? p.rating / 5 : 0.5;
      return colorScore * 2 + categoryScore + priceScore + ratingScore;
    };
    return placeholderProducts
      .slice()
      .sort((a, b) => scoreFor(b) - scoreFor(a))
      .slice(0, 8);
  }, [selected, productsBySlot.top]);

  const SmartImage = ({
    src,
    alt,
    className,
    smallHeight,
  }: {
    src: string;
    alt: string;
    className?: string;
    smallHeight?: boolean;
  }) => {
    const qs = (w: number, h?: number) => {
      const url = new URL(src);
      url.searchParams.set("w", String(w));
      if (h) url.searchParams.set("h", String(h));
      url.searchParams.set("fit", "crop");
      return url.toString();
    };
    const h = smallHeight ? 240 : 800;
    const srcSet = [
      `${qs(300, Math.round(h * (300 / 600)))} 300w`,
      `${qs(600, h)} 600w`,
      `${qs(900, Math.round(h * (900 / 600)))} 900w`,
    ].join(", ");
    const sizes = "(max-width: 640px) 300px, (max-width: 1024px) 600px, 900px";
    return (
      <img
        src={qs(600, h)}
        alt={alt}
        className={className}
        loading="lazy"
        decoding="async"
        srcSet={srcSet}
        sizes={sizes}
      />
    );
  };

  const setSelection = (slot: OutfitSlot, productId: string) => {
    const pool = productsBySlot[slot];
    const prod = pool.find((p) => p.id === productId);
    if (prod) setSelected((prev) => ({ ...prev, [slot]: prod }));
  };

  const saveLook = () => {
    const chosen = Object.values(selected).filter(Boolean);
    if (chosen.length === 0) {
      toast({ title: "Nothing selected", description: "Pick items to save your look.", variant: "destructive" });
      return;
    }
    const name = (saveName || "My Look").trim();
    const payload: SavedLook = {
      id: crypto.randomUUID(),
      name,
      selections: selected,
    };
    setSavedLooks((prev) => [payload, ...prev]);
    setSaveName("");
    toast({ title: "Look saved", description: "You can reapply it anytime from Saved Looks." });
  };

  const applyLook = (look: SavedLook) => {
    setSelected(look.selections);
    toast({ title: "Look applied", description: `Loaded: ${look.name}` });
  };

  const addOutfitToCart = () => {
    const items = Object.values(selected).filter(Boolean) as Product[];
    if (items.length === 0) {
      toast({ title: "No outfit selected", description: "Choose items to add to cart.", variant: "destructive" });
      return;
    }
    items.forEach((p) => {
      const size = p.sizes?.[0] || "M";
      const color = p.colors?.[0] || "#FFFFFF";
      addItem(p, size, color, 1);
    });
    toast({ title: "Outfit added", description: "All selected items were added to your cart." });
  };

  const OutfitSelect = ({
    label,
    slot,
  }: {
    label: string;
    slot: OutfitSlot;
  }) => (
    <div className="space-y-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Select value={selected[slot]?.id} onValueChange={(v) => setSelection(slot, v)}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {productsBySlot[slot].map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name} — ${p.price.toLocaleString()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const PreviewTile = ({ p }: { p?: Product }) => (
    <div className="rounded-lg border bg-card overflow-hidden flex items-center justify-center aspect-[3/4]">
      {p ? (
        <SmartImage src={p.image} alt={p.name} className="w-full h-full object-cover" />
      ) : (
        <div className="text-muted-foreground text-sm">Select item</div>
      )}
    </div>
  );

  return (
    <Layout>
      <section className="relative h-64 md:h-80 bg-secondary overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=600&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-secondary/60" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-3 mt-6">Custom Orders</h1>
            <p className="text-white/80 text-lg">Mix & match outfits, save looks, add full sets</p>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8" />

        <div className="mb-8 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Filters & Instant Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Search</span>
                  <Input
                    placeholder="Search styles…"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <AnimatePresence>
                    {searchText.trim().length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="mt-2 rounded-md border bg-popover p-2"
                      >
                        <div className="text-xs text-muted-foreground mb-1">
                          Suggestions
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {placeholderProducts
                            .filter(
                              (p) =>
                                p.name.toLowerCase().includes(searchText.toLowerCase()) ||
                                p.category.toLowerCase().includes(searchText.toLowerCase())
                            )
                            .slice(0, 6)
                            .map((p) => (
                              <motion.button
                                key={p.id}
                                whileTap={{ scale: 0.98 }}
                                className="px-2 py-1 rounded border text-xs hover:bg-muted"
                                onClick={() => setSearchText(p.name)}
                              >
                                {p.name}
                              </motion.button>
                            ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Occasion</span>
                  <Select value={filterOccasion} onValueChange={setFilterOccasion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Occasion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any">Any</SelectItem>
                      <SelectItem value="Wedding">Wedding</SelectItem>
                      <SelectItem value="Bridal">Bridal</SelectItem>
                      <SelectItem value="Evening">Evening</SelectItem>
                      <SelectItem value="Cocktail">Cocktail</SelectItem>
                      <SelectItem value="Party">Party</SelectItem>
                      <SelectItem value="Festival">Festival</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Color</span>
                  <Select value={filterColor} onValueChange={setFilterColor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any">Any</SelectItem>
                      <SelectItem value="White">White</SelectItem>
                      <SelectItem value="Ivory">Ivory</SelectItem>
                      <SelectItem value="Champagne">Champagne</SelectItem>
                      <SelectItem value="Blush">Blush</SelectItem>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                      <SelectItem value="Navy">Navy</SelectItem>
                      <SelectItem value="Black">Black</SelectItem>
                      <SelectItem value="Red">Red</SelectItem>
                      <SelectItem value="Burgundy">Burgundy</SelectItem>
                      <SelectItem value="Green">Green</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Price</span>
                  <Select value={filterPrice} onValueChange={setFilterPrice}>
                    <SelectTrigger>
                      <SelectValue placeholder="Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any">Any</SelectItem>
                      <SelectItem value="Under 800">Under 800</SelectItem>
                      <SelectItem value="800–1500">800–1500</SelectItem>
                      <SelectItem value="1500+">1500+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Fabric</span>
                  <Select value={filterFabric} onValueChange={setFilterFabric}>
                    <SelectTrigger>
                      <SelectValue placeholder="Fabric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any">Any</SelectItem>
                      <SelectItem value="Silk">Silk</SelectItem>
                      <SelectItem value="Satin">Satin</SelectItem>
                      <SelectItem value="Velvet">Velvet</SelectItem>
                      <SelectItem value="Sequins">Sequins</SelectItem>
                      <SelectItem value="Chiffon">Chiffon</SelectItem>
                      <SelectItem value="Mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: selectors */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Select Pieces</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <OutfitSelect label="Top / Dress" slot="top" />
              <OutfitSelect label="Bottom" slot="bottom" />
              <OutfitSelect label="Dupatta" slot="dupatta" />
              <OutfitSelect label="Outer (Coat/Jacket)" slot="outer" />
              <Separator />
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Input
                  placeholder="Name your look"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                />
                <Button onClick={saveLook}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Look
                </Button>
                <Button variant="secondary" onClick={addOutfitToCart}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add Full Outfit to Cart
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right: live preview */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <PreviewTile p={selected.top} />
                <PreviewTile p={selected.outer} />
                <PreviewTile p={selected.bottom} />
                <PreviewTile p={selected.dupatta} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suggestions & Mix-and-Match */}
        <div className="mt-10 grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiSuggestions.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3"
                  >
                    <SmartImage src={p.image} alt={p.name} className="w-14 h-16 rounded object-cover" smallHeight />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">${p.price.toLocaleString()}</div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelected((prev) => ({ ...prev, top: p }))}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Browse & Mix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredProducts.map((p) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border rounded-lg overflow-hidden"
                    >
                      <SmartImage src={p.image} alt={p.name} className="w-full h-36 object-cover" smallHeight />
                      <div className="p-3">
                        <div className="text-sm font-medium line-clamp-1">{p.name}</div>
                        <div className="text-xs text-muted-foreground">${p.price.toLocaleString()}</div>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm" onClick={() => setSelected((prev) => ({ ...prev, top: p }))}>
                            Top
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setSelected((prev) => ({ ...prev, bottom: p }))}>
                            Bottom
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setSelected((prev) => ({ ...prev, dupatta: p }))}>
                            Dupatta
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setSelected((prev) => ({ ...prev, outer: p }))}>
                            Outer
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Saved Looks */}
        {savedLooks.length > 0 && (
          <div className="mt-10">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Saved Looks</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedLooks.map((look) => (
                  <div key={look.id} className="border rounded-lg p-4">
                    <div className="font-medium">{look.name}</div>
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {(["top", "outer", "bottom", "dupatta"] as OutfitSlot[]).map((slot) => {
                        const p = look.selections[slot];
                        return (
                          <div key={slot} className="aspect-square rounded overflow-hidden border">
                            {p ? (
                              <SmartImage src={p.image} alt={p.name} className="w-full h-full object-cover" smallHeight />
                            ) : (
                              <div className="text-[10px] text-center text-muted-foreground pt-4">{slot}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" onClick={() => applyLook(look)}>
                        Apply
                      </Button>
                      <Button size="sm" variant="secondary" onClick={addOutfitToCart}>
                        Add Outfit
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
