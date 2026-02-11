import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Placeholder products - will be replaced with database data
const products = [
  {
    id: 1,
    name: "Celestine Bridal Gown",
    price: 2499,
    originalPrice: 2999,
    image: "https://images.unsplash.com/photo-1585241936939-be4099591252?w=600&q=80",
    category: "Wedding",
    isNew: true,
  },
  {
    id: 2,
    name: "Aurora Evening Dress",
    price: 899,
    image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=600&q=80",
    category: "Party",
    isNew: true,
  },
  {
    id: 3,
    name: "Seraphina Cocktail Dress",
    price: 649,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
    category: "Party",
    isNew: true,
  },
  {
    id: 4,
    name: "Maharani Festive Lehenga",
    price: 1299,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
    category: "Festival",
    isNew: true,
  },
];

export function NewArrivals() {
  return (
    <section className="py-20 md:py-28 bg-cream">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <p className="text-primary font-medium tracking-widest uppercase mb-4">
              Fresh Styles
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold">
              New Arrivals
            </h2>
          </div>
          <Link to="/shop?sort=new">
            <Button variant="outline" className="group">
              View All New Arrivals
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="group bg-card rounded-xl overflow-hidden shadow-card hover-lift">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                        New
                      </span>
                    )}
                    {product.originalPrice && (
                      <span className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-medium rounded-full">
                        Sale
                      </span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Heart className="h-5 w-5" />
                    </button>
                    <button className="h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Add to Cart Overlay */}
                  <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <p className="text-xs text-primary font-medium uppercase tracking-wider mb-2">
                    {product.category}
                  </p>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-serif text-lg font-semibold mb-2 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-foreground">
                      ${product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
