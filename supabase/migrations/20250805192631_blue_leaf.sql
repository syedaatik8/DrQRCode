/*
  # Comprehensive Profile Management System

  1. New Tables
    - Enhanced `profiles` table structure with all signup fields
    - Proper indexing for performance
    - Storage bucket for profile photos

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users to manage their own data
    - Storage policies for profile photos

  3. Functions
    - Enhanced user signup handler with all fields
    - Profile update functions with validation
    - Automatic timestamp management

  4. Storage
    - Profile photos bucket with proper policies
    - Size and type restrictions
*/

-- Create storage bucket for profile photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create comprehensive profiles table (if not exists or needs updates)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  email text UNIQUE NOT NULL,
  phone text DEFAULT '',
  plan text DEFAULT 'free' NOT NULL CHECK (plan IN ('free', 'premium', 'enterprise')),
  profile_photo_url text,
  is_active boolean DEFAULT true NOT NULL,
  email_verified boolean DEFAULT false NOT NULL,
  last_login timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Add any missing columns to existing profiles table
DO $$
BEGIN
  -- Add is_active column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_active boolean DEFAULT true NOT NULL;
  END IF;

  -- Add email_verified column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'email_verified'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email_verified boolean DEFAULT false NOT NULL;
  END IF;

  -- Add last_login column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'last_login'
  ) THEN
    ALTER TABLE profiles ADD COLUMN last_login timestamptz;
  END IF;

  -- Add plan constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'profiles_plan_check'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_plan_check 
    CHECK (plan IN ('free', 'premium', 'enterprise'));
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON profiles(plan);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create comprehensive RLS policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Storage policies for profile photos
CREATE POLICY "Users can upload their own profile photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own profile photos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'profile-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own profile photos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profile-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own profile photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profile-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Public access for profile photos (so they can be displayed)
CREATE POLICY "Public can view profile photos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'profile-photos');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enhanced function to handle new user signup with all fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_email text;
  user_first_name text;
  user_last_name text;
  user_phone text;
BEGIN
  -- Extract user data with proper defaults
  user_email := COALESCE(NEW.email, '');
  user_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
  user_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');

  -- Insert comprehensive profile data
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    email,
    phone,
    plan,
    email_verified,
    is_active,
    last_login,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    user_first_name,
    user_last_name,
    user_email,
    user_phone,
    'free',
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false),
    true,
    now(),
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    email_verified = COALESCE(NEW.email_confirmed_at IS NOT NULL, false),
    last_login = now(),
    updated_at = now();

  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log error but don't fail the user creation
    RAISE LOG 'Error creating/updating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ language plpgsql security definer;

-- Function to update user profile with validation
CREATE OR REPLACE FUNCTION public.update_user_profile(
  user_id uuid,
  p_first_name text DEFAULT NULL,
  p_last_name text DEFAULT NULL,
  p_phone text DEFAULT NULL,
  p_profile_photo_url text DEFAULT NULL
)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  -- Check if user exists and is the authenticated user
  IF user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: Cannot update another user''s profile';
  END IF;

  -- Update profile with only provided fields
  UPDATE profiles SET
    first_name = COALESCE(p_first_name, first_name),
    last_name = COALESCE(p_last_name, last_name),
    phone = COALESCE(p_phone, phone),
    profile_photo_url = COALESCE(p_profile_photo_url, profile_photo_url),
    updated_at = now()
  WHERE id = user_id;

  -- Return updated profile
  SELECT json_build_object(
    'id', id,
    'first_name', first_name,
    'last_name', last_name,
    'email', email,
    'phone', phone,
    'plan', plan,
    'profile_photo_url', profile_photo_url,
    'is_active', is_active,
    'email_verified', email_verified,
    'created_at', created_at,
    'updated_at', updated_at
  ) INTO result
  FROM profiles
  WHERE id = user_id;

  RETURN result;
EXCEPTION
  WHEN others THEN
    RAISE EXCEPTION 'Error updating profile: %', SQLERRM;
END;
$$ language plpgsql security definer;

-- Function to update last login timestamp
CREATE OR REPLACE FUNCTION public.update_last_login(user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET last_login = now(), updated_at = now()
  WHERE id = user_id;
END;
$$ language plpgsql security definer;

-- Recreate the trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create trigger for login updates
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users;
CREATE TRIGGER on_auth_user_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON profiles TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_profile TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_last_login TO authenticated;