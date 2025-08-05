@@ .. @@
 GRANT SELECT ON resume_experience TO anon;
 GRANT SELECT ON resume_certifications TO anon;
 GRANT SELECT ON resume_skills TO anon;
-GRANT EXECUTE ON FUNCTION get_or_create_user_resume TO authenticated;
+GRANT EXECUTE ON FUNCTION public.get_or_create_user_resume TO authenticated;