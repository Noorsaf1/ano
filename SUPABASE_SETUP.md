# Supabase-konfiguration för fotografportfolio

Detta dokument beskriver nödvändiga inställningar för att konfigurera Supabase som backend för lagring av bilder i fotoportfolio-projektet.

## Storage Buckets

Projektet använder följande buckets:
- `ano` - Huvudbucket för alla bilder 
- `hero` - För huvudbilden på startsidan (alternativ)
- `about` - För profilbilder i Om-sektionen (alternativ)
- `portfolio` - För portfoliobilder (alternativ)
- `services` - För ikoner och bilder för tjänster (alternativ)
- `testimonials` - För avatarbilder för omdömen (alternativ)

## Storage Policies

För att tillåta anonyma användare att ladda upp och visa bilder via admin-gränssnittet, här är uppdaterade policies:

### För visning av bilder (SELECT) - Mer permissiv

```sql
CREATE POLICY "Allow public read access" 
ON storage.objects 
FOR SELECT TO public 
USING (
  bucket_id = 'ano'
);
```

### För uppladdning av bilder (INSERT) - Mer permissiv

```sql
CREATE POLICY "Allow anonymous uploads" 
ON storage.objects 
FOR INSERT TO public 
WITH CHECK (
  bucket_id = 'ano'
);
```

### För borttagning av bilder (DELETE) - Ny policy

```sql
CREATE POLICY "Allow anonymous delete" 
ON storage.objects 
FOR DELETE TO public 
USING (
  bucket_id = 'ano'
);
```

## Implementering

1. Logga in på din Supabase-dashboard
2. Gå till "Storage" > "Policies"
3. Klicka på "New Policy"
4. Välj "Custom Policy" om tillgängligt (eller "Create a policy from scratch")
5. Kopiera och klistra in SQL-policies ovan
6. Spara policyerna

Dessa policies möjliggör för anonyma användare att:
- Visa alla filer i bucket "ano"
- Ladda upp alla filer till bucket "ano"
- Ta bort filer från bucket "ano"

## Alternativ enkel lösning med RLS disabled

Om du inte behöver strikt åtkomstkontroll, kan du helt enkelt inaktivera Row Level Security (RLS) för din bucket:

1. Gå till Supabase > Storage > Buckets
2. Välj din "ano"-bucket
3. Klicka på "Settings"
4. Ändra "RLS" till OFF

Detta ger full offentlig åtkomst till bucket (läsning, skrivning, borttagning) utan att behöva definiera policies.

## Felsökning

Om bildsuppladdningen fortfarande inte fungerar, kontrollera:

1. **Kolla browser-konsolen** (F12) för detaljerade felmeddelanden
2. **Filstorlek**: Supabase har maxstorlek på 50MB per fil
3. **CORS-inställningar**: Se till att din webbplats är tillåten i CORS-inställningarna
4. **Content-Type header**: Vissa filer kanske inte accepteras
5. **Använd mindre och enklare testbilder**: Prova med en mycket liten JPG-fil 