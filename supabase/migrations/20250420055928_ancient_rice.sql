/*
  # Create storage bucket for blog images

  1. Storage Setup
    - Create bucket for blog images
    - Set up public access policies
*/

-- Create the storage bucket
BEGIN;

-- Create bucket if it doesn't exist
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
        'blog-assets',
        'blog-assets',
        true,
        52428800, -- 50MB limit
        ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    )
    ON CONFLICT (id) DO NOTHING;
END $$;

-- Set up storage policies
DO $$
BEGIN
    -- Allow authenticated users to upload files
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Allow authenticated users to upload files'
    ) THEN
        CREATE POLICY "Allow authenticated users to upload files"
        ON storage.objects
        FOR INSERT
        TO authenticated
        WITH CHECK (bucket_id = 'blog-assets');
    END IF;

    -- Allow public to view files
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Allow public to view files'
    ) THEN
        CREATE POLICY "Allow public to view files"
        ON storage.objects
        FOR SELECT
        TO public
        USING (bucket_id = 'blog-assets');
    END IF;

    -- Allow authenticated users to update their files
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Allow authenticated users to update files'
    ) THEN
        CREATE POLICY "Allow authenticated users to update files"
        ON storage.objects
        FOR UPDATE
        TO authenticated
        USING (bucket_id = 'blog-assets')
        WITH CHECK (bucket_id = 'blog-assets');
    END IF;

    -- Allow authenticated users to delete their files
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Allow authenticated users to delete files'
    ) THEN
        CREATE POLICY "Allow authenticated users to delete files"
        ON storage.objects
        FOR DELETE
        TO authenticated
        USING (bucket_id = 'blog-assets');
    END IF;
END $$;

COMMIT;