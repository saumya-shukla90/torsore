import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Check, ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "@/hooks/use-toast";
import type { Product } from "./ProductCard";

const colorNames: Record<string, string> = {
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
  "#228B22": "Emerald",
};

interface QuickViewModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickViewModal({ product, open, onOpenChange }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);

  const images = [product.image, product.hoverImage].filter(Boolean) as string[];

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast({
        title: "Please select options",
        description: "Choose a size and color before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    addItem(product, selectedSize, colorNames[selectedColor] || selectedColor, 1);
    onOpenChange(false);
    setSelectedSize("");
    setSelectedColor("");
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const nextImage = () => setCurrentImageIndex((i) => (i + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 gap-0 overflow-hidden max-h-[90vh]">
        <div className="grid md:grid-cols-2">
          {/* Image Gallery */}
          <div className="relative aspect-[3/4] md:aspect-auto bg-muted overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Image Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentImageIndex ? "bg-primary w-5" : "bg-background/60"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <Badge className="bg-secondary text-secondary-foreground">New</Badge>
              )}
              {product.isSale && discount > 0 && (
                <Badge className="bg-destructive text-destructive-foreground">-{discount}%</Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-6 overflow-y-auto max-h-[80vh] md:max-h-none space-y-5">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {product.category}
              </p>
              <h2 className="font-serif text-2xl text-foreground">{product.name}</h2>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < product.rating ? "text-primary fill-primary" : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.rating})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="font-semibold text-2xl text-foreground">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <Separator />

            {/* Color Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Color</label>
                {selectedColor && (
                  <span className="text-sm text-muted-foreground">
                    {colorNames[selectedColor] || selectedColor}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedColor === color
                        ? "border-primary ring-2 ring-primary ring-offset-2"
                        : "border-border hover:border-primary"
                    }`}
                    style={{ backgroundColor: color }}
                    title={colorNames[color] || color}
                  >
                    {selectedColor === color && (
                      <Check
                        className={`w-4 h-4 ${
                          ["#FFFFFF", "#FFFFF0", "#F7E7CE", "#FFB6C1", "#C0C0C0"].includes(color)
                            ? "text-foreground"
                            : "text-white"
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[2.75rem] px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={handleAddToCart}>
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart
                  className={`w-4 h-4 ${isWishlisted ? "fill-primary text-primary" : ""}`}
                />
              </Button>
            </div>

            <Separator />

            {/* View Full Details Link */}
            <Link
              to={`/product/${product.id}`}
              onClick={() => onOpenChange(false)}
              className="flex items-center justify-center gap-2 text-sm text-primary hover:underline py-1"
            >
              View Full Details
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
