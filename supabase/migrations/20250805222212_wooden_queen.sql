/*
  # Add template field to user_resumes table

  1. Changes
    - Add `template` column to user_resumes table to store selected template
    - Default to 'default' template for existing resumes

  2. Security
    - Existing RLS policies will cover the new column
    - Users can update their own resume template through existing update policy
*/

-- Add template column to user_resumes table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_resumes' AND column_name = 'template'
  ) THEN
    ALTER TABLE user_resumes ADD COLUMN template text DEFAULT 'default' NOT NULL;
  END IF;
END $$;

-- Add constraint to ensure only valid templates are used
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'user_resumes_template_check'
  ) THEN
    ALTER TABLE user_resumes ADD CONSTRAINT user_resumes_template_check 
    CHECK (template IN ('default', 'modern', 'minimal', 'creative'));
  END IF;
END $$;

-- Create index for better performance when filtering by template
CREATE INDEX IF NOT EXISTS idx_user_resumes_template ON user_resumes(template);