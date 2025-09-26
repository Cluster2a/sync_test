import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Target, Code, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { navigateToSection } from "@/lib/navigation";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-primary">Performance-Driven Marketing</span>
          </div>
          
          <h1 className="mb-6 text-5xl md:text-7xl font-bold tracking-tight">
            Scale Your
            <br />
            Success
          </h1>
          
          <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We help US & European marketplace sellers dominate through performance marketing, 
            data analytics, and cutting-edge tech solutions. Results-driven. Data-backed. Success-focused.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="gradient-primary shadow-glow transition-premium hover:scale-105 group"
              onClick={() => navigateToSection('contact')}
            >
              Start Your Growth
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary/30 hover:bg-primary/10 transition-premium"
              onClick={() => navigateToSection('testimonials')}
            >
              View Case Studies
            </Button>
          </div>
          
          <div className="text-center mb-8">
            <Link 
              to="/tools/roi-calculator" 
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-glow transition-premium bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-full"
            >
              <Calculator className="h-4 w-4" />
              Try Our Free ROI Calculator
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span>Data Analytics</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <Target className="h-6 w-6 text-primary" />
              <span>Performance Marketing</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <Code className="h-6 w-6 text-primary" />
              <span>Tech Solutions</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;