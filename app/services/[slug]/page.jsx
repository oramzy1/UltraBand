import { createClient } from "@/lib/supabase/server";
import {FAQSection} from '../../../components/faq-section'
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ImageIcon } from "lucide-react";

export default async function ServiceDetail({ params }) {
  const supabase = await createClient();
  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!service) return <div>Service not found</div>;

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-6 px-4">{service.title}</h1>
      <p className="text-lg mb-8 text-muted-foreground px-4">{service.description}</p>

      {service.packages?.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6 px-4">
          {service.packages.map((pkg, idx) => (
            <div key={idx} className="border rounded-lg p-6 bg-card">
              <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
              <p className="text-lg font-bold mb-3 text-primary">${pkg.price}</p>
              <ul className="list-disc list-inside text-muted-foreground">
                {pkg.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Portfolio Section */}
      {service.portfolio?.length > 0 && (
        <div className="my-12">
          <h2 className="text-2xl font-bold mb-6 px-4">{service.title}{""}— Portfolio Highlights`</h2>
          <div className="h-1 w-24 bg-purple-600 rounded-full mb-6 ml-4"></div>
          <TooltipProvider>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
              {service.portfolio.map((item, idx) => (
                <Card
                  key={idx}
                  className="overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="aspect-video relative">
                    {item.image_url ? (
                      <>
                        <img
                          src={item.image_url}
                          alt={item.client_name || 'Portfolio item'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    {item.client_name && (
                      <h3 className="font-semibold mb-1">{item.client_name}</h3>
                    )}
                    {item.description && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-sm text-muted-foreground line-clamp-2 cursor-help">
                            {item.description}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-sm">{item.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TooltipProvider>
        </div>
      )}
      <FAQSection/>
    </div>
  );
}
