// components/ToolAccessGate.tsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Mail, User, Lock, Unlock, Gift, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { setToolAccess, getToolAccess } from "@/utils/toolAccess";
import { navigateToSection } from "@/lib/navigation";

interface ToolAccessGateProps {
  children: React.ReactNode;
  toolName: string;
}

export const ToolAccessGate: React.FC<ToolAccessGateProps> = ({ children, toolName }) => {
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '' // Honeypot field
  });
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing access on component mount
    const existingAccess = getToolAccess();
    setHasAccess(!!existingAccess);
    setIsLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check honeypot - if filled, reject silently
    if (formData.website.trim() !== '') {
      console.log('Bot detected via honeypot');
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both your name and email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to Supabase with honeypot value
      const { error } = await supabase
        .from('Contacts')
        .insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            company: null,
            service_interest: 'free-tools-access',
            current_marketplace: null,
            message: `I signed up to use the free tools (accessed: ${toolName})`,
            honeypot: formData.website.trim() // Save honeypot value
          }
        ]);

      if (error) {
        console.error('Database error:', error);
        // Continue even if DB save fails
      }

      // Set access cookie (30 days)
      setToolAccess({
        name: formData.name.trim(),
        email: formData.email.trim()
      });

      setHasAccess(true);
      
      toast({
        title: "Access Granted!",
        description: `Welcome ${formData.name}! You now have access to all our free tools for 90 days.`,
      });

    } catch (error) {
      console.error('Error granting tool access:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen gradient-hero p-6">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
              <Gift className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            Free Tools Access
          </h1>
          <p className="text-muted-foreground text-lg">
            Get instant access to our professional free Amazon tools suite
          </p>
        </div>

        <Card className="gradient-card border-primary/20 shadow-premium">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Quick Sign-up Required
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter your details below to unlock all our free tools
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                    className="bg-background/50 border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                    required
                    className="bg-background/50 border-primary/20 focus:border-primary"
                  />
                </div>

                {/* Honeypot field - hidden from users but visible to bots */}
                <div className="absolute opacity-0 pointer-events-none" aria-hidden="true" tabIndex={-1}>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="Your website URL"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
              </div>

                              <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="font-semibold mb-3">What you'll get access to:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <Badge variant="outline" className="p-3 text-center">
                          ROI Calculator
                        </Badge>
                        <Badge variant="outline" className="p-3 text-center">
                          LTV Calculator
                        </Badge>
                        <Badge variant="outline" className="p-3 text-center">
                          ACOS Target Calculator
                        </Badge>
                        <Badge variant="outline" className="p-3 text-center">
                          Multi-Channel Dashboard
                        </Badge>
                      </div>
                    </div>
                  </div>

                <div className="text-xs text-center text-muted-foreground space-y-1">
                  <p>• 90-day access to all free tools</p>
                  <p>• No spam, just valuable marketplace insights</p>
                  <p>• Professional-grade tools used by successful sellers</p>
                </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full gradient-primary shadow-glow transition-premium hover:scale-105 group"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Granting Access..."
                ) : (
                  <>
                    <Unlock className="mr-2 h-5 w-5" />
                    Get Free Access Now
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-primary/10 text-center text-xs text-muted-foreground">
              When you sign up, you agree to let us contact you about our tools and services. 
              We set a cookie that lasts 90 days to remember you, so you don't have to enter your details again. You can delete it anytime in your browser settings.

            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Card className="gradient-card border-primary/20 shadow-premium">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Need More Advanced Solutions?</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                These free tools are just the beginning. Get custom analytics, automation, 
                and growth strategies tailored to your business.
              </p>
              <Button 
                variant="outline" 
                className="transition-premium hover:scale-105"
                onClick={() => navigateToSection('services')}
              >
                Learn About Our Services
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};