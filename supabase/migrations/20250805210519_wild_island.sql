/*
  # Fix get_or_create_user_resume function

  1. Changes
    - Recreate the get_or_create_user_resume function to ensure it's properly registered
    - Add proper grants and permissions
    - Ensure function is accessible via PostgREST

  2. Security
    - Function runs with security definer to bypass RLS during creation
    - Proper authentication checks within function
*/

-- Recreate the function to ensure it's properly registered
CREATE OR REPLACE FUNCTION public.get_or_create_user_resume(p_user_id uuid)
RETURNS uuid AS $$
DECLARE
  resume_id uuid;
  qr_id text;
BEGIN
  -- Verify the user is authenticated and requesting their own resume
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: Cannot access another user''s resume';
  END IF;

  -- Try to get existing resume
  SELECT id INTO resume_id
  FROM user_resumes
  WHERE user_id = p_user_id;
  
  -- If no resume exists, create one
  IF resume_id IS NULL THEN
    -- Generate unique QR code ID
    LOOP
      qr_id := generate_qr_code_id();
      EXIT WHEN NOT EXISTS (SELECT 1 FROM user_resumes WHERE qr_code_id = qr_id);
    END LOOP;
    
    -- Create new resume
    INSERT INTO user_resumes (user_id, qr_code_id)
    VALUES (p_user_id, qr_id)
    RETURNING id INTO resume_id;
  END IF;
  
  RETURN resume_id;
END;
$$ language plpgsql security definer;

-- Ensure the generate_qr_code_id function exists
CREATE OR REPLACE FUNCTION public.generate_qr_code_id()
RETURNS text AS $$
DECLARE
  chars text := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i integer := 0;
BEGIN
  -- Generate 12 character random string
  FOR i IN 1..12 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ language plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_or_create_user_resume(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_qr_code_id() TO authenticated;

-- Ensure the function is accessible via PostgREST
COMMENT ON FUNCTION public.get_or_create_user_resume(uuid) IS 'Get or create a resume for the authenticated user';