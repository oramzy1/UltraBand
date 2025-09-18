-- Create admin_credentials table for storing admin login information
CREATE TABLE IF NOT EXISTS admin_credentials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  recovery_email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin credentials (password: admin123)
INSERT INTO admin_credentials (username, password_hash, recovery_email) 
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'giftoramabo@gmail.com')
ON CONFLICT (username) DO NOTHING;

-- Enable RLS
ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Admin can manage credentials" ON admin_credentials
  FOR ALL USING (true);
