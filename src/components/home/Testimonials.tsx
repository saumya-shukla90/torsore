import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Bride",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    rating: 5,
    text: "My wedding dress from Torsore was absolutely stunning. The attention to detail and the quality of craftsmanship exceeded all my expectations. I felt like a princess on my special day!",
  },
  {
    id: 2,
    name: "Emily Chen",
    role: "Event Planner",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    rating: 5,
    text: "As an event planner, I've recommended Torsore to countless clients. Their party wear collection is unmatched in elegance and style. Every client has been thrilled with their purchase.",
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "Fashion Influencer",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    rating: 5,
    text: "The festival collection at Torsore beautifully blends tradition with contemporary fashion. I've received so many compliments on my outfits. Absolutely love the quality!",
  },
  {
    id: 4,
    name: "Amanda Foster",
    role: "Mother of the Bride",
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&q=80",
    rating: 5,
    text: "Finding the perfect dress for my daughter's wedding was a joy at Torsore. The team was incredibly helpful, and the dress exceeded our dreams. Highly recommend!",
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 md:py-28 bg-secondary text-secondary-foreground overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-medium tracking-widest uppercase mb-4">
            Happy Clients
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold">
            What Our Customers Say
          </h2>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Quote className="h-12 w-12 mx-auto text-primary/50 mb-8" />
              
              <p className="text-xl md:text-2xl leading-relaxed mb-10 text-secondary-foreground/90">
                "{testimonials[currentIndex].text}"
              </p>

              <div className="flex justify-center gap-1 mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>

              <div className="flex items-center justify-center gap-4">
                <img
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                />
                <div className="text-left">
                  <h4 className="font-serif text-lg font-semibold">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-secondary-foreground/70">
                    {testimonials[currentIndex].role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-12">
            <button
              onClick={prevTestimonial}
              className="h-12 w-12 rounded-full border border-primary/30 flex items-center justify-center text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextTestimonial}
              className="h-12 w-12 rounded-full border border-primary/30 flex items-center justify-center text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-secondary-foreground/30 hover:bg-secondary-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
