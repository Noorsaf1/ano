# Fotograf Portfolio Webbplats

En ren, elegant webbplats för en professionell fotograf med minimalistisk estetik. Designen fokuserar på att visa upp fotografier genom generösa vita ytor och dämpade designelement.

## Funktioner

- Responsiv design för alla enheter
- Hero-sektion med fullskärmsbild
- Om mig-sektion med fotografens biografi
- Portfolio-galleri med kategorifiltring
- Tjänster-sektion med prisinformation
- Omdömen-slider
- Kontaktformulär och information
- Moderna animationer med Framer Motion
- Admin-panel för att hantera allt innehåll
- Supabase integration för filuppladdning och lagring

## Teknologier som används

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion för animationer
- React Icons
- React Masonry CSS för portfolio-layout
- Supabase för fillagring

## Färgpalett

- **Primär**: Vit (#FFFFFF)
- **Sekundär**: Mjuk beige (#F5F2EA)
- **Accent**: Ljus beige (#E8E0D0)
- **Text**: Mörkgrå (#333333)
- **Subtila element**: Ljusgrå (#EEEEEE)

## Typografi

- **Rubriker**: Playfair Display (serif)
- **Brödtext**: Montserrat (sans-serif)

## Kom igång

1. Klona repositoryt
2. Installera beroenden:
   ```
   npm install
   ```
3. Konfigurera Supabase:
   - Skapa ett konto på [Supabase](https://supabase.com)
   - Skapa ett nytt projekt
   - Gå till "Storage" och skapa följande buckets:
     - `portfolio`
     - `hero`
     - `about`
     - `services`
   - Sätt behörigheter för varje bucket till "Public" eller justera enligt dina behov
   - Kopiera `.env.local.example` till `.env.local`
   - Uppdatera värden i `.env.local` med dina Supabase-projektuppgifter (URL och anon key)
   
4. Starta utvecklingsservern:
   ```
   npm run dev
   ```
5. Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare
6. Åtkomst till admin-panelen:
   - Gå till [http://localhost:3000/admin](http://localhost:3000/admin)
   - Användarnamn: `admin`
   - Lösenord: `fotopassword`

## Bygg för produktion

```
npm run build
npm run start
```

## Anpassning

- Uppdatera bilderna i de olika sektionerna
- Ändra innehållet i varje sektionskomponent
- Justera färgpaletten i tailwind.config.js-filen
- Ändra typografin genom att uppdatera fontimporterna i globals.css
- Ändra admin-uppgifterna i `app/admin/page.tsx`

## Licens

MIT 

## Konfigurera EmailJS för kontaktformulär

För att kontaktformuläret ska fungera behöver du konfigurera EmailJS:

1. Skapa ett konto på [EmailJS](https://www.emailjs.com/)
2. Skapa en ny Email Service (Gmail, Outlook etc.)
3. Skapa en Email Template med följande parametrar:
   - `name`: Avsändarens namn
   - `email`: Avsändarens e-post
   - `subject`: Ämnesrad
   - `message`: Meddelandeinnehåll

4. Uppdatera konstanter i `app/sections/Contact.tsx`:

```jsx
const EMAILJS_SERVICE_ID = 'ditt_service_id'
const EMAILJS_TEMPLATE_ID = 'din_template_id'
const EMAILJS_PUBLIC_KEY = 'din_public_key'
```

## Supabase-konfiguration

1. Skapa ett Supabase-konto och projekt
2. Konfigurera Storage Buckets enligt anvisningar i `SUPABASE_SETUP.md`
3. Uppdatera Supabase-konfigurationen i `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=din_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=din_supabase_anon_key
```

## Admin-åtkomst

Admin-sidan är skyddad med lösenord:

1. Gå till `/admin`
2. Använd lösenordet: `ano123` (Du kan ändra detta i app/admin/page.tsx) 