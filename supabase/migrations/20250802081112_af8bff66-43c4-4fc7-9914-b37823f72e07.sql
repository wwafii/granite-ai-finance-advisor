-- Create a function to delete user account
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
BEGIN
  -- Get the current user ID
  user_id := auth.uid();
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;
  
  -- Delete user profile from profiles table
  DELETE FROM public.profiles WHERE id = user_id;
  
  -- Delete the user from auth.users table
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;