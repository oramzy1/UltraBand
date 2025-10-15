'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HelpCircle,
  Music,
  Clock,
  Shield,
  CreditCard,
  MapPin,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";


const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import ContactUsAnim from "@/public/Contact Us.json";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon?: React.ReactNode;
}

const faqData: FAQItem[] = [
  {
    id: "booking-process",
    question: "How far in advance should I book Ultra Band Music?",
    answer:
      "We recommend booking at least 6-8 weeks in advance for optimal date availability, especially during peak wedding and event seasons (May-October). However, we do accommodate last-minute bookings when possible.",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    id: "pricing-payment",
    question: "How does pricing work and when is payment due?",
    answer:
      "Our pricing is based on event size, duration, location, and specific requirements. A 50% deposit is required to secure your date, with the remaining balance due 7 days before your event. We accept all major credit cards, bank transfers, and certified checks.",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    id: "music-requests",
    question: "Can I request specific songs and create a custom playlist?",
    answer:
      "Absolutely! We encourage clients to share their favorite songs and must-have tracks. We'll work with you to create a customized playlist that matches your event's vibe while reading the crowd to keep the energy perfect throughout the night.",
    icon: <Music className="h-4 w-4" />,
  },
  {
    id: "equipment-setup",
    question:
      "What equipment do you provide and how much setup space is needed?",
    answer:
      "We provide a complete professional sound system, wireless microphones, DJ equipment, and ambient lighting. We need approximately 8x8 feet of space near power outlets. All setup and breakdown is included in our service.",
    icon: <Shield className="h-4 w-4" />,
  },
  {
    id: "travel-location",
    question: "Do you travel for destination events and what are the fees?",
    answer:
      "Yes, we travel throughout the region and offer destination event services. Travel fees apply for events over 50 miles from our base location. Overnight accommodations may be required for events over 150 miles, which would be an additional cost.",
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    id: "backup-plan",
    question: "What happens if there's an equipment failure or emergency?",
    answer:
      "We always bring backup equipment for all critical components. In the extremely rare event of a band member emergency, we have a network of professional substitute musicians. Your event's success is guaranteed.",
    icon: <Shield className="h-4 w-4" />,
  },
  {
    id: "event-duration",
    question: "How long do you typically perform and can you extend the event?",
    answer:
      "Our standard packages include 4-5 hours of performance time with breaks. We can extend performances for an additional hourly rate if you want to keep the party going. Just let us know during planning or even on the day of the event.",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    id: "cancellation-policy",
    question: "What is your cancellation and rescheduling policy?",
    answer:
      "Cancellations made more than 60 days before the event receive a full refund minus a small processing fee. Cancellations within 60 days forfeit the deposit. We offer one free date change if made at least 30 days in advance, subject to availability.",
    icon: <HelpCircle className="h-4 w-4" />,
  },
];

export function FAQSection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };
  
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }
  
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });
  
      form.reset();
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-secondary">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Everything you need to know about booking Ultra Band Music for your
            event. Can't find what you're looking for? Contact us directly.
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

        <div className="mt-20 grid md:grid-cols-2 gap-12 items-center">
          {/* Lottie Animation */}
          <div className="w-full flex justify-center">
            <Lottie animationData={ContactUsAnim} loop={true} className="w-80 h-80" />
          </div>

          {/* Contact Form */}
          <Card className="shadow-elegant border-border/20 backdrop-blur-sm bg-background">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Get in Touch</CardTitle>
              <p className="text-muted-foreground">
                Have more questions? Fill out the form and we'll get back to you.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <Input 
                  type="text" 
                  name="name"
                  placeholder="Your Name" 
                  required 
                  disabled={isSubmitting}
                />
                <Input 
                  type="email" 
                  name="email"
                  placeholder="Your Email" 
                  required 
                  disabled={isSubmitting}
                />
                <Textarea 
                  name="message"
                  placeholder="Your Message" 
                  rows={4} 
                  required 
                  disabled={isSubmitting}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}