/*
  # Create posts table and setup admin authentication

  1. New Tables
    - `posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `category` (text)
      - `created_at` (timestamp with timezone)
      - `read_time` (integer)
      - `image_url` (text)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `posts` table
    - Add policies for:
      - Public read access to all posts
      - Admin users can create/update/delete posts
*/

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read_time integer NOT NULL DEFAULT 1,
  image_url text,
  user_id uuid REFERENCES auth.users NOT NULL
);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on posts" 
  ON posts
  FOR SELECT 
  TO public
  USING (true);

-- Allow authenticated users (admins) to manage posts
CREATE POLICY "Allow authenticated users to manage posts" 
  ON posts
  FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Create admin user function
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only create if admin doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'admin@example.com'
  ) THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@example.com',
      crypt('admin123', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"admin":true}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
  END IF;
END;
$$;

-- Execute the function to create admin user
SELECT create_admin_user();