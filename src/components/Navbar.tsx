"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="glass-strong fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg transition-transform group-hover:scale-110">
              W
            </div>
            <span className="text-xl font-bold gradient-text">WGfinder</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/listings"
              className="px-4 py-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-lighter transition-all duration-200"
            >
              Inserate
            </Link>
            {session ? (
              <>
                <Link
                  href="/listings/new"
                  className="px-4 py-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-lighter transition-all duration-200"
                >
                  Inserat erstellen
                </Link>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-lighter transition-all duration-200"
                >
                  Dashboard
                </Link>
                <div className="ml-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-semibold">
                    {session.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="btn-secondary text-sm py-2 px-4"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link href="/login" className="btn-secondary text-sm py-2 px-4">
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-4">
                  Registrieren
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-surface-lighter transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              <Link
                href="/listings"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-lg text-text-muted hover:text-text hover:bg-surface-lighter transition-all"
              >
                Inserate
              </Link>
              {session ? (
                <>
                  <Link
                    href="/listings/new"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-lg text-text-muted hover:text-text hover:bg-surface-lighter transition-all"
                  >
                    Inserat erstellen
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-lg text-text-muted hover:text-text hover:bg-surface-lighter transition-all"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="mt-2 btn-secondary text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-secondary text-sm text-center">
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-sm text-center">
                    Registrieren
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
