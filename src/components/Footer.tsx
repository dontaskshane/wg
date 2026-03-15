import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                W
              </div>
              <span className="text-xl font-bold gradient-text">WGfinder</span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed">
              Die modernste Plattform für WG-Zimmer und Wohnungen. Finde dein neues Zuhause oder den perfekten Mitbewohner.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">Navigation</h3>
            <div className="flex flex-col gap-2">
              <Link href="/listings" className="text-text-muted hover:text-primary transition-colors text-sm">Inserate durchsuchen</Link>
              <Link href="/listings/new" className="text-text-muted hover:text-primary transition-colors text-sm">Inserat erstellen</Link>
              <Link href="/dashboard" className="text-text-muted hover:text-primary transition-colors text-sm">Mein Dashboard</Link>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">Kontakt</h3>
            <div className="flex flex-col gap-2 text-sm text-text-muted">
              <p>support@wgfinder.de</p>
              <p>Made with ❤️ in Deutschland</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center text-text-muted text-xs">
          © 2026 WGfinder. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}
