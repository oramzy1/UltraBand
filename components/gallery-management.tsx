// "use client";

// import type React from "react";

// import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Switch } from "@/components/ui/switch";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { ImageIcon, Plus, Edit, Trash2, Star } from "lucide-react";
// import { createClient } from "@/lib/supabase/client";
// import { useToast } from "@/hooks/use-toast";
// import type { GalleryItem } from "@/lib/types";

// interface GalleryManagementProps {
//   gallery: GalleryItem[];
//   onGalleryUpdate: (gallery: GalleryItem[]) => void;
// }

// export function GalleryManagement({
//   gallery,
//   onGalleryUpdate,
// }: GalleryManagementProps) {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [file, setFile] = useState(null);
//   const { toast } = useToast();

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     media_url: "",
//     media_type: "image" as "image" | "video",
//     is_featured: false,
//   });

//   const resetForm = () => {
//     setFormData({
//       title: "",
//       description: "",
//       media_url: "",
//       media_type: "image",
//       is_featured: false,
//     });
//     setEditingItem(null);
//   };

//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault()
//   //   setIsSubmitting(true)

//   //   try {
//   //     const supabase = createClient()

//   //     if (editingItem) {
//   //       // Update existing item
//   //       const { data, error } = await supabase
//   //         .from("gallery")
//   //         .update(formData)
//   //         .eq("id", editingItem.id)
//   //         .select()
//   //         .single()

//   //       if (error) throw error

//   //       const updatedGallery = gallery.map((item) => (item.id === editingItem.id ? { ...item, ...data } : item))
//   //       onGalleryUpdate(updatedGallery)

//   //       toast({
//   //         title: "Gallery Item Updated",
//   //         description: "Gallery item has been successfully updated.",
//   //       })
//   //     } else {
//   //       // Create new item
//   //       const { data, error } = await supabase.from("gallery").insert(formData).select().single()

//   //       if (error) throw error

//   //       onGalleryUpdate([...gallery, data])

//   //       toast({
//   //         title: "Gallery Item Created",
//   //         description: "New gallery item has been successfully created.",
//   //       })
//   //     }

//   //     setIsDialogOpen(false)
//   //     resetForm()
//   //   } catch (error) {
//   //     console.error("Error saving gallery item:", error)
//   //     toast({
//   //       title: "Error",
//   //       description: "Failed to save gallery item. Please try again.",
//   //       variant: "destructive",
//   //     })
//   //   } finally {
//   //     setIsSubmitting(false)
//   //   }
//   // }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const supabase = createClient();

//       let mediaUrl = formData.media_url;

//       // If there's a new file
//       if (file) {
//         const fileExt = file.name.split(".").pop();
//         const fileName = `${Date.now()}.${fileExt}`;
//         const filePath = `${formData.media_type}/${fileName}`;
      
//         const { error: uploadError } = await supabase.storage
//           .from("gallery")
//           .upload(filePath, file);
      
//         if (uploadError) throw uploadError;
      
//         const { data } = supabase.storage.from("gallery").getPublicUrl(filePath);
//         mediaUrl = data.publicUrl;
//       }

//       // Save to DB
//       const payload = { ...formData, media_url: mediaUrl };
//       delete (payload as any).file;

//       if (editingItem) {
//         const { data, error } = await supabase
//           .from("gallery")
//           .update(payload)
//           .eq("id", editingItem.id)
//           .select()
//           .single();

//         if (error) throw error;
//         const updatedGallery = gallery.map((item) =>
//           item.id === editingItem.id ? { ...item, ...data } : item
//         );
//         onGalleryUpdate(updatedGallery);

//         toast({ title: "Gallery Item Updated" });
//       } else {
//         const { data, error } = await supabase
//           .from("gallery")
//           .insert(payload)
//           .select()
//           .single();

//         if (error) throw error;
//         onGalleryUpdate([...gallery, data]);

//         toast({ title: "Gallery Item Created" });
//       }

//       setIsDialogOpen(false);
//       setFile(null)
//       resetForm();
//     } catch (error) {
//       console.error("Error saving gallery item:", error);
//       toast({
//         title: "Error",
//         description: "Failed to save gallery item. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleEdit = (item: GalleryItem) => {
//     setEditingItem(item);
//     setFormData({
//       title: item.title,
//       description: item.description || "",
//       media_url: item.media_url,
//       media_type: item.media_type,
//       is_featured: item.is_featured,
//     });
//     setIsDialogOpen(true);
//   };

//   const handleDelete = async (itemId: string) => {
//     if (!confirm("Are you sure you want to delete this gallery item?")) return;

//     try {
//       const supabase = createClient();
//       const { error } = await supabase
//         .from("gallery")
//         .delete()
//         .eq("id", itemId);

//       if (error) throw error;

//       const updatedGallery = gallery.filter((item) => item.id !== itemId);
//       onGalleryUpdate(updatedGallery);

//       toast({
//         title: "Gallery Item Deleted",
//         description: "Gallery item has been successfully deleted.",
//       });
//     } catch (error) {
//       console.error("Error deleting gallery item:", error);
//       toast({
//         title: "Error",
//         description: "Failed to delete gallery item. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   const toggleFeatured = async (itemId: string, currentFeatured: boolean) => {
//     try {
//       const supabase = createClient();
//       const { data, error } = await supabase
//         .from("gallery")
//         .update({ is_featured: !currentFeatured })
//         .eq("id", itemId)
//         .select()
//         .single();

//       if (error) throw error;

//       const updatedGallery = gallery.map((item) =>
//         item.id === itemId ? { ...item, ...data } : item
//       );
//       onGalleryUpdate(updatedGallery);

//       toast({
//         title: currentFeatured ? "Removed from Featured" : "Added to Featured",
//         description: `Gallery item ${
//           currentFeatured ? "removed from" : "added to"
//         } featured section.`,
//       });
//     } catch (error) {
//       console.error("Error updating featured status:", error);
//       toast({
//         title: "Error",
//         description: "Failed to update featured status. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold">Gallery Management</h2>
//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogTrigger asChild>
//             <Button onClick={resetForm}>
//               <Plus className="h-4 w-4 mr-2" />
//               Add Media
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-2xl">
//             <DialogHeader>
//               <DialogTitle>
//                 {editingItem ? "Edit Gallery Item" : "Add New Gallery Item"}
//               </DialogTitle>
//             </DialogHeader>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="title">Title *</Label>
//                   <Input
//                     id="title"
//                     value={formData.title}
//                     onChange={(e) =>
//                       setFormData({ ...formData, title: e.target.value })
//                     }
//                     required
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="media_type">Media Type *</Label>
//                   <Select
//                     value={formData.media_type}
//                     onValueChange={(value: "image" | "video") =>
//                       setFormData({ ...formData, media_type: value })
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="image">Image</SelectItem>
//                       <SelectItem value="video">Video</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="media_file">Upload Media *</Label>
//                 <Input
//                   id="media_file"
//                   type="file"
//                   accept={
//                     formData.media_type === "image" ? "image/*" : "video/*"
//                   }
//                   onChange={(e) => {
//                     const selectedFile = e.target.files?.[0];
//                     if (selectedFile) {
//                       setFormData({
//                         ...formData,
//                         media_url: selectedFile.name,
//                       }); // just show filename
//                       setFile(selectedFile); // keep real file in state
//                     }
//                   }}
//                   required={!editingItem}
//                 />
//               </div>

//               {file && (
//   <div className="mt-2">
//     {formData.media_type === "image" ? (
//       <img
//         src={URL.createObjectURL(file)}
//         alt="preview"
//         className="w-full h-40 object-cover rounded"
//       />
//     ) : (
//       <video
//         src={URL.createObjectURL(file)}
//         className="w-full h-40 object-cover rounded"
//         controls
//       />
//     )}
//   </div>
// )}


//               <div className="space-y-2">
//                 <Label htmlFor="description">Description</Label>
//                 <Textarea
//                   id="description"
//                   value={formData.description}
//                   onChange={(e) =>
//                     setFormData({ ...formData, description: e.target.value })
//                   }
//                   rows={3}
//                 />
//               </div>

//               <div className="flex items-center space-x-2">
//                 <Switch
//                   id="is_featured"
//                   checked={formData.is_featured}
//                   onCheckedChange={(checked) =>
//                     setFormData({ ...formData, is_featured: checked })
//                   }
//                 />
//                 <Label htmlFor="is_featured">Featured (show on homepage)</Label>
//               </div>

//               <div className="flex justify-end gap-2">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setIsDialogOpen(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={isSubmitting}>
//                   {isSubmitting
//                     ? "Saving..."
//                     : editingItem
//                     ? "Update Item"
//                     : "Add Item"}
//                 </Button>
//               </div>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {gallery.map((item) => (
//           <Card key={item.id} className="overflow-hidden">
//             <div className="aspect-video relative">
//               {item.media_type === "image" ? (
//                 <img
//                   src={item.media_url || "/placeholder.svg"}
//                   alt={item.title}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <video
//                   src={item.media_url}
//                   className="w-full h-full object-cover"
//                   controls
//                 />
//               )}
//               {item.is_featured && (
//                 <div className="absolute top-2 right-2">
//                   <Star className="h-5 w-5 text-yellow-500 fill-current" />
//                 </div>
//               )}
//             </div>
//             <CardContent className="p-4">
//               <h3 className="font-semibold mb-1">{item.title}</h3>
//               {item.description && (
//                 <p className="text-sm text-muted-foreground mb-3">
//                   {item.description}
//                 </p>
//               )}
//               <div className="flex justify-between items-center">
//                 <div className="flex gap-2">
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => handleEdit(item)}
//                   >
//                     <Edit className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant={item.is_featured ? "default" : "outline"}
//                     onClick={() => toggleFeatured(item.id, item.is_featured)}
//                   >
//                     <Star className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="destructive"
//                     onClick={() => handleDelete(item.id)}
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//                 <span className="text-xs text-muted-foreground capitalize">
//                   {item.media_type}
//                 </span>
//               </div>
//             </CardContent>
//           </Card>
//         ))}

//         {gallery.length === 0 && (
//           <div className="col-span-full">
//             <Card>
//               <CardContent className="text-center py-12">
//                 <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
//                 <h3 className="text-lg font-semibold mb-2">No Gallery Items</h3>
//                 <p className="text-muted-foreground">
//                   Add your first photo or video to get started.
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageIcon, Plus, Edit, Trash2, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { GalleryItem } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GalleryManagementProps {
  gallery: GalleryItem[];
  onGalleryUpdate: (gallery: GalleryItem[]) => void;
}

export function GalleryManagement({
  gallery,
  onGalleryUpdate,
}: GalleryManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null); // Fixed type
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    media_url: "",
    media_type: "image" as "image" | "video",
    is_featured: false,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      media_url: "",
      media_type: "image",
      is_featured: false,
    });
    setEditingItem(null);
    setFile(null); // Clear file when resetting
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
    // Add validation
    if (!editingItem && !file) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      let mediaUrl = formData.media_url;

      // If there's a new file
      if (file) {
        console.log("Starting file upload...", file.name); // Debug log
        
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${formData.media_type}/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("gallery")
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw uploadError;
        }

        console.log("Upload successful:", uploadData); // Debug log

        const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(filePath);
        mediaUrl = urlData.publicUrl;
        
        console.log("Public URL:", mediaUrl); // Debug log
      }

      // Save to DB
      const payload = { 
        title: formData.title.trim(),
        description: formData.description.trim(),
        media_url: mediaUrl,
        media_type: formData.media_type,
        is_featured: formData.is_featured
      };

      console.log("Saving to DB:", payload); // Debug log

      if (editingItem) {
        const { data, error } = await supabase
          .from("gallery")
          .update(payload)
          .eq("id", editingItem.id)
          .select()
          .single();

        if (error) {
          console.error("DB update error:", error);
          throw error;
        }

        const updatedGallery = gallery.map((item) =>
          item.id === editingItem.id ? { ...item, ...data } : item
        );
        onGalleryUpdate(updatedGallery);

        toast({ 
          title: "Success",
          description: "Gallery item updated successfully."
        });
      } else {
        const { data, error } = await supabase
          .from("gallery")
          .insert(payload)
          .select()
          .single();

        if (error) {
          console.error("DB insert error:", error);
          throw error;
        }

        onGalleryUpdate([...gallery, data]);

        toast({ 
          title: "Success",
          description: "Gallery item created successfully."
        });
      }

      setIsDialogOpen(false);
      resetForm();
      
    } catch (error: any) {
      console.error("Error saving gallery item:", error);
      
      // More specific error messages
      let errorMessage = "Failed to save gallery item. Please try again.";
      
      if (error.message?.includes("storage")) {
        errorMessage = "Failed to upload file. Please check your file and try again.";
      } else if (error.message?.includes("database") || error.message?.includes("relation")) {
        errorMessage = "Database error. Please contact support.";
      } else if (error.message?.includes("permission")) {
        errorMessage = "You don't have permission to perform this action.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      media_url: item.media_url,
      media_type: item.media_type,
      is_featured: item.is_featured,
    });
    setFile(null); // Clear any existing file
    setIsDialogOpen(true);
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("gallery")
        .delete()
        .eq("id", itemId);

      if (error) throw error;

      const updatedGallery = gallery.filter((item) => item.id !== itemId);
      onGalleryUpdate(updatedGallery);

      toast({
        title: "Success",
        description: "Gallery item deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting gallery item:", error);
      toast({
        title: "Error",
        description: "Failed to delete gallery item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleFeatured = async (itemId: string, currentFeatured: boolean) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("gallery")
        .update({ is_featured: !currentFeatured })
        .eq("id", itemId)
        .select()
        .single();

      if (error) throw error;

      const updatedGallery = gallery.map((item) =>
        item.id === itemId ? { ...item, ...data } : item
      );
      onGalleryUpdate(updatedGallery);

      toast({
        title: currentFeatured ? "Removed from Featured" : "Added to Featured",
        description: `Gallery item ${
          currentFeatured ? "removed from" : "added to"
        } featured section.`,
      });
    } catch (error) {
      console.error("Error updating featured status:", error);
      toast({
        title: "Error",
        description: "Failed to update featured status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size (e.g., 10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      const isValidImage = selectedFile.type.startsWith('image/');
      const isValidVideo = selectedFile.type.startsWith('video/');
      
      if (formData.media_type === 'image' && !isValidImage) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }
      
      if (formData.media_type === 'video' && !isValidVideo) {
        toast({
          title: "Invalid file type",
          description: "Please select a video file.",
          variant: "destructive",
        });
        return;
      }

      setFile(selectedFile);
      setFormData({
        ...formData,
        media_url: selectedFile.name,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="md:text-2xl font-bold">Gallery Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Gallery Item" : "Add New Gallery Item"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="media_type">Media Type *</Label>
                  <Select
                    value={formData.media_type}
                    onValueChange={(value: "image" | "video") =>
                      setFormData({ ...formData, media_type: value })
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="media_file">
                  Upload Media {!editingItem && "*"}
                </Label>
                <Input
                  id="media_file"
                  type="file"
                  accept={
                    formData.media_type === "image" ? "image/*" : "video/*"
                  }
                  onChange={handleFileChange}
                  required={!editingItem}
                  disabled={isSubmitting}
                  className="cursor-pointer"
                />
                {!editingItem && (
                  <p className="text-xs text-muted-foreground">
                    Maximum file size: 10MB
                  </p>
                )}
              </div>

              {file && (
                <div className="mt-2">
                  {formData.media_type === "image" ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-full h-40 object-cover rounded"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(file)}
                      className="w-full h-40 object-cover rounded"
                      controls
                    />
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_featured: checked })
                  }
                  disabled={isSubmitting}
                />
                <Label htmlFor="is_featured">Featured (show on homepage)</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Saving..."
                    : editingItem
                    ? "Update Item"
                    : "Add Item"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-video relative">
              {item.media_type === "image" ? (
                <img
                  src={item.media_url || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={item.media_url}
                  className="w-full h-full object-cover"
                  controls
                />
              )}
              {item.is_featured && (
                <div className="absolute top-2 right-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-1">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-muted-foreground mb-3">
                  {item.description}
                </p>
              )}
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={item.is_featured ? "default" : "outline"}
                    onClick={() => toggleFeatured(item.id, item.is_featured)}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-xs text-muted-foreground capitalize">
                  {item.media_type}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}

        {gallery.length === 0 && (
          <div className="col-span-full">
            <Card>
              <CardContent className="text-center py-12">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Gallery Items</h3>
                <p className="text-muted-foreground">
                  Add your first photo or video to get started.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div> */}
      <TooltipProvider>
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {gallery.map((item) => (
      <Card key={item.id} className="overflow-hidden">
        <div className="aspect-video relative">
          {item.media_type === "image" ? (
            <img
              src={item.media_url || "/placeholder.svg"}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={item.media_url}
              className="w-full h-full object-cover"
              controls
            />
          )}
          {item.is_featured && (
            <div className="absolute top-2 right-2">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-1">{item.title}</h3>
          {item.description && (
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2 cursor-help">
                  {item.description}
                </p>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">{item.description}</p>
              </TooltipContent>
            </Tooltip>
          )}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="cursor-pointer"
                onClick={() => handleEdit(item)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                className="cursor-pointer"
                variant={item.is_featured ? "default" : "outline"}
                onClick={() => toggleFeatured(item.id, item.is_featured)}
              >
                <Star className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="cursor-pointer"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-xs text-muted-foreground capitalize">
              {item.media_type}
            </span>
          </div>
        </CardContent>
      </Card>
    ))}

    {gallery.length === 0 && (
      <div className="col-span-full">
        <Card>
          <CardContent className="text-center py-12">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Gallery Items</h3>
            <p className="text-muted-foreground">
              Add your first photo or video to get started.
            </p>
          </CardContent>
        </Card>
      </div>
    )}
  </div>
</TooltipProvider>
    </div>
  );
}