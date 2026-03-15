"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Application {
  id: string;
  message: string;
  status: string;
  createdAt: string;
  applicant: { id: string; name: string; email: string };
}

interface ListingDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  roomType: string;
  size: number | null;
  furnished: boolean;
  imageUrl: string | null;
  active: boolean;
  createdAt: string;
  landlordId: string;
  landlord: { id: string; name: string; email: string; bio: string | null; createdAt: string };
  applications: Application[];
  _count: { applications: number };
}

export default function ListingDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listings/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setListing(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchListing();
  }, [params.id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplyError("");
    setApplying(true);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, listingId: params.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApplyError(data.error);
      } else {
        setApplySuccess(true);
        setMessage("");
      }
    } catch {
      setApplyError("Fehler beim Bewerben");
    } finally {
      setApplying(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, status: string) => {
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setListing((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            applications: prev.applications.map((app) =>
              app.id === applicationId ? { ...app, status } : app
            ),
          };
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Möchtest du dieses Inserat wirklich löschen?")) return;

    try {
      const res = await fetch(`/api/listings/${params.id}`, { method: "DELETE" });
      if (res.ok) router.push("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-64 rounded-2xl bg-surface-lighter" />
          <div className="h-8 bg-surface-lighter rounded w-2/3" />
          <div className="h-4 bg-surface-lighter rounded w-1/3" />
          <div className="h-32 bg-surface-lighter rounded" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Inserat nicht gefunden</h2>
        <Link href="/listings" className="btn-primary">Zurück zu Inseraten</Link>
      </div>
    );
  }

  const isOwner = session?.user?.id === listing.landlordId;
  const hasApplied = listing.applications.some(
    (app) => app.applicant.id === session?.user?.id
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back Link */}
      <Link href="/listings" className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Zurück
      </Link>

      <div className="grid lg:grid-cols-3 gap-8 animate-fade-in-up">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
            {listing.imageUrl ? (
              <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-24 h-24 text-primary/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            )}
            <div className="absolute top-4 left-4 badge badge-pending">{listing.roomType}</div>
          </div>

          {/* Title & Location */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
            <div className="flex items-center gap-4 text-text-muted">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {listing.location}
              </div>
              <span>·</span>
              <span>{new Date(listing.createdAt).toLocaleDateString("de-DE")}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="glass rounded-2xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-xs text-text-muted uppercase tracking-wide">Preis</span>
              <p className="text-xl font-bold text-accent mt-1">{listing.price}€<span className="text-sm text-text-muted">/mo</span></p>
            </div>
            <div>
              <span className="text-xs text-text-muted uppercase tracking-wide">Typ</span>
              <p className="font-semibold mt-1">{listing.roomType}</p>
            </div>
            <div>
              <span className="text-xs text-text-muted uppercase tracking-wide">Größe</span>
              <p className="font-semibold mt-1">{listing.size ? `${listing.size} m²` : "k.A."}</p>
            </div>
            <div>
              <span className="text-xs text-text-muted uppercase tracking-wide">Möbliert</span>
              <p className="font-semibold mt-1">{listing.furnished ? "Ja ✓" : "Nein"}</p>
            </div>
          </div>

          {/* Description */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-3">Beschreibung</h2>
            <p className="text-text-muted leading-relaxed whitespace-pre-line">{listing.description}</p>
          </div>

          {/* Owner: Applications */}
          {isOwner && listing.applications.length > 0 && (
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">
                Bewerbungen ({listing.applications.length})
              </h2>
              <div className="space-y-4">
                {listing.applications.map((app) => (
                  <div key={app.id} className="p-4 rounded-xl bg-surface-lighter border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-semibold">
                          {app.applicant.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{app.applicant.name}</p>
                          <p className="text-xs text-text-muted">{app.applicant.email}</p>
                        </div>
                      </div>
                      <span className={`badge badge-${app.status === "pending" ? "pending" : app.status === "accepted" ? "accepted" : "rejected"}`}>
                        {app.status === "pending" ? "Ausstehend" : app.status === "accepted" ? "Akzeptiert" : "Abgelehnt"}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted mb-3">{app.message}</p>
                    {app.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(app.id, "accepted")}
                          className="btn-primary text-xs py-2 px-4"
                        >
                          Akzeptieren
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app.id, "rejected")}
                          className="btn-danger text-xs py-2 px-4"
                        >
                          Ablehnen
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Landlord Card */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-semibold uppercase text-text-muted tracking-wide mb-4">Anbieter</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-lg font-bold">
                {listing.landlord.name[0]}
              </div>
              <div>
                <p className="font-semibold">{listing.landlord.name}</p>
                <p className="text-xs text-text-muted">
                  Mitglied seit {new Date(listing.landlord.createdAt).toLocaleDateString("de-DE", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
            {listing.landlord.bio && (
              <p className="text-sm text-text-muted">{listing.landlord.bio}</p>
            )}
          </div>

          {/* Apply / Owner Actions */}
          {isOwner ? (
            <div className="glass rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-semibold uppercase text-text-muted tracking-wide mb-2">Aktionen</h3>
              <button onClick={handleDelete} className="btn-danger w-full justify-center">
                Inserat löschen
              </button>
            </div>
          ) : (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-semibold uppercase text-text-muted tracking-wide mb-4">Bewerben</h3>

              {!session ? (
                <div className="text-center">
                  <p className="text-sm text-text-muted mb-4">Melde dich an, um dich zu bewerben.</p>
                  <Link href="/login" className="btn-primary w-full justify-center">
                    Anmelden
                  </Link>
                </div>
              ) : hasApplied || applySuccess ? (
                <div className="text-center p-4 rounded-xl bg-success/10 border border-success/20">
                  <svg className="w-8 h-8 text-success mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm text-success font-medium">Bewerbung gesendet!</p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  {applyError && (
                    <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">
                      {applyError}
                    </div>
                  )}
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="input-field min-h-[120px] resize-none"
                    placeholder="Schreibe eine persönliche Nachricht..."
                    required
                  />
                  <button
                    type="submit"
                    disabled={applying}
                    className="btn-primary w-full justify-center disabled:opacity-50"
                  >
                    {applying ? "Wird gesendet..." : "Bewerbung absenden"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Bewerbungen</span>
              <span className="font-semibold">{listing._count.applications}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
