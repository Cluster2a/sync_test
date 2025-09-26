import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { navigateToSection } from "@/lib/navigation";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    navigateToSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { label: "Services", id: "services" },
    { label: "About", id: "about" },
    { label: "Success Stories", id: "testimonials" },
    { label: "Contact", id: "contact" }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-premium ${isScrolled ? 'bg-background/95 backdrop-blur-sm border-b border-primary/20 shadow-premium' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">SQ</span>
            </div>
            <span className="font-bold text-xl">SYNQ</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-muted-foreground hover:text-primary transition-premium font-medium"
              >
                {item.label}
              </button>
            ))}
            <Link
              to="/free-tools"
              className="text-muted-foreground hover:text-primary transition-premium font-medium"
            >
              Free Tools
            </Link>
            <Button 
              size="sm" 
              className="gradient-primary shadow-glow transition-premium hover:scale-105"
              onClick={() => scrollToSection('contact')}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-premium"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-primary" />
              ) : (
                <Menu className="h-5 w-5 text-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 gradient-card border-t border-primary/20 shadow-premium">
            <div className="container mx-auto px-6 py-6 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left text-muted-foreground hover:text-primary transition-premium font-medium py-2"
                >
                  {item.label}
                </button>
              ))}
              <Link
                to="/free-tools"
                className="block w-full text-left text-muted-foreground hover:text-primary transition-premium font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Free Tools
              </Link>
              <div className="pt-4 border-t border-primary/20">
                <Button 
                  size="sm" 
                  className="w-full gradient-primary shadow-glow transition-premium"
                  onClick={() => scrollToSection('contact')}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;