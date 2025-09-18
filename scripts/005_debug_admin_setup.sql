-- Debug script to check and fix admin credentials
-- First, check if the table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'admin_credentials'
);

-- Check current admin credentials
SELECT * FROM admin_credentials WHERE username = 'admin';

-- If no admin exists, insert one
INSERT INTO admin_credentials (
  id,
  username,
  password_hash,
  recovery_email,
  created_at,
  updated_at
) 
SELECT 
  gen_random_uuid(),
  'admin',
  'admin123',
  'admin@ultraband.com',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM admin_credentials WHERE username = 'admin'
);

-- Verify the insertion
SELECT username, password_hash, recovery_email FROM admin_credentials WHERE username = 'admin';
