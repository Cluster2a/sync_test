import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Target, Code, TrendingUp, Database, Zap } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Target,
      title: "Performance Marketing",
      description: "ROI-focused campaigns across Amazon, eBay, Etsy and other major marketplaces. Precision targeting that converts.",
      features: ["PPC Optimization", "Conversion Tracking", "A/B Testing", "Campaign Automation"]
    },
    {
      icon: BarChart3,
      title: "Data Analytics",
      description: "Deep insights into your marketplace performance. Make data-driven decisions that scale your business.",
      features: ["Sales Analytics", "Competitor Analysis", "Market Research", "Performance Dashboards"]
    },
    {
      icon: Code,
      title: "Tech Solutions",
      description: "Custom tools and automation to streamline your marketplace operations and maximize efficiency.",
      features: ["Custom Scripts", "API Integrations", "Automation Tools", "Performance Monitoring"]
    }
  ];

  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our Expertise
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three core pillars that drive marketplace success for our clients across US and European markets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="gradient-card border-primary/20 shadow-premium hover:shadow-glow transition-premium hover:scale-105 group">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary mb-4 mx-auto group-hover:scale-110 transition-premium">
                  <service.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="text-muted-foreground">Successful Campaigns</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">$50M+</div>
            <div className="text-muted-foreground">Revenue Generated</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">98%</div>
            <div className="text-muted-foreground">Client Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;