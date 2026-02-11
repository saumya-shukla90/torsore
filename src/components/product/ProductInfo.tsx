 import { useState } from "react";
 import { ShoppingBag, Heart, Share2, Truck, RotateCcw, Shield, Check } from "lucide-react";
 import { motion } from "framer-motion";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import { Separator } from "@/components/ui/separator";
 import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
 import { Product } from "@/components/shop/ProductCard";
 import { useCart } from "@/contexts/CartContext";
 import { useWishlist } from "@/contexts/WishlistContext";
 import { toast } from "@/hooks/use-toast";
 
 interface ProductInfoProps {
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
 
 export function ProductInfo({ product }: ProductInfoProps) {
   const [selectedSize, setSelectedSize] = useState<string>("");
   const [selectedColor, setSelectedColor] = useState<string>("");
   const [quantity, setQuantity] = useState(1);
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
 
     addItem(product, selectedSize, colorNames[selectedColor] || selectedColor, quantity);
     toast({
       title: "Added to cart",
       description: `${product.name} has been added to your cart.`,
     });
   };
 
   return (
     <div className="space-y-6">
       {/* Category & Badges */}
       <div className="flex items-center gap-2">
         <span className="text-sm text-muted-foreground uppercase tracking-wider">
           {product.category}
         </span>
         {product.isNew && (
           <Badge className="bg-secondary text-secondary-foreground">New</Badge>
         )}
         {product.isSale && discount > 0 && (
           <Badge className="bg-destructive text-destructive-foreground">-{discount}%</Badge>
         )}
       </div>
 
       {/* Title */}
       <h1 className="font-serif text-3xl md:text-4xl text-foreground">{product.name}</h1>
 
       {/* Rating */}
       <div className="flex items-center gap-2">
         <div className="flex items-center">
           {[...Array(5)].map((_, i) => (
             <svg
               key={i}
               className={`w-4 h-4 ${
                 i < product.rating ? "text-primary fill-primary" : "text-muted"
               }`}
               viewBox="0 0 20 20"
             >
               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
             </svg>
           ))}
         </div>
         <span className="text-sm text-muted-foreground">({product.rating} reviews)</span>
       </div>
 
       {/* Price */}
       <div className="flex items-center gap-3">
         <span className="font-semibold text-3xl text-foreground">
           ${product.price.toLocaleString()}
         </span>
         {product.originalPrice && (
           <span className="text-xl text-muted-foreground line-through">
             ${product.originalPrice.toLocaleString()}
           </span>
         )}
       </div>
 
       <Separator />
 
       {/* Color Selection */}
       <div>
         <div className="flex items-center justify-between mb-3">
           <label className="text-sm font-medium">Color</label>
           {selectedColor && (
             <span className="text-sm text-muted-foreground">
               {colorNames[selectedColor] || selectedColor}
             </span>
           )}
         </div>
         <div className="flex flex-wrap gap-3">
           {product.colors.map((color) => (
             <button
               key={color}
               onClick={() => setSelectedColor(color)}
               className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                 selectedColor === color
                   ? "border-primary ring-2 ring-primary ring-offset-2"
                   : "border-border hover:border-primary"
               }`}
               style={{ backgroundColor: color }}
               title={colorNames[color] || color}
             >
               {selectedColor === color && (
                 <Check
                   className={`w-5 h-5 ${
                     color === "#FFFFFF" ||
                     color === "#FFFFF0" ||
                     color === "#F7E7CE" ||
                     color === "#FFB6C1" ||
                     color === "#C0C0C0"
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
         <div className="flex items-center justify-between mb-3">
           <label className="text-sm font-medium">Size</label>
           <button className="text-sm text-primary hover:underline">Size Guide</button>
         </div>
         <div className="flex flex-wrap gap-2">
           {product.sizes.map((size) => (
             <button
               key={size}
               onClick={() => setSelectedSize(size)}
               className={`min-w-[3rem] px-4 py-3 rounded-md border text-sm font-medium transition-colors ${
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
 
       {/* Quantity */}
       <div>
         <label className="text-sm font-medium mb-3 block">Quantity</label>
         <div className="flex items-center gap-3">
           <div className="flex items-center border border-border rounded-md">
             <button
               onClick={() => setQuantity(Math.max(1, quantity - 1))}
               className="px-4 py-2 hover:bg-muted transition-colors"
             >
               -
             </button>
             <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
             <button
               onClick={() => setQuantity(quantity + 1)}
               className="px-4 py-2 hover:bg-muted transition-colors"
             >
               +
             </button>
           </div>
         </div>
       </div>
 
       {/* Action Buttons */}
       <div className="flex gap-3">
         <Button size="lg" className="flex-1" onClick={handleAddToCart}>
           <ShoppingBag className="w-5 h-5 mr-2" />
           Add to Cart
         </Button>
         <Button
           size="lg"
           variant="outline"
          onClick={() => toggleWishlist(product.id)}
         >
           <Heart
             className={`w-5 h-5 ${isWishlisted ? "fill-primary text-primary" : ""}`}
           />
         </Button>
         <Button size="lg" variant="outline">
           <Share2 className="w-5 h-5" />
         </Button>
       </div>
 
       {/* Trust Badges */}
       <div className="grid grid-cols-3 gap-4 py-4">
         <div className="flex flex-col items-center text-center">
           <Truck className="w-6 h-6 text-primary mb-2" />
           <span className="text-xs text-muted-foreground">Free Shipping</span>
         </div>
         <div className="flex flex-col items-center text-center">
           <RotateCcw className="w-6 h-6 text-primary mb-2" />
           <span className="text-xs text-muted-foreground">14-Day Returns</span>
         </div>
         <div className="flex flex-col items-center text-center">
           <Shield className="w-6 h-6 text-primary mb-2" />
           <span className="text-xs text-muted-foreground">Secure Payment</span>
         </div>
       </div>
 
       <Separator />
 
       {/* Product Details Accordion */}
       <Accordion type="single" collapsible defaultValue="description">
         <AccordionItem value="description">
           <AccordionTrigger>Description</AccordionTrigger>
           <AccordionContent>
             <p className="text-muted-foreground leading-relaxed">
               This stunning {product.name.toLowerCase()} is crafted with meticulous attention to detail, 
               featuring premium fabrics and expert tailoring. Perfect for making a lasting impression 
               at your special occasion. The elegant silhouette flatters every figure while the 
               luxurious materials ensure all-day comfort.
             </p>
           </AccordionContent>
         </AccordionItem>
         <AccordionItem value="details">
           <AccordionTrigger>Product Details</AccordionTrigger>
           <AccordionContent>
             <ul className="space-y-2 text-muted-foreground">
               <li>• Premium quality fabric</li>
               <li>• Professional dry clean only</li>
               <li>• Imported materials</li>
               <li>• Hidden back zipper closure</li>
               <li>• Fully lined for comfort</li>
             </ul>
           </AccordionContent>
         </AccordionItem>
         <AccordionItem value="shipping">
           <AccordionTrigger>Shipping & Returns</AccordionTrigger>
           <AccordionContent>
             <div className="space-y-4 text-muted-foreground">
               <p>
                 <strong className="text-foreground">Free Shipping:</strong> On orders over $200
               </p>
               <p>
                 <strong className="text-foreground">Standard Shipping:</strong> 5-7 business days
               </p>
               <p>
                 <strong className="text-foreground">Returns:</strong> We accept returns within 14 days 
                 of delivery. Items must be unworn with original tags attached.
               </p>
             </div>
           </AccordionContent>
         </AccordionItem>
       </Accordion>
     </div>
   );
 }