import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

const instagramPosts = [
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80",
  "https://images.unsplash.com/photo-1519657337289-077653f724ed?w=400&q=80",
  "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=400&q=80",
  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80",
  "https://images.unsplash.com/photo-1585241936939-be4099591252?w=400&q=80",
  "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&q=80",
];

export function InstagramFeed() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-primary font-medium tracking-widest uppercase mb-4">
            Follow Us
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            @torsore on Instagram
          </h2>
          <p className="text-muted-foreground">
            Share your Torsore moments with #TorsoreMoments
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post, index) => (
            <motion.a
              key={index}
              href="https://instagram.com/torsore"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative aspect-square overflow-hidden rounded-lg"
            >
              <img
                src={post}
                alt={`Instagram post ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-secondary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Instagram className="h-8 w-8 text-white" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
