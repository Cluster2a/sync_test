import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-primary/20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-xl">SYNQ</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Transforming marketplace success through performance marketing, 
              data analytics, and cutting-edge tech solutions.
            </p>
            <div className="flex gap-3">
              <button className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-premium">
                <Linkedin className="h-4 w-4 text-primary" />
              </button>
              <button className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-premium">
                <Twitter className="h-4 w-4 text-primary" />
              </button>
              <button className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-premium">
                <Facebook className="h-4 w-4 text-primary" />
              </button>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#services" className="hover:text-primary transition-premium">Performance Marketing</a></li>
              <li><a href="#services" className="hover:text-primary transition-premium">Data Analytics</a></li>
              <li><a href="#services" className="hover:text-primary transition-premium">Tech Solutions</a></li>
              <li><a href="#services" className="hover:text-primary transition-premium">Marketplace Optimization</a></li>
            </ul>
          </div>

          {/* Tools & Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Tools & Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/tools/roi-calculator" className="hover:text-primary transition-premium">ROI Calculator</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-premium">Client Portal</Link></li>
              <li><a href="#testimonials" className="hover:text-primary transition-premium">Case Studies</a></li>
              <li><a href="#about" className="hover:text-primary transition-premium">Success Stories</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>hello@wearesynq.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>New York, NY & Berlin, DE</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {currentYear} SYNQ. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-premium">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-premium">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-premium">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;