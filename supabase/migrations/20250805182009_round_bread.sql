/*
  # Add profile photo support

  1. Changes
    - Add `profile_photo_url` column to profiles table
    - Column is optional (nullable) for storing profile photo URLs

  2. Security
    - Existing RLS policies will cover the new column
    - Users can update their own profile photo through existing update policy
*/

-- Add profile photo URL column to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'profile_photo_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN profile_photo_url text;
  END IF;
END $$;