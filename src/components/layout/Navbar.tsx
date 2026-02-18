import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, Menu, X, Heart, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CartSheet } from "@/components/cart/CartSheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Wedding", href: "/wedding" },
  { name: "Party Wear", href: "/party-wear" },
  { name: "Custom Orders", href: "/custom-orders" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const submenus: Record<string, string[]> = {
  "/shop": ["Men", "Women", "Child"],
  "/party-wear": ["Men", "Women", "Child"],
  "/custom-orders": ["Men", "Women", "Child"],
  "/wedding": ["Men", "Women", "Child"],
};

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [megaSegment, setMegaSegment] = useState<"Men" | "Women" | "Child">("Women");
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const onBanner = !isScrolled;

  const userInitials = user?.user_metadata?.full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-black-900 shadow-soft text-white" : "bg-black/5 backdrop-blur-md text-white"
      )}
    >
      <nav className="container mx-auto px-4 lg:px-8 relative" onMouseLeave={() => setActiveMega(null)}>
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="mr-2">
              <span className="text-gradient-gold"><img src="/logo-removebg-preview.png" alt="Torsore" className="h-12 w-auto" /></span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative group"
                onMouseEnter={() => setActiveMega(link.href)}
              >
                <Link
                  to={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors relative",
                    location.pathname === link.href
                      ? "text-primary"
                      : onBanner
                        ? "text-white/90 hover:text-white"
                        : "text-white/90 hover:text-white"
                  )}
                >
                  {link.name}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                      location.pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                </Link>
                {activeMega === link.href && submenus[link.href] && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[min(1100px,40vw)]">
                    <div className="rounded-lg border border-white/10 bg-white text-foreground shadow-soft">
                      <div className="flex items-center gap-5 px-8 pt-4">
                        {["Men", "Women", "Child"].map((seg) => (
                          <button
                            key={seg}
                            onClick={() => setMegaSegment(seg as "Men" | "Women" | "Child")}
                            className={cn(
                              "px-2 py-2 text-sm rounded-md",
                              megaSegment === seg ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {seg}
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 px-6 py-6">
                        {getMegaColumns(link.href, megaSegment).map((col) => (
                          <div key={col.title}>
                            <div className="font-medium mb-3 text-primary">{col.title}</div>
                            <div className="space-y-2">
                              {col.items.map((item) => (
                                <Link
                                  key={item.label}
                                  to={item.href}
                                  className="block text-sm text-muted-foreground hover:text-foreground"
                                   >
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={cn(onBanner ? "text-white hover:bg-white/10" : "text-white hover:bg-primary/10")}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Link to="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className={cn("hidden md:flex", onBanner ? "text-white hover:bg-white/10" : "text-white hover:bg-primary/10")}
              >
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            {/* User Account */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(onBanner ? "text-white hover:bg-white/10" : "text-white hover:bg-primary/10")}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4 text-white" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(onBanner ? "text-white hover:bg-white/10" : "text-white hover:bg-primary/10")}
                >
                  <User className="h-5 w-5"/>
                </Button>
              </Link>
            )}

            {/* Cart */}
            <CartSheet />

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={cn("lg:hidden", onBanner ? "text-white hover:bg-white/10" : "text-white hover:bg-primary/10")}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden pb-4"
            >
              <div className="relative max-w-xl mx-auto">
                <Input
                  type="search"
                  placeholder="Search for dresses, colors, occasions..."
                  className="pl-12 pr-4 py-3 rounded-full border-primary/30 focus:border-primary bg-card"
                  autoFocus
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 top-20 bg-card z-40 lg:hidden"
          >
            <div className="container py-8 px-4 bg-white">
              <div className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      className={cn(
                        "block text-xl font-medium py-3 border-b border-border transition-colors",
                        location.pathname === link.href
                          ? "text-primary"
                          : "text-foreground hover:text-primary"
                      )}
                    >
                      {link.name}
                    </Link>
                    {submenus[link.href] && (
                      <div className="pl-4">
                        {submenus[link.href].map((item) => (
                          <Link
                            key={item}
                            to={`${link.href}?segment=${item.toLowerCase()}`}
                            className="block py-2 text-lg text-muted-foreground hover:text-foreground"
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="pt-4"
                >
                  <Link to="/wishlist">
                    <Button variant="outline" className="w-full justify-start gap-3">
                      <Heart className="h-5 w-5" />
                      Wishlist
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

type MegaColumn = { title: string; items: { label: string; href: string }[] };

function getMegaColumns(parent: string, seg: "Men" | "Women" | "Child"): MegaColumn[] {
  const base = (p: string, labels: string[]): MegaColumn => ({
    title: p,
    items: labels.map((l) => ({
      label: l,
      href: `${parent}?segment=${seg.toLowerCase()}&category=${encodeURIComponent(l.toLowerCase().replace(/\s+/g, "-"))}`,
    })),
  });
  if (parent === "/shop") {
    if (seg === "Women") {
      return [
        base("Indian & Fusion Wear", ["Lehengas", "Sarees", "Kurtas & Suits", "Dupattas", "Skirts"]),
        base("Western Wear", ["Dresses", "Tops", "Co-ords", "Shrugs", "Jumpsuits"]),
        base("Footwear & Accessories", ["Heels", "Flats", "Jewellery", "Handbags", "Backpacks"]),
      ];
    }
    if (seg === "Men") {
      return [
        base("Ethnic Wear", ["Kurtas", "Sherwanis", "Nehru Jackets", "Dhoti Sets", "Pathani Suits"]),
        base("Western Wear", ["Tshirts", "Shirts", "Jeans", "Trousers", "Blazers"]),
        base("Footwear & Accessories", ["Casual Shoes", "Formal Shoes", "Belts", "Wallets", "Watches"]),
      ];
    }
    return [
      base("Kids Wear", ["Ethnic Sets", "Party Dresses", "Tops & Tees", "Skirts", "Shorts"]),
      base("Footwear", ["Sandals", "Sneakers", "Boots", "Flats", "School Shoes"]),
      base("Accessories", ["Bags", "Belts", "Caps", "Hair Accessories", "Jewellery"]),
    ];
  }
  if (parent === "/party-wear") {
    return [
      base("Occasion", ["Cocktail Dresses", "Evening Gowns", "Sequins", "Velvet", "Festive"]),
      base("Styles", ["Bodycon", "A-line", "Mermaid", "One-Shoulder", "Wrap"]),
      base("Add-ons", ["Shawls", "Clutches", "Heels", "Jewellery", "Hair Pins"]),
    ];
  }
  if (parent === "/wedding") {
    return [
      base("Bridal", ["Wedding Dresses", "Bridal Gowns", "Reception Wear", "Engagement Wear", "Sangeet"]),
      base("Family", ["Bridesmaids", "Groomsmen", "Mother of Bride", "Kids Wedding", "Guests"]),
      base("Accessories", ["Veils", "Jewellery", "Footwear", "Clutches", "Hair Accessories"]),
    ];
  }
  return [
    base("Customization", ["Made-to-Measure", "Color Options", "Embroidery", "Fabric Choice", "Fit Adjustments"]),
    base("Occasions", ["Wedding", "Party", "Festival", "Corporate", "Casual"]),
    base("Consultation", ["Style Guide", "Measurements", "Trial Session", "Delivery Options", "Care"]),
  ];
}
