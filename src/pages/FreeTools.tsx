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
      features: ["Revenue tracking", "Cost analysis", "Profit margins", "Growth projections"],
      available: true
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
        "Customer Lifetime Value (Revenue & Profit)"],
      available: true
    },
    {
      id: "acos-calculator",
      title: "ACOS Calculator",
      description: "Calculate your ACOS Targets for your ASINS",
      icon: Target,
      preview: "Input your ASIN Details to calculate your ACOS Target",
      features: ["Multi-factor analysis", "Inventory impact assessment", "Strategy-based targeting", "Performance benchmarking"],
      available: true
    },
    {
    id: "ngram-analysis",
    title: "N-Gram Analysis",
    description: "Analyze search term patterns to discover high-performing keyword combinations",
    icon: Search,
    preview: "Upload your search terms report for advanced n-gram pattern analysis",
    features: ["CSV upload support", "Multi-gram analysis (2-4 word combinations)", "Performance metrics breakdown", "Keyword opportunity identification"],
    available: false
  },
  {
    id: "bid-optimizer",
    title: "Bid Optimizer",
    description: "Calculate optimal bids based on target ACOS for each ASIN",
    icon: TrendingUp,
    preview: "Input target ACOS and campaign data to get recommended bid adjustments",
    features: ["ASIN-level bid recommendations", "Target ACOS-based optimization", "Historical performance analysis", "Automated bid suggestions"],
    available: false
  },
  {
    id: "impression-share",
    title: "Search Term Impression Share Analyzer",
    description: "Analyze impression share performance at the keyword level",
    icon: BarChart3,
    preview: "Understand your share of voice for top of search and other placements",
    features: ["Keyword-level impression data", "Top of search analysis", "Competitive positioning insights", "Share of voice trends"],
    available: false
  },
  {
    id: "forecasting",
    title: "Forecasting Tool",
    description: "Predict future sales based on seasonality and velocity trends by ASIN",
    icon: TrendingUp,
    preview: "Upload historical data to forecast units sold up to 6 months ahead",
    features: ["6-month sales forecasting", "Seasonality adjustment", "Velocity trend analysis", "Confidence intervals"],
    available: false
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
    <div className="max-w-6xl mx-auto relative">
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
                    
                   {tool.available ? (
  <Button 
    className="w-full gradient-primary hover:scale-105 transition-premium group"
    asChild
  >
    <Link to={`/tools/${tool.id}`}>
      Access Tool
      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Link>
  </Button>
) : (
  <Button 
    className="w-full bg-muted text-muted-foreground cursor-not-allowed"
    disabled
  >
    Coming Soon
  </Button>
)}
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="md:flex hidden -left-12 border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground" />
        <CarouselNext className="md:flex hidden -right-12 border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground" />
        
        {/* Mobile-only arrows - larger and more visible */}
        <div className="flex md:hidden justify-center gap-4 mt-6">
          <CarouselPrevious className="static translate-y-0 w-12 h-12 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg" />
          <CarouselNext className="static translate-y-0 w-12 h-12 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg" />
        </div>
      </Carousel>
      
      {/* Swipe hint for mobile */}
      <p className="text-center text-sm text-muted-foreground mt-4 md:hidden">
        ← Swipe to see more tools →
      </p>
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


        {/* SEO FAQ Section for ACOS Calculator */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <Card className="gradient-card border-primary/20 shadow-premium max-w-5xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl text-center">
                  Frequently Asked Questions About ACOS Targets
                </CardTitle>
                <CardDescription className="text-center mt-2 text-base">
                  Master ACOS targeting to maximize your Amazon advertising profitability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="acos-1">
                    <AccordionTrigger className="text-left">
                      What is ACOS in Amazon advertising?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed">
                        ACOS (Advertising Cost of Sales) measures what percentage of your revenue goes toward advertising costs. It's calculated as: (Ad Spend ÷ Revenue) × 100%. For example, if you spend $25 on ads to generate $100 in sales, your ACOS is 25%. Unlike ROI which shows profit multiples, ACOS reveals your advertising efficiency—lower ACOS means you're spending less to generate each dollar of revenue. ACOS is Amazon's primary metric for evaluating campaign performance, and understanding your target ACOS is crucial for profitable advertising. Our calculator helps you determine the optimal ACOS for each product based on your margins, inventory levels, and business goals.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="acos-2">
                    <AccordionTrigger className="text-left">
                      What is a good ACOS for Amazon sellers?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        There's no universal "good" ACOS—it depends entirely on your profit margins, business goals, and product lifecycle stage. However, most profitable Amazon sellers aim for ACOS between 15-35%. Products with higher margins (40%+) can sustain higher ACOS (30-40%), while low-margin products need much lower ACOS (10-20%) to remain profitable. The critical rule is: your ACOS must be lower than your profit margin to be profitable after advertising costs.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Our ACOS calculator takes a sophisticated approach by factoring in your specific gross margin, inventory situation, PPC dependency, and strategic goals. Rather than giving you a generic target, it calculates your optimal ACOS based on your unique business situation. The tool shows whether you should be targeting aggressive ACOS for market share, balanced ACOS for sustainable growth, or conservative ACOS for maximum profitability—and adjusts the target based on real factors like inventory levels and organic sales mix.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="acos-3">
                    <AccordionTrigger className="text-left">
                      How do I calculate my target ACOS?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        The basic target ACOS calculation starts with your profit margin: Target ACOS = Gross Margin % × 0.7. This gives you a baseline that leaves room for profit after ad costs. However, this simple formula doesn't account for critical business factors like inventory position, the ratio of organic to PPC sales, seasonal dynamics, or your strategic goals (ranking vs. profitability vs. balanced growth).
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Our calculator uses a multi-factor methodology that adjusts your target ACOS based on: your PPC dependency (high PPC reliance requires lower ACOS), inventory levels (excess inventory allows higher ACOS for liquidation), your business strategy (ranking, balanced, or profit-focused), and current performance benchmarks. By considering these variables together, the tool provides a dynamic target ACOS that adapts to your current business situation rather than a static number that may not reflect your real needs.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="acos-4">
                    <AccordionTrigger className="text-left">
                      Why is my ACOS so high?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        High ACOS (above 40-50%) typically results from one or more issues: bidding too aggressively on competitive keywords, targeting broad or irrelevant search terms, poor product conversion rates (weak listings, pricing, or reviews), insufficient negative keyword management, or competing in highly saturated markets. High ACOS becomes especially problematic if it exceeds your profit margin, meaning you're losing money on every sale driven by ads.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Our ACOS calculator helps diagnose why your current ACOS might be too high by comparing it to your calculated target. The tool shows exactly how far off you are from optimal performance and provides specific guidance on whether to focus on reducing bids, improving conversion rates, refining targeting, or adjusting your product strategy. By understanding the gap between your current and target ACOS, you can prioritize the most impactful optimizations rather than making changes blindly.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="acos-5">
                    <AccordionTrigger className="text-left">
                      Should ACOS targets vary by product?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        Absolutely—ACOS targets should be highly individualized by product, and using a one-size-fits-all approach is a common mistake that undermines profitability. Products with different margins, price points, competition levels, and lifecycle stages require different ACOS targets. A high-margin premium product might target 35% ACOS profitably, while a low-margin commodity product needs 15% ACOS or lower. New products launching might accept 50%+ ACOS temporarily to build reviews and rankings, while mature products should optimize for lower ACOS.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Our calculator is specifically designed for ASIN-level targeting, letting you input unique data for each product: gross margin, current PPC mix, inventory situation, and strategic goals. This individualized approach ensures you're not under-investing in high-potential products or wasting budget on campaigns that can never be profitable. The tool stores your calculations, making it easy to track and compare ACOS targets across your entire catalog and adjust strategies as products evolve through different lifecycle stages.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="acos-6">
                    <AccordionTrigger className="text-left">
                      How does inventory level affect my ACOS target?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        Inventory levels should significantly influence your ACOS strategy, though many sellers overlook this factor. When you have low inventory (under 30 days supply), aggressive advertising with high ACOS can lead to stockouts, lost organic rankings, and customer dissatisfaction. Conversely, excess inventory (over 90 days) may justify higher ACOS to move products quickly, even if it temporarily reduces profitability—dead inventory costs more than slightly lower margins.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Our calculator incorporates inventory levels as a key input, adjusting your target ACOS accordingly. Low inventory situations reduce the target ACOS modifier to preserve stock, medium inventory maintains baseline targets, while high or excess inventory increase acceptable ACOS to accelerate sales velocity. This dynamic targeting helps you avoid the common pitfalls of either running out of stock due to overly aggressive advertising or accumulating dead inventory by being too conservative with your ad spend.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="acos-7">
                    <AccordionTrigger className="text-left">
                      What's the relationship between ACOS and organic rankings?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        ACOS and organic rankings have a complex, interconnected relationship. Higher ad spend (which can mean higher ACOS) drives more sales velocity, which improves your organic search rankings, which then reduces your dependency on ads over time. This is why new products often accept very high ACOS (50-80%) initially—you're essentially paying for better organic rankings. However, established products with strong organic rankings can maintain lower ACOS because less of their sales come from paid advertising.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Our calculator accounts for this dynamic through the PPC sales percentage input. If your product is highly dependent on PPC (over 60% of sales from ads), the tool recommends lower target ACOS to improve profitability since you're unlikely to achieve significant organic sales soon. Conversely, if PPC represents under 40% of sales, you can afford slightly higher ACOS because most revenue comes organically. This helps you make strategic decisions about whether to invest in ranking improvements or optimize existing campaigns for profitability.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="acos-8">
                    <AccordionTrigger className="text-left">
                      How often should I adjust my ACOS targets?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        ACOS targets should be reviewed monthly for established products and weekly for new launches or during promotional periods. Monthly reviews allow you to adapt to changing market conditions, seasonal trends, and your evolving business goals. However, avoid adjusting targets too frequently—campaigns need time (2-4 weeks) to generate enough data for meaningful optimization. Constant target changes create instability and prevent you from accurately measuring what's working.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Our calculator makes regular ACOS reviews simple and consistent. Rather than guessing whether to adjust your targets, input your current metrics and business situation to get an updated recommendation. The tool helps you determine whether changes in your ACOS are due to campaign performance issues or whether your target itself needs adjustment based on factors like inventory changes, margin shifts, or strategic pivots. This systematic approach prevents emotional decision-making and keeps your advertising strategy aligned with your current business reality.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="acos-9">
                    <AccordionTrigger className="text-left">
                      Can I be profitable with high ACOS?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        Yes, but only under specific circumstances. High ACOS (40-60%) can be profitable if: you have very high gross margins (60%+) that leave room for substantial ad spend, you're strategically investing in market share or rankings with a plan to reduce ACOS later, you're accounting for customer lifetime value and expect repeat purchases that offset initial acquisition costs, or you're running promotional campaigns to clear excess inventory. However, sustained high ACOS without these conditions will erode profitability.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Our calculator helps you determine when high ACOS is strategically acceptable versus when it's simply unprofitable. By inputting your gross margin and strategic goals (ranking vs. balanced vs. profit), the tool shows whether your current ACOS aligns with a viable strategy or represents a problem that needs addressing. The comparison between your current and target ACOS, along with profitability projections, helps you make informed decisions about whether to maintain aggressive spending for growth or dial back to improve margins.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="acos-10">
                    <AccordionTrigger className="text-left">
                      What other factors should influence my ACOS target?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        Beyond the factors our calculator includes (margins, inventory, PPC mix, strategy), several other elements can influence optimal ACOS: competitive intensity in your category (more competition requires lower ACOS for profitability), seasonal demand patterns (peak seasons may justify higher ACOS), product review count and ratings (better reviews support higher ACOS through better conversion), Amazon fees and fulfillment costs (higher fees require lower ACOS), and customer lifetime value (repeat purchase potential allows higher initial acquisition ACOS).
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        While our calculator focuses on the most impactful and measurable factors, understanding these additional influences helps you interpret and apply the tool's recommendations more effectively. For example, if you're in a highly competitive category, you might target the lower end of the calculated ACOS range. If your product has excellent reviews and high repeat purchase rates, you could push toward the upper range. The calculator provides a data-driven foundation, and your knowledge of these contextual factors helps you fine-tune targets for optimal performance in your specific situation.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </section>
{/* SEO FAQ Section for ROI Calculator */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <Card className="gradient-card border-primary/20 shadow-premium max-w-5xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl text-center">
                  Frequently Asked Questions About Amazon PPC ROI
                </CardTitle>
                <CardDescription className="text-center mt-2 text-base">
                  Essential insights for calculating and optimizing your advertising return on investment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="roi-1">
                    <AccordionTrigger className="text-left">
                      What is ROI in Amazon PPC advertising?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed">
                        ROI (Return on Investment) in Amazon PPC measures how much profit you generate for every dollar spent on advertising. It's calculated as: (Revenue - Ad Spend) ÷ Ad Spend × 100%. For example, if you spend $1,000 on ads and generate $4,000 in revenue, your ROI is 300%, meaning you earned $3 for every dollar spent. Unlike ROAS (Return on Ad Spend), which only shows revenue multiples, ROI accounts for your actual profit by subtracting the ad spend from revenue. Our calculator helps you quickly determine whether your PPC campaigns are profitable and identifies optimization opportunities to improve returns.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="roi-2">
                    <AccordionTrigger className="text-left">
                      What's the difference between ROI and ROAS?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        ROAS (Return on Ad Spend) and ROI are related but distinct metrics. ROAS measures total revenue generated per dollar spent (Revenue ÷ Ad Spend), while ROI measures profit per dollar spent ((Revenue - Ad Spend) ÷ Ad Spend). A campaign with 5:1 ROAS means you generated $5 in revenue for every $1 spent, but this doesn't tell you if you're profitable after accounting for product costs, Amazon fees, and other expenses.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        ROI, on the other hand, shows your actual profit margin. Our calculator uses ROI because it provides a clearer picture of campaign profitability. However, we also help you understand campaign efficiency through metrics like ACoS (Advertising Cost of Sales), which shows what percentage of your revenue goes to advertising. By analyzing these metrics together, you can make more informed decisions about scaling your campaigns or cutting underperforming ones.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="roi-3">
                    <AccordionTrigger className="text-left">
                      What is a good ROI for Amazon PPC campaigns?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        A "good" ROI varies by product category, competition level, and business goals, but most successful Amazon sellers aim for at least 100-200% ROI on their PPC campaigns. This means earning $2-3 in profit for every dollar spent on ads. However, your target ROI should factor in your gross margin—products with higher margins can sustain more aggressive advertising, while low-margin products need higher ROI to remain profitable.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Our calculator helps you benchmark your performance by showing not just ROI, but also campaign efficiency scores. If your ROI is below 50%, you're likely spending too much on ads relative to revenue. If it's above 300%, you might be under-investing and missing growth opportunities. The tool provides personalized recommendations based on your specific numbers, helping you find the sweet spot between profitability and growth for your unique business situation.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="roi-4">
                    <AccordionTrigger className="text-left">
                      How do I calculate ROI for my Amazon ads?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        To calculate Amazon PPC ROI, you need three key data points: your ad spend, the revenue generated from those ads, and ideally your ACoS (Advertising Cost of Sales). The basic formula is: ROI = ((Revenue - Ad Spend) ÷ Ad Spend) × 100%. You can find these metrics in your Amazon Advertising Console under Campaign Manager, where you'll see columns for Spend, Sales, and ACoS for each campaign.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Our ROI calculator simplifies this process—just input your ad spend, revenue generated, and ACoS percentage, and we'll instantly calculate your ROI along with campaign efficiency metrics and optimization recommendations. The tool also helps you understand how changes to your ad spend or targeting might impact your overall profitability, making it easier to test different strategies and find what works best for your products.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="roi-5">
                    <AccordionTrigger className="text-left">
                      Why is my Amazon PPC not profitable?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        Unprofitable PPC campaigns typically stem from one or more issues: targeting the wrong keywords (too broad or too competitive), bidding too aggressively, poor product listing optimization leading to low conversion rates, insufficient negative keyword management, or simply selling products with margins too thin to support advertising costs. High ACoS (above 30-40% for most products) is often the first sign of unprofitable campaigns.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Our calculator helps diagnose profitability issues by showing you exactly where your campaigns stand. If your ROI is negative or very low, the tool provides specific optimization tips: reducing bids on underperforming keywords, improving your product listings to boost conversion rates, focusing on high-intent search terms, and identifying which campaigns to scale versus pause. By regularly monitoring your ROI with our calculator, you can catch profitability issues early and make data-driven adjustments before they significantly impact your bottom line.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="roi-6">
                    <AccordionTrigger className="text-left">
                      How often should I check my Amazon PPC ROI?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed">
                        For most sellers, weekly ROI checks are ideal, with more frequent monitoring (daily or every few days) during campaign launches, major promotions, or peak selling seasons like Q4. Weekly reviews give you enough data to spot trends without overreacting to short-term fluctuations. However, if you're running high-budget campaigns or testing new strategies, daily monitoring helps you catch issues quickly and capitalize on winning tactics. Our calculator makes frequent checks easy—simply input your latest metrics from Amazon's advertising dashboard to get instant ROI analysis and recommendations. By tracking your ROI consistently, you'll develop a deeper understanding of what drives profitability for your specific products and can make faster, more confident optimization decisions.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="roi-7">
                    <AccordionTrigger className="text-left">
                      What's the relationship between ACoS and ROI?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        ACoS (Advertising Cost of Sales) and ROI are inversely related—as ACoS decreases, ROI increases. ACoS shows what percentage of your revenue goes to advertising (Ad Spend ÷ Revenue × 100%), while ROI shows your profit multiple. For example, a 25% ACoS means you're spending 25 cents on ads for every dollar of revenue. To be profitable, your ACoS must be lower than your profit margin after all costs.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Our calculator analyzes both metrics together to give you a complete profitability picture. It shows how your current ACoS translates to ROI and campaign efficiency, helping you understand whether you're in a healthy zone. The tool also calculates your target ACoS based on your profit margins, showing you exactly how low your ACoS needs to be for profitable campaigns. This dual-metric approach helps you set realistic targets and measure progress toward profitability goals.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="roi-8">
                    <AccordionTrigger className="text-left">
                      Can I improve ROI without reducing ad spend?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        Absolutely! Improving ROI isn't just about cutting costs—it's often more effective to increase revenue efficiency. Key strategies include: optimizing your product listings to boost conversion rates (better images, compelling copy, competitive pricing), using negative keywords to eliminate wasted spend, targeting long-tail keywords with higher conversion rates and lower competition, improving your product reviews and ratings, and testing different ad placements to find what converts best.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Our ROI calculator helps you understand which levers to pull by showing how changes in revenue or ad spend impact your overall returns. By regularly calculating your ROI as you implement these optimizations, you can measure which tactics actually move the needle. Many sellers find that investing in listing optimization and customer experience improvements delivers better ROI gains than simply cutting ad budgets, because it increases the value of every click rather than just reducing costs.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="roi-9">
                    <AccordionTrigger className="text-left">
                      How does product pricing affect my PPC ROI?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        Product pricing directly impacts your PPC ROI because it determines both your profit margin and your ability to compete for ad placements. Higher prices mean larger absolute profits per sale, which can sustain higher advertising costs. However, higher prices may also reduce conversion rates if customers perceive poor value. Lower prices can increase conversion rates and sales velocity, but thin margins leave less room for advertising spend before campaigns become unprofitable.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Our calculator helps you find the pricing sweet spot by showing how different revenue scenarios impact your ROI. You can experiment with different price points (by inputting different revenue amounts) to see how they would affect your advertising profitability. This analysis is crucial when considering price changes—you might discover that a small price increase, even with slightly lower conversion rates, could significantly improve your PPC ROI by expanding your profit margins and allowing for more aggressive bidding on high-value keywords.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="roi-10">
                    <AccordionTrigger className="text-left">
                      Should I prioritize ROI or sales volume?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        The answer depends on your business stage and goals. New products or brands often prioritize sales volume and market share over immediate ROI to build reviews, improve organic rankings, and establish brand presence. Once established, shifting focus to ROI optimization helps maximize profitability. However, the ideal approach balances both: maintain campaigns with strong ROI for consistent profitability while investing in volume-driving campaigns for growth, even if they temporarily show lower returns.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Our ROI calculator helps you make this strategic decision by showing the true cost of your growth. By clearly displaying your current ROI and campaign efficiency, you can consciously decide how much profitability you're willing to sacrifice for volume. Many successful sellers use our tool to segment their campaigns: high-ROI campaigns for profit generation and breakeven or lower-ROI campaigns for strategic growth. This data-driven approach ensures you're not blindly chasing volume at the expense of profitability, nor are you leaving growth opportunities on the table by being overly conservative.
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