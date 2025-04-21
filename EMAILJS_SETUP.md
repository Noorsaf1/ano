# EmailJS-konfiguration för ANO Fotografi

För att kontaktformuläret ska visa rätt avsändare (kunden istället för "me"), följ dessa steg:

## 1. Skapa ett konto på EmailJS

1. Gå till [EmailJS](https://www.emailjs.com/) och skapa ett konto
2. Bekräfta din e-post

## 2. Konfigurera Email Service

1. Klicka på "Email Services" i sidomenyn
2. Klicka på "Add New Service"
3. Välj din e-postleverantör (Gmail, Outlook, etc.)
4. Följ anvisningarna för att ansluta till din e-post

## 3. Skapa Email Template

1. Klicka på "Email Templates" i sidomenyn
2. Klicka på "Create New Template"
3. Ange ett namn för mallen, t.ex. "Kontaktformulär"
4. Kopiera HTML-koden från `email-template.html` i detta projekt och klistra in i mallredigeraren
5. Klicka på "Save" för att spara mallen

## 4. Konfigurera avsändarinställningar för att visa kundens namn

### Viktigt: E-postinställningar i mallen

För att e-postmeddelanden ska visa kundens namn som avsändare, behöver du konfigurera följande:

1. Öppna din mall i EmailJS
2. Klicka på "Settings"-tabben (längst upp) för din mall
3. Under "Content"-sektionen:
   - Ställ in "From name": `{{from_name}}`
   - Ställ in "Reply To": `{{reply_to}}`
4. Spara ändringarna

Detta säkerställer att:
- Meddelandet visar kundens namn som avsändare, inte "me"
- När du svarar på e-posten går svaret direkt till kunden

## 5. Uppdatera konfigurationen i Contact.tsx

1. Ersätt konstanterna i `app/sections/Contact.tsx` med dina egna uppgifter:
```javascript
const EMAILJS_SERVICE_ID = 'ditt_service_id'  // Hittas under "Email Services"
const EMAILJS_TEMPLATE_ID = 'din_template_id' // Hittas under "Email Templates"
const EMAILJS_PUBLIC_KEY = 'din_public_key'   // Hittas under "Account" > "API Keys"
```

## Felsökning

Om kundens namn fortfarande inte visas som avsändare:

1. Kontrollera att du använder `emailjs.send()` och inte `emailjs.sendForm()`
2. Verifiera att du skickar `from_name` och `reply_to` parametrarna
3. Kontrollera att mallens inställningar har rätt "From name" och "Reply To" konfiguration 