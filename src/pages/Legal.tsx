import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Legal = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 gradient-hero">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Legal Information
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Privacy Policy, Terms of Service, and Cookie Policy for SYNQ
            </p>
          </div>
        </section>

        {/* Legal Content */}
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            
            {/* Impressum */}
            <Card id="impressum" className="gradient-card border-primary/20 shadow-premium mb-12">
              <CardHeader>
                <CardTitle className="text-3xl">Impressum</CardTitle>
                <p className="text-muted-foreground">Angaben gemäß § 5 TMG</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Diensteanbieter</h3>
                  <p className="text-muted-foreground">
                    Alexander Swade<br />
                    Hochfeld 15<br />
                    84184 Tiefenbach<br />
                    Deutschland
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Kontaktmöglichkeiten</h3>
                  <p className="text-muted-foreground mb-2">
                    <strong>E-Mail-Adresse:</strong>{" "}
                    <a href="mailto:hello@wearesynq.com" className="text-primary hover:underline">
                      hello@wearesynq.com
                    </a>
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Telefon:</strong> +49 151 5810 2274
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Umsatzsteuer-Identifikationsnummer</h3>
                  <p className="text-muted-foreground">
                    USt-IdNr.: DE317300588
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Journalistische Inhalte</h3>
                  <p className="text-muted-foreground">
                    <strong>Verantwortlich nach § 18 Abs. 2 MStV:</strong><br />
                    Alexander Swade<br />
                    Hochfeld 15<br />
                    84184 Tiefenbach<br />
                    Deutschland
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Haftungsausschluss</h3>
                  <p className="text-muted-foreground mb-3">
                    <strong>Haftung für Inhalte:</strong> Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                  </p>
                  <p className="text-muted-foreground mb-3">
                    <strong>Haftung für Links:</strong> Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Urheberrecht:</strong> Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Separator className="my-12" />

            {/* Privacy Policy */}
            <Card id="privacy" className="gradient-card border-primary/20 shadow-premium mb-12">
              <CardHeader>
                <CardTitle className="text-3xl">Privacy Policy</CardTitle>
                <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">1. Information We Collect</h3>
                  <p className="text-muted-foreground mb-3">
                    We collect information you provide directly to us, such as when you:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Fill out our contact forms</li>
                    <li>Subscribe to our newsletter</li>
                    <li>Use our free optimization tools</li>
                    <li>Communicate with us via email or phone</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">2. How We Use Your Information</h3>
                  <p className="text-muted-foreground mb-3">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Respond to your inquiries and provide customer support</li>
                    <li>Send you marketing communications (with your consent)</li>
                    <li>Analyze usage patterns to improve our website and services</li>
                    <li>Comply with legal obligations and protect our rights</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">3. Information Sharing and Disclosure</h3>
                  <p className="text-muted-foreground">
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with trusted service providers who assist us in operating our website and conducting our business.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">4. Data Security</h3>
                  <p className="text-muted-foreground">
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">5. Your Rights (GDPR & CCPA)</h3>
                  <p className="text-muted-foreground mb-3">
                    Depending on your location, you may have the following rights:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Right to access your personal data</li>
                    <li>Right to rectification of inaccurate data</li>
                    <li>Right to erasure ("right to be forgotten")</li>
                    <li>Right to restrict processing</li>
                    <li>Right to data portability</li>
                    <li>Right to object to processing</li>
                    <li>Right to withdraw consent</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">6. International Data Transfers</h3>
                  <p className="text-muted-foreground">
                    Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers in compliance with applicable data protection laws.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">7. Contact Us</h3>
                  <p className="text-muted-foreground">
                    For any privacy-related questions or to exercise your rights, contact us at: 
                    <a href="mailto:hello@wearesynq.com" className="text-primary hover:underline ml-1">
                      hello@wearesynq.com
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Separator className="my-12" />

            {/* Terms of Service */}
            <Card id="terms" className="gradient-card border-primary/20 shadow-premium mb-12">
              <CardHeader>
                <CardTitle className="text-3xl">Terms of Service</CardTitle>
                <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h3>
                  <p className="text-muted-foreground">
                    By accessing and using SYNQ's website and services, you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">2. Description of Service</h3>
                  <p className="text-muted-foreground">
                    SYNQ provides marketplace optimization services, including performance marketing, data analytics, and technology solutions for e-commerce businesses.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">3. User Responsibilities</h3>
                  <p className="text-muted-foreground mb-3">
                    You agree to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Provide accurate and complete information</li>
                    <li>Use our services only for lawful purposes</li>
                    <li>Not interfere with or disrupt our services</li>
                    <li>Respect intellectual property rights</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">4. Intellectual Property</h3>
                  <p className="text-muted-foreground">
                    All content, features, and functionality on our website are owned by SYNQ and are protected by international copyright, trademark, and other intellectual property laws.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">5. Limitation of Liability</h3>
                  <p className="text-muted-foreground">
                    SYNQ shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">6. Termination</h3>
                  <p className="text-muted-foreground">
                    We may terminate or suspend your access to our services immediately, without prior notice, for conduct that we believe violates these Terms of Service.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">7. Governing Law</h3>
                  <p className="text-muted-foreground">
                    These terms shall be governed by and construed in accordance with the laws of Spain, without regard to its conflict of law provisions.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">8. Contact Information</h3>
                  <p className="text-muted-foreground">
                    For questions about these Terms of Service, contact us at:
                    <a href="mailto:hello@wearesynq.com" className="text-primary hover:underline ml-1">
                      hello@wearesynq.com
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Separator className="my-12" />

            {/* Cookie Policy */}
            <Card id="cookies" className="gradient-card border-primary/20 shadow-premium">
              <CardHeader>
                <CardTitle className="text-3xl">Cookie Policy</CardTitle>
                <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">1. What Are Cookies</h3>
                  <p className="text-muted-foreground">
                    Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide information to website owners.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">2. How We Use Cookies</h3>
                  <p className="text-muted-foreground mb-3">
                    We use cookies for the following purposes:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li><strong>Essential cookies:</strong> Required for the website to function properly</li>
                    <li><strong>Analytics cookies:</strong> Help us understand how visitors use our website</li>
                    <li><strong>Marketing cookies:</strong> Used to track visitors across websites for advertising purposes</li>
                    <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">3. Types of Cookies We Use</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-muted-foreground">Session Cookies</h4>
                      <p className="text-muted-foreground text-sm">
                        These are temporary cookies that expire when you close your browser.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-muted-foreground">Persistent Cookies</h4>
                      <p className="text-muted-foreground text-sm">
                        These cookies remain on your device for a set period or until you delete them.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">4. Third-Party Cookies</h3>
                  <p className="text-muted-foreground">
                    We may use third-party services such as Google Analytics, which may place cookies on your device to help us analyze website traffic and improve our services.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">5. Managing Cookies</h3>
                  <p className="text-muted-foreground">
                    You can control and manage cookies through your browser settings. Please note that removing or blocking cookies may impact your user experience and some functionality may not work as intended.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">6. Updates to This Policy</h3>
                  <p className="text-muted-foreground">
                    We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">7. Contact Us</h3>
                  <p className="text-muted-foreground">
                    If you have questions about our use of cookies, contact us at:
                    <a href="mailto:hello@wearesynq.com" className="text-primary hover:underline ml-1">
                      hello@wearesynq.com
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Legal;