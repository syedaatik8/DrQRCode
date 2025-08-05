/*
  # Create Resume Tables

  1. New Tables
    - `user_resumes` - Main resume data for each user
    - `resume_education` - Education entries for resumes
    - `resume_experience` - Work experience entries
    - `resume_certifications` - Certification entries
    - `resume_skills` - Skills entries

  2. Security
    - Enable RLS on all tables
    - Users can only access their own resume data
    - Public access for viewing resumes via QR code

  3. Functions
    - Function to generate unique QR code IDs
    - Function to get or create user resume
*/

-- Create main user resumes table
CREATE TABLE IF NOT EXISTS user_resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  qr_code_id text UNIQUE NOT NULL,
  
  -- Basic Info
  full_name text DEFAULT '',
  designation text DEFAULT '',
  email text DEFAULT '',
  phone text DEFAULT '',
  location text DEFAULT '',
  profile_photo_url text,
  summary text DEFAULT '',
  
  -- Social Links
  linkedin_url text DEFAULT '',
  github_url text DEFAULT '',
  portfolio_url text DEFAULT '',
  
  -- Metadata
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  
  -- Ensure one resume per user
  UNIQUE(user_id)
);

-- Create education table
CREATE TABLE IF NOT EXISTS resume_education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES user_resumes(id) ON DELETE CASCADE NOT NULL,
  
  institution text NOT NULL,
  degree text NOT NULL,
  field_of_study text DEFAULT '',
  start_date date,
  end_date date,
  is_current boolean DEFAULT false,
  grade_gpa text DEFAULT '',
  description text DEFAULT '',
  
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create work experience table
CREATE TABLE IF NOT EXISTS resume_experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES user_resumes(id) ON DELETE CASCADE NOT NULL,
  
  company text NOT NULL,
  position text NOT NULL,
  location text DEFAULT '',
  start_date date,
  end_date date,
  is_current boolean DEFAULT false,
  description text DEFAULT '',
  
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create certifications table
CREATE TABLE IF NOT EXISTS resume_certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES user_resumes(id) ON DELETE CASCADE NOT NULL,
  
  name text NOT NULL,
  issuing_organization text NOT NULL,
  issue_date date,
  expiry_date date,
  credential_id text DEFAULT '',
  credential_url text DEFAULT '',
  
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create skills table
CREATE TABLE IF NOT EXISTS resume_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES user_resumes(id) ON DELETE CASCADE NOT NULL,
  
  name text NOT NULL,
  category text DEFAULT 'technical',
  proficiency_level text DEFAULT 'intermediate',
  
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_resumes_user_id ON user_resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_resumes_qr_code_id ON user_resumes(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_resume_education_resume_id ON resume_education(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_experience_resume_id ON resume_experience(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_certifications_resume_id ON resume_certifications(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_skills_resume_id ON resume_skills(resume_id);

-- Enable Row Level Security on all tables
ALTER TABLE user_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_skills ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own resume" ON user_resumes;
DROP POLICY IF EXISTS "Users can insert own resume" ON user_resumes;
DROP POLICY IF EXISTS "Users can update own resume" ON user_resumes;
DROP POLICY IF EXISTS "Users can delete own resume" ON user_resumes;
DROP POLICY IF EXISTS "Public can view active resumes by QR code" ON user_resumes;

-- RLS Policies for user_resumes
CREATE POLICY "Users can read own resume"
  ON user_resumes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resume"
  ON user_resumes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resume"
  ON user_resumes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own resume"
  ON user_resumes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view active resumes by QR code"
  ON user_resumes
  FOR SELECT
  TO public
  USING (is_active = true);

-- Drop existing policies for education
DROP POLICY IF EXISTS "Users can manage own resume education" ON resume_education;
DROP POLICY IF EXISTS "Public can view education for active resumes" ON resume_education;

-- RLS Policies for resume_education
CREATE POLICY "Users can manage own resume education"
  ON resume_education
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_resumes 
      WHERE id = resume_education.resume_id 
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_resumes 
      WHERE id = resume_education.resume_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view education for active resumes"
  ON resume_education
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM user_resumes 
      WHERE id = resume_education.resume_id 
      AND is_active = true
    )
  );

-- Drop existing policies for experience
DROP POLICY IF EXISTS "Users can manage own resume experience" ON resume_experience;
DROP POLICY IF EXISTS "Public can view experience for active resumes" ON resume_experience;

-- RLS Policies for resume_experience
CREATE POLICY "Users can manage own resume experience"
  ON resume_experience
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_resumes 
      WHERE id = resume_experience.resume_id 
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_resumes 
      WHERE id = resume_experience.resume_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view experience for active resumes"
  ON resume_experience
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM user_resumes 
      WHERE id = resume_experience.resume_id 
      AND is_active = true
    )
  );

-- Drop existing policies for certifications
DROP POLICY IF EXISTS "Users can manage own resume certifications" ON resume_certifications;
DROP POLICY IF EXISTS "Public can view certifications for active resumes" ON resume_certifications;

-- RLS Policies for resume_certifications
CREATE POLICY "Users can manage own resume certifications"
  ON resume_certifications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_resumes 
      WHERE id = resume_certifications.resume_id 
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_resumes 
      WHERE id = resume_certifications.resume_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view certifications for active resumes"
  ON resume_certifications
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM user_resumes 
      WHERE id = resume_certifications.resume_id 
      AND is_active = true
    )
  );

-- Drop existing policies for skills
DROP POLICY IF EXISTS "Users can manage own resume skills" ON resume_skills;
DROP POLICY IF EXISTS "Public can view skills for active resumes" ON resume_skills;

-- RLS Policies for resume_skills
CREATE POLICY "Users can manage own resume skills"
  ON resume_skills
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_resumes 
      WHERE id = resume_skills.resume_id 
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_resumes 
      WHERE id = resume_skills.resume_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view skills for active resumes"
  ON resume_skills
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM user_resumes 
      WHERE id = resume_skills.resume_id 
      AND is_active = true
    )
  );

-- Function to update updated_at timestamp for all resume tables
CREATE OR REPLACE FUNCTION update_resume_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_user_resumes_updated_at ON user_resumes;
DROP TRIGGER IF EXISTS update_resume_education_updated_at ON resume_education;
DROP TRIGGER IF EXISTS update_resume_experience_updated_at ON resume_experience;
DROP TRIGGER IF EXISTS update_resume_certifications_updated_at ON resume_certifications;
DROP TRIGGER IF EXISTS update_resume_skills_updated_at ON resume_skills;

-- Create triggers for updated_at
CREATE TRIGGER update_user_resumes_updated_at
  BEFORE UPDATE ON user_resumes
  FOR EACH ROW
  EXECUTE FUNCTION update_resume_updated_at();

CREATE TRIGGER update_resume_education_updated_at
  BEFORE UPDATE ON resume_education
  FOR EACH ROW
  EXECUTE FUNCTION update_resume_updated_at();

CREATE TRIGGER update_resume_experience_updated_at
  BEFORE UPDATE ON resume_experience
  FOR EACH ROW
  EXECUTE FUNCTION update_resume_updated_at();

CREATE TRIGGER update_resume_certifications_updated_at
  BEFORE UPDATE ON resume_certifications
  FOR EACH ROW
  EXECUTE FUNCTION update_resume_updated_at();

CREATE TRIGGER update_resume_skills_updated_at
  BEFORE UPDATE ON resume_skills
  FOR EACH ROW
  EXECUTE FUNCTION update_resume_updated_at();

-- Function to generate unique QR code ID
CREATE OR REPLACE FUNCTION public.generate_qr_code_id()
RETURNS text AS $$
DECLARE
  chars text := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i integer := 0;
BEGIN
  FOR i IN 1..12 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ language plpgsql;

-- Function to create or get user resume
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
      qr_id := public.generate_qr_code_id();
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

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON user_resumes TO authenticated;
GRANT ALL ON resume_education TO authenticated;
GRANT ALL ON resume_experience TO authenticated;
GRANT ALL ON resume_certifications TO authenticated;
GRANT ALL ON resume_skills TO authenticated;
GRANT SELECT ON user_resumes TO anon;
GRANT SELECT ON resume_education TO anon;
GRANT SELECT ON resume_experience TO anon;
GRANT SELECT ON resume_certifications TO anon;
GRANT SELECT ON resume_skills TO anon;
GRANT EXECUTE ON FUNCTION public.get_or_create_user_resume(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_qr_code_id() TO authenticated;

-- Add comments for PostgREST
COMMENT ON FUNCTION public.get_or_create_user_resume(uuid) IS 'Get or create a resume for the authenticated user';
COMMENT ON FUNCTION public.generate_qr_code_id() IS 'Generate a unique QR code identifier';