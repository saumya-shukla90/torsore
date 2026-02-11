import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { SizeGuide } from "@/components/product/SizeGuide";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ProductReviews } from "@/components/product/ProductReviews";
import { placeholderProducts } from "@/data/placeholderProducts";
import { ChevronRight } from "lucide-react";
 
 export default function ProductDetail() {
   const { productId } = useParams<{ productId: string }>();
   
   const product = useMemo(() => 
     placeholderProducts.find(p => p.id === productId),
     [productId]
   );
 
   const relatedProducts = useMemo(() => {
     if (!product) return [];
     return placeholderProducts
       .filter(p => p.category === product.category && p.id !== product.id)
       .slice(0, 4);
   }, [product]);
 
   if (!product) {
     return (
       <Layout>
         <div className="min-h-[60vh] flex items-center justify-center">
           <div className="text-center">
             <h1 className="font-serif text-2xl text-foreground mb-4">Product Not Found</h1>
             <Link to="/shop" className="text-primary hover:underline">
               Back to Shop
             </Link>
           </div>
         </div>
       </Layout>
     );
   }
 
   return (
     <Layout>
       {/* Breadcrumb */}
       <nav className="py-4 px-4 max-w-7xl mx-auto">
         <ol className="flex items-center gap-2 text-sm text-muted-foreground">
           <li>
             <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
           </li>
           <ChevronRight className="w-4 h-4" />
           <li>
             <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
           </li>
           <ChevronRight className="w-4 h-4" />
           <li>
             <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-foreground transition-colors">
               {product.category}
             </Link>
           </li>
           <ChevronRight className="w-4 h-4" />
           <li className="text-foreground font-medium truncate max-w-[200px]">{product.name}</li>
         </ol>
       </nav>
 
       {/* Product Section */}
       <section className="py-8 px-4">
         <div className="max-w-7xl mx-auto">
           <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
             <ProductGallery product={product} />
             <ProductInfo product={product} />
           </div>
         </div>
       </section>
 
        {/* Size Guide */}
        <SizeGuide />

        {/* Product Reviews */}
        <ProductReviews productId={product.id} productName={product.name} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </Layout>
   );
 }