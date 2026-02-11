import { motion } from "framer-motion";
import { Truck, Shield, RefreshCcw, Headphones, Award, Heart } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Complimentary shipping on orders over $500",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure payment with SSL encryption",
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    description: "14-day hassle-free return policy",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated customer service team",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Handcrafted with finest materials",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every piece tells a story",
  },
];

export function Features() {
  return (
    <section className="py-16 bg-muted/50 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-serif font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
