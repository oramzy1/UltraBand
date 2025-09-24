"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function LocationManagement({ locations = [], onLocationsUpdate }) {
  const [editingLocation, setEditingLocation] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      if (editingLocation) {
        const { data, error } = await supabase
          .from("locations")
          .update(formData)
          .eq("id", editingLocation.id)
          .select()
          .single();

        if (error) throw error;

        onLocationsUpdate(
          locations.map((l) =>
            l.id === editingLocation.id ? { ...l, ...data } : l
          )
        );
        toast({ title: "Location updated successfully!" });
      } else {
        const { data, error } = await supabase
          .from("locations")
          .insert({
            ...formData,
            display_order: locations.length,
            is_active: true,
          })
          .select()
          .single();

        if (error) throw error;

        onLocationsUpdate([...locations, data]);
        toast({ title: "Location added successfully!" });
      }

      setFormData({ name: "", description: "" });
      setEditingLocation(null);
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Error saving location:", err);
      toast({ title: "Error saving location", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteLocation = async (id) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("locations").delete().eq("id", id);
      if (error) throw error;

      onLocationsUpdate(locations.filter((l) => l.id !== id));
      toast({ title: "Location deleted successfully!" });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete location",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Locations</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingLocation(null);
                setFormData({ name: "", description: "" });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingLocation ? "Edit Location" : "Add Location"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : editingLocation
                  ? "Update Location"
                  : "Add Location"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((loc) => (
          <Card key={loc.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{loc.name}</h3>
                {loc.description && (
                  <p className="text-sm text-muted-foreground">
                    {loc.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingLocation(loc);
                    setFormData({
                      name: loc.name,
                      description: loc.description || "",
                    });
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteLocation(loc.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {locations.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Locations</h3>
              <p className="text-muted-foreground">
                Add locations to showcase your tours.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
