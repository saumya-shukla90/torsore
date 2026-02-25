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
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  useEffect(() => {
    slides.forEach((s) => {
      const img = new Image();
      img.src = s.image;
    });
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
    <section
      className="relative min-h-[calc(100vh-80px)] pt-20 w-full overflow-hidden bg-secondary"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        {slides.map((slide, index) => {
          if (index !== currentSlide) return null;
          const alignRight = index % 2 === 1;
          const gradientClass = alignRight
            ? "bg-gradient-to-l from-secondary/80 via-secondary/50 to-transparent"
            : "bg-gradient-to-r from-secondary/80 via-secondary/50 to-transparent";
          const containerAlign = alignRight ? "justify-end" : "justify-start";
          const textAlign = alignRight ? "text-right" : "text-left";
          return (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.6 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              {/* Background Image with subtle zoom */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <motion.div
                  className={`absolute inset-0 bg-black/30 ${gradientClass}`}
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.06 }}
                  transition={{ duration: 6, ease: "linear" }}
                />
              </div>

              {/* Content */}
              <div className={`relative h-full container mx-auto px-4 lg:px-8 flex items-center ${containerAlign}`}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0, duration: 0.6 }}
                  className={`max-w-xl text-white bg-black/35 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-lg ${textAlign}`}
                >
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0 }}
                    className="text-primary font-semibold mb-3 tracking-[0.2em] uppercase"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0 }}
                    className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0 }}
                    className={`text-base md:text-lg text-white/90 mb-6 max-w-prose ${alignRight ? "ml-auto" : ""}`}
                  >
                    {slide.description}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0 }}
                    className={`flex flex-col sm:flex-row gap-3 ${alignRight ? "sm:justify-end" : ""}`}
                  >
                    <Link to={slide.ctaLink}>
                      <Button
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-white-foreground px-8 py-6 text-base md:text-lg rounded-sm"
                      >
                        {slide.cta}
                      </Button>
                    </Link>
                    <Link to="/shop">
                      <Button
                        size="lg"
                        variant="outline"
                        className="bg-green-700 border-green-700 text-white hover:bg-white hover:text-secondary px-8 py-6 text-base md:text-lg rounded-sm"
                      >
                        Explore All
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
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
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <motion.div
          key={currentSlide}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 6, ease: "linear" }}
          className="h-full bg-green-700"
        />
      </div>
    </section>
  );
}
