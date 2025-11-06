"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Upload, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function HeroCarouselManagement({
  carouselImages = [],
  onCarouselUpdate,
}) {
  const [editingImage, setEditingImage] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    image_url: "",
    title: "",
    subtitle: "",
    is_public: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const uploadImage = async (file) => {
    if (!file) return null;

    setUploadingImage(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `hero-carousel-${Date.now()}.${fileExt}`;
      const filePath = `hero-carousel/${fileName}`;

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
      setUploadingImage(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      setFormData({ ...formData, image_url: imageUrl });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      if (editingImage) {
        const { data, error } = await supabase
          .from("hero_carousel")
          .update(formData)
          .eq("id", editingImage.id)
          .select()
          .single();

        if (error) throw error;

        const updatedImages = carouselImages.map((img) =>
          img.id === editingImage.id ? { ...img, ...data } : img
        );
        onCarouselUpdate(updatedImages);

        toast({ title: "Carousel image updated successfully!" });
      } else {
        const { data, error } = await supabase
          .from("hero_carousel")
          .insert({ ...formData, display_order: carouselImages.length })
          .select()
          .single();

        if (error) throw error;

        onCarouselUpdate([...carouselImages, data]);
        toast({ title: "Carousel image added successfully!" });
      }

      setFormData({ image_url: "", title: "", subtitle: "", is_public: true });
      setEditingImage(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to save carousel image",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteImage = async (id) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("hero_carousel")
        .delete()
        .eq("id", id);

      if (error) throw error;

      onCarouselUpdate(carouselImages.filter((img) => img.id !== id));
      toast({ title: "Carousel image deleted successfully!" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete carousel image",
        variant: "destructive",
      });
    }
  };

  const toggleVisibility = async (id, currentStatus) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("hero_carousel")
        .update({ is_public: !currentStatus })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      const updatedImages = carouselImages.map((img) =>
        img.id === id ? { ...img, is_public: !currentStatus } : img
      );
      onCarouselUpdate(updatedImages);

      toast({ 
        title: `Image ${!currentStatus ? 'shown' : 'hidden'} successfully!` 
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update visibility",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold border-b border-gray-500">
          Hero Carousel Images
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="cursor-pointer"
              onClick={() => {
                setEditingImage(null);
                setFormData({
                  image_url: "",
                  title: "",
                  subtitle: "",
                  is_public: true,
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingImage ? "Edit Carousel Image" : "Add Carousel Image"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Background Image *</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                      {uploadingImage ? "Uploading..." : "Upload Image"}
                    </Button>
                    {formData.image_url && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="cursor-pointer"
                        onClick={() =>
                          setFormData({ ...formData, image_url: "" })
                        }
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  {formData.image_url && (
                    <div className="mt-2">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title (Optional)</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Image title or caption"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle (Optional)</Label>
                <Textarea
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  rows={2}
                  placeholder="Brief description"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_public"
                  checked={formData.is_public}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_public: checked })
                  }
                />
                <Label htmlFor="is_public">Visible on website</Label>
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isSubmitting || !formData.image_url}
              >
                {isSubmitting
                  ? "Saving..."
                  : editingImage
                  ? "Update Image"
                  : "Add Image"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {carouselImages.map((image) => (
          <Card key={image.id} className={!image.is_public ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="relative mb-3">
                <img
                  src={image.image_url}
                  alt={image.title || "Carousel image"}
                  className="w-full h-40 object-cover rounded"
                />
                {!image.is_public && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                    <EyeOff className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {image.title && (
                  <h3 className="font-semibold line-clamp-1">{image.title}</h3>
                )}
                {image.subtitle && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {image.subtitle}
                  </p>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  className="cursor-pointer"
                  size="sm"
                  variant="outline"
                  onClick={() => toggleVisibility(image.id, image.is_public)}
                >
                  {image.is_public ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  className="cursor-pointer"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingImage(image);
                    setFormData({
                      image_url: image.image_url,
                      title: image.title || "",
                      subtitle: image.subtitle || "",
                      is_public: image.is_public,
                    });
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  className="cursor-pointer"
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteImage(image.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {carouselImages.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Carousel Images</h3>
              <p className="text-muted-foreground">
                Add images to display in the hero carousel.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}