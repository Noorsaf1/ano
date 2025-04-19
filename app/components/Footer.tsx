import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-8 bg-text text-primary">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-serif text-xl mb-4">Elena Petrova</h3>
            <p className="mb-4 opacity-80">
              Professionell fotograf specialiserad på porträtt, bröllop och evenemang.
            </p>
          </div>
          
          <div>
            <h3 className="font-serif text-xl mb-4">Utforska</h3>
            <ul className="space-y-2 opacity-80">
              <li>
                <Link href="/" className="hover:opacity-100 transition-opacity">
                  Hem
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:opacity-100 transition-opacity">
                  Om mig
                </Link>
              </li>
              <li>
                <Link href="#portfolio" className="hover:opacity-100 transition-opacity">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:opacity-100 transition-opacity">
                  Tjänster
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:opacity-100 transition-opacity">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-xl mb-4">Nyhetsbrev</h3>
            <p className="mb-4 opacity-80">
              Prenumerera för att få uppdateringar om nya projekt och specialerbjudanden.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Din e-postadress" 
                className="p-2 flex-grow text-text outline-none"
              />
              <button className="bg-accent py-2 px-4 text-text font-medium">
                Prenumerera
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-primary/20 text-center opacity-80 text-sm">
          <p>&copy; {currentYear} Elena Petrova Fotografi. Alla rättigheter förbehållna.</p>
        </div>
      </div>
    </footer>
  )
} 