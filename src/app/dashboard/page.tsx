"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Listing {
  id: string; title: string; price: number; location: string;
  roomType: string; active: boolean; createdAt: string;
  _count: { applications: number };
}

interface Application {
  id: string; message: string; status: string; createdAt: string;
  listing: { id: string; title: string; price: number; location: string };
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<"listings" | "applications">("listings");
  const [listings, setListings] = useState<Listing[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [listingsRes, appsRes] = await Promise.all([
          fetch("/api/dashboard/listings"),
          fetch("/api/dashboard/applications"),
        ]);
        if (listingsRes.ok) setListings(await listingsRes.json());
        if (appsRes.ok) setApplications(await appsRes.json());
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [session?.user?.id]);

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Anmeldung erforderlich</h2>
        <p className="text-text-muted mb-6">Melde dich an, um dein Dashboard zu sehen.</p>
        <Link href="/login" className="btn-primary">Anmelden</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-1">
          Hallo, <span className="gradient-text">{session.user.name}</span>
        </h1>
        <p className="text-text-muted">Verwalte deine Inserate und Bewerbungen.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <div className="glass rounded-2xl p-5 text-center">
          <div className="text-2xl font-bold gradient-text">{listings.length}</div>
          <div className="text-xs text-text-muted mt-1">Meine Inserate</div>
        </div>
        <div className="glass rounded-2xl p-5 text-center">
          <div className="text-2xl font-bold gradient-text">{applications.length}</div>
          <div className="text-xs text-text-muted mt-1">Meine Bewerbungen</div>
        </div>
        <div className="glass rounded-2xl p-5 text-center">
          <div className="text-2xl font-bold text-success">{applications.filter(a => a.status === "accepted").length}</div>
          <div className="text-xs text-text-muted mt-1">Akzeptiert</div>
        </div>
        <div className="glass rounded-2xl p-5 text-center">
          <div className="text-2xl font-bold text-accent">{applications.filter(a => a.status === "pending").length}</div>
          <div className="text-xs text-text-muted mt-1">Ausstehend</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
        <button onClick={() => setTab("listings")} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === "listings" ? "btn-primary" : "btn-secondary"}`}>
          Meine Inserate
        </button>
        <button onClick={() => setTab("applications")} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === "applications" ? "btn-primary" : "btn-secondary"}`}>
          Meine Bewerbungen
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-surface-lighter rounded w-1/3 mb-3" />
              <div className="h-3 bg-surface-lighter rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : tab === "listings" ? (
        <div className="space-y-4">
          {listings.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center">
              <p className="text-text-muted mb-4">Du hast noch keine Inserate erstellt.</p>
              <Link href="/listings/new" className="btn-primary">Erstes Inserat erstellen</Link>
            </div>
          ) : (
            listings.map((listing) => (
              <Link key={listing.id} href={`/listings/${listing.id}`} className="glass rounded-2xl p-6 flex items-center justify-between card-hover block">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-text-muted">
                    <span>{listing.location}</span>
                    <span>·</span>
                    <span className="text-accent font-semibold">{listing.price}€/mo</span>
                    <span>·</span>
                    <span>{listing._count.applications} Bewerbung(en)</span>
                  </div>
                </div>
                <div className="badge badge-pending">{listing.roomType}</div>
              </Link>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center">
              <p className="text-text-muted mb-4">Du hast dich noch nirgends beworben.</p>
              <Link href="/listings" className="btn-primary">Inserate durchsuchen</Link>
            </div>
          ) : (
            applications.map((app) => (
              <Link key={app.id} href={`/listings/${app.listing.id}`} className="glass rounded-2xl p-6 flex items-center justify-between card-hover block">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{app.listing.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-text-muted">
                    <span>{app.listing.location}</span>
                    <span>·</span>
                    <span className="text-accent font-semibold">{app.listing.price}€/mo</span>
                    <span>·</span>
                    <span>{new Date(app.createdAt).toLocaleDateString("de-DE")}</span>
                  </div>
                </div>
                <span className={`badge badge-${app.status === "pending" ? "pending" : app.status === "accepted" ? "accepted" : "rejected"}`}>
                  {app.status === "pending" ? "Ausstehend" : app.status === "accepted" ? "Akzeptiert" : "Abgelehnt"}
                </span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
