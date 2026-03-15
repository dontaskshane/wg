import Link from "next/link";

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background Effects Removed */}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-semibold border-r border-border pr-3">Live</span>
              <span className="text-sm text-text-muted">Über 1.000+ aktive Inserate</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Finde dein{" "}
              <span className="gradient-text">perfektes</span>
              <br />
              Zuhause
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Die modernste Plattform für WG-Zimmer und Wohnungen.
              Entdecke, bewirb dich, oder biete dein Zimmer an – alles an einem Ort.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Link href="/listings" className="btn-primary text-lg px-8 py-4 rounded-2xl">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Inserate durchsuchen
              </Link>
              <Link href="/register" className="btn-secondary text-lg px-8 py-4 rounded-2xl">
                Kostenlos registrieren
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            {[
              { value: "1.200+", label: "Aktive Inserate" },
              { value: "5.000+", label: "Registrierte Nutzer" },
              { value: "98%", label: "Zufriedenheit" },
              { value: "24h", label: "Ø Antwortzeit" },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-4 text-center card-hover">
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-text-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              So funktioniert <span className="gradient-text">WGfinder</span>
            </h2>
            <p className="text-text-muted max-w-xl mx-auto">
              In wenigen Schritten zum neuen Zuhause oder zum perfekten Mitbewohner.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
                title: "Suchen & Entdecken",
                description: "Durchsuche hunderte Inserate mit smarten Filtern nach Preis, Ort und Zimmer-Typ.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: "Bewerben",
                description: "Schreibe eine persönliche Nachricht und bewirb dich direkt auf die Wohnung deiner Wahl.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                ),
                title: "Einziehen",
                description: "Werde akzeptiert, lerne deine neuen Mitbewohner kennen und zieh ein!",
              },
            ].map((feature) => (
              <div key={feature.title} className="glass rounded-2xl p-8 card-hover group">
                <div className="w-14 h-14 rounded-2xl bg-surface-lighter flex items-center justify-center text-primary border border-border mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass rounded-3xl p-12 relative overflow-hidden">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Bereit loszulegen?
            </h2>
            <p className="text-text-muted mb-8 max-w-lg mx-auto">
              Erstelle jetzt kostenlos dein Konto und finde dein Traumzimmer oder den perfekten Mitbewohner.
            </p>
            <Link href="/register" className="btn-primary text-lg px-8 py-4 rounded-2xl">
              Jetzt kostenlos starten
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
