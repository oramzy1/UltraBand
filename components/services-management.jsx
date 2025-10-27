"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Package, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/slugify";

// 🔹 Package Builder Component
function PackagesBuilder({ packages, setPackages }) {
  const addPackage = () => {
    setPackages([...packages, { name: "", price: "", features: [""] }]);
  };

  const updatePackage = (index, field, value) => {
    const newPackages = [...packages];
    newPackages[index][field] = value;
    setPackages(newPackages);
  };

  const removePackage = (index) => {
    setPackages(packages.filter((_, i) => i !== index));
  };

  // --- Feature List Handling ---
  const updateFeature = (pkgIndex, featIndex, value) => {
    const newPackages = [...packages];
    newPackages[pkgIndex].features[featIndex] = value;
    setPackages(newPackages);
  };

  const handleFeatureKeyDown = (e, pkgIndex, featIndex) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newPackages = [...packages];
      if (newPackages[pkgIndex].features[featIndex]?.trim() !== "") {
        newPackages[pkgIndex].features.push("");
        setPackages(newPackages);
      }
    }
  };

  const removeFeature = (pkgIndex, featIndex) => {
    const newPackages = [...packages];
    newPackages[pkgIndex].features = newPackages[pkgIndex].features.filter(
      (_, i) => i !== featIndex
    );
    setPackages(newPackages);
  };

  return (
    <div className="space-y-4">
      {packages.map((pkg, pkgIndex) => (
        <div key={pkgIndex} className="border p-4 rounded space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Package {pkgIndex + 1}</h4>
            <button
              type="button"
              onClick={() => removePackage(pkgIndex)}
              className="text-red-500 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Package Name */}
          <input
            type="text"
            placeholder="Package Name"
            value={pkg.name}
            onChange={(e) => updatePackage(pkgIndex, "name", e.target.value)}
            className="w-full border rounded p-2"
          />

          {/* Package Price */}
          <input
            type="number"
            placeholder="Price"
            value={pkg.price}
            onChange={(e) => updatePackage(pkgIndex, "price", e.target.value)}
            className="w-full border rounded p-2"
          />

          {/* Features List */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Features</p>
            {pkg.features.map((feat, featIndex) => (
              <div key={featIndex} className="flex items-center gap-2">
                <span className="text-muted-foreground w-6">
                  {featIndex + 1}.
                </span>
                <input
                  type="text"
                  placeholder={`Feature ${featIndex + 1}`}
                  value={feat}
                  onChange={(e) =>
                    updateFeature(pkgIndex, featIndex, e.target.value)
                  }
                  onKeyDown={(e) =>
                    handleFeatureKeyDown(e, pkgIndex, featIndex)
                  }
                  className="flex-1 border rounded p-2"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(pkgIndex, featIndex)}
                  className="text-red-500 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addPackage}
        className="text-sm text-green-600 flex items-center gap-1 cursor-pointer"
      >
        <Plus size={14} /> Add Package
      </button>
    </div>
  );
}

// 🔹 Portfolio Builder Component
function PortfolioBuilder({ portfolio, setPortfolio }) {
  const fileInputRef = useRef(null);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const { toast } = useToast();

  const addPortfolioItem = () => {
    setPortfolio([
      ...portfolio,
      { image_url: "", client_name: "", description: "" },
    ]);
  };

  const updatePortfolioItem = (index, field, value) => {
    const newPortfolio = [...portfolio];
    newPortfolio[index][field] = value;
    setPortfolio(newPortfolio);
  };

  const removePortfolioItem = (index) => {
    setPortfolio(portfolio.filter((_, i) => i !== index));
  };

  const uploadImage = async (file, index) => {
    if (!file) return null;

    setUploadingIndex(index);
    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `portfolio-${Date.now()}.${fileExt}`;
      const filePath = `portfolio/${fileName}`;

      const { data, error } = await supabase.storage
        .from("gallery")
        .upload(filePath, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("gallery").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadImage(file, index);
    if (imageUrl) {
      updatePortfolioItem(index, "image_url", imageUrl);
    }
  };

  return (
    <div className="space-y-4">
      {portfolio.map((item, index) => (
        <div key={index} className="border p-4 rounded space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Portfolio Item {index + 1}</h4>
            <button
              type="button"
              onClick={() => removePortfolioItem(index)}
              className="text-red-500"
            >
              <X size={16} />
            </button>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Image</p>
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleImageUpload(e, index)}
                accept="image/*"
                style={{ display: "none" }}
                id={`file-${index}`}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  document.getElementById(`file-${index}`)?.click()
                }
                disabled={uploadingIndex === index}
                className="cursor-pointer"
              >
                {uploadingIndex === index ? "Uploading..." : "Upload Image"}
              </Button>
              {item.image_url && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => updatePortfolioItem(index, "image_url", "")}
                >
                  Remove
                </Button>
              )}
            </div>
            {/* <input
              type="text"
              placeholder="Or paste image URL"
              value={item.image_url}
              onChange={(e) =>
                updatePortfolioItem(index, "image_url", e.target.value)
              }
              className="w-full border rounded p-2 text-sm"
            /> */}
            {item.image_url && (
              <img
                src={item.image_url}
                alt="Preview"
                className="w-full h-32 object-cover rounded"
              />
            )}
          </div>

          {/* Client Name */}
          <input
            type="text"
            placeholder="Client Name"
            value={item.client_name}
            onChange={(e) =>
              updatePortfolioItem(index, "client_name", e.target.value)
            }
            className="w-full border rounded p-2"
          />

          {/* Description */}
          <textarea
            placeholder="Project Description"
            value={item.description}
            onChange={(e) =>
              updatePortfolioItem(index, "description", e.target.value)
            }
            className="w-full border rounded p-2"
            rows={3}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addPortfolioItem}
        className="text-sm text-green-600 flex items-center gap-1 cursor-pointer"
      >
        <Plus size={14} /> Add Portfolio Item
      </button>
    </div>
  );
}

export function ServicesManagement({ services = [], onServicesUpdate }) {
  const [editingService, setEditingService] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
  });
  const [packages, setPackages] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const slug = slugify(formData.title);

      if (editingService) {
        const { data, error } = await supabase
          .from("services")
          .update({
            ...formData,
            slug,
            packages,
            portfolio,
          })
          .eq("id", editingService.id)
          .select()
          .single();

        if (error) throw error;

        const updatedServices = services.map((s) =>
          s.id === editingService.id ? { ...s, ...data } : s
        );
        onServicesUpdate(updatedServices);

        toast({ title: "Service updated successfully!" });
      } else {
        const { data, error } = await supabase
          .from("services")
          .insert({
            ...formData,
            slug,
            packages, 
            portfolio,
            display_order: services.length,
            is_active: true,
          })
          .select()
          .single();

        if (error) throw error;

        onServicesUpdate([...services, data]);
        toast({ title: "Service added successfully!" });
      }

      resetForm();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to save service",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteService = async (id) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("services").delete().eq("id", id);

      if (error) throw error;

      onServicesUpdate(services.filter((s) => s.id !== id));
      toast({ title: "Service deleted successfully!" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ title: "", category: "", description: "" });
    setPackages([]); 
    setPortfolio([]);
    setEditingService(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold border-b border-gray-500">
          Services
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
              }}
              className="cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Edit Service" : "Add Service"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              {/* 🔹 Package Builder */}
              <div className="space-y-2">
                <Label>Packages</Label>
                <PackagesBuilder
                  packages={packages}
                  setPackages={setPackages}
                />
              </div>

              {/* 🔹 Portfolio Builder */}
              <div className="space-y-2">
                <Label>Portfolio</Label>
                <PortfolioBuilder
                  portfolio={portfolio}
                  setPortfolio={setPortfolio}
                />
              </div>

              <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : editingService
                  ? "Update Service"
                  : "Add Service"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle>{service.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-2">
                {service.category}
              </p>
              <p className="text-sm">{service.description}</p>
              {service.packages?.length > 0 && (
                <div className="mt-3 space-y-3">
                  {service.packages.map((pkg, idx) => (
                    <div
                      key={idx}
                      className="border rounded-lg p-3 bg-muted/30"
                    >
                      <h4 className="font-semibold">{pkg.name}</h4>
                      <p className="text-sm text-primary font-medium mb-2">
                        ${pkg.price}
                      </p>
                      <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                        {pkg.features?.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => {
                    setEditingService(service);
                    setFormData({
                      title: service.title,
                      category: service.category || "",
                      description: service.description || "",
                    });
                    setPackages(service.packages || []);
                    setPortfolio(service.portfolio || []); 
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => deleteService(service.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {services.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Services</h3>
              <p className="text-muted-foreground">
                Add services to showcase what you offer.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
