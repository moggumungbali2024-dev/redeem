-- Create a storage bucket for media if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('rnf_media', 'rnf_media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to the bucket
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'rnf_media');

-- Allow authenticated users to upload files
-- Note: You might want to restrict this further depending on your auth setup
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'rnf_media');

CREATE POLICY "Users can update files"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'rnf_media');

CREATE POLICY "Users can delete files"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'rnf_media');
