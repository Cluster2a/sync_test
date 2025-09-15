import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Mail } from "lucide-react";

const About = () => {
  const team = [
    {
      name: "Alex Chen",
      role: "CEO & Performance Marketing Lead",
      expertise: ["Amazon PPC", "Data Analytics", "Growth Strategy"],
      bio: "10+ years driving marketplace success with $20M+ in managed ad spend."
    },
    {
      name: "Sarah Rodriguez",
      role: "Head of Data Analytics",
      expertise: ["Business Intelligence", "Market Research", "Automation"],
      bio: "Former Amazon analyst with deep marketplace insights and predictive modeling expertise."
    },
    {
      name: "Marcus Weber",
      role: "Tech Solutions Director",
      expertise: ["API Development", "Custom Scripts", "Integration"],
      bio: "Full-stack developer specializing in marketplace automation and performance tools."
    }
  ];

  return (
    <section id="about" className="py-24 gradient-hero">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Meet Our Team
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Marketplace veterans with a combined 25+ years of experience helping sellers 
            scale across US and European markets. We've been where you are, and we know how to get you where you want to be.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {team.map((member, index) => (
            <Card key={index} className="gradient-card border-primary/20 shadow-premium hover:shadow-glow transition-premium hover:scale-105 group">
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-primary-foreground">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {member.expertise.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 justify-center">
                  <button className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-premium">
                    <Linkedin className="h-4 w-4 text-primary" />
                  </button>
                  <button className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-premium">
                    <Mail className="h-4 w-4 text-primary" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold mb-6">Why Choose Us?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full gradient-primary mx-auto mb-3 flex items-center justify-center">
                <span className="text-xl">🎯</span>
              </div>
              <h4 className="font-semibold mb-2">Results-Focused</h4>
              <p className="text-sm text-muted-foreground">Every strategy is built around ROI and measurable growth</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full gradient-primary mx-auto mb-3 flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <h4 className="font-semibold mb-2">Data-Driven</h4>
              <p className="text-sm text-muted-foreground">Decisions backed by comprehensive analytics and insights</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full gradient-primary mx-auto mb-3 flex items-center justify-center">
                <span className="text-xl">🚀</span>
              </div>
              <h4 className="font-semibold mb-2">Scalable Solutions</h4>
              <p className="text-sm text-muted-foreground">Built to grow with your business across multiple markets</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full gradient-primary mx-auto mb-3 flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
              <h4 className="font-semibold mb-2">Tech-Forward</h4>
              <p className="text-sm text-muted-foreground">Cutting-edge tools and automation for competitive advantage</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;