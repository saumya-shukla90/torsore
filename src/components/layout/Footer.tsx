import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  shop: [
    { name: "Wedding Dresses", href: "/shop?category=wedding" },
    { name: "Party Wear", href: "/shop?category=party" },
    { name: "Festival Collection", href: "/shop?category=festival" },
    { name: "New Arrivals", href: "/shop?sort=new" },
    { name: "Sale", href: "/shop?sale=true" },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Returns & Exchanges", href: "/returns" },
    { name: "FAQs", href: "/faq" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Story", href: "/story" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
};

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/abc" },
  { name: "Facebook", icon: Facebook, href: "https://facebook.com/abc" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/abc" },
];

export function Footer() {
  return (
    <footer className="bg-secondary text-white border-t border-border">
      {/* Newsletter Section */}
      {/* <div className="bg-secondary text-secondary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-serif text-2xl md:text-3xl mb-4">
            Join the Torsore Family
          </h3>
          <p className="text-secondary-foreground/80 mb-8 max-w-md mx-auto">
            Subscribe to receive exclusive offers, early access to new collections, and styling inspiration.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-primary"
            />
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Subscribe
            </Button>
          </form>
          <p className="text-xs text-secondary-foreground/60 mt-4">
            Get 10% off your first order when you sign up!
          </p>
        </div>
      </div> */}

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/">
              <div className="mb-4">
                <img src="/logo-removebg-preview.png" alt="Torsore" className="h-14 w-auto" />
              </div>
            </Link>
            <p className="text-white-foreground mb-6 max-w-sm">
              Celebrating life's special moments with exquisite designs. 
              Luxury wedding dresses, party wear, and festival collections crafted with love.
            </p>
            <div className="flex gap-4 mb-8">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5"/>
                </a>
              ))}
            </div>
            <div className="space-y-3 text-sm text-white-foreground">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-white" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-white" />
                <span>hello@torsore.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-white" />
                <span>123 Fashion Avenue, New York, NY 10001</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white-foreground">
            © {new Date().getFullYear()} Torsore. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm text-white-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
