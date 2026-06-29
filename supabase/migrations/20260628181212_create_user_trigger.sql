/*
# Create User Profile Trigger

1. New Functions/Triggers
- Creates a trigger function that automatically creates a profile row when a new auth user is created
- Ensures every auth user has a corresponding profile

2. Security
- Function runs with security definer to have necessary privileges
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    '@' || LOWER(REGEXP_REPLACE(COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), '[^a-zA-Z0-9]', '', 'g')),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
