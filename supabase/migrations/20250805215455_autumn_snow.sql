/*
  # Fix Storage RLS Policies for Profile Photos

  1. Problem
    - Current policies expect files in folders like: user_id/filename.png
    - Application uploads files as: user_id-timestamp.png
    - This causes RLS policy violations

  2. Solution
    - Update all storage policies to match the actual naming convention
    - Change from folder-based checks to filename prefix checks
*/

-- Drop existing storage policies
DROP POLICY IF EXISTS "Users can upload their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view profile photos" ON storage.objects;

-- Create corrected storage policies that match the filename pattern
CREATE POLICY "Users can upload their own profile photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile-photos' AND
    name LIKE (auth.uid()::text || '-%')
  );

CREATE POLICY "Users can view their own profile photos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'profile-photos' AND
    name LIKE (auth.uid()::text || '-%')
  );

CREATE POLICY "Users can update their own profile photos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profile-photos' AND
    name LIKE (auth.uid()::text || '-%')
  );

CREATE POLICY "Users can delete their own profile photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profile-photos' AND
    name LIKE (auth.uid()::text || '-%')
  );

-- Public access for profile photos (so they can be displayed)
CREATE POLICY "Public can view profile photos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'profile-photos');