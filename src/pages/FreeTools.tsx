import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calculator, BarChart3, Target, TrendingUp, Search, DollarSign, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const FreeTools = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    company: ""
  });

  const tools = [
    {
      id: "roi-calculator",
      title: "ROI Calculator",
      description: "Calculate your marketing return on investment with precision",
      icon: Calculator,
      preview: "Input your marketing spend and revenue to get detailed ROI analysis",
      features: ["Revenue tracking", "Cost analysis", "Profit margins", "Growth projections"]
    },
    {
      id: "performance-analyzer",
      title: "Performance Analyzer",
      description: "Analyze your marketplace performance metrics",
      icon: BarChart3,
      preview: "Upload your sales data and get comprehensive performance insights",
      features: ["Sales trends", "Conversion rates", "Market share", "Competitor analysis"]
    },
    {
      id: "keyword-optimizer",
      title: "Keyword Optimizer",
      description: "Optimize your product listings for better visibility",
      icon: Search,
      preview: "Enter your product details and get optimized keywords",
      features: ["Keyword research", "Search volume", "Competition analysis", "Ranking potential"]
    },
    {
      id: "profit-tracker",
      title: "Profit Tracker",
      description: "Track and optimize your profit margins",
      icon: DollarSign,
      preview: "Monitor your costs and profits across all channels",
      features: ["Cost tracking", "Margin analysis", "Fee calculations", "Profit optimization"]
    },
    {
      id: "growth-forecaster",
      title: "Growth Forecaster",
      description: "Predict your business growth trajectory",
      icon: TrendingUp,
      preview: "Input historical data to forecast future growth",
      features: ["Revenue forecasting", "Trend analysis", "Seasonal patterns", "Growth strategies"]
    },
    {
      id: "target-optimizer",
      title: "Target Optimizer",
      description: "Optimize your advertising targeting",
      icon: Target,
      preview: "Analyze and improve your ad targeting strategies",
      features: ["Audience analysis", "Targeting optimization", "Budget allocation", "Performance tracking"]
    }
  ];

  const handleToolAccess = (toolId: string) => {
    setSelectedTool(toolId);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the contact information to your backend
    console.log("Contact form submitted:", contactForm);
    // Redirect to the specific tool or show access granted message
    alert("Thank you! Access granted to our optimization tools.");
    setSelectedTool(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 gradient-hero">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-primary bg-clip-text text-transparent">
              Free Optimization Tools For You
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Access our suite of powerful optimization tools designed specifically for marketplace sellers. 
              Get insights, track performance, and optimize your business - completely free.
            </p>
          </div>
        </section>

        {/* Tools Carousel */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <Carousel className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {tools.map((tool) => {
                    const IconComponent = tool.icon;
                    return (
                      <CarouselItem key={tool.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                        <Card className="gradient-card border-primary/20 hover:border-primary/40 transition-premium h-full">
                          <CardHeader className="text-center">
                            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                              <IconComponent className="h-8 w-8 text-primary-foreground" />
                            </div>
                            <CardTitle className="text-xl">{tool.title}</CardTitle>
                            <CardDescription className="text-muted-foreground">
                              {tool.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="bg-primary/5 p-4 rounded-lg">
                              <p className="text-sm text-muted-foreground mb-3">{tool.preview}</p>
                              <div className="space-y-2">
                                {tool.features.map((feature, index) => (
                                  <div key={index} className="flex items-center gap-2 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                    <span>{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  className="w-full gradient-primary hover:scale-105 transition-premium group"
                                  onClick={() => handleToolAccess(tool.id)}
                                >
                                  Access Tool
                                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="gradient-card">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-3">
                                    <IconComponent className="h-6 w-6 text-primary" />
                                    Access {tool.title}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Please provide your contact information to access our free optimization tools.
                                  </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleContactSubmit} className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                      id="name"
                                      value={contactForm.name}
                                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                                      required
                                      className="border-primary/20 focus:border-primary"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                      id="email"
                                      type="email"
                                      value={contactForm.email}
                                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                                      required
                                      className="border-primary/20 focus:border-primary"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="company">Company Name</Label>
                                    <Input
                                      id="company"
                                      value={contactForm.company}
                                      onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
                                      required
                                      className="border-primary/20 focus:border-primary"
                                    />
                                  </div>
                                  <Button type="submit" className="w-full gradient-primary">
                                    Get Free Access
                                  </Button>
                                </form>
                              </DialogContent>
                            </Dialog>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="border-primary/20 hover:border-primary" />
                <CarouselNext className="border-primary/20 hover:border-primary" />
              </Carousel>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 gradient-hero">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Optimize Your Business?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of marketplace sellers who are already using our tools to grow their business.
            </p>
            <Button size="lg" className="gradient-primary shadow-glow hover:scale-105 transition-premium">
              Start Optimizing Now
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FreeTools;