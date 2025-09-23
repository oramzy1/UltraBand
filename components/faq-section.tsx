import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { HelpCircle, Music, Clock, Shield, CreditCard, MapPin } from "lucide-react";
  
  interface FAQItem {
    id: string;
    question: string;
    answer: string;
    icon?: React.ReactNode;
  }
  
  const faqData: FAQItem[] = [
    {
      id: "booking-process",
      question: "How far in advance should I book Ultra Band?",
      answer: "We recommend booking at least 6-8 weeks in advance for optimal date availability, especially during peak wedding and event seasons (May-October). However, we do accommodate last-minute bookings when possible.",
      icon: <Clock className="h-4 w-4" />
    },
    {
      id: "pricing-payment",
      question: "How does pricing work and when is payment due?",
      answer: "Our pricing is based on event size, duration, location, and specific requirements. A 50% deposit is required to secure your date, with the remaining balance due 7 days before your event. We accept all major credit cards, bank transfers, and certified checks.",
      icon: <CreditCard className="h-4 w-4" />
    },
    {
      id: "music-requests",
      question: "Can I request specific songs and create a custom playlist?",
      answer: "Absolutely! We encourage clients to share their favorite songs and must-have tracks. We'll work with you to create a customized playlist that matches your event's vibe while reading the crowd to keep the energy perfect throughout the night.",
      icon: <Music className="h-4 w-4" />
    },
    {
      id: "equipment-setup",
      question: "What equipment do you provide and how much setup space is needed?",
      answer: "We provide a complete professional sound system, wireless microphones, DJ equipment, and ambient lighting. We need approximately 8x8 feet of space near power outlets. All setup and breakdown is included in our service.",
      icon: <Shield className="h-4 w-4" />
    },
    {
      id: "travel-location",
      question: "Do you travel for destination events and what are the fees?",
      answer: "Yes, we travel throughout the region and offer destination event services. Travel fees apply for events over 50 miles from our base location. Overnight accommodations may be required for events over 150 miles, which would be an additional cost.",
      icon: <MapPin className="h-4 w-4" />
    },
    {
      id: "backup-plan",
      question: "What happens if there's an equipment failure or emergency?",
      answer: "We always bring backup equipment for all critical components. In the extremely rare event of a band member emergency, we have a network of professional substitute musicians. Your event's success is guaranteed.",
      icon: <Shield className="h-4 w-4" />
    },
    {
      id: "event-duration",
      question: "How long do you typically perform and can you extend the event?",
      answer: "Our standard packages include 4-5 hours of performance time with breaks. We can extend performances for an additional hourly rate if you want to keep the party going. Just let us know during planning or even on the day of the event.",
      icon: <Clock className="h-4 w-4" />
    },
    {
      id: "cancellation-policy",
      question: "What is your cancellation and rescheduling policy?",
      answer: "Cancellations made more than 60 days before the event receive a full refund minus a small processing fee. Cancellations within 60 days forfeit the deposit. We offer one free date change if made at least 30 days in advance, subject to availability.",
      icon: <HelpCircle className="h-4 w-4" />
    }
  ];
  
  export function FAQSection() {
    return (
      <section className="py-20 px-4 bg-gradient-secondary">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Everything you need to know about booking Ultra Band for your event. 
              Can't find what you're looking for? Contact us directly.
            </p>
          </div>
  
          <Card className="bg-gradient-card shadow-elegant border-border/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <HelpCircle className="h-6 w-6 text-primary" />
                Event Booking FAQs
              </CardTitle>
              <p className="text-muted-foreground">
                Get answers to the most common questions about our services
              </p>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-2">
                {faqData.map((faq, index) => (
                  <AccordionItem 
                    key={faq.id} 
                    value={faq.id}
                    className="border border-border/20 rounded-lg px-4 transition-smooth hover:shadow-md hover:border-primary/20"
                  >
                    <AccordionTrigger className="text-left hover:no-underline group">
                      <div className="flex items-center gap-3">
                        <div className="text-primary transition-smooth group-hover:text-primary/80">
                          {faq.icon}
                        </div>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pl-7 pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
  
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Still have questions? We're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+1-555-ECHOES"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-smooth hover:bg-primary/90 glow-primary"
              >
                Call +1-555-ECHOES
              </a>
              <a
                href="mailto:info@ultraband.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium transition-smooth hover:bg-secondary/80"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }