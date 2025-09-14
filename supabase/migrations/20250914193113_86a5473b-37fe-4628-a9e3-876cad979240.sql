-- Fix RLS policy for existing "Silent voice box" table by adding basic policies
CREATE POLICY "Allow all operations on Silent voice box" 
ON public."Silent voice box" 
FOR ALL 
USING (true) 
WITH CHECK (true);