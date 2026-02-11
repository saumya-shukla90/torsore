import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Eye, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "@/hooks/use-toast";
import { QuickViewModal } from "./QuickViewModal";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  category: string;
  colors: string[];
  sizes: string[];
  isNew?: boolean;
  isSale?: boolean;
  rating: number;
}

interface ProductCardProps {
  product: Product;
}

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

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const { addItem } = useCart();
   const { isInWishlist, toggleWishlist } = useWishlist();
 
   const isWishlisted = isInWishlist(product.id);

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
    setIsDialogOpen(false);
    setSelectedSize("");
    setSelectedColor("");
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const openAddToCartDialog = () => {
    setSelectedSize(product.sizes[0] || "");
    setSelectedColor(product.colors[0] || "");
    setIsDialogOpen(true);
  };

  return (
    <>
      <motion.div
        className="group relative bg-card rounded-lg overflow-hidden shadow-card hover-lift"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={isHovered && product.hoverImage ? product.hoverImage : product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-secondary text-secondary-foreground">New</Badge>
            )}
            {product.isSale && discount > 0 && (
              <Badge className="bg-destructive text-destructive-foreground">-{discount}%</Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product.id)}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-background hover:scale-110"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isWishlisted ? "fill-primary text-primary" : "text-foreground"
              }`}
            />
          </button>

          {/* Quick Actions */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={openAddToCartDialog}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button size="sm" variant="outline" className="bg-background/80" onClick={() => setIsQuickViewOpen(true)}>
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {product.category}
          </p>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-serif text-lg text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Colors */}
          <div className="flex gap-1 mb-3">
            {product.colors.slice(0, 4).map((color, index) => (
              <span
                key={index}
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: color }}
                title={colorNames[color] || color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-muted-foreground">+{product.colors.length - 4}</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg text-foreground">
              ${product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${
                  i < product.rating ? "text-primary fill-primary" : "text-muted"
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Add to Cart Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby="product-dialog-description">
          <DialogHeader>
            <DialogTitle className="font-serif">{product.name}</DialogTitle>
            <DialogDescription id="product-dialog-description">Select your size and color</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Product Preview */}
            <div className="flex gap-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-24 h-32 object-cover rounded-lg"
              />
              <div>
                <p className="text-sm text-muted-foreground">{product.category}</p>
                <p className="font-semibold text-lg">${product.price.toLocaleString()}</p>
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
                    className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
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

            {/* Color Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Color</label>
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
                      <Check className={`w-5 h-5 ${color === "#FFFFFF" || color === "#FFFFF0" || color === "#F7E7CE" || color === "#FFB6C1" || color === "#C0C0C0" ? "text-foreground" : "text-white"}`} />
                    )}
                  </button>
                ))}
              </div>
              {selectedColor && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {colorNames[selectedColor] || selectedColor}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleAddToCart}>
              <ShoppingBag className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        open={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
      />
    </>
  );
}
