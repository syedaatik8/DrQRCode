/*
  # Fix profile creation and updates

  1. Changes
    - Update the handle_new_user function to properly handle metadata
    - Ensure profile data is created when user signs up
    - Add better error handling for profile creation

  2. Security
    - Existing RLS policies will handle security
    - Function runs with security definer to bypass RLS during creation
*/

-- Update the function to handle new user signup with proper metadata handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, phone, plan)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    COALESCE(new.email, ''),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    'free'
  );
  RETURN new;
EXCEPTION
  WHEN others THEN
    -- Log error but don't fail the user creation
    RAISE LOG 'Error creating profile for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$ language plpgsql security definer;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();