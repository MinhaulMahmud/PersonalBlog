/*
  # Add blog metrics tracking

  1. Changes to Existing Tables
    - Add new columns to `posts` table:
      - `view_count` (integer) - tracks total views
      - `read_count` (integer) - tracks completed reads
      - `last_viewed_at` (timestamp) - tracks last view timestamp

  2. Security
    - Update RLS policies to allow incrementing metrics
*/

-- Add new columns to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS read_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_viewed_at timestamptz;

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE posts 
  SET 
    view_count = view_count + 1,
    last_viewed_at = NOW()
  WHERE id = post_id;
END;
$$;

-- Function to increment read count
CREATE OR REPLACE FUNCTION increment_read_count(post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE posts 
  SET read_count = read_count + 1
  WHERE id = post_id;
END;
$$;

-- Allow public to execute these functions
GRANT EXECUTE ON FUNCTION increment_view_count TO public;
GRANT EXECUTE ON FUNCTION increment_read_count TO public;