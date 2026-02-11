 import { motion } from "framer-motion";
 import { ProductCard, Product } from "@/components/shop/ProductCard";
 
 interface RelatedProductsProps {
   products: Product[];
 }
 
 export function RelatedProducts({ products }: RelatedProductsProps) {
   return (
     <section className="py-16 px-4">
       <div className="max-w-7xl mx-auto">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-10"
         >
           <h2 className="font-serif text-3xl text-foreground mb-4">You May Also Like</h2>
           <p className="text-muted-foreground">
             Explore similar styles from our collection
           </p>
         </motion.div>
 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
           {products.map((product, index) => (
             <motion.div
               key={product.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.1 }}
             >
               <ProductCard product={product} />
             </motion.div>
           ))}
         </div>
       </div>
     </section>
   );
 }
