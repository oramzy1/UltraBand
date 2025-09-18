-- Fix admin credentials table and insert default admin
DELETE FROM admin_credentials WHERE username = 'admin';

INSERT INTO admin_credentials (
  id,
  username,
  password_hash,
  recovery_email,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin',
  'admin123',
  'giftoramabo@gmail.com',
  NOW(),
  NOW()
);
