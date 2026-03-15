"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewListingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "", description: "", price: "", location: "",
    roomType: "WG-Zimmer", size: "", furnished: false, imageUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Fehler");
      else router.push(`/listings/${data.id}`);
    } catch { setError("Ein Fehler ist aufgetreten"); }
    finally { setLoading(false); }
  };

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Anmeldung erforderlich</h2>
        <p className="text-text-muted mb-6">Du musst angemeldet sein, um ein Inserat zu erstellen.</p>
        <Link href="/login" className="btn-primary">Anmelden</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-2">Inserat <span className="gradient-text">erstellen</span></h1>
        <p className="text-text-muted">Teile dein Zimmer oder deine Wohnung mit der Community.</p>
      </div>

      <div className="glass rounded-2xl p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        {error && <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-muted mb-2">Titel *</label>
            <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} className="input-field" placeholder="z.B. Helles WG-Zimmer in Berlin-Mitte" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-text-muted mb-2">Ort / Stadt *</label>
              <input id="location" name="location" type="text" value={formData.location} onChange={handleChange} className="input-field" placeholder="z.B. Berlin" required />
            </div>
            <div>
              <label htmlFor="roomType" className="block text-sm font-medium text-text-muted mb-2">Typ</label>
              <select id="roomType" name="roomType" value={formData.roomType} onChange={handleChange} className="input-field">
                <option value="WG-Zimmer">WG-Zimmer</option>
                <option value="Wohnung">Wohnung</option>
                <option value="Studio">Studio</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-text-muted mb-2">Preis (€/Monat) *</label>
              <input id="price" name="price" type="number" value={formData.price} onChange={handleChange} className="input-field" placeholder="500" required />
            </div>
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-text-muted mb-2">Größe (m²)</label>
              <input id="size" name="size" type="number" value={formData.size} onChange={handleChange} className="input-field" placeholder="20" />
            </div>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-text-muted mb-2">Bild-URL (optional)</label>
            <input id="imageUrl" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} className="input-field" placeholder="https://example.com/bild.jpg" />
          </div>

          <div className="flex items-center gap-3">
            <input id="furnished" name="furnished" type="checkbox" checked={formData.furnished} onChange={handleChange} className="w-5 h-5 rounded accent-primary" />
            <label htmlFor="furnished" className="text-sm font-medium cursor-pointer">Möbliert</label>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-muted mb-2">Beschreibung *</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="input-field min-h-[160px] resize-none" placeholder="Beschreibe das Zimmer / die Wohnung..." required />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base py-4 rounded-xl disabled:opacity-50">
            {loading ? "Wird erstellt..." : "Inserat veröffentlichen"}
          </button>
        </form>
      </div>
    </div>
  );
}
