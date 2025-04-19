import { createClient } from '@supabase/supabase-js';

// Fallback values in case environment variables are not set
// These values should ideally come from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nmdhbffhnviiubhocheb.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZGhiZmZobnZpaXViaG9jaGViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNTU3MTksImV4cCI6MjA2MDYzMTcxOX0.xe9tVQEGau2iSarzFsGzMW5WSJ46yRu5sZk-AHCVQw0';

// Validate credentials
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials are missing. Check .env.local file or hardcoded fallbacks.');
}

console.log(`Using Supabase URL: ${supabaseUrl}`);

/**
 * Behörighetspolicies för uppladdning och visning av bilder (uppdaterade mer permissiva versioner):
 * 
 * CREATE POLICY "Allow public read access" 
 * ON storage.objects 
 * FOR SELECT TO public 
 * USING (
 *   bucket_id = 'ano'
 * );
 * 
 * CREATE POLICY "Allow anonymous uploads" 
 * ON storage.objects 
 * FOR INSERT TO public 
 * WITH CHECK (
 *   bucket_id = 'ano'
 * );
 * 
 * CREATE POLICY "Allow anonymous delete" 
 * ON storage.objects 
 * FOR DELETE TO public 
 * USING (
 *   bucket_id = 'ano'
 * );
 * 
 * Alternativt kan du stänga av RLS helt för bucket:
 * Supabase > Storage > Buckets > ano > Settings > RLS = OFF
 * 
 * Se SUPABASE_SETUP.md för komplett dokumentation.
 */

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,  // We don't need auth persistence for admin uploads
  },
  global: {
    headers: {
      'X-Client-Info': 'photographer-portfolio-admin',
    },
  },
});

// Test if we can connect to storage, and create missing buckets
async function initializeStorage() {
  try {
    console.log('Testing Supabase storage connection...');
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error connecting to Supabase storage:', error.message);
      return;
    }
    
    console.log('Successfully connected to Supabase storage');
    
    if (!buckets || buckets.length === 0) {
      console.warn('No storage buckets found. Creating required buckets...');
      
      // Create required buckets with public access
      const requiredBuckets = ['ano', 'hero', 'about', 'portfolio', 'services', 'testimonials'];
      
      for (const bucket of requiredBuckets) {
        try {
          const { data, error: createError } = await supabase.storage.createBucket(bucket, {
            public: true // Allow public access to files (important for image display)
          });
          
          if (createError) {
            console.error(`Failed to create bucket '${bucket}':`, createError.message);
          } else {
            console.log(`Created bucket: ${bucket}`);
          }
        } catch (err) {
          console.error(`Error creating bucket '${bucket}':`, err);
        }
      }
    } else {
      console.log('Available buckets:', buckets.map((bucket) => bucket.name).join(', '));
      
      // Check if required buckets exist, create them if missing
      const requiredBuckets = ['ano', 'hero', 'about', 'portfolio', 'services', 'testimonials'];
      const existingBuckets = buckets.map(b => b.name);
      
      for (const bucket of requiredBuckets) {
        if (!existingBuckets.includes(bucket)) {
          console.log(`Required bucket '${bucket}' missing. Creating...`);
          try {
            const { data, error: createError } = await supabase.storage.createBucket(bucket, {
              public: true
            });
            
            if (createError) {
              console.error(`Failed to create bucket '${bucket}':`, createError.message);
            } else {
              console.log(`Created bucket: ${bucket}`);
            }
          } catch (err) {
            console.error(`Error creating bucket '${bucket}':`, err);
          }
        }
      }
    }
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
  }
}

// Initialize storage on startup
if (typeof window !== 'undefined') {
  // Only run on client side
  initializeStorage().catch(err => {
    console.error('Error during storage initialization:', err);
  });
}

export default supabase; 