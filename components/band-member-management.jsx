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
import { Plus, Edit, Trash2, Upload, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function BandMemberManagement({
  bandMembers = [],
  onBandMembersUpdate,
}) {
  const [editingMember, setEditingMember] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    description: "",
    image_url: "",
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
      const fileName = `band-member-${Date.now()}.${fileExt}`;
      const filePath = `band-members/${fileName}`;

      const { data, error } = await supabase.storage
        .from("gallery") // Using existing gallery bucket
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

      if (editingMember) {
        const { data, error } = await supabase
          .from("band_members")
          .update(formData)
          .eq("id", editingMember.id)
          .select()
          .single();

        if (error) throw error;

        const updatedMembers = bandMembers.map((m) =>
          m.id === editingMember.id ? { ...m, ...data } : m
        );
        onBandMembersUpdate(updatedMembers);

        toast({ title: "Band member updated successfully!" });
      } else {
        const { data, error } = await supabase
          .from("band_members")
          .insert({ ...formData, display_order: bandMembers.length, is_active: true })
          .select()
          .single();

        if (error) throw error;

        onBandMembersUpdate([...bandMembers, data]);
        toast({ title: "Band member added successfully!" });
      }

      setFormData({ name: "", role: "", description: "", image_url: "" });
      setEditingMember(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to save band member",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteMember = async (id) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("band_members")
        .delete()
        .eq("id", id);

      if (error) throw error;

      onBandMembersUpdate(bandMembers.filter((m) => m.id !== id));
      toast({ title: "Band member deleted successfully!" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete band member",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold border-b border-gray-500">Band Members</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingMember(null);
                setFormData({
                  name: "",
                  role: "",
                  description: "",
                  image_url: "",
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingMember ? "Edit Band Member" : "Add Band Member"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  placeholder="e.g., Lead Vocalist & Guitar"
                  required
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
              <div className="space-y-2">
                <Label>Member Image</Label>
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
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {uploadingImage ? "Uploading..." : "Upload Image"}
                    </Button>
                    {formData.image_url && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          setFormData({ ...formData, image_url: "" })
                        }
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <Input
                    placeholder="Or paste image URL"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                  />
                  {formData.image_url && (
                    <div className="mt-2">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover border"
                      />
                    </div>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : editingMember
                  ? "Update Member"
                  : "Add Member"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bandMembers.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={member.image_url || "/placeholder.svg"}
                  alt={member.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-primary">{member.role}</p>
                  {member.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {member.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingMember(member);
                    setFormData({
                      name: member.name,
                      role: member.role,
                      description: member.description || "",
                      image_url: member.image_url || "",
                    });
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteMember(member.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {bandMembers.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Band Members</h3>
              <p className="text-muted-foreground">
                Add band members to showcase your team.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
