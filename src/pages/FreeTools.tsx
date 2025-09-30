import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
        {/* SEO FAQ Section for LTV */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <Card className="gradient-card border-primary/20 shadow-premium max-w-5xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl text-center">
                  Frequently Asked Questions About Customer Lifetime Value
                </CardTitle>
                <CardDescription className="text-center mt-2 text-base">
                  Everything you need to know about calculating and optimizing LTV for your e-commerce business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left">
                      What is Customer Lifetime Value (LTV)?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed">
                        Customer Lifetime Value (LTV) is a metric that represents the total revenue or profit a business can expect from a single customer throughout their entire relationship. For e-commerce businesses, especially Amazon sellers, LTV is crucial because it helps you understand how much each customer is truly worth beyond their first purchase. Our LTV calculator helps you accurately measure this by analyzing repeat purchase behavior, average order values, and customer retention rates over multiple years. By understanding your LTV, you can make smarter decisions about how much to invest in customer acquisition and retention strategies.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left">
                      Why is LTV important for e-commerce businesses?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed">
                        LTV is one of the most important metrics for e-commerce profitability because it reveals the long-term value of your customer acquisition efforts. While many sellers focus solely on immediate sales, understanding LTV helps you see the bigger picture: a customer who makes repeat purchases over years is far more valuable than one-time buyers. This metric directly influences your marketing budget decisions, customer retention strategies, and overall business growth planning. Our calculator analyzes your historical data to show both revenue and profit-based LTV, helping you understand not just how much customers spend, but how much they actually contribute to your bottom line after accounting for costs and margins.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left">
                      How do you calculate Customer Lifetime Value?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        There are several methods to calculate LTV, but the most accurate approach for e-commerce uses historical cohort analysis. Our calculator uses this method, which tracks real customer behavior over time. The basic formula considers: (Average Purchase Value) × (Purchase Frequency) × (Customer Lifespan). However, for true accuracy, you need to factor in repeat purchase rates, customer retention curves, gross margins, and acquisition costs.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Our tool simplifies this complex calculation by allowing you to upload your Amazon Business Reports or manually input data across multiple years. It automatically calculates both revenue-based LTV (total customer spending) and profit-based LTV (accounting for margins and ad spend), giving you a complete picture of customer value. The calculator also shows year-over-year trends, helping you identify whether your LTV is improving or declining over time.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-left">
                      What's the difference between LTV and CLV?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed">
                        LTV (Lifetime Value) and CLV (Customer Lifetime Value) are actually the same metric—the terms are used interchangeably in the industry. Some businesses prefer "CLV" to emphasize the customer-centric focus, while others use "LTV" for brevity. Regardless of the acronym, both measure the total value a customer brings to your business over their entire relationship with your brand. Our calculator uses LTV terminology but provides the same comprehensive analysis that any CLV tool would offer, including repeat purchase behavior, customer retention metrics, and long-term profitability projections.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-left">
                      What is a good LTV for an Amazon seller?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        A "good" LTV varies significantly by product category, price point, and business model, but a common benchmark is that your LTV should be at least 3 times your Customer Acquisition Cost (CAC). For Amazon sellers, average LTV can range from $50 for low-ticket consumables with high repeat rates to $500+ for premium or durable goods with loyal customers. The key isn't comparing your LTV to others, but understanding the ratio between your LTV and CAC (known as the LTV:CAC ratio).
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Our calculator helps you benchmark your performance by showing both revenue and profit-based LTV alongside your customer acquisition costs. If your LTV:CAC ratio is below 3:1, you may be spending too much on acquisition or not doing enough to retain customers. If it's above 5:1, you might be under-investing in growth opportunities. Use our tool to track this ratio over time and optimize your marketing spend accordingly.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6">
                    <AccordionTrigger className="text-left">
                      How can I increase my customer lifetime value?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        Increasing LTV requires a multi-faceted approach focusing on three key areas: increasing purchase frequency, raising average order values, and extending customer lifespan. For Amazon sellers, this might include implementing subscription models (Subscribe & Save), creating product bundles, launching complementary products, improving product quality to reduce returns, and building a brand presence outside of Amazon through email marketing and social media.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Our LTV calculator helps you identify which levers to pull by showing you detailed metrics like repeat purchase rates, average order values, and customer retention patterns. By analyzing your data year-over-year, you can see which strategies are working and where there's room for improvement. For example, if your repeat purchase rate is low but your average order value is high, you might focus on post-purchase email campaigns to encourage repeat orders rather than trying to increase basket size.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7">
                    <AccordionTrigger className="text-left">
                      What factors affect customer lifetime value?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        Multiple factors influence LTV, including: product quality and customer satisfaction, pricing strategy and perceived value, purchase frequency and repeat rates, customer service excellence, brand loyalty and emotional connection, product category and consumability, competitive landscape, and your retention marketing efforts. For Amazon businesses specifically, factors like product reviews, fulfillment speed (FBA vs FBM), and pricing competitiveness play outsized roles.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Our calculator helps you understand which factors are most impactful for your business by breaking down LTV into its component parts: new customer acquisition, repeat customer behavior, average order values, and profit margins. By tracking these metrics over multiple years, you can identify trends and understand which initiatives are actually moving the needle on customer value. This data-driven approach removes guesswork and helps you focus on the strategies that deliver the highest ROI.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-8">
                    <AccordionTrigger className="text-left">
                      How often should I calculate LTV?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed">
                        For most e-commerce businesses, calculating LTV quarterly is ideal, with a more comprehensive annual analysis. Quarterly calculations help you spot trends early and make timely adjustments to your marketing and retention strategies, while annual reviews provide the longer time horizon needed to truly understand customer behavior patterns. However, if you're running major marketing campaigns, launching new products, or making significant changes to your business model, more frequent LTV analysis can be valuable. Our calculator makes it easy to analyze your LTV whenever you need to—simply upload your latest Amazon Business Reports or update your manual inputs to see current metrics. The tool stores your historical data, making it simple to track changes over time and understand whether your initiatives are improving customer value.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-9">
                    <AccordionTrigger className="text-left">
                      What's the relationship between LTV and customer acquisition cost (CAC)?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        LTV and CAC are two sides of the same profitability equation. CAC measures how much you spend to acquire a new customer (including advertising, promotions, and marketing costs), while LTV measures how much revenue or profit that customer generates over their lifetime. The relationship between these metrics—expressed as the LTV:CAC ratio—is one of the most important indicators of business health and sustainability.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        A healthy e-commerce business typically aims for an LTV:CAC ratio of 3:1 or higher, meaning each customer generates at least three times what you spent to acquire them. Our calculator automatically computes this ratio when you input your ad spend data, helping you understand whether your customer acquisition is profitable in the long run. This is especially critical for Amazon sellers who face high advertising costs—knowing your true LTV helps you determine how aggressively you can bid on keywords while maintaining profitability.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-10">
                    <AccordionTrigger className="text-left">
                      How does LTV help with marketing budget decisions?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        Understanding your LTV fundamentally changes how you approach marketing budgets. Instead of optimizing for immediate return on ad spend (ROAS), you can make decisions based on long-term customer value. For example, if you know your average customer has an LTV of $300, you might be willing to break even or even lose money on the first purchase if you're confident in your retention strategies. This opens up more aggressive growth opportunities that competitors focused only on immediate profitability might miss.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Our LTV calculator provides the precise data you need to make these strategic decisions with confidence. By showing you both revenue and profit-based LTV, repeat purchase patterns, and the relationship between acquisition costs and customer value, you can set marketing budgets that maximize long-term profitability rather than short-term gains. The tool also helps you identify which customer segments have the highest LTV, allowing you to target your most valuable customers more effectively and allocate your marketing budget where it will generate the best returns.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FreeTools;