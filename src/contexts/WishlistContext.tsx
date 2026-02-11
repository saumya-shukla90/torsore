 import { createContext, useContext, useState, useEffect, ReactNode } from "react";
 import { supabase } from "@/integrations/supabase/client";
 import { useAuth } from "@/contexts/AuthContext";
 import { toast } from "@/hooks/use-toast";
 
 interface WishlistContextType {
   wishlistItems: string[];
   isLoading: boolean;
   isInWishlist: (productId: string) => boolean;
   toggleWishlist: (productId: string) => Promise<void>;
   clearWishlist: () => Promise<void>;
 }
 
 const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
 
 export function WishlistProvider({ children }: { children: ReactNode }) {
   const [wishlistItems, setWishlistItems] = useState<string[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const { user } = useAuth();
 
   // Fetch wishlist from database when user logs in
   useEffect(() => {
     if (user) {
       fetchWishlist();
     } else {
       // Load from localStorage for non-authenticated users
       const stored = localStorage.getItem("wishlist");
       if (stored) {
         setWishlistItems(JSON.parse(stored));
       }
     }
   }, [user]);
 
   const fetchWishlist = async () => {
     if (!user) return;
     
     setIsLoading(true);
     try {
       const { data, error } = await supabase
         .from("wishlist_items")
         .select("product_id")
         .eq("user_id", user.id);
 
       if (error) throw error;
       setWishlistItems(data.map((item) => item.product_id));
     } catch (error) {
       console.error("Error fetching wishlist:", error);
     } finally {
       setIsLoading(false);
     }
   };
 
   const isInWishlist = (productId: string) => {
     return wishlistItems.includes(productId);
   };
 
   const toggleWishlist = async (productId: string) => {
     const isCurrentlyWishlisted = isInWishlist(productId);
 
     if (user) {
       // Authenticated user - persist to database
       try {
         if (isCurrentlyWishlisted) {
           const { error } = await supabase
             .from("wishlist_items")
             .delete()
             .eq("user_id", user.id)
             .eq("product_id", productId);
 
           if (error) throw error;
           setWishlistItems((prev) => prev.filter((id) => id !== productId));
           toast({
             title: "Removed from wishlist",
             description: "Item has been removed from your wishlist.",
           });
         } else {
           const { error } = await supabase
             .from("wishlist_items")
             .insert({ user_id: user.id, product_id: productId });
 
           if (error) throw error;
           setWishlistItems((prev) => [...prev, productId]);
           toast({
             title: "Added to wishlist",
             description: "Item has been added to your wishlist.",
           });
         }
       } catch (error) {
         console.error("Error updating wishlist:", error);
         toast({
           title: "Error",
           description: "Failed to update wishlist. Please try again.",
           variant: "destructive",
         });
       }
     } else {
       // Non-authenticated user - use localStorage
       let newItems: string[];
       if (isCurrentlyWishlisted) {
         newItems = wishlistItems.filter((id) => id !== productId);
         toast({
           title: "Removed from wishlist",
           description: "Item has been removed from your wishlist.",
         });
       } else {
         newItems = [...wishlistItems, productId];
         toast({
           title: "Added to wishlist",
           description: "Sign in to save your wishlist permanently.",
         });
       }
       setWishlistItems(newItems);
       localStorage.setItem("wishlist", JSON.stringify(newItems));
     }
   };
 
   const clearWishlist = async () => {
     if (user) {
       try {
         const { error } = await supabase
           .from("wishlist_items")
           .delete()
           .eq("user_id", user.id);
 
         if (error) throw error;
         setWishlistItems([]);
       } catch (error) {
         console.error("Error clearing wishlist:", error);
       }
     } else {
       setWishlistItems([]);
       localStorage.removeItem("wishlist");
     }
   };
 
   return (
     <WishlistContext.Provider
       value={{
         wishlistItems,
         isLoading,
         isInWishlist,
         toggleWishlist,
         clearWishlist,
       }}
     >
       {children}
     </WishlistContext.Provider>
   );
 }
 
 export function useWishlist() {
   const context = useContext(WishlistContext);
   if (context === undefined) {
     throw new Error("useWishlist must be used within a WishlistProvider");
   }
   return context;
 }