export interface Booking {
  id: string
  service_category: string
  client_name: string
  client_email: string
  client_phone?: string
  event_type: string
  event_date: string
  event_time: string
  event_location: string
  event_description?: string
  budget_range?: string
  status: "pending" | "accepted" | "rejected" | "counter_proposed"
  notes?: string
  proposed_date?: string
  proposed_time?: string
  created_at: string
  updated_at: string
}

export interface GalleryItem {
  id: string
  title: string
  description?: string
  media_url: string
  media_type: "image" | "video"
  is_featured: boolean
  created_at: string
}

export interface Event {
  id: string
  title: string
  description?: string
  event_date: string
  event_time: string
  venue: string
  venue_address?: string
  ticket_url?: string
  is_public: boolean
  created_at: string
}

export interface BandInfo {
  id: string
  section: string
  title?: string
  content?: string
  image_url?: string
  updated_at: string
}
