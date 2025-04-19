// Test script för Supabase-anslutning
const { createClient } = require('@supabase/supabase-js');

// Anslutningsinformation
const supabaseUrl = 'https://nmdhbffhnviiubhocheb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZGhiZmZobnZpaXViaG9jaGViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNTU3MTksImV4cCI6MjA2MDYzMTcxOX0.xe9tVQEGau2iSarzFsGzMW5WSJ46yRu5sZk-AHCVQw0';

console.log('Försöker ansluta till Supabase...');
console.log(`URL: ${supabaseUrl}`);

// Skapa klient
const supabase = createClient(supabaseUrl, supabaseKey);

// Testa att lista buckets
console.log('Testar listBuckets...');
supabase.storage.listBuckets()
  .then(response => {
    console.log('Svar från listBuckets:');
    if (response.error) {
      console.error('Fel:', response.error);
    } else {
      console.log('Data:', response.data);
      if (response.data && response.data.length > 0) {
        console.log('Tillgängliga buckets:', response.data.map(bucket => bucket.name).join(', '));
      } else {
        console.warn('Inga buckets hittade. Du behöver skapa buckets i Supabase-dashboarden.');
      }
    }
  })
  .catch(error => {
    console.error('Oväntat fel:', error);
  }); 