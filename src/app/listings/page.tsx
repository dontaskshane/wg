"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  roomType: string;
  size: number | null;
  furnished: boolean;
  imageUrl: string | null;
  createdAt: string;
  landlord: { id: string; name: string };
  _count: { applications: number };
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [roomTypeFilter, setRoomTypeFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchListings = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (locationFilter) params.set("location", locationFilter);
    if (roomTypeFilter) params.set("roomType", roomTypeFilter);
    if (maxPrice) params.set("maxPrice", maxPrice);

    try {
      const res = await fetch(`/api/listings?${params.toString()}`);
      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-10 animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          Inserate <span className="gradient-text">durchsuchen</span>
        </h1>
        <p className="text-text-muted">Finde dein perfektes WG-Zimmer oder deine Traumwohnung.</p>
      </div>

      {/* Search & Filters */}
      <form onSubmit={handleSearch} className="glass rounded-2xl p-6 mb-10 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <input
              type="text"
              placeholder="Suche nach Titel oder Beschreibung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
            />
          </div>
          <input
            type="text"
            placeholder="Stadt / Ort"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="input-field"
          />
          <select
            value={roomTypeFilter}
            onChange={(e) => setRoomTypeFilter(e.target.value)}
            className="input-field"
          >
            <option value="">Alle Typen</option>
            <option value="WG-Zimmer">WG-Zimmer</option>
            <option value="Wohnung">Wohnung</option>
            <option value="Studio">Studio</option>
          </select>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Max. Preis €"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary px-5 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
              <div className="h-48 bg-surface-lighter" />
              <div className="p-6 space-y-4">
                <div className="h-4 bg-surface-lighter rounded w-3/4" />
                <div className="h-3 bg-surface-lighter rounded w-1/2" />
                <div className="h-3 bg-surface-lighter rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-surface-lighter flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Keine Inserate gefunden</h3>
          <p className="text-text-muted mb-6">Versuche andere Suchbegriffe oder erstelle selbst ein Inserat.</p>
          <Link href="/listings/new" className="btn-primary">
            Inserat erstellen
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-text-muted mb-6">{listings.length} Inserat{listings.length !== 1 ? "e" : ""} gefunden</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing, idx) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="glass rounded-2xl overflow-hidden card-hover group animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                  {listing.imageUrl ? (
                    <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                  )}
                  {/* Price Badge */}
                  <div className="absolute top-3 right-3 glass rounded-xl px-3 py-1.5">
                    <span className="text-lg font-bold text-accent">{listing.price}€</span>
                    <span className="text-xs text-text-muted">/Monat</span>
                  </div>
                  {/* Type Badge */}
                  <div className="absolute top-3 left-3 badge badge-pending">
                    {listing.roomType}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {listing.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-text-muted text-sm mb-3">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {listing.location}
                  </div>
                  <p className="text-text-muted text-sm line-clamp-2 mb-4">{listing.description}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-[10px] font-semibold">
                        {listing.landlord.name[0]}
                      </div>
                      <span className="text-xs text-text-muted">{listing.landlord.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-text-muted">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {listing._count.applications} Bewerbung{listing._count.applications !== 1 ? "en" : ""}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
