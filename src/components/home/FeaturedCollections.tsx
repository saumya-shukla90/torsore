import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    id: 1,
    name: "Wedding Collection",
    description: "Timeless elegance for your special day",
    image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=800&q=80",
    href: "/shop?category=wedding",
    accent: "bg-primary/20",
  },
  {
    id: 2,
    name: "Party Wear",
    description: "Glamorous designs for unforgettable nights",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80",
    href: "/shop?category=party",
    accent: "bg-secondary/20",
  },
  {
    id: 3,
    name: "Festival",
    description: "Celebrate traditions in style",
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80",
    href: "/shop?category=festival",
    accent: "bg-gold/20",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export function FeaturedCollections() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-medium tracking-widest uppercase mb-4">
            Curated with Love
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Shop by Occasion
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Find the perfect dress for every moment that matters. 
            From fairy-tale weddings to glamorous parties.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {collections.map((collection) => (
            <motion.div key={collection.id} variants={itemVariants}>
              <Link
                to={collection.href}
                className="group block relative h-[500px] rounded-2xl overflow-hidden hover-lift"
              >
                {/* Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${collection.image})` }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/30 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">
                    {collection.name}
                  </h3>
                  <p className="text-white/80 mb-4">{collection.description}</p>
                  <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-4 transition-all">
                    <span>Shop Now</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
