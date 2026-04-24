-- Pega esto en el SQL Editor de tu proyecto en Supabase (https://app.supabase.com)

CREATE TABLE debts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Si deseas activar "Row Level Security" y permitir el acceso público (para la demo)
-- ejecuta las siguientes instrucciones también:
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Access" 
ON debts FOR ALL 
USING (true)
WITH CHECK (true);
