import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Michael Thompson",
      company: "Thompson Electronics",
      market: "Amazon US",
      result: "350% revenue increase",
      quote: "Their data-driven approach transformed our Amazon presence. From $50k to $225k monthly revenue in just 8 months.",
      rating: 5,
      metrics: ["ACOS reduced by 45%", "Organic ranking improved", "Conversion rate +78%"]
    },
    {
      name: "Sophie Laurent",
      company: "Artisan Crafts Co",
      market: "European Marketplaces",
      result: "€2M annual revenue",
      quote: "Expanding across European marketplaces seemed impossible until we found this team. Now we're thriving in 8 countries.",
      rating: 5,
      metrics: ["8 markets penetrated", "€2M+ annual revenue", "200% growth YoY"]
    },
    {
      name: "David Park",
      company: "Tech Accessories Pro",
      market: "Multi-Platform",
      result: "90% automation efficiency",
      quote: "Their custom automation tools saved us 30 hours per week while increasing our profit margins by 25%.",
      rating: 5,
      metrics: ["30 hours saved/week", "25% margin increase", "90% process automation"]
    }
  ];

  const caseStudies = [
    {
      title: "EU Reseller",
      challenge: "huge & highly dynamic portfolio with 6k+ SKUs across 5 marketplaces",
      solution: "built tech solutions to semi-automate marketing from campaign creation, to bidding and search term negation",
      results: ["1000s of newly launched campaigns", "+30% YoY profit growth", "reduced internal teams operational load by 20+ hours / week"]
    },
    {
      title: "US Fabric Commodities",
      challenge: "Return to proftibality in an asian dominated commodities niche",
      solution: "listing re-design + granular campaign rebuild + smart promotion cycles + automation tools",
      results: ["+131% Profit Growth in 3 months", "-88% Discount Dependency", "cashflow optimized" , "-35% Redcution in Marketing Waste"]
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Client Success Stories
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real results from real marketplace sellers who trusted us to scale their businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="gradient-card border-primary/20 shadow-premium hover:shadow-glow transition-premium">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="text-sm mb-4 italic">"{testimonial.quote}"</blockquote>
                <div className="space-y-3">
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{testimonial.market}</Badge>
                    <Badge className="text-xs gradient-primary">{testimonial.result}</Badge>
                  </div>
                  <div className="space-y-1">
                    {testimonial.metrics.map((metric, metricIndex) => (
                      <div key={metricIndex} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3 text-primary" />
                        <span>{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12">Featured Case Studies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => (
              <Card key={index} className="gradient-card border-primary/20 shadow-premium">
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-3">{study.title}</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-destructive mb-2">Challenge:</h5>
                      <p className="text-sm text-muted-foreground">{study.challenge}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-primary mb-2">Solution:</h5>
                      <p className="text-sm text-muted-foreground">{study.solution}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-accent mb-2">Results:</h5>
                      <ul className="space-y-1">
                        {study.results.map((result, resultIndex) => (
                          <li key={resultIndex} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span>{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;