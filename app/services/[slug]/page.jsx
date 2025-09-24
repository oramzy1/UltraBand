import { createClient } from "@/lib/supabase/server";
import {FAQSection} from '../../../components/faq-section'

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

      <FAQSection/>
    </div>
  );
}
