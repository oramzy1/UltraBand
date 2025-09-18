"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ImageIcon, Plus, Edit, Trash2, Star } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { GalleryItem } from "@/lib/types"

interface GalleryManagementProps {
  gallery: GalleryItem[]
  onGalleryUpdate: (gallery: GalleryItem[]) => void
}

export function GalleryManagement({ gallery, onGalleryUpdate }: GalleryManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    media_url: "",
    media_type: "image" as "image" | "video",
    is_featured: false,
  })

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      media_url: "",
      media_type: "image",
      is_featured: false,
    })
    setEditingItem(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()

      if (editingItem) {
        // Update existing item
        const { data, error } = await supabase
          .from("gallery")
          .update(formData)
          .eq("id", editingItem.id)
          .select()
          .single()

        if (error) throw error

        const updatedGallery = gallery.map((item) => (item.id === editingItem.id ? { ...item, ...data } : item))
        onGalleryUpdate(updatedGallery)

        toast({
          title: "Gallery Item Updated",
          description: "Gallery item has been successfully updated.",
        })
      } else {
        // Create new item
        const { data, error } = await supabase.from("gallery").insert(formData).select().single()

        if (error) throw error

        onGalleryUpdate([...gallery, data])

        toast({
          title: "Gallery Item Created",
          description: "New gallery item has been successfully created.",
        })
      }

      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving gallery item:", error)
      toast({
        title: "Error",
        description: "Failed to save gallery item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description || "",
      media_url: item.media_url,
      media_type: item.media_type,
      is_featured: item.is_featured,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("gallery").delete().eq("id", itemId)

      if (error) throw error

      const updatedGallery = gallery.filter((item) => item.id !== itemId)
      onGalleryUpdate(updatedGallery)

      toast({
        title: "Gallery Item Deleted",
        description: "Gallery item has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting gallery item:", error)
      toast({
        title: "Error",
        description: "Failed to delete gallery item. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleFeatured = async (itemId: string, currentFeatured: boolean) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("gallery")
        .update({ is_featured: !currentFeatured })
        .eq("id", itemId)
        .select()
        .single()

      if (error) throw error

      const updatedGallery = gallery.map((item) => (item.id === itemId ? { ...item, ...data } : item))
      onGalleryUpdate(updatedGallery)

      toast({
        title: currentFeatured ? "Removed from Featured" : "Added to Featured",
        description: `Gallery item ${currentFeatured ? "removed from" : "added to"} featured section.`,
      })
    } catch (error) {
      console.error("Error updating featured status:", error)
      toast({
        title: "Error",
        description: "Failed to update featured status. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gallery Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Gallery Item" : "Add New Gallery Item"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="media_type">Media Type *</Label>
                  <Select
                    value={formData.media_type}
                    onValueChange={(value: "image" | "video") => setFormData({ ...formData, media_type: value })}
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
                <Label htmlFor="media_url">Media URL *</Label>
                <Input
                  id="media_url"
                  type="url"
                  value={formData.media_url}
                  onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="is_featured">Featured (show on homepage)</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editingItem ? "Update Item" : "Add Item"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
                <video src={item.media_url} className="w-full h-full object-cover" controls />
              )}
              {item.is_featured && (
                <div className="absolute top-2 right-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-1">{item.title}</h3>
              {item.description && <p className="text-sm text-muted-foreground mb-3">{item.description}</p>}
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={item.is_featured ? "default" : "outline"}
                    onClick={() => toggleFeatured(item.id, item.is_featured)}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-xs text-muted-foreground capitalize">{item.media_type}</span>
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
                <p className="text-muted-foreground">Add your first photo or video to get started.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
