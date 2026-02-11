 import { Link } from "react-router-dom";
 import { Layout } from "@/components/layout/Layout";
 import { ProductCard } from "@/components/shop/ProductCard";
 import { Button } from "@/components/ui/button";
 import { useWishlist } from "@/contexts/WishlistContext";
 import { placeholderProducts } from "@/data/placeholderProducts";
 import { Heart, ShoppingBag } from "lucide-react";
 import { motion } from "framer-motion";
 
 export default function Wishlist() {
   const { wishlistItems, isLoading, clearWishlist } = useWishlist();
 
   const wishlistedProducts = placeholderProducts.filter((product) =>
     wishlistItems.includes(product.id)
   );
 
   if (isLoading) {
     return (
       <Layout>
         <div className="min-h-[60vh] flex items-center justify-center">
           <div className="animate-pulse text-muted-foreground">Loading wishlist...</div>
         </div>
       </Layout>
     );
   }
 
   return (
     <Layout>
       <section className="py-12 px-4">
         <div className="max-w-7xl mx-auto">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-center mb-12"
           >
             <h1 className="font-serif text-4xl text-foreground mb-4">My Wishlist</h1>
             <p className="text-muted-foreground">
               {wishlistedProducts.length === 0
                 ? "Your wishlist is empty"
                 : `${wishlistedProducts.length} item${wishlistedProducts.length !== 1 ? "s" : ""} saved`}
             </p>
           </motion.div>
 
           {wishlistedProducts.length === 0 ? (
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="text-center py-16"
             >
               <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
               <h2 className="font-serif text-2xl text-foreground mb-4">
                 Start building your wishlist
               </h2>
               <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                 Click the heart icon on any product to save it for later. Your favorites will appear here.
               </p>
               <Button asChild>
                 <Link to="/shop">
                   <ShoppingBag className="w-4 h-4 mr-2" />
                   Browse Collection
                 </Link>
               </Button>
             </motion.div>
           ) : (
             <>
               <div className="flex justify-end mb-6">
                 <Button variant="outline" onClick={clearWishlist}>
                   Clear Wishlist
                 </Button>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {wishlistedProducts.map((product, index) => (
                   <motion.div
                     key={product.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: index * 0.05 }}
                   >
                     <ProductCard product={product} />
                   </motion.div>
                 ))}
               </div>
             </>
           )}
         </div>
       </section>
     </Layout>
   );
 }