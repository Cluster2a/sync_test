import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Calculator, BarChart3, Target, TrendingUp, Search, DollarSign, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { navigateToSection } from "@/lib/navigation";


const FreeTools = () => {

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
      id: "lifetime-value",
      title: "Lifetime Value Calculator",
      description: "Estimate customer lifetime revenue and profit for Amazon brands",
      icon: DollarSign,
      preview: "Upload yearly CSVs, enter gross margin & ad spend to calculate LTV metrics",
      features: [
        "CSV upload for multiple years",
        "Dynamic gross margin & ad spend inputs",
        "One-time vs repeat customer breakdown",
        "Customer Lifetime Value (Revenue & Profit)"
      ]
    },
    {
      id: "acos-calculator",
      title: "ACOS Calculator",
      description: "Calculate your ACOS Targets for your ASINS",
      icon: Target,
      preview: "Input your ASIN Details to calculate your ACOS Target",
      features: ["Multi-factor analysis", "Inventory impact assessment", "Strategy-based targeting", "Performance benchmarking"]
    },
  ];


  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 gradient-hero">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
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
                            <Button 
                              className="w-full gradient-primary hover:scale-105 transition-premium group"
                              asChild
                            >
                              <Link to={`/tools/${tool.id}`}>
                                Access Tool
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                              </Link>
                            </Button>
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
              Join the group of other sellers and marketeers who are already using our tools to grow their business.
            </p>
            <Button 
              size="lg" 
              className="gradient-primary shadow-glow hover:scale-105 transition-premium"
              onClick={() => navigateToSection('contact')}
            >
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