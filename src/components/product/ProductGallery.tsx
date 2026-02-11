 import { useState } from "react";
 import { motion, AnimatePresence } from "framer-motion";
 import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
 import { Product } from "@/components/shop/ProductCard";
 import { Button } from "@/components/ui/button";
 import { Dialog, DialogContent } from "@/components/ui/dialog";
 
 interface ProductGalleryProps {
   product: Product;
 }
 
 export function ProductGallery({ product }: ProductGalleryProps) {
   const [selectedIndex, setSelectedIndex] = useState(0);
   const [isZoomOpen, setIsZoomOpen] = useState(false);
 
   // Create gallery from main image and hover image
   const images = [
     product.image,
     ...(product.hoverImage ? [product.hoverImage] : []),
     // Add more placeholder gallery images for demo
     "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop",
     "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=800&fit=crop",
   ];
 
   const nextImage = () => {
     setSelectedIndex((prev) => (prev + 1) % images.length);
   };
 
   const prevImage = () => {
     setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
   };
 
   return (
     <>
       <div className="space-y-4">
         {/* Main Image */}
         <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden group">
           <AnimatePresence mode="wait">
             <motion.img
               key={selectedIndex}
               src={images[selectedIndex]}
               alt={`${product.name} - Image ${selectedIndex + 1}`}
               className="w-full h-full object-cover"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.3 }}
             />
           </AnimatePresence>
 
           {/* Navigation Arrows */}
           <Button
             variant="ghost"
             size="icon"
             className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
             onClick={prevImage}
           >
             <ChevronLeft className="w-5 h-5" />
           </Button>
           <Button
             variant="ghost"
             size="icon"
             className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
             onClick={nextImage}
           >
             <ChevronRight className="w-5 h-5" />
           </Button>
 
           {/* Zoom Button */}
           <Button
             variant="ghost"
             size="icon"
             className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
             onClick={() => setIsZoomOpen(true)}
           >
             <ZoomIn className="w-5 h-5" />
           </Button>
 
           {/* Image Counter */}
           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
             {selectedIndex + 1} / {images.length}
           </div>
         </div>
 
         {/* Thumbnails */}
         <div className="grid grid-cols-4 gap-3">
           {images.map((image, index) => (
             <button
               key={index}
               onClick={() => setSelectedIndex(index)}
               className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                 selectedIndex === index
                   ? "border-primary ring-2 ring-primary/20"
                   : "border-transparent hover:border-border"
               }`}
             >
               <img
                 src={image}
                 alt={`${product.name} - Thumbnail ${index + 1}`}
                 className="w-full h-full object-cover"
               />
             </button>
           ))}
         </div>
       </div>
 
       {/* Zoom Dialog */}
       <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
         <DialogContent className="max-w-5xl h-[90vh] p-0 bg-background">
           <div className="relative w-full h-full flex items-center justify-center">
             <Button
               variant="ghost"
               size="icon"
               className="absolute top-4 right-4 z-10"
               onClick={() => setIsZoomOpen(false)}
             >
               <X className="w-5 h-5" />
             </Button>
             
             <Button
               variant="ghost"
               size="icon"
               className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/80"
               onClick={prevImage}
             >
               <ChevronLeft className="w-6 h-6" />
             </Button>
             
             <img
               src={images[selectedIndex]}
               alt={`${product.name} - Zoomed`}
               className="max-w-full max-h-full object-contain"
             />
             
             <Button
               variant="ghost"
               size="icon"
               className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/80"
               onClick={nextImage}
             >
               <ChevronRight className="w-6 h-6" />
             </Button>
 
             {/* Thumbnail Strip */}
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
               {images.map((image, index) => (
                 <button
                   key={index}
                   onClick={() => setSelectedIndex(index)}
                   className={`w-16 h-20 rounded overflow-hidden border-2 transition-all ${
                     selectedIndex === index ? "border-primary" : "border-transparent"
                   }`}
                 >
                   <img
                     src={image}
                     alt={`Thumbnail ${index + 1}`}
                     className="w-full h-full object-cover"
                   />
                 </button>
               ))}
             </div>
           </div>
         </DialogContent>
       </Dialog>
     </>
   );
 }