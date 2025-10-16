// "use client";

import { useState } from "react";
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
import { Plus, Edit, Trash2, MapPin, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function LocationManagement({ locations = [], onLocationsUpdate }) {
  const [editingLocation, setEditingLocation] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const { toast } = useToast();

  const geocodeLocation = async (locationName) => {
    try {
      setGeocoding(true);
      
      // Using Nominatim (OpenStreetMap) - free geocoding service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          locationName
        )}&format=json&limit=1`,
        {
          headers: {
            'User-Agent': 'UltraBandMusic/1.0' 
          }
        }
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
          display_name: data[0].display_name
        };
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({ 
        title: "Please enter a location name", 
        variant: "destructive" 
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Geocode the location
      const geoData = await geocodeLocation(formData.name);
      
      if (!geoData) {
        toast({
          title: "Location not found",
          description: "Please check the location name and try again. Be more specific (e.g., 'Paris, France' instead of just 'Paris')",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      const supabase = createClient();
      
      const locationData = {
        name: formData.name,
        description: formData.description,
        latitude: geoData.latitude,
        longitude: geoData.longitude
      };

      if (editingLocation) {
        const { data, error } = await supabase
          .from("locations")
          .update(locationData)
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
            ...locationData,
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
      toast({ 
        title: "Error saving location", 
        description: err.message,
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteLocation = async (id) => {
    if (!confirm("Are you sure you want to delete this location?")) {
      return;
    }

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
        <h2 className="text-2xl font-bold border-b border-gray-500">Locations</h2>
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
                <Label>Location Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Chicago, Illinois or Paris, France"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Be specific for better accuracy (City, State/Country)
                </p>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Optional details about this location"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || geocoding}
              >
                {geocoding ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Finding location...
                  </>
                ) : isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editingLocation ? (
                  "Update Location"
                ) : (
                  "Add Location"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((loc) => (
          <Card key={loc.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">{loc.name}</h3>
                      {loc.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {loc.description}
                        </p>
                      )}
                      {loc.latitude && loc.longitude && (
                        <p className="text-xs text-muted-foreground mt-1">
                          📍 {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
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
              </div>
            </CardContent>
          </Card>
        ))}

        {locations.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Locations</h3>
              <p className="text-muted-foreground mb-4">
                Add locations to showcase your tours.
              </p>
              <p className="text-sm text-muted-foreground">
                Just enter city names like "Chicago, IL" or "Tokyo, Japan"
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}