"use client";

import { useState, useEffect, useMemo } from "react";

interface Pastor {
  pastor_id: string;
  title?: string;
  pastor_name?: string;
  church_name?: string;
  denomination?: string;
  continent?: string;
  country?: string;
  city?: string;
  state_province?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
}

export default function Directory() {
  const [pastors, setPastors] = useState<Pastor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [continent, setContinent] = useState("");
  const [country, setCountry] = useState("");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const perPage = 25;

  useEffect(() => {
    fetch("/data/pastors.json")
      .then((r) => r.json())
      .then((data) => {
        setPastors(data);
        setLoading(false);
      });
  }, []);

  const continents = useMemo(
    () =>
      [...new Set(pastors.map((p) => p.continent).filter(Boolean))].sort(),
    [pastors]
  );

  const countries = useMemo(() => {
    const filtered = continent
      ? pastors.filter((p) => p.continent === continent)
      : pastors;
    return [...new Set(filtered.map((p) => p.country).filter(Boolean))].sort();
  }, [pastors, continent]);

  const filtered = useMemo(() => {
    let result = pastors;
    if (continent) result = result.filter((p) => p.continent === continent);
    if (country) result = result.filter((p) => p.country === country);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          (p.pastor_name || "").toLowerCase().includes(q) ||
          (p.church_name || "").toLowerCase().includes(q) ||
          (p.city || "").toLowerCase().includes(q) ||
          (p.denomination || "").toLowerCase().includes(q) ||
          (p.email || "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [pastors, continent, country, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    setPage(1);
  }, [search, continent, country]);

  const stats = useMemo(() => {
    const hasEmail = filtered.filter((p) => p.email).length;
    const hasPhone = filtered.filter((p) => p.phone).length;
    const hasWebsite = filtered.filter((p) => p.website).length;
    const uniqueCountries = new Set(filtered.map((p) => p.country)).size;
    return { hasEmail, hasPhone, hasWebsite, uniqueCountries };
  }, [filtered]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading 1,627 contacts...</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* Hero */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/30 to-slate-950" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Pastor Directory
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Browse our global network of {pastors.length.toLocaleString()}{" "}
            churches and pastors across {continents.length} continents.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-slate-900/50 border-y border-slate-800 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <span className="text-gray-400">
              Showing{" "}
              <span className="text-white font-semibold">
                {filtered.length.toLocaleString()}
              </span>{" "}
              contacts
            </span>
            <span className="text-gray-400">
              <span className="text-green-400 font-semibold">
                {stats.hasEmail}
              </span>{" "}
              with email
            </span>
            <span className="text-gray-400">
              <span className="text-blue-400 font-semibold">
                {stats.hasPhone}
              </span>{" "}
              with phone
            </span>
            <span className="text-gray-400">
              <span className="text-purple-400 font-semibold">
                {stats.hasWebsite}
              </span>{" "}
              with website
            </span>
            <span className="text-gray-400">
              <span className="text-orange-400 font-semibold">
                {stats.uniqueCountries}
              </span>{" "}
              countries
            </span>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-slate-950 sticky top-16 z-40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, church, city, denomination, or email..."
              className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={continent}
              onChange={(e) => {
                setContinent(e.target.value);
                setCountry("");
              }}
              className="bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Continents</option>
              {continents.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {(search || continent || country) && (
              <button
                onClick={() => {
                  setSearch("");
                  setContinent("");
                  setCountry("");
                }}
                className="bg-red-600/20 border border-red-500/30 text-red-400 rounded-lg px-4 py-2.5 text-sm hover:bg-red-600/30 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-3 px-3 text-gray-400 font-medium">
                    Pastor / Church
                  </th>
                  <th className="text-left py-3 px-3 text-gray-400 font-medium">
                    Denomination
                  </th>
                  <th className="text-left py-3 px-3 text-gray-400 font-medium">
                    Location
                  </th>
                  <th className="text-left py-3 px-3 text-gray-400 font-medium">
                    Contact
                  </th>
                  <th className="text-left py-3 px-3 text-gray-400 font-medium">
                    Links
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((p) => (
                  <tr
                    key={p.pastor_id}
                    className="border-b border-slate-800/50 hover:bg-slate-900/50 transition-colors"
                  >
                    <td className="py-3 px-3">
                      {p.pastor_name && (
                        <div className="text-white font-medium">
                          {p.title ? `${p.title} ` : ""}
                          {p.pastor_name}
                        </div>
                      )}
                      {p.church_name && (
                        <div className="text-gray-400 text-xs mt-0.5">
                          {p.church_name}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-gray-400">
                      {p.denomination || "—"}
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-white">
                        {p.city}
                        {p.city && p.country ? ", " : ""}
                        {p.country}
                      </div>
                      {p.continent && (
                        <div className="text-gray-500 text-xs">
                          {p.continent}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {p.email && (
                        <a
                          href={`mailto:${p.email}`}
                          className="text-green-400 hover:text-green-300 text-xs block truncate max-w-48"
                        >
                          {p.email}
                        </a>
                      )}
                      {p.phone && (
                        <div className="text-blue-400 text-xs">{p.phone}</div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-2">
                        {p.website && (
                          <a
                            href={
                              p.website.startsWith("http")
                                ? p.website
                                : `https://${p.website}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-slate-800 px-2 py-1 rounded text-gray-300 hover:text-white transition-colors"
                          >
                            Web
                          </a>
                        )}
                        {p.facebook && (
                          <a
                            href={
                              p.facebook.startsWith("http")
                                ? p.facebook
                                : `https://facebook.com/${p.facebook}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-slate-800 px-2 py-1 rounded text-gray-300 hover:text-white transition-colors"
                          >
                            FB
                          </a>
                        )}
                        {p.instagram && (
                          <a
                            href={
                              p.instagram.startsWith("http")
                                ? p.instagram
                                : `https://instagram.com/${p.instagram}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-slate-800 px-2 py-1 rounded text-gray-300 hover:text-white transition-colors"
                          >
                            IG
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {pageData.map((p) => (
              <div
                key={p.pastor_id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4"
              >
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    setExpandedId(
                      expandedId === p.pastor_id ? null : p.pastor_id
                    )
                  }
                >
                  <div className="flex justify-between items-start">
                    <div>
                      {p.pastor_name && (
                        <div className="text-white font-medium">
                          {p.title ? `${p.title} ` : ""}
                          {p.pastor_name}
                        </div>
                      )}
                      {p.church_name && (
                        <div className="text-gray-400 text-sm">
                          {p.church_name}
                        </div>
                      )}
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-white">
                        {p.city}
                        {p.city && p.country ? ", " : ""}
                        {p.country}
                      </div>
                      {p.continent && (
                        <div className="text-gray-500 text-xs">
                          {p.continent}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {expandedId === p.pastor_id && (
                  <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 text-sm">
                    {p.denomination && (
                      <div className="text-gray-400">
                        <span className="text-gray-500">Denomination:</span>{" "}
                        {p.denomination}
                      </div>
                    )}
                    {p.email && (
                      <div>
                        <a
                          href={`mailto:${p.email}`}
                          className="text-green-400"
                        >
                          {p.email}
                        </a>
                      </div>
                    )}
                    {p.phone && (
                      <div className="text-blue-400">{p.phone}</div>
                    )}
                    <div className="flex gap-2 pt-1">
                      {p.website && (
                        <a
                          href={
                            p.website.startsWith("http")
                              ? p.website
                              : `https://${p.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-slate-800 px-3 py-1.5 rounded text-gray-300"
                        >
                          Website
                        </a>
                      )}
                      {p.facebook && (
                        <a
                          href={
                            p.facebook.startsWith("http")
                              ? p.facebook
                              : `https://facebook.com/${p.facebook}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-slate-800 px-3 py-1.5 rounded text-gray-300"
                        >
                          Facebook
                        </a>
                      )}
                      {p.instagram && (
                        <a
                          href={
                            p.instagram.startsWith("http")
                              ? p.instagram
                              : `https://instagram.com/${p.instagram}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-slate-800 px-3 py-1.5 rounded text-gray-300"
                        >
                          Instagram
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-800">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-30 hover:bg-slate-800 transition-colors"
              >
                Previous
              </button>
              <div className="text-gray-400 text-sm">
                Page {page} of {totalPages} &middot;{" "}
                {filtered.length.toLocaleString()} results
              </div>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-30 hover:bg-slate-800 transition-colors"
              >
                Next
              </button>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-gray-400 text-lg">
                No contacts found matching your filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setContinent("");
                  setCountry("");
                }}
                className="mt-4 text-blue-400 hover:text-blue-300 text-sm"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
