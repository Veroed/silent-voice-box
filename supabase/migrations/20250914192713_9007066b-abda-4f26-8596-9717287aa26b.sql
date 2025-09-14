-- Create groups table for anonymous feedback groups
CREATE TABLE public.groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  admin_key TEXT NOT NULL,
  company_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table for anonymous feedback
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  nickname TEXT,
  ip_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for groups
CREATE POLICY "Groups are viewable by everyone" 
ON public.groups 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create groups" 
ON public.groups 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for messages
CREATE POLICY "Messages are viewable by everyone in the group" 
ON public.messages 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Messages can be deleted by group admins" 
ON public.messages 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_groups_updated_at
BEFORE UPDATE ON public.groups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_groups_code ON public.groups(code);
CREATE INDEX idx_messages_group_id ON public.messages(group_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);