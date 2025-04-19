import supabase from './supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads a file to Supabase storage
 * @param file The file to upload
 * @param bucket The storage bucket to use
 * @returns URL of the uploaded file or null if upload failed
 */
export async function uploadFile(file: File, bucket: string = 'ano'): Promise<string | null> {
  try {
    if (!file) {
      console.error("No file provided to uploadFile function");
      return null;
    }

    // Validera filstorlek (max 50MB för Supabase)
    if (file.size > 50 * 1024 * 1024) {
      console.error("File too large, max size is 50MB");
      return null;
    }

    // Validera filtyp
    if (!file.type.startsWith('image/')) {
      console.error("File is not an image");
      return null;
    }

    // Create a unique file name to prevent collisions
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    
    // Enklare filnamn utan 'public' mapp (eftersom vi har mindre restriktiva policies nu)
    const fileName = `${uuidv4().substring(0, 8)}.${fileExt}`;

    console.log(`Uppladdning: ${file.name} (${file.size} bytes) till bucket: ${bucket}, sökväg: ${fileName}`);
    
    // Försök ladda upp direkt utan att kontrollera bucket
    try {
      // Upload file to Supabase storage with upsert enabled
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true // Kommer skriva över om filen redan finns
        });

      if (error) {
        console.error('Fel vid uppladdning till Supabase:', error.message);
        
        // Om felet är pga bucket som inte existerar, försök skapa bucket
        if (error.message.includes('bucket') || error.message.includes('not found')) {
          console.log('Försöker skapa bucket:', bucket);
          try {
            const { data: newBucket, error: createError } = await supabase.storage.createBucket(bucket, {
              public: true
            });
            
            if (createError) {
              console.error(`Kunde inte skapa bucket '${bucket}':`, createError.message);
              return null;
            }
            
            console.log(`Ny bucket skapad: ${bucket}, försöker ladda upp igen`);
            
            // Försök ladda upp igen efter att ha skapat bucket
            const { data: newData, error: newError } = await supabase.storage
              .from(bucket)
              .upload(fileName, file, {
                cacheControl: '3600',
                upsert: true
              });
              
            if (newError) {
              console.error('Fortfarande fel efter bucket-skapande:', newError.message);
              return null;
            }
            
            if (!newData) {
              console.error('Ingen data returnerad från andra uppladdningsförsöket');
              return null;
            }
            
            // Get public URL for the file efter andra försöket
            const { data: { publicUrl } } = supabase.storage
              .from(bucket)
              .getPublicUrl(fileName);
            
            if (!publicUrl) {
              console.error('Kunde inte få publik URL för uppladdad fil');
              return null;
            }
            
            console.log(`Publik URL genererad efter andra försöket: ${publicUrl}`);
            return publicUrl;
          } catch (createErr) {
            console.error('Oväntat fel vid skapande av bucket:', createErr);
            return null;
          }
        }
        
        return null;
      }

      if (!data) {
        console.error('Ingen data returnerad från Supabase-uppladdning');
        return null;
      }

      console.log('Fil uppladdad till Supabase. Hämtar publik URL...');

      // Get public URL for the file
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);
      
      if (!publicUrl) {
        console.error('Kunde inte få publik URL för uppladdad fil');
        return null;
      }

      console.log(`Publik URL genererad: ${publicUrl}`);
      return publicUrl;
    } catch (uploadError) {
      console.error('Fel vid uppladdning:', uploadError);
      return null;
    }
  } catch (error) {
    console.error('Oväntat fel vid uppladdning till Supabase:', error);
    return null;
  }
}

/**
 * Deletes a file from Supabase storage
 * @param url The public URL of the file to delete
 * @param bucket The storage bucket containing the file
 * @returns true if delete was successful, false otherwise
 */
export async function deleteFile(url: string, bucket: string = 'ano'): Promise<boolean> {
  try {
    if (!url) {
      console.error("Ingen URL angiven för deleteFile-funktionen");
      return false;
    }

    console.log(`Försöker ta bort fil från URL: ${url} i bucket: ${bucket}`);

    // Extract the file path from the public URL
    let filePath;
    try {
      // Enklare sätt att extrahera filnamnet
      const urlParts = url.split('/');
      filePath = urlParts[urlParts.length - 1];
      
      console.log(`Extraherad filsökväg: ${filePath}`);
    } catch (error) {
      console.error('Fel vid parsning av URL:', error);
      return false;
    }

    if (!filePath) {
      console.error('Kunde inte extrahera filsökväg från URL');
      return false;
    }

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Fel vid borttagning av fil från Supabase:', error.message);
      return false;
    }

    console.log('Filen har tagits bort från Supabase');
    return true;
  } catch (error) {
    console.error('Oväntat fel vid borttagning av fil från Supabase:', error);
    return false;
  }
} 