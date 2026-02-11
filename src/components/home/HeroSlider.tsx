import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const slides = [
  {
    id: 1,
    title: "Celebrate Life's Special Moments",
    subtitle: "with Torsore",
    description: "Discover our exquisite collection of wedding dresses crafted with timeless elegance",
    cta: "Shop Wedding Collection",
    ctaLink: "/shop?category=wedding",
    image: "https://images.unsplash.com/photo-1519657337289-077653f724ed?w=1920&q=80",
  },
  {
    id: 2,
    title: "Glamour Redefined",
    subtitle: "Party Wear Collection",
    description: "Turn heads at every event with our stunning party dresses and evening gowns",
    cta: "Explore Party Wear",
    ctaLink: "/shop?category=party",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1920&q=80",
  },
  {
    id: 3,
    title: "Festive Elegance",
    subtitle: "Festival Collection",
    description: "Celebrate traditions in style with our beautiful festival wear collection",
    cta: "Shop Festival Wear",
    ctaLink: "/shop?category=festival",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1920&q=80",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        {slides.map(
          (slide, index) =>
            index === currentSlide && (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 via-secondary/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative h-full container mx-auto px-4 flex items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="max-w-2xl text-white"
                  >
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-primary font-medium mb-4 tracking-widest uppercase"
                    >
                      {slide.subtitle}
                    </motion.p>
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6"
                    >
                      {slide.title}
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-lg md:text-xl text-white/90 mb-8 max-w-lg"
                    >
                      {slide.description}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      <Link to={slide.ctaLink}>
                        <Button
                          size="lg"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
                        >
                          {slide.cta}
                        </Button>
                      </Link>
                      <Link to="/shop">
                        <Button
                          size="lg"
                          variant="outline"
                          className="border-white hover:bg-white hover:text-secondary px-8 py-6 text-lg text-secondary"
                        >
                          Explore All
                        </Button>
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-primary transition-colors flex items-center justify-center"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-primary transition-colors flex items-center justify-center"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-primary"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
