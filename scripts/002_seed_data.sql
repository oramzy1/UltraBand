-- Insert initial band information
INSERT INTO public.band_info (section, title, content, image_url) VALUES
('hero', 'Ultra Band Music', 'Professional live music that captivates audiences and creates unforgettable experiences for your special events.', '/placeholder.svg?height=600&width=1200'),
('about', 'About The Band', 'Ultra Band Music is a versatile professional band with over 10 years of experience performing at weddings, corporate events, festivals, and private parties. Our repertoire spans multiple genres including rock, pop, jazz, and acoustic sets, ensuring we can adapt to any event atmosphere. We pride ourselves on delivering high-energy performances that keep your guests engaged and dancing all night long.', '/placeholder.svg?height=400&width=600'),
('contact', 'Get In Touch', 'Ready to book us for your next event? We''d love to hear from you and discuss how we can make your event unforgettable.', null);

-- Insert sample gallery items
INSERT INTO public.gallery (title, description, media_url, media_type, is_featured) VALUES
('Live at Summer Festival 2024', 'Performing our hit songs at the annual summer music festival', '/placeholder.svg?height=400&width=600', 'image', true),
('Studio Recording Session', 'Behind the scenes during our latest album recording', '/placeholder.svg?height=400&width=600', 'image', false),
('Wedding Performance', 'Creating magical moments at a beautiful wedding ceremony', '/placeholder.svg?height=400&width=600', 'image', true),
('Corporate Event Gig', 'Entertaining guests at a high-profile corporate event', '/placeholder.svg?height=400&width=600', 'image', false),
('Acoustic Set', 'Intimate acoustic performance for a private gathering', '/placeholder.svg?height=400&width=600', 'image', false);

-- Insert sample upcoming events
INSERT INTO public.events (title, description, event_date, event_time, venue, venue_address, ticket_url, is_public) VALUES
('New Year''s Eve Celebration', 'Ring in the new year with Ultra Band Music! Join us for an unforgettable night of music and celebration.', '2024-12-31', '21:00:00', 'The Grand Ballroom', '123 Main Street, Downtown', 'https://tickets.example.com/nye2024', true),
('Valentine''s Day Special', 'A romantic evening of love songs and smooth melodies perfect for couples.', '2025-02-14', '19:30:00', 'Moonlight Lounge', '456 Romance Ave, City Center', 'https://tickets.example.com/valentine2025', true),
('Spring Music Festival', 'Headlining the annual spring music festival with special guest appearances.', '2025-04-15', '18:00:00', 'Central Park Amphitheater', '789 Park Drive, Green District', 'https://tickets.example.com/spring2025', true);

-- Insert sample booking (for demonstration)
INSERT INTO public.bookings (client_name, client_email, client_phone, event_type, event_date, event_time, event_location, event_description, budget_range, status) VALUES
('Sarah Johnson', 'sarah.johnson@email.com', '+1-555-0123', 'Wedding Reception', '2025-06-15', '18:00:00', 'Riverside Country Club', 'Wedding reception for 150 guests, looking for a mix of romantic ballads and dance music', '$3000-$5000', 'pending');
